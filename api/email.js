// Unsubscribe from the follow-up emails: GET /api/email?baja=<user>&t=<signature> (the link in each email) shows a
// short page; POST to the same address is the one-click unsubscribe of email apps (List-Unsubscribe-Post).
// The welcome and the sign-in links are part of the account and keep arriving.
const { redis } = require('./_lib');
const { checkUnsub } = require('./_email');
const posthog = require('./_posthog');

const page = (title, text) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Templo Ninja</title></head>
<body style="margin:0;background:#f5f3ed;font-family:Helvetica,Arial,sans-serif;color:#2b2b2b"><main style="max-width:480px;margin:0 auto;padding:48px 20px">
<p style="font-weight:800;color:#1e5c4f">⛩ Templo Ninja</p><h1 style="font-size:22px">${title}</h1><p style="line-height:1.5">${text}</p>
<p><a href="/" style="color:#1e5c4f;font-weight:700">Volver a entrenar</a></p></main></body></html>`;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const query = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  const name = String(query.baja || ''), ok = checkUnsub(name, String(query.t || ''));
  if (ok && await redis('SET', 'nomail:' + name, String(Date.now()), 'NX') === 'OK') await posthog.capture(name, 'email_unsubscribed', {});
  res.statusCode = ok ? 200 : 400;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(ok ? page('Listo, no te escribimos más', 'No vas a recibir más recordatorios ni promociones. Tu cuenta y tu progreso siguen como estaban.')
    : page('Ese link no funciona', 'Escribinos a info@temploninja.com y te damos de baja a mano.'));
};
