// Paying without an account, signing up with an email, and the ad events around both, against fake Mercado Pago,
// Meta Conversions API and PostHog. Only the API (no browser). Run: npm run test:guest
const http = require('node:http'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const SITE = 'http://127.0.0.1:4293', MP = 'http://127.0.0.1:4294';
Object.assign(process.env, { MP_ACCESS_TOKEN: 'TEST-token', MP_PRICE: '4900', MP_API_BASE: MP, APP_URL: SITE,
  META_PIXEL_ID: '123456789012345', META_CAPI_TOKEN: 'capi-token', META_GRAPH_BASE: MP + '/graph', POSTHOG_KEY: 'phc_test', POSTHOG_INGEST_HOST: MP + '/ph' });
const { createServer } = require('./server.cjs');
const sha = s => crypto.createHash('sha256').update(String(s).trim().toLowerCase()).digest('hex');

// Fake Mercado Pago: creating a preference is as if the person paid right away (approved, with the payer's email).
const payments = new Map(), prefs = [], capi = [], ph = [];
const fake = http.createServer(async (req, res) => {
  let raw = ''; for await (const c of req) raw += c;
  const url = new URL(req.url, MP), send = d => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(d)); };
  if (url.pathname === '/graph/123456789012345/events') { capi.push(...JSON.parse(raw).data); return send({ events_received: 1 }); }
  if (url.pathname === '/ph/i/v0/e/') { ph.push(JSON.parse(raw)); return send({ status: 1 }); }
  if (req.headers.authorization !== 'Bearer TEST-token') { res.statusCode = 401; return send({ message: 'bad token' }); }
  if (req.method === 'POST' && url.pathname === '/checkout/preferences') {
    const body = JSON.parse(raw), id = 'p' + (1e9 + payments.size + 1); prefs.push(body); // long, like Mercado Pago's ids
    payments.set(id, { id, status: 'approved', transaction_amount: body.items[0].unit_price, currency_id: 'ARS', external_reference: body.external_reference,
      metadata: body.metadata, payer: { email: 'Ana.Perez@Example.com' }, date_approved: new Date().toISOString() });
    return send({ id: 'pref_' + id, init_point: MP + '/real', sandbox_init_point: MP + '/sandbox?' + id });
  }
  const pay = /^\/v1\/payments\/(p\d+)$/.exec(url.pathname);
  if (pay && payments.has(pay[1])) return send(payments.get(pay[1]));
  if (url.pathname === '/v1/payments/search') return send({ results: [...payments.values()].filter(p => p.external_reference === url.searchParams.get('external_reference') && p.status === url.searchParams.get('status')) });
  res.statusCode = 404; send({ message: 'not found' });
});

async function api(path, body, token) {
  const res = await fetch(SITE + '/api/' + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body && JSON.stringify(body) });
  return { status: res.status, ...await res.json() };
}
const check = (name, ok) => { assert.ok(ok, name); console.log('PASS', name); };
const track = id => ({ event_id: id, fbp: 'fb.1.1700000000000.42', anon: 'anon-browser-1', url: SITE + '/' });

