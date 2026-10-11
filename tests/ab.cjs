// A/B test of the home (middleware.js + analytics.js): who gets which home at "/", the cookie, robots, QA visits,
// the exposure reported to PostHog, and that the ads' landing keeps working in both. Run: node tests/ab.cjs
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { createServer } = require('./server.cjs');
const SITE = 'http://127.0.0.1:4198';
const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

(async () => {
  const errors = [];
  const check = (name, ok) => { assert.ok(ok, name); console.log('PASS', name); };
  const { decide, default: middleware, config } = await import('../middleware.js');
  const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 340.0.0.22.109';
  const at = (url, extra = {}) => decide({ url: 'https://www.temploninja.com' + url, cookie: '', userAgent: iphone, env: { AB_HOME_NUEVA_SHARE: '0.5' }, random: () => 0.9, ...extra });

  // The decision
  check('Only "/" goes through the middleware', config.matcher === '/');
  check('Off by default: the current home and no cookie, so nobody is assigned before the launch', JSON.stringify(decide({ url: 'https://www.temploninja.com/', cookie: '', userAgent: iphone, env: {} })) === JSON.stringify({ variant: 'actual', cookies: [] }));
  check('On: a new visitor gets a variant and keeps it in a 90-day cookie', at('/', { random: () => 0.1 }).variant === 'nueva' && at('/', { random: () => 0.1 }).cookies[0] === 'tn_home=nueva; Path=/; Max-Age=7776000; SameSite=Lax; Secure' && at('/').variant === 'actual' && at('/').cookies[0].startsWith('tn_home=actual;'));
  check('The cookie wins over the dice, and nothing is rewritten', at('/', { cookie: 'a=1; tn_home=nueva; b=2', random: () => 0.9 }).variant === 'nueva' && at('/', { cookie: 'tn_home=nueva' }).cookies.length === 0 && at('/', { cookie: 'tn_home=actual', random: () => 0.1 }).variant === 'actual');
  check('A broken cookie is replaced by a fresh assignment', at('/', { cookie: 'tn_home=otra', random: () => 0.1 }).variant === 'nueva');
  for (const ua of ['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'meta-externalagent/1.1', 'AdsBot-Google (+http://www.google.com/adsbot.html)', 'WhatsApp/2.23.20.0', 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 Chrome-Lighthouse', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'])
    check('Robots get the current home and no cookie: ' + ua.slice(0, 40), JSON.stringify(at('/', { userAgent: ua, random: () => 0.1 })) === JSON.stringify({ variant: 'actual', cookies: [] }));
  for (const ua of [iphone, 'Mozilla/5.0 (Linux; Android 13; CUBOT X70 Build/TP1A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.43.108;]', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'])
    check('People are in the test: ' + ua.slice(0, 50), at('/', { userAgent: ua, random: () => 0.1 }).variant === 'nueva');
  check('?home= picks one by hand and marks the browser as QA', JSON.stringify(at('/?home=nueva').cookies) === JSON.stringify(['tn_home=nueva; Path=/; Max-Age=7776000; SameSite=Lax; Secure', 'tn_home_qa=1; Path=/; Max-Age=7776000; SameSite=Lax; Secure']) && at('/?home=actual', { cookie: 'tn_home=nueva' }).variant === 'actual');
  check('AB_HOME_FORCE sends everyone to one home (to stop it or ship it)', at('/', { env: { AB_HOME_FORCE: 'nueva' }, cookie: 'tn_home=actual' }).variant === 'nueva' && at('/', { env: { AB_HOME_FORCE: 'actual', AB_HOME_NUEVA_SHARE: '0.5' }, random: () => 0.1 }).variant === 'actual');
  const share = Array.from({ length: 20000 }, () => decide({ url: 'https://x/', cookie: '', userAgent: iphone, env: { AB_HOME_NUEVA_SHARE: '0.5' } }).variant).filter(v => v === 'nueva').length / 20000;
  check(`Half and half (${(share * 100).toFixed(1)}% to the new home)`, share > 0.48 && share < 0.52);
  process.env.AB_HOME_NUEVA_SHARE = '0.5';
  const rw = await middleware(new Request('https://www.temploninja.com/?utm_source=meta&fbclid=abc#x', { headers: { cookie: 'tn_home=nueva', 'user-agent': iphone } }));
  check('The new home is a rewrite of the same address, with its parameters', rw.headers.get('x-middleware-rewrite') === 'https://www.temploninja.com/nueva.html?utm_source=meta&fbclid=abc' && !rw.headers.get('location') && rw.headers.get('cache-control') === 'private, no-cache');
  const nx = await middleware(new Request('https://www.temploninja.com/', { headers: { 'user-agent': iphone } }));
  check('The current home goes on as is (and a new visitor gets the cookie)', nx.headers.get('x-middleware-next') === '1' && /^tn_home=(nueva|actual);/.test(nx.headers.get('set-cookie')) && (nx.headers.get('set-cookie').startsWith('tn_home=actual') || !!nx.headers.get('x-middleware-rewrite')));
  const post = await middleware(new Request('https://www.temploninja.com/', { method: 'POST' }));
  check('Anything but GET passes through untouched', post.headers.get('x-middleware-next') === '1' && !post.headers.get('set-cookie'));

  // In the browser: the local server decides "/" with the same function
  const server = createServer(); await new Promise(r => server.listen(4198, '127.0.0.1', r));
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    const visit = async (home, path = '/', opts = {}) => {
      const ctx = await browser.newContext({ userAgent: CHROME, ...opts }); // headless Chromium says HeadlessChrome: a robot for the middleware
      if (home) await ctx.addCookies([{ name: 'tn_home', value: home, url: SITE }]);
      const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message));
      await p.goto(SITE + path); await p.waitForLoadState('networkidle');
      return p;
    };
    const exposures = p => p.evaluate(() => window.tnEvents.filter(e => e[0] === 'home_ab_exposure').map(e => e[1]));
    const ad = '/?utm_source=meta&utm_medium=paid_social&utm_campaign=tn_registro_ar&utm_content=velocidad&fbclid=IwAR123';

    const n = await visit('nueva', ad);
    check('With the cookie, "/" shows the new home at the same address', await n.evaluate(() => !!window.tnLayout && document.title === 'Templo Ninja' && !!document.querySelector('.nv-all')) && n.url() === SITE + ad);
    check('…its exposure is reported once, as the test variant', JSON.stringify(await exposures(n)) === JSON.stringify([{ variant: 'test', home: 'nueva', '$feature/home-nueva': 'test' }]));
    check('…and the ad click is kept for Meta (_fbc from the fbclid)', (await n.context().cookies()).some(c => c.name === '_fbc' && c.value.endsWith('.IwAR123')));
    await n.click('.nv-links [data-go="teclado"]');
    check('Its sections work at "/"', new URL(n.url()).pathname === '/' && new URL(n.url()).hash === '#teclado' && await n.isVisible('#path'));
    await n.goBack();
    check('…and Back stays in it', new URL(n.url()).pathname === '/' && !new URL(n.url()).hash && await n.isVisible('#heroTitle'));
    await n.goto(SITE + '/?aporte=ok'); await n.waitForLoadState('networkidle');
    check('Coming back from Mercado Pago (/?aporte=ok) it is still the new home', await n.evaluate(() => !!window.tnLayout));

    const a = await visit('actual', ad);
    check('With the other cookie, "/" is the current home', await a.evaluate(() => !window.tnLayout && !!document.getElementById('path')) && a.url() === SITE + ad);
    check('…with its exposure as control', JSON.stringify(await exposures(a)) === JSON.stringify([{ variant: 'control', home: 'actual', '$feature/home-nueva': 'control' }]));

    const deep = await visit('nueva', '/?utm_content=iq#ninja');
    check('The IQ ads (#ninja) open Ninja mental in the new home too', await deep.evaluate(() => !document.querySelector('[data-view-of="mente"]').hidden));
    const sim = await visit('nueva', '/?simulacro=meli#ninja');
    check('…and the Google ad of the mock test (?simulacro=meli) opens it', await sim.waitForFunction(() => window.tnApp?.mode() === 'quiz', null, { timeout: 5000 }).then(() => true, () => false));

    const other = await visit('nueva', '/profesional');
    check('Other pages do not count as an exposure', (await exposures(other)).length === 0);

    const hidden = await browser.newContext({ userAgent: CHROME }); await hidden.addCookies([{ name: 'tn_home', value: 'nueva', url: SITE }]);
    await hidden.addInitScript(() => { let v = 'hidden'; Object.defineProperty(document, 'visibilityState', { get: () => v }); window.__show = () => { v = 'visible'; document.dispatchEvent(new Event('visibilitychange')); }; });
    const hp = await hidden.newPage(); await hp.goto(SITE + ad); await hp.waitForLoadState('networkidle');
    check('A page preloaded in the background (Instagram, Facebook) is not an exposure…', (await exposures(hp)).length === 0);
    await hp.evaluate(() => window.__show());
    check('…until it is on screen', (await exposures(hp)).length === 1);

    const qa = await visit(null, '/?home=nueva');
    check('?home=nueva shows the new home and marks the browser as QA', await qa.evaluate(() => !!window.tnLayout) && (await qa.context().cookies()).some(c => c.name === 'tn_home_qa'));
    check('…which reports no exposure', (await exposures(qa)).length === 0);
    await qa.goto(SITE + '/'); await qa.waitForLoadState('networkidle');
    check('…also on later visits, which keep that home', await qa.evaluate(() => !!window.tnLayout) && (await exposures(qa)).length === 0);

    const bot = await visit(null, '/', { userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' });
    check('Meta\'s crawler gets the current home and no cookie', await bot.evaluate(() => !window.tnLayout) && !(await bot.context().cookies()).some(c => c.name === 'tn_home'));

    const fresh = await visit(null, ad);
    check('A new visitor is assigned at "/" and the cookie matches what was shown', await fresh.evaluate(() => { const v = (document.cookie.match(/tn_home=(\w+)/) || [])[1]; return (v === 'nueva') === !!window.tnLayout && !!v; }));
    process.env.AB_HOME_NUEVA_SHARE = '';
    const off = await visit(null, ad);
    check('With the test off, a new visitor gets the current home and no cookie', await off.evaluate(() => !window.tnLayout) && !(await off.context().cookies()).some(c => c.name === 'tn_home') && (await exposures(off)).length === 0);
    process.env.AB_HOME_NUEVA_SHARE = '1';
    const all = await visit(null, '/');
    check('With the share at 1, everyone new gets the new home', await all.evaluate(() => !!window.tnLayout));

    check('No page errors', errors.length === 0 || (console.log(errors), false));
  } finally {
    await browser.close(); server.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
