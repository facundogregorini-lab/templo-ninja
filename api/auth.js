// GET: who am I · POST {action: 'register' | 'login' | 'logout'} · POST {action: 'display', display} changes the name shown
// The username stays the account id (for logging in and in every key); the shown name lives in display:<user>
// and each one is claimed in alias:<key>, so two accounts can't show the same name nor someone else's username.
// New accounts sign up with an email and a password: the username is made from the email (nobody has to invent one),
// email:<sha256> points to it, and logging in works with either. Registering with a plain username still works.
// A guest who paid before having an account sends the payment's claim when registering (or logging in): the access
// moves to the account (api/_billing.js).
// With email on (api/_email.js): a welcome email with a link that signs in, {action: 'link', email} sends such a link
// (to sign in without the password), and {action: 'magic', token} uses one.
const { redis, HttpError, createSession, tokenKey, bearer, requireUser, hashPassword, checkPassword, body, handler, touch } = require('./_lib');
const { accountEmail, sendWelcome, sendSignInLink, useSignInLink } = require('./_email');
const { RIVALS } = require('./_rivals');
const { clientContext, saveContext, sendEvent, sha256 } = require('./_meta');
const { isGuestRef, claimGuest } = require('./_billing');

const MAX_FAILURES = 10, LOCK_SECONDS = 15 * 60;

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,100}\.[^\s@]{2,20}$/;
const emailKey = email => 'email:' + sha256(email);

function password(data) {
  const pass = String(data.password || '');
  if (pass.length < 6 || pass.length > 100) throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres.');
  return pass;
}
function username(value) {
  const name = String(value || '').trim().toLowerCase();
  if (!/^[a-z0-9_.-]{3,20}$/.test(name)) throw new HttpError(400, 'El usuario debe tener entre 3 y 20 letras, números, puntos o guiones.');
  return name;
}
// "Ana.Pérez+tn@gmail.com" → "ana.perez" (or "ana.perez7", "ana.perez42"… if it is taken).
async function nameFromEmail(email) {
  let stem = email.split('@')[0].split('+')[0].normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').replace(/^[._-]+|[._-]+$/g, '').slice(0, 15);
  if (stem.length < 3) stem = (stem + 'ninja').slice(0, 15);
  for (let i = 0; i < 12; i++) {
    const name = i ? stem + Math.floor(Math.random() * (i < 6 ? 100 : 100000)) : stem;
    if (RIVAL_KEYS.has(aliasKey(name)) || await redis('GET', 'user:' + name)) continue;
    const owner = await redis('GET', aliasKey(name));
    if (!owner || owner === name) return name;
  }
  throw new HttpError(409, 'No pudimos crear tu usuario. Probá de nuevo.');
}

// "Ana Pérez", "ana perez" and "ana.perez" are the same name: no accents, case, spaces or punctuation.
const aliasKey = text => 'alias:' + text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const RIVAL_KEYS = new Set(RIVALS.map(r => aliasKey(r.name)));

