// /nueva: the new layout of the home page (a candidate for an A/B test against index.html). Same engine (app.js).
// Focused screens: Inicio, Teclado, Mente, Ranking and Perfil. Lightning challenges belong to Mente;
// Mi Dojo belongs to Perfil. Legacy #dojo/#desafios and battle links keep working. It also adds compact groups on
// the phone, the bridge from the phone to the computer and the optional dark mode. Loaded before app.js, so that
// app.js finds window.tnLayout and tells it where it goes; the buttons are wired once the page is ready.
(() => {
  const $id = id => document.getElementById(id);
  const SECTIONS = ['inicio', 'teclado', 'mente', 'desafios', 'dojo', 'ranking'];
  const HASH = { inicio: '', teclado: '#teclado', mente: '#ninja', desafios: '#desafios', dojo: '#perfil', ranking: '#ranking' };
  const gameOf = hash => (/^#juego-(\w+)$/.exec(hash) || [])[1];
  const secOf = hash => hash === '#teclado' ? 'teclado' : /^#(ninja|entrevistas)$/.test(hash) ? 'mente' : hash === '#desafios' ? 'desafios' : /^#(dojo|perfil)$/.test(hash) ? 'dojo' : hash === '#ranking' ? 'ranking' : 'inicio';
  const capture = (e, p) => window.tn?.capture?.(e, p);
  const anchor = sec => document.querySelector(`[data-view-of="${sec}"]`);
  // A phone or tablet without a physical keyboard ("Tengo teclado físico" turns this off, remembered).
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch {} return null; };
  const touchOnly = () => matchMedia('(hover: none) and (pointer: coarse)').matches && store('tn-has-keyboard') !== '1';

  function setSub(sec, sub) {
    const view = anchor(sec);
    if (!view || !view.querySelector(`[data-sub-of="${sub}"]`)) return;
    view.querySelectorAll('[data-sub-of]').forEach(s => { s.hidden = s.dataset.subOf !== sub; });
    view.querySelectorAll('[role="tab"][data-sub]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.sub === sub)));
    if (sec === 'teclado' && sub === 'medir' && window.tnApp?.chartShown()) tnApp.drawChart(); // the chart sizes itself to a visible box
    if (sec === 'dojo' && sub === 'batallas') renderBattles(true);
  }
  let navigationEpoch = 0; // Explicit navigation wins over a pending return from a practice.
  function markCurrent(sec) { document.querySelectorAll('[data-go]').forEach(a => { if (a.dataset.go === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function profileTab(tab) {
    document.querySelectorAll('[data-profile-panel]').forEach(p => { p.hidden = p.dataset.profilePanel !== tab; });
    document.querySelectorAll('[data-profile]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.profile === tab)));
  }
  // The browser's history: going to a section from the page adds an entry, and so does a practice (a lesson, a session
  // of Ninja mental or a quick challenge: one entry for all of it). Back goes to the previous screen inside /nueva,
  // and leaves it only from the first one. Without this every move replaced the address and Back left /nueva at once.
  let pushNext = false, leaving = false, skipHash = null, curSec = 'inicio', curSub;
  const inScreen = () => history.state?.tn === 'screen';
  function enterScreen(url = location.href) { if (inScreen()) history.replaceState({ tn: 'screen' }, '', url); else history.pushState({ tn: 'screen' }, '', url); }
  // Leaving a practice from the page (its own back button, the end of a game): drop its entry, as Back would
  function leaveScreen() { if (!inScreen() || leaving) return; leaving = true; history.back(); }

  // Go to a section: scroll there (instantly when coming back from a lesson), say where we are in the address.
  function goTo(sec, { sub, scroll = true, smooth = true, replace = false } = {}) {
    navigationEpoch++;
    if (!SECTIONS.includes(sec)) sec = 'inicio';
    const screen = sec === 'desafios' ? 'mente' : sec;
    document.querySelectorAll('#home > .nv-view').forEach(v => { v.hidden = v.dataset.viewOf !== screen; });
    if (sec === 'desafios') setSub('mente', 'relampago');
    else if (sub) setSub(sec, sub);
    if (sec === 'dojo') profileTab('dojo');
    markCurrent(screen);
    curSec = sec; curSub = sub;
    const want = location.pathname + location.search + HASH[sec], push = pushNext && !leaving && !replace;
    pushNext = false;
    if (location.pathname + location.search + location.hash !== want) { if (push) history.pushState(null, '', want); else history.replaceState(null, '', want); }
    if (scroll) scrollTo({ top: 0, behavior: 'instant' });
  }

  // Desafíos rápidos (desafios.js): their tiles, and their own screen next to the lesson and quiz ones.
  const TILE_ART = {
    reflejos: '<span class="nv-react-dot">¡Ya!</span>',
    numeros: '<span class="nv-vis-txt mono">4 8 1 9</span>',
    chimpance: '<svg viewBox="0 0 120 70" width="104" aria-hidden="true"><g font-family="JetBrains Mono" font-weight="700" font-size="14" text-anchor="middle">' + [[18, 18, 1], [62, 14, 2], [98, 30, 3], [34, 52, 4], [80, 54, 5]].map(([x, y, n]) => `<rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="5" fill="var(--card)" stroke="var(--line)"/><text x="${x}" y="${y + 5}" fill="var(--ink)">${n}</text>`).join('') + '</g></svg>',
    visual: '<svg viewBox="0 0 70 70" width="64" aria-hidden="true">' + Array.from({ length: 16 }, (_, i) => `<rect x="${(i % 4) * 17 + 1}" y="${Math.floor(i / 4) * 17 + 1}" width="15" height="15" rx="3" fill="${[1, 6, 11, 12].includes(i) ? 'var(--accent)' : 'var(--card)'}" stroke="var(--line)"/>`).join('') + '</svg>',
    celu: '<span class="nv-vis-txt">📱 <small>30 s</small></span>',
  };
  const TILE_SUB = { reflejos: 'Tiempo de reacción · 30 s', numeros: 'Como en los psicotécnicos · 1 min', chimpance: '¿Le ganás a un chimpancé? · 1 min', visual: 'Recordá el patrón · 1 min', celu: 'Escribir en el celu · 30 s' };
  function renderTiles() {
    const best = Desafios.bests(), ids = [...(touchOnly() ? ['celu'] : []), 'chimpance', 'numeros', 'visual', 'reflejos'];
    document.querySelectorAll('[data-games]').forEach(slot => {
      slot.parentElement.querySelectorAll('.nv-game[data-game]').forEach(t => t.remove());
      slot.before(...ids.map(id => {
        const g = Desafios.GAMES[id], b = document.createElement('button');
        b.className = 'nv-game'; b.dataset.game = id;
        b.innerHTML = `<span class="nv-vis">${TILE_ART[id]}</span><b>${g.name}</b><span>${best[id] != null ? `Tu mejor: ${best[id]} ${g.unit}` : TILE_SUB[id]}</span>`;
        b.onclick = () => openGame(id);
        return b;
      }));
    });
  }
  let gameFrom = 'desafios', gameSub;
  function openGame(id, opts = {}) {
    if (!Desafios.GAMES[id]) return;
    if (tnApp.mode() !== 'home') tnApp.goHome();
    gameFrom = opts.battle || opts.from === 'dojo' ? 'dojo' : id === 'celu' ? 'teclado' : 'desafios';
    gameSub = opts.battle ? 'batallas' : opts.from === 'dojo' ? 'marcas' : undefined;
    $id('home').hidden = true; $id('game').hidden = false; document.body.dataset.view = 'game';
    enterScreen(location.pathname + location.search + '#juego-' + id);
    scrollTo({ top: 0 });
    Desafios.open(id, closeGame, opts);
  }
  function closeGame() {
    $id('game').hidden = true;
    leaveScreen();
    tnApp.goHome(); renderTiles(); renderDojo(); renderBattles(true);
    goTo(gameFrom, { sub: gameSub, smooth: false, replace: true });
    if (activityDone) maybeNudge('activity');
  }

  // "Seguí acá": the next lesson (of the course, then of the current belt), how far it goes and its keys. Until
  // the 26 lessons are done, progress always refers to the course; the belts are one line until graduation.
  function renderNext() {
    if (!window.tnApp) return;
    if (tnApp.TN_BELTS) return renderNextBelt();
    const { LESSONS, GROUPS, BELTS, state: S } = tnApp, nl = tnApp.nextLesson();
    const passed = l => S.lessons[l.id]?.stars >= 1;
    const baseDone = LESSONS.filter(passed).length, baseAll = baseDone === LESSONS.length;
    const inBelt = nl.belt != null, B = inBelt ? BELTS[nl.belt] : null, bs = inBelt ? tnApp.beltState(nl.belt) : null;
    const allDone = baseAll && BELTS.every((_, bi) => tnApp.beltState(bi).complete);
    $id('tkNextEyebrow').textContent = allDone ? 'Cinturón negro completo 🥋' : inBelt ? `Seguí acá · ${B.name}` : `Seguí acá · ${GROUPS[nl.g].name}`;
    $id('tkNextTitle').textContent = allDone ? 'Repasá o medí tu velocidad' : `Lección ${nl.n}: ${nl.name}`;
    $id('tkNextDesc').textContent = allDone ? 'Terminaste el curso y los cinco cinturones. Volvé a cualquier lección para sumar estrellas.' : inBelt ? `${B.theme}. Meta: ${nl.goal} palabras por minuto.` : GROUPS[nl.g].desc;
    const groupLessons = LESSONS.filter(l => l.g === nl.g);
    const done = inBelt ? bs.done : groupLessons.filter(passed).length, total = inBelt ? bs.total : groupLessons.length;
    $id('tkBar').style.width = Math.round(done / total * 100) + '%';
    $id('tkCount').textContent = inBelt ? `${done} de ${total}` : `${done} de ${total} en esta etapa`;
    $id('tkContinue').textContent = allDone ? 'Repasar →' : done || baseAll ? 'Continuar →' : 'Empezar →';
    $id('tkKeys').innerHTML = inBelt ? `<span class="belt-badge nv-belt-big" style="--bc:${B.color}"></span>` : nl.type === 'keys' ? [...nl.keys].map(k => `<kbd style="--fc:${tnApp.fcol(tnApp.key(k)?.f || 'th')}">${k.toUpperCase()}</kbd>`).join('') : '';
    const cb = baseAll ? tnApp.currentBelt() : -1;
    $id('tkBelts').innerHTML = [`<li class="${baseAll ? 'done' : 'current'}" style="--bc:#F3F1EA"><b>Blanco</b><span>Curso base · ${baseDone}/${LESSONS.length}</span></li>`,
      ...BELTS.map((b, bi) => { const st = tnApp.beltState(bi); return `<li class="${st.complete ? 'done' : bi === cb ? 'current' : 'ahead'}" style="--bc:${b.color}"><b>${b.name.replace('Cinturón ', '').replace(/^./, c => c.toUpperCase())}</b><span>${b.theme}</span></li>`; })].join('');
    $id('tkBeltsBox').hidden = !baseAll; // the row of belts shows up with the graduation
    document.body.classList.toggle('nv-base-done', baseAll);
    const white = $id('tkBelts').firstElementChild; // finished, the course hides; its belt shows it again
    if (baseAll) { white.tabIndex = 0; white.setAttribute('role', 'button'); white.title = 'Ver las lecciones del curso'; white.onclick = white.onkeydown = e => { if (e.type === 'keydown' && e.key !== 'Enter') return; document.body.classList.toggle('nv-show-base'); }; }
    fold(); renderDojo(); renderCheck();
    $id('continue').textContent = 'Entrenar';
    $id('scNinja').textContent = 'Entrenar';
  }

  // The same card with the seven belts (app.js, TN_BELTS): the next lesson, its belt and how far that belt goes.
  function renderNextBelt() {
    const { TN_BELTS: TB, GROUPS, BELTS } = tnApp, nl = tnApp.nextLesson();
    const allDone = TB.every((_, bi) => tnApp.tnBeltState(bi).complete);
    const bi = Math.max(0, tnApp.tnBeltOf(nl)), B = TB[bi], bs = tnApp.tnBeltState(bi);
    $id('tkNextEyebrow').textContent = allDone ? 'Cinturón negro completo 🥋' : `Seguí acá · ${B.name} · ${B.theme}`;
    $id('tkNextTitle').textContent = allDone ? 'Repasá o medí tu velocidad' : `Lección ${tnApp.tnNum(nl)}: ${nl.name}`;
    $id('tkNextDesc').textContent = allDone ? 'Completaste los siete cinturones. Volvé a cualquier lección para sumar estrellas.' : nl.belt != null ? `${BELTS[nl.belt].theme}. Meta: ${nl.goal} palabras por minuto.` : GROUPS[nl.g].desc;
    $id('tkBar').style.width = Math.round(bs.done / bs.total * 100) + '%';
    $id('tkCount').textContent = `${bs.done} de ${bs.total} en este cinturón`;
    $id('tkContinue').textContent = allDone ? 'Repasar →' : bs.done || bi ? 'Continuar →' : 'Empezar →';
    $id('tkKeys').innerHTML = nl.type === 'keys' ? [...nl.keys].map(k => `<kbd style="--fc:${tnApp.fcol(tnApp.key(k)?.f || 'th')}">${k.toUpperCase()}</kbd>`).join('') : `<span class="nv-difficulty-belt belt-${B.id} nv-belt-big"></span>`;
    $id('tkBeltsBox').hidden = true; // the path itself is the row of belts
    document.body.classList.remove('nv-base-done');
    fold(); renderDojo(); renderCheck();
    $id('continue').textContent = 'Entrenar';
    $id('scNinja').textContent = 'Entrenar';
  }

  // Mi dojo: who you are and your next goal; the training in its current block (not the whole mountain of
  // lessons), your marks with their evolution, and the battles (a score to beat, sent by link: desafios.js).
  const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nickName = () => { try { return JSON.parse(localStorage.getItem('tn-nick')); } catch { return null; } };
  function renderDojo() {
    if (!window.tnApp || !$id('midojo')) return;
    const { LESSONS, GROUPS, BELTS, state: S } = tnApp, nl = tnApp.nextLesson();
    const passed = l => S.lessons[l.id]?.stars >= 1, baseDone = LESSONS.filter(passed).length, baseAll = baseDone === LESSONS.length;
    const inBelt = nl.belt != null, B = inBelt ? BELTS[nl.belt] : null;
    const allDone = baseAll && BELTS.every((_, bi) => tnApp.beltState(bi).complete);
    const name = tnApp.userName() || nickName();
    $id('mdName').textContent = name || 'Ninja invitado';
    $id('mdAv').textContent = name ? [...name][0].toUpperCase() : '🥷';
    const ppm = tnApp.bestPpm(), next = ppm ? tnApp.nextTier(ppm) : null;
    const TB = tnApp.TN_BELTS, tbi = TB ? Math.max(0, tnApp.tnBeltOf(nl)) : -1;
    const belt = TB ? (allDone ? 'Cinturón negro' : TB[tbi].name) : baseAll ? (inBelt ? B.name : 'Cinturón negro') : 'Cinturón blanco';
    $id('mdLevel').textContent = `${belt} · ${ppm ? `escribís como ${tnApp.tierName(ppm)} (${ppm} ppm)` : 'todavía sin medir tu velocidad'}`;
    // The block in progress: its belt of the seven, or (without them) the group of lessons of the course or the belt after it
    const block = TB ? { name: TB[tbi].name, ...tnApp.tnBeltState(tbi) } : inBelt ? { name: B.name, ...tnApp.beltState(nl.belt) } : (() => { const ls = LESSONS.filter(l => l.g === nl.g); return { name: GROUPS[nl.g].name, done: ls.filter(passed).length, total: ls.length }; })();
    const left = block.total - block.done;
    $id('mdGoal').textContent = allDone ? (ppm && next ? `Llegar a ${next.min} ppm` : 'Superar tu mejor marca') : !ppm ? 'Medir tu velocidad (1 min)' : `Terminar «${block.name}»: ${left === 1 ? 'te falta 1 lección' : `te faltan ${left} lecciones`}`;
    $id('mdBlock').textContent = allDone ? 'Curso y cinturones completos' : `Bloque actual · ${block.name}`;
    $id('mdNextTitle').textContent = allDone ? 'Repasá o medí tu velocidad' : `Lección ${TB ? tnApp.tnNum(nl) : nl.n}: ${nl.name}`;
    $id('mdBar').style.width = Math.round(block.done / block.total * 100) + '%';
    $id('mdCount').textContent = TB ? `${block.done} de ${block.total} de este cinturón` : `${block.done} de ${block.total} del bloque` + (inBelt || baseAll ? '' : ` · ${baseDone} de ${LESSONS.length} del curso`);
    renderMarks();
    renderBattles();
  }
  const bars = (vals, lower) => {
    if (vals.length < 2) return '';
    const v = vals.slice(-10), hi = Math.max(...v), lo = Math.min(...v);
    return `<span class="nv-spark" aria-hidden="true">${v.map(x => `<i style="height:${hi === lo ? 60 : Math.round(20 + 80 * (lower ? hi - x : x - lo) / (hi - lo))}%"></i>`).join('')}</span>`;
  };
  const evolution = (vals, unit, lower) => vals.length < 2 ? (vals.length ? 'Una sola vez: jugá de nuevo para ver tu evolución.' : '')
    : `${vals.length} intentos · el primero: ${vals[0]} ${unit}` + ((lower ? vals.at(-1) < vals[0] : vals.at(-1) > vals[0]) ? ` · el último: ${vals.at(-1)} ${unit}` : '');
  function renderMarks() {
    const ppm = tnApp.bestPpm(), iq = tnApp.bestIq(), best = Desafios.bests(), hist = Desafios.history();
    const speeds = tnApp.speedTests().map(t => t.ppm), iqs = tnApp.iqRuns().map(r => r.iq).filter(Boolean);
    const card = (key, title, value, unit, vals, lower, dare) => `<article class="nv-rec" data-mark="${key}"><div class="nv-rec-top"><b>${title}</b>${bars(vals, lower)}</div>
      <div class="nv-rec-val">${value != null ? `${value}<small> ${unit}</small>` : '<span>Sin marca todavía</span>'}</div><p>${value != null ? evolution(vals, unit, lower) : ''}</p>
      <div class="actions"><button class="btn${value != null ? '' : ' primary'}" data-beat="${key}">${value != null ? 'Superarme' : 'Jugar'}</button>${dare && value != null ? `<button class="btn primary" data-dare="${key}">⚔️ Desafiar a un amigo</button>` : ''}</div><div class="nv-rec-box"></div></article>`;
    const games = ['chimpance', 'numeros', 'visual', 'reflejos', ...(best.celu != null ? ['celu'] : [])];
    $id('mdMarks').innerHTML = card('speed', 'Velocidad en la compu', ppm, 'ppm', speeds, false, false) + card('iq', 'IQ ninja', iq, '', iqs, false, false)
      + games.map(id => { const g = Desafios.GAMES[id]; return card(id, g.name, best[id], g.unit, hist[id] || [], g.lower, true); }).join('');
    $id('mdMarks').querySelectorAll('[data-beat]').forEach(b => b.onclick = () => {
      const k = b.dataset.beat; capture('dojo_beat', { mark: k });
      if (k === 'speed') tnApp.start('test'); else if (k === 'iq') tnApp.startQuiz('ninja'); else openGame(k, { from: 'dojo' });
    });
    $id('mdMarks').querySelectorAll('[data-dare]').forEach(b => b.onclick = () => {
      const k = b.dataset.dare; capture('dojo_dare', { game: k });
      Desafios.dare(k, Desafios.bests()[k], b.closest('.nv-rec').querySelector('.nv-rec-box'));
    });
  }
  // Batallas: "Tu turno" (you got a link and haven't played), "Esperando rival" (you sent one nobody played yet:
  // no win is made up for an invitation that was ignored) and "Finalizadas", with the revenge.
  let battlesAt = 0, battlesRun = 0;
  async function renderBattles(force) {
    if (!$id('mdBattles') || (!force && Date.now() - battlesAt < 15000)) return;
    battlesAt = Date.now(); const run = ++battlesRun;
    const { mine, remote } = await Desafios.battles();
    if (run !== battlesRun) return;
    const byId = new Map(remote.map(b => [b.id, b])), turn = [], waiting = [], done = [];
    const items = [...mine.map(l => ({ l, r: byId.get(l.id) })), ...remote.filter(r => r.role && !mine.some(l => l.id === r.id)).map(r => ({ l: null, r }))];
    for (const { l, r } of items) {
      const role = l?.role || r.role, game = l?.game || r.game, g = Desafios.GAMES[game];
      if (!g) continue;
      if (role === 'sent') {
        const resp = r?.responses || [], last = resp.at(-1), score = r?.score ?? l.score;
        if (!last) { waiting.push({ game, html: `Tu marca: <b>${score} ${g.unit}</b> · nadie la jugó todavía` }); continue; }
        const mineRes = last.result === 'won' ? 'lost' : last.result === 'lost' ? 'won' : 'tie';
        done.push({ game, res: mineRes, html: `<b>${esc(last.name)}</b> ${last.score} vs <b>vos</b> ${score} ${g.unit}${resp.length > 1 ? ` · y ${resp.length - 1} más` : ''}`, rival: { from: last.name, score: last.score } });
      } else {
        const my = l?.myScore ?? r?.myScore, from = l?.from || r.from, target = l?.target ?? r.score, id = l?.id || r.id;
        if (my == null) { turn.push({ game, html: `<b>${esc(from)}</b> te desafía: ${target} ${g.unit}`, battle: { id, from, score: target } }); continue; }
        const res = my === target ? 'tie' : (g.lower ? my < target : my > target) ? 'won' : 'lost';
        done.push({ game, res, html: `<b>${esc(from)}</b> ${target} vs <b>vos</b> ${my} ${g.unit}`, rival: { id, from, score: target } });
      }
    }
    const RES = { won: '🏆 Ganaste', lost: 'Perdiste', tie: '🤝 Empate' };
    const row = (it, i, kind) => `<li class="nv-battle ${it.res || ''}"><div><span class="nv-battle-game">${Desafios.GAMES[it.game].name}${it.res ? ` · <b>${RES[it.res]}</b>` : ''}</span><span>${it.html}</span></div>${kind === 'turn' ? `<button class="btn primary" data-play="${i}">Jugar</button>` : kind === 'done' ? `<button class="btn" data-revenge="${i}">Revancha</button>` : ''}</li>`;
    const list = (title, arr, kind) => arr.length ? `<section class="nv-blist"><h3>${title} <span>${arr.length}</span></h3><ul>${arr.map((it, i) => row(it, i, kind)).join('')}</ul></section>` : '';
    $id('mdBattles').innerHTML = turn.length + waiting.length + done.length
      ? list('Tu turno', turn, 'turn') + list('Esperando rival', waiting, 'wait') + list('Finalizadas', done, 'done')
      : `<div class="nv-card nv-bempty"><span aria-hidden="true">⚔️</span><p>Tu primera batalla empieza con una marca. Jugá un desafío corto y compartilo con alguien que creas que puede superarte.</p><button class="btn primary" id="mdFirstBattle">Jugar y desafiar</button></div>`;
    $id('mdNewBattle').parentElement.hidden = !(turn.length + waiting.length + done.length);
    $id('mdTurnCount').hidden = !turn.length; $id('mdTurnCount').textContent = turn.length;
    if ($id('mdFirstBattle')) $id('mdFirstBattle').onclick = newBattle;
    $id('mdBattles').querySelectorAll('[data-play]').forEach(b => b.onclick = () => { const it = turn[b.dataset.play]; capture('battle_play_turn', { game: it.game }); openGame(it.game, { battle: it.battle }); });
    $id('mdBattles').querySelectorAll('[data-revenge]').forEach(b => b.onclick = () => {
      const it = done[b.dataset.revenge]; capture('battle_revenge', { game: it.game });
      openGame(it.game, { battle: { id: it.rival.id || null, from: it.rival.from, score: it.rival.score } });
    });
  }
  function newBattle() { capture('battle_new', { from: 'dojo' }); goTo('desafios'); }

  // Progress checks of the course: an optional starting point before lesson 1, a short control at lesson 6, a
  // summary (and an optional measurement) at lesson 10, one at the end of each block, and the final measurement at
  // 26. Speed, precision and keys mastered; a measurement is compared only with an equivalent one (the same
  // 1-minute test with the same accents setting), and a drop is said as it is: no improvement is made up.
  const CKEY = 'tn-controles';
  const ctl = () => { try { const c = JSON.parse(localStorage.getItem(CKEY)) || {}; return { seen: {}, results: {}, ...c }; } catch { return { seen: {}, results: {} }; } };
  const saveCtl = c => { try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch {} };
  function courseStats() {
    const { LESSONS, state: S } = tnApp, passed = LESSONS.filter(l => S.lessons[l.id]?.stars >= 1);
    const keys = new Set(passed.filter(l => l.type === 'keys').flatMap(l => [...l.keys]));
    const marks = passed.map(l => S.lessons[l.id]).filter(m => Number.isFinite(m.ppm) && Number.isFinite(m.acc));
    const avg = k => marks.length ? Math.round(marks.reduce((a, m) => a + m[k], 0) / marks.length) : null;
    return { done: passed.length, total: LESSONS.length, keys: keys.size, ppm: avg('ppm'), acc: avg('acc') };
  }
  const methodAs = id => tnApp.METHODS.find(m => m.id === id)?.as || '';
  // A measurement against the starting point: only the same test with the same accents setting counts
  function compare(r) {
    const base = tnApp.speedTests()[0];
    if (!base || (base.ppm === r.ppm && base.acc === r.acc && Math.abs(base.date - r.date) < 5000)) return { text: 'Es tu primera medición: queda como tu punto de partida.', compared: false };
    if (base.accents !== r.accents) return { text: 'No la comparamos con tu punto de partida: cambiaste la configuración de las tildes, así que no es la misma prueba.', compared: false };
    const d = r.ppm - base.ppm, both = `Al empezar: ${base.ppm} ppm ${methodAs(base.method)} (${base.acc}% de precisión). Hoy: ${r.ppm} ppm ${methodAs(r.method)} (${r.acc}%).`;
    return { compared: true, diff: d, text: d > 0 ? `+${d} palabras por minuto desde tu punto de partida. ${both}` : d === 0 ? `La misma velocidad que al empezar. ${both}` : `${-d} palabras por minuto menos que al empezar: es normal mientras cambiás de método, primero llega la precisión. ${both}` };
  }
  const chips = (st, r) => [r ? `⚡ <b>${r.ppm}</b> ppm` : st.ppm != null ? `⚡ <b>${st.ppm}</b> ppm promedio` : '', r ? `🎯 <b>${r.acc}%</b> de precisión` : st.acc != null ? `🎯 <b>${st.acc}%</b> de precisión` : '', `⌨ <b>${st.keys}</b> teclas dominadas`, `📘 <b>${st.done}</b> de ${st.total} lecciones`].filter(Boolean).map(c => `<span>${c}</span>`).join('');
  let checkShown = '';
  function renderCheck() {
    const box = $id('nvCheck'); if (!box || !window.tnApp) return;
    const C = ctl(), st = courseStats(), tests = tnApp.speedTests(), { GROUPS, LESSONS, state: S } = tnApp;
    const btn = (label, action, primary) => ({ label, action, primary });
    let card = null;
    if (C.show && C.results[C.show]) {
      const r = C.results[C.show], isControl = r.id === 'control', cmp = isControl ? null : compare(r);
      card = { id: C.show + '-result', eyebrow: isControl ? 'Control de la lección 6' : C.show === 'final' ? 'Medición final' : C.show === 'base' ? 'Tu punto de partida' : 'Medición de la lección 10',
        title: isControl ? `${r.ppm} palabras por minuto con ${r.acc}% de precisión` : C.show === 'base' ? `Arrancás en ${r.ppm} palabras por minuto` : `${r.ppm} palabras por minuto con ${r.acc}% de precisión`,
        text: isControl ? 'Un control corto con todas las teclas que aprendiste. Seguí con la próxima lección: la precisión primero, la velocidad llega sola.' : cmp.text,
        stats: chips(st, r), actions: [btn('Seguir →', 'ack', true)] };
    } else if (st.done === 0 && !tests.length && !C.seen.base) {
      card = { id: 'base', eyebrow: 'Antes de empezar · opcional', title: 'Medí tu punto de partida', text: 'Un minuto escribiendo como escribís hoy. Al terminar el curso repetís la misma prueba y ves cuánto cambiaste, con números reales.',
        actions: [btn('⏱ Medir cómo escribo hoy · 1 min', 'measure', true), btn('Empezar sin medir', 'skip')] };
    } else if (st.done >= st.total && !C.seen.final) {
      card = { id: 'final', eyebrow: '¡Curso completo! · Medición final', title: 'Repetí la prueba del principio', text: tests.length ? 'El mismo test de 1 minuto, ahora a ciegas. Lo comparamos con tu punto de partida solo si es la misma prueba.' : 'El test de 1 minuto: como no mediste al empezar, queda como tu marca de referencia.',
        stats: chips(st), actions: [btn('⏱ Hacer la medición final · 1 min', 'measure', true), btn('Ahora no', 'skip')] };
    } else if (st.done >= 10 && st.done < st.total && !C.seen.l10) {
      card = { id: 'l10', eyebrow: 'Control de progreso · lección 10', title: `Vas ${st.done} de ${st.total}: te faltan ${st.total - st.done}`, text: 'Así venís en las lecciones. Si querés, medí tu velocidad en el test de 1 minuto (opcional).',
        stats: chips(st), actions: [btn('⏱ Medir mi velocidad · 1 min', 'measure', true), btn('Seguir con las lecciones', 'skip')] };
    } else if (st.done >= 6 && st.done < 10 && !C.seen.l6) {
      card = { id: 'l6', eyebrow: 'Control de progreso · lección 6', title: 'Un desafío corto con todo lo que aprendiste', text: 'Unas palabras con las teclas que ya sabés, sin mirar. No cambia tus estrellas: es para ver cómo venís.',
        stats: chips(st), actions: [btn('Hacer el control', 'control', true), btn('Ahora no', 'skip')] };
    } else {
      // the block of the latest lesson passed, when it is complete (the first one is the control at lesson 6)
      const last = LESSONS.filter(l => S.lessons[l.id]?.stars >= 1).at(-1), gi = last ? last.g : -1;
      if (gi > 0 && st.done < st.total && !C.seen['g' + gi] && LESSONS.filter(l => l.g === gi).every(l => S.lessons[l.id]?.stars >= 1)) {
        const ls = LESSONS.filter(l => l.g === gi), ms = ls.map(l => S.lessons[l.id]).filter(m => Number.isFinite(m.ppm));
        const bppm = ms.length ? Math.round(ms.reduce((a, m) => a + m.ppm, 0) / ms.length) : null, bacc = ms.length ? Math.round(ms.reduce((a, m) => a + m.acc, 0) / ms.length) : null;
        card = { id: 'g' + gi, eyebrow: 'Bloque completo', title: `«${GROUPS[gi].name}»: listo ✓`, text: `${ls.length} lecciones${bppm != null ? `, con ${bppm} palabras por minuto y ${bacc}% de precisión en promedio` : ''}. Vas ${st.done} de ${st.total}.`,
          stats: chips(st), actions: [btn('Seguir →', 'skip', true)] };
      }
    }
    box.hidden = !card;
    if (!card) return;
    $id('nvCheckEyebrow').textContent = card.eyebrow; $id('nvCheckTitle').textContent = card.title; $id('nvCheckText').textContent = card.text;
    $id('nvCheckStats').innerHTML = card.stats || ''; $id('nvCheckStats').hidden = !card.stats;
    $id('nvCheckActions').innerHTML = card.actions.map((a, i) => `<button class="btn${a.primary ? ' primary' : ''}" type="button" data-check="${i}">${a.label}</button>`).join('');
    $id('nvCheckActions').querySelectorAll('[data-check]').forEach(b => b.onclick = () => checkAction(card, card.actions[b.dataset.check].action));
    if (checkShown !== card.id) { checkShown = card.id; capture('checkpoint_shown', { id: card.id }); }
  }
  function checkAction(card, action) {
    const C = ctl(); capture('checkpoint_action', { id: card.id, action });
    if (action === 'ack') { C.seen[C.show] = 1; if (C.show === 'control') C.seen.l6 = 1; C.show = null; }
    else if (action === 'skip') C.seen[card.id] = 1;
    else if (action === 'measure') { C.measure = card.id; saveCtl(C); tnApp.start('test', card.id === 'base' ? 'mirando' : card.id === 'final' ? 'ciegas' : undefined); return; }
    else if (action === 'control') { C.pending = card.id; saveCtl(C); tnApp.startControl('Control de la lección 6'); return; }
    saveCtl(C); renderCheck();
  }
  // What app.js reports when a lesson or a measurement ends: the result of the check that started it
  function typed(r) {
    const C = ctl(), when = Date.now();
    if (r.id === 'control' && C.pending) { C.results[C.pending] = { ...r, date: when }; C.show = C.pending; C.pending = null; }
    else if (r.id === 'test' && C.measure) {
      C.results[C.measure] = { ...r, date: when }; C.show = C.measure; C.seen[C.measure] = 1; C.measure = null;
      const cmp = compare(C.results[C.show]); capture('checkpoint_result', { id: C.show, ppm: r.ppm, acc: r.acc, compared: cmp.compared, diff: cmp.diff ?? null });
    } else return;
    saveCtl(C);
  }

  // "Agregar a mi inicio" (PWA: manifest.webmanifest + sw.js): Templo Ninja with its icon on the phone's home
  // screen, opening Mi dojo. Android (with a browser that offers it) asks for the confirmation; on an iPhone, or
  // inside the browser of Instagram or Facebook, a short guide. A permanent card in Mi dojo, and an invitation
  // after an activity or on coming back another day; "Ahora no" keeps it quiet for seven days.
  const UA = navigator.userAgent;
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = () => /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = () => /Android/i.test(UA);
  const inApp = () => /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|musical_ly|Bytedance|LinkedInApp/i.test(UA);
  const osName = () => isIOS() ? 'ios' : isAndroid() ? 'android' : 'other';
  let installEvt = null, nudged = false;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; renderInstall(); });
  addEventListener('appinstalled', () => { store('tn-installed', '1'); capture('pwa_installed', { os: osName() }); installEvt = null; renderInstall(); $id('nvNudge').hidden = true; });
  const canOffer = () => !standalone() && store('tn-installed') !== '1' && !!(installEvt || isIOS() || isAndroid());
  function renderInstall() {
    const card = $id('nvInstall'); if (!card) return;
    const was = card.hidden; card.hidden = !canOffer();
    if (was && !card.hidden) capture('pwa_card_shown', { os: osName() });
  }
  async function install(from) {
    capture('pwa_install_click', { from, os: osName(), prompt: !!installEvt && !inApp(), in_app: inApp() });
    if (installEvt && !inApp()) {
      const e = installEvt; installEvt = null;
      try { e.prompt(); const { outcome } = await e.userChoice; capture('pwa_prompt_result', { outcome }); if (outcome === 'accepted') store('tn-installed', '1'); } catch {}
      renderInstall(); return;
    }
    const link = `${location.origin}/nueva#dojo`, ol = items => `<ol class="nv-steps">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
    const kind = inApp() ? 'in_app' : isIOS() ? 'ios' : isAndroid() ? 'android' : 'other';
    $id('nvInstallSteps').innerHTML = kind === 'in_app'
      ? `<p>Estás en el navegador de otra app (como Instagram o Facebook), que no puede agregarlo a tu inicio. Abrilo en ${isIOS() ? 'Safari' : 'Chrome'}:</p>${ol([`Tocá <b>•••</b> o <b>⋮</b>, arriba a la derecha.`, `Elegí <b>Abrir en el navegador</b> (o <b>Abrir en ${isIOS() ? 'Safari' : 'Chrome'}</b>).`, 'Ahí, en <b>Mi dojo</b>, tocá <b>Agregar a mi inicio</b>.'])}<button class="btn" type="button" id="nvInstallCopy">Copiar el link</button>`
      : kind === 'ios'
      ? `${/CriOS|FxiOS|EdgiOS/.test(UA) ? '<p>Si no te aparece la opción, abrí esta página en Safari.</p>' : ''}${ol(['Tocá <b>Compartir</b> <svg class="nv-share-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="el ícono de compartir"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg> (el cuadrado con la flecha hacia arriba).', 'Bajá y elegí <b>Agregar a inicio</b>.', 'Si aparece <b>Abrir como app web</b>, dejalo activado.', 'Tocá <b>Agregar</b>. Listo: Templo Ninja queda con su ícono.'])}`
      : kind === 'android'
      ? ol(['Tocá el menú <b>⋮</b> del navegador.', 'Elegí <b>Instalar app</b> o <b>Agregar a la pantalla de inicio</b>.', 'Confirmá con <b>Instalar</b> o <b>Agregar</b>.'])
      : ol(['En Chrome o Edge, tocá el ícono de instalar en la barra de direcciones.', 'Confirmá con <b>Instalar</b>.']);
    $id('nvInstallMsg').textContent = '';
    if ($id('nvInstallCopy')) $id('nvInstallCopy').onclick = async () => { capture('pwa_link_copied'); try { await navigator.clipboard.writeText(link); $id('nvInstallMsg').textContent = '✓ Link copiado: pegalo en Safari o Chrome.'; } catch { $id('nvInstallMsg').textContent = link; } };
    capture('pwa_guide_shown', { kind });
    $id('nvInstallDlg').showModal();
  }
  function maybeNudge(reason) {
    if (nudged || !(isIOS() || isAndroid()) || !canOffer() || tnApp.mode() !== 'home' || !$id('game').hidden) return;
    if (Date.now() - Number(store('tn-install-snooze') || 0) < 7 * 864e5) return;
    nudged = true; $id('nvNudge').hidden = false; capture('pwa_nudge_shown', { reason, os: osName() });
  }
  const snoozeNudge = () => { store('tn-install-snooze', String(Date.now())); $id('nvNudge').hidden = true; };
  let activityDone = false;

  // On the phone, the groups of a path are compact: the one in progress open, the others one line each.
  function fold() {
    for (const path of [$id('path'), $id('cogPath')]) {
      if (!path) continue;
      path.querySelectorAll(':scope > .group:not(.final):not(.belts-teaser)').forEach(g => {
        if (g.dataset.fold) return;
        const n = g.querySelectorAll('.cards > .lc').length;
        if (!n) return;
        g.dataset.fold = '1';
        const open = !!g.querySelector('.lc.next');
        g.classList.toggle('nv-folded', !open);
        const b = document.createElement('button'); b.type = 'button'; b.className = 'nv-fold-btn';
        const label = () => { const expanded = !g.classList.contains('nv-folded'); b.textContent = expanded ? 'Ocultar ▴' : `Ver las ${n} ${path.id === 'path' ? 'lecciones' : 'sesiones'} ▾`; b.setAttribute('aria-expanded', String(expanded)); };
        b.onclick = () => { g.classList.toggle('nv-folded'); label(); };
        label(); g.querySelector('.group-head > div')?.append(b);
      });
    }
  }

  // The bridge from the phone: learning with ten fingers needs a physical keyboard, so the phone offers a
  // typing challenge of its own (its own history, not the course's), saving the course for the computer, and
  // Ninja mental, which works fine on a phone. "Tengo teclado físico" turns it off.
  const courseLink = () => `${location.origin}/nueva?desde=celu#teclado`; // /nueva, not "/": there the A/B test may show the current home
  const SAVE_TEXT = 'Mi curso de Templo Ninja para aprender a escribir sin mirar el teclado (para seguir en la compu):';
  function renderBridge() {
    const on = touchOnly();
    $id('nvBridge').hidden = !on;
    $id('nvHeroSpeed').innerHTML = on ? '⚡ Desafío de celular <small>30 s</small>' : '⌨ Medir mi velocidad <small>1 min</small>';
    $id('nvHeroSave').hidden = !on;
    if (on && !renderBridge.seen) { renderBridge.seen = true; capture('mobile_bridge_shown'); }
  }
  async function saveCourse(how) {
    const url = courseLink(), text = `${SAVE_TEXT} ${url}`;
    capture('mobile_bridge_action', { action: how });
    if (how === 'share') { try { await navigator.share({ title: 'Templo Ninja · curso de teclado', text: SAVE_TEXT, url }); return; } catch { return; } }
    if (how === 'copy') { try { await navigator.clipboard.writeText(url); $id('nvSaveMsg').textContent = '✓ Link copiado. Pegalo donde lo vayas a abrir en la compu.'; } catch { $id('nvSaveMsg').textContent = url; } return; }
    if (how === 'whatsapp') return void window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    if (how === 'mail') return void (location.href = `mailto:?subject=${encodeURIComponent('Templo Ninja: mi curso para la compu')}&body=${encodeURIComponent(text)}`);
  }
  function openSave() {
    $id('nvSavePanel').hidden = false; $id('nvShare').hidden = !navigator.share;
    $id('nvSaveAccount').hidden = !$id('acctBtn').classList.contains('out'); // signed in, the progress already travels with the account
    capture('mobile_bridge_action', { action: 'open_save' });
    goTo('teclado', { sub: 'entrenar' });
  }

  // app.js tells where it goes; coming back from a lesson or a session, the page returns to that section.
  let returnTo = null;
  window.tnLayout = {
    start: l => { returnTo = { sec: 'teclado', sub: l === 'test' && !ctl().measure ? 'medir' : 'entrenar' }; enterScreen(); },
    typed: r => { activityDone = true; typed(r); },
    quiz: sess => { returnTo = { sec: 'mente', sub: sess === 'ninja' ? 'desafio' : 'entrenar' }; enterScreen(); },
    cog: () => { if (window.tnApp) goTo('mente', { sub: 'entrenar' }); else { returnTo = { sec: 'mente', sub: 'entrenar' }; history.replaceState(history.state, '', location.pathname + location.search + '#ninja'); } }, // while starting up, the address decides (below)
    home: () => {
      renderNext();
      if (window.tnApp && tnApp.mode() === 'home' && $id('game').hidden) leaveScreen(); // back from a lesson or a session by its own button
      if (returnTo && window.tnApp) { const r = returnTo, epoch = navigationEpoch; returnTo = null; requestAnimationFrame(() => { if (epoch !== navigationEpoch) return; goTo(r.sec, { sub: r.sub, smooth: false }); if (activityDone) maybeNudge('activity'); }); }
    },
  };

  addEventListener('DOMContentLoaded', () => {
    returnTo = null; // whatever app.js did while starting up, the address decides below
    window.tn?.people?.({ site_version: 'nueva' }); // every event of this page says which version it came from
    // Relocate existing nodes: their IDs, engine handlers and stored progress are preserved.
    const training = anchor('dojo').querySelector('[data-sub-of="entrenamiento"]');
    document.querySelectorAll('#home .progress-summary').forEach(s => training.append(s));
    const techniques = document.createElement('details'); techniques.className = 'nv-techniques';
    const summary = document.createElement('summary'); summary.textContent = 'Técnicas y explicaciones'; techniques.append(summary);
    $id('cogKinds').before(techniques); techniques.append($id('cogKinds'));
    document.querySelector('#profilePracticeOptions').append(document.querySelector('#dojo .dojo-options'));
    const guide = document.createElement('button'); guide.className = 'linkbtn'; guide.textContent = 'Guía de dedos y ajustes →';
    guide.onclick = () => setSub('teclado', 'ajustes'); $id('learning').after(guide);
    const progress = document.createElement('button'); progress.className = 'linkbtn'; progress.textContent = 'Mi progreso en el perfil →'; progress.onclick = () => goTo('dojo');
    techniques.after(progress);
    document.querySelectorAll('[data-profile]').forEach(b => b.onclick = () => profileTab(b.dataset.profile));
    $id('profileKeyboardSettings').onclick = () => goTo('teclado', { sub: 'ajustes' });
    document.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); if (tnApp.mode() !== 'home' || !$id('game').hidden) { Desafios.close(); tnApp.goHome(); }
      goTo(a.dataset.go); capture('nav_section', { section: a.dataset.go });
    }));
    document.querySelectorAll('[role="tab"][data-sub]').forEach(b => b.onclick = () => { const sec = b.closest('[data-view-of]').dataset.viewOf; setSub(sec, b.dataset.sub); if (sec === 'mente') history.replaceState(null, '', location.pathname + location.search + (b.dataset.sub === 'relampago' ? '#desafios' : '#ninja')); capture('nav_tab', { tab: sec, sub: b.dataset.sub }); });
    document.querySelectorAll('[data-sub-go]').forEach(b => b.onclick = () => setSub(b.closest('[data-view-of]').dataset.viewOf, b.dataset.subGo));
    $id('testBtn').onclick = () => { capture('home_cta', { cta: 'teclado_medir' }); goTo('teclado', { sub: 'medir' }); };
    $id('homeBtn').onclick = () => { Desafios.close(); tnApp.goHome(); returnTo = null; goTo('inicio'); };
    // The two doors of Inicio: "Entrenar" and "Ver más" open the same training; each button says which one it was
    const cta = (id, name, fn) => { $id(id).onclick = () => { capture('home_cta', { cta: name }); fn?.(); }; }; // replaces app.js's own handler
    cta('continue', 'teclado_entrenar', () => goTo('teclado', { sub: 'entrenar' }));
    cta('nvTkMore', 'teclado_ver_mas', () => goTo('teclado', { sub: 'entrenar' }));
    cta('scNinja', 'mente_entrenar', () => goTo('mente', { sub: 'entrenar' }));
    cta('nvMentalIq', 'mente_desafio_iq', () => goTo('mente', { sub: 'desafio' }));
    cta('scMax', 'mente_relampago', () => goTo('desafios'));
    cta('nvMentalCo', 'mente_empresas'); // a link to /profesional
    // "Todos": every training and test of the temple (the lightning challenges are drawn by renderTiles)
    const ALL = {
      teclado: () => goTo('teclado', { sub: 'entrenar' }),
      sim: () => tnApp.startQuiz('sim'),
      iq: () => tnApp.startQuiz('ninja'),
      empresas: null, // a link to /profesional
    };
    document.querySelectorAll('[data-all]').forEach(t => t.addEventListener('click', () => {
      const k = t.dataset.all; capture('home_all_tile', { tile: k });
      if (k in ALL) return ALL[k]?.();
      document.querySelector(`#cogTracks button[data-v="${k}"]`)?.click(); // a track of Ninja mental
      goTo('mente', { sub: 'entrenar' });
    }));
    $id('nvHeroSpeed').onclick = () => { if (touchOnly()) { capture('quick_start', { kind: 'celu' }); openGame('celu'); } else { capture('quick_start', { kind: 'speed' }); tnApp.start('test'); } };
    $id('nvHeroIq').onclick = $id('nvGameIq').onclick = () => { capture('quick_start', { kind: 'iq' }); tnApp.startQuiz('ninja'); };
    $id('nvGameSim').onclick = () => { capture('quick_start', { kind: 'sim' }); tnApp.startQuiz('sim'); };
    $id('tkContinue').onclick = $id('mdContinue').onclick = () => tnApp.start(tnApp.nextLesson());
    $id('mdNewBattle').onclick = newBattle;

    // The bridge from the phone
    $id('nvCelu').onclick = () => { capture('mobile_bridge_action', { action: 'celu' }); openGame('celu'); };
    $id('nvSave').onclick = $id('nvHeroSave').onclick = openSave;
    $id('nvShare').onclick = () => saveCourse('share');
    $id('nvCopy').onclick = () => saveCourse('copy');
    $id('nvWa').onclick = () => saveCourse('whatsapp');
    $id('nvMail').onclick = () => saveCourse('mail');
    $id('nvSaveAccount').onclick = () => { capture('mobile_bridge_action', { action: 'account' }); $id('acctBtn').click(); document.querySelector('#authMode [data-v="register"]')?.click(); };
    $id('nvHasKb').onclick = () => { store('tn-has-keyboard', '1'); capture('mobile_bridge_action', { action: 'has_keyboard' }); renderBridge(); renderTiles(); };
    Desafios.setOnFinish(() => { activityDone = true; });
    // Agregar a mi inicio
    $id('nvInstallBtn').onclick = () => install('dojo');
    $id('nvNudgeYes').onclick = () => { snoozeNudge(); install('nudge'); };
    $id('nvNudgeNo').onclick = () => { snoozeNudge(); capture('pwa_nudge_dismissed'); };
    $id('nvInstallClose').onclick = () => $id('nvInstallDlg').close();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (standalone()) { store('tn-installed', '1'); capture('pwa_opened', { os: osName() }); window.tn?.people?.({ pwa_installed: true }); }
    renderInstall();
    { // coming back another day
      const today = new Date().toISOString().slice(0, 10); let days = []; try { days = JSON.parse(store('tn-visit-days')) || []; } catch {}
      if (!days.includes(today)) { days = [...days, today].slice(-30); store('tn-visit-days', JSON.stringify(days)); if (days.length >= 2) setTimeout(() => maybeNudge('return'), 2500); }
    }
    Desafios.setCta('celu', '💻 Guardarme el curso para la compu', () => { Desafios.close(); openSave(); });
    // Arriving on the computer from the link saved on the phone
    const q = new URLSearchParams(location.search);
    if (q.has('app')) { q.delete('app'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); }
    if (q.get('desde') === 'celu') {
      q.delete('desde'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
      if (!touchOnly()) { capture('continued_from_phone'); window.tn?.people?.({ came_from_phone: true }); $id('nvWelcome').hidden = false; }
    }

    // Arriving from a battle link: the invitation (who challenges, in what, the score to beat), no account needed
    const battleId = q.get('batalla');
    if (battleId) {
      q.delete('batalla'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
      capture('battle_link_opened');
      const gone = text => { $id('mdMsg').textContent = text; $id('mdMsg').hidden = false; goTo('dojo', { sub: 'batallas', smooth: false }); };
      Desafios.loadBattle(battleId).then(b => {
        if (!b) return gone('Esa batalla ya no existe (duran 60 días). Jugá un desafío y mandá la tuya.');
        if (b.role === 'sent' || Desafios.known().some(r => r.id === b.id && r.role === 'sent')) return gone('Esa batalla la creaste vos: cuando tu amigo la juegue, la ves acá.');
        openGame(b.game, { battle: b });
      }).catch(() => gone('No pudimos abrir la batalla. Revisá tu conexión y probá de nuevo.'));
    }

    // Optional dark mode, remembered in this browser (a script in the head applies it before the first paint).
    const themeBtn = $id('nvTheme');
    const paintTheme = () => { const dark = document.documentElement.dataset.theme === 'dark'; themeBtn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); themeBtn.title = dark ? 'Modo claro' : 'Modo oscuro'; themeBtn.setAttribute('aria-pressed', String(dark)); };
    themeBtn.onclick = () => {
      const dark = document.documentElement.dataset.theme !== 'dark';
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      store('tn-theme', dark ? 'dark' : 'light');
      paintTheme(); capture('theme_changed', { theme: dark ? 'dark' : 'light' });
      if (tnApp.mode() === 'home' && tnApp.chartShown()) tnApp.drawChart();
    };
    paintTheme();

    // The section on screen lights up in the header and the tab bar
    // The paths are drawn again when something changes (a track, an account): keep them compact
    for (const p of [$id('path'), $id('cogPath')]) new MutationObserver(fold).observe(p, { childList: true });

    $id('gameBack').onclick = () => Desafios.close();
    renderTiles(); renderNext(); renderBridge();
    const linkedGame = gameOf(location.hash);
    if (tnApp.mode() === 'home' && !battleId) { if (linkedGame) openGame(linkedGame); else goTo(secOf(location.hash), { smooth: false }); }
    // Back and Forward: out of a practice, or to the section of that entry (hashchange, below)
    document.addEventListener('click', e => { if (e.target.closest?.('#home, .nv-top, .nv-tabbar')) { pushNext = true; setTimeout(() => { pushNext = false; }); } }, true);
    addEventListener('popstate', () => {
      if (leaving) { // the entry of a practice left from the page: the section already on screen keeps the address
        leaving = false; goTo(curSec, { sub: curSub, scroll: false, replace: true });
        skipHash = location.href; setTimeout(() => { skipHash = null; }, 200);
        return;
      }
      if (!$id('game').hidden) return Desafios.close();
      if (tnApp.mode() !== 'home') tnApp.goHome();
    });
    addEventListener('hashchange', () => { if (skipHash === location.href) { skipHash = null; return; } if (tnApp.mode() !== 'home' || !$id('game').hidden) return; if (gameOf(location.hash)) openGame(gameOf(location.hash)); else goTo(secOf(location.hash)); });
  });
})();
