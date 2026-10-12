// Emails to the people who signed up with an email: the welcome (with a link that signs them in), the sign-in link
// they ask for, and the follow-ups to whoever stops coming back (api/cron.js). Sent through Resend's API.
// RESEND_API_KEY turns it on; without it nothing is sent and the app works as before. EMAIL_FROM is the sender
// (a verified domain in Resend); EMAIL_SECRET signs the unsubscribe links (CRON_SECRET or ADMIN_KEY if missing).
// Every marketing email carries a one-click unsubscribe; the welcome and the sign-in link are part of the account.
const crypto = require('node:crypto');
const { redis } = require('./_lib');
const { siteUrl } = require('./_meta');
const posthog = require('./_posthog');
const env = name => (process.env[name] || '').trim();

const LINK_DAYS = 14;

function emailSettings() {
  return {
    key: env('RESEND_API_KEY'),
    from: env('EMAIL_FROM') || 'Templo Ninja <hola@temploninja.com>',
    replyTo: env('EMAIL_REPLY_TO') || 'info@temploninja.com',
    api: (env('RESEND_API_BASE') || 'https://api.resend.com').replace(/\/$/, ''),
    secret: env('EMAIL_SECRET') || env('CRON_SECRET') || env('ADMIN_KEY') || env('FEEDBACK_KEY'),
  };
}
const emailOn = () => Boolean(emailSettings().key);

// A link that signs the account in, once, for LINK_DAYS days. Only its hash is stored.
async function signInLink(name, campaign) {
  const token = crypto.randomBytes(24).toString('base64url');
  await redis('SET', 'magic:' + crypto.createHash('sha256').update(token).digest('hex'), name, 'EX', LINK_DAYS * 86400);
  return link('/?entrar=' + token, campaign);
}
// The account a sign-in link belongs to, and the link is gone (used once).
async function useSignInLink(token) {
  if (!/^[\w-]{20,64}$/.test(String(token || ''))) return null;
  const key = 'magic:' + crypto.createHash('sha256').update(token).digest('hex');
  const name = await redis('GET', key);
  if (name) await redis('DEL', key);
  return name || null;
}

// Unsubscribe: an HMAC of the account, so the link works without signing in and can't be made up for another one.
const unsubToken = name => crypto.createHmac('sha256', emailSettings().secret || 'templo').update('baja:' + name).digest('base64url').slice(0, 32);
const unsubLink = name => siteUrl() + '/api/email?baja=' + encodeURIComponent(name) + '&t=' + unsubToken(name);
const checkUnsub = (name, token) => /^[a-z0-9_.-]{3,20}$/.test(name || '') && typeof token === 'string' && token.length === 32
  && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(unsubToken(name)));
const unsubscribed = async name => Boolean(await redis('GET', 'nomail:' + name));

