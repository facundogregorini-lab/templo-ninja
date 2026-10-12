// Meta Pixel settings and the Conversions API. The pixel id is public (it goes in the page anyway), so the
// "Templo Ninja Web" pixel is the default; META_PIXEL_ID changes it, and META_PIXEL_ID=off turns it off.
// The events the campaigns optimize for (ViewContent, CompleteRegistration, InitiateCheckout, Purchase) are also sent
// from the server, with the same event id as the browser so Meta counts each one once, because ad blockers and
// Safari often stop the pixel right when it matters. META_TEST_EVENT_CODE sends them to "Test events" instead.
const crypto = require('node:crypto');
const { redis } = require('./_lib');
const env = name => (process.env[name] || '').trim();
const DEFAULT_PIXEL = '2167285730522630';
const CONTEXT_DAYS = 30;

function metaSettings() {
  const id = env('META_PIXEL_ID') || DEFAULT_PIXEL, pixel = /^\d{6,20}$/.test(id) ? id : '';
  return { pixel, token: pixel && env('META_CAPI_TOKEN'), test: env('META_TEST_EVENT_CODE'), graph: env('META_GRAPH_BASE') || 'https://graph.facebook.com/' + (env('META_GRAPH_VERSION') || 'v23.0') };
}

const siteUrl = () => (env('APP_URL') || 'https://www.temploninja.com').replace(/\/$/, '');
const sha256 = s => crypto.createHash('sha256').update(String(s).trim().toLowerCase()).digest('hex');
const purchaseId = paymentId => 'pay_' + paymentId; // the same id the page uses for its Purchase event
const clean = (v, re) => (typeof v === 'string' && re.test(v) ? v : undefined);
const cleanEventId = id => clean(id, /^[\w.-]{8,64}$/);

// What the browser knows that the server needs to match the person: Meta's cookies (_fbp, _fbc), the anonymous
// id of this browser (the pixel's external_id) and the page. The IP and the browser come from the request itself.
function clientContext(req, track = {}) {
  const t = track && typeof track === 'object' ? track : {};
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
  let url;
  try { const u = new URL(String(t.url || '')); if (u.host === new URL(siteUrl()).host || u.host === req.headers.host) url = u.origin + u.pathname; } catch {}
  return {
    ip: String(ip).replace(/^::ffff:/, '').slice(0, 45) || undefined,
    ua: String(req.headers['user-agent'] || '').slice(0, 400) || undefined,
    fbp: clean(t.fbp, /^fb\.\d\.\d+\.\d+$/),
    fbc: clean(t.fbc, /^fb\.\d\.\d+\.[\w.-]{1,500}$/),
    anon: clean(t.anon, /^[\w-]{8,64}$/),
    url,
  };
}

// The last context of each account, for the events the server sends later on its own (a payment that arrives by webhook).
async function saveContext(name, ctx) {
  const keep = Object.fromEntries(Object.entries(ctx).filter(([, v]) => v));
  if (name && Object.keys(keep).length) await redis('SET', 'meta:' + name, JSON.stringify(keep), 'EX', CONTEXT_DAYS * 86400).catch(() => {});
}
const readContext = async name => JSON.parse(await redis('GET', 'meta:' + name).catch(() => null) || 'null') || {};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function userData(ctx, name, email) {
  const ids = [ctx.anon, name].filter(Boolean).map(sha256); // the pixel's external_id is the browser's anonymous id
  const em = typeof email === 'string' && EMAIL_RE.test(email.trim()) ? sha256(email) : null; // hashed, never in plain text
  return {
    ...(ids.length ? { external_id: ids } : {}),
    ...(em ? { em: [em] } : {}),
    ...(ctx.ip ? { client_ip_address: ctx.ip } : {}),
    ...(ctx.ua ? { client_user_agent: ctx.ua } : {}),
    ...(ctx.fbp ? { fbp: ctx.fbp } : {}),
    ...(ctx.fbc ? { fbc: ctx.fbc } : {}),
  };
}

// Sends one event to the Conversions API. Never throws: a failed report must not break the app or a payment.
async function sendEvent({ event, id, time, ctx = {}, name, email, custom = {} }) {
  const s = metaSettings();
  if (!s.token || !cleanEventId(id)) return false;
  const data = [{
    event_name: event, event_id: id, event_time: Math.floor((time || Date.now()) / 1000), action_source: 'website',
    event_source_url: ctx.url || siteUrl() + '/', user_data: userData(ctx, name, email), custom_data: custom,
  }];
  try {
    const response = await fetch(`${s.graph}/${s.pixel}/events?access_token=${encodeURIComponent(s.token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data, ...(s.test ? { test_event_code: s.test } : {}) }),
    });
    if (!response.ok) console.error('Meta Conversions API', event, response.status, await response.text().catch(() => ''));
    return response.ok;
  } catch (error) {
    console.error('Meta Conversions API unreachable', error.message);
    return false;
  }
}

// The Purchase of a one-time payment. It may come from the webhook, without the browser: the context is the one
// saved when the person went to pay (and the cookies that travel in the payment's metadata, from before).
// "name" is the account, or the guest reference when the person paid before having one. The payer's email (hashed)
// helps Meta match the purchase to the ad.
async function reportPurchase(name, payment) {
  const meta = payment.metadata || {};
  const ctx = { ...await readContext(name) };
  for (const k of ['fbp', 'fbc', 'ua']) if (!ctx[k] && meta[k]) ctx[k] = String(meta[k]);
  delete ctx.url; // the purchase happens back on the home page, whatever page the checkout started from
  return sendEvent({
    event: 'Purchase', id: purchaseId(payment.id), name, ctx, email: payment.payer?.email,
    time: Date.parse(payment.date_approved || '') || Date.now(),
    custom: { currency: payment.currency_id || 'ARS', value: Number(payment.transaction_amount) || 0, content_name: 'Templo Ninja · acceso ilimitado' },
  });
}

module.exports = { metaSettings, siteUrl, clientContext, saveContext, sendEvent, reportPurchase, purchaseId, cleanEventId, sha256 };
