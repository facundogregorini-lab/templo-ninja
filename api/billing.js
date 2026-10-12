// GET: plan info (public part + the user's plan when logged in)
// POST { action: 'play' }: counts one of today's free practices (FREE_ACCOUNT_PER_DAY for accounts) · { action: 'buy' }: Mercado Pago checkout for the
// one-time payment, with or without an account (a guest gets a claim reference) · { action: 'sync' }: asks Mercado Pago again (coming back from paying)
// · { action: 'guest', claim }: a guest's paid access, by the claim reference that only that guest knows
// · { action: 'claim', claim } (with a session): moves that paid access to the account
const { redis, HttpError, requireUser, bearer, body, handler, touch } = require('./_lib');
const { FREE_PER_DAY, FREE_ACCOUNT_PER_DAY, settings, playsKey, mp, status, priceFor, priceLabel, isGuestRef, newGuestRef, guestStatus, claimGuest } = require('./_billing');
const { metaSettings, purchaseId, clientContext, saveContext, sendEvent } = require('./_meta');
const { googleSettings } = require('./_google');
const { emailOn } = require('./_email');

async function userInfo(name, options) {
  const s = settings();
  const { premium, paid, sub, gift } = await status(name, options);
  const plays = Number(await redis('GET', playsKey(name))) || 0;
  const { amount, offer } = await priceFor(name);
  return { premium, plays, amount, price: amount === s.price ? s.label : priceLabel(amount), offer, freePerDay: FREE_ACCOUNT_PER_DAY, gift: Boolean(gift), lifetime: Boolean(paid), subscription: sub && { status: sub.status, paidUntil: sub.paidUntil },
    // For the page's Purchase event: same id as the one the server reports, so Meta counts it once
    purchase: paid ? { id: purchaseId(paid.id), value: paid.amount, currency: paid.currency || s.currency } : null };
}

// Mercado Pago's checkout for the one-time payment. "ref" is the account, or a new guest reference (pay first, account later).
async function createCheckout(req, data, ref, guest) {
  const s = settings();
  const { amount } = await priceFor(ref);
  const origin = process.env.APP_URL || 'https://' + req.headers.host;
  // Meta's browser ids (and the IP) are kept for the Purchase the server reports later, maybe from the webhook (api/_meta.js)
  const ctx = clientContext(req, data.track);
  await saveContext(ref, ctx);
  const fb = { fbp: ctx.fbp, fbc: ctx.fbc, ua: ctx.ua };
  // A guest's way back carries the claim, so the access is found even if Mercado Pago returns to another browser.
  const back = guest ? '&claim=' + ref : '';
  const pref = await mp('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ id: 'templo-ilimitado', title: 'Templo Ninja · acceso ilimitado', description: 'Acceso ilimitado: pago único, sin suscripción', quantity: 1, unit_price: amount, currency_id: s.currency }],
      external_reference: ref,
      metadata: { templo: 'ilimitado', ...fb }, // templo: tells this payment apart from the monthly charges of an old subscription
      back_urls: { success: origin + '/?aporte=ok' + back, pending: origin + '/?aporte=ok' + back, failure: origin + '/?aporte=error' + back },
      auto_return: 'approved',
      notification_url: origin + '/api/mercadopago',
      statement_descriptor: 'TEMPLO NINJA',
    }),
  });
  // With test credentials (TEST-…) the checkout has to be the sandbox one, or Mercado Pago rejects the test users.
  const isTest = (process.env.MP_ACCESS_TOKEN || '').startsWith('TEST-');
  const url = (isTest && pref.sandbox_init_point) || pref.init_point;
  if (!url) throw new HttpError(502, 'Mercado Pago no devolvió el enlace de pago.');
  // The same InitiateCheckout as the page (same event id), now that the checkout really exists
  await sendEvent({ event: 'InitiateCheckout', id: data.track?.event_id, name: ref, ctx, custom: { value: amount, currency: s.currency, content_name: 'Templo Ninja · acceso ilimitado' } });
  return url;
}

// What a guest's page needs: unlimited or not, and the Purchase to report once (same id as the server's).
function guestInfo(g) {
  const s = settings();
  // Once an account claimed it, the access lives in that account: the guest's browser is asked to sign in instead.
  const open = g.premium && !g.claimedBy;
  return { premium: open, guestPaid: open, claimed: Boolean(g.claimedBy), email: open ? g.email : null,
    purchase: g.paid ? { id: purchaseId(g.paid.id), value: g.paid.amount, currency: g.paid.currency || s.currency } : null };
}

module.exports = handler(async req => {
  const s = settings();
  const base = { enabled: s.enabled, price: s.label, amount: s.price, currency: s.currency, freePerDay: FREE_PER_DAY, guestPerDay: FREE_PER_DAY, accountPerDay: FREE_ACCOUNT_PER_DAY, pixel: metaSettings().pixel, gads: googleSettings(), emails: emailOn() };

  if (req.method === 'GET') {
    if (!bearer(req)) return base;
    return { ...base, ...await userInfo(await requireUser(req)) };
  }
  if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
  const data = body(req);

  // Without an account: the guest's paid access, and paying before creating one.
  if (!bearer(req)) {
    if (data.action === 'guest') {
      if (!isGuestRef(data.claim)) throw new HttpError(400, 'Referencia de pago inválida.');
      return { ...base, ...guestInfo(await guestStatus(data.claim, { forceRefresh: Boolean(data.sync) })) };
    }
    if (data.action === 'buy') {
      if (!s.enabled) throw new HttpError(503, 'Los pagos todavía no están configurados.');
      if (isGuestRef(data.claim) && (await guestStatus(data.claim)).premium) throw new HttpError(409, 'Ya tenés acceso ilimitado en este navegador. ¡Gracias!');
      const ref = newGuestRef();
      const ph = typeof data.ph === 'string' && /^[\w$.:-]{1,100}$/.test(data.ph) ? data.ph : null; // PostHog's id of this browser
      await redis('SET', 'guest:' + ref, JSON.stringify({ ph, created: Date.now() }), 'EX', 90 * 86400);
      return { url: await createCheckout(req, data, ref, true), claim: ref };
    }
  }

  const name = await requireUser(req);

  if (data.action === 'play') {
    await touch(name);
    if (!s.enabled || (await status(name)).premium) return { ok: true };
    const count = await redis('INCR', playsKey(name));
    if (count === 1) await redis('EXPIRE', playsKey(name), 2 * 86400);
    if (count > FREE_ACCOUNT_PER_DAY) throw new HttpError(402, `Ya usaste tus ${FREE_ACCOUNT_PER_DAY} prácticas gratis de hoy.`);
    return { ok: true, plays: count };
  }

  if (data.action === 'offer') return { ...base, ...await userInfo(name) }; // the pricing experiment ended; old pages may still send it

  if (data.action === 'sync') return { ...base, ...await userInfo(name, { forceRefresh: true }) };

  if (data.action === 'claim') {
    if (!isGuestRef(data.claim)) throw new HttpError(400, 'Referencia de pago inválida.');
    const claimed = Boolean(await claimGuest(data.claim, name));
    return { ...base, ...await userInfo(name), claimed };
  }

  if (data.action === 'buy') {
    if (!s.enabled) throw new HttpError(503, 'Los pagos todavía no están configurados.');
    if ((await status(name)).premium) throw new HttpError(409, 'Ya tenés acceso ilimitado. ¡Gracias!');
    return { url: await createCheckout(req, data, name, false) };
  }

  throw new HttpError(400, 'Acción desconocida.');
});