function cleanDisplay(value) {
  const text = String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if ([...text].length < 3 || [...text].length > 24 || !/^[\p{L}\p{N} ._'-]+$/u.test(text) || aliasKey(text) === 'alias:')
    throw new HttpError(400, 'El nombre debe tener entre 3 y 24 letras, números, espacios, puntos o guiones.');
  return text;
}

const user = async name => ({ name, display: await redis('GET', 'display:' + name) || name });

async function setDisplay(name, value) {
  const display = cleanDisplay(value), old = await redis('GET', 'display:' + name);
  if (display && display !== name) {
    const key = aliasKey(display);
    if (RIVAL_KEYS.has(key)) throw new HttpError(409, 'Ese nombre es de un rival del dojo. Elegí otro.');
    const owner = await redis('GET', key), lower = display.toLowerCase();
    if ((owner && owner !== name) || (!owner && lower !== name && await redis('GET', 'user:' + lower)))
      throw new HttpError(409, 'Ese nombre ya lo usa otra persona. Elegí otro.');
    if (!owner && await redis('SET', key, name, 'NX') !== 'OK') throw new HttpError(409, 'Ese nombre ya lo usa otra persona. Elegí otro.');
    await redis('SET', 'display:' + name, display);
  } else await redis('DEL', 'display:' + name); // empty or the username itself: back to showing the username
  if (old && aliasKey(old) !== aliasKey(display || name)) await redis('DEL', aliasKey(old));
  return { name, display: display || name };
}

module.exports = handler(async req => {
  if (req.method === 'GET') { const name = await requireUser(req); await touch(name); return { user: await user(name) }; }
  if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
  const data = body(req);

  if (data.action === 'logout') {
    const token = bearer(req);
    if (token) await redis('DEL', tokenKey(token));
    return { ok: true };
  }

  if (data.action === 'display') return { user: await setDisplay(await requireUser(req), data.display) };

  // A sign-in link from an email: one use, then it is gone.
  if (data.action === 'magic') {
    const name = await useSignInLink(data.token);
    if (!name || !await redis('GET', 'user:' + name)) throw new HttpError(401, 'Ese link ya se usó o venció. Pedí otro desde "Entrar".');
    await touch(name);
    const claimed = isGuestRef(data.claim) ? Boolean(await claimGuest(data.claim, name)) : false;
    return { token: await createSession(name), user: await user(name), claimed };
  }

  // "Mandame un link": the same answer whether the email has an account or not (nobody learns which emails are here).
  if (data.action === 'link') {
    const email = String(data.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Escribí tu email para mandarte el link.');
    const name = await redis('GET', emailKey(email));
    if (name && await redis('SET', 'linkwait:' + name, '1', 'EX', 120, 'NX') === 'OK') await sendSignInLink(name, await accountEmail(name) || email);
    return { ok: true };
  }

  const pass = password(data);
  const claim = isGuestRef(data.claim) ? data.claim : null; // a guest who already paid


  if (data.action === 'register') {
    const login = String(data.email ?? data.username ?? '').trim().toLowerCase();
    const email = login.includes('@') ? login : null;
    if (email && !EMAIL_RE.test(email)) throw new HttpError(400, 'Revisá el email: parece que le falta algo.');
    if (email && await redis('GET', emailKey(email))) throw new HttpError(409, 'Ya hay una cuenta con ese email. Entrá con tu contraseña.');
    const name = email ? await nameFromEmail(email) : username(login);
    const taken = await redis('GET', aliasKey(name));
    if (taken && taken !== name) throw new HttpError(409, 'Ese usuario ya existe. Elegí otro o entrá con tu contraseña.');
    const created = await redis('SET', 'user:' + name, JSON.stringify({ ...hashPassword(pass), created: Date.now(), ...(email ? { email } : {}) }), 'NX');
    if (!created) throw new HttpError(409, 'Ese usuario ya existe. Elegí otro o entrá con tu contraseña.');
    if (email && await redis('SET', emailKey(email), name, 'NX') !== 'OK') {
      await redis('DEL', 'user:' + name); // someone registered the same email at the same moment
      throw new HttpError(409, 'Ya hay una cuenta con ese email. Entrá con tu contraseña.');
    }
    const claimed = claim ? Boolean(await claimGuest(claim, name)) : false;
    // The page's CompleteRegistration, also from the server (same event id), now that the account exists
    const ctx = clientContext(req, data.track);
    await Promise.all([saveContext(name, ctx), sendEvent({ event: 'CompleteRegistration', id: data.track?.event_id, name, email, ctx, custom: { content_name: 'Cuenta Templo Ninja' } }),
      touch(name), email ? sendWelcome(name, email) : null]);
    return { token: await createSession(name), user: { name, display: name }, claimed };
  }

  if (data.action === 'login') {
    const login = String(data.username ?? data.email ?? '').trim().toLowerCase();
    const byEmail = login.includes('@'), name = byEmail ? await redis('GET', emailKey(login)) : login;
    const failKey = 'fail:' + (byEmail ? sha256(login) : login); // an unknown email has its own lock too
    if (byEmail && !name) {
      if (await redis('INCR', failKey) === 1) await redis('EXPIRE', failKey, LOCK_SECONDS);
      throw new HttpError(401, 'No encontramos una cuenta con ese email. ¿La creamos?');
    }
    if (Number(await redis('GET', failKey)) >= MAX_FAILURES) throw new HttpError(429, 'Demasiados intentos. Esperá 15 minutos y probá de nuevo.');
    const stored = /^[a-z0-9_.-]{3,20}$/.test(name) && await redis('GET', 'user:' + name);
    if (!stored || !checkPassword(pass, JSON.parse(stored))) {
      if (await redis('INCR', failKey) === 1) await redis('EXPIRE', failKey, LOCK_SECONDS);
      throw new HttpError(401, byEmail ? 'Email o contraseña incorrectos.' : 'Usuario o contraseña incorrectos.');
    }
    await redis('DEL', failKey);
    await touch(name);
    const claimed = claim ? Boolean(await claimGuest(claim, name)) : false;
    return { token: await createSession(name), user: await user(name), claimed };
  }

  throw new HttpError(400, 'Acción desconocida.');
});
