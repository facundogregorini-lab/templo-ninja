(() => {
const $ = id => document.getElementById(id);

/* ---------- Keyboard layouts (physical ISO keyboard, Spanish) ---------- */
const LAYOUTS = (() => {
  const K = (code, b, s, f, w = 1, fn = false) => ({ code, b, s, f, w, fn });
  const letters = (str, fingers) => [...str].map((c, i) => K('Key' + c.toUpperCase(), c, c.toUpperCase(), fingers[i]));
  const top = letters('qwertyuiop', ['lp','lr','lm','li','li','ri','ri','rm','rr','rp']);
  const home = letters('asdfghjkl', ['lp','lr','lm','li','li','ri','ri','rm','rr']);
  const bottom = letters('zxcvbnm', ['lp','lr','lm','li','li','ri','ri']);
  const digits = shifts => [...'1234567890'].map((d, i) => K('Digit' + d, d, shifts[i], ['lp','lr','lm','li','li','ri','ri','rm','rr','rp'][i]));
  const rows = (r0, dShift, r1, r2) => [
    [K('Backquote', r0[0], r0[1], 'lp'), ...digits(dShift), K('Minus', "'", '?', 'rp'), K('Equal', r0[2], r0[3], 'rp'), K('Backspace', 'Borrar', '', 'rp', 2, true)],
    [K('Tab', 'Tab', '', 'lp', 1.5, true), ...top, K('BracketLeft', r1[0], r1[1], 'rp'), K('BracketRight', '+', '*', 'rp'), K('Enter', 'Enter', '', 'rp', 1.5, true)],
    [K('CapsLock', 'Mayús', '', 'lp', 1.75, true), ...home, K('Semicolon', 'ñ', 'Ñ', 'rp'), K('Quote', r2[0], r2[1], 'rp'), K('Backslash', r2[2], r2[3], 'rp'), K('Gap', '', '', 'rp', 1.25, true)],
    [K('ShiftLeft', 'Shift', '', 'lp', 1.25, true), K('IntlBackslash', '<', '>', 'lp'), ...bottom, K('Comma', ',', ';', 'rm'), K('Period', '.', ':', 'rr'), K('Slash', '-', '_', 'rp'), K('ShiftRight', 'Shift', '', 'rp', 2.75, true)],
    [K('Gap', '', '', 'th', 4, true), K('Space', 'Espacio', '', 'th', 7, true), K('Gap', '', '', 'th', 4, true)],
  ];
  return {
    la: { accent: 'BracketLeft', rows: rows(['|', '°', '¿', '¡'], '!"#$%&/()=', ['´', '¨'], ['{', '[', '}', ']']) },
    es: { accent: 'Quote', rows: rows(['º', 'ª', '¡', '¿'], '!"·$%&/()=', ['`', '^'], ['´', '¨', 'ç', 'Ç']) },
  };
})();
const FNAME = { lp: 'Meñique izquierdo', lr: 'Anular izquierdo', lm: 'Medio izquierdo', li: 'Índice izquierdo', th: 'Pulgar', ri: 'Índice derecho', rm: 'Medio derecho', rr: 'Anular derecho', rp: 'Meñique derecho' };
const fcol = f => 'var(--f-' + (f === 'th' ? 't' : f[1]) + ')';

/* ---------- Content ---------- */
const WORDS = `sala salas falda faldas hada hadas gala galas dada dadas falla fallas halla hallas salsa salsas alas las la da ha gasa gasas daga dagas alga algas saga sagas haga hagas faja fajas ala asa llaga llagas saña
sed seda sedas sede sedes silla sillas idea ideas ideal jefe jefes hija hijas fiel fieles dale dile deja dejas deje leal leales lee leer desea deseas sella esa esas ese el de del se si le les es ella ellas fila filas falsa falsas fija fijas dije
rueda ruedas sur dura duras reir usar usa suele lugar lugares fresa fresas frase frases jugar aire aires rara raras risa risas ruda sufre sufrir duele surge guerra guerras sierra sierras fuera dar ir ser leer reja rejas larga largas regla reglas grasa grasas real reales rural fuga fugas juega juegas agua aguas sigue sigues raja
tarde tardes tierra tierras ya yate yates yeso tela telas tus tu te ti tres taller talleres fruta frutas tarea tareas ayer estufa detalle detalles gata gatas hasta junta juntas yegua yeguas este esta estas estar haya hay ayuda ayudar tras trae traer tia tias tira tiras alta altas arte artes sastre fiesta fiestas tuya tuyas suya suyas raya rayas leyes ley reyes rey
wifi kiwi kiwis todo todos otro otros solo sola hola ola olas lado lados rosa rosas oro hoy fuego lejos algo ojo ojos oso osos loro loros foto fotos dos hilo hijo hijos dedo dedos lodo gato gatos rato ratos otra otras toro toros radio tortuga tortugas hoja hojas orilla sueldo tiro
que queso quesos papel papeles paso pasos parque parques poquito equipo equipos aquel aquella aquello pera peras pelota pelotas papa papas pato patos pie pies piso pisos porque para pero poder puerta puertas tapa tapas sopa sopas ropa playa playas pila pilas pared paredes pesado pista pistas pulpo quiero quieres quita quitar raqueta etiqueta espejo espejos pasta pastas piloto tipo tipos sapo sapos lupa
mano manos mesa me mi mis no en un una uno unos unas nada nadie mundo mundos momento mismo misma mientras menos madre mente miel mapa mapas monte montes nieto nieta nudo nudos nota notas tema temas tomate tomates mate mates manta mantas menta tiempo tiene tienen hermano hermana semana semanas mañana montaña montañas niño niña niños señor señora año años sueño sueños manera mirar mira tenemos entre entrada antes ahora gente gran grande grandes tanto nosotros ellos pequeño pequeños
vaso vasos vida vidas verde verdes beber volver barco barcos bote botes bien bueno buena buenos buenas ver va van vamos viento vientos viaje viajes nube nubes libro libros lobo lobos abuelo abuela tabla tablas saber haber sabe sabemos nuevo nueva nueve vino vinos uva uvas lluvia llave llaves ventana ventanas invierno verano abril vuelta vueltas valle valles bolsa bolsas bravo breve bajo baja arriba abajo trabajo trabajos trabajar baño
casa casas cosa cosas cama camas coche coches cielo cielos cena cenas cinco cerca cuatro cuando como con comer comida cocina calle calles campo campos cara caras carta cartas clase clases color colores costa costas cuento cuentos hacer hace dice decir noche nunca poco pocos rico rica blanco blanca oficina cebolla ciudad cada cual acuerdo marca mucho mucha muchos ocho escuela cuerpo corto corta
texto textos examen taxi taxis sexto extra extras mixto boxeo exacto exacta explica explicar flexible experto expertos excusa exceso anexo extremo
luz paz vez zapato zapatos zorro zorros azul azules arroz tiza plaza plazas raza razas cabeza cabezas mezcla zona zonas manzana manzanas cerveza fuerza fuerzas feliz juez voz veces lazo pozo pedazo trozo almuerzo empezar izquierda nariz taza tazas
palabra palabras teclado dedos letra letras pantalla escribir escribe lento lenta ritmo tecla teclas punto coma espacio respira mirada tranquilo tranquila`.split(/\s+/).filter(w => /^[a-zñ]+$/.test(w));
const ACCENT_WORDS = 'más está también café día qué sí así aquí había papá mamá árbol música número rápido fácil difícil lápiz útil avión canción corazón jardín camión ratón limón león jamás además después según país maíz baúl sofá menú bebé página teléfono sábado miércoles océano pájaro brújula último línea práctica éxito máquina'.split(' ');
const NAMES = 'Julia Pedro Lola Juan Marta Diego Clara Hugo Elena Pablo Rosa Mendoza Salta Rosario Tandil Bariloche Ushuaia Lima Quito Madrid'.split(' ');
const REFRANES = [
  'Ojos que no ven, corazón que no siente.', 'La práctica hace al maestro.', 'Poco a poco se anda lejos.',
  'Más vale tarde que nunca.', 'Querer es poder.', 'El que busca, encuentra.', 'Al que madruga, Dios lo ayuda.',
  'No por mucho madrugar amanece más temprano.', 'En casa de herrero, cuchillo de palo.',
  'Camarón que se duerme se lo lleva la corriente.', 'Más vale pájaro en mano que cien volando.',
  'Dime con quién andas y te diré quién eres.', 'A caballo regalado no se le miran los dientes.',
];
const TEXTS = [
  'El viento llega desde el mar y mueve las cortinas de la sala. Afuera, las olas rompen contra la costa y las gaviotas dan vueltas sobre la playa. Es un buen día para trabajar con la ventana abierta.',
  'Antes de la reunión, Julia revisa la agenda, responde dos correos y ordena las notas de la semana. Escribe rápido y sin mirar el teclado, porque sus dedos ya saben dónde está cada letra.',
  'Apoyá los índices sobre la F y la J. Cada dedo vuelve siempre a su tecla de la fila guía. Mirá la pantalla, respirá tranquilo y dejá que la velocidad llegue sola con la práctica.',
  'Para la salsa, picá una cebolla, un diente de ajo y medio morrón. Cociná todo a fuego bajo con un chorrito de aceite y sumá los tomates cuando la cebolla esté transparente.',
  'El tren sale temprano de la estación. Llevamos mate, un libro y una campera por si refresca a la noche. En el camino se ven campos verdes, vacas y molinos que giran despacio.',
];
const METHODS = [
  { id: 'mirando', name: 'Mirando el teclado', short: 'Mirando', as: 'mirando el teclado', desc: 'Como escribías antes: buscás cada letra con la vista.', c: 'var(--s-1)' },
  { id: 'hibrido', name: 'Híbrido', short: 'Híbrido', as: 'en modo híbrido', desc: 'Algunos dedos en su lugar y a veces mirás.', c: 'var(--s-2)' },
  { id: 'ciegas', name: 'A ciegas', short: 'A ciegas', as: 'a ciegas', desc: 'Dedos en la fila guía y la vista en la pantalla.', c: 'var(--s-3)' },
];
const GROUPS = [
  { name: 'Fila guía', desc: 'La base de todo: cada dedo descansa sobre su tecla.', goal: 12, tip: 'Los índices descansan en F y J: tienen un relieve para encontrarlas sin mirar.' },
  { name: 'Fila superior', desc: 'Estirá el dedo hacia arriba y volvé a la fila guía.', goal: 15, tip: 'Después de cada tecla de arriba, el dedo vuelve a su lugar en la fila guía.' },
  { name: 'Fila inferior', desc: 'Doblá el dedo hacia abajo sin mover la mano.', goal: 18, tip: 'Para la fila de abajo, doblá el dedo: la mano no se mueve.' },
  { name: 'Mayúsculas y tildes', desc: 'Shift con la otra mano y la tilde antes de la vocal.', goal: 20, tip: 'Shift se aprieta con el meñique de la mano contraria a la letra.' },
  { name: 'Textos', desc: 'Frases reales para ganar ritmo.', goal: 25, tip: 'Mejor lento y parejo que rápido y con errores.' },
];
const LESSONS = [
  ['fj', 0, 'keys', 'fj'], ['dk', 0, 'keys', 'dk'], ['sl', 0, 'keys', 'sl'], ['añ', 0, 'keys', 'añ'], ['gh', 0, 'keys', 'gh'], ['rep1', 0, 'review', '', 'Repaso de la fila guía'],
  ['ei', 1, 'keys', 'ei'], ['ru', 1, 'keys', 'ru'], ['ty', 1, 'keys', 'ty'], ['wo', 1, 'keys', 'wo'], ['qp', 1, 'keys', 'qp'], ['rep2', 1, 'review', '', 'Repaso con la fila superior'],
  ['nm', 2, 'keys', 'nm'], ['vb', 2, 'keys', 'vb'], ['c,', 2, 'keys', 'c,'], ['x.', 2, 'keys', 'x.'], ['z', 2, 'keys', 'z'], ['rep3', 2, 'review', '', 'Repaso de todo el teclado'],
  ['may', 3, 'shift', '', 'Mayúsculas'], ['til', 3, 'accents', '', 'Tildes'],
  ['ref', 4, 'text', 'r', 'Refranes'], ['cos', 4, 'text', '0', 'La costa'], ['ofi', 4, 'text', '1', 'La oficina'], ['tec', 4, 'text', '2', 'La técnica'], ['coc', 4, 'text', '3', 'En la cocina'], ['via', 4, 'text', '4', 'De viaje'],
].map(([id, g, type, keys, name], i) => ({ id, g, type, keys, name: name || [...keys].map(k => k.toUpperCase()).join(' · '), n: i + 1 }));
// After the base course, the belts (belts.js): 5 × 8 lessons with their own texts and speed goals.
const BELTS = window.Belts?.list || [], BELT_LESSONS = window.Belts?.lessons || [];
const passed = l => S.lessons[l.id]?.stars >= 1;
function beltState(bi) { const ls = BELTS[bi].lessons, done = ls.filter(passed).length; return { done, total: ls.length, complete: done === ls.length, gold: ls.every(l => S.lessons[l.id]?.stars === 3) }; }
const currentBelt = () => { const i = BELTS.findIndex((_, bi) => !beltState(bi).complete); return i < 0 ? BELTS.length - 1 : i; };
const lessonPlace = l => l.belt != null ? `${BELTS[l.belt].name} · lección ${l.n} de ${BELTS[l.belt].lessons.length}` : `Lección ${l.n}`;
// /nueva shows the typing course in seven belts, like Ninja mental: the 26 lessons of the base course in the first
// four, the five belts of belts.js joined two by two after them, and black last. The same lessons, ids and progress:
// only how they are grouped and named changes. index.html keeps the course and its five belts.
const TN_BELTS = window.tnLayout && BELTS.length === 5 ? [
  { id: 'blanco', name: 'Cinturón blanco', theme: GROUPS[0].name, desc: GROUPS[0].desc, lessons: LESSONS.filter(l => l.g === 0) },
  { id: 'amarillo', name: 'Cinturón amarillo', theme: GROUPS[1].name, desc: GROUPS[1].desc, lessons: LESSONS.filter(l => l.g === 1) },
  { id: 'naranja', name: 'Cinturón naranja', theme: GROUPS[2].name, desc: GROUPS[2].desc, lessons: LESSONS.filter(l => l.g === 2) },
  { id: 'verde', name: 'Cinturón verde', theme: 'Mayúsculas, tildes y textos', desc: 'Shift con la otra mano, la tilde antes de la vocal y frases reales para ganar ritmo.', lessons: LESSONS.filter(l => l.g >= 3) },
  { id: 'azul', name: 'Cinturón azul', theme: 'Puntuación y números', desc: 'Comas, preguntas, comillas, precios, fechas, horas y teléfonos.', lessons: [...BELTS[0].lessons, ...BELTS[1].lessons] },
  { id: 'marron', name: 'Cinturón marrón', theme: 'Palabras frecuentes y textos de trabajo', desc: 'Las palabras que más se usan en español, mails, pedidos, datos de clientes y planillas.', lessons: [...BELTS[2].lessons, ...BELTS[3].lessons] },
  { id: 'negro', name: 'Cinturón negro', theme: BELTS[4].theme, desc: BELTS[4].desc, lessons: BELTS[4].lessons },
] : null;
const tnBeltOf = l => TN_BELTS ? TN_BELTS.findIndex(b => b.lessons.includes(l)) : -1;
const tnNum = l => [...LESSONS, ...BELT_LESSONS].indexOf(l) + 1; // its number in the whole path: 1 to 66
const lessonGoal = l => l.goal || GROUPS[l.g]?.goal;
function tnBeltState(bi) { const ls = TN_BELTS[bi].lessons, done = ls.filter(passed).length; return { done, total: ls.length, complete: done === ls.length, gold: ls.every(l => S.lessons[l.id]?.stars === 3) }; }
const tnBeltArt = bi => `<span class="nv-difficulty-belt belt-${TN_BELTS[bi].id}" aria-hidden="true"></span>`;

/* ---------- Storage ---------- */
const STORE = 'teclado-ciego-v1';
const S = { lessons: {}, test: null, tests: [], layout: 'la', kb: 'always', tildes: 'strict', cog: {}, sims: [], ninja: { best: null, runs: [] } };
try { Object.assign(S, JSON.parse(localStorage.getItem(STORE)) || {}); } catch {}
if (!Array.isArray(S.tests)) S.tests = [];
if (!S.cog || typeof S.cog !== 'object') S.cog = {};
if (!Array.isArray(S.sims)) S.sims = [];
if (!S.ninja || !Array.isArray(S.ninja.runs)) S.ninja = { best: null, runs: [] };
if (S.ninja.best && !S.ninja.best.id) S.ninja.best = null; // marks from before the server graded the challenge
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch {} };

/* ---------- Helpers ---------- */
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const isLetter = c => /[a-zñ]/.test(c);
function allowedFor(idx) {
  const set = new Set();
  for (let i = 0; i <= idx; i++) if (LESSONS[i].type === 'keys') for (const k of LESSONS[i].keys) set.add(k);
  return set;
}
function group(pool, letters) {
  const len = 3 + Math.floor(Math.random() * 3), chars = [rnd(pool)];
  while (chars.length < len) chars.push(rnd(Math.random() < .5 ? pool : letters));
  return shuffle(chars).join('');
}
function pickWords(allowed, nk, n) {
  const pool = WORDS.filter(w => [...w].every(c => allowed.has(c)));
  if (pool.length < 6) return null;
  const weighted = pool.flatMap(w => nk.some(k => w.includes(k)) ? [w, w, w] : [w]);
  const out = [];
  while (out.length < n) { const w = rnd(weighted); if (w !== out[out.length - 1]) out.push(w); }
  return out;
}
function sprinkle(tokens, mark, every) {
  return tokens.map((t, i) => (i % every === every - 1 && i < tokens.length - 1 && isLetter(t.slice(-1))) ? t + mark : t);
}
function genLesson(l) {
  if (l.type === 'belt') return l.gen();
  const idx = LESSONS.indexOf(l);
  if (l.type === 'text') return l.keys === 'r' ? shuffle(REFRANES).slice(0, 5).join(' ') : TEXTS[+l.keys];
  if (l.type === 'accents') return ['á é í ó ú', 'á é í ó ú', ...shuffle(ACCENT_WORDS).slice(0, 14)].join(' ');
  const all = allowedFor(LESSONS.length - 1);
  if (l.type === 'shift') {
    const caps = pickWords(all, [], 9).map(w => w[0].toUpperCase() + w.slice(1));
    return shuffle([...caps, ...shuffle(NAMES).slice(0, 7), ...pickWords(all, [], 4)]).join(' ');
  }
  const allowed = allowedFor(idx), letters = [...allowed].filter(isLetter);
  if (l.type === 'review') return (pickWords(allowed, [], 22) || Array.from({ length: 16 }, () => group(letters, letters))).join(' ');
  const nk = [...l.keys].filter(isLetter), punct = [...l.keys].filter(c => !isLetter(c));
  let parts = [];
  for (const k of nk) parts.push(k.repeat(3), k.repeat(3));
  if (nk.length === 2) { const [a, b] = nk; parts.push(a + b + a, b + a + b, a + a + b, b + b + a); }
  for (const p of punct) parts.push(p, p, p);
  const pool = nk.length ? nk : letters;
  for (let i = 0; i < 7; i++) parts.push(group(pool, letters));
  const words = pickWords(allowed, nk, 12);
  if (words) parts.push(...words); else for (let i = 0; i < 6; i++) parts.push(group(pool, letters));
  for (const p of punct) parts = sprinkle(parts, p, 3);
  return parts.join(' ');
}

/* ---------- Each group is a level with its own typist (drawings in typists.js) ---------- */
// Fila guía = chimpancé, fila superior = bebé, fila inferior = niño, mayúsculas y tildes = ninja del mate, textos = intelectual.
// Passing all 26 lessons makes you a premio Nobel; all of them with 3 stars, an alien.
const cap1 = str => str[0].toUpperCase() + str.slice(1);
const GROUP_SKY = ['linear-gradient(#fde6c8,#c4e6e7)', 'linear-gradient(#e3efe1,#bcd8c3)', 'linear-gradient(#d5e7f6,#eef4f8)', 'linear-gradient(#f4e6f0,#d3e5f3)', 'linear-gradient(#ffd8a8,#f4b3a8 55%,#c7b6e4)', 'linear-gradient(#1d2140,#4b3f8a 60%,#c7b6e4)'];
const NOBEL = 5, ALIEN = 6, FINAL = GROUPS.length; // the final level is shown after the last group
function evoState(gi) {
  const ls = gi === FINAL ? LESSONS : LESSONS.filter(l => l.g === gi), done = ls.filter(l => S.lessons[l.id]?.stars >= 1).length;
  const gold = ls.every(l => S.lessons[l.id]?.stars === 3);
  return { done, total: ls.length, complete: done === ls.length, gold, tier: gi === FINAL ? (gold ? ALIEN : NOBEL) : gi };
}
function evoText(gi, st) {
  if (gi === FINAL) return st.gold ? '¡Alien! Las 26 lecciones con 3 estrellas.'
    : st.complete ? '¡Premio Nobel! Aprobaste las 26 lecciones. Con 3 estrellas en todas, alien.'
    : `Aprobá las 26 lecciones para ser premio Nobel (llevás ${st.done}). Con 3 estrellas en todas, alien.`;
  if (st.complete) return st.gold ? '¡Nivel superado con 3 estrellas en todas!' : `¡Nivel superado! Sigue: nivel ${tierShort(gi + 1 === FINAL ? NOBEL : gi + 1)}.`;
  return st.done ? `${st.done} de ${st.total} lecciones para superarlo.` : `Aprobá las ${st.total} lecciones para superarlo.`;
}
function evoArt(gi, st, fresh = false) {
  const cls = ((gi === FINAL ? st.complete : st.done) ? '' : ' locked') + (st.complete ? ' done' : '') + (st.gold ? ' gold' : '') + (fresh ? ' fresh' : '');
  return `<div class="evo-art${cls}" style="background:${GROUP_SKY[Math.min(gi, GROUP_SKY.length - 1)]}">${Typists.typist(st.tier)}</div>`;
}
function evoCard(gi) {
  const st = evoState(gi);
  const steps = gi === FINAL ? '' : `<span class="evo-steps">${Array.from({ length: st.total }, (_, i) => `<i class="${i < st.done ? 'on' : ''}"></i>`).join('')}</span>`;
  return `<figure class="evo-card" data-tier="${st.tier}" data-done="${st.done}">${evoArt(gi, st)}<figcaption><b>Nivel ${tierShort(st.tier)}</b><span>${evoText(gi, st)}</span>${steps}</figcaption></figure>`;
}

/* ---------- Speed tiers: who types like you, from a chimpanzee to an alien, compared with the median ---------- */
const MEDIAN = 40; // words per minute of a typical adult typist (5 characters per word)
const TIERS = [
  { min: 0, name: 'un chimpancé', jokes: [
    'Promedio de velocidad: estás en la media de un chimpancé. Y el chimpancé estaba pelando una banana con la otra mano.',
    'A este ritmo, un mensaje de WhatsApp te lleva una temporada entera de tu serie favorita.',
    'Tus dedos todavía están buscando el teclado. Dales tiempo, son nuevos.'] },
  { min: 10, name: 'un bebé', jokes: [
    'Nivel bebé: golpeás el teclado con mucho entusiasmo y de vez en cuando sale una palabra.',
    'Ya le ganaste al chimpancé. El próximo paso es soltar el chupete.',
    'Gugu tata. Traducción: “seguí practicando”.'] },
  { min: 20, name: 'un niño', jokes: [
    'Escribís como en primer grado: con ganas y sacando la lengua.',
    'Nivel niño: rapidísimo para los emojis, lento para todo lo demás.',
    'Ya podés chatear sin que te dejen en visto por aburrimiento.'] },
  { min: 35, name: 'un ninja del mate', jokes: [
    'Justo en la mediana: tipeás bien, pero todavía a monedas.',
    'Máquina de escribir, caja de cartón y cero apuro. Estilo propio, eso sí.',
    'Escribís como una persona normal. Felicitaciones por la normalidad.'] },
  { min: 50, name: 'un intelectual', jokes: [
    'Más rápido que la mayoría. Ya podés tomar apuntes y después entender lo que anotaste.',
    'Anteojos redondos, café y buen ritmo. Solo te falta la boina.',
    'Escribís más rápido de lo que la gente lee tus mails largos.'] },
  { min: 70, name: 'un premio Nobel', jokes: [
    'Nivel premio Nobel: tus dedos merecen un discurso de agradecimiento.',
    'Escribís tan rápido que el corrector ortográfico pidió vacaciones.',
    'Tu teclado pidió un aumento de sueldo.'] },
  { min: 90, name: 'un alien', jokes: [
    'Nivel alien: los chimpancés hacen fila para pedirte clases.',
    '¿Sos una persona o una inteligencia extraterrestre disfrazada?',
    'Cuatro brazos y cero errores. Alguien llame a la NASA.'] },
];
const tierShort = i => TIERS[i].name.replace(/^un /, '');
// Difficulty labels are independent from the playful speed/IQ comparison tiers.
const COG_BELTS = ['blanco', 'amarillo', 'naranja', 'verde', 'azul', 'negro', 'negro'];
const cogLevel = i => window.tnLayout ? `cinturón ${COG_BELTS[i]}` : `nivel ${tierShort(i)}`;
const cogBeltArt = i => `<span class="nv-difficulty-belt belt-${COG_BELTS[i]}" aria-hidden="true"></span>`;
const tierFor = ppm => { let i = 0; while (i < TIERS.length - 1 && ppm >= TIERS[i + 1].min) i++; return i; };
// Share of people who type slower, assuming speeds spread normally around the median (standard deviation 16).
function percentile(ppm) {
  const z = (ppm - MEDIAN) / 16, x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + .3275911 * x);
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-x * x);
  return Math.min(99, Math.max(1, Math.round(50 * (1 + Math.sign(z) * erf))));
}
function speedScale(ppm) {
  const pos = v => Math.min(92, Math.max(6, v / 120 * 100));
  return `<div class="speed-scale" aria-hidden="true"><div class="track"></div><span class="mk med" style="left:${pos(MEDIAN)}%">mediana ${MEDIAN}</span><span class="mk you" style="left:${pos(ppm)}%">vos ${ppm}</span></div>`;
}
function medianText(ppm) {
  const d = ppm - MEDIAN;
  return d === 0 ? `Justo en la mediana: ${MEDIAN} palabras por minuto.`
    : `${Math.abs(d)} palabras por minuto ${d < 0 ? 'por debajo' : 'por encima'} de la mediana (${MEDIAN}). Más rápido que el ${percentile(ppm)}% de la gente, más o menos.`;
}
let liveTier = -1;
function updateLive(ppm, started) {
  const ti = tierFor(ppm);
  if (ti !== liveTier) { liveTier = ti; $('liveArt').innerHTML = Typists.typist(ti); if (started) $('liveArt').firstChild.classList.add('pop'); }
  $('liveLead').textContent = started ? `Con ${ppm} palabras por minuto escribís como` : idx ? 'Midiendo tu ritmo…' : 'Arrancá a escribir: ¿chimpancé o alien?';
  $('liveTier').textContent = cap1(TIERS[ti].name);
  $('liveScale').innerHTML = speedScale(ppm);
}

