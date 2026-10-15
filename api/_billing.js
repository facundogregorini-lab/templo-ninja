// Freemium rules and Mercado Pago payments.
// Free plan: FREE_PER_DAY practice sessions per day without an account, FREE_ACCOUNT_PER_DAY with a free account
// (the reason to create one when the guest practices run out). The course also has two gates, kept by the page (app.js,
// "Belt gates"): guests take the first group of lessons (white belt), a free account the second (yellow belt), and the
// rest of the path is part of the unlimited access. Unlimited access: a one-time payment ("aporte al templo",
// Checkout Pro) that never expires. Monthly subscriptions (preapproval API) from before still count until they end.
const { redis, HttpError } = require('./_lib');
const { reportPurchase } = require('./_meta');
const posthog = require('./_posthog');

const DAY_MS = 86400e3, GRACE_MS = 3 * DAY_MS, FREE_PER_DAY = 6, FREE_ACCOUNT_PER_DAY = 13;
const env = name => (process.env[name] || '').trim();

function settings() {
  const token = env('MP_ACCESS_TOKEN'), price = Number(env('MP_PRICE'));
  return {
    enabled: Boolean(token && price > 0),
    token, price,
    currency: env('MP_CURRENCY') || 'ARS',
    label: env('PRICE_LABEL') || (price > 0 ? '$ ' + price.toLocaleString('es-AR') + ' · pago único' : ''),
    api: env('MP_API_BASE') || 'https://api.mercadopago.com',
    freeUsers: env('TECLADO_PREMIUM_USERS').toLowerCase().split(',').map(s => s.trim()).filter(Boolean),
  };
}

// Calendar day in Argentina (UTC-3, no daylight saving).
const today = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const playsKey = name => 'plays:' + name + ':' + today();

