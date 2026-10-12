// Freemium rules and Mercado Pago payments.
// Free plan: FREE_PER_DAY practice sessions per day without an account, FREE_ACCOUNT_PER_DAY with a free account
// (the reason to create one when the guest practices run out). Unlimited access: a one-time payment (Checkout Pro)
// that never expires. Monthly subscriptions (preapproval API) from before still count until they end.
// Guests can pay too, before having an account: the payment's external_reference is then a guest reference
// (g-<32 hex>, never a valid username), its access is kept in guestpaid:<ref>, and creating an account with that
// reference (the "claim", which only the payer's browser and the return address know) moves it to paid:<name>.
const { redis, HttpError } = require('./_lib');
const { reportPurchase } = require('./_meta');
const posthog = require('./_posthog');

const DAY_MS = 86400e3, GRACE_MS = 3 * DAY_MS, FREE_PER_DAY = 5, FREE_ACCOUNT_PER_DAY = 10;
const GUEST_RE = /^g-[a-f0-9]{32}$/, NAME_RE = /^[a-z0-9_.-]{3,20}$/;
const isGuestRef = ref => GUEST_RE.test(String(ref || ''));
const newGuestRef = () => 'g-' + require('node:crypto').randomBytes(16).toString('hex');
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
const readGuestPaid = async ref => JSON.parse(await redis('GET', 'guestpaid:' + ref) || 'null');
const readGuest = async ref => JSON.parse(await redis('GET', 'guest:' + ref) || 'null'); // { ph, created }: saved when the guest went to pay

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

// Stores an approved one-time payment: from then on, the account (or the guest's reference) is unlimited for good.
// The first time it is seen (webhook or coming back from paying, whichever is first) it is reported to Meta and PostHog.
// A refunded or charged back payment takes the access away and is reported to PostHog once, as negative revenue.
async function storePayment(payment) {
  const ref = String(payment.external_reference || ''), guest = isGuestRef(ref);
  if (payment.metadata?.templo !== 'ilimitado' || (!guest && !NAME_RE.test(ref))) return null;
  const amount = Number(payment.transaction_amount) || 0, currency = payment.currency_id || 'ARS';
  // A guest's payment counts for the account that claimed it, if any: that is whose access a refund takes away.
  const owner = guest ? await redis('GET', 'guestclaim:' + ref) : ref;
  const distinct = guest ? owner || (await readGuest(ref))?.ph || ref : ref; // PostHog: the person who paid, as the page knew them
  if (payment.status === 'refunded' || payment.status === 'charged_back') {
    if (guest) { const gp = await readGuestPaid(ref); if (gp && String(gp.id) === String(payment.id)) await redis('DEL', 'guestpaid:' + ref); }
    if (owner) { const paid = await readPaid(owner); if (paid && String(paid.id) === String(payment.id)) await redis('DEL', 'paid:' + owner); }
    if (await redis('SET', 'refund:' + payment.id, String(Date.now()), 'NX') === 'OK')
      await posthog.capture(distinct, 'payment_refunded', { value: -amount, currency, reason: payment.status, provider: 'mercadopago', payment_id: String(payment.id), guest });
    return null;
  }
  if (payment.status !== 'approved') return null;
  const paid = { id: payment.id, amount, currency, date: Date.parse(payment.date_approved || '') || Date.now() };
  let first;
  if (guest) {
    // The payer's email, only to suggest it when that guest creates the account (never sent to analytics).
    const email = String(payment.payer?.email || '').trim().toLowerCase().slice(0, 120);
    const record = { ...paid, ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email } : {}) };
    first = await redis('SET', 'guestpaid:' + ref, JSON.stringify(record), 'NX') === 'OK';
    if (!first) await redis('SET', 'guestpaid:' + ref, JSON.stringify(record));
    if (owner) await redis('SET', 'paid:' + owner, JSON.stringify(paid));
  } else {
    first = await redis('SET', 'paid:' + ref, JSON.stringify(paid), 'NX') === 'OK';
    if (!first) await redis('SET', 'paid:' + ref, JSON.stringify(paid));
  }
  if (first) await Promise.all([reportPurchase(ref, payment),
    posthog.capture(distinct, 'payment_succeeded', { value: amount, currency, provider: 'mercadopago', payment_id: String(payment.id), guest, ...money(payment) })]);
  return paid;
}

// Looks for an approved payment of this account or guest reference (coming back from Mercado Pago, or a webhook that never arrived).
async function findPayment(ref) {
  if (!settings().enabled) return null;
  try {
    const found = await mp('/v1/payments/search?external_reference=' + encodeURIComponent(ref) + '&status=approved&sort=date_created&criteria=desc');
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

// A guest's paid access: { premium, paid, email, claimedBy }. Asks Mercado Pago when told to (coming back from paying).
async function guestStatus(ref, { forceRefresh = false } = {}) {
  if (!isGuestRef(ref)) return { premium: false, paid: null };
  let paid = await readGuestPaid(ref);
  if (!paid && forceRefresh) { await findPayment(ref); paid = await readGuestPaid(ref); }
  const claimedBy = paid ? await redis('GET', 'guestclaim:' + ref) : null;
  return { premium: Boolean(paid), paid, email: paid?.email || null, claimedBy };
}

// Gives a guest's paid access to an account. Once: a reference claimed by one account can't be claimed by another.
async function claimGuest(ref, name) {
  const { paid } = await guestStatus(ref, { forceRefresh: true });
  if (!paid || !NAME_RE.test(name)) return null;
  const set = await redis('SET', 'guestclaim:' + ref, name, 'NX');
  if (set !== 'OK' && await redis('GET', 'guestclaim:' + ref) !== name) return null;
  const { email, ...plain } = paid; // the email stays with the guest record; the account keeps what any payment keeps
  if (!await readPaid(name)) await redis('SET', 'paid:' + name, JSON.stringify(plain));
  return plain;
}

// The pricing experiment "precio-oferta-24h" ended on 2026-10-11 with no winner: everyone pays the base price again.
// Leftover offer:<name> keys in Redis are no longer read. The one exception is the follow-up email's offer
// (api/cron.js): promo:<name> = { amount, until }, a lower price for that account until a date, shown and charged as is.
async function priceFor(name) {
  const base = settings().price;
  const promo = NAME_RE.test(name || '') && JSON.parse(await redis('GET', 'promo:' + name) || 'null');
  if (promo && promo.until > Date.now() && promo.amount > 0 && promo.amount < base) return { amount: promo.amount, offer: { amount: promo.amount, regular: base, until: promo.until } };
  return { amount: base, offer: null };
}
const priceLabel = amount => '$ ' + Number(amount).toLocaleString('es-AR') + ' · pago único';

async function isPremium(name) {
  return !settings().enabled || (await status(name)).premium;
}

module.exports = { FREE_PER_DAY, FREE_ACCOUNT_PER_DAY, settings, today, playsKey, mp, storeSubscription, storePayment, status, isPremium, priceFor, priceLabel,
  isGuestRef, newGuestRef, guestStatus, claimGuest };