/* ---------- Keyboard rendering ---------- */
let LAY = LAYOUTS[S.layout] || LAYOUTS.la, MAP = {};
function buildMap() {
  MAP = { ' ': { code: 'Space', f: 'th', shift: false } };
  for (const row of LAY.rows) for (const k of row) {
    if (k.fn) continue;
    if (!(k.b in MAP)) MAP[k.b] = { code: k.code, f: k.f, shift: false };
    if (k.s && !(k.s in MAP)) MAP[k.s] = { code: k.code, f: k.f, shift: true };
  }
}
function renderKb(el) {
  el.replaceChildren();
  for (const row of LAY.rows) {
    const r = document.createElement('div'); r.className = 'row';
    for (const k of row) {
      const d = document.createElement('div');
      d.className = 'key' + (k.fn ? ' fn' : '') + (k.code === 'Gap' ? ' ghost' : '') + (k.code === 'KeyF' || k.code === 'KeyJ' ? ' bump' : '');
      d.style.flexGrow = k.w; d.dataset.code = k.code; d.style.setProperty('--fc', fcol(k.f));
      if (k.fn) d.textContent = k.b;
      else if (isLetter(k.b)) d.textContent = k.b.toUpperCase();
      else { const i = document.createElement('i'); i.textContent = k.s; d.append(i, k.b); }
      r.append(d);
    }
    el.append(r);
  }
}
function applyLayout() {
  LAY = LAYOUTS[S.layout] || LAYOUTS.la; buildMap();
  renderKb($('mapKb')); renderKb($('kb'));
  if (mode === 'typing') highlight();
}

/* ---------- Home ---------- */
function stars(n, cls = 'stars') { return `<span class="${cls}" aria-label="${n} de 3 estrellas">${[0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`; }
function nextLesson() { return LESSONS.find(l => !passed(l)) || BELT_LESSONS.find(l => !passed(l)) || BELT_LESSONS[BELT_LESSONS.length - 1] || LESSONS[LESSONS.length - 1]; }
function renderHome() {
  const nl = nextLesson();
  $('continue').innerHTML = `${Object.keys(S.lessons).length ? 'Seguir' : 'Empezar'}: ${nl.belt != null ? BELTS[nl.belt].name.toLowerCase() : 'lección ' + nl.n} <small>${nl.name}</small>`;
  const total = LESSONS.reduce((s, l) => s + (S.lessons[l.id]?.stars || 0), 0);
  $('hStars').textContent = `${total}/${LESSONS.length * 3}`;
  $('hDone').textContent = `${LESSONS.filter(l => S.lessons[l.id]?.stars >= 1).length}/${LESSONS.length}`;
  const bestTest = Math.max(0, S.test?.ppm || 0, ...S.tests.map(t => t.ppm));
  $('hBest').textContent = bestTest || '—';
  $('scLessons').textContent = `${LESSONS.filter(l => S.lessons[l.id]?.stars >= 1).length}/${LESSONS.length}`;
  $('scPpm').textContent = bestTest || '—';
  renderEvo();
  if (TN_BELTS) $('path').replaceChildren(...tnBeltSections(nl));
  else $('path').replaceChildren(...GROUPS.map((g, gi) => {
    const sec = document.createElement('section'); sec.className = 'group';
    sec.innerHTML = `<div class="group-head"><div><h2>${g.name}</h2><p>${g.desc} Meta para 3 estrellas: ${g.goal} palabras por minuto con 95% de precisión.</p></div>${evoCard(gi)}</div>`;
    const cards = document.createElement('div'); cards.className = 'cards';
    for (const l of LESSONS.filter(l => l.g === gi)) {
      const rec = S.lessons[l.id], b = document.createElement('button');
      b.className = 'lc' + (l === nl ? ' next' : '');
      const caps = l.type === 'keys'
        ? [...l.keys].map(k => `<kbd style="--fc:${fcol(MAP[k]?.f || 'th')}">${k.toUpperCase()}</kbd>`).join('')
        : `<span class="name">${l.name}</span>`;
      b.innerHTML = `<span class="meta"><span>Lección ${l.n}</span>${l === nl ? '<span class="pill">Sigue</span>' : stars(rec?.stars || 0)}</span><span class="caps">${caps}</span><span class="best">${rec ? `Mejor: ${rec.ppm} ppm · ${rec.acc}%` : l.type === 'keys' ? 'Teclas nuevas' : 'Sin intentos'}</span>`;
      b.onclick = () => start(l);
      cards.append(b);
    }
    sec.append(cards);
    return sec;
  }), Object.assign(document.createElement('section'), { className: 'group final', innerHTML: `<div class="group-head"><div><h2>La cima</h2><p>Después de los textos, el último salto de la evolución.</p></div>${evoCard(FINAL)}</div>` }), ...beltSections(nl));
  renderCog();
  window.tnLayout?.home?.();
}

// /nueva: the seven belts, each with its lessons and how many are passed (the one in progress opens; nueva.js folds the rest).
function tnBeltSections(nl) {
  return TN_BELTS.map((B, bi) => {
    const st = tnBeltState(bi), goals = B.lessons.map(lessonGoal), lo = Math.min(...goals), hi = Math.max(...goals);
    const sec = document.createElement('section'); sec.className = 'group tn-belt'; sec.dataset.belt = B.id;
    const steps = `<span class="evo-steps">${B.lessons.map(l => `<i class="${passed(l) ? 'on' : ''}"></i>`).join('')}</span>`;
    sec.innerHTML = `<div class="group-head"><div><h2><span class="nv-level-label">${tnBeltArt(bi)} ${B.name}</span>${B.theme}</h2><p>${B.desc} ${B.lessons.length} lecciones · meta para 3 estrellas: ${lo === hi ? lo : `de ${lo} a ${hi}`} palabras por minuto con 95% de precisión.</p></div>`
      + `<figure class="nv-cog-belt nv-tk-belt">${tnBeltArt(bi)}<figcaption><b>${B.name}</b><span>${st.complete ? (st.gold ? '¡Conseguido, con 3 estrellas!' : '¡Conseguido!') : `${st.done} de ${st.total} lecciones de este cinturón.`}</span>${steps}</figcaption></figure></div>`;
    const cards = document.createElement('div'); cards.className = 'cards';
    for (const l of B.lessons) {
      const rec = S.lessons[l.id], b = document.createElement('button');
      b.className = 'lc' + (l === nl ? ' next' : '');
      const caps = l.type === 'keys' ? [...l.keys].map(k => `<kbd style="--fc:${fcol(MAP[k]?.f || 'th')}">${k.toUpperCase()}</kbd>`).join('') : `<span class="name">${l.name}</span>`;
      b.innerHTML = `<span class="meta"><span>Lección ${tnNum(l)}</span>${l === nl ? '<span class="pill">Sigue</span>' : stars(rec?.stars || 0)}</span><span class="caps">${caps}</span><span class="best">${rec ? `Mejor: ${rec.ppm} ppm · ${rec.acc}%` : l.type === 'keys' ? 'Teclas nuevas' : l.goal ? `Meta: ${l.goal} ppm` : 'Sin intentos'}</span>`;
      b.onclick = () => start(l);
      cards.append(b);
    }
    sec.append(cards);
    return sec;
  });
}

// The belts, after the base course: one section each (current, done or still ahead), with its lessons.
const beltSteps = bi => `<span class="evo-steps">${BELTS[bi].lessons.map(l => `<i class="${passed(l) ? 'on' : ''}"></i>`).join('')}</span>`;
function beltSections(nl) {
  const graduated = LESSONS.every(passed), cb = graduated ? currentBelt() : -1;
  // Before the 26 lessons are done, the course is the goal: the belts are one line, opened only on purpose.
  const teaser = Object.assign(document.createElement('section'), { className: 'group belts-teaser' + (graduated ? ' graduated' : '') });
  teaser.innerHTML = graduated ? '' : `<p>Después del curso podés seguir perfeccionando tu velocidad con cinco cinturones: puntuación, números, palabras frecuentes, textos de trabajo y velocidad.</p><button class="linkbtn" type="button">Ver los cinturones</button>`;
  teaser.querySelector('button')?.addEventListener('click', e => { const shown = $('path').classList.toggle('show-belts'); e.target.textContent = shown ? 'Ocultar los cinturones' : 'Ver los cinturones'; tn.capture('belts_preview', { shown }); });
  return [teaser, ...BELTS.map((B, bi) => {
    const st = beltState(bi), sec = document.createElement('section');
    sec.className = 'group belt ' + (st.complete ? 'done' : bi === cb ? 'current' : 'ahead') + (graduated ? '' : ' preview'); sec.dataset.belt = B.id;
    sec.innerHTML = `<div class="group-head"><div><h2><span class="belt-badge" style="--bc:${B.color}" aria-hidden="true"></span>${B.name} · ${B.theme}</h2><p>${B.desc} Meta para 3 estrellas: ${B.goal} palabras por minuto con 95% de precisión${bi === BELTS.length - 1 ? ', cada vez más alta' : ''}.</p></div><figure class="belt-card"><figcaption><b>${st.complete ? (st.gold ? '¡Conseguido, con 3 estrellas!' : '¡Conseguido!') : `${st.done} de ${st.total} lecciones`}</b><span>${st.complete ? 'Cinturón completo.' : `Aprobá las ${st.total} para conseguirlo.`}</span>${beltSteps(bi)}</figcaption></figure></div>`;
    const cards = document.createElement('div'); cards.className = 'cards';
    for (const l of B.lessons) {
      const rec = S.lessons[l.id], b = document.createElement('button');
      b.className = 'lc' + (l === nl ? ' next' : '');
      b.innerHTML = `<span class="meta"><span>Lección ${l.n}</span>${l === nl ? '<span class="pill">Sigue</span>' : stars(rec?.stars || 0)}</span><span class="caps"><span class="name">${l.name}</span></span><span class="best">${rec ? `Mejor: ${rec.ppm} ppm · ${rec.acc}%` : `Meta: ${l.goal} ppm`}</span>`;
      b.onclick = () => start(l);
      cards.append(b);
    }
    sec.append(cards);
    return sec;
  })];
}

/* ---------- Speed by method: cards, chart and table ---------- */
let evoView = 'chart';
function renderEvo() {
  $('methods').replaceChildren(...METHODS.map(m => {
    const ts = S.tests.filter(t => t.method === m.id), last = ts[ts.length - 1];
    const best = ts.length ? Math.max(...ts.map(t => t.ppm)) : null;
    const delta = ts.length > 1 ? last.ppm - ts[0].ppm : null;
    const card = document.createElement('div'); card.className = 'mc'; card.style.setProperty('--sc', m.c);
    card.innerHTML = `<h3><i></i><span></span></h3><p></p><dl><dt>última</dt><dd>${last ? last.ppm : '—'}</dd><dt>mejor</dt><dd>${best ?? '—'}</dd><dt>desde la primera</dt><dd>${delta == null ? '—' : (delta > 0 ? '+' : delta < 0 ? '−' : '±') + Math.abs(delta)}</dd></dl><button class="btn">Medir ${m.as}</button>`;
    card.querySelector('span').textContent = m.name;
    card.querySelector('p').textContent = ts.length ? `${ts.length} ${ts.length === 1 ? 'medición' : 'mediciones'} · palabras por minuto` : m.desc;
    card.querySelector('.btn').onclick = () => start('test', m.id);
    return card;
  }));
  const avg = id => { const ts = S.tests.filter(t => t.method === id).slice(-3); return ts.length ? ts.reduce((s, t) => s + t.ppm, 0) / ts.length : null; };
  const look = avg('mirando'), blind = avg('ciegas'), ins = $('insight');
  ins.hidden = !(look && blind);
  if (look && blind) ins.textContent = blind >= look
    ? `A ciegas ya escribís más rápido que mirando el teclado: ${Math.round(blind)} contra ${Math.round(look)} palabras por minuto (promedio de las últimas 3).`
    : `A ciegas ya llegás al ${Math.round(100 * blind / look)}% de tu velocidad mirando el teclado: ${Math.round(blind)} de ${Math.round(look)} palabras por minuto (promedio de las últimas 3).`;
  $('legend2').replaceChildren(...METHODS.map(m => { const s = document.createElement('span'); s.style.setProperty('--sc', m.c); s.append(document.createElement('i'), m.name); return s; }));
  document.querySelectorAll('#evoView button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === evoView)));
  $('chart').hidden = evoView !== 'chart'; $('evoTable').hidden = evoView !== 'table';
  if (evoView === 'chart') drawChart(); else renderEvoTable();
}
const dayFmt = (t, withTime) => new Date(t).toLocaleString('es-AR', withTime ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short' });
function drawChart() {
  const svg = $('chartSvg'), NS = 'http://www.w3.org/2000/svg';
  const W = Math.round(svg.clientWidth) || 600, H = 260, narrow = W < 520;
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.append(e); return e; };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.replaceChildren(); $('tt').hidden = true;
  const data = S.tests, M = { l: 34, r: narrow ? 12 : 92, t: 14, b: 26 };
  const niceStep = v => { const raw = Math.max(v, 10) / 4, pow = 10 ** Math.floor(Math.log10(raw)), n = raw / pow; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow; };
  const maxY = data.length ? Math.max(...data.map(d => d.ppm)) : 40, step = niceStep(maxY), yMax = Math.max(step, Math.ceil(maxY * 1.1 / step) * step);
  const Y = v => H - M.b - (v / yMax) * (H - M.t - M.b);
  for (let v = 0; v <= yMax; v += step) {
    el('line', { x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v), class: 'grid' });
    el('text', { x: M.l - 6, y: Y(v) + 4, 'text-anchor': 'end', class: 'ax' }).textContent = v;
  }
  if (!data.length) {
    el('text', { x: (M.l + W - M.r) / 2, y: H / 2, 'text-anchor': 'middle', class: 'emptytxt' }).textContent = 'Tus mediciones van a aparecer acá.';
    svg.onpointermove = null; return;
  }
  let x0 = Math.min(...data.map(d => d.date)), x1 = Math.max(...data.map(d => d.date));
  if (x1 - x0 < 864e5) { const mid = (x0 + x1) / 2; x0 = mid - 432e5; x1 = mid + 432e5; }
  const X = t => M.l + 6 + (t - x0) / (x1 - x0) * (W - M.l - M.r - 12);
  const short = x1 - x0 < 3 * 864e5, nt = short || narrow ? 2 : 4;
  for (let i = 0; i < nt; i++) {
    const t = x0 + (x1 - x0) * i / (nt - 1);
    el('text', { x: X(t), y: H - 6, 'text-anchor': i === 0 ? 'start' : i === nt - 1 ? 'end' : 'middle', class: 'ax' }).textContent = dayFmt(t, short);
  }
  const pts = [], labels = [];
  for (const m of METHODS) {
    const ts = data.filter(d => d.method === m.id);
    if (!ts.length) continue;
    if (ts.length > 1) el('path', { d: ts.map((d, i) => (i ? 'L' : 'M') + X(d.date).toFixed(1) + ' ' + Y(d.ppm).toFixed(1)).join(' '), class: 'ln', style: `stroke:${m.c}` });
    for (const d of ts) { el('circle', { cx: X(d.date), cy: Y(d.ppm), r: 4, class: 'dot', style: `fill:${m.c}` }); pts.push({ d, m, x: X(d.date), y: Y(d.ppm) }); }
    const last = ts[ts.length - 1];
    labels.push({ y: Y(last.ppm), text: `${m.short} ${last.ppm}` });
  }
  labels.sort((a, b) => a.y - b.y);
  if (!narrow && labels.every((l, i) => !i || l.y - labels[i - 1].y >= 15))
    for (const l of labels) el('text', { x: W - M.r + 10, y: l.y + 4, class: 'lbl' }).textContent = l.text;
  const ring = el('circle', { r: 7, fill: 'none', 'stroke-width': 2, style: 'stroke:var(--ink)', visibility: 'hidden' });
  const tt = $('tt');
  svg.onpointermove = e => {
    const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width, py = (e.clientY - r.top) * H / r.height;
    let best = null, bd = Infinity;
    for (const p of pts) { const dd = (p.x - px) ** 2 + ((p.y - py) / 2) ** 2; if (dd < bd) { bd = dd; best = p; } }
    if (!best || bd > 50 * 50) { tt.hidden = true; ring.setAttribute('visibility', 'hidden'); return; }
    ring.setAttribute('cx', best.x); ring.setAttribute('cy', best.y); ring.setAttribute('visibility', 'visible');
    tt.replaceChildren();
    const b = document.createElement('b'); b.textContent = best.d.ppm + ' palabras/min';
    const key = document.createElement('i'); key.style.setProperty('--sc', best.m.c);
    tt.append(b, document.createElement('br'), key, best.m.name, document.createElement('br'), `${best.d.acc}% de precisión · ${dayFmt(best.d.date, true)}`);
    tt.hidden = false;
    const c = $('chart').getBoundingClientRect(), sx = r.left - c.left + best.x * r.width / W, sy = r.top - c.top + best.y * r.height / H;
    const w = tt.offsetWidth, left = sx + 14 + w > c.width ? sx - 14 - w : sx + 14;
    tt.style.left = Math.max(4, left) + 'px'; tt.style.top = Math.max(4, sy - tt.offsetHeight - 8) + 'px';
  };
  svg.onpointerleave = () => { tt.hidden = true; ring.setAttribute('visibility', 'hidden'); };
}
function renderEvoTable() {
  const box = $('evoTable');
  if (!S.tests.length) { box.innerHTML = '<p class="empty">Todavía no hay mediciones. Elegí un método y medí tu velocidad.</p>'; return; }
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Fecha</th><th>Método</th><th class="n">Palabras/min</th><th class="n">Precisión</th></tr></thead>';
  const tb = document.createElement('tbody');
  for (const t of [...S.tests].reverse()) {
    const tr = document.createElement('tr');
    [dayFmt(t.date, true), METHODS.find(m => m.id === t.method)?.name || t.method, t.ppm, t.acc + '%'].forEach((v, i) => { const td = document.createElement('td'); td.textContent = v; if (i > 1) td.className = 'n'; tr.append(td); });
    tb.append(tr);
  }
  table.append(tb); box.replaceChildren(table);
}
document.querySelectorAll('#evoView button').forEach(b => b.onclick = () => { evoView = b.dataset.v; renderEvo(); });
let resizeRaf = 0;
addEventListener('resize', () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(() => { if (!$('home').hidden && evoView === 'chart') drawChart(); }); });

/* ---------- Lesson engine ---------- */
let mode = 'home', cur = null, text = '', spans = [], idx = 0, errors = 0, errBy = {}, missed = new Set();
let deadPending = false, hintOn = false, running = false, accMs = 0, t0 = 0, timer = null, doneAt = 0;
const TEST_MS = 60000;
const NINJA_HASH = /^#(ninja|entrevistas)$/; // #entrevistas: the section's first name
const elapsed = () => accMs + (running ? performance.now() - t0 : 0);
const fmt = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

