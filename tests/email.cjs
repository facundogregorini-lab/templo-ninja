// Welcome email with a sign-in link, sign-in links on request, and the daily follow-ups (reminder, then a 48-hour
// price) against a fake Resend, Mercado Pago and PostHog. Only the API (no browser). Run: npm run test:email
const http = require('node:http'), assert = require('node:assert/strict');
const SITE = 'http://127.0.0.1:4393', FAKE = 'http://127.0.0.1:4394';
Object.assign(process.env, { MP_ACCESS_TOKEN: 'TEST-token', MP_PRICE: '4900', MP_API_BASE: FAKE, APP_URL: SITE, RESEND_API_KEY: 're_test', RESEND_API_BASE: FAKE + '/resend',
  CRON_SECRET: 'cron-secret', EMAIL_SECRET: 'email-secret', POSTHOG_KEY: 'phc_test', POSTHOG_INGEST_HOST: FAKE + '/ph' });
const { createServer } = require('./server.cjs');
const { redis } = require('../api/_lib'); // the same in-memory database as the server (same process)

const mails = [], ph = [], prefs = [], payments = new Map();
const fake = http.createServer(async (req, res) => {
  let raw = ''; for await (const c of req) raw += c;
  const url = new URL(req.url, FAKE), send = d => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(d)); };
  if (url.pathname === '/resend/emails') { assert.equal(req.headers.authorization, 'Bearer re_test'); mails.push(JSON.parse(raw)); return send({ id: 'em_' + mails.length }); }
  if (url.pathname === '/ph/i/v0/e/') { ph.push(JSON.parse(raw)); return send({ status: 1 }); }
  if (req.method === 'POST' && url.pathname === '/checkout/preferences') {
    const body = JSON.parse(raw), id = 'p' + (1e9 + payments.size + 1); prefs.push(body);
    payments.set(id, { id, status: 'approved', transaction_amount: body.items[0].unit_price, currency_id: 'ARS', external_reference: body.external_reference, metadata: body.metadata });
    return send({ id: 'pref', init_point: FAKE + '/real', sandbox_init_point: FAKE + '/sandbox' });
  }
  if (url.pathname === '/v1/payments/search') return send({ results: [...payments.values()].filter(p => p.external_reference === url.searchParams.get('external_reference')) });
  res.statusCode = 404; send({});
});

async function api(path, body, token, headers = {}) {
  const res = await fetch(SITE + '/api/' + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers }, body: body && JSON.stringify(body) });
  const text = await res.text();
  try { return { status: res.status, ...JSON.parse(text) }; } catch { return { status: res.status, html: text }; }
}
const cron = (query = '') => api('cron' + query, undefined, undefined, { Authorization: 'Bearer cron-secret' });
const check = (name, ok) => { assert.ok(ok, name); console.log('PASS', name); };
const tokenIn = mail => /[?&]entrar=([\w-]+)/.exec(mail.html)?.[1];
const daysAgo = d => String(Date.now() - d * 86400e3);
// As if the account was created and last seen that many days ago.
async function idle(name, days) {
  const user = JSON.parse(await redis('GET', 'user:' + name));
  await redis('SET', 'user:' + name, JSON.stringify({ ...user, created: Number(daysAgo(days + 1)) }));
  await redis('SET', 'seen:' + name, daysAgo(days));
}

