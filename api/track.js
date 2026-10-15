// POST { event, event_id, reason, track }: the page's pixel event, repeated from the server through the Conversions API
// with the same event id (Meta keeps one). Only for the events that happen in the page alone: the registration and the
// checkout are reported by auth.js and billing.js, and the purchase by the payment itself.
// ViewContent is what the Meta ad sets and the Google Ads campaign optimize for ("Vieron precios"): the plan opened from the
// header (upgrade) and every wall of the free plan (app.js, "Belt gates"), each with its content_category.
// LimiteCuenta: a free account hit its wall (yellow belt done, or its daily practices used), the audience closest to paying.
const { redis, HttpError, bearer, tokenKey, body, handler } = require('./_lib');
const { clientContext, saveContext, sendEvent, cleanEventId } = require('./_meta');

const WALLS = ['limit', 'upgrade', 'iq_result', 'cinturon_blanco', 'limite_invitado', 'cinturon_amarillo', 'limite_cuenta'];
const ACCOUNT_WALLS = ['cinturon_amarillo', 'limite_cuenta'];
const EVENTS = {
  ViewContent: data => ({ content_name: 'Templo Ninja · precios', content_category: WALLS.includes(data.reason) ? data.reason : 'upgrade' }),
  LimiteCuenta: data => ACCOUNT_WALLS.includes(data.reason) ? { content_name: 'Templo Ninja · límite de la cuenta gratis', content_category: data.reason } : null,
};

module.exports = handler(async req => {
  if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
  const data = body(req);
  const custom = EVENTS[data.event]?.(data);
  if (!custom || !cleanEventId(data.event_id)) throw new HttpError(400, 'Evento inválido.');
  const token = bearer(req), name = token ? await redis('GET', tokenKey(token)).catch(() => null) : null; // optional: guests too
  if (data.event === 'LimiteCuenta' && !name) throw new HttpError(400, 'Evento inválido.'); // only accounts reach that wall
  const ctx = clientContext(req, data.track);
  if (name) await saveContext(name, ctx);
  await sendEvent({ event: data.event, id: data.event_id, name, ctx, custom });
  return { ok: true };
});
