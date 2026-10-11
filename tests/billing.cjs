// Freemium + Mercado Pago flow against a fake Mercado Pago API. Run: npm run test:billing
const http = require('node:http'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const SITE = 'http://127.0.0.1:4193', MP = 'http://127.0.0.1:4194';
Object.assign(process.env, { MP_ACCESS_TOKEN: 'TEST-token', MP_PRICE: '4900', MP_API_BASE: MP, APP_URL: SITE, TECLADO_PREMIUM_USERS: 'regalo',
  META_PIXEL_ID: '123456789012345', GOOGLE_ADS_ID: 'AW-123456789', GOOGLE_ADS_LABELS: 'precios=Prec1abc,registro=Reg1abc,practica=Prac1abc,pago=Pago1abc,compra=Comp1abc', META_CAPI_TOKEN: 'capi-token', META_GRAPH_BASE: MP + '/graph', META_TEST_EVENT_CODE: 'TEST123',
  POSTHOG_KEY: 'phc_test', POSTHOG_INGEST_HOST: MP + '/ph' });
const { createServer } = require('./server.cjs');

// Fake Mercado Pago. Checkout: creating a preference is as if the user paid right away (an approved payment
// with the same reference and metadata). Old monthly subscriptions can still be read back.
const subs = new Map(), payments = new Map(), capi = [], capiBodies = [], ph = [], prices = [];
const fakeMP = http.createServer(async (req, res) => {
  let raw = ''; for await (const c of req) raw += c;
  const url = new URL(req.url, MP), send = d => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(d)); };
  // Fake Meta Conversions API
  if (req.method === 'POST' && url.pathname === '/graph/123456789012345/events' && url.searchParams.get('access_token') === 'capi-token') { const b = JSON.parse(raw); capiBodies.push(b); capi.push(...b.data); return send({ events_received: 1 }); }
  // Fake PostHog ingestion
  if (req.method === 'POST' && url.pathname === '/ph/i/v0/e/') { const e = JSON.parse(raw); if (e.api_key === 'phc_test') ph.push(e); return send({ status: 1 }); }
  if (req.headers.authorization !== 'Bearer TEST-token') { res.statusCode = 401; return send({ message: 'bad token' }); }
  if (req.method === 'POST' && url.pathname === '/checkout/preferences') {
    const body = JSON.parse(raw), id = 'pay_' + (payments.size + 1);
    prices.push(body.items[0].unit_price);
    assert.equal(body.items[0].unit_price, 4900); assert.equal(body.items[0].quantity, 1);
    assert.ok(!body.auto_recurring && body.notification_url.endsWith('/api/mercadopago'));
    payments.set(id, { id, status: 'approved', transaction_amount: body.items[0].unit_price, currency_id: 'ARS', external_reference: body.external_reference, metadata: body.metadata,
      transaction_details: { net_received_amount: 4530.5 }, fee_details: [{ type: 'mercadopago_fee', amount: 369.5 }], payment_method_id: 'account_money', payment_type_id: 'account_money', installments: 1 });
    // The token is a test one (TEST-…): the app must send the user to the sandbox checkout, not the real one.
    return send({ id: 'pref_' + id, init_point: MP + '/checkout-real', sandbox_init_point: body.back_urls.success + '&sandbox=1' });
  }
  const pay = /^\/v1\/payments\/(pay_\d+)$/.exec(url.pathname);
  if (pay && payments.has(pay[1])) return send(payments.get(pay[1]));
  if (url.pathname === '/v1/payments/search') return send({ results: [...payments.values()].filter(p => p.external_reference === url.searchParams.get('external_reference') && p.status === url.searchParams.get('status')) });
  const m = /^\/preapproval\/(pre_\d+)$/.exec(url.pathname);
  if (m && subs.has(m[1])) return send(subs.get(m[1]));
  if (url.pathname === '/preapproval/search') return send({ results: [...subs.values()].filter(s => s.external_reference === url.searchParams.get('external_reference')) });
  res.statusCode = 404; send({ message: 'not found' });
});