(async () => {
  const site = createServer();
  await Promise.all([new Promise(r => site.listen(4293, '127.0.0.1', r)), new Promise(r => fake.listen(4294, '127.0.0.1', r))]);
  try {
    // 1. A guest goes to pay: no account needed
    const buy = await api('billing', { action: 'buy', track: track('ev_checkout_guest1'), ph: 'ph-anon-1' });
    check('a guest gets a checkout and a claim reference', buy.status === 200 && /^g-[a-f0-9]{32}$/.test(buy.claim) && buy.url.startsWith(MP + '/sandbox'));
    const pref = prefs.at(-1);
    check('the payment is referenced to the claim, and the way back carries it', pref.external_reference === buy.claim && pref.back_urls.success.endsWith('/?aporte=ok&claim=' + buy.claim) && pref.back_urls.failure.includes('claim=' + buy.claim));
    check('the item no longer says "aporte"', !/aporte/i.test(pref.items[0].description) && pref.items[0].unit_price === 4900 && pref.metadata.templo === 'ilimitado');
    const ic = capi.filter(e => e.event_name === 'InitiateCheckout');
    check('InitiateCheckout reaches Meta from the server with the page\'s event id', ic.length === 1 && ic[0].event_id === 'ev_checkout_guest1' && ic[0].user_data.fbp === 'fb.1.1700000000000.42' && ic[0].custom_data.value === 4900);

    // 2. Coming back from Mercado Pago: the guest is unlimited in this browser, and the purchase is reported once
    const back = await api('billing', { action: 'guest', claim: buy.claim, sync: true });
    const payId = [...payments.keys()][0];
    check('the guest is unlimited after paying', back.premium === true && back.guestPaid === true && back.claimed === false);
    check('the page gets the same Purchase id as the server (pixel and Google Ads dedupe)', back.purchase?.id === 'pay_' + payId && back.purchase.value === 4900);
    check('the payer\'s email is suggested for the account', back.email === 'ana.perez@example.com');
    await api('mercadopago?type=payment&id=' + payId, {}); // the webhook arrives later
    const purchases = capi.filter(e => e.event_name === 'Purchase');
    check('Purchase reaches Meta once, with the payer\'s email hashed', purchases.length === 1 && purchases[0].event_id === 'pay_' + payId && purchases[0].user_data.em?.[0] === sha('ana.perez@example.com') && purchases[0].user_data.fbp === 'fb.1.1700000000000.42');
    const paid = ph.filter(e => e.event === 'payment_succeeded');
    check('PostHog gets payment_succeeded once, for the browser that paid', paid.length === 1 && paid[0].distinct_id === 'ph-anon-1' && paid[0].properties.guest === true);
    check('an unknown or made-up claim gives nothing', (await api('billing', { action: 'guest', claim: 'g-' + '0'.repeat(32) })).premium === false
      && (await api('billing', { action: 'guest', claim: 'ana' })).status === 400);
    check('a guest who already paid is not sent to pay again', (await api('billing', { action: 'buy', claim: buy.claim })).status === 409);

    // 3. Signing up with an email keeps the access in the account
    const reg = await api('auth', { action: 'register', email: 'Ana.Perez@example.com', password: 'secreto1', claim: buy.claim, track: track('ev_registro_000001') });
    check('signing up with an email makes the username from it, and claims the payment', reg.status === 200 && reg.user.name === 'ana.perez' && reg.claimed === true);
    const me = await api('billing', undefined, reg.token);
    check('the account is unlimited for good, with the same Purchase id', me.premium === true && me.lifetime === true && me.purchase?.id === 'pay_' + payId);
    const cr = capi.filter(e => e.event_name === 'CompleteRegistration');
    check('CompleteRegistration reaches Meta with its event id and the email hashed', cr.length === 1 && cr[0].event_id === 'ev_registro_000001' && cr[0].user_data.em?.[0] === sha('ana.perez@example.com'));
    const after = await api('billing', { action: 'guest', claim: buy.claim });
    check('once claimed, the guest browser is asked to sign in instead', after.premium === false && after.claimed === true && after.email === null);
    const other = await api('auth', { action: 'register', email: 'otra@example.com', password: 'secreto2', claim: buy.claim });
    check('a claimed payment can\'t be claimed by another account', other.status === 200 && other.claimed === false && (await api('billing', undefined, other.token)).premium === false);
    check('one account per email', (await api('auth', { action: 'register', email: 'ana.perez@example.com', password: 'secreto3' })).status === 409);
    check('a second Ana gets another username', (await api('auth', { action: 'register', email: 'ana.perez@otro.com', password: 'secreto4' })).user?.name.startsWith('ana.perez') === true);
    check('purchase events were not repeated by the claim', capi.filter(e => e.event_name === 'Purchase').length === 1 && ph.filter(e => e.event === 'payment_succeeded').length === 1);

    // 4. Signing in: with the email or the username
    check('sign in with the email', (await api('auth', { action: 'login', username: 'ANA.PEREZ@example.com', password: 'secreto1' })).user?.name === 'ana.perez');
    check('sign in with the username', (await api('auth', { action: 'login', username: 'ana.perez', password: 'secreto1' })).user?.name === 'ana.perez');
    check('a wrong password is refused', (await api('auth', { action: 'login', username: 'ana.perez@example.com', password: 'nope123' })).status === 401);
    check('an unknown email is refused', (await api('auth', { action: 'login', username: 'nadie@example.com', password: 'nope123' })).status === 401);

    // 5. Accounts as before: a username still works, and paying from an account is unchanged
    const legacy = await api('auth', { action: 'register', username: 'juan_77', password: 'secreto5' });
    check('signing up with a username still works', legacy.status === 200 && legacy.user.name === 'juan_77');
    const acctBuy = await api('billing', { action: 'buy', track: track('ev_checkout_acct01') }, legacy.token);
    const acctPref = prefs.at(-1);
    check('an account\'s checkout is referenced to the account, with no claim', !acctBuy.claim && acctPref.external_reference === 'juan_77' && acctPref.back_urls.success === SITE + '/?aporte=ok');
    const acctMe = await api('billing', { action: 'sync' }, legacy.token);
    check('the account is unlimited after paying', acctMe.premium === true && capi.filter(e => e.event_name === 'Purchase').length === 2);

    // 6. A guest who pays and then signs in to an existing account
    const buy2 = await api('billing', { action: 'buy', ph: 'ph-anon-2' });
    await api('billing', { action: 'guest', claim: buy2.claim, sync: true });
    const login2 = await api('auth', { action: 'login', username: 'otra@example.com', password: 'secreto2', claim: buy2.claim });
    check('signing in with a paid claim moves the access to that account', login2.claimed === true && (await api('billing', undefined, login2.token)).premium === true);

    // 7. A refund takes the access away from the account that claimed it
    const refundId = [...payments.keys()].at(-1);
    payments.get(refundId).status = 'refunded';
    await api('mercadopago?type=payment&id=' + refundId, {});
    check('a refunded guest payment takes the access away from its account', (await api('billing', undefined, login2.token)).premium === false
      && ph.some(e => e.event === 'payment_refunded' && e.distinct_id === 'otra'));
    console.log('\nAll guest checks passed');
  } finally { site.close(); fake.close(); }
})().catch(error => { console.error(error); process.exit(1); });
