// POST { event: 'ViewContent', event_id, reason, track }: the page's pixel event, repeated from the server through the
// Conversions API with the same event id (Meta keeps one). Only for the events that happen in the page alone: the
// registration and the checkout are reported by auth.js and billing.js, and the purchase by the payment itself.
const { redis, HttpError, bearer, tokenKey, body, handler } = require('./_lib');
const { clientContext, saveContext, sendEvent, cleanEventId } = require('./_meta');
const { settings } = require('./_billing');

const EVENTS = {
  ViewContent: data => ({ content_name: 'Templo Ninja · precios', content_category: data.reason === 'limit' ? 'limit' : 'upgrade', value: settings().price, currency: settings().currency }),
};

module.exports = handler(async req => {
  if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
  const data = body(req);
  const custom = EVENTS[data.event];
  if (!custom || !cleanEventId(data.event_id)) throw new HttpError(400, 'Evento inválido.');
  const token = bearer(req), name = token ? await redis('GET', tokenKey(token)).catch(() => null) : null; // optional: guests too
  const ctx = clientContext(req, data.track);
  if (name) await saveContext(name, ctx);
  await sendEvent({ event: data.event, id: data.event_id, name, ctx, custom: custom(data) });
  return { ok: true };
});