// The site with the email's campaign, so PostHog sees where the visit came from.
function link(path, campaign) {
  const u = new URL(siteUrl() + path);
  u.searchParams.set('utm_source', 'email'); u.searchParams.set('utm_medium', 'lifecycle'); u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// One simple layout for every email: works in Gmail, Outlook and phones, and has a plain-text twin.
function layout({ title, paragraphs, button, buttonUrl, after = [], footer }) {
  const p = t => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#2b2b2b">${t}</p>`;
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f5f3ed;font-family:Helvetica,Arial,sans-serif">
<div style="max-width:520px;margin:0 auto;padding:28px 20px">
<p style="margin:0 0 18px;font-weight:800;font-size:18px;color:#1e5c4f">⛩ Templo Ninja</p>
<div style="background:#fff;border-radius:14px;padding:26px 22px;border:1px solid #e6e1d6">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#141414">${esc(title)}</h1>
${paragraphs.map(t => p(esc(t))).join('\n')}
<p style="margin:22px 0"><a href="${esc(buttonUrl)}" style="display:inline-block;background:#1e5c4f;color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:10px">${esc(button)}</a></p>
${after.map(t => `<p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#6b6b6b">${esc(t)}</p>`).join('\n')}
</div>
<p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#8a8a8a">${footer}</p>
</div></body></html>`;
  const text = [title, '', ...paragraphs, '', button + ': ' + buttonUrl, '', ...after].join('\n');
  return { html, text };
}

// Sends one email. Never throws: an email that fails must not break a sign-up.
async function send({ to, subject, html, text, name, kind, unsub }) {
  const s = emailSettings();
  if (!s.key || !to) return false;
  try {
    const response = await fetch(s.api + '/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + s.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: s.from, to: [to], reply_to: s.replyTo, subject, html, text, tags: [{ name: 'kind', value: kind }],
        ...(unsub ? { headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } } : {}) }),
    });
    if (!response.ok) { console.error('Resend', kind, response.status, await response.text().catch(() => '')); return false; }
    if (name) await posthog.capture(name, 'email_sent', { kind }); // never the address
    return true;
  } catch (error) {
    console.error('Resend unreachable', error.message);
    return false;
  }
}

const accountEmail = async name => JSON.parse(await redis('GET', 'user:' + name) || 'null')?.email || null;
const footer = (name, marketing) => marketing
  ? `Te escribimos porque tenés una cuenta en Templo Ninja. <a href="${esc(unsubLink(name))}" style="color:#8a8a8a">No quiero recibir más estos mails</a>.`
  : 'Recibís este mail porque creaste una cuenta en Templo Ninja. Si no fuiste vos, ignoralo.';

async function sendWelcome(name, email) {
  const url = await signInLink(name, 'bienvenida');
  const { html, text } = layout({
    title: '¡Bienvenido al templo!',
    paragraphs: ['Ya tenés tu cuenta. Tu progreso queda guardado y tenés 10 prácticas gratis por día: lecciones para escribir sin mirar, figuras, números, inglés y simulacros de entrevista.',
      'Para volver, tocá el botón: entrás directo, sin contraseña.'],
    button: 'Volver a entrenar', buttonUrl: url,
    after: [`Tu usuario es ${name}. También podés entrar con este email y tu contraseña.`, `El botón sirve una vez y vence en ${LINK_DAYS} días. Cuando quieras otro, pedilo desde "Entrar" → "Mandame un link".`],
    footer: footer(name, false),
  });
  return send({ to: email, subject: 'Tu cuenta en Templo Ninja ⛩', html, text, name, kind: 'bienvenida' });
}

async function sendSignInLink(name, email) {
  const url = await signInLink(name, 'link');
  const { html, text } = layout({
    title: 'Tu link para entrar',
    paragraphs: ['Tocá el botón y entrás a tu cuenta de Templo Ninja, sin contraseña.'],
    button: 'Entrar a Templo Ninja', buttonUrl: url,
    after: [`Sirve una vez y vence en ${LINK_DAYS} días.`],
    footer: 'Si no lo pediste vos, ignoralo: nadie puede entrar sin este mail.',
  });
  return send({ to: email, subject: 'Tu link para entrar a Templo Ninja', html, text, name, kind: 'link' });
}

// The follow-ups of api/cron.js. "offer" is { amount, until } when it brings a price for a few hours.
async function sendFollowUp(name, email, step, offer) {
  const url = await signInLink(name, step);
  const price = n => '$ ' + Number(n).toLocaleString('es-AR');
  // Day and time in Argentina (UTC-3, no daylight saving): "14/10" and "11:00".
  const ar = offer && new Date(offer.until - 3 * 3600e3).toISOString(), day = ar && ar.slice(8, 10) + '/' + ar.slice(5, 7), time = ar && ar.slice(11, 16);
  const content = step === 'recordatorio' ? {
    subject: 'Tu práctica de hoy te espera 🥷',
    title: 'Diez minutos y volvés en forma',
    paragraphs: ['Las pruebas de las entrevistas premian la práctica: cada sesión trae la técnica para resolverla y la explicación de cada respuesta.',
      'Hoy tenés tus prácticas gratis listas. Entrá directo, sin contraseña.'],
    button: 'Seguir entrenando',
  } : {
    subject: `Acceso ilimitado a ${price(offer.amount)} hasta el ${day}`,
    title: `Entrená sin límites a ${price(offer.amount)}`,
    paragraphs: [`Por 48 horas, el acceso ilimitado para siempre te sale ${price(offer.amount)} en vez de ${price(offer.regular)}: un solo pago, sin suscripción.`,
      'Simulacros de entrevista, tests por empresa, lecciones y desafíos sin tope diario. Y si no te sirve, te devolvemos todo dentro de los 14 días.'],
    button: 'Ver mi precio',
    after: [`El precio vale hasta el ${day} a las ${time} (hora de Argentina).`],
  };
  const { html, text } = layout({ ...content, buttonUrl: url, footer: footer(name, true) });
  return send({ to: email, subject: content.subject, html, text, name, kind: step, unsub: unsubLink(name) });
}

module.exports = { emailOn, emailSettings, accountEmail, sendWelcome, sendSignInLink, sendFollowUp, useSignInLink, checkUnsub, unsubscribed, LINK_DAYS };
