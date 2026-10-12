// Daily follow-up emails (Vercel Cron, vercel.json), for the accounts with an email that stopped coming back:
//   - EMAIL_REMIND_DAYS (3) days without coming: a reminder, with a link that signs them in.
//   - EMAIL_OFFER_DAYS (7) days without coming: unlimited access at OFFER_PRICE (base −20%, rounded) for OFFER_HOURS (48).
// Each email goes once per account, never to unlimited accounts or to whoever unsubscribed, and at most
// EMAIL_MAX_PER_RUN (80) per day (Resend's free plan sends 100 a day; the welcome and sign-in emails need room too).
// Vercel calls it with "Authorization: Bearer <CRON_SECRET>"; without that secret configured it does nothing.
// GET ?dry=1 (same secret) says who would get what, without sending.
const { redis, HttpError, handler } = require('./_lib');
const { settings, status } = require('./_billing');
const { emailOn, sendFollowUp, unsubscribed } = require('./_email');
const env = name => (process.env[name] || '').trim();
const DAY = 86400e3;

function cronSettings() {
  const base = settings().price, n = (k, d) => Number(env(k)) > 0 ? Number(env(k)) : d;
  return {
    secret: env('CRON_SECRET'),
    remindDays: n('EMAIL_REMIND_DAYS', 3), offerDays: n('EMAIL_OFFER_DAYS', 7),
    offerPrice: n('OFFER_PRICE', Math.round(base * 0.8 / 100) * 100), offerHours: n('OFFER_HOURS', 48),
    maxPerRun: n('EMAIL_MAX_PER_RUN', 80),
  };
}

async function usernames() {
  const names = [];
  let cursor = '0';
  do {
    const [next, keys] = await redis('SCAN', cursor, 'MATCH', 'user:*', 'COUNT', 1000);
    for (const key of keys || []) names.push(String(key).slice(5));
    cursor = String(next);
  } while (cursor !== '0');
  return names.sort();
}
const mget = async keys => keys.length ? await redis('MGET', ...keys) || [] : [];
const parse = v => { try { return JSON.parse(v); } catch { return null; } };

// Who gets which email today: [{ name, email, step, idle }].
async function due(now = Date.now()) {
  const c = cronSettings(), names = await usernames();
  const [users, seen, paid, sent] = await Promise.all([
    mget(names.map(n => 'user:' + n)), mget(names.map(n => 'seen:' + n)), mget(names.map(n => 'paid:' + n)), mget(names.map(n => 'mailsent:' + n)),
  ]);
  const out = [];
  for (const [i, name] of names.entries()) {
    const user = parse(users[i]), steps = parse(sent[i]) || {};
    if (!user?.email || paid[i]) continue;
    const last = Math.max(Number(seen[i]) || 0, user.created || 0), idle = (now - last) / DAY;
    const step = idle >= c.offerDays && !steps.oferta ? 'oferta' : idle >= c.remindDays && !steps.recordatorio && !steps.oferta ? 'recordatorio' : null;
    if (!step) continue;
    if (await unsubscribed(name) || (await status(name)).premium) continue; // courtesy accounts and old subscriptions too
    out.push({ name, email: user.email, step, idle: Math.floor(idle) });
  }
  return out;
}

module.exports = handler(async req => {
  const c = cronSettings();
  if (!c.secret || req.headers.authorization !== 'Bearer ' + c.secret) throw new HttpError(401, 'No autorizado.');
  if (!emailOn() || !settings().enabled) return { ok: true, sent: 0, reason: 'emails o pagos apagados' };
  const query = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  const list = await due();
  if (query.dry) return { ok: true, due: list.map(({ email, ...rest }) => rest) }; // never the addresses
  let sentCount = 0;
  for (const { name, email, step } of list.slice(0, c.maxPerRun)) {
    let offer = null;
    if (step === 'oferta') {
      offer = { amount: c.offerPrice, regular: settings().price, until: Date.now() + c.offerHours * 3600e3 };
      if (!(offer.amount < offer.regular)) continue; // a misconfigured price never raises it
      await redis('SET', 'promo:' + name, JSON.stringify({ amount: offer.amount, until: offer.until }), 'EX', Math.ceil(c.offerHours * 3600) + 86400);
    }
    const ok = await sendFollowUp(name, email, step, offer);
    if (!ok) { if (offer) await redis('DEL', 'promo:' + name); continue; }
    const steps = parse(await redis('GET', 'mailsent:' + name)) || {};
    await redis('SET', 'mailsent:' + name, JSON.stringify({ ...steps, [step]: Date.now() }));
    sentCount++;
  }
  return { ok: true, sent: sentCount, due: list.length };
});

module.exports.due = due;