async function mp(path, options = {}) {
  const s = settings();
  const response = await fetch(s.api + path, {
    ...options,
    headers: { Authorization: 'Bearer ' + s.token, 'Content-Type': 'application/json', ...options.headers },
  }).catch(error => {
    console.error('Mercado Pago unreachable', error.message);
    throw new HttpError(502, 'No pudimos conectarnos con Mercado Pago. Probá de nuevo en un rato.');
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Mercado Pago', response.status, JSON.stringify(json));
    throw Object.assign(new HttpError(502, 'Mercado Pago no respondió bien: ' + (json.message || response.status)), { mpStatus: response.status });
  }
  return json;
}

const readSub = async name => JSON.parse(await redis('GET', 'sub:' + name) || 'null');
const readPaid = async name => JSON.parse(await redis('GET', 'paid:' + name) || 'null');

// What Mercado Pago keeps (its fee) and what reaches the account: for the contribution margin, not only the price.
function money(payment) {
  const fee = (payment.fee_details || []).reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const net = payment.transaction_details?.net_received_amount;
  return {
    ...(net != null ? { net_amount: Number(net) } : {}),
    ...(payment.fee_details ? { fee: Math.round(fee * 100) / 100 } : {}),
    ...(payment.payment_method_id ? { payment_method: String(payment.payment_method_id) } : {}),
    ...(payment.payment_type_id ? { payment_type: String(payment.payment_type_id) } : {}),
    ...(payment.installments ? { installments: Number(payment.installments) } : {}),
  };
}

// Stores an approved one-time payment: from then on, the account is unlimited for good.
// The first time it is seen (webhook or coming back from paying, whichever is first) it is reported to Meta and PostHog.
// A refunded or charged back payment takes the access away and is reported to PostHog once, as negative revenue.
async function storePayment(payment) {
  const name = String(payment.external_reference || '');
  if (payment.metadata?.templo !== 'ilimitado' || !/^[a-z0-9_.-]{3,20}$/.test(name)) return null;
  const amount = Number(payment.transaction_amount) || 0, currency = payment.currency_id || 'ARS';
  if (payment.status === 'refunded' || payment.status === 'charged_back') {
    const paid = await readPaid(name);
    if (paid && String(paid.id) === String(payment.id)) await redis('DEL', 'paid:' + name);
    if (await redis('SET', 'refund:' + payment.id, String(Date.now()), 'NX') === 'OK')
      await posthog.capture(name, 'payment_refunded', { value: -amount, currency, reason: payment.status, provider: 'mercadopago', payment_id: String(payment.id) });
    return null;
  }
  if (payment.status !== 'approved') return null;
  const paid = { id: payment.id, amount, currency, date: Date.parse(payment.date_approved || '') || Date.now() };
  const first = await redis('SET', 'paid:' + name, JSON.stringify(paid), 'NX') === 'OK';
  if (!first) await redis('SET', 'paid:' + name, JSON.stringify(paid));
  if (first) await Promise.all([reportPurchase(name, payment),
    posthog.capture(name, 'payment_succeeded', { value: amount, currency, provider: 'mercadopago', payment_id: String(payment.id), ...money(payment) })]);
  return paid;
}

// Looks for an approved payment of this account (coming back from Mercado Pago, or a webhook that never arrived).
async function findPayment(name) {
  if (!settings().enabled) return null;
  try {
    const found = await mp('/v1/payments/search?external_reference=' + encodeURIComponent(name) + '&status=approved&sort=date_created&criteria=desc');
    const approved = (found.results || []).find(p => p.status === 'approved' && p.metadata?.templo === 'ilimitado');
    return approved ? await storePayment(approved) : null;
  } catch (error) {
    console.error('Could not look for payments', error.message);
    return null;
  }
}

// Stores what Mercado Pago says about a subscription. Access lasts until the next charge (+3 days of grace).
async function storeSubscription(pre) {
  const name = String(pre.external_reference || '');
  if (!/^[a-z0-9_.-]{3,20}$/.test(name)) return null;
  const old = await readSub(name);
  let paidUntil = old?.id === pre.id ? old.paidUntil || 0 : 0;
  if (pre.status === 'authorized') {
    const next = Date.parse(pre.next_payment_date || '') || Date.now() + 31 * DAY_MS;
    paidUntil = Math.max(paidUntil, next + GRACE_MS);
  }
  // An older authorized subscription keeps priority over a new pending attempt.
  if (old && old.id !== pre.id && old.paidUntil > Date.now() && pre.status !== 'authorized') return old;
  const sub = { id: pre.id, status: pre.status, paidUntil, updated: Date.now() };
  await redis('SET', 'sub:' + name, JSON.stringify(sub));
  return sub;
}

async function refresh(name, sub) {
  if (!settings().enabled) return sub;
  try {
    if (sub?.id) return await storeSubscription(await mp('/preapproval/' + encodeURIComponent(sub.id)));
    const found = await mp('/preapproval/search?external_reference=' + encodeURIComponent(name) + '&sort=date_created:desc');
    const best = (found.results || []).find(p => p.status === 'authorized') || found.results?.[0];
    return best ? await storeSubscription(best) : sub;
  } catch (error) {
    console.error('Could not refresh subscription', error.message);
    return sub;
  }
}

// { premium, paid, sub }. Refreshes from Mercado Pago when asked, or when a stored subscription is pending or about to lapse.
async function status(name, { forceRefresh = false } = {}) {
  const s = settings();
  if (s.freeUsers.includes(name)) return { premium: true, sub: null, gift: true };
  const paid = await readPaid(name) || (forceRefresh ? await findPayment(name) : null);
  if (paid) return { premium: true, paid, sub: null };
  let sub = await readSub(name);
  const stale = sub && Date.now() - sub.updated > 10 * 60e3;
  const unsure = sub && (sub.status === 'pending' || (sub.status === 'authorized' && sub.paidUntil < Date.now() + DAY_MS));
  if (forceRefresh || (stale && unsure)) sub = await refresh(name, sub);
  return { premium: Boolean(sub && sub.paidUntil > Date.now()), sub };
}

// The pricing experiment "precio-oferta-24h" ended on 2026-10-11 with no winner: everyone pays the base price again.
// Leftover offer:<name> keys in Redis are no longer read.
async function priceFor() {
  return { amount: settings().price, offer: null };
}
const priceLabel = amount => '$ ' + Number(amount).toLocaleString('es-AR') + ' · pago único';

async function isPremium(name) {
  return !settings().enabled || (await status(name)).premium;
}

module.exports = { FREE_PER_DAY, FREE_ACCOUNT_PER_DAY, settings, today, playsKey, mp, storeSubscription, storePayment, status, isPremium, priceFor, priceLabel };