function show(view) {
  document.body.dataset.view = view;
  for (const v of ['home', 'lesson', 'quiz']) $(v).hidden = view !== v;
  scrollTo({ top: 0 });
}
let testMethod = 'ciegas', testSeed = '';
const SHARED_TEXTS = [...TEXTS, ...REFRANES]; // v1: keep this corpus stable for shared links
function start(l, method, seed) {
  if (!mayStart()) return;
  window.tnLayout?.start?.(l);
  cur = l; mode = 'typing'; counted = false;
  if (l === 'test' && method) testMethod = method;
  const tm = METHODS.find(m => m.id === testMethod);
  if (l === 'test') testSeed = /^[a-zA-Z0-9-]{1,48}$/.test(seed || '') ? seed : 'v1-' + Date.now().toString(36);
  text = l === 'test' ? Dojo.seededText(testSeed, SHARED_TEXTS) : l.practiceText || genLesson(l);
  idx = 0; errors = 0; errBy = {}; missed = new Set(); deadPending = false; hintOn = false; holdIdx = -1; pendingMark = ''; $('accentHelp').hidden = true;
  running = false; accMs = 0; clearInterval(timer); timer = setInterval(tick, 200);
  const g = l === 'test' ? null : l.belt != null ? BELTS[l.belt] : GROUPS[l.g];
  const tb = l === 'test' ? -1 : tnBeltOf(l);
  $('lGroup').textContent = l === 'test' ? 'Medición de velocidad · 1 minuto' : tb >= 0 ? `Lección ${tnNum(l)} · ${TN_BELTS[tb].name}` : l.belt != null ? lessonPlace(l) : `Lección ${l.n} · ${g.name}`;
  $('lName').textContent = l === 'test' ? tm.name : l.name;
  $('tip').textContent = l === 'test' ? `${tm.desc} Escribí todo lo que puedas en 60 segundos.` : g.tip;
  $('sTimeLbl').textContent = l === 'test' ? 'restante' : 'tiempo';
  const inner = $('inner'); inner.replaceChildren(); spans = [];
  let word = null;
  for (const ch of text) {
    const s = document.createElement('span'); s.className = 'c'; s.textContent = ch; spans.push(s);
    if (ch === ' ') { word = null; inner.append(s); }
    else { if (!word) { word = document.createElement('span'); word.className = 'w'; inner.append(word); } word.append(s); }
  }
  inner.style.transform = '';
  $('typing').hidden = false; $('result').hidden = true; $('startHint').hidden = false;
  liveTier = -1;
  show('lesson'); applyKbMode(); markCurrent(); tick();
  $('cap').value = ''; captured = 0;
  focusCap();
}
function markCurrent() {
  spans.forEach(s => s.classList.remove('cur'));
  const s = spans[idx];
  if (s) {
    s.classList.add('cur');
    const lh = parseFloat(getComputedStyle($('inner')).lineHeight) || 40;
    $('inner').style.transform = `translateY(${-Math.max(0, s.offsetTop - lh)}px)`;
  }
  $('bar').style.width = (100 * idx / text.length) + '%';
  highlight();
}
function stepsFor(ch) {
  if (!ch) return [];
  const a = 'áéíóú'.indexOf(ch);
  if (a >= 0) return deadPending ? stepsFor('aeiou'[a]) : [{ code: LAY.accent, f: 'rp', accent: true }];
  const m = MAP[ch];
  if (!m) return [];
  if (m.shift) { const left = m.f[0] === 'l'; return [{ code: left ? 'ShiftRight' : 'ShiftLeft', f: left ? 'rp' : 'lp', shift: true }, { code: m.code, f: m.f }]; }
  return [{ code: m.code, f: m.f }];
}
function highlight() {
  const kb = $('kb');
  kb.querySelectorAll('.next').forEach(k => k.classList.remove('next'));
  document.querySelectorAll('.fg.on').forEach(f => f.classList.remove('on'));
  const ch = text[idx], steps = stepsFor(ch);
  const visible = cur !== 'test' && (S.kb === 'always' || (S.kb === 'error' && hintOn));
  if (!visible || mode !== 'typing') { $('flabel').textContent = mode === 'typing' && cur !== 'test' && S.kb === 'error' ? 'Mirá la pantalla, no el teclado.' : ''; return; }
  for (const st of steps) {
    kb.querySelector(`[data-code="${st.code}"]`)?.classList.add('next');
    document.querySelectorAll(`.fg[data-f="${st.f}"]`).forEach(f => f.classList.add('on'));
  }
  const keyName = c => c === ' ' ? 'espacio' : c.toUpperCase();
  let label = '';
  if (steps[0]?.accent) label = `${FNAME.rp}: tilde (´), después la vocal` + (IS_MAC ? ' · Mac en inglés: Option + E' : '');
  else if (steps.length === 2) label = `${FNAME[steps[0].f]} en Shift + ${FNAME[steps[1].f].toLowerCase()} en ${keyName(ch.toLowerCase())}`;
  else if (steps.length) label = `${FNAME[steps[0].f]} · ${keyName(ch.normalize('NFD').replace(/[̀-ͯ]/g, ''))}`;
  $('flabel').textContent = label;
}
function flash(code, wrong) {
  if (!code) return;
  const k = $('kb').querySelector(`[data-code="${code}"]`);
  if (!k) return;
  k.classList.add('press'); if (wrong) k.classList.add('wrong');
  setTimeout(() => k.classList.remove('press', 'wrong'), 160);
}
function tick() {
  const ms = elapsed();
  if (cur === 'test' && ms >= TEST_MS) { finish(); return; }
  $('sTime').textContent = cur === 'test' ? fmt(TEST_MS - ms) : fmt(ms);
  const ppm = ms > 1500 ? Math.round(idx / 5 / (ms / 60000)) : 0;
  $('sPpm').textContent = ppm;
  if (cur === 'test') updateLive(ms > 3000 ? ppm : 0, ms > 3000); // the first seconds are too noisy
  $('sAcc').textContent = (idx + errors ? Math.round(100 * idx / (idx + errors)) : 100) + '%';
}
function miss(target) {
  errors++;
  errBy[target] = (errBy[target] || 0) + 1;
  missed.add(idx);
  spans[idx].classList.add('bad');
  if (S.kb === 'error') { hintOn = true; highlight(); }
}
// One typed character, from any keyboard (physical or on screen).
function typeChar(ch) {
  if (mode !== 'typing') return;
  if (!running) { running = true; t0 = performance.now(); $('startHint').hidden = true; if (!counted) countPractice(); }
  if (pendingMark) { ch = composeMark(pendingMark, ch) || ch; pendingMark = ''; }
  const target = text[idx];
  deadPending = false;
  if (holdIdx === idx) {
    // The plain vowel typed before is forgiven only if the accented one comes right after (Mac accent menu).
    holdIdx = -1; spans[idx].classList.remove('hold');
    if (ch !== target) miss(target);
  } else if (ch !== target && ACCENTED.includes(target) && ch === target.normalize('NFD')[0]) {
    if (S.tildes === 'loose') ch = target; // accents are optional: the plain vowel counts
    else { holdIdx = idx; spans[idx].classList.add('hold'); showAccentHelp(); tick(); return; }
  }
  const code = MAP[ch.normalize('NFD')[0]]?.code;
  if (ch === target) {
    const s = spans[idx];
    s.classList.remove('bad');
    s.classList.add(missed.has(idx) ? 'fix' : 'ok');
    flash(code);
    idx++; hintOn = false;
    if (idx >= text.length) { finish(); return; }
    markCurrent();
  } else { miss(target); flash(code, true); highlight(); }
  tick();
}
// The hidden field receives what the person types. Accents typed with a dead key (´ then a) usually arrive as
// one composed character, but browsers differ: Safari on a Mac may end the composition with the mark (´) alone
// in the field and send the accented vowel after, and some keyboards send "´" and "a" as two characters.
// So a mark at the end of the field waits there for its vowel, and a mark followed by a vowel is joined with it.
const DEAD_MARKS = '´`¨^~', COMBINING = { '´': '́', '`': '̀', '¨': '̈', '^': '̂', '~': '̃' };
const ACCENTED = 'áéíóúÁÉÍÓÚüÜ';
function composeMark(mark, ch) {
  const c = (ch + COMBINING[mark]).normalize('NFC');
  return c.length === 1 && c !== ch ? c : null;
}
let captured = 0, holdIdx = -1, pendingMark = '';
function takeInput(composing) {
  const cap = $('cap'), rest = [...cap.value.slice(Math.min(captured, cap.value.length))];
  if (cap.value.length < captured) captured = cap.value.length;
  let waiting = false;
  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (DEAD_MARKS.includes(ch) && text[idx] !== ch) {
      if (i === rest.length - 1) { waiting = true; break; }
      const joined = composeMark(ch, rest[i + 1]);
      captured += ch.length;
      if (joined) { captured += rest[i + 1].length; i++; typeChar(joined); }
      continue; // a mark on its own (dead key + space) is not a letter of the text
    }
    captured += ch.length;
    if (ch === '\n' || ch === '\r') continue;
    typeChar(ch);
  }
  if (!composing && !waiting) { cap.value = ''; captured = 0; }
}
// A dead key pressed while the hidden field is not focused: the browser cannot compose it, so we do.
// Spanish keyboards: ´ (Shift for ¨). Mac keyboards in English: Option+E ´, Option+U ¨, Option+N ~, Option+I ^, Option+` `.
function deadMark(e) {
  if (e.altKey) return { KeyE: '´', KeyU: '¨', KeyN: '~', KeyI: '^', Backquote: '`' }[e.code] || '´';
  if (S.layout === 'es' && e.code === 'BracketLeft') return e.shiftKey ? '^' : '`';
  return e.shiftKey ? '¨' : '´';
}
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
function showAccentHelp() {
  if (!$('accentHelp').hidden) return;
  $('accentHelpText').textContent = IS_MAC
    ? '¿No te sale la tilde? En la Mac apretá la tecla ´ (al lado de la Ñ) y después la vocal. Si tu teclado está en inglés: Option + E y después la vocal.'
    : '¿No te sale la tilde? Apretá la tecla ´ (al lado de la Ñ o de la P) y después la vocal. Si no aparece, revisá que el teclado de la computadora esté en Español.';
  $('accentHelp').hidden = false;
}
$('accentLoose').onclick = () => { S.tildes = 'loose'; save(); pushProgress(); applyAccentMode(); if (holdIdx === idx) typeChar(text[idx]); focusCap(); };
function focusCap() { if (mode === 'typing') { $('cap').focus({ preventScroll: true }); checkFocus(); } }
function finish() {
  if (mode !== 'typing') return;
  const ms = Math.min(elapsed(), cur === 'test' ? TEST_MS : Infinity);
  running = false; accMs = ms; clearInterval(timer); mode = 'done'; doneAt = performance.now();
  tick();
  const ppm = ms > 0 ? Math.round(idx / 5 / (ms / 60000)) : 0;
  const acc = idx + errors ? Math.round(100 * idx / (idx + errors)) : 100;
  const isTest = cur === 'test', belt = !isTest && cur.belt != null, goal = isTest ? 0 : cur.goal || GROUPS[cur.g].goal;
  let st = 0, better = false;
  const tm = METHODS.find(m => m.id === testMethod);
  let prevSame = null;
  const evoBefore = isTest || belt ? null : evoState(cur.g), finalBefore = isTest || belt ? null : evoState(FINAL), beltBefore = belt ? beltState(cur.belt) : null, prevStars = isTest ? 0 : S.lessons[cur.id]?.stars || 0;
  const tb = isTest ? -1 : tnBeltOf(cur), tnBefore = tb >= 0 ? tnBeltState(tb) : null;
  if (isTest) {
    prevSame = [...S.tests].reverse().find(t => t.method === testMethod) || null;
    S.tests.push({ method: testMethod, ppm, acc, seed: testSeed, accents: S.tildes, date: Date.now() });
    if (S.tests.length > 300) S.tests.splice(0, S.tests.length - 300);
    if (!S.test || ppm > S.test.ppm) { S.test = { ppm, acc }; better = true; }
  }
  else if (!cur.review) {
    st = acc < 90 ? 0 : acc < 95 ? 1 : ppm >= goal ? 3 : 2;
    const prev = S.lessons[cur.id];
    if (!prev || st > prev.stars || (st === prev.stars && ppm > prev.ppm)) { S.lessons[cur.id] = { stars: st, ppm, acc }; better = !!prev; }
  }
  save();
  window.tnLayout?.typed?.({ id: isTest ? 'test' : cur.id, ppm, acc, method: isTest ? testMethod : null, accents: S.tildes });
  tn.capture('practice_completed', { ...practiceInfo(false), wpm: ppm, accuracy: acc, stars: isTest ? null : st ?? null, duration_ms: Math.round(ms) });
  recordSession({ lesson: isTest ? 'test' : cur.id, name: isTest ? `Medición ${tm.as}` : tb >= 0 ? `${TN_BELTS[tb].name} · ${cur.name}` : belt ? `${BELTS[cur.belt].name} · ${cur.name}` : `Lección ${cur.n} · ${cur.name}`, method: isTest ? testMethod : undefined, stars: st, ppm, acc, ms })
    .then(saved => saved && loadRanking()).then(() => { if (isTest && auth.name) rankLine(ppm); });
  const weak = Object.entries(errBy).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const keyTxt = c => c === ' ' ? 'espacio' : c;
  let msg;
  if (isTest) {
    const d = prevSame ? ppm - prevSame.ppm : 0;
    msg = (prevSame
      ? (d > 0 ? `${d} palabras por minuto más que tu medición anterior ${tm.as}.` : d < 0 ? `${-d} palabras por minuto menos que tu medición anterior ${tm.as}.` : `Igual que tu medición anterior ${tm.as}.`)
      : `Primera medición ${tm.as}. Repetila en unos días para ver cómo evoluciona.`)
      + (acc < 90 ? ' Hubo muchos errores: la precisión viene primero.' : '');
  }
  else if (cur.control) msg = `Control listo: ${ppm} palabras por minuto con ${acc}% de precisión. Lo ves resumido en Teclado, junto con tu progreso.`;
  else if (cur.review) msg = 'Repaso completo. Esta ronda refuerza tus teclas sin cambiar las estrellas de las lecciones. Buscá 95% de precisión antes de acelerar.';
  else if (st === 0) msg = 'La precisión quedó debajo del 90%. Repetila más despacio, sin mirar el teclado: la velocidad llega sola.';
  else if (st < 3 && acc < 95) msg = 'Aprobada. Con 95% de precisión o más ganás la segunda estrella.';
  else if (st < 3) msg = `Muy preciso. Llegá a ${goal} palabras por minuto para la tercera estrella.`;
  else msg = 'Excelente: precisa y a buen ritmo.';
  const list = belt ? BELT_LESSONS : LESSONS, idxL = isTest ? -1 : list.indexOf(cur), next = !isTest && !cur.review && st > 0 ? list[idxL + 1] || (belt ? null : BELT_LESSONS[0]) || null : null;
  let extra = '';
  if (isTest) {
    const ti = tierFor(ppm);
    extra = `<div class="house-result">${Typists.typist(ti)}<div class="house-copy">
      <span class="eyebrow">Con ${ppm} palabras por minuto escribís como</span><h4>${cap1(TIERS[ti].name)}</h4>
      <p class="joke">${rnd(TIERS[ti].jokes)}</p>
      <p>${medianText(ppm)}${acc < 90 ? ' Y ojo: con tantos errores, parecés un chimpancé con guantes.' : ''}</p>
      ${speedScale(ppm)}${challengeResult(ppm)}<p id="rankLine">${auth.name ? '' : 'Entrá con tu cuenta para aparecer en el ranking de velocidad.'}</p></div></div>`;
  } else if (tb >= 0) { // /nueva: the lesson counts toward its belt of the seven
    const B = TN_BELTS[tb], after = tnBeltState(tb), won = after.complete && !tnBefore.complete, nb = TN_BELTS[tb + 1];
    const title = won ? `¡Conseguiste el ${B.name.toLowerCase()}! 🥋` : `${B.name}: ${after.done} de ${after.total}`;
    const txt = won ? (nb ? `Sigue el ${nb.name.toLowerCase()}: ${nb.theme.toLowerCase()}.` : '¡Completaste todos los cinturones! Sos cinturón negro de Templo Ninja.')
      : cur.review ? `${B.theme}. Aprobá las ${after.total} lecciones para conseguirlo.`
      : !st && prevStars < 1 ? `Aprobala con 90% de precisión para avanzar en el ${B.name.toLowerCase()}.` : `${B.theme}. Aprobá las ${after.total} lecciones para conseguirlo.`;
    if (won) tn.capture('typing_belt_won', { belt: B.id });
    if (!belt && !finalBefore.complete && evoState(FINAL).complete) tn.capture('course_completed', { lessons: LESSONS.length });
    extra = `<div class="result-evo result-belt">${tnBeltArt(tb).replace('nv-difficulty-belt', 'nv-difficulty-belt nv-belt-result')}<div><b>${title}</b><p>${txt}</p><span class="evo-steps">${B.lessons.map(l => `<i class="${passed(l) ? 'on' : ''}"></i>`).join('')}</span></div></div>`;
  } else if (belt) {
    const B = BELTS[cur.belt], after = beltState(cur.belt), won = after.complete && !beltBefore.complete, nb = BELTS[cur.belt + 1];
    const title = won ? `¡Conseguiste el ${B.name.toLowerCase()}! 🥋` : `${B.name}: ${after.done} de ${after.total}`;
    const txt = won ? (nb ? `Sigue el ${nb.name.toLowerCase()}: ${nb.theme.toLowerCase()}.` : '¡Completaste todos los cinturones! Sos cinturón negro de Templo Ninja.')
      : !st && prevStars < 1 ? `Aprobala con 90% de precisión para avanzar en el ${B.name.toLowerCase()}.` : `${B.theme}. Aprobá las ${after.total} lecciones para conseguirlo.`;
    extra = `<div class="result-evo result-belt"><span class="belt-badge${won ? ' fresh' : ''}" style="--bc:${B.color}" aria-hidden="true"></span><div><b>${title}</b><p>${txt}</p>${beltSteps(cur.belt)}</div></div>`;
  } else {
    const after = evoState(cur.g), fin = evoState(FINAL), P = tierShort(cur.g);
    let gi = cur.g, st2 = after, fresh = false, title = `Nivel ${P}`, txt = evoText(cur.g, after);
    if (fin.complete && !finalBefore.complete) {
      gi = FINAL; st2 = fin; fresh = true;
      title = '🎓 ¡Terminaste el curso!'; txt = `Aprobaste las ${LESSONS.length} lecciones: ya sos premio Nobel del teclado. Hacé la medición final para comparar con tu punto de partida y, cuando quieras, seguí con el ${BELTS[0]?.name.toLowerCase() || 'próximo desafío'}.`;
      tn.capture('course_completed', { lessons: LESSONS.length });
    } else if (fin.tier > finalBefore.tier) {
      gi = FINAL; st2 = fin; fresh = true;
      title = fin.gold ? '¡Evolucionaste a alien!' : '¡Evolucionaste a premio Nobel!'; txt = evoText(FINAL, fin);
    } else if (after.complete && !evoBefore.complete) {
      const next = cur.g + 1;
      gi = next; st2 = { ...evoState(next), done: 1 }; fresh = true; // show the next level unlocked
      title = `¡Nivel ${P} superado!`;
      txt = next === FINAL ? 'Terminaste los textos. Aprobá todas las lecciones para llegar a premio Nobel.' : `Evolucionaste: ahora vas por el nivel ${tierShort(next)}.`;
    } else if (after.gold && !evoBefore.gold) { title = `¡Nivel ${P} con 3 estrellas!`; fresh = true; }
    else if (!st && prevStars < 1) txt = `Aprobala con 90% de precisión para avanzar en el nivel ${P}.`;
    extra = `<div class="result-evo">${evoArt(gi, st2, fresh)}<div><b>${title}</b><p>${txt}</p></div></div>`;
  }
  const r = $('result');
  r.innerHTML = `
    <h3>${isTest ? 'Medición ' + tm.as : st ? 'Lección completa' : 'Casi: repetila'}</h3>
    ${isTest ? extra : stars(st, 'bigstars')}
    <div class="nums">
      <div><b>${ppm}</b><span>palabras por minuto</span></div>
      <div><b>${acc}%</b><span>precisión</span></div>
      <div><b>${fmt(ms)}</b><span>tiempo</span></div>
    </div>
    <p>${msg}</p>
    ${isTest ? '' : extra}
    <div class="weak">${weak.length ? 'Teclas para practicar: ' + weak.map(([c, n]) => `<kbd title="${n} errores">${keyTxt(c)}</kbd>`).join('') : 'Sin errores.'}</div>
    <div class="actions">
      ${!isTest && next ? `<button class="btn primary" id="rNext">Siguiente: ${next.name} <small>Enter</small></button>` : ''}
      <button class="btn${isTest || !next ? ' primary' : ''}" id="rAgain">${isTest || st ? 'Superar mi marca' : 'Repetir'}${isTest || !next ? ' <small>Enter</small>' : ''}</button>
      ${isTest ? '<button class="btn" id="rChallenge">Desafiar a un amigo</button>' : ''}
      <button class="btn" id="rHome">${isTest ? 'Ver mi evolución' : 'Lecciones'}</button>
    </div>`;
  $('typing').hidden = true; r.hidden = false; $('liveHouse').hidden = true;
  $('rNext') && ($('rNext').onclick = () => start(next));
  $('rAgain').onclick = () => start(cur, testMethod, testSeed);
  $('rChallenge') && ($('rChallenge').onclick = () => openChallenge({ ppm, acc, method: testMethod, seed: testSeed, accents: S.tildes }));
  coachTyping(ppm, acc, weak);
  $('rHome').onclick = isTest ? () => { goHome(); $('evo').scrollIntoView(); } : goHome;
  highlight(); $('bar').style.width = '100%';
  (($('rNext') || $('rAgain'))).focus({ preventScroll: true });
}
function goHome() { mode = 'home'; running = false; clearInterval(timer); if (NINJA_HASH.test(location.hash)) window.history.replaceState(null, '', location.pathname + location.search); show('home'); renderHome(); }

