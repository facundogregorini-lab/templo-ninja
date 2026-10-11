// Desafíos rápidos (/nueva): four short brain games, free and without an account. Each one runs in #game and
// ends with a score, a reference to compare with and the best score of this browser.
//   reflejos  · reaction time, 5 tries (average in ms, lower is better)
//   numeros   · number memory: a number shows for a moment and you type it back; one digit more each time
//   chimpance · chimp test: numbers on a grid; after the first click they hide, click them in order
//   visual    · visual memory: some squares light up; click the same ones, the grid grows
window.Desafios = (() => {
  const $id = id => document.getElementById(id);
  const capture = (e, p) => window.tn?.capture?.(e, p);
  const rnd = n => Math.floor(Math.random() * n);
  const KEY = 'tn-desafios', HKEY = 'tn-desafios-hist';
  const history = () => { try { return JSON.parse(localStorage.getItem(HKEY)) || {}; } catch { return {}; } }; // the last scores of each game
  const bests = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const saveBest = (id, score, lowerIsBetter) => {
    const b = bests(), old = b[id];
    const better = old == null || (lowerIsBetter ? score < old : score > old);
    if (better) { b[id] = score; try { localStorage.setItem(KEY, JSON.stringify(b)); } catch {} }
    const h = history(); h[id] = [...(h[id] || []), score].slice(-20); try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch {}
    return { best: better ? score : old, record: better && old != null };
  };

  /* ---------- Batallas: a score to beat, sent by link (api/batallas.js) ---------- */
  const BKEY = 'tn-batallas', NICK = 'tn-nick';
  const local = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch {} return null; };
  const known = () => local(BKEY) || [];
  const keep = rec => { const all = known().filter(r => r.id !== rec.id || r.role !== rec.role); all.unshift({ ...known().find(r => r.id === rec.id && r.role === rec.role), ...rec }); local(BKEY, all.slice(0, 50)); };
  const nick = () => window.tnApp?.userName?.() || local(NICK) || '';
  async function api(method, payload, query = '') {
    const token = (() => { try { return localStorage.getItem('teclado-ciego-token'); } catch { return null; } })();
    const r = await fetch('/api/batallas' + query, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, ...(payload ? { body: JSON.stringify(payload) } : {}) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error || 'No se pudo conectar.'), { status: r.status });
    return data;
  }
  const battleUrl = id => `${location.origin}/nueva?batalla=${id}`; // battles live in /nueva: "/" may show the current home (A/B test)
  const escape = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const GAMES = {
    reflejos: { name: 'Reflejos', unit: 'ms', lower: true, lead: 'Cuando el recuadro se ponga verde, tocá lo más rápido que puedas. Son 5 intentos.',
      compare: s => `${s < 220 ? 'Reflejos de ninja ⚡' : s < 280 ? '¡Muy rápido!' : s < 350 ? 'Bien, en el rango normal.' : 'Seguí practicando: con el celu y los dedos fríos todo es más lento.'} Un tiempo de reacción típico está entre 200 y 300 ms.` },
    numeros: { name: 'Memoria de números', unit: 'dígitos', lead: 'Vas a ver un número por unos segundos. Cuando desaparezca, escribilo. Cada vez es un dígito más largo.',
      compare: s => `${s >= 10 ? 'Memoria de ninja 🧠' : s >= 8 ? '¡Muy por encima de lo habitual!' : s >= 6 ? 'Bien: en el rango de la mayoría.' : 'Arrancaste. Se entrena agrupando los dígitos de a dos o tres.'} La mayoría de los adultos recuerda entre 5 y 9 dígitos (el famoso "7 ± 2").` },
    chimpance: { name: 'Test del chimpancé', unit: 'números', lead: 'Memorizá dónde está cada número. Tocá el 1: los demás se esconden y tenés que seguir en orden. Tenés 3 vidas.',
      compare: s => `${s >= 9 ? '¡Le ganaste al chimpancé! 🐒' : 'El chimpancé todavía te gana. 🐒'} Ayumu, un chimpancé de la Universidad de Kioto, recordaba 9 números de un vistazo (Inoue y Matsuzawa, 2007).` },
    celu: { name: 'Desafío de celular', unit: 'ppm', lead: 'Escribí el texto con el teclado del celular, lo más rápido y prolijo que puedas. Tenés 30 segundos: el reloj arranca con la primera letra.',
      compare: s => `${s >= 40 ? '¡Rapidísimo con el pulgar! 📱' : s >= 25 ? '¡Muy bien para un celular!' : 'Bien: escribir en una pantalla es lento para todos.'} Es tu velocidad en el celular, aparte de la de la compu (tu precisión: ${lastAcc}%). En la compu la mediana es de 40 palabras por minuto, y con el curso aprendés a escribir sin mirar.` },
    visual: { name: 'Memoria visual', unit: 'nivel', lead: 'Se iluminan algunos cuadros: memorizalos y tocá los mismos. Cada nivel suma uno y la grilla crece. Tenés 3 vidas.',
      compare: s => `${s >= 12 ? 'Memoria fotográfica 📸' : s >= 8 ? '¡Muy buena memoria visual!' : 'Buen comienzo.'} Ayuda mirar el dibujo que forman los cuadros, no cada cuadro suelto.` },
  };

  let cur = null, timers = [], keyHandler = null, onExit = () => {}, lastAcc = 100, battle = null;
  const CTA = {}; // an extra button for a game's result (setCta)
  let onFinish = null; // told of every finished game (setOnFinish)
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clear = () => { timers.forEach(clearTimeout); timers = []; if (keyHandler) removeEventListener('keydown', keyHandler); keyHandler = null; };
  const stage = () => $id('gameStage');
  const live = txt => { $id('gameLive').textContent = txt; };
  const onKey = fn => { if (keyHandler) removeEventListener('keydown', keyHandler); keyHandler = fn; addEventListener('keydown', fn); };

  function open(id, exit, opts = {}) {
    if (!GAMES[id]) return;
    clear(); cur = id; onExit = exit || onExit; battle = opts.battle || null;
    $id('gameTitle').textContent = GAMES[id].name;
    live('');
    battle ? invitation() : intro();
    capture('game_opened', { game: id, battle: !!battle });
  }
  // Opened from a battle link: who challenges, in what, and the score to beat. Playing needs no account.
  function invitation() {
    const g = GAMES[cur], b = battle;
    stage().className = 'gm-stage';
    stage().innerHTML = `<div class="gm-intro gm-invite"><span class="gm-swords" aria-hidden="true">⚔️</span><span class="eyebrow">Batalla</span>
      <h3><b>${escape(b.from)}</b> te desafía en ${g.name}</h3><div class="gm-target"><span>Marca a superar</span><b>${b.score} ${g.unit}</b></div>
      <p>${g.lead}</p>${nick() ? '' : `<label class="gm-nick gm-nick-opt">Tu nombre (opcional, para que ${escape(b.from)} sepa quién jugó)<input id="gmInvNick" maxlength="20" autocomplete="nickname"></label>`}
      <button class="btn primary" id="gameGo">Aceptar el desafío</button><p class="gm-fine">Sin cuenta y en un minuto.</p></div>`;
    if (b.id) keep({ id: b.id, role: 'got', game: cur, from: b.from, target: b.score, at: Date.now() });
    $id('gameGo').onclick = () => { const n = $id('gmInvNick')?.value.trim(); if (n) local(NICK, n.slice(0, 20)); capture('battle_accepted', { game: cur, named: !!n }); capture('game_started', { game: cur, battle: true }); RUN[cur](); };
    $id('gameGo').focus();
  }
  function close() { clear(); cur = null; onExit(); }

  function intro() {
    const g = GAMES[cur], best = bests()[cur];
    stage().className = 'gm-stage';
    stage().innerHTML = `<div class="gm-intro"><p>${g.lead}</p>${best != null ? `<p class="gm-best">Tu mejor marca: <b>${best} ${g.unit}</b></p>` : ''}<button class="btn primary" id="gameGo">Empezar</button></div>`;
    $id('gameGo').onclick = () => { capture('game_started', { game: cur }); RUN[cur](); };
    $id('gameGo').focus();
  }
  function finish(score) {
    clear();
    const g = GAMES[cur], { best, record } = saveBest(cur, score, g.lower);
    capture('game_completed', { game: cur, score, record, battle: !!battle });
    try { onFinish?.(cur, score); } catch {}
    if (battle) return battleResult(score);
    stage().className = 'gm-stage';
    stage().innerHTML = `<div class="gm-result"><span class="eyebrow">Tu resultado</span><div class="gm-score">${score}<small> ${g.unit}</small></div>
      ${record ? '<p class="gm-record">🏅 ¡Nueva mejor marca!</p>' : `<p class="gm-best">Tu mejor marca: <b>${best} ${g.unit}</b></p>`}
      <p class="gm-compare">${g.compare(score)}</p>
      <div class="gm-dare"><p>¿Tenés un amigo que pueda superarte?</p><button class="btn primary" id="gameDare">⚔️ Desafiar a un amigo</button><div id="gameDareBox"></div></div>
      ${CTA[cur] ? `<div class="actions"><button class="btn primary" id="gameCta">${CTA[cur].label}</button></div>` : ''}
      <div class="actions"><button class="btn" id="gameAgain">${record || best != null ? 'Superar mi marca' : 'Otra vez'}</button><button class="btn" id="gameOut">Más desafíos</button></div></div>`;
    if (CTA[cur]) $id('gameCta').onclick = () => { capture('game_cta', { game: cur }); CTA[cur].fn(); };
    $id('gameAgain').onclick = () => { capture('game_started', { game: cur, again: true }); RUN[cur](); };
    $id('gameOut').onclick = close;
    $id('gameDare').onclick = () => dare(cur, score, $id('gameDareBox'));
    ($id('gameCta') || $id('gameDare')).focus();
  }
  const open_ = url => window.open(url, '_blank', 'noopener');

  // Challenge a friend with a score: a name to show (the account's, or one chosen once), then the link to share.
  async function dare(game, score, box, { revenge = false } = {}) {
    const g = GAMES[game];
    if (!nick()) {
      box.innerHTML = `<form class="gm-nick" id="gmNick"><label>¿Con qué nombre te ve tu amigo?<input id="gmNickIn" maxlength="20" autocomplete="nickname" required></label><button class="btn primary">Crear el desafío</button></form>`;
      $id('gmNickIn').focus();
      $id('gmNick').onsubmit = e => { e.preventDefault(); const n = $id('gmNickIn').value.trim(); if (!n) return; local(NICK, n.slice(0, 20)); dare(game, score, box, { revenge }); };
      return;
    }
    box.innerHTML = '<p class="gm-fine">Creando el desafío…</p>';
    try {
      const { battle: b } = await api('POST', { action: 'create', game, score, name: nick() });
      keep({ id: b.id, role: 'sent', game, score, at: Date.now() });
      capture('battle_created', { game, score, revenge });
      const url = battleUrl(b.id), text = `⚔️ ${revenge ? 'Revancha' : 'Te desafío'} en Templo Ninja: hice ${score} ${g.unit} en "${g.name}". ¿Me superás?`;
      box.innerHTML = `<p class="gm-fine">Listo: mandale el link. Cuando lo juegue, lo ves en <b>Mi dojo › Batallas</b>.</p>
        <div class="actions">${navigator.share ? '<button class="btn primary" id="gmBShare">Compartir…</button>' : ''}<button class="btn${navigator.share ? '' : ' primary'}" id="gmBWa">WhatsApp</button><button class="btn" id="gmBCopy">Copiar el link</button></div><p class="gm-fine" id="gmBMsg"></p>`;
      const sent = how => capture('battle_shared', { game, how });
      if ($id('gmBShare')) $id('gmBShare').onclick = async () => { sent('share'); try { await navigator.share({ text, url }); } catch {} };
      $id('gmBWa').onclick = () => { sent('whatsapp'); open_(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`); };
      $id('gmBCopy').onclick = async () => { sent('copy'); try { await navigator.clipboard.writeText(url); $id('gmBMsg').textContent = '✓ Link copiado.'; } catch { $id('gmBMsg').textContent = url; } };
    } catch (err) { box.innerHTML = `<p class="gm-fine">${escape(err.message)}</p>`; }
  }

  // The friend's result against the battle: who won, the revenge, and the account (offered, never required)
  async function battleResult(score) {
    const g = GAMES[cur], b = battle; battle = null;
    stage().className = 'gm-stage';
    stage().innerHTML = '<div class="gm-result"><p class="gm-fine">Guardando tu resultado…</p></div>';
    let result = score === b.score ? 'tie' : (g.lower ? score < b.score : score > b.score) ? 'won' : 'lost';
    if (b.id) try { result = (await api('POST', { action: 'respond', id: b.id, score, name: nick() || 'Un ninja' })).result; } catch {}
    if (b.id) keep({ id: b.id, role: 'got', game: cur, from: b.from, target: b.score, myScore: score, result, at: Date.now() });
    capture('battle_answered', { game: cur, result });
    const title = result === 'won' ? `¡Superaste a ${escape(b.from)}! 🏆` : result === 'tie' ? '¡Empate! 🤝' : `${escape(b.from)} ganó esta vez`;
    const guest = !window.tnApp?.userName?.();
    stage().innerHTML = `<div class="gm-result"><span class="eyebrow">Batalla</span><h3 class="gm-battle-title ${result}">${title}</h3>
      <div class="gm-vs"><div><span>${escape(b.from)}</span><b>${b.score}</b></div><i>vs</i><div class="me"><span>Vos</span><b>${score}</b></div></div><p class="gm-fine">${g.unit} en ${g.name}</p>
      <div class="gm-dare"><button class="btn primary" id="gameRevenge">⚔️ ${result === 'won' ? 'Mandale la revancha' : 'Pedir revancha'}</button><div id="gameDareBox"></div></div>
      ${guest ? `<div class="gm-acct"><p>${result === 'won' ? 'Guardá tu resultado y mandale la revancha.' : 'Guardá tu resultado y seguí tus batallas desde cualquier dispositivo.'}</p><button class="btn" id="gameAcct">Crear mi cuenta</button></div>` : ''}
      <div class="actions"><button class="btn" id="gameAgain">Jugar de nuevo</button><button class="btn" id="gameOut">Más desafíos</button></div></div>`;
    $id('gameRevenge').onclick = () => dare(cur, score, $id('gameDareBox'), { revenge: true });
    if (guest) $id('gameAcct').onclick = () => { capture('battle_account', { game: cur }); $id('acctBtn')?.click(); document.querySelector('#authMode [data-v="register"]')?.click(); };
    $id('gameAgain').onclick = () => RUN[cur]();
    $id('gameOut').onclick = close;
    $id('gameRevenge').focus();
  }

  const CELU_WORDS = 'hola como estas bien gracias nos vemos manana te llamo luego ya llegue estoy en camino que bueno dale perfecto todo listo cuando puedas avisame mas tarde un abrazo buen dia hoy no puedo el lunes si quiero ir con vos tengo que salir ahora mismo despues te cuento'.split(' ');
  const RUN = {
    // ---------- Typing on the phone: 30 seconds with the screen keyboard (its own history, not the course's) ----------
    celu() {
      clear();
      const text = Array.from({ length: 40 }, () => CELU_WORDS[rnd(CELU_WORDS.length)]).join(' ');
      stage().className = 'gm-stage';
      stage().innerHTML = `<div class="gm-celu"><div class="gm-celu-text" id="gmCeluText"></div><input id="gmCeluIn" class="gm-input gm-celu-in" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="Escribí el texto acá" placeholder="Tocá acá y empezá a escribir"><div class="gm-timer"><i id="gmCeluBar" style="width:100%"></i></div></div>`;
      const inp = $id('gmCeluIn'), box = $id('gmCeluText'), SECS = 30;
      let t0 = 0, done = false;
      const paint = () => {
        const typed = inp.value.toLowerCase(); let html = '';
        for (let i = 0; i < Math.min(text.length, typed.length + 60); i++) html += `<span class="${i < typed.length ? (typed[i] === text[i] ? 'ok' : 'no') : i === typed.length ? 'cur' : ''}">${text[i] === ' ' ? ' ' : text[i]}</span>`;
        box.innerHTML = html;
        const curEl = box.querySelector('.cur'); if (curEl) box.scrollTop = Math.max(0, curEl.offsetTop - box.offsetTop - 30);
      };
      const end = () => {
        if (done) return; done = true;
        const typed = inp.value.toLowerCase(); let ok = 0;
        for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) ok++;
        lastAcc = typed.length ? Math.round(100 * ok / typed.length) : 100;
        finish(Math.round(ok / 5 / (SECS / 60)));
      };
      const tickBar = () => { if (done) return; const left = Math.max(0, SECS - (performance.now() - t0) / 1000); $id('gmCeluBar').style.width = (100 * left / SECS) + '%'; live(`${Math.ceil(left)} s`); if (left > 0) later(tickBar, 200); };
      inp.addEventListener('input', () => { if (!t0) { t0 = performance.now(); later(end, SECS * 1000); tickBar(); } paint(); if (inp.value.length >= text.length) end(); });
      onKey(e => { if (e.key === 'Escape') close(); });
      live(`${SECS} s`); paint(); inp.focus();
    },

    // ---------- Reaction time ----------
    reflejos() {
      clear();
      const times = [], TRIES = 5;
      let state = 'wait', t0 = 0;
      const box = document.createElement('button'); box.className = 'gm-react'; box.type = 'button';
      stage().className = 'gm-stage'; stage().replaceChildren(box);
      const paint = (cls, html) => { box.className = 'gm-react ' + cls; box.innerHTML = html; };
      const arm = () => {
        state = 'wait'; paint('wait', '<b>Esperá el verde…</b>');
        live(`Intento ${times.length + 1} de ${TRIES}`);
        later(() => { state = 'go'; t0 = performance.now(); paint('go', '<b>¡Ya!</b>'); }, 1500 + rnd(2500));
      };
      const hit = () => {
        if (state === 'wait') { clear(); state = 'early'; paint('early', '<b>¡Muy pronto!</b><span>Tocá para reintentar</span>'); bindKeys(); return; }
        if (state === 'early') { arm(); return; }
        if (state === 'go') {
          const ms = Math.round(performance.now() - t0); times.push(ms); state = 'shown';
          if (times.length === TRIES) { finish(Math.round(times.reduce((a, b) => a + b, 0) / TRIES)); return; }
          paint('shown', `<b>${ms} ms</b><span>Tocá para el siguiente</span>`); return;
        }
        if (state === 'shown') arm();
      };
      const bindKeys = () => onKey(e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); hit(); } else if (e.key === 'Escape') close(); });
      box.addEventListener('pointerdown', e => { e.preventDefault(); hit(); });
      bindKeys(); arm();
    },

    // ---------- Number memory ----------
    numeros() {
      clear();
      let n = 3;
      const round = () => {
        const num = String(1 + rnd(9)) + Array.from({ length: n - 1 }, () => rnd(10)).join('');
        const ms = 1000 + n * 600;
        live(`${n} dígitos`);
        stage().className = 'gm-stage';
        stage().innerHTML = `<div class="gm-num"><div class="gm-digits">${num}</div><div class="gm-timer"><i style="animation-duration:${ms}ms"></i></div></div>`;
        onKey(e => { if (e.key === 'Escape') close(); });
        later(() => {
          stage().innerHTML = `<form class="gm-num" id="gmNumForm"><p>¿Cuál era el número?</p><input id="gmNumIn" class="gm-input" inputmode="numeric" autocomplete="off" maxlength="${n}" aria-label="El número"><button class="btn primary">Listo</button></form>`;
          const inp = $id('gmNumIn'); inp.focus();
          $id('gmNumForm').onsubmit = e => {
            e.preventDefault();
            const ok = inp.value.replace(/\D/g, '') === num;
            stage().innerHTML = `<div class="gm-num"><p class="gm-check ${ok ? 'ok' : 'bad'}">${ok ? '✓ ¡Bien!' : '✗ No era'}</p><div class="gm-compare-num"><span>Número</span><b>${num}</b><span>Vos</span><b>${(inp.value || '—').replace(/[<>&]/g, '')}</b></div><button class="btn primary" id="gmNumNext">${ok ? 'Siguiente' : 'Ver resultado'}</button></div>`;
            const next = () => ok ? (n++, round()) : finish(n - 1);
            $id('gmNumNext').onclick = next; $id('gmNumNext').focus();
          };
        }, ms);
      };
      round();
    },

    // ---------- Chimp test ----------
    chimpance() {
      clear();
      let n = 4, lives = 3;
      const COLS = 8, ROWS = 5;
      const round = () => {
        live(`${n} números · ${'♥'.repeat(lives)}`);
        const cells = []; while (cells.length < n) { const c = rnd(COLS * ROWS); if (!cells.includes(c)) cells.push(c); }
        const grid = document.createElement('div'); grid.className = 'gm-chimp'; grid.style.setProperty('--cols', COLS); grid.style.setProperty('--rows', ROWS);
        let next = 1, hidden = false;
        cells.forEach((c, i) => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'gm-cell'; b.textContent = i + 1; b.dataset.n = i + 1;
          b.style.setProperty('--c', (c % COLS) + 1); b.style.setProperty('--r', Math.floor(c / COLS) + 1); // on a phone the grid turns (CSS)
          b.onclick = () => {
            if (+b.dataset.n !== next) { lives--; grid.classList.add('miss'); b.classList.add('wrong'); return later(() => lives ? round() : finish(n - 1), 700); }
            b.classList.add('done'); b.disabled = true; next++;
            if (!hidden) { hidden = true; grid.classList.add('hide'); }
            if (next > n) { n = Math.min(n + 1, COLS * ROWS); later(round, 450); }
          };
          grid.append(b);
        });
        stage().className = 'gm-stage wide'; stage().replaceChildren(grid);
        onKey(e => { if (e.key === 'Escape') close(); });
      };
      round();
    },

    // ---------- Visual memory ----------
    visual() {
      clear();
      let level = 1, lives = 3;
      const sizeOf = l => l <= 2 ? 3 : l <= 5 ? 4 : l <= 9 ? 5 : l <= 14 ? 6 : 7;
      const round = () => {
        const size = sizeOf(level), count = level + 2;
        live(`Nivel ${level} · ${'♥'.repeat(lives)}`);
        const lit = new Set(); while (lit.size < count) lit.add(rnd(size * size));
        const grid = document.createElement('div'); grid.className = 'gm-vis show'; grid.style.setProperty('--size', size);
        let found = 0, misses = 0, ready = false;
        for (let i = 0; i < size * size; i++) {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'gm-sq' + (lit.has(i) ? ' lit' : ''); b.setAttribute('aria-label', 'Cuadro ' + (i + 1));
          b.onclick = () => {
            if (!ready || b.classList.contains('ok') || b.classList.contains('no')) return;
            if (lit.has(i)) { b.classList.add('ok'); if (++found === count) { ready = false; level++; later(round, 600); } }
            else { b.classList.add('no'); if (++misses === 3) { ready = false; lives--; grid.classList.add('miss'); later(() => lives ? round() : finish(level - 1), 800); } }
          };
          grid.append(b);
        }
        stage().className = 'gm-stage'; stage().replaceChildren(grid);
        onKey(e => { if (e.key === 'Escape') close(); });
        later(() => { grid.classList.remove('show'); ready = true; }, 900 + count * 120);
      };
      round();
    },
  };

  const setCta = (id, label, fn) => { CTA[id] = { label, fn }; };
  const setOnFinish = fn => { onFinish = fn; };
  // The battles this browser knows, with their latest state from the server (and the account's, when signed in)
  async function battles() {
    const mine = known(), ids = [...new Set(mine.map(r => r.id))];
    let remote = [];
    try { remote = (await api('GET', null, ids.length ? '?ids=' + ids.join(',') : '')).battles || []; } catch {}
    return { mine, remote };
  }
  const loadBattle = id => api('GET', null, '?ids=' + encodeURIComponent(id)).then(r => r.battles?.[0] || null);
  return { open, close, setCta, setOnFinish, dare, battles, loadBattle, known, GAMES, bests, history };
})();
