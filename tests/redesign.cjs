// Focused navigation, preservation of content, belt difficulty and responsive layout.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { createServer } = require('./server.cjs');
(async () => {
  const server = createServer();
  await new Promise(r => server.listen(4198, '127.0.0.1', r));
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const errors = [];
  try {
    for (const width of [1280, 768, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 760, hasTouch: width < 760 });
      const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:4198/nueva'); await page.waitForLoadState('networkidle');
      const shot = async name => {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px ${name}: no horizontal overflow`);
        if (process.env.QA_OUTPUT && [1280, 390].includes(width)) {
          fs.mkdirSync(process.env.QA_OUTPUT, { recursive: true });
          await page.screenshot({ path: path.join(process.env.QA_OUTPUT, `${name}-${width}.png`), fullPage: true });
        }
      };
      await shot('inicio');
      await page.click('#continue');
      assert(await page.isVisible('#learning'));
      assert.equal(await page.locator('#path > .group.tn-belt').count(), 7);
      assert.equal(await page.locator('#path .lc').count(), 66);
      assert(!(await page.isVisible('#hStars')), 'Personal totals belong to profile');
      assert(!(await page.isVisible('#path .group:nth-child(2) .lc')));
      await page.click('#path .group:nth-child(2) .nv-fold-btn');
      assert(await page.isVisible('#path .group:nth-child(2) .lc'));
      assert.equal(await page.getAttribute('#path .group:nth-child(2) .nv-fold-btn', 'aria-expanded'), 'true');
      await shot('teclado');
      await page.click('#tkContinue');
      await page.click('#homeBtn');
      await page.waitForFunction(() => !document.querySelector('[data-view-of="inicio"]').hidden);
      // A delayed practice-return callback must not override explicit navigation.
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      assert(await page.isVisible('#heroTitle'));
      await page.click('#homeBtn');
      assert(await page.isVisible('#heroTitle'), 'Logo returns to Inicio');
      await page.click('#scNinja');
      for (const track of ['fig', 'num', 'eng', 'log']) {
        await page.click(`#cogTracks [data-v="${track}"]`);
        assert.equal(await page.locator('#cogPath .group:not(.final) .lc').count(), 15);
        const text = await page.textContent('#cogPath');
        for (const belt of ['blanco', 'amarillo', 'naranja', 'verde', 'azul']) assert(text.includes(`Cinturón ${belt}`));
        assert(!/chimpancé|bebé|premio Nobel/.test(text), 'Difficulty uses belts');
      }
      await page.click('#cogTracks [data-v="fig"]');
      if (width === 1280) {
        await page.click('#cogContinue');
        assert((await page.textContent('#qGroup')).includes('cinturón blanco'));
        for (let i = 0; i < 6; i++) {
          await page.locator('#qOpts .opt').first().click();
          await page.click('#qNext');
        }
        assert((await page.textContent('#qResult')).includes('Cinturón blanco'));
        assert(!/chimpancé|bebé|premio Nobel/.test(await page.textContent('#qResult')));
        await page.click('#qBack');
        await page.waitForSelector('#cogContinue', { state: 'visible' });
      }
      await page.click('.nv-techniques summary');
      assert(await page.isVisible('#cogKinds'), 'Techniques stay available on phones');
      await page.click('.nv-techniques summary');
      await shot('mente');
      await page.click('[data-sub="relampago"]');
      assert.equal(await page.locator('#desafios .nv-game').count(), width < 760 ? 7 : 6);
      assert(await page.isVisible('#nvGameIq') && await page.isVisible('#nvGameSim'));
      assert.equal(await page.getAttribute('.nv-tabbar [data-go="mente"]', 'aria-current'), 'page');
      await shot('relampago');
      await page.click('#desafios .nv-game[data-game="reflejos"]');
      assert(await page.isVisible('#game'));
      await page.click('#gameBack');
      assert(await page.isVisible('#desafios'), 'A game returns to the mental challenges');
      await page.click('.nv-profile-link');
      assert(page.url().endsWith('#perfil'));
      assert(await page.isVisible('[data-profile-panel="dojo"] #midojo'));
      assert(await page.isVisible('#hStars'), 'Progress preserved in profile');
      await shot('perfil');
      await page.click('[data-profile="cuenta"]');
      await page.click('#acctBtn');
      assert(await page.isVisible('#authDlg'), 'Existing authentication preserved');
      await page.keyboard.press('Escape');
      await page.click('[data-profile="preferencias"]');
      assert(await page.isVisible('#dojoHumor') && await page.isVisible('#dojoGuided'));
      await page.click('#nvTheme');
      await shot('preferencias-oscuro');
      await page.click('#homeBtn');
      await shot('inicio-oscuro');
      await context.close();
      console.log(`PASS focused screens, content, profile and belts at ${width}px`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await new Promise(r => server.close(r)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