/* ---------- Input ---------- */
document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]')) return;
  if (mode === 'typing') {
    $('capsWarn').hidden = !e.getModifierState?.('CapsLock');
    if (e.metaKey || (e.ctrlKey && !e.altKey)) return;
    if (e.key === 'Escape') { e.preventDefault(); goHome(); return; }
    if (e.key === 'Dead' && 'áéíóú'.includes(text[idx]) && !deadPending) { deadPending = true; highlight(); }
    if (e.target.closest?.('button, select, a, summary, input:not(#cap)')) return;
    if (e.target !== $('cap') && e.key === 'Dead') { e.preventDefault(); pendingMark = deadMark(e); focusCap(); return; }
    if (e.target !== $('cap') && e.key.length === 1) { e.preventDefault(); focusCap(); typeChar(e.key); }
  } else if (mode === 'quiz') {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, select')) return;
    if (e.key === 'Escape') { e.preventDefault(); leaveQuiz(); return; }
    const k = '12345'.indexOf(e.key) >= 0 ? '12345'.indexOf(e.key) : 'abcde'.indexOf(e.key.toLowerCase());
    if (e.key.length === 1 && k >= 0 && $('qFeedback').hidden) { e.preventDefault(); answerQ(k, e); }
    else if (e.key === 'Enter' && !$('qFeedback').hidden && !e.target.closest?.('button')) { e.preventDefault(); nextQ(); }
  } else if (mode === 'nready' && (e.key === 'Enter' || e.key === ' ') && !e.target.closest?.('button')) { e.preventDefault(); beginNinja(); }
  else if (mode === 'nready' && e.key === 'Escape') goCog();
  else if (mode === 'qdone' && e.key === 'Enter' && performance.now() - doneAt > 500 && !e.target.closest?.('button')) {
    e.preventDefault(); ($('qrNext') || $('qrAgain'))?.click();
  } else if (mode === 'qdone' && e.key === 'Escape') goCog();
  else if (mode === 'done' && e.key === 'Enter' && performance.now() - doneAt > 500) {
    e.preventDefault(); (($('rNext') || $('rAgain'))).click();
  } else if (mode === 'done' && e.key === 'Escape') goHome();
});
function checkFocus() { $('veil').hidden = mode !== 'typing' || (document.hasFocus() && document.activeElement === $('cap')); }
addEventListener('blur', () => { if (running) { accMs = elapsed(); running = false; } checkFocus(); });
addEventListener('focus', checkFocus);
document.addEventListener('visibilitychange', () => { if (document.hidden && running) { accMs = elapsed(); running = false; } });
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => { goHome(); }));
$('veil').onclick = focusCap;
$('stage').addEventListener('click', focusCap);
$('cap').addEventListener('input', e => takeInput(e.isComposing));
$('cap').addEventListener('compositionend', () => takeInput(false));
$('cap').addEventListener('blur', () => setTimeout(checkFocus, 0));
$('cap').addEventListener('focus', checkFocus);

