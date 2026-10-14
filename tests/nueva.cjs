// The new layout (/nueva): focused screens, profile-owned Dojo, the "Seguí acá" card, lessons and quizzes with the
// shared engine, the belts, quick challenges, Mi dojo and its battles by link, progress checks, Agregar a mi inicio (PWA), dark mode, the phone and its bridge to the computer. Run: npm test (needs Playwright's Chromium).
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { createServer } = require('./server.cjs');
const SITE = 'http://127.0.0.1:4197';
const check = (name, ok) => { assert.ok(ok, name); console.log('PASS', name); };

(async () => {
  const server = createServer(); await new Promise(r => server.listen(4197, '127.0.0.1', r));
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const errors = [];
  const open = async (path = '/nueva', opts = {}) => {
    const ctx = await browser.newContext(opts);
    await ctx.addInitScript(() => { window.tnEvents = { push: e => (window.__ev = window.__ev || []).push(e) }; });
    const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message));
    await p.goto(SITE + path); await p.waitForLoadState('networkidle'); return p;
  };
  const visible = (p, sel) => p.isVisible(sel);
  const events = (p, name) => p.evaluate(n => (window.__ev || []).filter(e => e[0] === n).map(e => e[1]), name);
  // A section is "on screen" when its top is in the upper half of the window
  const onScreen = (p, sec) => p.waitForFunction(s => { const r = document.querySelector(`[data-view-of="${s}"]`).getBoundingClientRect(); return r.top < innerHeight * .5 && r.bottom > 90; }, sec, { timeout: 5000 }).then(() => true, () => false);
  const current = (p, sel = '.nv-links') => p.evaluate(sel => document.querySelector(`${sel} [aria-current]`)?.dataset.go, sel);
  try {
    const p = await open();
    check('/nueva is not indexed', await p.getAttribute('meta[name="robots"]', 'content') === 'noindex, nofollow');
    check('Page IDs are unique', await p.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(e => e.id); return new Set(ids).size === ids.length; }));
    check('Home shows the two entries and live rankings, with focused screens hidden', await visible(p, '#heroTitle') && await visible(p, '#continue') && await visible(p, '#homeTypingRank') && !(await visible(p, '#path')) && !(await visible(p, '#cogPath')));
    check('Challenges are inside Mente and Dojo inside Profile', await p.evaluate(() => !!document.querySelector('[data-view-of=mente] [data-view-of=desafios]') && !!document.querySelector('[data-profile-panel=dojo] #midojo') && !document.querySelector('.nv-links [data-go=dojo]')));
    const btns = sel => p.$$eval(sel, bs => bs.map(b => b.textContent.trim()).join(' | '));
    check('Inicio: Teclado offers Entrenar, Ver más and Medir velocidad', (await btns('#sections .nv-door:nth-child(1) .nv-ctas .btn')) === 'Entrenar | Ver más | Medir velocidad');
    check('…and Mente offers Entrenar, Desafío IQ, Batallas and Entrenar tests de empresas', (await btns('#sections .nv-door:nth-child(2) .nv-ctas .btn')) === 'Entrenar | Desafío IQ | Batallas | Entrenar tests de empresas' && (await p.getAttribute('#nvMentalCo', 'href')) === '/profesional');
    check('Inicio has no "Todos" section', !(await p.$('.nv-all')) && !(await p.$('#sections [data-all]')));
    check('Apoyá el templo is a button in the header', await visible(p, '.nv-top #upgradeCta') && (await p.textContent('#upgradeCta')).includes('Apoyá'));
    await p.click('#nvTkMore');
    check('Ver más opens the training of Teclado, like Entrenar', await onScreen(p, 'teclado') && await visible(p, '#path') && (await events(p, 'home_cta')).some(e => e.cta === 'teclado_ver_mas'));
    await p.click('[data-go="inicio"]'); await p.click('#nvMentalIq');
    check('Desafío IQ opens its tab in Mente', await onScreen(p, 'mente') && await visible(p, '#maxBtn'));
    await p.click('[data-go="inicio"]'); await p.click('#scMax');
    check('Batallas opens the quick challenges in Mente, now called Batallas', await onScreen(p, 'desafios') && await visible(p, '#nvGameIq') && (await p.textContent('#quickTitle')) === 'Batallas' && (await p.textContent('[data-view-of="mente"] [role="tab"][data-sub="relampago"]')) === 'Batallas' && (await events(p, 'home_cta')).some(e => e.cta === 'mente_batallas'));
    await p.click('[data-go="inicio"]');
    await p.click('#continue');
    check('"Seguí acá" points to the first lesson, in the white belt', (await p.textContent('#tkNextTitle')).includes('Lección 1') && (await p.textContent('#tkNextEyebrow')).includes('Cinturón blanco') && (await p.textContent('#tkCount')) === '0 de 6 en este cinturón' && (await p.$$('#tkKeys kbd')).length === 2);
    check('Teclado is seven belts with the 66 lessons, like Ninja mental', (await p.$$eval('#path > .group.tn-belt', gs => gs.map(g => g.dataset.belt).join())) === 'blanco,amarillo,naranja,verde,azul,marron,negro' && (await p.$$('#path .lc')).length === 66 && !(await visible(p, '#tkBeltsBox')) && (await p.textContent('#learningTitle')).includes('7 cinturones'));
    check('The belt in progress is open and the others are one line', !(await p.getAttribute('#path [data-belt="blanco"]', 'class')).includes('nv-folded') && (await p.getAttribute('#path [data-belt="amarillo"]', 'class')).includes('nv-folded') && (await p.textContent('#path [data-belt="verde"]')).includes('8 lecciones'));
    await p.click('.nv-links [data-go="teclado"]');
    check('The header takes you to a section and says where you are', await onScreen(p, 'teclado') && p.url().endsWith('/nueva#teclado') && await current(p) === 'teclado' && (await events(p, 'nav_section')).some(e => e.section === 'teclado'));
    await p.click('[data-view-of="teclado"] [role="tab"][data-sub="medir"]');
    check('The Medir tab of Teclado shows the speed tests', await visible(p, '#methods') && !(await visible(p, '#path')));
    await p.click('[data-view-of="teclado"] [role="tab"][data-sub="ajustes"]');
    check('The Ajustes tab has the keyboard settings', await visible(p, '#layout') && await visible(p, '#kbMode'));
    await p.click('[data-view-of="teclado"] [role="tab"][data-sub="entrenar"]');
    await p.click('.nv-links [data-go="mente"]');
    check('Mente: tracks and the next session', await onScreen(p, 'mente') && p.url().endsWith('#ninja') && await visible(p, '#cogContinue'));
    await p.click('.nv-links [data-go="ranking"]');
    check('Ranking', await onScreen(p, 'ranking'));

    await p.click('.nv-links [data-go="teclado"]');
    // A lesson from "Seguí acá", and back to the same section
    await p.click('#tkContinue');
    check('Continuar opens the lesson', await visible(p, '#lesson') && !(await visible(p, '#home')) && (await p.textContent('#lName')).includes('F'));
    await p.evaluate(() => { const key = document.querySelector('#inner .c').textContent; document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); });
    await p.click('#back');
    check('Leaving the lesson goes back to Teclado', await visible(p, '#home') && await onScreen(p, 'teclado'));
    await p.click('[data-go="inicio"]'); await p.click('#testBtn'); await p.getByRole('button', { name: 'Medir a ciegas', exact: true }).click();
    check('On a computer, Medir mi velocidad starts the 1-minute test', await visible(p, '#lesson') && (await p.textContent('#lGroup')).includes('1 minuto') );
    await p.click('#back');
    check('…and coming back shows the speed tests', await onScreen(p, 'teclado') && await visible(p, '#methods'));
    await p.click('[data-view-of="teclado"] [role="tab"][data-sub="entrenar"]');
    await p.click('.nv-links [data-go="mente"]'); await p.click('[data-view-of="mente"] [role="tab"][data-sub="relampago"]'); await p.click('#nvGameIq');
    check('Desafío IQ ninja opens the 5-minute challenge', await visible(p, '#quiz') && await visible(p, '#qGo'));
    await p.click('#qBack');
    check('Leaving it goes back to Mente', await visible(p, '#home') && await onScreen(p, 'mente'));
    check('A computer gets no phone bridge', !(await visible(p, '#nvBridge')) && !(await visible(p, '#nvHeroSave')));

    // Links into a section
    const q = await open('/nueva#ninja');
    check('/nueva#ninja opens on Mente', await onScreen(q, 'mente'));
    const r = await open('/nueva#teclado');
    check('/nueva#teclado opens on Teclado', await onScreen(r, 'teclado'));

    // Optional dark mode, remembered
    check('It starts light', await p.getAttribute('html', 'data-theme') === 'light');
    await p.click('.nv-profile-link'); await p.click('[data-profile="preferencias"]'); await p.click('#nvTheme');
    check('The moon button switches to dark', await p.getAttribute('html', 'data-theme') === 'dark' && await p.getAttribute('#nvTheme', 'aria-pressed') === 'true');
    await p.reload(); await p.waitForLoadState('networkidle');
    check('…and dark mode survives a reload', await p.getAttribute('html', 'data-theme') === 'dark');

    // Phone: tab bar, compact groups and the bridge to the computer
    const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
    const m = await open('/nueva', phone);
    check('On a phone there is a tab bar and the page does not scroll sideways', await visible(m, '.nv-tabbar') && await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await m.tap('.nv-tabbar [data-go="mente"]');
    check('The tab bar takes you to a section', await onScreen(m, 'mente') && await current(m, '.nv-tabbar') === 'mente');
    await m.tap('.nv-tabbar [data-go="teclado"]');
    check('The groups are compact: the one in progress open, the others one line', await m.isVisible('#path .group:first-child .lc') && !(await m.isVisible('#path .group:nth-child(2) .lc')) && await m.isVisible('#path .group:nth-child(2) .nv-fold-btn'));
    await m.tap('#path .group:nth-child(2) .nv-fold-btn');
    check('…and open with a tap', await m.isVisible('#path .group:nth-child(2) .lc'));
    check('The phone gets the bridge: why a keyboard, the phone challenge and saving the course', await m.isVisible('#nvBridge') && (await m.textContent('#nvHeroSpeed')).includes('Desafío de celular') && await m.isVisible('#nvSave') && (await events(m, 'mobile_bridge_shown')).length === 1);
    await m.tap('#nvSave');
    check('Saving the course offers WhatsApp, mail and the link, and an account', await m.isVisible('#nvSavePanel') && await m.isVisible('#nvWa') && await m.isVisible('#nvMail') && await m.isVisible('#nvCopy') && await m.isVisible('#nvSaveAccount'));
    const waUrl = new Promise(res => m.context().once('page', pg => res(pg.url())));
    await m.tap('#nvWa');
    check('WhatsApp carries the link to the course for the computer', decodeURIComponent(await waUrl).includes('/nueva?desde=celu#teclado') && (await events(m, 'mobile_bridge_action')).some(e => e.action === 'whatsapp'));
    // The phone typing challenge: its own result, not the course's
    await m.tap('#nvCelu');
    check('The phone challenge opens on its own screen', await m.isVisible('#game') && (await m.textContent('#gameTitle')) === 'Desafío de celular');
    await m.tap('#gameGo');
    await m.evaluate(() => { const text = [...document.querySelectorAll('#gmCeluText span')].map(s => s.textContent).join(''); const inp = document.getElementById('gmCeluIn'); inp.value = text.slice(0, 60); inp.dispatchEvent(new Event('input')); });
    await m.waitForSelector('.gm-result', { timeout: 35000 });
    check('After 30 seconds: words per minute on the phone, kept apart from the course', (await m.textContent('.gm-score')).includes('ppm') && (await m.textContent('.gm-compare')).includes('aparte de la de la compu') && await m.evaluate(() => !JSON.parse(localStorage.getItem('teclado-ciego-v1') || '{}').tests?.length));
    check('…and it offers saving the course for the computer', (await m.textContent('#gameCta')).includes('Guardarme el curso'));
    await m.tap('#gameCta');
    check('which opens the saving options in Teclado', await m.isVisible('#nvSavePanel') && await onScreen(m, 'teclado'));
    await m.tap('#nvHasKb');
    check('"Tengo teclado físico" turns the bridge off', !(await m.isVisible('#nvBridge')) && (await m.textContent('#nvHeroSpeed')).includes('Medir mi velocidad'));
    // On the computer, from the saved link
    const back = await open('/nueva?desde=celu#teclado');
    check('Arriving on the computer from the phone link says hello, and is measured', await back.isVisible('#nvWelcome') && (await events(back, 'continued_from_phone')).length === 1 && back.url().endsWith('/nueva#teclado'));

    // Desafíos rápidos
    const g = await open('/nueva#desafios');
    check('The challenges section lists the four quick challenges', (await g.$$('[data-view-of="desafios"] .nv-game[data-game]')).length === 4);
    // Chimp test: the first round right, then three mistakes
    await g.click('#desafios .nv-game[data-game="chimpance"]');
    check('A challenge opens its own screen, without the tab bar', await g.isVisible('#game') && !(await g.isVisible('#home')) && g.url().endsWith('#juego-chimpance'));
    await g.click('#gameGo');
    for (let n = 1; n <= 4; n++) await g.click(`.gm-cell[data-n="${n}"]`);
    await g.waitForFunction(() => document.querySelectorAll('.gm-cell').length === 5);
    check('Getting the round right adds a number', true);
    for (let i = 0; i < 3; i++) { await g.waitForSelector('.gm-cell[data-n="2"]:not(.done)'); await g.click('.gm-cell[data-n="2"]'); await g.waitForTimeout(800); }
    await g.waitForSelector('.gm-result');
    check('Three mistakes end it with the score and the chimp to beat', (await g.textContent('.gm-score')).trim().startsWith('4') && (await g.textContent('.gm-compare')).includes('Ayumu') && (await events(g, 'game_completed')).some(e => e.game === 'chimpance' && e.score === 4));
    await g.click('#gameOut');
    check('Leaving goes back to the challenges, with the best score on the tile', await onScreen(g, 'desafios') && (await g.textContent('#desafios .nv-game[data-game="chimpance"]')).includes('Tu mejor: 4'));
    // Number memory: one right, one wrong
    await g.evaluate(() => { Math.random = () => 0; });
    await g.click('#desafios .nv-game[data-game="numeros"]'); await g.click('#gameGo');
    check('The number shows first', (await g.textContent('.gm-digits')) === '100');
    await g.waitForSelector('#gmNumIn'); await g.fill('#gmNumIn', '100'); await g.press('#gmNumIn', 'Enter');
    check('Typing it right says so', (await g.textContent('.gm-check')).includes('Bien'));
    await g.click('#gmNumNext'); await g.waitForSelector('#gmNumIn', { timeout: 8000 }); await g.fill('#gmNumIn', '9'); await g.press('#gmNumIn', 'Enter');
    await g.click('#gmNumNext');
    check('A mistake ends it: the score is the longest number remembered', (await g.textContent('.gm-score')).trim().startsWith('3'));
    // Reaction time: too early, then five tries (with the shortest waits)
    await g.click('#gameOut'); await g.click('#desafios .nv-game[data-game="reflejos"]'); await g.click('#gameGo');
    await g.click('.gm-react');
    check('Tapping before green does not count', (await g.textContent('.gm-react')).includes('Muy pronto'));
    await g.click('.gm-react');
    for (let i = 0; i < 5; i++) { await g.waitForSelector('.gm-react.go', { timeout: 6000 }); await g.click('.gm-react'); if (i < 4) await g.click('.gm-react'); }
    await g.waitForSelector('.gm-result');
    check('Five tries give the average in milliseconds', /\d+/.test(await g.textContent('.gm-score')) && (await g.textContent('.gm-score')).includes('ms'));
    // Visual memory: clicking the lit squares passes the level
    await g.evaluate(() => { Math.random = (() => { let x = 7; return () => (x = (x * 9301 + 49297) % 233280) / 233280; })(); }); // varied, but repeatable
    await g.click('#gameOut'); await g.click('#desafios .nv-game[data-game="visual"]'); await g.click('#gameGo');
    const lit = await g.$$eval('.gm-sq.lit', els => els.map(e => [...e.parentNode.children].indexOf(e)));
    await g.waitForFunction(() => !document.querySelector('.gm-vis.show'));
    for (const i of lit) await g.click(`.gm-sq:nth-child(${i + 1})`);
    await g.waitForFunction(() => document.querySelector('#gameLive').textContent.includes('Nivel 2'));
    check('Visual memory moves to the next level', true);
    await g.click('#gameBack');
    check('The back button leaves the challenge', await g.isVisible('#home'));
    const dl = await open('/nueva#juego-reflejos');
    check('A link to a challenge (for sharing) opens it', await dl.isVisible('#game') && (await dl.textContent('#gameTitle')) === 'Reflejos');

    // Mi dojo and the battles: my mark → a challenge by link → the friend's result → the revenge
    const chimp = async (pg, rounds) => { // rounds right from 4 numbers on, then three mistakes: the score is 3 + rounds
      for (let n = 4; n < 4 + rounds; n++) { await pg.waitForFunction(k => document.querySelectorAll('.gm-cell').length === k && !document.querySelector('.gm-cell.done'), n); for (let i = 1; i <= n; i++) await pg.click(`.gm-cell[data-n="${i}"]`); }
      for (let i = 0; i < 3; i++) { await pg.waitForSelector('.gm-cell[data-n="2"]:not(.done):not(.wrong)'); await pg.click('.gm-cell[data-n="2"]'); await pg.waitForTimeout(750); }
      await pg.waitForSelector('.gm-result');
    };
    const A = await open('/nueva#dojo');
    check('Mi dojo: a guest ninja, its level and the next reachable goal', await onScreen(A, 'dojo') && (await A.textContent('#mdName')) === 'Ninja invitado' && (await A.textContent('#mdGoal')).includes('Medir tu velocidad') && (await A.textContent('#mdBlock')).includes('Bloque actual'));
    check('Entrenamiento shows the current block, not all the lessons', (await A.textContent('#mdNextTitle')).includes('Lección 1') && (await A.textContent('#mdCount')).includes('de este cinturón') && (await A.textContent('#mdLevel')).includes('Cinturón blanco') && await visible(A, '#mdContinue'));
    await A.click('[data-view-of="dojo"] [role="tab"][data-sub="batallas"]');
    await A.waitForSelector('.nv-bempty');
    check('Without battles: the first one starts with a mark', (await A.textContent('.nv-bempty')).includes('Tu primera batalla empieza con una marca') && (await A.textContent('#mdFirstBattle')) === 'Jugar y desafiar' && !(await visible(A, '#mdNewBattle')));
    await A.click('#mdFirstBattle');
    check('…which takes you to the quick challenges', await onScreen(A, 'desafios'));
    await A.click('#desafios .nv-game[data-game="chimpance"]'); await A.click('#gameGo'); await chimp(A, 1);
    check('The result asks for a friend who can beat you, and offers beating your mark', (await A.textContent('.gm-dare')).includes('¿Tenés un amigo que pueda superarte?') && (await A.textContent('#gameAgain')) === 'Superar mi marca');
    await A.click('#gameDare');
    check('Challenging asks once for the name the friend sees', await visible(A, '#gmNickIn'));
    await A.fill('#gmNickIn', 'Facu'); await A.press('#gmNickIn', 'Enter');
    await A.waitForSelector('#gmBWa');
    const battleId = await A.evaluate(() => JSON.parse(localStorage.getItem('tn-batallas'))[0].id);
    check('…then creates the battle and offers WhatsApp and the link', /^[a-z0-9]{8}$/.test(battleId) && await visible(A, '#gmBCopy') && (await events(A, 'battle_created')).some(e => e.game === 'chimpance' && e.score === 4));
    const waBattle = new Promise(res => A.context().once('page', pg => res(pg.url())));
    await A.click('#gmBWa');
    const waText = decodeURIComponent(await waBattle).replace(/\+/g, ' '); // wa.me may forward to api.whatsapp.com, with + for spaces
    check('The WhatsApp message carries the score and the link', waText.includes('hice 4 números') && waText.includes('/nueva?batalla=' + battleId) && (await events(A, 'battle_shared')).some(e => e.how === 'whatsapp'));
    // The friend, without an account
    const B = await open('/nueva?batalla=' + battleId);
    await B.waitForSelector('.gm-invite');
    check('The link opens the invitation: who challenges, in what and the score to beat', (await B.textContent('.gm-invite h3')).includes('Facu te desafía en Test del chimpancé') && (await B.textContent('.gm-target')).includes('4 números') && (await B.textContent('.gm-invite')).includes('Sin cuenta') && !B.url().includes('batalla='));
    await B.fill('#gmInvNick', 'Ana'); await B.click('#gameGo'); await chimp(B, 2);
    await B.waitForSelector('.gm-battle-title');
    check('Beating the mark: "¡Superaste a Facu!", both scores, and the account offered (not required)', (await B.textContent('.gm-battle-title')).includes('¡Superaste a Facu!') && (await B.textContent('.gm-vs')).includes('5') && (await B.textContent('.gm-acct')).includes('mandale la revancha') && (await B.textContent('#gameAcct')) === 'Crear mi cuenta' && (await events(B, 'battle_answered')).some(e => e.result === 'won'));
    await B.click('#gameRevenge'); await B.waitForSelector('#gmBWa');
    check('The revenge is a new link with the new score, under the name already given', (await events(B, 'battle_created')).some(e => e.revenge && e.score === 5) && !(await visible(B, '#gmNickIn')));
    await B.click('#gameOut');
    await B.click('[data-go="dojo"]'); await B.click('[data-view-of="dojo"] [role="tab"][data-sub="batallas"]');
    await B.waitForSelector('.nv-blist');
    check('The friend\'s dojo: the battle won, and the revenge waiting for its rival', (await B.textContent('.nv-battles')).includes('Finalizadas') && (await B.textContent('.nv-battle.won')).includes('Facu 4 vs vos 5') && (await B.textContent('.nv-battles')).includes('Esperando rival') && (await B.textContent('#mdName')) === 'Ana');
    // Back to the one who challenged
    await A.click('#gameOut'); await A.click('[data-go="dojo"]'); await A.click('[data-view-of="dojo"] [role="tab"][data-sub="batallas"]');
    await A.waitForFunction(() => document.querySelector('.nv-battles')?.textContent.includes('Finalizadas'));
    check('Facu sees that Ana played and won, with a revenge button', (await A.textContent('.nv-battle.lost')).includes('Ana 5 vs vos 4') && await visible(A, '.nv-battle.lost [data-revenge]') && (await A.textContent('#mdName')) === 'Facu');
    await A.click('.nv-battle.lost [data-revenge]'); await A.waitForSelector('.gm-invite');
    check('The revenge plays against Ana\'s score', (await A.textContent('.gm-target')).includes('5 números') && (await A.textContent('.gm-invite h3')).includes('Ana'));
    await A.click('#gameBack');
    check('Mis marcas: the best score per game, to beat it or to challenge someone', await A.click('[data-view-of="dojo"] [role="tab"][data-sub="marcas"]').then(() => true) && (await A.textContent('[data-mark="chimpance"] .nv-rec-val')).includes('4') && await visible(A, '[data-mark="chimpance"] [data-beat]') && await visible(A, '[data-mark="chimpance"] [data-dare]') && (await A.textContent('[data-mark="speed"]')).includes('Sin marca todavía'));
    const own = await A.context().newPage(); await own.goto(SITE + '/nueva?batalla=' + battleId); await own.waitForSelector('#mdMsg:not([hidden])');
    check('Opening your own link does not play against yourself', (await own.textContent('#mdMsg')).includes('la creaste vos') && !(await own.isVisible('#game')));
    await own.close();
    // Someone who opens the link and leaves it for later: their turn, and no made-up result for anyone
    const C = await open('/nueva?batalla=' + battleId); await C.waitForSelector('.gm-invite');
    await C.click('#gameBack'); await C.click('[data-view-of="dojo"] [role="tab"][data-sub="batallas"]');
    await C.waitForSelector('.nv-blist');
    check('An invitation not played yet waits in "Tu turno"', (await C.textContent('.nv-battles')).includes('Tu turno') && (await C.textContent('#mdTurnCount')) === '1' && !(await C.textContent('.nv-battles')).includes('Finalizadas'));
    await C.click('[data-play]'); await C.waitForSelector('.gm-invite');
    check('…and Jugar opens it', (await C.textContent('.gm-target')).includes('4 números'));
    const gone = await open('/nueva?batalla=zzzzzzzz'); await gone.waitForSelector('#mdMsg:not([hidden])');
    check('A battle that no longer exists says so, in Mi dojo', (await gone.textContent('#mdMsg')).includes('ya no existe') && await onScreen(gone, 'dojo'));
    // The API keeps the scores within what a person can do
    const post = body => fetch(SITE + '/api/batallas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    check('The API rejects impossible scores and unknown games', (await post({ action: 'create', game: 'chimpance', score: 99 })).status === 400 && (await post({ action: 'create', game: 'ajedrez', score: 3 })).status === 400 && (await post({ action: 'respond', id: 'zzzzzzzz', score: 3 })).status === 404);
    const viewed = await (await fetch(SITE + '/api/batallas?ids=' + battleId)).json();
    check('Anyone with the link sees names and scores only', viewed.battles[0].from === 'Facu' && viewed.battles[0].responses[0].name === 'Ana' && viewed.battles[0].responses[0].result === 'won' && !('user' in viewed.battles[0]));
    const mp = await open('/nueva', phone);
    check('On the phone, the four-tab bar opens Profile, with Dojo inside', await mp.isVisible('.nv-tabbar [data-go="dojo"]') && (await mp.textContent('.nv-tabbar [data-go="dojo"]')).includes('Perfil') && await mp.locator('.nv-tabbar a').count() === 4);
    check('On the phone, Apoyá el templo stays in the header next to Perfil, without overflowing', await mp.isVisible('.nv-top #upgradeCta') && await mp.isVisible('.nv-top .nv-profile-link') && await mp.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.nv-top .nv-profile-link').getBoundingClientRect().right <= innerWidth));

    // Progress checks of the course: starting point, control at lesson 6, summary at 10, blocks, final measurement
    const BASE_IDS = ['fj','dk','sl','añ','gh','rep1','ei','ru','ty','wo','qp','rep2','nm','vb','c,','x.','z','rep3','may','til','ref','cos','ofi','tec','coc','via'];
    const seeded = async (n, extra = {}, path = '/nueva#teclado', opts = {}) => {
      const ctx = await browser.newContext(opts);
      await ctx.addInitScript(([ids, n, extra]) => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1'); localStorage.setItem('teclado-ciego-v1', JSON.stringify({ lessons: Object.fromEntries(ids.slice(0, n).map(id => [id, { stars: 2, ppm: 20, acc: 95 }])), tests: extra.tests || [] })); if (extra.ctl) localStorage.setItem('tn-controles', JSON.stringify(extra.ctl)); for (const [k, v] of Object.entries(extra.ls || {})) localStorage.setItem(k, v); }, [BASE_IDS, n, extra]);
      await ctx.addInitScript(() => { window.tnEvents = { push: e => (window.__ev = window.__ev || []).push(e) }; });
      const pg = await ctx.newPage(); pg.on('pageerror', e => errors.push(e.message));
      await pg.goto(SITE + path); await pg.waitForLoadState('networkidle'); return pg;
    };
    const typeAll = pg => pg.evaluate(() => { const text = [...document.querySelectorAll('#inner .c')].map(s => s.textContent).join(''); for (const key of text) document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey: key !== key.toLowerCase(), bubbles: true, cancelable: true })); });
    const c0 = await open('/nueva#teclado');
    check('Before lesson 1: an optional starting point', await c0.isVisible('#nvCheck') && (await c0.textContent('#nvCheckTitle')) === 'Medí tu punto de partida' && (await c0.textContent('#nvCheck')).includes('Empezar sin medir'));
    await c0.click('#nvCheck [data-check="1"]');
    check('…that can be skipped, and stays skipped', !(await c0.isVisible('#nvCheck')) && (await events(c0, 'checkpoint_action')).some(e => e.id === 'base' && e.action === 'skip'));
    await c0.reload(); await c0.waitForLoadState('networkidle');
    check('…after a reload too', !(await c0.isVisible('#nvCheck')));
    const cb = await open('/nueva#teclado'); await cb.click('#nvCheck [data-check="0"]');
    check('Measuring the starting point is the 1-minute test, as you type today', await cb.isVisible('#lesson') && (await cb.textContent('#lName')) === 'Mirando el teclado');
    await cb.click('#back');
    check('…and leaving it goes back to the checks, not to the tests', await onScreen(cb, 'teclado') && await cb.isVisible('#nvCheck'));
    const c6 = await seeded(6);
    check('At lesson 6: a short control with everything learned', (await c6.textContent('#nvCheckEyebrow')).includes('lección 6') && (await c6.textContent('#nvCheckStats')).includes('10 teclas dominadas') && (await c6.textContent('#nvCheckStats')).includes('6 de 26 lecciones'));
    await c6.click('#nvCheck [data-check="0"]');
    check('The control is a round with the keys learned, apart from the stars', (await c6.textContent('#lName')) === 'Control de la lección 6');
    await typeAll(c6); await c6.waitForSelector('#result:not([hidden])');
    check('…that ends as a control, with its numbers', (await c6.textContent('#result h3')) === 'Control completo' && (await c6.textContent('#result')).includes('Control listo'));
    await c6.click('#rHome');
    check('Back in Teclado: the control\'s speed, precision and keys mastered', await c6.isVisible('#nvCheck') && (await c6.textContent('#nvCheckTitle')).includes('palabras por minuto con') && (await c6.textContent('#nvCheckStats')).includes('10 teclas dominadas') && await c6.evaluate(() => !JSON.parse(localStorage.getItem('teclado-ciego-v1')).lessons.control));
    await c6.click('#nvCheck [data-check="0"]');
    check('…and Seguir puts it away', !(await c6.isVisible('#nvCheck')));
    const c10 = await seeded(10);
    check('At lesson 10: a summary and an optional measurement', (await c10.textContent('#nvCheckTitle')) === 'Vas 10 de 26: te faltan 16' && (await c10.textContent('#nvCheckStats')).includes('20 ppm promedio') && (await c10.textContent('#nvCheck')).includes('Medir mi velocidad'));
    const c12 = await seeded(12, { ctl: { seen: { l10: 1 }, results: {} } });
    check('A block finished: its summary', (await c12.textContent('#nvCheckTitle')).includes('Fila superior') && (await c12.textContent('#nvCheckText')).includes('6 lecciones'));
    const c26 = await seeded(26, { tests: [{ method: 'mirando', ppm: 22, acc: 91, accents: 'strict', date: 1000 }] });
    check('At 26: the final measurement, the same test as at the start', (await c26.textContent('#nvCheckTitle')) === 'Repetí la prueba del principio');
    await c26.click('#nvCheck [data-check="0"]');
    check('…taken blind', (await c26.textContent('#lName')) === 'A ciegas');
    const cmp = (ppm, accents) => seeded(26, { tests: [{ method: 'mirando', ppm: 22, acc: 91, accents: 'strict', date: 1000 }, { method: 'ciegas', ppm, acc: 96, accents, date: 2000 }], ctl: { seen: {}, results: { final: { id: 'test', ppm, acc: 96, method: 'ciegas', accents, date: 2000 } }, show: 'final' } });
    const up = await cmp(38, 'strict');
    check('The final result compares with the starting point when it is the same test', (await up.textContent('#nvCheckText')).includes('+16 palabras por minuto') && (await up.textContent('#nvCheckText')).includes('Al empezar: 22 ppm mirando el teclado'));
    const down = await cmp(18, 'strict');
    check('A drop is said as it is', (await down.textContent('#nvCheckText')).includes('4 palabras por minuto menos'));
    const other = await cmp(38, 'loose');
    check('A different test is not compared', (await other.textContent('#nvCheckText')).includes('No la comparamos') && !(await other.textContent('#nvCheckText')).includes('+16'));

    // Agregar a mi inicio (PWA)
    const manifest = await (await fetch(SITE + '/manifest.webmanifest')).json();
    check('The manifest opens Mi dojo as an app, with its icons', manifest.name === 'Templo Ninja' && manifest.start_url === '/nueva?app=1#dojo' && manifest.display === 'standalone' && manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'maskable'));
    check('…and every icon and the service worker are served', (await Promise.all([...manifest.icons.map(i => i.src), '/icons/apple-touch-icon.png', '/sw.js'].map(u => fetch(SITE + u).then(r => r.ok)))).every(Boolean));
    check('The page links the manifest and registers the service worker', await p.getAttribute('link[rel="manifest"]', 'href') === '/manifest.webmanifest' && await p.evaluate(() => Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise(r => setTimeout(() => r(false), 5000))])));
    const pw = await open('/nueva#dojo');
    check('On a computer without the browser\'s offer, no card', !(await pw.isVisible('#nvInstall')));
    await pw.evaluate(() => { const e = new Event('beforeinstallprompt'); e.prompt = () => { window.__prompted = true; }; e.userChoice = Promise.resolve({ outcome: 'accepted' }); dispatchEvent(e); });
    check('When the browser offers installing, Mi dojo shows "Agregar a mi inicio"', await pw.isVisible('#nvInstall') && (await pw.textContent('#nvInstallBtn')).includes('Agregar a mi inicio'));
    await pw.click('#nvInstallBtn');
    await pw.waitForFunction(() => document.getElementById('nvInstall').hidden);
    check('…which asks the browser for the confirmation', await pw.evaluate(() => window.__prompted) && (await events(pw, 'pwa_prompt_result')).some(e => e.outcome === 'accepted'));
    const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
    const iphone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: IPHONE };
    const ip = await open('/nueva#dojo', iphone);
    check('On an iPhone, Mi dojo has the card', await ip.isVisible('#nvInstall'));
    await ip.tap('#nvInstallBtn');
    check('…and the steps: Compartir → Agregar a inicio → Abrir como app web → Agregar', await ip.isVisible('#nvInstallDlg') && /Compartir[\s\S]*Agregar a inicio[\s\S]*Abrir como app web[\s\S]*Agregar/.test(await ip.textContent('#nvInstallSteps')) && (await events(ip, 'pwa_guide_shown')).some(e => e.kind === 'ios'));
    const ig = await open('/nueva#dojo', { ...iphone, userAgent: IPHONE + ' Instagram 340.0.0' });
    await ig.tap('#nvInstallBtn');
    check('From Instagram\'s browser: open it in Safari first, with the link to copy', (await ig.textContent('#nvInstallSteps')).includes('Abrir en el navegador') && (await ig.textContent('#nvInstallSteps')).includes('Safari') && await ig.isVisible('#nvInstallCopy'));
    const an = await open('/nueva#dojo', { ...iphone, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36' });
    await an.tap('#nvInstallBtn');
    check('On Android without the offer: the browser menu', (await an.textContent('#nvInstallSteps')).includes('Agregar a la pantalla de inicio'));
    const appCtx = await browser.newContext(iphone); await appCtx.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); window.tnEvents = { push: e => (window.__ev = window.__ev || []).push(e) }; });
    const app = await appCtx.newPage(); app.on('pageerror', e => errors.push(e.message)); await app.goto(SITE + '/nueva?app=1#dojo'); await app.waitForLoadState('networkidle');
    check('Opened from the icon: Mi dojo, no install card, and it is measured', await onScreen(app, 'dojo') && !(await app.isVisible('#nvInstall')) && (await events(app, 'pwa_opened')).length === 1 && !app.url().includes('app=1'));
    // The invitation: after an activity or on coming back, and "Ahora no" respected
    const nv = await open('/nueva#desafios', iphone);
    check('No invitation on the first visit before doing anything', !(await nv.isVisible('#nvNudge')));
    await nv.tap('#desafios .nv-game[data-game="chimpance"]'); await nv.tap('#gameGo');
    for (let i = 0; i < 3; i++) { await nv.waitForSelector('.gm-cell[data-n="2"]:not(.done):not(.wrong)'); await nv.tap('.gm-cell[data-n="2"]'); await nv.waitForTimeout(750); }
    await nv.waitForSelector('.gm-result'); await nv.tap('#gameOut');
    check('After finishing a challenge: the invitation to add it', await nv.isVisible('#nvNudge') && (await events(nv, 'pwa_nudge_shown')).some(e => e.reason === 'activity'));
    await nv.tap('#nvNudgeNo');
    check('"Ahora no" hides it', !(await nv.isVisible('#nvNudge')));
    await nv.reload(); await nv.waitForLoadState('networkidle');
    await nv.tap('#desafios .nv-game[data-game="chimpance"]'); await nv.tap('#gameGo');
    for (let i = 0; i < 3; i++) { await nv.waitForSelector('.gm-cell[data-n="2"]:not(.done):not(.wrong)'); await nv.tap('.gm-cell[data-n="2"]'); await nv.waitForTimeout(750); }
    await nv.waitForSelector('.gm-result'); await nv.tap('#gameOut');
    check('…and keeps it quiet for seven days', !(await nv.isVisible('#nvNudge')));
    const ret = await seeded(0, { ls: { 'tn-visit-days': JSON.stringify(['2020-01-01']) } }, '/nueva', iphone);
    await ret.waitForSelector('#nvNudge:not([hidden])', { timeout: 6000 });
    check('Coming back another day: the invitation', (await events(ret, 'pwa_nudge_shown')).some(e => e.reason === 'return'));
    await ret.tap('#nvNudgeYes');
    check('…whose button opens the steps', await ret.isVisible('#nvInstallDlg'));

    // Belts: the 26 lessons of the base course are the first four of the seven; belts.js's five follow, two by two
    const BASE = ['fj','dk','sl','añ','gh','rep1','ei','ru','ty','wo','qp','rep2','nm','vb','c,','x.','z','rep3','may','til','ref','cos','ofi','tec','coc','via'];
    const graduate = async (ctx, extra = {}) => ctx.addInitScript(([ids, extra]) => { localStorage.setItem('teclado-ciego-v1', JSON.stringify({ lessons: Object.fromEntries([...ids.map(id => [id, { stars: 2, ppm: 30, acc: 96 }]), ...Object.entries(extra)]) })); }, [BASE, extra]);
    const bctx = await browser.newContext(); await graduate(bctx);
    const bp = await bctx.newPage(); bp.on('pageerror', e => errors.push(e.message));
    await bp.goto(SITE + '/nueva#teclado'); await bp.waitForLoadState('networkidle');
    check('After the base course, "Seguí acá" goes on with the blue belt', (await bp.textContent('#tkNextEyebrow')).includes('Cinturón azul') && (await bp.textContent('#tkNextTitle')) === 'Lección 27: Comas' && (await bp.textContent('#tkCount')) === '0 de 16 en este cinturón');
    check('The blue belt opens and the ones done fold', !(await bp.getAttribute('#path [data-belt="azul"]', 'class')).includes('nv-folded') && (await bp.getAttribute('#path [data-belt="blanco"]', 'class')).includes('nv-folded') && (await bp.textContent('#path [data-belt="verde"]')).includes('¡Conseguido!'));
    await bp.click('#tkContinue');
    check('A belt lesson opens with its belt and its own text', (await bp.textContent('#lGroup')).includes('Lección 27 · Cinturón azul') && (await bp.textContent('#inner')).includes(','));
    await typeAll(bp);
    await bp.waitForSelector('#result:not([hidden])');
    check('Passing it counts for the belt and offers the next lesson', (await bp.textContent('#result')).includes('Cinturón azul: 1 de 16') && (await bp.textContent('#rNext')).includes('Punto y mayúscula'));
    await bp.click('#rHome');
    check('…and "Seguí acá" moves on', (await bp.textContent('#tkNextTitle')) === 'Lección 28: Punto y mayúscula' && (await bp.textContent('#tkCount')) === '1 de 16 en este cinturón');
    // The last of the 26 lessons wins the green belt
    const gctx = await browser.newContext(); await gctx.addInitScript(() => { window.tnEvents = { push: e => (window.__ev = window.__ev || []).push(e) }; }); await gctx.addInitScript(ids => { localStorage.setItem('teclado-ciego-v1', JSON.stringify({ lessons: Object.fromEntries(ids.slice(0, -1).map(id => [id, { stars: 2, ppm: 30, acc: 96 }])) })); }, BASE);
    const gp = await gctx.newPage(); gp.on('pageerror', e => errors.push(e.message));
    await gp.goto(SITE + '/nueva#teclado'); await gp.waitForLoadState('networkidle');
    check('One lesson to go: the count is about its belt', (await gp.textContent('#tkCount')) === '7 de 8 en este cinturón');
    await gp.click('#tkContinue');
    await typeAll(gp);
    await gp.waitForSelector('#result:not([hidden])');
    check('Finishing the 26 lessons wins the green belt and proposes the next one', (await gp.textContent('#result')).includes('¡Conseguiste el cinturón verde!') && (await gp.textContent('#result')).includes('cinturón azul') && (await gp.textContent('#rNext')).includes('Comas') && (await events(gp, 'course_completed')).length === 1);
    await gp.click('#rHome');
    check('Then the blue belt is next', (await gp.textContent('#tkNextEyebrow')).includes('Cinturón azul') && !(await gp.isVisible('#tkBeltsBox')));

    // The last lesson of a belt wins it (the blue one: the old yellow and orange, 16 lessons)
    const wctx = await browser.newContext(); await wctx.addInitScript(() => { window.tnEvents = { push: e => (window.__ev = window.__ev || []).push(e) }; }); await graduate(wctx, Object.fromEntries([...'abcdefgh'].map(c => 'b1' + c).concat([...'abcdefg'].map(c => 'b2' + c)).map(id => [id, { stars: 2, ppm: 30, acc: 96 }])));
    const wp = await wctx.newPage(); wp.on('pageerror', e => errors.push(e.message));
    await wp.goto(SITE + '/nueva#teclado'); await wp.waitForLoadState('networkidle'); await wp.click('#tkContinue');
    await typeAll(wp);
    await wp.waitForSelector('#result:not([hidden])');
    check('Passing the last lesson of a belt wins it and points to the next one', (await wp.textContent('#result')).includes('¡Conseguiste el cinturón azul!') && (await wp.textContent('#result')).includes('cinturón marrón') && (await events(wp, 'typing_belt_won')).some(e => e.belt === 'azul'));
    await wp.click('#rHome');
    check('The brown belt opens next', !(await wp.getAttribute('#path [data-belt="marron"]', 'class')).includes('nv-folded') && (await wp.textContent('#tkNextEyebrow')).includes('Cinturón marrón'));
    const hb = await open('/');
    check('The current home lists the five belts after the base course', (await hb.$$('#path .group.belt')).length === 5 && (await hb.$$('#path .group.belt .lc')).length === 40);

    // The browser's Back and Forward stay inside /nueva (it used to replace every address, so Back left for the old home)
    const hctx = await browser.newContext(); const hp = await hctx.newPage(); hp.on('pageerror', e => errors.push(e.message));
    const at = () => { const u = new URL(hp.url()); return u.pathname + u.hash; };
    await hp.goto(SITE + '/'); await hp.goto(SITE + '/nueva'); await hp.waitForLoadState('networkidle');
    await hp.click('.nv-links [data-go="teclado"]'); await hp.click('.nv-links [data-go="mente"]');
    await hp.goBack();
    check('Back goes to the previous section of /nueva', at() === '/nueva#teclado' && await onScreen(hp, 'teclado'));
    await hp.goBack();
    check('…and then to its Inicio, not to the old home', at() === '/nueva' && await onScreen(hp, 'inicio'));
    await hp.goForward();
    check('Forward works too', at() === '/nueva#teclado' && await onScreen(hp, 'teclado'));
    await hp.click('#tkContinue');
    check('A lesson opens', await hp.evaluate(() => tnApp.mode() === 'typing'));
    await hp.goBack();
    check('Back from a lesson returns to its section, still in /nueva', at() === '/nueva#teclado' && await hp.evaluate(() => tnApp.mode() === 'home') && await onScreen(hp, 'teclado'));
    await hp.click('#tkContinue'); await hp.click('#back'); await hp.waitForTimeout(300);
    check('Leaving a lesson by its own button keeps the section', at() === '/nueva#teclado' && await hp.evaluate(() => tnApp.mode() === 'home'));
    await hp.goBack();
    check('…without leaving an extra entry: Back goes on to Inicio', at() === '/nueva' && await onScreen(hp, 'inicio'));
    await hp.click('.nv-links [data-go="mente"]'); await hp.click('[data-view-of="mente"] [role="tab"][data-sub="relampago"]');
    await hp.click('#desafios .nv-game[data-game="chimpance"]');
    check('A quick challenge opens', await hp.isVisible('#game') && at() === '/nueva#juego-chimpance');
    await hp.goBack();
    check('Back closes it and returns to the challenges', !(await hp.isVisible('#game')) && at() === '/nueva#desafios' && await onScreen(hp, 'desafios'));
    await hp.click('#desafios .nv-game[data-game="chimpance"]'); await hp.click('#gameBack'); await hp.waitForTimeout(300);
    await hp.goBack();
    check('Leaving a challenge by its own button leaves no extra entry either', at() === '/nueva' && await onScreen(hp, 'inicio'));
    await hp.goto(SITE + '/precios.html');
    check('Coming from /nueva, the other pages lead back to /nueva', (await hp.$$eval('a[href="/"]', as => as.length)) === 0 && (await hp.getAttribute('a.brand', 'href')) === '/nueva');
    await hp.goto(SITE + '/profesional');
    check('…/profesional too, with its links to a track or a mock test', (await hp.$$eval('a[href^="/?"]', as => as.length)) === 0 && await hp.$('a[href="/nueva?pista=log"]') !== null);
    const pl = await open('/nueva?pista=log');
    check('/nueva?pista=log (a link of /profesional) opens Mente on that track', await onScreen(pl, 'mente') && (await pl.getAttribute('#cogTracks [data-v="log"]', 'aria-pressed')) === 'true');
    const oc = await browser.newContext(); const op = await oc.newPage();
    await op.goto(SITE + '/'); await op.waitForLoadState('networkidle'); await op.goto(SITE + '/precios.html');
    check('Coming from the current home, they still lead to /', (await op.getAttribute('a.brand', 'href')) === '/');

    // The current home keeps working as before with the shared engine
    const h = await open('/');
    check('The current home still has no layout of its own and opens as always', await h.evaluate(() => !window.tnLayout && !!window.tnApp) && await visible(h, '#continue') && await visible(h, '#path'));
    check('No uncaught browser errors', errors.length === 0);
  } finally {
    await browser.close(); server.close();
    if (errors.length) console.error(errors);
  }
})().catch(err => { console.error(err); process.exit(1); });