const check = (name, ok) => { assert.ok(ok, name); console.log('PASS', name); };
(async () => {
  const site = createServer();
  await Promise.all([new Promise(r => site.listen(4193, '127.0.0.1', r)), new Promise(r => fakeMP.listen(4194, '127.0.0.1', r))]);
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const errors = [];
  // A stand-in for Meta's fbevents.js that writes every pixel call to the console (kept across navigations).
  const PIXEL = "document.cookie='_fbp=fb.1.1700000000000.42;path=/';(window.fbq.queue||[]).forEach(a=>console.log('PX '+JSON.stringify([...a])));window.fbq.callMethod=(...a)=>console.log('PX '+JSON.stringify(a));";
  // A stand-in for Google's gtag.js that writes every dataLayer entry to the console (kept across navigations).
  const GTAG = "(window.dataLayer||[]).forEach(a=>console.log('GT '+JSON.stringify([...a])));window.dataLayer.push=a=>console.log('GT '+JSON.stringify([...a]));";
  const open = async (path = '', flags) => {
    const ctx = await browser.newContext();
    if (flags) await ctx.addInitScript(f => { window.tnFlags = f; }, flags); // PostHog feature flags, as the page would get them
    await ctx.route('https://connect.facebook.net/**', r => r.fulfill({ contentType: 'text/javascript', body: PIXEL }));
    await ctx.route('https://www.googletagmanager.com/**', r => r.fulfill({ contentType: 'text/javascript', body: GTAG }));
    // Analytics events (analytics.js keeps them in window.tnEvents on local copies), also kept across navigations.
    await ctx.addInitScript(() => { window.tnEvents = { push: e => console.log('TN ' + JSON.stringify(e)) }; });
    const p = await ctx.newPage(); p.px = []; p.tn = []; p.gt = [];
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { const t = m.text(); if (t.startsWith('PX ')) p.px.push(JSON.parse(t.slice(3))); if (t.startsWith('TN ')) p.tn.push(JSON.parse(t.slice(3))); if (t.startsWith('GT ')) p.gt.push(JSON.parse(t.slice(3))); });
    await p.goto(SITE + path); await p.waitForSelector('#planNote:not([hidden])'); return p;
  };
  const fired = (p, name) => p.px.filter(a => a[1] === name);
  const events = (p, name) => p.tn.filter(e => e[0] === name).map(e => e[1]);
  // Google Ads conversions sent with one label (the gtag stub logs them once its script loads)
  const conv = (p, label) => p.gt.filter(a => a[0] === 'event' && a[1] === 'conversion' && a[2]?.send_to === 'AW-123456789/' + label).map(a => a[2]);
  const sent = name => capi.filter(e => e.event_name === name);
  const hash = s => crypto.createHash('sha256').update(s).digest('hex');
  // The Conversions API events arrive a moment after the page's (the page doesn't wait for them)
  const waitSent = async (name, n) => { for (let i = 0; i < 50 && sent(name).length < n; i++) await new Promise(r => setTimeout(r, 100)); return sent(name); };
  // One practice: start the next lesson and type its first key.
  const practice = async p => {
    await p.click('#continue');
    if (await p.isHidden('#lesson')) return false;
    await p.evaluate(() => { const key = document.querySelector('#inner .c').textContent; document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); });
    await p.waitForTimeout(200); await p.keyboard.press('Escape'); return true;
  };
  const register = async (p, name) => {
    await p.click('#acctBtn'); await p.click('#authMode [data-v="register"]');
    await p.fill('#user', name); await p.fill('#pass', 'secreto1'); await p.click('#authSubmit'); await p.waitForSelector('#acctBtn .nm');
    await p.waitForTimeout(300);
  };
  try {
    // Guest: five free practices a day, counted in this browser
    const guest = await open('/?fbclid=clickGuest1&gclid=gclidGuest123&utm_source=meta');
    await guest.waitForFunction(() => window.fbq);
    const guestAnon = await guest.evaluate(() => localStorage.getItem('teclado-ciego-anon'));
    check('The pixel starts with this browser\'s anonymous id, hashed, as external_id', guest.px.some(a => a[0] === 'init' && a[2]?.external_id === hash(guestAnon)));
    check('An ad click (fbclid) leaves the _fbc cookie', /^fb\.1\.\d+\.clickGuest1$/.test(await guest.evaluate(() => document.cookie.match(/_fbc=([^;]*)/)?.[1])));
    check('The Meta Pixel starts with the id from the server, without automatic events, and counts the visit', guest.px.some(a => a[0] === 'set' && a[1] === 'autoConfig' && a[2] === false) && guest.px.some(a => a[0] === 'init' && a[1] === '123456789012345') && fired(guest, 'PageView').length === 1);
    await guest.waitForFunction(() => window.gtag && document.querySelector('script[src*="googletagmanager"]'));
    check('The Google Ads tag starts with the id from the server', guest.gt.some(a => a[0] === 'config' && a[1] === 'AW-123456789'));
    check('A Google ad click (gclid) leaves the _gcl_aw cookie Google\'s tag reads', /^GCL\.\d+\.gclidGuest123$/.test(await guest.evaluate(() => document.cookie.match(/_gcl_aw=([^;]*)/)?.[1])));
    check('Guests see how many free practices are left', (await guest.textContent('#planNote')).includes('quedan 5 prácticas de 5'));
    await guest.click('#continue'); await guest.keyboard.press('Escape');
    check('Opening a lesson without typing does not use a practice', (await guest.textContent('#planNote')).includes('quedan 5'));
    for (let i = 0; i < 5; i++) check(`Free practice ${i + 1} of 5`, await practice(guest));
    check('Each practice is a pixel event with its section', fired(guest, 'Practica').length === 5 && fired(guest, 'Practica')[0][2].seccion === 'teclado-ciego');
    check('Each practice is also a Google Ads conversion (Practica → practica)', conv(guest, 'Prac1abc').length === 5);
    check('Each practice is a practice_started event with its lesson and the free practices left', events(guest, 'practice_started').length === 5
      && events(guest, 'practice_started')[0].section === 'teclado-ciego' && events(guest, 'practice_started')[0].kind === 'leccion' && events(guest, 'practice_started')[0].lesson && events(guest, 'practice_started').map(e => e.free_left).join() === '4,3,2,1,0');
    check('The sixth practice shows the plan', !(await practice(guest)) && await guest.isVisible('#planDlg') && (await guest.textContent('#planReason')).includes('5 prácticas'));
    check('The plan is a one-time contribution to the temple', (await guest.textContent('#planPrice')) === '$ 4.900 · pago único' && (await guest.textContent('#planDlg')).includes('Los monjes ninja te lo agradecerán') && (await guest.textContent('#planDlg')).includes('sin suscripción'));
    check('Guests are asked to sign in to pay', (await guest.textContent('#planSubmit')).includes('Crear cuenta'));
    check('Out of guest practices, a free account comes first', await guest.isVisible('#planFree') && (await guest.textContent('#planTitle')) === 'Seguí entrenando gratis'
      && (await guest.textContent('#planFreeText')).includes('10 prácticas por día') && await guest.isVisible('#planOr') && !(await guest.getAttribute('#planSubmit', 'class')).includes('primary'));
    check('Hitting the limit is a pricing_viewed event with its reason', events(guest, 'pricing_viewed').some(e => e.reason === 'limit' && e.payments_on && !e.logged_in));
    check('Seeing the prices is a ViewContent pixel event with its reason', fired(guest, 'ViewContent').some(a => a[2].content_category === 'limit'));
    check('Seeing the prices is the Google Ads conversion the campaign optimizes for (ViewContent → precios)', conv(guest, 'Prec1abc').length >= 1);
    const view = fired(guest, 'ViewContent')[0], viewSent = (await waitSent('ViewContent', 1))[0];
    check('The server sends the same ViewContent, with the same event id', view[3]?.eventID && viewSent?.event_id === view[3].eventID && viewSent.custom_data.content_category === 'limit');
    check('The server ViewContent carries what Meta matches people with', viewSent.user_data.external_id[0] === hash(guestAnon) && viewSent.user_data.client_ip_address === '127.0.0.1'
      && viewSent.user_data.client_user_agent && viewSent.user_data.fbp === 'fb.1.1700000000000.42' && /\.clickGuest1$/.test(viewSent.user_data.fbc) && viewSent.event_source_url === SITE + '/');
    check('Only the page\'s own events can be sent through /api/track', (await fetch(SITE + '/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'Purchase', event_id: 'ev_12345678' }) })).status === 400);
    await guest.click('#planClose'); await guest.reload(); await guest.waitForSelector('#planNote:not([hidden])');
    check('Reloading does not reset the daily limit', (await guest.textContent('#planNote')).includes('ya usaste'));
    check('Without free practices left, the daily plan offers the free account and unlimited access instead of a rest', await guest.isVisible('#dojoUnlock') && (await guest.textContent('#dojoUnlock')) === 'Seguir gratis'
      && (await guest.textContent('#dojoCount')).includes('cuenta gratis') && (await guest.textContent('#dojoCount')).includes('acceso ilimitado') && !(await guest.textContent('#dojo')).includes('descanso'));
    await guest.click('#dojoUnlock');
    check('The plan button opens the free account and the contribution', await guest.isVisible('#planDlg') && await guest.isVisible('#planFree') && (await guest.textContent('#planReason')).includes('5 prácticas'));
    await guest.click('#planClose');
    await guest.click('#cogCta'); await guest.click('#cogContinue');
    check('The interview training uses the same daily limit', await guest.isVisible('#planDlg') && await guest.isHidden('#quiz'));
    await guest.click('#planClose');

    // The experiment iq-desafio-directo ended keeping the original: visitors from the "iq" ad see Ninja mental as always
    const iqPage = await open('/?utm_content=iq#ninja', { 'iq-desafio-directo': 'test' });
    await iqPage.waitForTimeout(300);
    await iqPage.mouse.click(5, 300); await iqPage.waitForTimeout(100);
    check('IQ experiment ended: Ninja mental stays as it was, nothing activated', (await iqPage.textContent('#cogContinue')).includes('sesión 1') && events(iqPage, 'iq_exp_activated').length === 0);

    // /profesional is where the professional ads land: it starts the pixel too, with the same ids as the app
    const proCtx = await browser.newContext();
    await proCtx.route('https://connect.facebook.net/**', r => r.fulfill({ contentType: 'text/javascript', body: PIXEL }));
    await proCtx.route('https://www.googletagmanager.com/**', r => r.fulfill({ contentType: 'text/javascript', body: GTAG }));
    const pro = await proCtx.newPage(); pro.px = []; pro.gt = []; pro.on('pageerror', e => errors.push(e.message));
    pro.on('console', m => { const t = m.text(); if (t.startsWith('PX ')) pro.px.push(JSON.parse(t.slice(3))); if (t.startsWith('GT ')) pro.gt.push(JSON.parse(t.slice(3))); });
    await pro.goto(SITE + '/profesional?fbclid=proClick1&gclid=gclidPro12345&utm_source=google'); await pro.waitForFunction(() => window.fbq);
    await pro.waitForTimeout(200);
    const proAnon = await pro.evaluate(() => localStorage.getItem('teclado-ciego-anon'));
    check('The /profesional page counts the visit in the Meta Pixel, with the anonymous id and the ad click', fired(pro, 'PageView').length === 1
      && pro.px.some(a => a[0] === 'init' && a[1] === '123456789012345' && a[2]?.external_id === hash(proAnon)) && pro.px.some(a => a[0] === 'set' && a[1] === 'autoConfig' && a[2] === false)
      && /^fb\.1\.\d+\.proClick1$/.test(await pro.evaluate(() => document.cookie.match(/_fbc=([^;]*)/)?.[1])));
    check('The /profesional page starts the Google Ads tag and keeps the Google ad click', pro.gt.some(a => a[0] === 'config' && a[1] === 'AW-123456789')
      && /^GCL\.\d+\.gclidPro12345$/.test(await pro.evaluate(() => document.cookie.match(/_gcl_aw=([^;]*)/)?.[1])));
    await proCtx.close();

    // Out of guest practices: create the free account from the plan and keep going
    const nico = await open();
    for (let i = 0; i < 5; i++) await practice(nico);
    check('Without practices left the plan opens', !(await practice(nico)) && await nico.isVisible('#planFree'));
    await nico.click('#planSignup');
    check('The free account button opens the sign-up, saying what the account gives', await nico.isVisible('#authDlg') && (await nico.textContent('#authSubmit')) === 'Crear cuenta' && (await nico.textContent('#authLead')).includes('10 prácticas por día'));
    await nico.fill('#user', 'nico'); await nico.fill('#pass', 'secreto1'); await nico.click('#authSubmit'); await nico.waitForSelector('#acctBtn .nm');
    await nico.waitForFunction(() => document.querySelector('#toast').textContent.includes('más hoy'));
    check('Signing up from the plan says how many practices are left today', (await nico.textContent('#toast')).includes('Tenés 10 prácticas más hoy'));
    check('Signing up from the plan is a CompleteRegistration and a signed_up from the plan', fired(nico, 'CompleteRegistration').length === 1
      && events(nico, 'signup_prompt_clicked').some(e => e.mode === 'register' && e.used_today === 5) && events(nico, 'signed_up').some(e => e.source === 'plan'));
    check('With the free account the practices continue right away', await practice(nico) && (await nico.textContent('#planNote')).includes('quedan 9 prácticas de 10'));

    // Account: the limit is counted on the server
    const ana = await open(); await register(ana, 'ana');
    check('Creating an account is a CompleteRegistration', fired(ana, 'CompleteRegistration').length === 1);
    const reg = fired(ana, 'CompleteRegistration')[0], regSent = (await waitSent('CompleteRegistration', 2)).find(e => e.event_id === reg[3]?.eventID);
    check('Creating an account is a Google Ads conversion, with the same id as transaction_id', conv(ana, 'Reg1abc').length === 1 && conv(ana, 'Reg1abc')[0].transaction_id === reg[3]?.eventID);
    check('The server sends the same CompleteRegistration, with the same event id and the account', regSent && regSent.user_data.external_id.includes(hash('ana')) && regSent.user_data.client_ip_address);
    check('Creating an account is a signed_up event, identified by the username only', events(ana, 'signed_up').length === 1 && events(ana, 'signed_up')[0].source === 'account' && events(ana, '$identify').some(e => e.id === 'ana'));
    check('Accounts see their larger free plan', (await ana.textContent('#planNote')).includes('quedan 10 prácticas de 10'));
    for (let i = 0; i < 10; i++) await practice(ana);
    await ana.waitForTimeout(300);
    const ana2 = await open();
    await ana2.click('#acctBtn'); await ana2.fill('#user', 'ana'); await ana2.fill('#pass', 'secreto1'); await ana2.click('#authSubmit');
    await ana2.waitForFunction(() => document.querySelector('#planNote').textContent.includes('ya usaste'));
    check('The daily limit follows the account to another browser', !(await practice(ana2)) && await ana2.isVisible('#planDlg'));
    check('Paying needs no extra data', (await ana2.textContent('#planSubmit')) === 'Hacer mi aporte con Mercado Pago');
    await Promise.all([ana2.waitForURL(/aporte=ok/), ana2.click('#planSubmit')]);
    await ana2.waitForFunction(() => document.querySelector('#toast').textContent.includes('Gracias'));
    for (let i = 0; i < 50 && !(fired(ana2, 'Purchase').length && conv(ana2, 'Comp1abc').length); i++) await ana2.waitForTimeout(100); // the pixel and gtag scripts load after the page
    const checkout = fired(ana2, 'InitiateCheckout')[0], buy = fired(ana2, 'Purchase');
    check('Going to pay is an InitiateCheckout with the price', checkout && checkout[2].value === 4900 && checkout[2].currency === 'ARS');
    const gPay = conv(ana2, 'Pago1abc')[0], gBuy = conv(ana2, 'Comp1abc');
    check('Going to pay is a Google Ads conversion with the price and the checkout id', gPay?.value === 4900 && gPay.currency === 'ARS' && gPay.transaction_id === checkout[3]?.eventID);
    check('Coming back paid is one Google Ads purchase conversion, with the payment id', gBuy.length === 1 && gBuy[0].value === 4900 && gBuy[0].currency === 'ARS' && gBuy[0].transaction_id === 'pay_pay_1');
    check('The server sends the same InitiateCheckout once the checkout exists', sent('InitiateCheckout').length === 1 && sent('InitiateCheckout')[0].event_id === checkout[3]?.eventID && sent('InitiateCheckout')[0].custom_data.value === 4900);
    check('Going to pay is checkout_clicked (saying where the plan was opened) and checkout_started', events(ana2, 'checkout_clicked').some(e => e.logged_in && e.price === 4900 && e.source === 'limit') && events(ana2, 'checkout_started').length === 1);
    const succeeded = ph.filter(e => e.event === 'payment_succeeded');
    check('The server reports the payment to PostHog once, for the account', succeeded.length === 1 && succeeded[0].distinct_id === 'ana' && succeeded[0].properties.value === 4900 && succeeded[0].properties.source === 'server');
    check('The payment in PostHog has what Mercado Pago keeps and what reaches the account', succeeded[0].properties.net_amount === 4530.5 && succeeded[0].properties.fee === 369.5 && succeeded[0].properties.payment_method === 'account_money' && succeeded[0].properties.installments === 1);
    check('No analytics event carries a password', ![...ana.tn, ...ana2.tn, ...ph].some(e => JSON.stringify(e).includes('secreto1')));
    check('Coming back paid is one Purchase, with the payment as event id', buy.length === 1 && buy[0][2].value === 4900 && buy[0][3].eventID === 'pay_pay_1');
    const purchase = sent('Purchase');
    check('The server reports the same Purchase once to the Conversions API', purchase.length === 1 && purchase[0].event_id === 'pay_pay_1' && purchase[0].custom_data.value === 4900 && purchase[0].custom_data.currency === 'ARS'
      && purchase[0].user_data.fbp === 'fb.1.1700000000000.42' && purchase[0].user_data.external_id.includes(hash('ana')) && purchase[0].user_data.client_user_agent);
    check('The Purchase carries the IP of the person who paid and the site\'s address', purchase[0].user_data.client_ip_address === '127.0.0.1' && purchase[0].event_source_url === SITE + '/');
    check('Coming back from Mercado Pago unlocks everything, with thanks from the monks', await ana2.isHidden('#planNote') && !ana2.url().includes('aporte') && (await ana2.textContent('#toast')).includes('monjes ninja') && (await ana2.textContent('#upgradeLabel')).includes('Ninja'));
    await ana2.reload(); await ana2.waitForSelector('#acctBtn .nm'); await ana2.waitForTimeout(1000);
    check('Reloading does not count the purchase again', fired(ana2, 'Purchase').length === 1);
    check('Unlimited accounts practice without limit', await practice(ana2) && await practice(ana2));
    await ana2.click('#acctBtn'); await ana2.waitForFunction(() => document.querySelector('#planStatus').textContent.includes('para siempre'));
    check('The account shows access forever', await ana2.isHidden('#upgrade'));
    await ana2.click('#acctClose');
    // A checkout abandoned on the computer comes back as "error" while the person already paid from the phone
    await ana2.goto(SITE + '/?aporte=error'); await ana2.waitForFunction(() => document.querySelector('#toast').textContent.includes('Gracias'));
    check('Coming back with "error" from a checkout that the account already paid thanks instead of failing', events(ana2, 'payment_failed').length === 0 && !ana2.url().includes('aporte'));
    check('…and does not count the purchase again', fired(ana2, 'Purchase').length === 1 && conv(ana2, 'Comp1abc').length === 1);
    // Mercado Pago sends the phone back to its default browser, where there is no session
    const elsewhere = await open('/?aporte=ok&external_reference=ana');
    await elsewhere.waitForSelector('#authDlg[open]');
    check('Back from paying without a session: thanks, and the sign-in with the username filled in', (await elsewhere.inputValue('#user')) === 'ana'
      && (await elsewhere.textContent('#toast')).includes('Entrá con tu usuario') && events(elsewhere, 'payment_return_signed_out').some(e => e.status === 'ok') && !elsewhere.url().includes('aporte'));

    // Server side
    const bob = await open(); await register(bob, 'bobo');
    const token = await bob.evaluate(() => localStorage.getItem('teclado-ciego-token'));
    const play = () => fetch(SITE + '/api/billing', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'play' }) });
    const codes = []; for (let i = 0; i < 11; i++) codes.push((await play()).status);
    check('The server allows ten practices to an account and blocks the eleventh', codes.join() === '200,'.repeat(10) + '402');
    const planOf = async t => (await fetch(SITE + '/api/billing', { headers: { Authorization: 'Bearer ' + t } })).json();
    const hook = body => fetch(SITE + '/api/mercadopago', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    // A payment that only arrives by webhook (the user closed Mercado Pago before coming back)
    payments.set('pay_90', { id: 'pay_90', status: 'pending', transaction_amount: 4900, external_reference: 'bobo', metadata: { templo: 'ilimitado' } });
    await hook({ type: 'payment', data: { id: 'pay_90' } });
    check('A pending payment does not unlock', !(await planOf(token)).premium);
    payments.get('pay_90').status = 'approved';
    check('The webhook of an approved payment unlocks for good', (await hook({ type: 'payment', data: { id: 'pay_90' } })).status === 200 && (await planOf(token)).premium && (await planOf(token)).lifetime);
    await hook({ type: 'payment', data: { id: 'pay_90' } });
    check('A purchase that only arrives by webhook is reported from the server, once', sent('Purchase').length === 2 && sent('Purchase')[1].event_id === 'pay_pay_90');
    check('It also reaches PostHog once', ph.filter(e => e.event === 'payment_succeeded').map(e => e.distinct_id).join() === 'ana,bobo');
    // A refund (or a charge back) takes the access away and is negative revenue, once
    payments.get('pay_90').status = 'refunded';
    await hook({ type: 'payment', data: { id: 'pay_90' } }); await hook({ type: 'payment', data: { id: 'pay_90' } });
    const refunds = ph.filter(e => e.event === 'payment_refunded');
    check('A refunded payment takes the unlimited access away', !(await planOf(token)).premium);
    check('A refund reaches PostHog once, as negative revenue', refunds.length === 1 && refunds[0].distinct_id === 'bobo' && refunds[0].properties.value === -4900 && refunds[0].properties.reason === 'refunded');
    check('The webhook says ok to a payment Mercado Pago doesn\'t know (no endless retries)', (await hook({ type: 'payment', data: { id: '123456' } })).status === 200);
    check('Every Conversions API request goes to Test events while META_TEST_EVENT_CODE is set', capiBodies.length && capiBodies.every(b => b.test_event_code === 'TEST123'));
    // A charge of an old monthly subscription is not the one-time payment
    payments.set('pay_91', { id: 'pay_91', status: 'approved', transaction_amount: 5000, external_reference: 'carla' });
    await hook({ type: 'payment', data: { id: 'pay_91' } });
    const carla = await open(); await register(carla, 'carla');
    const carlaToken = await carla.evaluate(() => localStorage.getItem('teclado-ciego-token'));
    check('Other payments with the same reference do not unlock', !(await planOf(carlaToken)).premium);
    // Monthly subscriptions from before keep working until they end
    subs.set('pre_1', { id: 'pre_1', status: 'cancelled', external_reference: 'carla', next_payment_date: new Date(Date.now() + 10 * 864e5).toISOString() });
    await (await fetch(SITE + '/api/billing', { method: 'POST', headers: { Authorization: 'Bearer ' + carlaToken, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sync' }) })).json();
    subs.get('pre_1').status = 'authorized';
    await hook({ type: 'subscription_preapproval', data: { id: 'pre_1' } });
    subs.get('pre_1').status = 'cancelled';
    await hook({ type: 'subscription_preapproval', data: { id: 'pre_1' } });
    const old = await planOf(carlaToken);
    check('An old monthly subscription lasts until its paid period ends', old.premium && !old.lifetime && old.subscription.status === 'cancelled');
    // On a computer, paying from the phone: a QR with the same checkout, and the page unlocks by itself
    const cami = await open(); await register(cami, 'cami');
    await cami.click('#upgradeCta');
    check('On a computer the plan also offers paying from the phone', await cami.isVisible('#planPhone') && await cami.isHidden('#planQrBox'));
    await cami.click('#planPhone'); await cami.waitForSelector('#planQr svg');
    check('Paying from the phone shows a QR, measured as checkout via qr', await cami.isVisible('#planQrBox') && events(cami, 'checkout_started').some(e => e.via === 'qr')
      && events(cami, 'checkout_clicked').some(e => e.via === 'qr') && fired(cami, 'InitiateCheckout').length === 1);
    await cami.waitForFunction(() => !document.querySelector('#planDlg').open, null, { timeout: 15000 });
    check('Once the payment is in, the computer thanks and unlocks by itself', (await cami.textContent('#toast')).includes('Gracias') && await cami.isHidden('#planNote') && fired(cami, 'Purchase').length === 1);
    const phonePage = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
    await phonePage.goto(SITE); await phonePage.evaluate(t => localStorage.setItem('teclado-ciego-token', t), token); // bobo: free plan again after the refund
    await phonePage.reload(); await phonePage.waitForSelector('#acctBtn .nm'); await phonePage.waitForSelector('#planNote:not([hidden])'); await phonePage.evaluate(() => document.querySelector('#upgradeCta').click());
    await phonePage.waitForSelector('#planDlg[open]');
    check('On a phone there is no "pay from the phone" option', await phonePage.isVisible('#planSubmit') && await phonePage.isHidden('#planPhone'));
    // The pricing experiment "precio-oferta-24h" ended: even with the old flag, everyone sees and pays $4.900
    const ended = await open('', { 'precio-oferta-24h': 'test' }); await register(ended, 'fin');
    await ended.click('#upgradeCta'); await ended.waitForTimeout(300);
    const endedToken = await ended.evaluate(() => localStorage.getItem('teclado-ciego-token'));
    const bill = (token, payload) => fetch(SITE + '/api/billing', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r => r.json());
    const stale = await bill(endedToken, { action: 'offer', variant: 'test', start: Date.now() - 25 * 36e5 }); // an old page may still send it
    check('Pricing experiment ended: no offer, the usual price', await ended.isHidden('#planOffer') && (await ended.textContent('#planPrice')).includes('4.900')
      && stale.amount === 4900 && stale.offer === null && events(ended, 'price_offer_seen').length === 0);
    await bill(endedToken, { action: 'buy' });
    check('…and Mercado Pago charges $4.900', prices.at(-1) === 4900);
    const gift = await open(); await register(gift, 'regalo');
    await gift.waitForFunction(() => document.querySelector('#planNote').hidden);
    check('Courtesy users are unlimited', true);
    check('No uncaught browser errors', errors.length === 0);
  } finally {
    await browser.close(); site.close(); fakeMP.close();
    if (errors.length) console.error(errors);
  }
})().catch(err => { console.error(err); process.exit(1); });