/* ---------- Account: progress and sessions saved on the server ---------- */
const TOKEN = 'teclado-ciego-token';
let auth = { token: null, name: null, display: null }, history = [], toastTimer = 0;
// The name others see (ranking, header, challenges); the username is still the one for logging in.
const shownName = () => auth.display || auth.name;
try { auth.token = localStorage.getItem(TOKEN); } catch {}
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}
async function api(path, payload) {
  let res;
  try {
    res = await fetch('/api/' + path, {
      method: payload ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', ...(auth.token ? { Authorization: 'Bearer ' + auth.token } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch { throw Object.assign(new Error('No se pudo conectar. Revisá tu conexión y probá de nuevo.'), { status: 0 }); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || (res.status === 404 ? 'Las cuentas funcionan en la versión publicada en Vercel.' : 'Algo salió mal. Probá de nuevo.');
    if (res.status === 401 && auth.token && path !== 'auth') signedOut('Tu sesión expiró. Volvé a entrar para guardar tu progreso.');
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return data;
}
const progress = () => ({ lessons: S.lessons, test: S.test, tests: S.tests, layout: S.layout, kb: S.kb, tildes: S.tildes, cog: S.cog, sims: S.sims, ninja: S.ninja });
function better(a, b) { if (!a) return b; if (!b) return a; return b.stars > a.stars || (b.stars === a.stars && b.ppm > a.ppm) ? b : a; }
function merge(remote) {
  if (!remote) return;
  for (const [id, r] of Object.entries(remote.lessons || {})) S.lessons[id] = better(S.lessons[id], r);
  if (remote.test && (!S.test || remote.test.ppm > S.test.ppm)) S.test = remote.test;
  if (Array.isArray(remote.tests)) {
    const key = t => t.date + '|' + t.method, seen = new Set(S.tests.map(key));
    for (const t of remote.tests) if (!seen.has(key(t))) S.tests.push(t);
    S.tests.sort((a, b) => a.date - b.date);
    S.tests = S.tests.slice(-300);
  }
  if (remote.layout) S.layout = remote.layout;
  if (remote.kb) S.kb = remote.kb;
  if (remote.tildes) S.tildes = remote.tildes;
  for (const [id, r] of Object.entries(remote.cog || {})) { const a = S.cog[id]; if (!a || r.stars > a.stars || (r.stars === a.stars && r.pct > a.pct)) S.cog[id] = r; }
  if (Array.isArray(remote.sims)) {
    const seen = new Set(S.sims.map(t => t.date));
    for (const t of remote.sims) if (!seen.has(t.date)) S.sims.push(t);
    S.sims.sort((a, b) => a.date - b.date); S.sims = S.sims.slice(-100);
  }
  if (remote.ninja) { // graded by the server: its best is the one that counts
    if (remote.ninja.best && (!S.ninja.best || remote.ninja.best.score >= S.ninja.best.score)) S.ninja.best = remote.ninja.best;
    const seen = new Set(S.ninja.runs.map(t => t.date));
    for (const t of remote.ninja.runs || []) if (!seen.has(t.date)) S.ninja.runs.push(t);
    S.ninja.runs.sort((a, b) => a.date - b.date); S.ninja.runs = S.ninja.runs.slice(-50);
  }
}
async function loadAccount() {
  const data = await api('data');
  const before = JSON.stringify(data.progress);
  merge(data.progress); save();
  history = data.history;
  if (JSON.stringify(progress()) !== before) await api('data', { type: 'progress', progress: progress() });
  $('layout').value = S.layout; applyLayout(); applyKbMode(); applyAccentMode(); renderHome();
}
let pushTimer = 0;
function pushProgress() {
  if (!auth.name) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => api('data', { type: 'progress', progress: progress() }).catch(() => {}), 800);
}
async function recordSession(entry) {
  logDojo(entry);
  if (!auth.name) return false;
  try {
    const r = await api('data', { type: 'finish', entry, progress: progress() });
    history.unshift(r.entry); history.length = Math.min(history.length, 100);
    return true;
  } catch (err) { toast('No se pudo guardar la sesión en tu cuenta: ' + err.message); return false; }
}
function renderAccountBtn() {
  const b = $('acctBtn');
  b.classList.toggle('out', !auth.name);
  if (auth.name) { b.innerHTML = '<span class="av"></span><span class="nm"></span>'; b.querySelector('.av').textContent = [...shownName()][0]; b.querySelector('.nm').textContent = shownName(); b.setAttribute('aria-label', 'Tu cuenta: ' + shownName()); }
  else { b.textContent = 'Entrar'; b.removeAttribute('aria-label'); }
  $('foot').textContent = auth.name ? `Tu progreso se guarda en la cuenta de ${shownName()}.` : 'Tu progreso se guarda en este navegador. Entrá con tu cuenta para guardarlo en cualquier computadora.';
}
async function signedIn(token, name, display) {
  auth = { token, name, display: display || name };
  tn.identify(name); // the username is the account id (no email is ever asked for)
  try { localStorage.setItem(TOKEN, token); } catch {}
  renderAccountBtn();
  try { await loadAccount(); } catch (err) { toast(err.message); }
  const q = new URLSearchParams(location.search), back = q.get('aporte') || q.get('suscripcion'); // suscripcion: monthly plan, from before
  await loadBilling(Boolean(back)); // asks Mercado Pago again: the payment may have been made elsewhere (another tab, the phone)
  if (back) {
    window.history.replaceState(null, '', location.pathname + location.hash);
    // A successful payment is reported by the server (payment_succeeded), which also sees the ones that only arrive by webhook.
    // The account's plan wins over what the address says: a checkout abandoned here comes back as "error" even when the
    // person paid the same contribution from the phone, and that is not a failed payment.
    if (billing.premium) trackPurchase();
    else if (back !== 'ok') tn.capture('payment_failed', { status: back });
    else tn.capture('payment_pending');
    toast(billing.premium ? '¡Gracias por tu aporte! Los monjes ninja te lo agradecen 🙏 Ya tenés acceso ilimitado ✦'
      : back !== 'ok' ? 'El pago no se completó. Podés intentarlo de nuevo cuando quieras.'
      : 'Estamos esperando la confirmación de Mercado Pago. Puede tardar unos minutos.');
  }
  if (planAfterLogin) { planAfterLogin = false; if (limited()) showPlan('upgrade'); }
}
function signedOut(msg) {
  if (auth.name) tn.reset();
  auth = { token: null, name: null, display: null }; history = [];
  try { localStorage.removeItem(TOKEN); } catch {}
  S.lessons = {}; S.test = null; S.tests = []; S.cog = {}; S.sims = []; S.ninja = { best: null, runs: [] }; save();
  Object.assign(billing, { premium: false, plays: 0, gift: false, lifetime: false, subscription: null, freePerDay: billing.guestPerDay });
  renderAccountBtn(); renderHome(); renderPlanNote(); loadRanking();
  if (msg) toast(msg);
}
let authMode = 'login';
function setAuthMode(m) {
  authMode = m;
  document.querySelectorAll('#authMode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === m)));
  $('authTitle').textContent = m === 'login' ? 'Entrá a tu cuenta' : 'Creá tu cuenta';
  $('authSubmit').textContent = m === 'login' ? 'Entrar' : 'Crear cuenta';
  $('pass').autocomplete = m === 'login' ? 'current-password' : 'new-password';
  $('authLead').textContent = m === 'login'
    ? 'Tus lecciones, estrellas y sesiones de práctica quedan guardadas para seguir desde cualquier computadora.'
    : 'Elegí un usuario y una contraseña. Lo que ya practicaste en este navegador se suma a tu cuenta.';
  $('authErr').textContent = '';
}
function openAuth() { setAuthMode('login'); $('pass').value = ''; $('authDlg').showModal(); $('user').focus(); }
function renderHistory() {
  const total = LESSONS.reduce((s, l) => s + (S.lessons[l.id]?.stars || 0), 0);
  $('acctTitle').textContent = 'Hola, ' + shownName();
  $('aStars').textContent = `${total}/${LESSONS.length * 3}`;
  $('aDone').textContent = `${LESSONS.filter(l => S.lessons[l.id]?.stars >= 1).length}/${LESSONS.length}`;
  $('aBest').textContent = S.test ? S.test.ppm : '—';
  $('aCount').textContent = history.length;
  renderPlan();
  const box = $('hist');
  if (!history.length) { box.innerHTML = '<p class="empty">Todavía no hay sesiones guardadas. Terminá una lección y aparece acá.</p>'; return; }
  const date = d => new Date(d).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const table = document.createElement('table');
  table.innerHTML = '<caption class="sr" style="position:absolute;left:-9999px">Últimas sesiones de práctica</caption><thead><tr><th>Fecha</th><th>Práctica</th><th class="n">ppm</th><th class="n">Precisión</th><th class="n">Tiempo</th><th>Estrellas</th></tr></thead>';
  const tb = document.createElement('tbody');
  for (const h of history.slice(0, 30)) {
    const tr = document.createElement('tr');
    const cells = [date(h.date), h.name, h.ppm, h.acc + '%', fmt(h.ms)];
    cells.forEach((v, i) => { const td = document.createElement('td'); td.textContent = v; if (i > 1) td.className = 'n'; tr.append(td); });
    const td = document.createElement('td'); td.innerHTML = h.lesson === 'test' ? '—' : stars(h.stars); tr.append(td);
    tb.append(tr);
  }
  table.append(tb); box.replaceChildren(table);
}
$('acctBtn').onclick = () => {
  if (mode === 'typing') goHome();
  if (!auth.name) { openAuth(); return; }
  renderHistory(); renderAlias(); $('acctDlg').showModal();
  api('data').then(d => { history = d.history; renderHistory(); }).catch(() => {});
  loadBilling().then(renderPlan);
};
document.querySelectorAll('#authMode button').forEach(b => b.onclick = () => setAuthMode(b.dataset.v));
$('authCancel').onclick = () => { signupFrom = null; $('authDlg').close(); };
$('authForm').onsubmit = async e => {
  e.preventDefault();
  $('authErr').textContent = ''; $('authSubmit').disabled = true;
  try {
    const regId = eventId(); // a new account is a CompleteRegistration from the server too, with this id
    const r = await api('auth', { action: authMode, username: $('user').value, password: $('pass').value, ...(authMode === 'register' ? { track: metaTrack(regId) } : {}) });
    $('authDlg').close();
    await signedIn(r.token, r.user.name, r.user.display);
    loadRanking();
    if (authMode === 'register') track('CompleteRegistration', { content_name: 'Cuenta Templo Ninja' }, regId);
    tn.capture(authMode === 'register' ? 'signed_up' : 'logged_in', { source: signupFrom || 'account' });
    const left = limited() ? Math.max(0, billing.freePerDay - usedToday()) : 0, more = signupFrom && left ? ` Tenés ${left} ${left === 1 ? 'práctica' : 'prácticas'} más hoy: ¡a seguir!` : '';
    toast((authMode === 'register' ? `Cuenta creada. Tu progreso se guarda en ${r.user.name}.` : `Hola, ${shownName()}. Seguimos donde dejaste.`) + more);
    signupFrom = null;
  } catch (err) { $('authErr').textContent = err.message; }
  $('authSubmit').disabled = false;
};
$('acctClose').onclick = () => $('acctDlg').close();
function renderAlias() {
  $('alias').value = auth.display && auth.display !== auth.name ? auth.display : '';
  $('alias').placeholder = auth.name;
  $('aliasErr').textContent = '';
  $('aliasHint').textContent = `Así te ven en el ranking y en los desafíos. Para entrar seguís usando tu usuario, ${auth.name}. Vacío, se muestra tu usuario.`;
}
$('aliasForm').onsubmit = async e => {
  e.preventDefault();
  $('aliasErr').textContent = ''; $('aliasSave').disabled = true;
  try {
    const r = await api('auth', { action: 'display', display: $('alias').value });
    auth.display = r.user.display;
    renderAccountBtn(); renderHistory(); renderAlias(); loadRanking();
    toast(`Listo: en el ranking aparecés como ${shownName()}.`);
  } catch (err) { $('aliasErr').textContent = err.message; }
  $('aliasSave').disabled = false;
};
$('logout').onclick = async () => {
  $('acctDlg').close();
  try { await api('auth', { action: 'logout' }); } catch {}
  signedOut('Cerraste sesión. Tu progreso quedó guardado en tu cuenta.');
};

/* ---------- Ninja mental: interview-style tests in four tracks ---------- */
// Figuras (figures.js), Numérico (numeric.js), Inglés (english.js) and Lógica (logic.js). Same design as the lessons in each track:
// five levels of difficulty with their typist (chimpancé … intelectual), three kinds of exercise per level, a mock test,
// and La cima: premio Nobel with every session passed, alien with 3 stars in all. Every question brings a technique (tip).
const COG_JOKES = {
  fig: ['Resolviste como un chimpancé: con entusiasmo y eligiendo las figuras por el color.', 'Nivel bebé: las figuras te parecen lindas, pero todavía no te dicen nada.', 'Nivel niño: ya encontrás patrones, sobre todo en las nubes.', 'Justo en el medio: a tu razonamiento abstracto le faltan unas monedas de práctica.', 'Nivel intelectual: ya te sale decir "es obvio, la flecha gira 45°".', 'Nivel premio Nobel: el inventor de las matrices estaría orgulloso.', 'Nivel alien: resolvés matrices mientras pensás en otra galaxia.'],
  num: ['Resolviste como un chimpancé: contaste con los dedos y te sobraron dedos.', 'Nivel bebé: los números te gustan, sobre todo para morderlos.', 'Nivel niño: sabés sumar, pero los porcentajes todavía te hacen trampa.', 'Justo en el medio: hacés las cuentas, pero a veces dividís por el número equivocado.', 'Nivel intelectual: ya sabés que subir y bajar un 20% no te deja igual.', 'Nivel premio Nobel: tu contador te pide consejos.', 'Nivel alien: calculás puntos porcentuales desde otra galaxia.'],
  eng: ['Resolviste como un chimpancé: "Cannot say" fue tu mejor amigo.', 'Nivel bebé: ya decís "however", aunque no sabés bien cuándo.', 'Nivel niño: tu inglés es de canción de los Beatles: entendés la mitad y cantás el resto.', 'Justo en el medio: te alcanza para el mail, todavía no para la reunión.', 'Nivel intelectual: ya distinguís "despite" de "although" sin pensar.', 'Nivel premio Nobel: los nativos te piden que les corrijas los mails.', 'Nivel alien: tu inglés suena a subtítulo perfecto.'],
  log: ['Resolviste como un chimpancé: la serie seguía y vos también, pero para otro lado.', 'Nivel bebé: "algunos" y "todos" te parecen lo mismo. Ya no.', 'Nivel niño: las sucesiones fáciles salen; las intercaladas, todavía no.', 'Nivel genio incomprendido: encadenás pistas, pero a veces te inventás una.', 'Nivel intelectual: los silogismos ya no te asustan.', 'Nivel premio Nobel: deducís más rápido de lo que lee el reclutador.', 'Nivel alien: ninguna serie te sorprende. ¿Las inventás vos?'],
};
const TRACKS = {
  fig: {
    id: 'fig', name: 'Figuras abstractas', short: 'Figuras', icon: '🔷', gen: Figures, title: 'Con figuras.',
    blurb: 'Series, matrices y la figura distinta: el razonamiento abstracto (o inductivo) que piden muchas empresas en sus procesos de selección.',
    kinds: [
      { id: 'serie', name: 'Series', ask: '¿Qué figura sigue?', desc: 'Una secuencia cambia paso a paso: descubrí la regla y elegí la figura que sigue.', guide: Figures.TIPS.serie },
      { id: 'matriz', name: 'Matrices', ask: '¿Qué completa la grilla?', desc: 'Filas y columnas siguen reglas: encontralas para completar el casillero vacío.', guide: Figures.TIPS.matriz },
      { id: 'distinta', name: 'La distinta', ask: '¿Cuál no sigue la regla?', desc: 'Cuatro figuras comparten una regla y una no: encontrá a la intrusa.', guide: Figures.TIPS.distinta },
    ],
    levels: [{ name: 'Una regla a la vista', perQ: 75 }, { name: 'Reglas con más pasos', perQ: 65 }, { name: 'Dos reglas a la vez', perQ: 60 }, { name: 'Tres reglas', perQ: 55 }, { name: 'Todo junto y rápido', perQ: 50 }],
    sim: { n: 11, min: 11, ref: 'Como referencia, apuntá a 8 de 11 o más.' },
  },
  num: {
    id: 'num', name: 'Razonamiento numérico', short: 'Numérico', icon: '📊', gen: Numeric, title: 'Con números.',
    blurb: 'Tablas, gráficos y porcentajes: leer datos rápido y elegir la cuenta correcta. En los tests reales casi siempre se permite calculadora: usala también acá.',
    kinds: [
      { id: 'tabla', name: 'Tablas', ask: '¿Qué dicen los datos?', desc: 'Ventas en una tabla: diferencias, promedios, porcentajes, monedas y proyecciones.', guide: ['Leé primero la pregunta y después buscá en la tabla solo la fila y la columna que necesitás.', 'Variación porcentual = (nuevo − viejo) ÷ viejo × 100: siempre se divide por el punto de partida.', 'Escribí las unidades (miles, millones, pesos, dólares): muchas opciones-trampa están corridas por 1.000.'] },
      { id: 'grafico', name: 'Gráficos', ask: '¿Qué muestra el gráfico?', desc: 'Leé un gráfico de barras y calculá variaciones, participaciones y comparaciones.', guide: ['Leé los valores escritos sobre las barras: no estimes por la altura si tenés el número.', 'Crecimiento absoluto no es lo mismo que porcentual: una barra chica puede crecer más en porcentaje.', 'Estimá antes de calcular y descartá las opciones imposibles.'] },
      { id: 'porcentaje', name: 'Porcentajes', ask: '¿Cuánto da?', desc: 'Descuentos, IVA, aumentos seguidos, márgenes y puntos porcentuales: las trampas clásicas.', guide: ['Cambios porcentuales seguidos se multiplican (×1,20 y ×0,80 = ×0,96): nunca se suman ni se cancelan.', 'Para sacar un impuesto o un aumento ya incluido, dividí por el factor (÷ 1,21), no restes el porcentaje.', 'Puntos porcentuales = la resta de dos porcentajes; variación porcentual = esa resta dividida por el inicial.'] },
    ],
    levels: [{ name: 'Leer y calcular', perQ: 90 }, { name: 'Variaciones y promedios', perQ: 90 }, { name: 'Participaciones y razones', perQ: 80 }, { name: 'Unidades y totales', perQ: 75 }, { name: 'Proyecciones y puntos porcentuales', perQ: 70 }],
    sim: { n: 10, min: 15, ref: 'Como referencia, apuntá a 7 de 10 o más.' },
  },
  eng: {
    id: 'eng', name: 'Inglés para el trabajo', short: 'Inglés', icon: '🇬🇧', gen: English, title: 'En inglés.',
    blurb: 'Comprensión de textos (True / False / Cannot say), conectores y orden de oraciones, como en la parte verbal de los tests de selección en inglés.',
    kinds: [
      { id: 'lectura', name: 'Comprensión', ask: 'True, False o Cannot say', desc: 'Textos cortos de trabajo: decidí si cada afirmación es verdadera, falsa o si con el texto no se puede saber.', guide: English.GUIDE.lectura },
      { id: 'conectores', name: 'Conectores', ask: '¿Qué conector va?', desc: 'Uní dos ideas con la palabra justa: however, although, unless, therefore…', guide: English.GUIDE.conectores },
      { id: 'orden', name: 'Ordenar oraciones', ask: '¿En qué orden van?', desc: 'Armá un párrafo coherente siguiendo los pronombres y los conectores.', guide: English.GUIDE.orden },
    ],
    levels: [{ name: 'Básico (A2)', perQ: 75 }, { name: 'Pre-intermedio (B1)', perQ: 70 }, { name: 'Intermedio (B1+)', perQ: 65 }, { name: 'Intermedio alto (B2)', perQ: 60 }, { name: 'Avanzado (C1)', perQ: 55 }],
    sim: { n: 12, min: 12, ref: 'Como referencia, apuntá a 9 de 12 o más.' },
  },
  log: {
    id: 'log', name: 'Lógica y series', short: 'Lógica', icon: '🧩', gen: Logic, title: 'Con lógica.',
    blurb: 'Sucesiones numéricas, ordenar personas a partir de pistas y silogismos: la parte de "lógica" de los tests psicotécnicos que toman muchas empresas.',
    kinds: [
      { id: 'sucesion', name: 'Sucesiones', ask: '¿Qué número sigue?', desc: 'Series de números con una regla: sumas, multiplicaciones, potencias y series intercaladas.', guide: Logic.GUIDE.sucesion },
      { id: 'deduccion', name: 'Deducción', ask: '¿Quién va primero?', desc: 'Pistas sobre quién llegó antes, quién sacó más puntos o quién es mayor: armá el orden y deducí lo que es seguro.', guide: Logic.GUIDE.deduccion },
      { id: 'silogismo', name: 'Silogismos', ask: '¿Verdadero, falso o no se sabe?', desc: 'Dos premisas con palabras inventadas: decidí si la afirmación se deduce, es imposible o no se puede saber.', guide: Logic.GUIDE.silogismo },
    ],
    levels: [{ name: 'Reglas simples', perQ: 70 }, { name: 'Dos pasos', perQ: 65 }, { name: 'Patrones combinados', perQ: 60 }, { name: 'Lo que es seguro', perQ: 55 }, { name: 'Todo junto y rápido', perQ: 50 }],
    sim: { n: 12, min: 12, ref: 'Como referencia, apuntá a 9 de 12 o más.' },
  },
};
// Mock tests shaped like a company's screening test, from what candidates published (see /profesional). They mix
// tracks; the results are kept with the logic track's mock tests, marked with the company.
const COMPANY_SIMS = {
  meli: { id: 'meli', name: 'Simulacro estilo Mercado Libre', n: 40, min: 30, kinds: ['sucesion', 'porcentaje', 'deduccion', 'tabla', 'silogismo', 'serie', 'grafico', 'matriz'],
    ref: 'Según testimonios de candidatos publicados por iProfesional (2021), el test de Mercado Libre tuvo 40 preguntas de lógica y matemática en 30 minutos. Es una práctica con ese formato, no el test oficial.' },
};
const TRACK_KEY = 'teclado-ciego-track';
let cogTrack = 'fig';
try { if (TRACKS[localStorage.getItem(TRACK_KEY)]) cogTrack = localStorage.getItem(TRACK_KEY); } catch {}
const sizeOf = kind => kind === 'orden' ? 5 : 6; // there are 5 ordering paragraphs per level
const passFor = n => Math.ceil(n * .66);
const SESSIONS = Object.fromEntries(Object.values(TRACKS).map(t => [t.id, t.levels.flatMap((lv, gi) => t.kinds.map((k, ki) => ({ id: k.id + (gi + 1), track: t.id, kind: k.id, d: gi + 1, g: gi, n: gi * 3 + ki + 1, name: k.name, size: sizeOf(k.id) })))]));
const kindInfo = id => Object.values(TRACKS).flatMap(t => t.kinds).find(k => k.id === id);
const cogStarsFor = (ok, n) => ok === n ? 3 : ok / n >= .8 ? 2 : ok / n >= .66 ? 1 : 0;
const tierForPct = pct => [0, 20, 35, 50, 65, 80, 95].filter(v => pct >= v).length - 1;
const simsOf = (tr, company) => S.sims.filter(t => (t.track || 'fig') === tr && (t.company || null) === (company || null));
function cogState(gi, tr = cogTrack) {
  const all = SESSIONS[tr], ss = gi === FINAL ? all : all.filter(x => x.g === gi), done = ss.filter(x => S.cog[x.id]?.stars >= 1).length;
  const gold = ss.every(x => S.cog[x.id]?.stars === 3);
  return { done, total: ss.length, complete: done === ss.length, gold, tier: gi === FINAL ? (gold ? ALIEN : NOBEL) : gi };
}
function cogText(gi, st) {
  if (window.tnLayout) {
    if (gi === FINAL) return st.complete ? `¡Cinturón negro! Completaste las ${st.total} sesiones.${st.gold ? ' Con 3 estrellas en todas.' : ''}` : 'Completá los cinco cinturones y probá el simulacro.';
    return st.complete ? `¡Cinturón superado! Sigue: ${cogLevel(gi + 1)}.` : `${st.done} de ${st.total} sesiones de este cinturón.`;
  }
  if (gi === FINAL) return st.gold ? `¡Alien! Las ${st.total} sesiones con 3 estrellas.`
    : st.complete ? `¡Premio Nobel! Aprobaste las ${st.total} sesiones. Con 3 estrellas en todas, alien.`
    : `Aprobá las ${st.total} sesiones para ser premio Nobel (llevás ${st.done}). Con 3 estrellas en todas, alien.`;
  if (st.complete) return st.gold ? '¡Nivel superado con 3 estrellas en todas!' : `¡Nivel superado! Sigue: nivel ${tierShort(gi + 1 === FINAL ? NOBEL : gi + 1)}.`;
  return st.done ? `${st.done} de ${st.total} sesiones para superarlo.` : `Aprobá las ${st.total} sesiones para superarlo.`;
}
function cogCard(gi, tr = cogTrack) {
  const st = cogState(gi, tr);
  const steps = gi === FINAL ? '' : `<span class="evo-steps">${Array.from({ length: st.total }, (_, i) => `<i class="${i < st.done ? 'on' : ''}"></i>`).join('')}</span>`;
  if (window.tnLayout) return `<figure class="evo-card nv-cog-belt">${cogBeltArt(st.tier)}<figcaption><b>${cap1(cogLevel(st.tier))}</b><span>${cogText(gi, st)}</span>${steps}</figcaption></figure>`;
  return `<figure class="evo-card" data-tier="${st.tier}" data-done="${st.done}">${evoArt(gi, st)}<figcaption><b>Nivel ${tierShort(st.tier)}</b><span>${cogText(gi, st)}</span>${steps}</figcaption></figure>`;
}
const nextSession = (tr = cogTrack) => SESSIONS[tr].find(x => !(S.cog[x.id]?.stars >= 1)) || SESSIONS[tr][SESSIONS[tr].length - 1];
const escHtml = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function qFigure(q, cls = 'fig') {
  if (q.text) return q.stimulus || '';
  const blank = '<div class="q-blank">?</div>';
  if (q.kind === 'serie') return `<div class="q-row">${q.seq.map(t => Figures.draw(t, cls)).join('<span class="q-arrow" aria-hidden="true">→</span>')}<span class="q-arrow" aria-hidden="true">→</span>${blank}</div>`;
  if (q.kind === 'matriz') return `<div class="q-grid">${q.grid.map(t => Figures.draw(t, cls)).join('')}${blank}</div>`;
  return '';
}
const optHtml = (q, o) => q.text ? `<span class="opt-txt">${escHtml(o)}</span>` : Figures.draw(o);
/* ---------- Experiment: the "iq" ad goes straight to the 5-minute challenge, with the offer next to the IQ ----------
   Only visitors who came from that ad (utm_content=iq, remembered in this browser) are in it. The PostHog flag
   iq-desafio-directo splits them 50/50: "control" sees Ninja mental as always; "test" gets "Medí tu IQ ninja" as the
   main button and, under the result, the unlimited plan. The IQ itself stays free. Asked after this script runs. */
var IQ_FLAG = 'iq-desafio-directo', iqVariant = null;
function iqTest() { return iqVariant === 'test'; }
queueMicrotask(() => {
  const KEY = 'teclado-ciego-iq-exp';
  let inExp = new URLSearchParams(location.search).get('utm_content') === 'iq';
  try { if (inExp) localStorage.setItem(KEY, '1'); else inExp = localStorage.getItem(KEY) === '1'; } catch {}
  if (inExp) window.tn?.flag?.(IQ_FLAG, v => {
    if (iqVariant) return; // flags can reload: one variant and one activation per page
    iqVariant = v === 'test' ? 'test' : 'control';
    if (iqTest()) renderCog();
    iqActivateOnRealUse();
  });
});
// The experiment counts only people: Instagram/Facebook preload the ad's page and Meta's review robot opens it,
// and both run this script without anyone looking. So the analysis requires iq_exp_activated, sent with the first
// tap, click, swipe or mouse wheel while the page is visible (PostHog: exposure criteria → activation event).
// Not "scroll": the page itself scrolls to Ninja mental on arrival.
function iqActivateOnRealUse() {
  const kinds = ['pointerdown', 'touchstart', 'wheel'];
  const go = () => {
    if (document.visibilityState !== 'visible') return;
    kinds.forEach(k => removeEventListener(k, go, true));
    tn.capture('iq_exp_activated', { variant: iqVariant, ['$feature/' + IQ_FLAG]: iqVariant });
  };
  kinds.forEach(k => addEventListener(k, go, { capture: true, passive: true }));
}
// The offer under the challenge's result (test variant, payments on, not unlimited yet).
function iqOffer() {
  if (!iqTest() || !billing.enabled || billing.premium) return '';
  const price = billing.amount ? '$ ' + Number(billing.amount).toLocaleString('es-AR') : billing.price;
  return `<div class="iq-offer" id="iqOffer"><p><b>Subí tu IQ ninja:</b> práctica ilimitada de figuras, números e inglés. ${escHtml(price)}, pago único, sin suscripción.</p>
    <button class="btn primary" id="iqOfferBtn">Quiero entrenar sin límites</button></div>`;
}
function renderCog() {
  const T = TRACKS[cogTrack], all = SESSIONS[cogTrack], nx = nextSession(), anyDone = all.some(x => S.cog[x.id]);
  document.querySelectorAll('#cogTracks button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === cogTrack)));
  document.querySelectorAll('#cogTracks button small').forEach(el => { const ss = SESSIONS[el.parentElement.dataset.v]; el.textContent = `${ss.filter(x => S.cog[x.id]?.stars >= 1).length}/${ss.length} sesiones`; });
  $('cogTitle').innerHTML = `${T.icon} ${T.name}`;
  $('cogBlurb').textContent = T.blurb;
  $('cogContinue').innerHTML = iqTest() ? 'Medí tu IQ ninja <small>desafío de 5 min</small>'
    : `${anyDone ? 'Seguir' : 'Empezar'}: sesión ${nx.n} <small>${nx.name} · ${cogLevel(nx.g)}</small>`;
  $('simBtn').innerHTML = `Simulacro de entrevista <small>${T.sim.n} preguntas · ${T.sim.min} min</small>`;
  $('cogTrackName').textContent = T.short.toUpperCase();
  $('cStars').textContent = `${all.reduce((a, x) => a + (S.cog[x.id]?.stars || 0), 0)}/${all.length * 3}`;
  $('cDone').textContent = `${all.filter(x => S.cog[x.id]?.stars >= 1).length}/${all.length}`;
  const sims = simsOf(cogTrack), best = sims.reduce((b, t) => Math.max(b, t.pct), -1);
  $('cBest').textContent = best < 0 ? '—' : best + '%';
  const sample = T.gen.make[T.kinds[0].id](1, new Set());
  $('cogSample').className = 'cog-sample' + (sample.text ? ' txt' : '');
  $('cogSample').innerHTML = `<p>${escHtml(sample.prompt)}</p>${qFigure(sample, 'fig')}<div class="q-opts sample${sample.text ? ' txt' : ''}">${sample.options.map((o, i) => `<span class="opt${i === sample.answer ? ' right' : ''}"><b>${'ABCDE'[i]}</b>${optHtml(sample, o)}</span>`).join('')}</div><p class="q-tip">💡 ${escHtml(sample.tip)}</p>`;
  $('cogKinds').innerHTML = T.kinds.map(k => `<article class="kind"><h3>${k.name}</h3><p>${k.desc}</p><h4>Técnicas</h4><ul>${k.guide.slice(0, 3).map(g => `<li>${escHtml(g)}</li>`).join('')}</ul></article>`).join('');
  $('cogPathTitle').textContent = window.tnLayout ? 'Tu entrenamiento · 5 cinturones' : `${T.icon} ${T.name}: de chimpancé a premio Nobel.`;
  $('cogPath').replaceChildren(...T.levels.map((lv, gi) => {
    const sec = document.createElement('section'); sec.className = 'group';
    sec.innerHTML = `<div class="group-head"><div><h2>${window.tnLayout ? `<span class="nv-level-label">${cogBeltArt(gi)} ${cap1(cogLevel(gi))}</span>` : ''}${lv.name}</h2><p>Dificultad ${gi + 1} de 5 · ${lv.perQ} segundos por pregunta. Aprobás con ${passFor(6)} de 6${cogTrack === 'eng' ? ` (${passFor(5)} de 5 en ordenar oraciones)` : ''}; todas bien, 3 estrellas.</p></div>${cogCard(gi)}</div>`;
    const cards = document.createElement('div'); cards.className = 'cards';
    for (const x of all.filter(x => x.g === gi)) {
      const rec = S.cog[x.id], b = document.createElement('button');
      b.className = 'lc' + (x === nx ? ' next' : '');
      b.innerHTML = `<span class="meta"><span>Sesión ${x.n}</span>${x === nx ? '<span class="pill">Sigue</span>' : stars(rec?.stars || 0)}</span><span class="caps"><span class="name">${x.name}</span></span><span class="best">${rec ? `Mejor: ${Math.round(rec.pct * x.size / 100)}/${x.size} · ${fmt(rec.ms)}` : kindInfo(x.kind).ask}</span>`;
      b.onclick = () => startQuiz(x);
      cards.append(b);
    }
    sec.append(cards);
    return sec;
  }), Object.assign(document.createElement('section'), { className: 'group final', innerHTML: `<div class="group-head"><div><h2>La cima</h2><p>El simulacro de entrevista: ${T.sim.n} preguntas mezcladas en ${T.sim.min} minutos, sin ayuda hasta el final. Te dice a quién te parecés y repasa tus errores con sus técnicas.</p></div>${cogCard(FINAL)}</div><div class="cards"><button class="lc" id="simCard"><span class="meta"><span>Simulacro</span></span><span class="caps"><span class="name">Simulacro de entrevista</span></span><span class="best">${best < 0 ? 'Sin intentos' : `Mejor: ${best}% · ${sims.length} ${sims.length === 1 ? 'intento' : 'intentos'}`}</span></button>${cogTrack === 'log' ? Object.values(COMPANY_SIMS).map(companyCard).join('') : ''}</div>` }));
  $('simCard').onclick = () => startQuiz('sim');
  document.querySelectorAll('[data-company]').forEach(b => b.onclick = () => startQuiz({ company: b.dataset.company }));
  const allSessions = Object.values(SESSIONS).flat();
  $('scSessions').textContent = `${allSessions.filter(x => S.cog[x.id]?.stars >= 1).length}/${allSessions.length}`;
  $('scIq').textContent = S.ninja.best ? S.ninja.best.iq : '—';
  renderNinjaMax();
}
function companyCard(co) {
  const sims = simsOf('log', co.id), best = sims.reduce((b, t) => Math.max(b, t.pct), -1);
  return `<button class="lc" data-company="${co.id}"><span class="meta"><span>Por empresa</span></span><span class="caps"><span class="name">${co.name}</span></span><span class="best">${co.n} preguntas · ${co.min} min${best < 0 ? '' : ` · mejor: ${best}%`}</span></button>`;
}
function setTrack(tr) {
  if (!TRACKS[tr]) return;
  cogTrack = tr; try { localStorage.setItem(TRACK_KEY, tr); } catch {}
  renderCog();
}
document.querySelectorAll('#cogTracks button').forEach(b => b.onclick = () => setTrack(b.dataset.v));
// Ninja mental is the second section of the home page: going there is going home and scrolling to it.
function goCog() {
  goHome();
  if (location.hash !== '#ninja') window.history.replaceState(null, '', location.pathname + location.search + '#ninja');
  if (window.tnLayout?.cog) window.tnLayout.cog(); else $('cog').scrollIntoView({ block: 'start' });
}

let quiz = null;
/* Desafío de 5 minutos: questions from the three tracks in turn (figures, numbers, English), one level harder every 3
   right answers. Score = points of the right answers (their difficulty) × accuracy; the IQ is a playful estimate.
   The server (api/ninja.js) generates the questions, keeps the answers and the clock and computes the score, so the
   page can't be read or edited to cheat. Without a connection the run is played here, but it doesn't count. */
const NINJA_MS = 5 * 60000;
const NINJA_KINDS = ['serie', 'tabla', 'lectura', 'matriz', 'porcentaje', 'conectores', 'distinta', 'grafico', 'orden'];
const genOf = kind => Object.values(TRACKS).find(t => t.kinds.some(k => k.id === kind)).gen;
function ninjaQ() { const kind = NINJA_KINDS[quiz.qs.length % NINJA_KINDS.length]; return genOf(kind).make[kind](quiz.level, quiz.used); }
const iqFor = score => Math.max(70, Math.min(160, Math.round(85 + 22 * Math.log(1 + (Number(score) || 0) / 4))));
const iqTier = iq => [0, 115, 125, 130, 135, 140, 150].filter(v => iq >= v).length - 1;
const IQ_JOKES = [
  ['IQ similar al de un chimpancé. Que nunca se enteren en el trabajo.', 'Tranqui: tu secreto está a salvo con nosotros. Con tu jefe, no tanto.', 'El chimpancé también tardó en entender la flecha que gira. Él no tenía reunión a las 9, eso sí.'],
  ['IQ de bebé prodigio: ya distinguís un círculo de un cuadrado. Casi siempre.', 'Nivel bebé: mucho potencial, poca paciencia. No lo pongas en el CV todavía.'],
  ['Nivel niño genio: te va bien en el cole, pero la matriz te hizo transpirar.', 'Pensás rápido. Ahora falta pensar bien.'],
  ['Genio incomprendido: pensás como filósofo y cobrás como filósofo.', 'La cabeza está. Falta que te llamen de la entrevista.'],
  ['Nivel intelectual: ya podés decir "en mi test de IQ…" en las reuniones.', 'Anteojos, café y secuencias resueltas. Te falta la boina.'],
  ['Nivel premio Nobel: andá preparando el discurso de agradecimiento.', 'Tus neuronas piden un aumento de sueldo.'],
  ['Nivel alien: la NASA quiere hablar con vos. O con tu planeta.', '¿Sos una persona o una inteligencia extraterrestre disfrazada?'],
];
function startQuiz(sess) {
  window.tnLayout?.quiz?.(sess);
  if (sess === 'ninja') return startNinja();
  if (!mayStart()) return;
  const co = sess?.company && Object.hasOwn(COMPANY_SIMS, sess.company) ? COMPANY_SIMS[sess.company] : null, sim = sess === 'sim' || !!co, tr = co ? 'log' : sim ? cogTrack : sess.track, T = TRACKS[tr], used = new Set();
  const qs = co ? Array.from({ length: co.n }, (_, i) => { const k = co.kinds[i % co.kinds.length]; return genOf(k).make[k](2 + Math.floor(3 * i / co.n), used); })
    : sim ? shuffle(Array.from({ length: T.sim.n }, (_, i) => T.gen.make[T.kinds[i % 3].id](3 + (i % 3 + Math.floor(i / 3)) % 3, used)))
    : Array.from({ length: sess.size }, () => T.gen.make[sess.kind](sess.d, used));
  quiz = { sess, sim, co, tr, qs, i: 0, ok: 0, picks: [], limit: co ? co.min * 60000 : sim ? T.sim.min * 60000 : sess.size * T.levels[sess.d - 1].perQ * 1000, t0: performance.now() };
  quiz.guided = !sim && dojo.guided;
  mode = 'quiz'; counted = false; setQuizLabels(false); $('qIntro').hidden = true;
  $('qGroup').textContent = co ? `🏢 ${co.name} · ${co.n} preguntas en ${co.min} minutos` : sim ? `${T.icon} ${T.short} · simulacro de ${T.sim.n} preguntas en ${T.sim.min} minutos` : `${T.icon} ${T.short} · sesión ${sess.n} · ${cogLevel(sess.g)} · dificultad ${sess.d}`;
  $('qName').textContent = co ? co.name : sim ? 'Simulacro de entrevista' : sess.name;
  $('qPlay').hidden = false; $('qResult').hidden = true;
  show('quiz'); renderQ();
  clearInterval(timer); timer = setInterval(qTick, 250); qTick();
}
function setQuizLabels(ninja) {
  $('qRun').hidden = !ninja; $('qTime').nextElementSibling.textContent = 'restante';
  $('qNumLbl').textContent = ninja ? 'respondidas' : 'pregunta'; $('qOkLbl').textContent = ninja ? 'puntos' : 'correctas';
  $('qHint').textContent = ninja ? 'Rápido: elegí con las teclas 1 a 5 (o A a E) · Esc para salir' : 'Elegí con el mouse o con las teclas 1 a 5 (o A a E) · Esc para salir';
}
// First a short explanation; the clock starts only with "Empezar".
function startNinja() {
  if (!mayStart()) return;
  clearInterval(timer);
  quiz = { ninja: true, qs: [], used: new Set(), i: 0, ok: 0, picks: [], points: 0, level: 1, limit: NINJA_MS, t0: 0 };
  mode = 'nready'; $('qGo').disabled = false; counted = false; setQuizLabels(true);
  $('qName').textContent = 'Desafío de 5 minutos'; $('qGroup').textContent = window.tnLayout ? 'Ninja mental · cinturón blanco · dificultad 1 de 5' : 'Ninja mental · dificultad 1 de 5';
  $('qNum').textContent = '0'; $('qOk').textContent = '0'; $('qTime').textContent = fmt(NINJA_MS); $('qBar').style.width = '0%';
  $('qTime').parentElement.classList.remove('low');
  $('qIntro').hidden = false; $('qPlay').hidden = true; $('qResult').hidden = true;
  show('quiz'); $('qGo').focus({ preventScroll: true });
}
async function beginNinja() {
  if (mode !== 'nready') return;
  mode = 'nstart'; $('qGo').disabled = true;
  const run = quiz;
  try { const r = await api('ninja', { type: 'start' }); run.id = r.id; run.qs.push(r.q); }
  catch { run.local = true; run.qs.push(ninjaQ()); }
  if (mode !== 'nstart' || quiz !== run) return; // left while it was starting
  $('qGo').disabled = false;
  mode = 'quiz'; quiz.t0 = performance.now();
  $('qIntro').hidden = true; $('qPlay').hidden = false;
  $('qFlash').textContent = 'Figuras, números e inglés, mezclados. ¡Vamos!'; $('qFlash').className = 'q-flash';
  renderQ();
  timer = setInterval(qTick, 250); qTick();
}
function qTick() {
  if (mode !== 'quiz') return;
  if (quiz.feedbackAt && !quiz.ninja && !quiz.sim) return;
  if (quiz.guided) { $('qTime').textContent = '∞'; $('qTime').parentElement.classList.remove('low'); $('qTime').nextElementSibling.textContent = 'sin reloj'; return; }
  const left = quiz.limit - (performance.now() - quiz.t0);
  $('qTime').textContent = fmt(left);
  if (quiz.ninja) $('qBar').style.width = (100 * (1 - left / quiz.limit)) + '%';
  $('qTime').parentElement.classList.toggle('low', left < 30000);
  if (left <= 0) finishQuiz();
}
function renderQ() {
  const q = quiz.qs[quiz.i];
  if (quiz.ninja) {
    $('qNum').textContent = quiz.i; $('qOk').textContent = quiz.points;
    $('qGroup').textContent = `Ninja mental · ${window.tnLayout ? cogLevel(quiz.level - 1) + ' · ' : ''}dificultad ${quiz.level} de 5`;
  } else {
    $('qNum').textContent = `${quiz.i + 1}/${quiz.qs.length}`; $('qOk').textContent = quiz.sim ? '—' : quiz.ok;
    $('qBar').style.width = (100 * quiz.i / quiz.qs.length) + '%';
  }
  $('qPrompt').textContent = q.prompt;
  const fig = qFigure(q);
  $('qFig').innerHTML = fig; $('qFig').hidden = !fig;
  // The technique for this question, except in the mock test and the 5-minute run (as in a real test)
  $('qTip').hidden = !q.tip || quiz.sim || quiz.ninja;
  $('qTip').innerHTML = q.tip ? `💡 <b>Técnica:</b> ${escHtml(q.tip)}` : '';
  $('qOpts').className = 'q-opts' + (q.text ? ' txt' + (q.options.some(o => String(o).length > 28) ? ' long' : '') : q.kind === 'distinta' ? ' big' : ''); // long: sentences, one per row
  $('qOpts').replaceChildren(...q.options.map((t, i) => {
    const b = document.createElement('button'); b.className = 'opt'; b.type = 'button';
    b.innerHTML = `<b>${'ABCDE'[i]}</b>${optHtml(q, t)}`; b.setAttribute('aria-label', 'Opción ' + 'ABCDE'[i] + ': ' + (q.text ? t : Figures.describe(t)));
    b.onclick = e => answerQ(i, e);
    return b;
  }));
  $('qFeedback').hidden = true;
  watchPointer();
  $('qPrompt').focus({ preventScroll: true });
}
function answerQ(k, ev) {
  const q = quiz.qs[quiz.i];
  if (mode !== 'quiz' || k >= q.options.length || !$('qFeedback').hidden || quiz.lock) return;
  if (!counted) countPractice();
  if (quiz.ninja) return answerNinja(k, ev);
  const right = k === q.answer;
  quiz.picks[quiz.i] = k; if (right) quiz.ok++;
  if (quiz.sim) { nextQ(); return; }
  quiz.feedbackAt = performance.now();
  const btns = $('qOpts').children;
  btns[q.answer].classList.add('right'); if (!right) btns[k].classList.add('wrong');
  $('qOk').textContent = quiz.ok;
  $('qExplain').innerHTML = `<b>${right ? '✓ ¡Correcto!' : `✗ Era la ${'ABCDE'[q.answer]}.`}</b> `; $('qExplain').append(q.explain);
  const next = q.after && q.after !== q.tip ? q.after : !right ? q.tip : '';
  if (next) $('qExplain').insertAdjacentHTML('beforeend', `<span class="q-next">💡 <b>Para la próxima:</b> ${escHtml(next)}</span>`);
  if (dojo.humor) { const joke = document.createElement('span'); joke.className = 'q-next'; joke.textContent = Dojo.feedback(right ? 100 : 70, quiz.i % 2); $('qExplain').append(joke); }
  $('qFeedback').hidden = false; $('qNext').focus({ preventScroll: true });
}
/* How each answer of the 5-minute run was given, for the server to tell people from programs: keyboard or pointer,
   whether the browser saw a real event, how many times the pointer moved since the question appeared and how far
   it jumped to click (an agent clicks straight on the answer; a hand moves the mouse there). */
const ptr = { x: null, y: null, moves: 0, from: null };
addEventListener('pointermove', e => { if (e.pointerType !== 'touch') { ptr.x = e.clientX; ptr.y = e.clientY; ptr.moves++; } }, { passive: true });
const watchPointer = () => { ptr.moves = 0; ptr.from = ptr.x == null ? null : { x: ptr.x, y: ptr.y }; };
function answerSignal(ev) {
  const key = !ev || ev.type === 'keydown' || ev.detail === 0;
  const input = key ? 'key' : ['mouse', 'pen', 'touch'].includes(ev.pointerType) ? ev.pointerType : 'mouse';
  const jump = key || input === 'touch' ? 0 : ptr.from ? Math.hypot(ev.clientX - ptr.from.x, ev.clientY - ptr.from.y) : 9999;
  return { input, trusted: !!ev?.isTrusted, focus: document.hasFocus(), moves: ptr.moves, jump: Math.round(jump) };
}
// A quick flash of the right answer, then the next question: one level harder every 3 right answers.
async function answerNinja(k, ev) {
  const run = quiz, q = run.qs[run.i];
  run.lock = true; run.picks[run.i] = k;
  let r;
  if (run.local) {
    const right = k === q.answer, pts = q.d || run.level;
    run.ok += right ? 1 : 0; run.points += right ? pts : 0;
    r = { right, answer: q.answer, pts, points: run.points, ok: run.ok, n: run.i + 1, level: Math.min(5, 1 + Math.floor(run.ok / 3)) };
  } else {
    run.pending = api('ninja', { type: 'answer', id: run.id, pick: k, sig: answerSignal(ev) });
    try { r = await run.pending; } catch { r = null; }
    run.pending = null;
    if (quiz !== run || mode !== 'quiz') return; // the run ended while the answer was on its way
    if (!r || r.over) { run.lock = false; if (!r) toast('Se cortó la conexión: tu desafío termina acá.'); return finishQuiz(); }
  }
  const btns = $('qOpts').children, before = run.level;
  btns[r.answer].classList.add('right'); if (!r.right) btns[k].classList.add('wrong');
  run.ok = r.ok; run.points = r.points; run.level = r.level;
  $('qFlash').textContent = (r.right ? `✓ ¡Bien! +${r.pts} ${r.pts === 1 ? 'punto' : 'puntos'}` : `✗ Era la ${'ABCDE'[r.answer]}`) + (run.level > before ? ` · ¡Sube a ${window.tnLayout ? cogLevel(run.level - 1) : 'dificultad ' + run.level}!` : ' · Va la siguiente');
  $('qFlash').className = 'q-flash ' + (r.right ? 'ok' : 'bad');
  $('qNum').textContent = run.i + 1; $('qOk').textContent = run.points;
  setTimeout(() => {
    run.lock = false;
    if (mode !== 'quiz' || quiz !== run) return;
    run.qs.push(run.local ? ninjaQ() : r.q); run.i++; renderQ();
  }, r.right ? 300 : q.text ? 1100 : 700);
}
function nextQ() {
  if (mode !== 'quiz') return;
  if (quiz.feedbackAt) { quiz.t0 += performance.now() - quiz.feedbackAt; quiz.feedbackAt = 0; }
  quiz.i++;
  if (quiz.i >= quiz.qs.length) finishQuiz(); else renderQ();
}
function finishQuiz() {
  if (mode !== 'quiz') return;
  if (quiz.ninja) return finishNinja();
  clearInterval(timer); mode = 'qdone'; doneAt = performance.now();
  const ms = Math.min(quiz.guided ? Infinity : quiz.limit, performance.now() - quiz.t0), n = quiz.qs.length, ok = quiz.ok, pct = Math.round(100 * ok / n);
  const timedOut = !quiz.guided && quiz.i < n, sess = quiz.sess;
  $('qBar').style.width = '100%'; $('qTime').textContent = quiz.guided ? '∞' : fmt(quiz.limit - ms);
  let html;
  if (quiz.sim) {
    const ti = tierForPct(pct), T = TRACKS[quiz.tr];
    S.sims.push({ pct, ms: Math.round(ms), date: Date.now(), track: quiz.tr, ...(quiz.co ? { company: quiz.co.id } : {}) }); S.sims = S.sims.slice(-100);
    const wrong = quiz.qs.map((q, i) => ({ q, i, pick: quiz.picks[i] })).filter(x => x.pick !== x.q.answer);
    html = `<h3>${quiz.co ? quiz.co.name : `Simulacro de entrevista · ${T.short}`}</h3>
      <div class="house-result">${Typists.typist(ti)}<div class="house-copy"><span class="eyebrow">Con ${ok} de ${n} correctas resolviste como</span><h4>${cap1(TIERS[ti].name)}</h4>
        <p class="joke">${COG_JOKES[quiz.tr][ti]}</p><p>${timedOut ? 'Se terminó el tiempo: las preguntas sin responder cuentan como incorrectas. ' : ''}${escHtml(quiz.co ? quiz.co.ref : T.sim.ref)}</p></div></div>
      <div class="nums"><div><b>${ok}/${n}</b><span>correctas</span></div><div><b>${pct}%</b><span>aciertos</span></div><div><b>${fmt(ms)}</b><span>tiempo</span></div></div>
      ${wrong.length ? `<div class="review"><h4>Para repasar</h4>${wrong.map(x => `<div class="rv${x.q.text ? ' txt' : ''}"><span class="rv-n">${x.i + 1}</span><div><p><b>${kindInfo(x.q.kind).name}.</b> ${escHtml(x.q.prompt)} ${x.pick == null ? 'Sin responder' : `Elegiste la ${'ABCDE'[x.pick]}`}; era la ${'ABCDE'[x.q.answer]}${x.q.text ? ` (${escHtml(x.q.options[x.q.answer])})` : ''}.</p><p class="rv-x">${escHtml(x.q.explain)}</p><p class="rv-tip">💡 ${escHtml(x.q.after || x.q.tip)}</p></div>${x.q.text ? '' : Figures.draw(x.q.options[x.q.answer], 'fig small')}</div>`).join('')}</div>` : '<p>¡Sin errores!</p>'}`;
  } else {
    const tr = quiz.tr, st = cogStarsFor(ok, n), before = cogState(sess.g, tr), finBefore = cogState(FINAL, tr), prev = S.cog[sess.id];
    if (!prev || st > prev.stars || (st === prev.stars && pct > prev.pct)) S.cog[sess.id] = { stars: st, pct, ms: Math.round(ms) };
    const after = cogState(sess.g, tr), fin = cogState(FINAL, tr), P = tierShort(sess.g);
    let gi = sess.g, st2 = after, fresh = false, title = `Nivel ${P}`, txt = cogText(sess.g, after);
    if (fin.tier > finBefore.tier || (fin.complete && !finBefore.complete)) { gi = FINAL; st2 = fin; fresh = true; title = fin.gold ? '¡Evolucionaste a alien!' : '¡Evolucionaste a premio Nobel!'; txt = cogText(FINAL, fin); }
    else if (after.complete && !before.complete) {
      gi = sess.g + 1; st2 = { ...cogState(gi, tr), done: 1 }; fresh = true; title = `¡Nivel ${P} superado!`;
      txt = gi === FINAL ? 'Aprobá todas las sesiones para llegar a premio Nobel, y probá el simulacro.' : `Evolucionaste: ahora vas por el nivel ${tierShort(gi)}.`;
    } else if (after.gold && !before.gold) { title = `¡Nivel ${P} con 3 estrellas!`; fresh = true; }
    else if (!st && !(prev?.stars >= 1)) txt = `Acertá ${passFor(n)} de ${n} para aprobarla y avanzar en el nivel ${P}.`;
    if (window.tnLayout) {
      title = fin.complete ? '¡Cinturón negro!' : after.complete ? `¡${cap1(cogLevel(sess.g))} superado!` : cap1(cogLevel(sess.g));
      txt = cogText(fin.complete ? FINAL : sess.g, fin.complete ? fin : after);
    }
    const msg = timedOut ? 'Se terminó el tiempo: las preguntas sin responder cuentan como incorrectas.'
      : st === 3 ? '¡Perfecto! Todas bien.' : st ? `Aprobada. Con ${st === 1 ? Math.ceil(n * .8) : n} de ${n} ganás otra estrella.` : 'Todavía no: leé las explicaciones y las técnicas, y probá de nuevo.';
    html = `<h3>${st ? 'Sesión aprobada' : 'Casi: repetila'}</h3>${stars(st, 'bigstars')}
      <div class="nums"><div><b>${ok}/${n}</b><span>correctas</span></div><div><b>${pct}%</b><span>aciertos</span></div><div><b>${fmt(ms)}</b><span>tiempo</span></div></div>
      <p>${msg}</p><div class="result-evo">${window.tnLayout ? cogBeltArt(fin.complete ? FINAL : sess.g) : evoArt(gi, st2, fresh)}<div><b>${title}</b><p>${txt}</p></div></div>`;
  }
  save();
  tn.capture('practice_completed', { ...practiceInfo(true), accuracy: pct, correct: ok, questions: n, stars: quiz.sim ? null : S.cog[sess.id]?.stars || 0, duration_ms: Math.round(ms) });
  recordSession({ lesson: 'cog', name: quiz.co ? `Ninja · ${quiz.co.name}` : quiz.sim ? `Ninja · simulacro de ${TRACKS[quiz.tr].short}` : `Ninja · ${TRACKS[quiz.tr].short} · ${sess.name} (sesión ${sess.n})`, stars: quiz.sim ? 0 : S.cog[sess.id]?.stars || 0, ppm: 0, acc: pct, ms: Math.round(ms) });
  const nx = !quiz.sim && cogStarsFor(ok, n) > 0 && SESSIONS[quiz.tr][SESSIONS[quiz.tr].indexOf(sess) + 1];
  $('qResult').innerHTML = html + `<div class="actions">
      ${nx ? `<button class="btn primary" id="qrNext">Siguiente: sesión ${nx.n} <small>Enter</small></button>` : ''}
      <button class="btn${nx ? '' : ' primary'}" id="qrAgain">${quiz.sim ? 'Otro simulacro' : 'Repetir'}${nx ? '' : ' <small>Enter</small>'}</button>
      <button class="btn" id="qrHome">Ninja mental</button></div>`;
  $('qPlay').hidden = true; $('qResult').hidden = false; scrollTo({ top: 0 });
  $('qrNext') && ($('qrNext').onclick = () => startQuiz(nx));
  const tr = quiz.tr;
  $('qrAgain').onclick = () => { if (quiz.sim) cogTrack = tr; startQuiz(sess); };
  $('qrHome').onclick = goCog;
  coachQuiz();
  (($('qrNext') || $('qrAgain'))).focus({ preventScroll: true });
}
async function finishNinja() {
  clearInterval(timer); mode = 'qdone'; doneAt = performance.now();
  const run = quiz;
  $('qBar').style.width = '100%'; $('qTime').textContent = '0:00';
  $('qResult').innerHTML = '<h3>Desafío de 5 minutos</h3><p>Calculando tu resultado…</p>';
  $('qPlay').hidden = true; $('qResult').hidden = false; scrollTo({ top: 0 });
  await run.pending?.catch(() => {});
  let r = null;
  if (run.id) try { r = await api('ninja', { type: 'finish', id: run.id }); } catch {}
  if (quiz !== run || mode !== 'qdone') return; // already somewhere else
  run.lock = false; doneAt = performance.now();
  if (!r) { // played here (no connection): the same calculation, but it can't be verified
    const n = run.picks.filter(x => x != null).length, acc = n ? run.ok / n : 0, score = Math.round((run.points || 0) * acc);
    r = { score, iq: iqFor(score), ok: run.ok, n, points: run.points || 0, acc: Math.round(100 * acc), maxLevel: Math.max(1, ...run.qs.slice(0, n).map(q => q.d || 1)), date: Date.now(),
      flagged: true, offline: true, reasons: ['No hubo conexión con el servidor, así que el puntaje no se pudo verificar.'] };
  }
  const { score, iq, ok, n, flagged } = r, ti = iqTier(iq);
  const mark = { id: r.id, score, iq, ok, n, date: r.date, ...(flagged ? { flagged: true } : {}) };
  const record = !flagged && n > 0 && (!S.ninja.best || score > S.ninja.best.score);
  if (r.ninja) { S.ninja.best = r.ninja.best; S.ninja.runs = r.ninja.runs; }
  else { if (record) S.ninja.best = mark; S.ninja.runs.push(mark); S.ninja.runs = S.ninja.runs.slice(-50); }
  save();
  tn.capture('practice_completed', { ...practiceInfo(true), accuracy: r.acc, correct: ok, questions: n, score, iq, flagged: !!flagged, duration_ms: NINJA_MS });
  recordSession({ lesson: 'cog', name: 'Ninja · desafío de 5 minutos' + (flagged ? ' (no cuenta)' : ''), stars: 0, ppm: 0, acc: r.acc, ms: NINJA_MS })
    .then(saved => saved && loadRanking()).then(() => flagged || ninjaRankLine(score));
  const reasons = flagged ? `<div class="flag-note" role="note"><b>⚠️ Esta partida no cuenta para el ranking${r.offline ? '' : ' ni para desafiar a tus amigos'}.</b>
      <ul>${r.reasons.map(x => `<li>${escHtml(x)}</li>`).join('')}</ul>
      ${r.offline ? '' : '<p>Si fuiste vos, jugá como siempre con tu mouse, tu dedo o el teclado, en esta pestaña y sin extensiones que hagan clics por vos.</p>'}</div>` : '';
  $('qResult').innerHTML = `<h3>Desafío de 5 minutos</h3>${reasons}
    <div class="house-result">${Typists.typist(ti)}<div class="house-copy"><span class="eyebrow">Tu IQ ninja estimado</span><h4 class="iq">IQ ${iq}</h4>
      <p class="joke">${rnd(IQ_JOKES[ti])}</p>
      <p>Pensás como ${TIERS[ti].name}. ${record && S.ninja.runs.length > 1 ? '¡Nuevo récord personal! ' : ''}Es una estimación lúdica según tu puntaje, no un test de IQ real.</p>
      ${flagged ? '' : ninjaChallengeResult(score)}<p id="ninjaRankLine">${flagged ? '' : auth.name ? '' : 'Entrá con tu cuenta para aparecer en el ranking ninja.'}</p></div></div>${iqOffer()}
    <div class="nums"><div><b>${score}</b><span>puntos</span></div><div><b>${ok}/${n}</b><span>correctas</span></div><div><b>${r.acc}%</b><span>efectividad</span></div><div><b>${r.maxLevel}</b><span>dificultad máxima</span></div></div>
    <p>Cada acierto suma su dificultad (de 1 a 5) y el total se multiplica por tu efectividad: ${r.points} × ${r.acc}% = ${score} puntos.</p>
    <div class="actions"><button class="btn primary" id="qrAgain">Otra vez <small>Enter</small></button><button class="btn" id="qrChallenge">${flagged ? 'Invitar a un amigo' : 'Desafiar a un amigo'}</button><button class="btn" id="qrHome">Ninja mental</button></div>`;
  const coach = document.createElement('aside'); coach.className = 'coach'; coach.textContent = Dojo.feedback(r.acc, n % 2, dojo.humor) + (r.acc < 85 ? ' Volvé a las sesiones guiadas y priorizá entender cada regla.' : ' Buen control. Tu próximo rival es tu mejor marca.'); $('qResult').querySelector('.actions').before(coach);
  $('qrAgain').onclick = startNinja;
  $('qrChallenge').onclick = () => openChallenge(flagged ? { kind: 'ninja', score: 0 } : { kind: 'ninja', score, run: r.id });
  $('qrHome').onclick = goCog;
  if ($('iqOfferBtn')) { tn.capture('iq_offer_viewed', { iq, score }); $('iqOfferBtn').onclick = () => showPlan('iq_result'); }
  $('qrAgain').focus({ preventScroll: true });
}
function ninjaRankLine(score) {
  const el = $('ninjaRankLine'), me = RANK?.ninja?.me;
  if (el && !me && auth.name && !score) el.textContent = 'Con 0 puntos todavía no entrás al ranking ninja: con un acierto ya aparecés.';
  else if (el && me) el.textContent = `Con tu mejor marca (IQ ${iqFor(me.score)}, ${me.score} puntos) estás #${me.rank} de ${RANK.ninja.total + (RANK.ninja.rivals || 0)} en el ranking ninja (con los rivales del dojo).`;
}
function renderNinjaMax() {
  const b = S.ninja.best;
  $('maxBest').textContent = b ? `Tu mejor marca: IQ ${b.iq} · ${b.score} puntos (${b.ok} de ${b.n} correctas). ${S.ninja.runs.length} ${S.ninja.runs.length === 1 ? 'intento' : 'intentos'}.` : 'Todavía no lo intentaste.';
  renderRankInto($('ninjaRank'), $('ninjaRankNote'), 'ninja', 10);
}
$('maxBtn').onclick = startNinja;
$('maxInvite').onclick = () => openChallenge(S.ninja.best?.id ? { kind: 'ninja', score: S.ninja.best.score, run: S.ninja.best.id } : { kind: 'ninja', score: 0 });
$('qNext').onclick = nextQ;
$('qBack').onclick = leaveQuiz;
$('qEnd').onclick = () => { if (mode === 'quiz') finishQuiz(); };
$('qGo').onclick = beginNinja;
// Leaving the 5-minute run halfway shows its result (if something was answered) instead of losing it.
function leaveQuiz() { if (mode === 'quiz' && quiz?.ninja && quiz.picks.some(x => x != null)) finishQuiz(); else goCog(); }
$('cogContinue').onclick = () => iqTest() ? startNinja() : startQuiz(nextSession());
$('scNinja').onclick = goCog;
$('scMax').onclick = () => startQuiz('ninja');
$('simBtn').onclick = () => startQuiz('sim');
$('cogCta').onclick = e => { e.preventDefault(); goCog(); };
$('tcCta').onclick = e => { e.preventDefault(); goHome(); $('teclado').scrollIntoView({ block: 'start' }); };

/* ---------- Ranking of every account: lesson progress and best speed ---------- */
let RANK = null, rankView = 'general';
async function loadRanking() {
  try { RANK = await api('ranking'); }
  catch (err) { RANK = { error: err.status === 0 || err.status === 404 ? 'El ranking funciona en la versión publicada, con la base de datos conectada.' : err.message }; }
  renderRanking();
}
function rankRow(r, rank, view = rankView) {
  const li = document.createElement('li'), isMe = r.name === RANK.user;
  if (isMe) li.className = 'me';
  if (r.rival) li.className = 'rival';
  let val, sub, pct;
  if (view === 'general') {
    pct = Math.min(100, Math.round(100 * r.score / 400));
    val = `${r.score} pts`; sub = 'estrellas + velocidad + desafío';
  } else if (view === 'cog') {
    const done = Math.floor(r.score / 1000), stars = r.score % 1000, total = Object.values(SESSIONS).flat().length;
    pct = Math.round(100 * done / total);
    val = pct + '%'; sub = `${done}/${total} sesiones · ${stars} ★`;
  } else if (view === 'ninja') {
    const iq = iqFor(r.score);
    pct = Math.round(100 * (iq - 70) / 90);
    val = 'IQ ' + iq; sub = `${r.score} puntos · nivel ${tierShort(iqTier(iq))}`;
  } else if (view === 'progress') {
    const done = Math.floor(r.score / 100), stars = r.score % 100;
    pct = Math.round(100 * done / LESSONS.length);
    val = pct + '%'; sub = `${done}/${LESSONS.length} lecciones · ${stars} ★`;
  } else {
    pct = Math.min(100, Math.round(r.score / 120 * 100));
    val = r.score + ' ppm'; sub = 'Nivel ' + tierShort(tierFor(r.score));
  }
  li.innerHTML = `<span class="pos${rank <= 3 ? ' p' + rank : ''}"></span><span class="who"></span><span class="val"><b></b><small></small></span><span class="bar"><i style="width:${pct}%"></i></span>`;
  li.querySelector('.pos').textContent = '#' + rank;
  li.querySelector('.who').textContent = r.display || r.name;
  if (isMe) li.querySelector('.who').insertAdjacentHTML('beforeend', '<small>vos</small>');
  if (r.rival) { li.querySelector('.who').insertAdjacentHTML('beforeend', '<small class="bot">🤖 rival del dojo</small>'); li.title = 'Bot de práctica: no es una persona'; }
  li.querySelector('.val b').textContent = val;
  li.querySelector('.val small').textContent = sub;
  return li;
}
function renderRankInto(list, note, view, limit = 50) {
  list.replaceChildren();
  if (!RANK) { note.textContent = 'Cargando el ranking…'; return; }
  if (RANK.error) { note.textContent = RANK.error; return; }
  const b = RANK[view] || { top: [], total: 0, rivals: 0, me: null }, top = b.top.slice(0, limit);
  let rank = 0;
  top.forEach((r, i) => { if (!i || top[i - 1].score !== r.score) rank = i + 1; list.append(rankRow(r, rank, view)); });
  if (b.me && !top.some(r => r.name === b.me.name)) {
    const sep = document.createElement('li'); sep.className = 'sep'; sep.textContent = '⋯';
    list.append(sep, rankRow(b.me, b.me.rank, view));
  }
  const who = b.total === 1 ? '1 persona' : b.total + ' personas';
  const empty = { general: 'Todavía no hay nadie. Practicá con tu cuenta y estrená el ranking.', progress: 'Todavía no hay nadie. Aprobá una lección con tu cuenta y estrená el ranking.', speed: 'Todavía no hay mediciones. Medí tu velocidad con tu cuenta y estrená el ranking.', cog: 'Todavía nadie aprobó una sesión de Ninja mental. ¡Estrenalo!', ninja: 'Todavía nadie hizo el desafío de 5 minutos con su cuenta. ¡Estrenalo!' }[view];
  const join = { general: ' Aprobá una lección o una sesión para aparecer.', progress: ' Aprobá una lección para aparecer.', speed: ' Medí tu velocidad para aparecer.', cog: ' Aprobá una sesión de Ninja mental para aparecer.', ninja: ' Hacé el desafío de 5 minutos para aparecer.' }[view];
  const bots = b.rivals ? ` Los ${b.rivals} 🤖 rivales del dojo son bots de práctica, no personas.` : '';
  note.textContent = (!b.total ? empty : `${who} en este ranking.` + (RANK.user ? (b.me ? '' : join) : ' Entrá con tu cuenta para aparecer.')) + bots;
}
function renderRanking() {
  document.querySelectorAll('#rankView button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === rankView)));
  renderRankInto($('rankList'), $('rankNote'), rankView);
  renderRankInto($('ninjaRank'), $('ninjaRankNote'), 'ninja', 10);
  if ($('homeTypingRank')) renderRankInto($('homeTypingRank'), $('homeTypingNote'), homeRankViews.typing, 3);
  if ($('homeMentalRank')) renderRankInto($('homeMentalRank'), $('homeMentalNote'), homeRankViews.mental, 3);
}
function rankLine(ppm) {
  const el = $('rankLine'), me = RANK?.speed?.me;
  if (el && ppm > 250) el.textContent = 'Más de 250 palabras por minuto no entra al ranking: sospechamos de un gato sobre el teclado.';
  else if (el && me) el.textContent = `Con tu mejor marca (${me.score} ppm) estás #${me.rank} de ${RANK.speed.total + (RANK.speed.rivals || 0)} en el ranking de velocidad (con los rivales del dojo).`;
}
const homeRankViews = { typing: 'speed', mental: 'ninja' };
document.querySelectorAll('[data-home-rank]').forEach(b => b.onclick = () => {
  const view = b.dataset.homeRank, key = ['speed', 'progress'].includes(view) ? 'typing' : 'mental';
  homeRankViews[key] = view;
  b.parentElement.querySelectorAll('button').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  renderRanking();
});
document.querySelectorAll('#rankView button').forEach(b => b.onclick = () => { rankView = b.dataset.v; renderRanking(); });

/* ---------- Freemium: a few free practices per day, unlimited with a Mercado Pago subscription ---------- */
// With payments not configured (or no server) nothing is limited. Guests count in this browser; accounts on the server.
let planFrom = null; // why the plan was last opened (limit, upgrade, iq_result), for checkout_clicked
let billing = { enabled: false, premium: false, plays: 0, price: '', freePerDay: 5, guestPerDay: 5, accountPerDay: 5 }, counted = false, planAfterLogin = false, signupFrom = null;
// Guests: a few practices in this browser. A free account gets more (accountPerDay), so running out offers one first.
const freeAccountOffer = () => limited() && !auth.name && billing.accountPerDay > billing.guestPerDay;
const PLAYS_KEY = 'teclado-ciego-plays', arDay = () => new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10);
const limited = () => billing.enabled && !billing.premium;
function guestPlays() { try { const p = JSON.parse(localStorage.getItem(PLAYS_KEY)); return p?.day === arDay() ? p.n : 0; } catch { return 0; } }
const usedToday = () => auth.name ? billing.plays : guestPlays();
async function loadBilling(sync) {
  try { Object.assign(billing, await api('billing', sync ? { action: 'sync' } : undefined)); } catch {}
  await syncOffer(); // a guest who saw the 24-hour offer and then signed in keeps the same countdown
  await startPixel(billing.pixel); // before any event of this page, like the Purchase coming back from paying
  startGoogleTag(billing.gads);
  if (billing.enabled) tn.people({ plan: billing.premium ? 'ilimitado' : 'gratis' });
  renderPlanNote();
}

/* ---------- Meta Pixel: only when META_PIXEL_ID is set on the server (see api/_meta.js) ---------- */
// Events: PageView · CompleteRegistration (new account) · Practica (custom: a practice starts, with its section)
// · ViewContent (sees the prices, with why: limit or upgrade) · InitiateCheckout (goes to pay) · Purchase (back from paying).
// The last four also go from the server (Conversions API) with the same event id, so Meta counts each one once.
const cookie = name => (document.cookie.match('(?:^|; )' + name + '=([^;]*)') || [])[1];
// _fbc: the click on an ad (fbclid in the address), kept 90 days. Created here too, not only by the pixel, because the
// pixel loads later and the address may change before that; without it Meta can't tie the visit to the ad.
(() => {
  const click = new URLSearchParams(location.search).get('fbclid');
  if (click && /^[\w.-]{1,500}$/.test(click) && !(cookie('_fbc') || '').endsWith('.' + click))
    document.cookie = `_fbc=fb.1.${Date.now()}.${click};max-age=7776000;path=/;SameSite=Lax`;
})();
// _gcl_aw: the click on a Google ad (gclid), kept 90 days in the cookie Google's tag reads, for the same reason.
(() => {
  const click = new URLSearchParams(location.search).get('gclid');
  if (click && /^[\w-]{10,200}$/.test(click) && !(cookie('_gcl_aw') || '').endsWith('.' + click))
    document.cookie = `_gcl_aw=GCL.${Math.floor(Date.now() / 1000)}.${click};max-age=7776000;path=/;SameSite=Lax`;
})();
// This browser's anonymous id: the pixel's external_id (hashed), the same one the server sends with its events.
const ANON_KEY = 'teclado-ciego-anon';
const anonId = (() => {
  try { const id = localStorage.getItem(ANON_KEY); if (/^[\w-]{8,64}$/.test(id || '')) return id; } catch {}
  const id = crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  try { localStorage.setItem(ANON_KEY, id); } catch {}
  return id;
})();
const sha256 = async text => {
  try { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.trim().toLowerCase())))].map(b => b.toString(16).padStart(2, '0')).join(''); }
  catch { return null; } // no crypto.subtle (an insecure copy): the pixel goes without external_id
};
const eventId = () => 'ev_' + (crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
// What the server needs to send the same event: Meta's cookies, this browser's id and the page.
const metaTrack = id => ({ event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), anon: anonId, url: location.origin + location.pathname });
let pixelOn = false, pixelStarting = false;
async function startPixel(id) {
  if (pixelOn || pixelStarting || !/^\d{6,20}$/.test(id || '')) return;
  pixelStarting = true;
  const externalId = await sha256(anonId);
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('set', 'autoConfig', false, id); // only our events: no automatic button clicks (SubscribedButtonClick)
  fbq('init', id, externalId ? { external_id: externalId } : {}); fbq('track', 'PageView');
  pixelOn = true;
}
/* Google Ads tag: the same events as the pixel, each one a Google Ads conversion (api/_google.js has the labels).
   Only when the server sends an AW- id (GOOGLE_ADS_ID=off turns it off, as in local copies). */