(async () => {
  const site = createServer();
  await Promise.all([new Promise(r => site.listen(4393, '127.0.0.1', r)), new Promise(r => fake.listen(4394, '127.0.0.1', r))]);
  try {
    check('the page knows emails are on (for the "send me a link" button)', (await api('billing')).emails === true);

    // Welcome: to the email of the new account, with a link that signs in once
    const ana = await api('auth', { action: 'register', email: 'ana@example.com', password: 'secreto1' });
    const welcome = mails.at(-1);
    check('signing up with an email sends the welcome to that email', mails.length === 1 && welcome.to[0] === 'ana@example.com' && welcome.tags[0].value === 'bienvenida' && welcome.text.includes('ana'));
    check('the welcome has a sign-in link with the email\'s campaign', tokenIn(welcome) && welcome.html.includes('utm_source=email') && welcome.html.includes('utm_campaign=bienvenida'));
    check('the welcome is not a marketing email (no unsubscribe header)', !welcome.headers);
    const magic = await api('auth', { action: 'magic', token: tokenIn(welcome) });
    check('the link signs in', magic.status === 200 && magic.user.name === 'ana' && magic.token && (await api('auth', undefined, magic.token)).user.name === 'ana');
    check('the link works once', (await api('auth', { action: 'magic', token: tokenIn(welcome) })).status === 401);
    check('a made-up link does not', (await api('auth', { action: 'magic', token: 'x'.repeat(32) })).status === 401);
    check('signing up with a username sends nothing (there is no email)', (await api('auth', { action: 'register', username: 'beto', password: 'secreto1' })).status === 200 && mails.length === 1);

    // "Mandame un link"
    check('a link to an email with no account: the same answer, and nothing is sent', (await api('auth', { action: 'link', email: 'nadie@example.com' })).ok && mails.length === 1);
    await api('auth', { action: 'link', email: 'ANA@example.com' });
    check('a link to an account\'s email is sent', mails.length === 2 && mails[1].tags[0].value === 'link' && tokenIn(mails[1]));
    await api('auth', { action: 'link', email: 'ana@example.com' });
    check('asking again right away sends nothing more', mails.length === 2);
    check('PostHog hears that an email went out, never the address', ph.some(e => e.event === 'email_sent' && e.distinct_id === 'ana') && !ph.some(e => JSON.stringify(e).includes('example.com')));

    // The daily job: two paths, by whether the account hit the daily free limit
    check('the job needs Vercel\'s secret', (await api('cron')).status === 401);
    const cami = await api('auth', { action: 'register', email: 'cami@example.com', password: 'secreto1' });
    const dani = await api('auth', { action: 'register', email: 'dani@example.com', password: 'secreto1' });
    for (let i = 0; i < 10; i++) await api('billing', { action: 'play' }, dani.token); // dani uses up today's free practices
    check('using up the free practices marks the account', Boolean(await redis('GET', 'hitlimit:dani')) && !await redis('GET', 'hitlimit:cami'));
    await idle('ana', 1); await idle('cami', 4); await idle('dani', 3);
    let dry = await cron('?dry=1');
    const due = (d, n) => d.due.find(x => x.name === n);
    check('who comes back is left alone; never at the limit and 3 days away: a reminder; at the limit and 2 days away: a gift',
      !due(dry, 'ana') && due(dry, 'cami')?.step === 'recordatorio' && due(dry, 'cami').segment === 'no_llego_al_limite'
      && due(dry, 'dani')?.step === 'regalo' && due(dry, 'dani').segment === 'llego_al_limite' && !JSON.stringify(dry).includes('@'));
    let before = mails.length, run = await cron();
    const remind = mails.slice(before).find(m => m.to[0] === 'cami@example.com'), gift = mails.slice(before).find(m => m.to[0] === 'dani@example.com');
    check('the job sends both', run.sent === 2 && remind?.tags[0].value === 'recordatorio' && gift?.tags[0].value === 'regalo');
    check('follow-ups carry a one-click unsubscribe and a sign-in link', remind.headers['List-Unsubscribe'].includes('/api/email?baja=cami') && remind.headers['List-Unsubscribe-Post'] && tokenIn(remind) && remind.html.includes('No quiero recibir'));
    check('the gift says how many extra practices and until when', gift.subject.includes('15 prácticas extra') && /valen hasta el \d\d\/\d\d/.test(gift.text));

    // The gift is real: past today's free practices, 15 more
    const daniPlan = await api('billing', undefined, dani.token);
    check('the account sees its extra practices in today\'s limit', daniPlan.bonus === 15 && daniPlan.freePerDay === 25 && daniPlan.plays === 10);
    const codes = []; for (let i = 0; i < 16; i++) codes.push((await api('billing', { action: 'play' }, dani.token)).status);
    check('15 extra practices, then the limit again', codes.join() === '200,'.repeat(15) + '402' && (await api('billing', undefined, dani.token)).bonus === 0);
    check('the reminder is not sent twice, and the gift is not the offer yet', (await cron()).sent === 0);

    // Still away after the gift: half price for 48 hours
    await idle('dani', 8);
    dry = await cron('?dry=1');
    check('at the limit, gifted and 7 days away: the offer', due(dry, 'dani')?.step === 'oferta' && !due(dry, 'cami'));
    before = mails.length; run = await cron();
    const offer = mails.slice(before).find(m => m.to[0] === 'dani@example.com');
    check('the offer is half price for 48 hours, saying until when', run.sent === 1 && offer.subject.startsWith('50% off por 48 horas') && offer.subject.includes('$ 2.450') && offer.text.includes('$ 4.900') && /hasta el \d\d\/\d\d a las \d\d:\d\d/.test(offer.text));
    check('each email goes once', (await cron()).sent === 0);
    const offerPlan = await api('billing', undefined, dani.token);
    check('the account sees its offer price, until a date', offerPlan.amount === 2450 && offerPlan.offer?.regular === 4900 && offerPlan.offer.until > Date.now());
    check('other accounts keep the usual price', (await api('billing', undefined, cami.token)).amount === 4900);
    await api('billing', { action: 'buy' }, dani.token);
    check('Mercado Pago charges the offer price', prefs.at(-1).items[0].unit_price === 2450 && prefs.at(-1).external_reference === 'dani');
    await redis('SET', 'promo:dani', JSON.stringify({ amount: 2450, until: Date.now() - 1000 }));
    check('once the offer ends, the usual price is back', (await api('billing', undefined, dani.token)).amount === 4900);
    check('an account that never hit the limit never gets a discount', !mails.some(m => m.to[0] === 'cami@example.com' && m.tags[0].value !== 'recordatorio' && m.tags[0].value !== 'bienvenida'));

    // Unsubscribe and who is never written to
    const unsubUrl = remind.headers['List-Unsubscribe'].slice(1, -1).replace('https://www.temploninja.com', SITE);
    check('a forged unsubscribe link does nothing', (await fetch(SITE + '/api/email?baja=cami&t=' + 'a'.repeat(32))).status === 400);
    const page = await fetch(unsubUrl.replace(/^.*\/api\//, SITE + '/api/'));
    check('the unsubscribe link works and says so', page.status === 200 && (await page.text()).includes('no te escribimos más') && await redis('GET', 'nomail:cami'));
    await redis('SET', 'mailsent:cami', JSON.stringify({ recordatorio: 1 })); await idle('cami', 10);
    await redis('SET', 'hitlimit:cami', '1');
    check('after unsubscribing, no more follow-ups (not even the gift)', !(await cron('?dry=1')).due.some(d => d.name === 'cami'));
    const eva = await api('auth', { action: 'register', email: 'eva@example.com', password: 'secreto1' });
    await redis('SET', 'paid:eva', JSON.stringify({ id: 1, amount: 4900 })); await idle('eva', 9);
    check('unlimited accounts get no follow-ups', eva.status === 200 && !(await cron('?dry=1')).due.some(d => d.name === 'eva'));
    console.log('\nAll email checks passed');
  } finally { site.close(); fake.close(); }
})().catch(error => { console.error(error); process.exit(1); });
