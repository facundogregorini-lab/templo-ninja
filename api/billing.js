// GET: plan info (public part + the user's plan when logged in)
// POST { action: 'play' }: counts one of today's free practices (FREE_ACCOUNT_PER_DAY for accounts) · { action: 'buy' }: Mercado Pago checkout for the
// one-time payment · { action: 'sync' }: asks Mercado Pago again (coming back from paying)
const { redis, HttpError, requireUser, bearer, body, handler } = require('./_lib');
const { FREE_PER_DAY, FREE_ACCOUNT_PER_DAY, settings, playsKey, mp, status, priceFor, priceLabel } = require('./_billing');
const { metaSettings, purchaseId, clientContext, saveContext, sendEvent } = require('./_meta');
const { googleSettings } = require('./_google');

async function userInfo(name, options) {
  const s = settings();
  const { premium, paid, sub, gift } = await status(name, options);
  const plays = Number(await redis('GET', playsKey(name))) || 0;
  const { amount, offer } = await priceFor(name);
  return { premium, plays, amount, price: amount === s.price ? s.label : priceLabel(amount), offer, freePerDay: FREE_ACCOUNT_PER_DAY, gift: Boolean(gift), lifetime: Boolean(paid), subscription: sub && { status: sub.status, paidUntil: sub.paidUntil },
    // For the page's Purchase event: same id as the one the server reports, so Meta counts it once
    purchase: paid ? { id: purchaseId(paid.id), value: paid.amount, currency: paid.currency || s.currency } : null };
}

module.exports = handler(async req => {
  const s = settings();
  const base = { enabled: s.enabled, price: s.label, amount: s.price, currency: s.currency, freePerDay: FREE_PER_DAY, guestPerDay: FREE_PER_DAY, accountPerDay: FREE_ACCOUNT_PER_DAY, pixel: metaSettings().pixel, gads: googleSettings() };

  if (req.method === 'GET') {
    if (!bearer(req)) return base;
    return { ...base, ...await userInfo(await requireUser(req)) };
  }
  if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
  const name = await requireUser(req);
  const data = body(req);

  if (data.action === 'play') {
    if (!s.enabled || (await status(name)).premium) return { ok: true };
    const count = await redis('INCR', playsKey(name));
    if (count === 1) await redis('EXPIRE', playsKey(name), 2 * 86400);
    if (count > FREE_ACCOUNT_PER_DAY) throw new HttpError(402, `Ya usaste tus ${FREE_ACCOUNT_PER_DAY} prácticas gratis de hoy.`);
    return { ok: true, plays: count };
  }

  if (data.action === 'offer') return { ...base, ...await userInfo(name) }; // the pricing experiment ended; old pages may still send it

  if (data.action === 'sync') return { ...base, ...await userInfo(name, { forceRefresh: true }) };

  if (data.action === 'buy') {
    if (!s.enabled) throw new HttpError(503, 'Los pagos todavía no están configurados.');
    if ((await status(name)).premium) throw new HttpError(409, 'Ya tenés acceso ilimitado. ¡Gracias por tu aporte!');
    const { amount } = await priceFor(name);
    const origin = process.env.APP_URL || 'https://' + req.headers.host;
    // Meta's browser ids (and the IP) are kept for the Purchase the server reports later, maybe from the webhook (api/_meta.js)
    const ctx = clientContext(req, data.track);
    await saveContext(name, ctx);
    const fb = { fbp: ctx.fbp, fbc: ctx.fbc, ua: ctx.ua };
    const pref = await mp('/checkout/preferences', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: 'templo-ilimitado', title: 'Templo Ninja · acceso ilimitado', description: 'Aporte al templo: pago único, sin suscripción', quantity: 1, unit_price: amount, currency_id: s.currency }],
        external_reference: name,
        metadata: { templo: 'ilimitado', ...fb }, // templo: tells this payment apart from the monthly charges of an old subscription
        back_urls: { success: origin + '/?aporte=ok', pending: origin + '/?aporte=ok', failure: origin + '/?aporte=error' },
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
    await sendEvent({ event: 'InitiateCheckout', id: data.track?.event_id, name, ctx, custom: { value: amount, currency: s.currency, content_name: 'Templo Ninja · acceso ilimitado' } });
    return { url };
  }

  throw new HttpError(400, 'Acción desconocida.');
});