const GADS = { ViewContent: 'precios', CompleteRegistration: 'registro', Practica: 'practica', InitiateCheckout: 'pago', Purchase: 'compra' };
let gads = null;
function startGoogleTag(cfg) {
  if (gads || !/^AW-\d{6,15}$/.test(cfg?.id || '')) return;
  gads = { id: cfg.id, labels: cfg.labels || {} };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', gads.id);
  const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gads.id; document.head.append(s);
}
function gadsConversion(event, params, id) {
  const label = gads?.labels[GADS[event]];
  if (!label) return;
  gtag('event', 'conversion', { send_to: gads.id + '/' + label, ...(params?.value != null ? { value: params.value, currency: params.currency } : {}), ...(id ? { transaction_id: id } : {}) });
}
const track = (event, params, eventID) => { gadsConversion(event, params, eventID); if (pixelOn) fbq('track', event, params || {}, eventID ? { eventID } : undefined); };
const trackCustom = (event, params) => { gadsConversion(event, params); if (pixelOn) fbq('trackCustom', event, params || {}); };
// An event that happens only in the page (ViewContent): the pixel, and the server through /api/track with the same id.
function trackBoth(event, params, extra) {
  if (!pixelOn) return gadsConversion(event, params);
  const id = eventId();
  track(event, params, id);
  fetch('/api/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', ...(auth.token ? { Authorization: 'Bearer ' + auth.token } : {}) },
    body: JSON.stringify({ event, event_id: id, ...extra, track: metaTrack(id) }) }).catch(() => {});
}
// The Purchase of an approved payment, once per browser (the server sends the same event id).
function trackPurchase() {
  const p = billing.purchase, key = 'teclado-ciego-pixel-' + p?.id;
  if (!p) return;
  try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch {}
  track('Purchase', { value: p.value, currency: p.currency, content_name: 'Templo Ninja · acceso ilimitado' }, p.id);
}
function mayStart() {
  if (!limited() || usedToday() < billing.freePerDay) return true;
  showPlan('limit'); return false;
}
// A practice counts from its first key, so opening a lesson and leaving does not use one.
function countPractice() {
  counted = true;
  tn.capture('practice_started', { ...practiceInfo(mode === 'quiz'), free_left: limited() ? Math.max(0, billing.freePerDay - usedToday() - 1) : null });
  trackCustom('Practica', { seccion: mode === 'quiz' ? 'ninja-mental' : 'teclado-ciego', desafio: Boolean(quiz?.ninja && mode === 'quiz') });
  if (!limited()) return;
  if (auth.name) {
    billing.plays++;
    api('billing', { action: 'play' }).catch(err => { if (err.status === 402) { goHome(); showPlan('limit'); } });
  } else try { localStorage.setItem(PLAYS_KEY, JSON.stringify({ day: arDay(), n: guestPlays() + 1 })); } catch {}
  renderPlanNote();
}
function renderPlanNote() {
  $('upgradeLabel').innerHTML = billing.premium ? 'Ninja <span class="cta-long">ilimitado</span>' : 'Apoyá <span class="cta-long">el templo</span>';
  const note = $('planNote');
  note.hidden = !limited();
  if ($('dojoCount').dataset.ready) renderDojo(); // the plan's meter also shows when the free practices run out
  if (note.hidden) return;
  const left = Math.max(0, billing.freePerDay - usedToday());
  note.innerHTML = `Plan gratis: ${left ? `te ${left === 1 ? 'queda 1 práctica' : `quedan ${left} prácticas`} de ${billing.freePerDay} hoy` : 'ya usaste tus prácticas de hoy'} · <button type="button">Acceso ilimitado</button>`;
  note.querySelector('button').onclick = () => showPlan('upgrade');
}
// What a practice is, for the analytics events (no personal data).
function practiceInfo(ninja) {
  if (ninja) return { section: 'ninja-mental', kind: quiz?.ninja ? 'desafio-5-min' : quiz?.sim ? 'simulacro' : 'sesion', track: quiz?.ninja ? 'mixto' : quiz?.co ? 'mixto' : quiz?.tr, ...(quiz?.co ? { company: quiz.co.id } : {}), difficulty: quiz?.sess?.d ?? null, guided: !!quiz?.guided };
  return { section: 'teclado-ciego', kind: cur === 'test' ? 'medicion' : cur?.review ? 'repaso' : 'leccion', lesson: cur === 'test' ? null : cur?.id ?? null, method: cur === 'test' ? testMethod : null };
}
function showPlan(reason) {
  planFrom = reason;
  tn.capture('pricing_viewed', { reason, payments_on: billing.enabled, premium: billing.premium, logged_in: !!auth.name, used_today: usedToday() });
  if (!billing.premium) trackBoth('ViewContent', { content_name: 'Templo Ninja · precios', content_category: reason }, { reason });
  // Also opened from the header CTA: without payments configured, or with the plan already active, it only informs.
  const canBuy = billing.enabled && !billing.premium;
  const offer = freeAccountOffer(), outOfGuest = offer && reason === 'limit';
  $('planEyebrow').textContent = outOfGuest ? '⛩ PLAN GRATIS' : '⛩ APORTE AL TEMPLO';
  $('planTitle').textContent = outOfGuest ? 'Seguí entrenando gratis' : 'Entrená sin límites, para siempre';
  $('planReason').textContent = !billing.enabled ? 'El acceso ilimitado está en camino. Mientras tanto, todo es gratis y sin límites: aprovechalo.'
    : billing.premium ? '✦ Ya tenés acceso ilimitado. ¡Gracias por bancar el templo! Los monjes ninja te lo agradecen 🙏'
    : outOfGuest ? `Ya usaste tus ${billing.freePerDay} prácticas gratis de hoy sin cuenta.`
    : reason === 'limit' ? `Ya usaste tus ${billing.freePerDay} prácticas gratis de hoy. Volvé mañana o hacé tu aporte para seguir ahora.`
    : reason === 'iq_result' ? 'Tu IQ ninja sube con práctica: figuras, números e inglés sin límite diario, para siempre.'
    : `Con el plan gratis tenés ${billing.freePerDay} prácticas por día${offer ? ` (${billing.accountPerDay} con tu cuenta gratis)` : ''}.`;
  $('planFree').hidden = !offer; $('planOr').hidden = !offer;
  $('planFreeText').textContent = `Solo usuario y contraseña: tenés ${billing.accountPerDay} prácticas por día, tu progreso guardado en cualquier dispositivo y tu lugar en el ranking.`;
  $('planSubmit').classList.toggle('primary', !offer);
  $('planPrice').textContent = billing.enabled ? billing.price : '';
  $('planPrice').hidden = !billing.enabled; $('planSubmit').hidden = !canBuy;
  $('planSubmit').textContent = auth.name ? 'Hacer mi aporte con Mercado Pago' : 'Crear cuenta o entrar para hacer mi aporte';
  $('planErr').textContent = ''; $('planSubmit').disabled = false;
  // On a computer, also the phone: that is where most people have Mercado Pago open (the first purchase was paid that way).
  $('planPhone').hidden = !(canBuy && auth.name && matchMedia('(hover: hover) and (pointer: fine)').matches);
  $('planQrBox').hidden = true; stopQrWatch();
  renderOffer(); pricingTest();
  if (!$('planDlg').open) $('planDlg').showModal();
}
function renderPlan() {
  const st = $('planStatus'), sub = billing.subscription;
  $('upgrade').hidden = !limited();
  st.textContent = !billing.enabled ? ''
    : billing.gift ? '✦ Plan Ilimitado (cortesía)'
    : billing.lifetime ? '✦ Acceso ilimitado para siempre. ¡Gracias por tu aporte al templo!'
    : billing.premium ? (sub?.status === 'authorized' ? '✦ Plan Ilimitado activo. Se renueva solo cada mes; lo gestionás desde Mercado Pago.' : `✦ Plan Ilimitado vigente hasta el ${new Date(sub.paidUntil).toLocaleDateString('es-AR')}.`)
    : `Plan gratis: ${billing.freePerDay} prácticas por día.`;
}
$('upgrade').onclick = () => { $('acctDlg').close(); showPlan('upgrade'); };
$('upgradeCta').onclick = () => showPlan('upgrade');
$('planClose').onclick = () => $('planDlg').close();
$('planDlg').addEventListener('close', () => { stopQrWatch(); clearInterval(offerTick); });

/* Pricing experiment "precio-oferta-24h" (PostHog, 50/50, every visitor who sees the prices). In "test" the price is
   a 24-hour offer: the regular price struck through, the countdown, and once it ends that account pays the regular
   price (api/_billing.js decides the amount; this only shows it). The countdown starts the first time the prices show
   and is kept: in the account (server) or, for a guest, in this browser until they sign in. Asking for the flag only
   here, when the plan opens, is what counts someone as exposed. */
const OFFER_FLAG = 'precio-oferta-24h', OFFER_KEY = 'tn-oferta-24h', OFFER_MS = 24 * 36e5;
let offerVariant = null, offerTick = null;
const guestOfferStart = create => {
  try {
    const n = Number(localStorage.getItem(OFFER_KEY));
    if (n > 0) return n;
    if (create) { localStorage.setItem(OFFER_KEY, String(Date.now())); return Date.now(); }
  } catch {}
  return create ? Date.now() : null;
};
function pricingTest() {
  if (!billing.enabled || billing.premium) return;
  tn.flag(OFFER_FLAG, async v => {
    if (v !== 'test' && v !== 'control') return;
    const first = !offerVariant; offerVariant = v;
    if (v === 'test' && !auth.name) guestOfferStart(true);
    await syncOffer();
    renderOffer();
    if (first) { const o = offerState(); tn.capture('price_offer_seen', { variant: v, active: o ? o.active : null, minutes_left: o?.active ? Math.round((o.endsAt - Date.now()) / 6e4) : null, logged_in: !!auth.name }); }
  });
}
// The account keeps its variant (and, coming from a guest visit, when the offer started); the first one stored stays.
async function syncOffer() {
  if (!auth.name || !offerVariant || billing.offer || !billing.enabled) return;
  try { Object.assign(billing, await api('billing', { action: 'offer', variant: offerVariant, start: offerVariant === 'test' ? guestOfferStart(false) : undefined })); } catch {}
}
function offerState() {
  if (offerVariant !== 'test' || !billing.enabled || billing.premium) return null;
  const endsAt = auth.name ? billing.offer?.endsAt : guestOfferStart(false) + OFFER_MS;
  return endsAt ? { endsAt, active: Date.now() < endsAt, regular: billing.offer?.regular || billing.regular || 9900 } : null;
}
const money = n => '$ ' + Number(n).toLocaleString('es-AR');
function renderOffer() {
  clearInterval(offerTick);
  const o = offerState(), base = billing.amount;
  $('planOffer').hidden = !o?.active;
  $('planPrice').hidden = !billing.enabled || !!o?.active;
  if (!o) return;
  if (!o.active) { $('planPrice').textContent = money(o.regular) + ' · pago único'; return; } // the offer ended: the regular price
  $('planEyebrow').textContent = '🎉 PRECIO DE LANZAMIENTO';
  $('offerOld').textContent = money(o.regular);
  $('offerSave').textContent = 'Ahorrás ' + money(o.regular - base);
  $('offerNew').innerHTML = escHtml(money(base)) + '<small>pago único</small>';
  $('offerNote').textContent = `Este precio es para vos. Cuando termina el reloj, el acceso ilimitado pasa a ${money(o.regular)}. Sin suscripción ni débitos.`;
  const tick = () => {
    const left = Math.max(0, o.endsAt - Date.now()), pad = n => String(n).padStart(2, '0');
    $('cdH').textContent = pad(Math.floor(left / 36e5)); $('cdM').textContent = pad(Math.floor(left / 6e4) % 60); $('cdS').textContent = pad(Math.floor(left / 1e3) % 60);
    if (!left) { clearInterval(offerTick); (auth.name ? loadBilling() : Promise.resolve()).then(renderOffer); }
  };
  tick(); offerTick = setInterval(tick, 1000);
}
// Free account from the plan: the guest keeps practicing today with the account's practices.
function signupFromPlan(mode) {
  signupFrom = 'plan'; tn.capture('signup_prompt_clicked', { mode, used_today: usedToday() });
  $('planDlg').close(); openAuth(); setAuthMode(mode);
  if (mode === 'register') $('authLead').textContent = `Elegí un usuario y una contraseña. Con tu cuenta gratis tenés ${billing.accountPerDay} prácticas por día, y lo que ya practicaste en este navegador se suma.`;
}
$('planSignup').onclick = () => signupFromPlan('register');
$('planLogin').onclick = () => signupFromPlan('login');
// Mercado Pago's checkout link, here (to go now) or as a QR (to pay from the phone).
async function checkout(via) {
  tn.capture('checkout_clicked', { logged_in: !!auth.name, price: billing.amount ?? null, currency: billing.currency ?? null, source: planFrom, via });
  if (!auth.name) { planAfterLogin = true; $('planDlg').close(); openAuth(); setAuthMode('register'); return null; }
  $('planSubmit').disabled = $('planPhone').disabled = true; $('planErr').textContent = '';
  const checkoutId = eventId(); // the server sends the same InitiateCheckout once the checkout exists
  track('InitiateCheckout', { value: billing.amount, currency: billing.currency, content_name: 'Templo Ninja · acceso ilimitado' }, checkoutId);
  try { const { url } = await api('billing', { action: 'buy', track: metaTrack(checkoutId) }); tn.capture('checkout_started', { provider: 'mercadopago', via }); return url; }
  catch (err) { tn.capture('checkout_error', { status: err.status ?? null }); $('planErr').textContent = err.message; return null; }
  finally { $('planSubmit').disabled = $('planPhone').disabled = false; }
}
$('planForm').onsubmit = async e => {
  e.preventDefault();
  const url = await checkout('web');
  if (url) { $('planSubmit').disabled = true; location.href = url; }
};
// The QR library loads only when someone asks for it (vendor/qrcode.js, MIT).
const loadQr = () => window.qrcode ? Promise.resolve() : new Promise((ok, fail) => {
  const s = document.createElement('script'); s.src = 'vendor/qrcode.js'; s.onload = ok; s.onerror = fail; document.head.append(s);
});
let qrWatch = null;
function stopQrWatch() { clearInterval(qrWatch); qrWatch = null; }
$('planPhone').onclick = async () => {
  const url = await checkout('qr');
  if (!url) return;
  try { await loadQr(); } catch { $('planErr').textContent = 'No pudimos mostrar el código. Probá con el botón de Mercado Pago.'; return; }
  const qr = qrcode(0, 'M'); qr.addData(url); qr.make();
  $('planQr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  $('planQrBox').hidden = false; $('planPhone').hidden = true;
  // Until the payment is in (or 15 minutes pass), ask Mercado Pago every 5 seconds, then thank and unlock here.
  stopQrWatch(); const until = Date.now() + 15 * 60e3;
  qrWatch = setInterval(async () => {
    if (Date.now() > until) return stopQrWatch();
    await loadBilling(true);
    if (!billing.premium) return;
    stopQrWatch(); trackPurchase(); renderPlan(); $('planDlg').close();
    toast('¡Gracias por tu aporte! Los monjes ninja te lo agradecen 🙏 Ya tenés acceso ilimitado ✦');
  }, 5000);
};

/* ---------- Challenges: invite friends by WhatsApp or email with a link ---------- */
// ?de=ana&ppm=42&metodo=ciegas → "ana te desafía" (speed) · ?de=ana&reto=<run>#ninja → Ninja mental challenge.
// A speed link carries the score. A ninja link names a run graded by the server, which says its score (api/ninja.js):
// a link without one (or with a made-up one) is just an invitation.
let challenge = null, shareScore = null;
const NAME_KEY = 'teclado-ciego-nombre';
(() => {
  const q = new URLSearchParams(location.search);
  if (!q.has('de')) return;
  const from = (q.get('de') || '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 24);
  const method = METHODS.find(m => m.id === q.get('metodo')), ppm = Math.round(Number(q.get('ppm')));
  if (from && (q.has('reto') || q.has('ninja'))) {
    challenge = { from, kind: 'ninja', score: 0 };
    const run = q.get('reto'), mine = challenge;
    if (run) fetch('/api/ninja?reto=' + encodeURIComponent(run)).then(res => res.ok ? res.json() : null).then(r => {
      if (!r?.score || challenge !== mine) return;
      Object.assign(mine, { score: r.score, from: r.name || from, verified: true }); renderChallenge();
    }).catch(() => {});
  }
  else if (from) challenge = { from, kind: 'speed', ppm: method && ppm > 0 && ppm <= 250 ? ppm : 0, method: method?.id || 'ciegas' };
  if (challenge?.kind === 'speed') { challenge.seed = /^[a-zA-Z0-9-]{1,48}$/.test(q.get('texto') || '') ? q.get('texto') : null; challenge.acc = q.has('precision') ? Math.max(0, Math.min(100, Number(q.get('precision')) || 0)) : null; challenge.accents = q.get('tildes') === 'loose' ? 'loose' : 'strict'; }
  for (const k of ['de', 'ppm', 'metodo', 'ninja', 'reto', 'texto', 'precision', 'tildes']) q.delete(k);
  window.history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
})();
function renderChallenge() {
  $('challengeBanner').hidden = !challenge;
  if (!challenge) return;
  if (challenge.kind === 'ninja') {
    $('challengeTitle').textContent = challenge.score ? `${challenge.from} te desafía en Ninja mental: IQ ${iqFor(challenge.score)} (${challenge.score} puntos ✓ verificados)` : `${challenge.from} te invita a Ninja mental`;
    $('challengeText').textContent = challenge.score ? 'Tenés 5 minutos de figuras, números e inglés para superarlo. ¿Le ganás?' : 'Resolvé todo lo que puedas en 5 minutos y compará tu IQ ninja.';
    return;
  }
  const m = METHODS.find(x => x.id === challenge.method);
  $('challengeTitle').textContent = challenge.ppm ? `${challenge.from} te desafía: ${challenge.ppm} palabras por minuto ${m.as}` : `${challenge.from} te invita a escribir sin mirar`;
  $('challengeText').textContent = challenge.ppm ? `Tenés un minuto. ${challenge.seed ? 'Mismo texto y mismas reglas.' : 'Texto aleatorio: comparación orientativa.'} ${challenge.acc != null ? challenge.acc + '% de precisión. ' : ''}Marca compartida, no verificada por el servidor.` : 'Medí tu velocidad en un minuto y mandale tu resultado.';
}
function challengeResult(ppm) {
  if (challenge?.kind !== 'speed' || !challenge.ppm || testMethod !== challenge.method) return '';
  if (challenge.seed && challenge.seed !== testSeed) return '<p class="challenge-result">Elegí Aceptar el desafío para competir con el mismo texto.</p>';
  if (challenge.acc != null && (challenge.acc < 90 || Math.round(100 * idx / Math.max(1, idx + errors)) < 90)) return '<p class="challenge-result">Para declarar ganador, ambos necesitan al menos 90% de precisión. ¡Revancha con menos teclas rebeldes!</p>';
  const d = ppm - challenge.ppm, who = challenge.from.replace(/[<>&"]/g, '');
  return `<p class="challenge-result">${d > 0 ? `🏆 ¡Le ganaste a ${who} por ${d} palabras por minuto! Mandale la revancha.` : d < 0 ? `Te faltaron ${-d} palabras por minuto para ganarle a ${who}. ¿Otra vez?` : `¡Empate con ${who}! Desempaten con otra medición.`}</p>`;
}
function ninjaChallengeResult(score) {
  if (challenge?.kind !== 'ninja' || !challenge.score) return '';
  const d = score - challenge.score, who = challenge.from.replace(/[<>&"]/g, '');
  return `<p class="challenge-result">${d > 0 ? `🏆 ¡Le ganaste a ${who} por ${d} puntos! Mandale la revancha.` : d < 0 ? `Te faltaron ${-d} puntos para ganarle a ${who}. ¿Otra vez?` : `¡Empate con ${who}! Desempaten con otro desafío.`}</p>`;
}
const isNinjaShare = () => shareScore?.kind === 'ninja';
function shareLink() {
  const u = new URL(location.pathname, location.href);
  u.searchParams.set('de', shownName()?.slice(0, 24) || $('chName').value.trim().slice(0, 24) || 'Un amigo');
  if (isNinjaShare()) { if (shareScore.run) u.searchParams.set('reto', shareScore.run); u.hash = 'ninja'; }
  else if (shareScore) { u.searchParams.set('ppm', shareScore.ppm); u.searchParams.set('metodo', shareScore.method); }
  if (shareScore && !isNinjaShare()) { if (shareScore.seed) u.searchParams.set('texto', shareScore.seed); if (Number.isFinite(shareScore.acc)) u.searchParams.set('precision', shareScore.acc); u.searchParams.set('tildes', shareScore.accents === 'loose' ? 'loose' : 'strict'); }
  return u.href;
}
function shareMessage() {
  if (isNinjaShare()) return (shareScore.score && shareScore.run
    ? `¡Te desafío en Ninja mental! Saqué ${shareScore.score} puntos en el desafío de 5 minutos (IQ ninja ${iqFor(shareScore.score)}). ¿Me ganás?`
    : 'Probá el desafío de 5 minutos de Ninja mental (figuras, números e inglés) y compará tu IQ ninja con el mío.') + ' ' + shareLink();
  const m = shareScore && METHODS.find(x => x.id === shareScore.method);
  return (shareScore
    ? `¡Te desafío en Templo Ninja! Escribí ${shareScore.ppm} palabras por minuto ${m.as} (nivel ${tierShort(tierFor(shareScore.ppm))}). ¿Me ganás?`
    : 'Estoy aprendiendo a escribir sin mirar el teclado en Templo Ninja. ¿Medimos quién escribe más rápido?') + ' ' + shareLink();
}
function updateShare() {
  const msg = shareMessage(), email = $('chEmail').value.trim();
  $('chPreview').textContent = msg;
  $('chWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
  $('chMail').href = `mailto:${/^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(email) ? email : ''}?subject=${encodeURIComponent(isNinjaShare() ? 'Te desafío en Ninja mental' : 'Te desafío en Templo Ninja')}&body=${encodeURIComponent(msg)}`;
}
function openChallenge(score) {
  shareScore = score;
  let saved = ''; try { saved = localStorage.getItem(NAME_KEY) || ''; } catch {}
  $('chName').value = saved; $('chNameLabel').hidden = !!auth.name;
  const m = score && METHODS.find(x => x.id === score.method);
  $('chLead').textContent = score?.kind === 'ninja'
    ? (score.score ? `Mandale tu marca: ${score.score} puntos (IQ ninja ${iqFor(score.score)}). Con el enlace puede aceptar el desafío y ver si te gana.` : 'Invitalo al desafío de 5 minutos y comparen el IQ ninja.')
    : score
    ? `Mandale tu marca: ${score.ppm} palabras por minuto ${m.as}. Con el enlace puede aceptar el desafío y ver si te gana.`
    : 'Mandale una invitación para medir su velocidad y comparar.';
  if (score && !isNinjaShare()) $('chLead').textContent += ' Las marcas de velocidad son autodeclaradas. Usen el mismo dispositivo y al menos 90% de precisión.';
  updateShare(); $('challengeDlg').showModal();
}
function bestScore() {
  const best = S.tests.reduce((b, t) => !b || t.ppm > b.ppm ? t : b, null);
  return best && { ppm: best.ppm, acc: best.acc, method: best.method, seed: best.seed, accents: best.accents };
}
$('chName').oninput = () => { try { localStorage.setItem(NAME_KEY, $('chName').value.trim()); } catch {} updateShare(); };
$('chEmail').oninput = updateShare;
$('chCopy').onclick = async () => {
  try { await navigator.clipboard.writeText(shareMessage()); toast('Copiado. Pegalo donde quieras.'); }
  catch { toast('No se pudo copiar: seleccioná el texto de arriba.'); }
};
$('chClose').onclick = () => $('challengeDlg').close();
$('inviteBtn').onclick = () => openChallenge(bestScore());
$('challengeAccept').onclick = () => {
  tn.capture('challenge_accepted', { kind: challenge.kind, has_score: !!(challenge.score || challenge.ppm) });
  if (challenge.kind === 'ninja') startNinja(); else { S.tildes = challenge.accents || 'strict'; applyAccentMode(); start('test', challenge.method, challenge.seed); }
};
$('challengeDismiss').onclick = () => { challenge = null; renderChallenge(); };
renderChallenge();

/* ---------- Personal learning plan (browser-local, separate from ranked progress) ---------- */
if (matchMedia('(max-width: 700px)').matches) $('preferencePanel').open = false;
const DOJO_KEY = 'templo-dojo-v1';
let dojo = { level: 'beginner', track: 'typing', humor: true, guided: true, days: {}, weak: [], lastTyping: null };
try {
  const v = JSON.parse(localStorage.getItem(DOJO_KEY));
  if (v && typeof v === 'object') dojo = { ...dojo, ...v,
    days: v.days && typeof v.days === 'object' && !Array.isArray(v.days) ? v.days : {},
    weak: Array.isArray(v.weak) ? v.weak.filter(k => typeof k === 'string' && k.length === 1).slice(0, 4) : [] };
} catch {}
if (!['beginner', 'intermediate', 'advanced'].includes(dojo.level)) dojo.level = 'beginner';
if (!['typing', 'fig', 'num', 'eng'].includes(dojo.track)) dojo.track = 'typing';
function saveDojo() { try { localStorage.setItem(DOJO_KEY, JSON.stringify(dojo)); } catch {} }
function logDojo(entry) {
  if (!counted || !entry.ms || entry.ms < 1000) return;
  const today = Dojo.day(), count = Number(dojo.days[today]) || 0;
  dojo.days[today] = Math.min(999, count + 1);
  dojo.days = Object.fromEntries(Object.entries(dojo.days).sort().slice(-366));
  saveDojo(); renderDojo();
}
function recommendedLesson() {
  const floor = dojo.level === 'advanced' ? 18 : dojo.level === 'intermediate' ? 6 : 0;
  return LESSONS.slice(floor).find(l => !(S.lessons[l.id]?.stars >= 2)) || LESSONS[floor];
}
function recommendedSession() {
  const floor = dojo.level === 'advanced' ? 4 : dojo.level === 'intermediate' ? 3 : 1;
  return SESSIONS[dojo.track].find(s => s.d >= floor && !(S.cog[s.id]?.stars >= 2)) || SESSIONS[dojo.track].find(s => s.d === floor);
}
function renderDojo() {
  if (!$('dojo')) return;
  $('dojoLevel').value = dojo.level; $('dojoTrack').value = dojo.track;
  $('dojoHumor').checked = dojo.humor; $('dojoGuided').checked = dojo.guided;
  const n = Number(dojo.days[Dojo.day()]) || 0;
  $('dojoDays').textContent = Dojo.streak(Object.keys(dojo.days));
  $('dojoProgress').value = Math.min(3, n);
  // When the free practices run out, the plan points to unlimited access instead of saying goodbye.
  const outOfFree = limited() && usedToday() >= billing.freePerDay;
  $('dojoCount').textContent = outOfFree ? `Usaste tus ${billing.freePerDay} prácticas gratis de hoy. ${freeAccountOffer() ? `Con tu cuenta gratis seguís con ${billing.accountPerDay} por día, o con el acceso ilimitado sin límites.` : 'Con el acceso ilimitado seguís ahora mismo.'}`
    : n >= 3 ? 'Meta de hoy completa. Si tenés ganas, seguí: cada ronda suma.' : `${n}/3 prácticas hoy · una ya es un buen comienzo`;
  $('dojoUnlock').hidden = !outOfFree;
  $('dojoUnlock').textContent = freeAccountOffer() ? 'Seguir gratis' : 'Seguir sin límite';
  $('dojoCount').dataset.ready = '1';
  const typing = dojo.track === 'typing';
  $('missionTitle').textContent = typing ? recommendedLesson().name : recommendedSession().name;
  $('missionDesc').textContent = typing ? 'Buscá 95% de precisión. La velocidad viene después; el teclado no se va a escapar.' : `${TRACKS[dojo.track].name} · dificultad ${recommendedSession().d}/5. Leé la técnica y explicá la regla antes de responder.`;
  $('reviewDesc').textContent = typing && dojo.weak.length ? `Tu última práctica dejó estas teclas para reforzar: ${dojo.weak.map(k => k === ' ' ? 'espacio' : k).join(', ')}.` : typing ? 'Afianzá las teclas de tu nivel con otra ronda corta.' : 'Repetí una habilidad con preguntas nuevas. Buscá entender el porqué de cada respuesta.';
  $('dojoChallenge').textContent = typing ? 'Reto de hoy · 60 s' : 'Simulacro de entrevista';
}
function trainDojo() { if (dojo.track === 'typing') start(recommendedLesson()); else { cogTrack = dojo.track; startQuiz(recommendedSession()); } }
// A progress check (/nueva): a short round with every key learned so far, kept apart from the lessons' stars
function startControl(name) {
  const done = LESSONS.filter(l => S.lessons[l.id]?.stars >= 1), last = done.at(-1) || LESSONS[0], allowed = allowedFor(LESSONS.indexOf(last));
  const letters = [...allowed].filter(isLetter), words = pickWords(allowed, [], 14);
  start({ ...last, id: 'control', name, review: true, control: true, practiceText: (words || Array.from({ length: 10 }, () => group(letters, letters))).join(' ') });
}
function startDrill(keys = dojo.weak) {
  const base = recommendedLesson();
  const allowed = allowedFor(LESSONS.indexOf(base));
  const pool = WORDS.filter(w => [...w].every(c => allowed.has(c)));
  const practiceText = Dojo.drill(keys.length ? keys : [...base.keys].filter(isLetter), pool);
  if (!practiceText) { start(base); return; }
  start({ ...base, id: 'repaso', name: 'Rescate de teclas rebeldes', review: true, practiceText });
}
function coachTyping(ppm, acc, weak) {
  dojo.weak = weak.map(([key]) => key);
  const previous = dojo.lastTyping;
  dojo.lastTyping = { acc, ppm }; saveDojo(); renderDojo();
  const box = document.createElement('aside'); box.className = 'coach'; box.setAttribute('aria-label', 'Tu próximo paso');
  const title = document.createElement('b'); title.textContent = Dojo.feedback(acc, S.tests.length % 2, dojo.humor);
  const p = document.createElement('p');
  p.textContent = weak.length ? 'Misión siguiente: practicá tus teclas rebeldes despacio. Apuntá a 95% de precisión antes de acelerar.' : acc >= 95 ? 'Precisión en zona verde. Probá el siguiente desafío sin perder este control.' : 'Bajá un cambio y repetí: primero precisión, después velocidad.';
  box.append(title, p);
  if (previous && Number.isFinite(previous.acc)) { const trend = document.createElement('small'); trend.textContent = `Precisión anterior: ${previous.acc}%. Actual: ${acc}%. Compará ejercicios de dificultad similar.`; box.append(trend); }
  if (weak.length) { const btn = document.createElement('button'); btn.className = 'btn primary'; btn.id = 'rDrill'; btn.textContent = 'Practicar mis errores'; btn.onclick = () => startDrill(weak.map(([k]) => k)); box.append(btn); }
  $('result').querySelector('.actions').before(box);
  if (cur?.review) { $('result').querySelector('h3').textContent = cur.control ? 'Control completo' : 'Repaso completo'; $('result').querySelector('.bigstars')?.remove(); $('result').querySelector('.result-evo')?.remove(); }
}
function coachQuiz() {
  const pct = Math.round(100 * quiz.ok / quiz.qs.length), box = document.createElement('aside');
  box.className = 'coach';
  const title = document.createElement('b'); title.textContent = Dojo.feedback(pct, quiz.ok % 2, dojo.humor); box.append(title);
  const wrong = quiz.qs.filter((q, i) => quiz.picks[i] !== q.answer);
  const p = document.createElement('p'); p.textContent = wrong.length ? 'Antes de repetir, contá con tus palabras por qué esa respuesta es correcta. Después probá con un ejercicio nuevo.' : 'Todas correctas. Subí la dificultad o probá un simulacro para transferir lo aprendido.'; box.append(p);
  if (wrong.length) {
    const target = wrong[0], session = SESSIONS[quiz.tr].find(s => s.kind === target.kind && s.d === (target.d || quiz.sess.d || 3));
    if (session) { const btn = document.createElement('button'); btn.className = 'btn primary'; btn.id = 'qrDrill'; btn.textContent = `Reforzar ${kindInfo(target.kind).name.toLowerCase()}`; btn.onclick = () => startQuiz(session); box.append(btn); }
    if (!quiz.sim) {
      const review = document.createElement('div'); review.className = 'review';
      wrong.forEach(q => { const details = document.createElement('details'), summary = document.createElement('summary'), explanation = document.createElement('p'); summary.textContent = q.prompt; explanation.textContent = `${q.explain} ${q.after || q.tip || ''}`; details.append(summary, explanation); if (!q.text) { const fig = document.createElement('div'); fig.innerHTML = Figures.draw(q.options[q.answer], 'fig small'); details.append(fig); } review.append(details); }); box.append(review);
    }
  }
  $('qResult').querySelector('.actions').before(box);
}
$('dojoLevel').onchange = e => { dojo.level = e.target.value; saveDojo(); renderDojo(); };
$('dojoTrack').onchange = e => { dojo.track = e.target.value; saveDojo(); renderDojo(); };
$('dojoHumor').onchange = e => { dojo.humor = e.target.checked; saveDojo(); };
$('dojoGuided').onchange = e => { dojo.guided = e.target.checked; saveDojo(); };
$('dojoStart').onclick = trainDojo;
$('dojoUnlock').onclick = () => showPlan('limit');
$('dojoReview').onclick = () => dojo.track === 'typing' ? startDrill() : trainDojo();
$('dojoChallenge').onclick = () => { if (dojo.track === 'typing') start('test', 'ciegas', 'daily-' + Dojo.day()); else { cogTrack = dojo.track; startQuiz('sim'); } };
$('dojoInvite').onclick = () => openChallenge(bestScore());
renderDojo();

/* ---------- Settings ---------- */
function applyKbMode() {
  document.querySelectorAll('#kbMode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.kb)));
  const noGuide = S.kb === 'hidden' || cur === 'test';
  $('guide').hidden = noGuide; $('hiddenKb').hidden = !noGuide || cur === 'test'; $('liveHouse').hidden = cur !== 'test';
  $('hiddenKb').textContent = cur === 'test' ? 'Medición sin ayuda en pantalla: escribí como lo harías con este método.' : 'Teclado oculto. Mirá la pantalla y confiá en tus dedos.';
  hintOn = false; highlight();
}
document.querySelectorAll('#kbMode button').forEach(b => b.onclick = () => { S.kb = b.dataset.v; save(); pushProgress(); applyKbMode(); focusCap(); });
function applyAccentMode() { document.querySelectorAll('#accMode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (S.tildes === 'loose' ? 'loose' : 'strict')))); }
document.querySelectorAll('#accMode button').forEach(b => b.onclick = () => { S.tildes = b.dataset.v; save(); pushProgress(); applyAccentMode(); focusCap(); });
applyAccentMode();
$('layout').value = S.layout in LAYOUTS ? S.layout : 'la';
$('layout').onchange = () => { S.layout = $('layout').value; save(); pushProgress(); applyLayout(); renderHome(); };
$('continue').onclick = () => start(nextLesson());
$('testBtn').onclick = () => $('evo').scrollIntoView();
$('back').onclick = goHome;
$('homeBtn').onclick = goHome;
if (matchMedia('(hover: none) and (pointer: coarse)').matches) $('touchNote').hidden = false;

applyLayout(); applyKbMode(); renderHome(); renderAccountBtn();
// Accounts need the server (Vercel functions). Without it (a local file or a static copy), hide the button.
// Links from /profesional: ?pista=log opens a track, ?simulacro=meli starts a company's mock test.
{
  const q = new URLSearchParams(location.search), own = (o, k) => k && Object.hasOwn(o, k), pista = q.get('pista'), co = own(COMPANY_SIMS, q.get('simulacro')) && COMPANY_SIMS[q.get('simulacro')];
  if (own(TRACKS, pista)) { setTrack(pista); goCog(); }
  else if (NINJA_HASH.test(location.hash) || challenge?.kind === 'ninja') goCog();
  if (co) { setTrack('log'); goCog(); startQuiz({ company: co.id }); }
}
addEventListener('hashchange', () => { if (NINJA_HASH.test(location.hash) && mode !== 'quiz' && mode !== 'typing') goCog(); });
renderRanking();
// Without a saved session there is nothing to check: guests skip the request (and its 401).
(auth.token ? api('auth') : Promise.reject(Object.assign(new Error('guest'), { status: 401 }))).then(r => signedIn(auth.token, r.user.name, r.user.display)).catch(err => {
  if (err.status === 401) { if (auth.token) signedOut(); return; }
  if (err.status === 0 || err.status === 404) { $('acctBtn').hidden = true; $('foot').textContent = 'Tu progreso se guarda en este navegador.'; }
}).finally(() => { loadRanking(); if (!auth.name) { loadBilling(); paidWithoutSession(); } });
// Mercado Pago may send the person back to another browser than the one with the session (the phone's default one):
// the payment is already in the account, so ask them to sign in here, with the username filled in.
function paidWithoutSession() {
  const q = new URLSearchParams(location.search), back = q.get('aporte'), user = q.get('external_reference');
  if (!back) return;
  window.history.replaceState(null, '', location.pathname + location.hash);
  tn.capture('payment_return_signed_out', { status: back });
  if (back !== 'ok') return;
  toast('¡Gracias por tu aporte! 🙏 Entrá con tu usuario para usar el acceso ilimitado en este navegador.');
  openAuth(); setAuthMode('login');
  if (/^[a-z0-9_.-]{3,20}$/.test(user || '')) $('user').value = user;
}
// Another layout of the same page (nueva.html → nueva.js) drives the app through these, and gets told of its moves
// through window.tnLayout (start, quiz, cog, home). index.html sets no layout, so nothing changes there.
window.tnApp = { start, startQuiz, goHome, goCog, nextLesson, drawChart, fcol, LESSONS, GROUPS, BELTS, beltState, currentBelt, state: S, NINJA_HASH,
  TN_BELTS, tnBeltOf, tnBeltState, tnNum,
  key: k => MAP[k], mode: () => mode, chartShown: () => evoView === 'chart',
  userName: () => auth.name ? shownName() : null, bestPpm: () => Math.max(0, S.test?.ppm || 0, ...S.tests.map(t => t.ppm)) || null,
  bestIq: () => S.ninja.best?.iq || null, tierName: ppm => TIERS[tierFor(ppm)].name,
  nextTier: ppm => TIERS[tierFor(ppm) + 1] || null, startControl, METHODS, speedTests: () => S.tests.slice(), iqRuns: () => S.ninja.runs.slice() };
})();
