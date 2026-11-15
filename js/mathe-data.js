// Mathe Klasse 6 (Gymnasium, Baden-Württemberg).
// Die Stationen folgen den Kapiteln I–VII des Lambacher Schweizer 6 (BW, G9) plus
// einer Station "Grundwissen" aus Klasse 5. Alle Texte und Aufgaben sind selbst geschrieben.
// Die meisten Aufgaben werden per Zufall erzeugt: Jede Runde ist anders.

import { pie, bar, angle, clock, numLine, rectFig, paraFig, triFig, boxFig, chart } from './figures.js';

// ---------- Werkzeuge ----------

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a * b) / gcd(a, b);
const coprime = (lo, hi, d) => { let n; do n = rnd(lo, hi); while (gcd(n, d) !== 1); return n; };

// Antwort als gekürzter Bruch ("3/4") oder ganze Zahl ("2")
const fr = (n, d) => { const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };
// Anzeige im Aufgabentext: {3/4}
const F = (n, d) => `{${n}/${d}}`;
const Fr = (n, d) => { const s = fr(n, d); return s.includes('/') ? `{${s}}` : s; };
// Gemischte Zahl anzeigen, wenn der Bruch größer als 1 ist
const mixed = (n, d) => {
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return `${n}`;
  return n > d ? `{${Math.floor(n / d)} ${n % d}/${d}}` : `{${n}/${d}}`;
};
// Dezimalzahl mit Komma, ohne Rundungsfehler
const dec = (x, places = 4) => String(Number(x.toFixed(places))).replace('.', ',');
// Negative Zahlen mit echtem Minus; in Rechnungen mit Klammer
const neg = (n) => String(n).replace('-', '−');
const par = (n) => (n < 0 ? `(${neg(n)})` : `${n}`);

// Auswahl-Aufgabe aus richtiger Antwort und falschen Antworten bauen
function mc(q, correct, wrongs, extra = {}) {
  const seen = new Set([String(correct)]);
  const a = [String(correct)];
  for (const w of wrongs) {
    const s = String(w);
    if (!seen.has(s) && a.length < 4) { seen.add(s); a.push(s); }
  }
  return { t: 'mc', q, a, c: 0, ...extra };
}

const SIGNS = ['<', '=', '>'];
const signOf = (x, y) => (Math.abs(x - y) < 1e-9 ? 1 : x < y ? 0 : 2);

// ---------- 1. Teiler & Primzahlen ----------

const qsum = (n) => String(n).split('').reduce((s, c) => s + Number(c), 0);
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };

function divWhy(n, d) {
  const ok = n % d === 0;
  const nicht = ok ? '' : '**nicht** ';
  if (d === 3 || d === 9) return `Quersumme: ${String(n).split('').join(' + ')} = ${qsum(n)}. ${qsum(n)} ist ${nicht}durch ${d} teilbar – also ist auch ${n} ${nicht}durch ${d} teilbar.`;
  if (d === 4) return `Schau auf die letzten zwei Ziffern: ${String(n).slice(-2)}. Diese Zahl ist ${nicht}durch 4 teilbar.`;
  if (d === 2) return `Die letzte Ziffer ist ${n % 10}. Durch 2 teilbar sind nur Zahlen mit der Endziffer 0, 2, 4, 6 oder 8.`;
  if (d === 5) return `Die letzte Ziffer ist ${n % 10}. Durch 5 teilbar sind nur Zahlen mit der Endziffer 0 oder 5.`;
  if (d === 6) return `Durch 6 teilbar heißt: durch 2 **und** durch 3 teilbar. Endziffer ${n % 10}, Quersumme ${qsum(n)}.`;
  return `Die letzte Ziffer ist ${n % 10}. Durch 10 teilbar sind nur Zahlen mit der Endziffer 0.`;
}

const gDivTF = (divs, lo = 100, hi = 9999) => () => {
  const d = pick(divs);
  let n = rnd(lo, hi);
  if (Math.random() < 0.5) n -= n % d;
  if (n < lo) n += d * 20;
  return { t: 'tf', q: `Ist **${n}** durch **${d}** teilbar?`, c: n % d === 0, labels: ['Ja 👍', 'Nein 👎'], why: divWhy(n, d) };
};

const gDivWhich = (divs) => () => {
  const d = pick(divs);
  const good = rnd(20, 400) * d;
  const wrongs = [];
  while (wrongs.length < 3) {
    const w = rnd(100, 3000);
    if (w % d !== 0 && !wrongs.includes(w)) wrongs.push(w);
  }
  return mc(`Welche Zahl ist durch **${d}** teilbar?`, good, wrongs, { why: divWhy(good, d) });
};

const gQuersumme = () => {
  const n = rnd(1000, 99999);
  return { t: 'num', q: `Berechne die **Quersumme** von ${n}.`, c: `${qsum(n)}`, why: `Quersumme = alle Ziffern addieren: ${String(n).split('').join(' + ')} = ${qsum(n)}.` };
};

const gPrimSort = () => {
  const primes = shuffle([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]).slice(0, 3);
  const others = shuffle([1, 9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 57, 4, 12]).slice(0, 3);
  return {
    t: 'sort', q: 'Primzahl oder nicht?', cats: ['Primzahl', 'keine Primzahl'],
    items: [...primes.map((p) => [`${p}`, 0]), ...others.map((p) => [`${p}`, 1])],
    why: `Eine Primzahl hat **genau zwei** Teiler: 1 und sich selbst.${others.includes(1) ? ' Die 1 hat nur einen Teiler – sie ist keine Primzahl!' : ''}${others.includes(51) ? ' 51 = 3 · 17.' : ''}${others.includes(57) ? ' 57 = 3 · 19.' : ''}${others.includes(39) ? ' 39 = 3 · 13.' : ''}`,
  };
};

const gPrimTF = () => {
  const n = pick([1, 2, 9, 11, 13, 17, 21, 23, 27, 29, 31, 33, 37, 39, 41, 49, 51, 53, 57, 59, 61, 87, 91, 97]);
  let why;
  if (n === 1) why = 'Die 1 hat nur **einen** Teiler. Primzahlen haben genau zwei.';
  else if (isPrime(n)) why = `${n} lässt sich nur durch 1 und ${n} teilen.`;
  else { let t = 2; while (n % t) t++; why = `${n} = ${t} · ${n / t} – sie hat also mehr als zwei Teiler.`; }
  return { t: 'tf', q: `Ist **${n}** eine Primzahl?`, c: isPrime(n), labels: ['Ja 👍', 'Nein 👎'], why };
};

const gGgt = () => {
  const g = rnd(2, 12);
  const m = rnd(1, 5);
  const n = coprime(m + 1, 7, m);
  return { t: 'num', q: `Bestimme den **ggT** von ${g * m} und ${g * n}.`, c: `${g}`, why: `ggT = größter gemeinsamer Teiler. ${g * m} = ${g} · ${m} und ${g * n} = ${g} · ${n}. Eine größere gemeinsame Teilerzahl gibt es nicht.` };
};

const gKgv = () => {
  const [a, b] = pick([[2, 3], [3, 4], [4, 6], [2, 5], [6, 8], [3, 5], [4, 10], [6, 9], [5, 6], [8, 12], [3, 7], [4, 5], [9, 12], [6, 10]]);
  const k = lcm(a, b);
  const list = (x) => Array.from({ length: k / x }, (_, i) => x * (i + 1)).join(', ');
  return { t: 'num', q: `Bestimme das **kgV** von ${a} und ${b}.`, c: `${k}`, why: `kgV = kleinstes gemeinsames Vielfaches.\nVielfache von ${a}: ${list(a)} …\nVielfache von ${b}: ${list(b)} …\nDie erste gemeinsame Zahl ist ${k}.` };
};

const gKeinTeiler = () => {
  const n = pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60]);
  const divs = []; const non = [];
  for (let i = 2; i < n; i++) (n % i === 0 ? divs : non).push(i);
  const w = pick(non.filter((x) => x < n / 2 + 3));
  return mc(`Welche Zahl ist **kein** Teiler von ${n}?`, w, shuffle(divs), { why: `${n} : ${w} geht nicht ohne Rest auf.` });
};

const PRIMFAKTOR = [
  [12, '2 · 2 · 3', ['2 · 6', '3 · 4', '2 · 3 · 3']], [18, '2 · 3 · 3', ['2 · 9', '3 · 6', '2 · 2 · 3']],
  [30, '2 · 3 · 5', ['5 · 6', '2 · 15', '3 · 3 · 5']], [20, '2 · 2 · 5', ['4 · 5', '2 · 10', '2 · 5 · 5']],
  [42, '2 · 3 · 7', ['6 · 7', '2 · 21', '3 · 3 · 7']], [60, '2 · 2 · 3 · 5', ['4 · 15', '2 · 3 · 5', '2 · 2 · 15']],
  [45, '3 · 3 · 5', ['5 · 9', '3 · 15', '3 · 5 · 5']], [28, '2 · 2 · 7', ['4 · 7', '2 · 14', '2 · 7 · 7']],
];
const gPrimfaktor = () => {
  const [n, good, wrongs] = pick(PRIMFAKTOR);
  return mc(`Welche ist die **Primfaktorzerlegung** von ${n}?`, good, wrongs, { why: `In einer Primfaktorzerlegung stehen **nur Primzahlen** – und das Produkt muss ${n} ergeben: ${good} = ${n}.` });
};

// ---------- 2. Brüche verstehen ----------

const gPie = () => {
  const d = pick([2, 3, 4, 5, 6, 8, 10]);
  const n = rnd(1, d - 1);
  return mc('Welcher Anteil ist gefärbt?', F(n, d), [F(d - n, d), F(n, d + 1), F(d, n), F(n + 1, d + 1), F(n, d - 1 || 9)].filter((w) => w !== F(n, d) && !/\/0\}/.test(w)), {
    fig: Math.random() < 0.5 ? pie(n, d) : bar(n, d),
    why: `Das Ganze ist in **${d}** gleich große Teile geteilt (Nenner). **${n}** davon ${n === 1 ? 'ist' : 'sind'} gefärbt (Zähler).`,
  });
};

const gAnteil = () => {
  const d = rnd(2, 8);
  const n = rnd(1, d - 1);
  const x = d * rnd(2, 9);
  const thing = pick(['Gummibärchen', 'Kindern', 'Stickern', 'Minuten', 'Euro', 'Äpfeln']);
  return { t: 'num', q: `Wie viel sind ${F(n, d)} von ${x} ${thing}?`, c: `${(x / d) * n}`, why: `Erst durch den Nenner teilen: ${x} : ${d} = ${x / d}. Dann mit dem Zähler malnehmen: ${x / d} · ${n} = ${(x / d) * n}.` };
};

const BRUCH_BEGRIFFE = [
  { t: 'mc', q: 'Wie heißt die Zahl **unter** dem Bruchstrich?', a: ['Nenner', 'Zähler', 'Teiler', 'Quotient'], c: 0, why: 'Der **Nenner** „benennt“, in wie viele Teile das Ganze geteilt wird. Der Zähler zählt, wie viele Teile man nimmt.' },
  { t: 'mc', q: 'Was gibt der **Zähler** an?', a: ['Wie viele Teile man nimmt', 'In wie viele Teile geteilt wird', 'Wie groß das Ganze ist', 'Wie oft man kürzen kann'], c: 0, why: 'Der Zähler **zählt** die Teile. Der Nenner sagt, in wie viele Teile das Ganze geteilt ist.' },
  { t: 'tf', q: 'Ein Bruch, bei dem der Zähler größer ist als der Nenner, ist größer als 1.', c: true, why: 'Zum Beispiel {5/4}: Das sind vier Viertel (ein Ganzes) und noch ein Viertel dazu.' },
  { t: 'tf', q: 'Beim Erweitern wird der Bruch größer.', c: false, why: 'Der **Wert bleibt gleich** – nur die Stücke werden kleiner und dafür mehr. {1/2} = {2/4} = {4/8}.' },
  { t: 'scramble', q: 'Wie heißt die Zahl über dem Bruchstrich?', c: 'ZÄHLER' },
  { t: 'mc', q: 'Welcher Bruch ist ein **Stammbruch**?', a: ['{1/7}', '{7/1}', '{3/7}', '{7/7}'], c: 0, why: 'Stammbrüche haben den Zähler 1: {1/2}, {1/3}, {1/4} …' },
];
const gBruchBegriff = () => ({ ...pick(BRUCH_BEGRIFFE) });

const gErweitern = () => {
  const b = rnd(2, 9);
  const a = coprime(1, b - 1, b);
  const k = rnd(2, 6);
  return { t: 'num', q: `Erweitere ${F(a, b)} mit **${k}**.`, c: `${a * k}/${b * k}`, exact: true, formHint: `Der Wert stimmt – aber erweitere genau mit ${k}.`, why: `Zähler **und** Nenner mit ${k} malnehmen: ${a} · ${k} = ${a * k} und ${b} · ${k} = ${b * k}.` };
};

const gFehlend = () => {
  const b = rnd(2, 8);
  const a = coprime(1, b - 1, b);
  const k = rnd(2, 6);
  return { t: 'num', q: `Welche Zahl gehört in das Kästchen?\n${F(a, b)} = {□/${b * k}}`, c: `${a * k}`, why: `Der Nenner wurde mit ${k} malgenommen (${b} · ${k} = ${b * k}). Also auch den Zähler mal ${k}: ${a} · ${k} = ${a * k}.` };
};

const gKuerzen = () => {
  const b = rnd(2, 12);
  const a = coprime(1, b - 1, b);
  const k = rnd(2, 9);
  return { t: 'num', q: `Kürze ${F(a * k, b * k)} **vollständig**.`, c: `${a}/${b}`, exact: true, why: `Zähler und Nenner durch ${k} teilen: ${a * k} : ${k} = ${a} und ${b * k} : ${k} = ${b}.` };
};

const gVergleich = () => {
  let a; let b; let c; let d;
  const mode = rnd(1, 4);
  if (mode === 1) { b = d = rnd(3, 12); a = rnd(1, b - 1); do c = rnd(1, b - 1); while (c === a); } // gleicher Nenner
  else if (mode === 2) { a = c = rnd(1, 5); b = rnd(a + 1, 11); do d = rnd(a + 1, 12); while (d === b); } // gleicher Zähler
  else if (mode === 3) { b = rnd(2, 6); a = rnd(1, b - 1); const k = rnd(2, 4); c = a * k; d = b * k; } // gleichwertig
  else { [b, d] = pick([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 5], [5, 6], [3, 8]]); a = rnd(1, b - 1); c = rnd(1, d - 1); }
  const s = signOf(a / b, c / d);
  let why;
  if (s === 1) why = `Beide sind gleich viel wert: ${F(c, d)} lässt sich zu ${Fr(c, d)} kürzen${fr(a, b) === `${a}/${b}` ? '' : `, ${F(a, b)} auch`}.`;
  else if (b === d) why = 'Gleiche Nenner: Der Bruch mit dem größeren **Zähler** ist größer.';
  else if (a === c) why = 'Gleiche Zähler: Je größer der **Nenner**, desto kleiner die Stücke – also ist der Bruch kleiner.';
  else why = `Auf den gleichen Nenner bringen: ${F(a, b)} = ${F(a * (lcm(b, d) / b), lcm(b, d))} und ${F(c, d)} = ${F(c * (lcm(b, d) / d), lcm(b, d))}.`;
  return { t: 'mc', q: `Welches Zeichen passt?\n${F(a, b)}  □  ${F(c, d)}`, a: SIGNS, c: s, fixed: true, why };
};

const gZuUnecht = () => {
  const d = rnd(2, 8);
  const n = coprime(1, d - 1, d);
  const w = rnd(1, 5);
  return { t: 'num', q: `Schreibe {${w} ${n}/${d}} als **unechten Bruch**.`, c: `${w * d + n}/${d}`, exact: true, formHint: 'Der Wert stimmt – aber schreibe ihn als einen einzigen Bruch.', why: `${w} ${w === 1 ? "Ganzes ist" : "Ganze sind"} ${F(w * d, d)} (denn ${w} · ${d} = ${w * d}). Dazu kommen ${F(n, d)} – zusammen ${F(w * d + n, d)}.` };
};

const gZuGemischt = () => {
  const d = rnd(2, 8);
  const n = coprime(1, d - 1, d);
  const w = rnd(1, 5);
  return { t: 'num', q: `Schreibe ${F(w * d + n, d)} als **gemischte Zahl**.`, c: `${w} ${n}/${d}`, exact: true, formHint: 'Der Wert stimmt! Schreibe ihn als gemischte Zahl: erst die Ganzen, dann „Leer“, dann den Bruch.', why: `${w * d + n} : ${d} = ${w} Rest ${n}. Also ${w} Ganze und ${F(n, d)}.` };
};

const gOrdnen = () => {
  const d = pick([12, 20, 24]);
  const set = new Set();
  while (set.size < 4) set.add(rnd(1, d - 1));
  const nums = [...set].sort((x, y) => x - y);
  return { t: 'order', q: 'Ordne die Brüche von **klein nach groß**.', items: nums.map((n) => Fr(n, d)), why: `Trick: alle auf den Nenner ${d} bringen – dann sind es ${nums.map((n) => F(n, d)).join(' < ')}.` };
};

// ---------- 3. Dezimalzahlen & Prozent ----------

// [Zähler, Nenner, Dezimalzahl, Prozent]
const TABLE = [[1, 2, '0,5', 50], [1, 4, '0,25', 25], [3, 4, '0,75', 75], [1, 5, '0,2', 20], [2, 5, '0,4', 40], [3, 5, '0,6', 60], [4, 5, '0,8', 80],
  [1, 10, '0,1', 10], [3, 10, '0,3', 30], [7, 10, '0,7', 70], [9, 10, '0,9', 90], [1, 20, '0,05', 5], [1, 100, '0,01', 1], [1, 25, '0,04', 4], [1, 8, '0,125', 12.5]];

const gBruchZuDez = () => {
  const [n, d, x] = pick(TABLE);
  const k = 100 / d;
  return { t: 'num', q: `Schreibe ${F(n, d)} als **Dezimalzahl**.`, c: x, why: d === 8 ? '1 : 8 = 0,125. Den merkt man sich am besten!' : Number.isInteger(k) && d !== 100 && d !== 10 ? `Auf Hundertstel erweitern: ${F(n, d)} = ${F(n * k, 100)} = ${x}.` : `${n} ${d === 10 ? 'Zehntel' : 'Hundertstel'} = ${x}.` };
};

const gDezZuBruch = () => {
  const [n, d, x] = pick(TABLE.filter((r) => r[1] !== 8));
  return { t: 'num', q: `Schreibe **${x}** als vollständig gekürzten Bruch.`, c: `${n}/${d}`, exact: true, why: `${x} = ${x.length === 3 ? F(Number(x.slice(2)), 10) : F(Number(x.slice(2)), 100)}${d === 10 || d === 100 ? '' : ` = ${F(n, d)} (gekürzt)`}.` };
};

const gStellenwert = () => {
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const names = ['Einer', 'Zehntel', 'Hundertstel', 'Tausendstel'];
  const i = rnd(0, 3);
  return { t: 'mc', q: `Welchen Stellenwert hat die Ziffer **${digits[i]}** in der Zahl ${digits[0]},${digits.slice(1).join('')}?`, a: names, c: i, fixed: true, why: 'Nach dem Komma kommen: **Z**ehntel, **H**undertstel, **T**ausendstel.' };
};

const gDezVergleich = () => {
  const a = rnd(1, 9);
  let b = rnd(1, 99);
  if (Math.random() < 0.25) b = a * 10;
  if (Math.random() < 0.25) b = a; // z. B. 0,3 und 0,03
  const bs = String(b).padStart(2, '0');
  return { t: 'mc', q: `Welches Zeichen passt?\n0,${a}  □  0,${bs}`, a: SIGNS, c: signOf(a * 10, b), fixed: true, why: `Schreibe beide mit gleich vielen Nachkommastellen: 0,${a}0 und 0,${bs}. Dann vergleichst du ${a * 10} und ${b} Hundertstel.` };
};

const gProzentPaare = () => {
  const rows = shuffle(TABLE.filter((r) => Number.isInteger(r[3]))).slice(0, 4);
  const mode = rnd(1, 2);
  return { t: 'match', q: mode === 1 ? 'Welcher Bruch gehört zu welcher Prozentzahl?' : 'Welche Dezimalzahl gehört zu welcher Prozentzahl?', pairs: rows.map(([n, d, x, p]) => [mode === 1 ? F(n, d) : x, `${p} %`]), why: 'Prozent heißt „von Hundert“: 25 % = {25/100} = {1/4} = 0,25.' };
};

const gProzentVon = () => {
  const [p, d] = pick([[10, 10], [20, 5], [25, 4], [50, 2], [5, 20], [75, 4]]);
  const base = rnd(1, 10) * 20;
  const ans = (base * p) / 100;
  const thing = pick(['Euro', 'Kindern', 'Metern', 'Punkten']);
  return { t: 'num', q: `Wie viel sind **${p} %** von ${base} ${thing}?`, c: `${ans}`, why: p === 75 ? `75 % = {3/4}. ${base} : 4 = ${base / 4}, mal 3 = ${ans}.` : `${p} % = ${F(1, d)}. Also ${base} : ${d} = ${ans}.` };
};

const gRunden = () => {
  const n = rnd(1000, 9998);
  if (n % 10 === 5 || n % 100 === 50) return gRunden();
  const s = `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, '0')}`;
  const toTenth = Math.random() < 0.5;
  const res = toTenth ? (Math.round(n / 100) / 10).toFixed(1) : (Math.round(n / 10) / 100).toFixed(2);
  const look = toTenth ? Math.floor(n / 10) % 10 : n % 10;
  return { t: 'num', q: `Runde **${s}** auf ${toTenth ? 'Zehntel' : 'Hundertstel'}.`, c: res.replace('.', ','), why: `Schau auf die Ziffer **rechts daneben**: ${look}. Bei 0–4 wird abgerundet, bei 5–9 aufgerundet → ${res.replace('.', ',')}.` };
};

const gZahlenstrahl = () => {
  const s = rnd(0, 5);
  const k = rnd(1, 9);
  return { t: 'num', q: 'Welche Zahl ist markiert?', c: `${s},${k}`, fig: numLine({ min: s, max: s + 1, labelStep: 1, ticks: 10, mark: s + k / 10 }), why: `Zwischen ${s} und ${s + 1} liegen 10 gleiche Schritte – jeder ist ein Zehntel (0,1). Der Pfeil steht beim ${k}. Strich.` };
};

const gProzentAnteil = () => {
  const total = pick([10, 20, 25, 50]);
  const part = rnd(1, total - 1);
  const [wer, was] = pick([['Kindern', 'kommen mit dem Fahrrad'], ['Losen', 'sind Gewinne'], ['Schüssen', 'treffen ins Tor'], ['Büchern', 'sind Comics']]);
  return { t: 'num', q: `Von ${total} ${wer} ${was}: ${part}.\nWie viel **Prozent** sind das?`, c: `${(part * 100) / total}`, unit: '%', why: `Anteil: ${F(part, total)}. Auf Hundertstel erweitern (mal ${100 / total}): ${F((part * 100) / total, 100)} = ${(part * 100) / total} %.` };
};

// ---------- 4. Brüche addieren & subtrahieren ----------

const gGleichnamig = () => {
  const d = rnd(5, 12);
  const plus = Math.random() < 0.5;
  let a = rnd(1, d - 2);
  let b = rnd(1, d - 1 - a);
  if (!plus) { a = rnd(2, d - 1); b = rnd(1, a - 1); }
  const r = plus ? a + b : a - b;
  return { t: 'num', q: `${F(a, d)} ${plus ? '+' : '−'} ${F(b, d)} = ?`, c: fr(r, d), why: `Gleiche Nenner: nur die **Zähler** ${plus ? 'addieren' : 'subtrahieren'}, der Nenner bleibt. ${a} ${plus ? '+' : '−'} ${b} = ${r}, also ${F(r, d)}${fr(r, d) !== `${r}/${d}` ? ` = ${Fr(r, d)} (gekürzt)` : ''}.` };
};

const DENOMS = [[2, 3], [2, 4], [3, 4], [3, 6], [2, 5], [4, 6], [3, 5], [4, 8], [2, 6], [5, 10], [3, 9], [4, 12], [6, 9], [2, 8]];
const gUngleichnamig = (ops = ['+', '−']) => () => {
  const [b, d] = shuffle(pick(DENOMS));
  const h = lcm(b, d);
  let a = rnd(1, b - 1);
  let c = rnd(1, d - 1);
  const op = pick(ops);
  if (op === '−' && a * d <= c * b) {
    if (a * d === c * b) return gUngleichnamig(ops)();
    return subQ(c, d, a, b, h);
  }
  return op === '−' ? subQ(a, b, c, d, h) : addQ(a, b, c, d, h);
};
function addQ(a, b, c, d, h) {
  const x = a * (h / b); const y = c * (h / d);
  return { t: 'num', q: `${F(a, b)} + ${F(c, d)} = ?`, c: fr(x + y, h), why: `Erst gleichnamig machen (Hauptnenner ${h}): ${F(x, h)} + ${F(y, h)} = ${F(x + y, h)}${fr(x + y, h) !== `${x + y}/${h}` ? ` = ${mixed(x + y, h)}` : x + y > h ? ` = ${mixed(x + y, h)}` : ''}.` };
}
function subQ(a, b, c, d, h) {
  const x = a * (h / b); const y = c * (h / d);
  return { t: 'num', q: `${F(a, b)} − ${F(c, d)} = ?`, c: fr(x - y, h), why: `Erst gleichnamig machen (Hauptnenner ${h}): ${F(x, h)} − ${F(y, h)} = ${F(x - y, h)}${fr(x - y, h) !== `${x - y}/${h}` ? ` = ${Fr(x - y, h)}` : ''}.` };
}

const gGemischtAdd = () => {
  const [b, d] = pick([[2, 4], [2, 3], [3, 6], [4, 8], [2, 6], [3, 4]]);
  const h = lcm(b, d);
  const w1 = rnd(1, 3); const w2 = rnd(1, 3);
  const a = rnd(1, b - 1); const c = rnd(1, d - 1);
  const num = (w1 + w2) * h + a * (h / b) + c * (h / d);
  return { t: 'num', q: `{${w1} ${a}/${b}} + {${w2} ${c}/${d}} = ?`, c: fr(num, h).includes('/') ? `${Math.floor(num / h)} ${fr(num % h, h)}` : fr(num, h), why: `Erst die Ganzen: ${w1} + ${w2} = ${w1 + w2}. Dann die Brüche: ${F(a * (h / b), h)} + ${F(c * (h / d), h)} = ${F(a * (h / b) + c * (h / d), h)}. Zusammen: ${mixed(num, h)}.` };
};

const gDezAdd = () => {
  // eine Zahl mit einer, eine mit zwei Nachkommastellen (in Hundertsteln gerechnet)
  const x10 = rnd(11, 99) * 10;
  const plus = Math.random() < 0.5;
  let y = rnd(11, plus ? 999 : x10 - 1);
  if (y % 10 === 0) y += 3;
  const r = plus ? x10 + y : x10 - y;
  if (r <= 0) return gDezAdd();
  return { t: 'num', q: `${dec(x10 / 100)} ${plus ? '+' : '−'} ${dec(y / 100)} = ?`, c: dec(r / 100), why: `**Komma unter Komma** schreiben und fehlende Stellen mit 0 auffüllen: ${(x10 / 100).toFixed(2).replace('.', ',')} ${plus ? '+' : '−'} ${(y / 100).toFixed(2).replace('.', ',')} = ${dec(r / 100)}.` };
};

const gAddSach = () => {
  const [b, d] = pick([[4, 8], [2, 4], [3, 6], [2, 8], [2, 6], [4, 12], [3, 12]]);
  const h = lcm(b, d);
  const a = 1; const c = rnd(1, Math.max(1, d / 2 - 1));
  const sum = a * (h / b) + c * (h / d);
  const [n1, n2] = pick([['Tim', 'Lea'], ['Elara', 'Flocke'], ['Mia', 'Ben'], ['Paco', 'Elara']]);
  const thing = pick(['einer Pizza', 'eines Kuchens', 'einer Tafel Schokolade']);
  if (Math.random() < 0.5) return { t: 'num', q: `🍕 ${n1} isst ${F(a, b)} ${thing}, ${n2} isst ${F(c, d)}.\nWelcher Anteil wurde **insgesamt** gegessen?`, c: fr(sum, h), why: `${F(a, b)} + ${F(c, d)} = ${F(a * (h / b), h)} + ${F(c * (h / d), h)} = ${Fr(sum, h)}.` };
  return { t: 'num', q: `🍕 ${n1} isst ${F(a, b)} ${thing}, ${n2} isst ${F(c, d)}.\nWelcher Anteil ist **noch übrig**?`, c: fr(h - sum, h), why: `Gegessen: ${F(a * (h / b), h)} + ${F(c * (h / d), h)} = ${F(sum, h)}. Übrig: ${F(h, h)} − ${F(sum, h)} = ${Fr(h - sum, h)}.` };
};

const ADD_FEHLER = [
  { t: 'mc', q: '🐑 Flocke rechnet: {1/2} + {1/3} = {2/5}. Mäh?! Was ist der Fehler?', a: ['Flocke hat Zähler und Nenner einzeln addiert', 'Flocke hat falsch gekürzt', 'Flocke hat nichts falsch gemacht', 'Flocke hätte malnehmen müssen'], c: 0, why: 'Erst gleichnamig machen! {1/2} + {1/3} = {3/6} + {2/6} = {5/6}. Und {2/5} wäre sogar kleiner als {1/2} – das kann nicht stimmen.' },
  { t: 'mc', q: 'Was muss man tun, bevor man {3/4} und {1/6} addieren kann?', a: ['Beide Brüche auf den gleichen Nenner bringen', 'Beide Brüche kürzen', 'Die Nenner addieren', 'Die Brüche umdrehen'], c: 0, why: 'Man kann nur **gleich große Stücke** zusammenzählen. Hauptnenner hier: 12.' },
  { t: 'num', q: 'Welches ist der **kleinste gemeinsame Nenner** (Hauptnenner) von {5/6} und {3/8}?', c: '24', why: 'Der Hauptnenner ist das kgV der Nenner: Vielfache von 8 sind 8, 16, **24** – und 24 ist auch durch 6 teilbar.' },
  { t: 'tf', q: '{1/4} + {1/4} = {2/8}', c: false, why: 'Bei gleichen Nennern bleibt der Nenner! {1/4} + {1/4} = {2/4} = {1/2}.' },
];
const gAddFehler = () => ({ ...pick(ADD_FEHLER) });

// ---------- 5. Brüche mal & geteilt ----------

const gMalZahl = () => {
  const b = rnd(3, 9);
  const a = coprime(1, b - 1, b);
  const k = rnd(2, 6);
  return { t: 'num', q: `${k} · ${F(a, b)} = ?`, c: fr(k * a, b), why: `Nur den **Zähler** mit ${k} malnehmen: ${F(k * a, b)}${fr(k * a, b) !== `${k * a}/${b}` || k * a > b ? ` = ${mixed(k * a, b)}` : ''}.` };
};

const gMalBruch = () => {
  const b = rnd(2, 7); const d = rnd(2, 7);
  const a = coprime(1, b, b); const c = coprime(1, d, d);
  return { t: 'num', q: `${F(a, b)} · ${F(c, d)} = ?`, c: fr(a * c, b * d), why: `**Zähler mal Zähler, Nenner mal Nenner:** ${F(a * c, b * d)}${fr(a * c, b * d) !== `${a * c}/${b * d}` ? ` = ${Fr(a * c, b * d)} (gekürzt)` : ''}.` };
};

const gKehrwert = () => {
  const b = rnd(3, 9);
  const a = coprime(2, b + 3, b);
  return { t: 'num', q: `Wie lautet der **Kehrwert** von ${F(a, b)}?`, c: `${b}/${a}`, exact: true, formHint: 'Der Wert stimmt – aber schreibe einfach Zähler und Nenner vertauscht.', why: 'Kehrwert = Zähler und Nenner vertauschen. Der Bruch macht einen Kopfstand! 🤸' };
};

const gDurchBruch = () => {
  const b = rnd(2, 6); const d = rnd(2, 6);
  const a = coprime(1, b, b); const c = coprime(1, d, d);
  return { t: 'num', q: `${F(a, b)} : ${F(c, d)} = ?`, c: fr(a * d, b * c), why: `Durch einen Bruch teilen heißt: **mit dem Kehrwert malnehmen.** ${F(a, b)} · ${F(d, c)} = ${F(a * d, b * c)}${fr(a * d, b * c) !== `${a * d}/${b * c}` || a * d > b * c ? ` = ${mixed(a * d, b * c)}` : ''}.` };
};

const gDurchZahl = () => {
  const b = rnd(2, 7);
  const a = coprime(1, b, b);
  const k = rnd(2, 5);
  return { t: 'num', q: `${F(a, b)} : ${k} = ?`, c: fr(a, b * k), why: `Den **Nenner** mit ${k} malnehmen – die Stücke werden kleiner: ${F(a, b * k)}${fr(a, b * k) !== `${a}/${b * k}` ? ` = ${Fr(a, b * k)}` : ''}.` };
};

const gKomma = () => {
  let n = rnd(101, 9999);
  if (n % 10 === 0) n += 3;
  const m = pick([10, 100, 1000]);
  const st = String(m).length - 1;
  if (Math.random() < 0.5) return { t: 'num', q: `${dec(n / 100)} · ${m} = ?`, c: dec((n * m) / 100), why: `Mal ${m}: Das Komma wandert **${st} ${st === 1 ? 'Stelle' : 'Stellen'} nach rechts**. Die Zahl wird größer.` };
  return { t: 'num', q: `${dec(n / 100)} : ${m} = ?`, c: dec(n / (100 * m), 6), why: `Geteilt durch ${m}: Das Komma wandert **${st} ${st === 1 ? 'Stelle' : 'Stellen'} nach links**. Fehlende Stellen mit Nullen auffüllen.` };
};

const gDezMal = () => {
  const a = rnd(2, 9); const b = rnd(2, 9);
  if (Math.random() < 0.5) return { t: 'num', q: `0,${a} · 0,${b} = ?`, c: dec((a * b) / 100), why: `Erst ohne Komma: ${a} · ${b} = ${a * b}. Beide Zahlen haben zusammen **2 Nachkommastellen** – das Ergebnis auch: ${dec((a * b) / 100)}.` };
  const x = rnd(11, 49);
  return { t: 'num', q: `${dec(x / 10)} · ${b} = ?`, c: dec((x * b) / 10), why: `Erst ohne Komma: ${x} · ${b} = ${x * b}. Eine Nachkommastelle → ${dec((x * b) / 10)}.` };
};

const gDezDurch = () => {
  const q = rnd(2, 9); const d = rnd(2, 9);
  return { t: 'num', q: `${dec((q * d) / 10)} : 0,${d} = ?`, c: `${q}`, why: `Bei **beiden** Zahlen das Komma um eine Stelle nach rechts schieben: ${q * d} : ${d} = ${q}.` };
};

const gMalSach = () => {
  const k = rnd(2, 4);
  const [a, b] = pick([[3, 4], [1, 2], [2, 3], [1, 4], [3, 8], [2, 5]]);
  const variants = [
    () => ({ t: 'num', q: `🥞 Ein Pfannkuchen-Rezept braucht ${F(a, b)} Liter Milch.\nWie viel Liter braucht man für die **${k}-fache** Menge?`, c: fr(k * a, b), unit: 'l', why: `${k} · ${F(a, b)} = ${F(k * a, b)}${k * a >= b ? ` = ${mixed(k * a, b)}` : ''} Liter.` }),
    () => ({ t: 'num', q: `🍫 Von einer Tafel Schokolade ist noch ${F(a, b)} übrig. Elara isst davon **die Hälfte**.\nWelchen Anteil der ganzen Tafel isst sie?`, c: fr(a, b * 2), why: `„Die Hälfte von“ heißt mal {1/2}: {1/2} · ${F(a, b)} = ${Fr(a, 2 * b)}.` }),
    () => ({ t: 'num', q: `🧃 In einer Kanne sind ${k} Liter Saft. In jedes Glas passt {1/${b}} Liter.\nWie viele Gläser kann man füllen?`, c: `${k * b}`, why: `${k} : {1/${b}} = ${k} · ${b} = ${k * b} Gläser.` }),
  ];
  return pick(variants)();
};

const MAL_WISSEN = [
  { t: 'mc', q: 'Du multiplizierst 20 mit einem Bruch, der **kleiner als 1** ist. Das Ergebnis ist …', a: ['kleiner als 20', 'größer als 20', 'genau 20', 'immer 1'], c: 0, why: 'Mal {1/2} heißt „die Hälfte von“. Malnehmen macht also nicht immer größer!' },
  { t: 'mc', q: 'Du teilst 6 durch {1/2}. Das Ergebnis ist …', a: ['12', '3', '6', '{1/12}'], c: 0, why: 'Wie oft passt ein Halbes in 6 Ganze? 12-mal! 6 : {1/2} = 6 · 2 = 12.' },
  { t: 'tf', q: 'Beim Multiplizieren von Brüchen muss man die Brüche zuerst gleichnamig machen.', c: false, why: 'Das braucht man nur bei Plus und Minus. Beim Malnehmen einfach: Zähler mal Zähler, Nenner mal Nenner.' },
  { t: 'mc', q: 'Welcher Rechentrick spart Arbeit bei {4/9} · {3/8}?', a: ['Vor dem Rechnen über Kreuz kürzen', 'Erst gleichnamig machen', 'Beide Kehrwerte bilden', 'Die Nenner addieren'], c: 0, why: '4 und 8 kürzen (durch 4), 3 und 9 kürzen (durch 3): {1/3} · {1/2} = {1/6}.' },
];
const gMalWissen = () => ({ ...pick(MAL_WISSEN) });

// ---------- 6. Winkel & Kreis ----------

const KINDS = ['spitzer Winkel', 'rechter Winkel', 'stumpfer Winkel', 'gestreckter Winkel', 'überstumpfer Winkel'];
const kindOf = (deg) => (deg < 90 ? 0 : deg === 90 ? 1 : deg < 180 ? 2 : deg === 180 ? 3 : 4);
const KIND_WHY = 'spitz: kleiner als 90° · recht: genau 90° · stumpf: zwischen 90° und 180° · gestreckt: genau 180° · überstumpf: größer als 180°';
const degOfKind = (k) => [rnd(4, 15) * 5, 90, rnd(21, 33) * 5, 180, rnd(40, 66) * 5][k];

const gWinkelArtBild = () => {
  const deg = degOfKind(rnd(0, 4));
  return { t: 'mc', q: 'Welche Winkelart ist das?', a: KINDS, c: kindOf(deg), fixed: true, fig: angle(deg, pick([0, 0, 20, 45, 90, 200])), why: `Der Winkel ist ${deg}° groß.\n${KIND_WHY}` };
};

const gWinkelArtZahl = () => {
  const deg = degOfKind(rnd(0, 4));
  return { t: 'mc', q: `Ein Winkel ist **${deg}°** groß. Welche Winkelart ist das?`, a: KINDS, c: kindOf(deg), fixed: true, why: KIND_WHY };
};

const gSchaetzen = () => {
  const deg = rnd(6, 32) * 5;
  const cand = [deg, deg + 40, deg - 40, deg + 80, deg - 80, deg + 120].filter((x) => x >= 10 && x <= 180);
  const opts = [deg, ...shuffle(cand.slice(1)).slice(0, 3)].sort((x, y) => x - y);
  return { t: 'mc', q: 'Schätze: Wie groß ist dieser Winkel ungefähr?', a: opts.map((x) => `${x}°`), c: opts.indexOf(deg), fixed: true, fig: angle(deg, pick([0, 10, 30, 90])), why: `Es sind ${deg}°. Schätz-Trick: Vergleiche mit dem rechten Winkel (90°) – ist er kleiner, ungefähr gleich oder größer?` };
};

const gUhr = () => {
  const h = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const steps = Math.min(h, 12 - h);
  return { t: 'num', q: `Es ist **${h} Uhr**. Wie groß ist der (kleinere) Winkel zwischen den Zeigern?`, c: `${steps * 30}`, unit: '°', fig: clock(h), why: `Der volle Kreis hat 360°. Von einer Zahl zur nächsten sind es 360° : 12 = **30°**. Zwischen den Zeigern liegen ${steps} Schritte: ${steps} · 30° = ${steps * 30}°.` };
};

const gDrehung = () => {
  const [name, deg] = pick([['Vierteldrehung', 90], ['halben Drehung', 180], ['Dreivierteldrehung', 270], ['ganzen Drehung', 360], ['Achteldrehung', 45], ['Sechsteldrehung', 60], ['Dritteldrehung', 120]]);
  return { t: 'num', q: `🛹 Wie groß ist der Winkel bei einer **${name}**?`, c: `${deg}`, unit: '°', why: `Eine ganze Drehung hat 360°. ${deg === 360 ? '' : `360° · ${Fr(deg, 360)} = ${deg}°.`}` };
};

const gKreisMass = () => {
  const r = rnd(2, 15);
  return Math.random() < 0.5
    ? { t: 'num', q: `Ein Kreis hat den **Radius** ${r} cm. Wie groß ist sein Durchmesser?`, c: `${2 * r}`, unit: 'cm', why: 'Durchmesser = 2 · Radius. Der Durchmesser geht einmal quer durch den Mittelpunkt.' }
    : { t: 'num', q: `Ein Kreis hat den **Durchmesser** ${2 * r} cm. Wie groß ist sein Radius?`, c: `${r}`, unit: 'cm', why: 'Radius = Durchmesser : 2. Der Radius reicht vom Mittelpunkt bis zum Rand.' };
};

const WINKEL_WISSEN = [
  { t: 'mc', q: 'Wie heißt der Punkt, an dem sich die beiden Schenkel eines Winkels treffen?', a: ['Scheitel', 'Mittelpunkt', 'Radius', 'Ursprung'], c: 0, why: 'Ein Winkel hat einen **Scheitel** (die Spitze) und zwei **Schenkel** (die Strahlen).' },
  { t: 'mc', q: 'Mit welchem Werkzeug misst man Winkel?', a: ['Geodreieck', 'Zirkel', 'Lineal', 'Taschenrechner'], c: 0, why: 'Das Geodreieck hat eine Winkelskala. Die Null in der Mitte der langen Seite kommt genau auf den Scheitel.' },
  { t: 'mc', q: 'Wie heißt die Strecke vom Mittelpunkt eines Kreises zum Kreisrand?', a: ['Radius', 'Durchmesser', 'Sehne', 'Umfang'], c: 0, why: 'Radius = vom Mittelpunkt zum Rand. Durchmesser = einmal ganz durch.' },
  { t: 'scramble', q: 'Mit diesem Werkzeug zeichnest du Kreise:', c: 'ZIRKEL' },
  { t: 'scramble', q: 'So heißt die Spitze eines Winkels:', c: 'SCHEITEL' },
  { t: 'order', q: 'Ordne die Winkelarten von **klein nach groß**.', items: ['spitzer Winkel', 'rechter Winkel', 'stumpfer Winkel', 'gestreckter Winkel', 'überstumpfer Winkel'], why: KIND_WHY },
  { t: 'tf', q: 'Wenn man die Schenkel eines Winkels länger zeichnet, wird der Winkel größer.', c: false, why: 'Die Größe eines Winkels hängt nur von der **Öffnung** ab – nicht davon, wie lang die Schenkel gezeichnet sind.' },
  { t: 'mc', q: 'Mit welchen griechischen Buchstaben bezeichnet man Winkel?', a: ['α, β, γ', 'a, b, c', 'A, B, C', 'x, y, z'], c: 0, why: 'Alpha (α), Beta (β), Gamma (γ) – so heißen Winkel in der Geometrie.' },
];
const gWinkelWissen = () => ({ ...pick(WINKEL_WISSEN) });

const gKreisdiagramm = () => {
  const p = pick([5, 10, 20, 25, 30, 40, 50, 75]);
  return { t: 'num', q: `📊 In einem Kreisdiagramm gehören **${p} %** zu „Fußball“.\nWie groß ist der Winkel dieses Kreisteils?`, c: `${p * 3.6}`, unit: '°', why: `Der ganze Kreis (100 %) hat 360°. 1 % sind 3,6°. Also ${p} · 3,6° = ${p * 3.6}°.` };
};

const gErgaenzen = () => {
  const [name, sum] = pick([['gestreckten Winkel', 180], ['rechten Winkel', 90], ['Vollwinkel', 360]]);
  const a = rnd(2, sum / 5 - 2) * 5;
  return { t: 'num', q: `Zwei Winkel ergeben zusammen einen **${name}**. Der eine ist ${a}° groß.\nWie groß ist der andere?`, c: `${sum - a}`, unit: '°', why: `Ein ${name.replace('en ', 'er ')} hat ${sum}°. ${sum}° − ${a}° = ${sum - a}°.` };
};

// ---------- 7. Flächen & Rauminhalt ----------

const gRechteck = () => {
  const a = rnd(3, 12); const b = rnd(2, 9);
  return Math.random() < 0.6
    ? { t: 'num', q: 'Berechne den **Flächeninhalt** des Rechtecks.', c: `${a * b}`, unit: 'cm²', fig: rectFig(a, b), why: `A = Länge · Breite = ${a} cm · ${b} cm = ${a * b} cm².` }
    : { t: 'num', q: 'Berechne den **Umfang** des Rechtecks.', c: `${2 * (a + b)}`, unit: 'cm', fig: rectFig(a, b), why: `Einmal außen herum: u = 2 · ${a} cm + 2 · ${b} cm = ${2 * (a + b)} cm.` };
};

const gPara = () => {
  const g = rnd(3, 12); const h = rnd(2, 9);
  return { t: 'num', q: 'Berechne den Flächeninhalt des **Parallelogramms**.', c: `${g * h}`, unit: 'cm²', fig: paraFig(g, h), why: `A = g · h = ${g} cm · ${h} cm = ${g * h} cm². (Schneide links ein Dreieck ab und setze es rechts an – dann hast du ein Rechteck!)` };
};

const gDreieck = () => {
  const g = rnd(2, 8) * 2; const h = rnd(3, 11);
  return { t: 'num', q: 'Berechne den Flächeninhalt des **Dreiecks**.', c: `${(g * h) / 2}`, unit: 'cm²', fig: triFig(g, h), why: `A = g · h : 2 = ${g} cm · ${h} cm : 2 = ${(g * h) / 2} cm². Ein Dreieck ist ein halbes Parallelogramm.` };
};

const UNITS = [['m²', 'dm²', 100], ['dm²', 'cm²', 100], ['cm²', 'mm²', 100], ['m³', 'dm³', 1000], ['dm³', 'cm³', 1000], ['l', 'ml', 1000], ['cm³', 'mm³', 1000]];
const gEinheiten = () => {
  const [big, small, f] = pick(UNITS);
  const k = pick([1, 2, 3, 5, 7, 12, 0.5, 1.5, 2.5]);
  if (Math.random() < 0.6) return { t: 'num', q: `Rechne um: **${dec(k)} ${big}** = ? ${small}`, c: dec(k * f), unit: small, why: `1 ${big} = ${f} ${small}. Also mal ${f}.` };
  const n = pick([2, 3, 4, 6, 8, 15]) * f;
  return { t: 'num', q: `Rechne um: **${n} ${small}** = ? ${big}`, c: `${n / f}`, unit: big, why: `${f} ${small} = 1 ${big}. Also geteilt durch ${f}.` };
};

const gQuader = () => {
  const a = rnd(2, 8); const b = rnd(2, 6); const c = rnd(2, 6);
  return { t: 'num', q: 'Berechne das **Volumen** (den Rauminhalt) des Quaders.', c: `${a * b * c}`, unit: 'cm³', fig: boxFig(a, b, c), why: `V = Länge · Breite · Höhe = ${a} · ${b} · ${c} = ${a * b * c} cm³.` };
};

const gWuerfel = () => {
  const a = rnd(2, 6);
  return Math.random() < 0.5
    ? { t: 'num', q: `🎲 Ein Würfel hat die Kantenlänge ${a} cm. Wie groß ist sein **Volumen**?`, c: `${a ** 3}`, unit: 'cm³', why: `V = a · a · a = ${a} · ${a} · ${a} = ${a ** 3} cm³.` }
    : { t: 'num', q: `🎲 Ein Würfel hat die Kantenlänge ${a} cm. Wie groß ist seine **Oberfläche**?`, c: `${6 * a * a}`, unit: 'cm²', why: `Ein Würfel hat 6 gleiche Quadrate: 6 · ${a} · ${a} = ${6 * a * a} cm².` };
};

const gLiter = () => {
  const a = rnd(3, 8); const b = rnd(2, 5); const c = rnd(2, 5);
  return { t: 'num', q: `🐠 Ein Aquarium ist ${a * 10} cm lang, ${b * 10} cm breit und ${c * 10} cm hoch.\nWie viele **Liter** Wasser passen hinein?`, c: `${a * b * c}`, unit: 'l', why: `Trick: in Dezimeter rechnen, denn 1 dm³ = 1 Liter. ${a} dm · ${b} dm · ${c} dm = ${a * b * c} dm³ = ${a * b * c} l.` };
};

const gRueck = () => {
  const a = rnd(3, 12); const b = rnd(2, 9);
  return { t: 'num', q: `Ein Rechteck hat den Flächeninhalt ${a * b} cm² und ist ${b} cm breit.\nWie **lang** ist es?`, c: `${a}`, unit: 'cm', why: `Umkehraufgabe: ${a * b} cm² : ${b} cm = ${a} cm.` };
};

const gZusammen = () => {
  const a = rnd(3, 6); const b = rnd(3, 5); const c = rnd(2, 3); const d = rnd(2, 3);
  return { t: 'num', q: `🏠 Ein Zimmer besteht aus zwei Rechtecken:\n${a} m × ${b} m und ${c} m × ${d} m.\nWie groß ist die **gesamte Fläche**?`, c: `${a * b + c * d}`, unit: 'm²', why: `Zerlegen und einzeln rechnen: ${a} · ${b} = ${a * b} m² und ${c} · ${d} = ${c * d} m². Zusammen ${a * b + c * d} m².` };
};

const FLAECHEN_WISSEN = [
  { t: 'mc', q: 'Mit welcher Formel berechnest du den Flächeninhalt eines **Dreiecks**?', a: ['A = g · h : 2', 'A = g · h', 'A = a + b + c', 'A = 2 · g · h'], c: 0, why: 'Ein Dreieck ist genau die Hälfte eines Parallelogramms mit gleicher Grundseite und Höhe.' },
  { t: 'mc', q: 'Mit welcher Formel berechnest du den Flächeninhalt eines **Parallelogramms**?', a: ['A = g · h', 'A = g · h : 2', 'A = 2 · g + 2 · h', 'A = g + h'], c: 0, why: 'Grundseite mal Höhe. Die Höhe steht **senkrecht** auf der Grundseite – sie ist nicht die schräge Seite!' },
  { t: 'sort', q: 'Zu welcher Größe gehört die Einheit?', cats: ['Länge', 'Fläche', 'Volumen'], items: [['cm', 0], ['m²', 1], ['dm³', 2], ['km', 0], ['Liter', 2], ['cm²', 1]], why: 'Hoch 2 → Fläche (zwei Richtungen). Hoch 3 → Raum (drei Richtungen). Liter ist dasselbe wie dm³.' },
  { t: 'mc', q: 'Wie viele Liter sind 1 m³?', a: ['1000', '100', '10', '1'], c: 0, why: '1 m³ = 1000 dm³ = 1000 Liter. Das ist ungefähr so viel wie 7 volle Badewannen! 🛁' },
  { t: 'tf', q: 'Die Höhe eines Parallelogramms ist immer genauso lang wie die schräge Seite.', c: false, why: 'Die Höhe steht senkrecht auf der Grundseite. Sie ist (außer beim Rechteck) kürzer als die schräge Seite.' },
  { t: 'match', q: 'Welche Umrechnung passt?', pairs: [['1 m²', '100 dm²'], ['1 dm³', '1 Liter'], ['1 cm²', '100 mm²'], ['1 m³', '1000 dm³']], why: 'Flächen: Umrechnungszahl 100. Volumen: Umrechnungszahl 1000.' },
];
const gFlaechenWissen = () => ({ ...pick(FLAECHEN_WISSEN) });

// ---------- 8. Negative Zahlen ----------

const gNegStrahl = () => {
  const m = rnd(-9, 9);
  if (m === 0) return gNegStrahl();
  return { t: 'num', q: 'Welche Zahl ist markiert?', c: `${m}`, fig: numLine({ min: -10, max: 10, labelStep: 5, ticks: 5, mark: m }), why: 'Links von der Null stehen die negativen Zahlen. Jeder kleine Strich ist ein Schritt von 1.' };
};

const gNegVergleich = () => {
  const a = rnd(-20, 20);
  let b = rnd(-20, 5);
  if (Math.random() < 0.15) b = a;
  return { t: 'mc', q: `Welches Zeichen passt?\n${neg(a)}  □  ${neg(b)}`, a: SIGNS, c: signOf(a, b), fixed: true, why: 'Auf der Zahlengeraden gilt: Was **weiter links** liegt, ist kleiner. Also ist z. B. −8 kleiner als −3.' };
};

const gNegOrdnen = () => {
  const set = new Set();
  while (set.size < 5) set.add(rnd(-15, 12));
  const nums = [...set].sort((x, y) => x - y);
  if (nums[0] >= 0) return gNegOrdnen();
  return { t: 'order', q: 'Ordne von **klein nach groß**.', items: nums.map(neg), why: 'Stell dir ein Thermometer vor: −15 °C ist kälter (kleiner) als −2 °C.' };
};

const gTemp = () => {
  const a = rnd(-9, 6);
  const d = rnd(3, 12);
  const warmer = Math.random() < 0.5;
  const r = warmer ? a + d : a - d;
  return { t: 'num', q: `🌡️ Am Morgen sind es **${neg(a)} °C**. Dann wird es **${d} Grad ${warmer ? 'wärmer' : 'kälter'}**.\nWie viel Grad sind es jetzt?`, c: `${r}`, unit: '°C', why: `${warmer ? 'Wärmer: auf dem Thermometer nach oben' : 'Kälter: auf dem Thermometer nach unten'}. ${par(a)} ${warmer ? '+' : '−'} ${d} = ${neg(r)}.` };
};

const gTempDiff = () => {
  const a = rnd(-12, -1);
  const b = rnd(1, 15);
  return { t: 'num', q: `🌡️ Nachts sind es ${neg(a)} °C, mittags ${b} °C.\nWie groß ist der **Temperaturunterschied**?`, c: `${b - a}`, unit: 'Grad', why: `Von ${neg(a)} bis 0 sind es ${-a} Grad, von 0 bis ${b} noch einmal ${b}. Zusammen ${b - a} Grad.` };
};

const gNegAdd = (hard) => () => {
  const a = rnd(-12, 12);
  const b = rnd(1, 12);
  const m = hard ? rnd(3, 5) : rnd(1, 3);
  let q; let r; let why;
  if (m === 1) { q = `${par(a)} + ${b}`; r = a + b; why = `Plus: ${b} Schritte nach **rechts** auf der Zahlengeraden.`; }
  else if (m === 2) { q = `${par(a)} − ${b}`; r = a - b; why = `Minus: ${b} Schritte nach **links** auf der Zahlengeraden.`; }
  else if (m === 3) { q = `${rnd(1, 9)} − ${b + 9}`; const x = Number(q.split(' ')[0]); r = x - (b + 9); why = `Du gehst über die Null hinaus: erst ${x} Schritte bis zur 0, dann noch ${b + 9 - x} weiter nach links.`; }
  else if (m === 4) { q = `${par(a)} + (−${b})`; r = a - b; why = `Eine negative Zahl addieren ist dasselbe wie subtrahieren: ${par(a)} − ${b} = ${neg(a - b)}. (Schulden dazubekommen macht ärmer!)`; }
  else { q = `${par(a)} − (−${b})`; r = a + b; why = `Eine negative Zahl subtrahieren ist dasselbe wie addieren: ${par(a)} + ${b} = ${neg(a + b)}. (Schulden wegnehmen macht reicher!)`; }
  return { t: 'num', q: `${q} = ?`, c: `${r}`, why };
};

const gBetrag = () => {
  const a = rnd(1, 30);
  const variants = [
    { t: 'num', q: `Wie groß ist der **Betrag** von −${a}?`, c: `${a}`, why: `Der Betrag ist der Abstand zur Null – und Abstände sind nie negativ. |−${a}| = ${a}.` },
    { t: 'num', q: `Wie lautet die **Gegenzahl** von ${a}?`, c: `${-a}`, why: 'Die Gegenzahl liegt auf der anderen Seite der Null – genauso weit weg.' },
    { t: 'num', q: `Wie lautet die **Gegenzahl** von −${a}?`, c: `${a}`, why: 'Die Gegenzahl liegt auf der anderen Seite der Null – genauso weit weg.' },
  ];
  return pick(variants);
};

const gKonto = () => {
  const a = -rnd(1, 8) * 10;
  const b = rnd(2, 12) * 10;
  return Math.random() < 0.5
    ? { t: 'num', q: `💶 Kontostand: **${neg(a)} €**. Es werden ${b} € eingezahlt.\nWie ist der neue Kontostand?`, c: `${a + b}`, unit: '€', why: `${par(a)} + ${b} = ${neg(a + b)}. Negativer Kontostand heißt: Schulden.` }
    : { t: 'num', q: `💶 Kontostand: **${b} €**. Es werden ${b - a} € abgebucht.\nWie ist der neue Kontostand?`, c: `${a}`, unit: '€', why: `${b} − ${b - a} = ${neg(a)}. Das Konto ist jetzt im Minus.` };
};

const NEG_WISSEN = [
  { t: 'tf', q: '−20 ist größer als −5.', c: false, why: '−20 liegt auf der Zahlengeraden weiter links – also ist −20 **kleiner**. (20 € Schulden sind schlechter als 5 € Schulden.)' },
  { t: 'mc', q: 'Welche Zahl ist weder positiv noch negativ?', a: ['0', '1', '−1', '{1/2}'], c: 0, why: 'Die Null ist die Grenze zwischen positiven und negativen Zahlen.' },
  { t: 'sort', q: 'Wo wird mit negativen Zahlen gerechnet? Was passt?', cats: ['negativ', 'positiv'], items: [['3 Grad unter null', 0], ['50 € Guthaben', 1], ['Tauchtiefe 12 m', 0], ['Berggipfel 2962 m', 1], ['20 € Schulden', 0], ['2. Untergeschoss', 0]], why: 'Alles, was „unter null“ liegt – Kälte, Schulden, Tiefe – beschreibt man mit negativen Zahlen.' },
  { t: 'mc', q: 'Der tiefste Punkt im Meer liegt bei etwa −11 000 m. Der Mount Everest ist etwa 8 849 m hoch. Wie groß ist der Höhenunterschied ungefähr?', a: ['19 849 m', '2 151 m', '11 000 m', '8 849 m'], c: 0, why: 'Von −11 000 bis 0 sind es 11 000 m, dann noch 8 849 m nach oben: zusammen 19 849 m.' },
];
const gNegWissen = () => ({ ...pick(NEG_WISSEN) });

// ---------- 9. Daten & Mittelwert ----------

const CHART_THEMES = [
  ['Lieblingssport der Klasse 6b', ['Fußball', 'Turnen', 'Tennis', 'Reiten', 'Judo'], 'Kinder wählten', 'Welche Sportart ist am beliebtesten?'],
  ['Lieblingstiere', ['Hund', 'Katze', 'Pferd', 'Hase', 'Fisch'], 'Kinder wählten', 'Welches Tier ist am beliebtesten?'],
  ['Schulweg', ['Bus', 'Rad', 'zu Fuß', 'Auto', 'Bahn'], 'Kinder kommen so:', 'Wie kommen die meisten zur Schule?'],
];
const gChart = () => {
  const [title, labels, verb, mostQ] = pick(CHART_THEMES);
  const vals = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, labels.length);
  const fig = `<div class="fig-title">${title}</div>${chart(labels, vals)}`;
  const i = rnd(0, labels.length - 1);
  const m = rnd(1, 4);
  if (m === 1) return { t: 'num', q: `Wie viele ${verb} **${labels[i]}**?`, c: `${vals[i]}`, fig, why: 'Geh von der Säule waagrecht nach links zur Achse und lies den Wert ab.' };
  if (m === 2) return { t: 'mc', q: mostQ, a: labels, c: vals.indexOf(Math.max(...vals)), fixed: true, fig, why: 'Die höchste Säule zeigt den größten Wert.' };
  if (m === 3) return { t: 'num', q: 'Wie viele Kinder wurden **insgesamt** befragt?', c: `${vals.reduce((s, v) => s + v, 0)}`, fig, why: `Alle Säulen addieren: ${vals.join(' + ')} = ${vals.reduce((s, v) => s + v, 0)}.` };
  const j = (i + 1) % labels.length;
  return { t: 'num', q: `Wie groß ist der **Unterschied** zwischen „${labels[i]}“ und „${labels[j]}“?`, c: `${Math.abs(vals[i] - vals[j])}`, fig, why: `${Math.max(vals[i], vals[j])} − ${Math.min(vals[i], vals[j])} = ${Math.abs(vals[i] - vals[j])}.` };
};

const gSpannweite = () => {
  const vals = Array.from({ length: 6 }, () => rnd(3, 30));
  const mx = Math.max(...vals); const mn = Math.min(...vals);
  const m = rnd(1, 3);
  const list = `Weitsprung-Ergebnisse (in dm): **${vals.join(' · ')}**`;
  if (m === 1) return { t: 'num', q: `${list}\nWie groß ist die **Spannweite**?`, c: `${mx - mn}`, why: `Spannweite = Maximum − Minimum = ${mx} − ${mn} = ${mx - mn}.` };
  if (m === 2) return { t: 'num', q: `${list}\nWie groß ist das **Maximum**?`, c: `${mx}`, why: 'Das Maximum ist der größte Wert.' };
  return { t: 'num', q: `${list}\nWie groß ist das **Minimum**?`, c: `${mn}`, why: 'Das Minimum ist der kleinste Wert.' };
};

const gMittel = () => {
  const n = pick([3, 4, 5]);
  const mean = rnd(4, 20);
  const vals = Array.from({ length: n }, () => mean);
  for (let i = 0; i < 4; i++) { // Werte verschieben, die Summe bleibt gleich
    const a = rnd(0, n - 1); const b = rnd(0, n - 1); const d = rnd(1, 3);
    if (a !== b && vals[b] - d > 0) { vals[a] += d; vals[b] -= d; }
  }
  const [was, einheit] = pick([['Tore in den letzten Spielen', 'Tore'], ['Punkte in den Tests', 'Punkte'], ['Temperaturen der Woche (in °C)', 'Grad'], ['Taschengeld der Freunde (in €)', 'Euro']]);
  return { t: 'num', q: `${was}: **${vals.join(' · ')}**\nBerechne den **Mittelwert** (Durchschnitt).`, c: `${mean}`, why: `Alles addieren und durch die Anzahl teilen: ${vals.join(' + ')} = ${mean * n}. Dann ${mean * n} : ${n} = ${mean} ${einheit}.` };
};

const gRelH = () => {
  const total = pick([4, 5, 10, 20, 25, 50]);
  const part = rnd(1, total - 1);
  const [wer, was] = pick([['Kindern', 'haben ein Haustier'], ['Würfen', 'zeigen eine Sechs'], ['Kindern', 'spielen ein Instrument'], ['Autos', 'sind rot']]);
  const head = `Von ${total} ${wer} ${was}: **${part}**.`;
  const m = rnd(1, 3);
  if (m === 1) return { t: 'num', q: `${head}\nGib die **relative Häufigkeit** als vollständig gekürzten Bruch an.`, c: fr(part, total), exact: true, why: `Relative Häufigkeit = Anteil = ${F(part, total)}${fr(part, total) !== `${part}/${total}` ? ` = ${Fr(part, total)}` : ''}.` };
  if (m === 2) return { t: 'num', q: `${head}\nGib die **relative Häufigkeit** in Prozent an.`, c: `${(part * 100) / total}`, unit: '%', why: `${F(part, total)} = ${F((part * 100) / total, 100)} = ${(part * 100) / total} %.` };
  return { t: 'num', q: `${head}\nWie groß ist die **absolute Häufigkeit**?`, c: `${part}`, why: 'Die absolute Häufigkeit ist einfach die **Anzahl** – hier steht sie schon im Text. Die relative Häufigkeit wäre der Anteil.' };
};

const gMittelFehlt = () => {
  const mean = rnd(8, 15);
  const a = mean + rnd(-3, 3); const b = mean + rnd(-3, 3); const c = mean + rnd(-3, 3);
  const x = 4 * mean - a - b - c;
  return { t: 'num', q: `🎯 Lea hat in drei Tests ${a}, ${b} und ${c} Punkte.\nWie viele Punkte braucht sie im **vierten Test**, damit ihr Mittelwert genau ${mean} ist?`, c: `${x}`, why: `Für den Mittelwert ${mean} braucht sie insgesamt 4 · ${mean} = ${4 * mean} Punkte. Sie hat schon ${a + b + c}. Es fehlen ${x}.` };
};

const DATEN_WISSEN = [
  { t: 'mc', q: 'Was ist die **absolute Häufigkeit**?', a: ['Die Anzahl, wie oft etwas vorkommt', 'Der Anteil an allen', 'Der größte Wert', 'Der Durchschnitt'], c: 0, why: 'Absolut = die echte Anzahl (z. B. 7 Kinder). Relativ = der Anteil (z. B. 7 von 28 = {1/4}).' },
  { t: 'tf', q: 'Der Mittelwert muss immer einer der Werte aus der Liste sein.', c: false, why: 'Der Mittelwert von 2 und 5 ist 3,5 – der steht gar nicht in der Liste.' },
  { t: 'mc', q: 'In Klasse 6a treffen 12 von 24 Kindern den Korb, in 6b 10 von 16. Welche Klasse ist **anteilig** besser?', a: ['6b', '6a', 'beide gleich', 'kann man nicht sagen'], c: 0, why: '6a: {12/24} = 50 %. 6b: {10/16} = 62,5 %. Zum Vergleichen braucht man die **relative** Häufigkeit!' },
  { t: 'match', q: 'Welcher Begriff passt zu welcher Erklärung?', pairs: [['Maximum', 'größter Wert'], ['Minimum', 'kleinster Wert'], ['Spannweite', 'größter minus kleinster Wert'], ['Mittelwert', 'Summe geteilt durch Anzahl']] },
  { t: 'mc', q: 'Welches Diagramm zeigt **Anteile an einem Ganzen** am besten?', a: ['Kreisdiagramm', 'Strichliste', 'Zahlenstrahl', 'Tabelle'], c: 0, why: 'Im Kreisdiagramm sieht man sofort: Wie groß ist jedes Stück vom ganzen Kuchen?' },
  { t: 'scramble', q: 'Summe aller Werte geteilt durch die Anzahl – das ist der …', c: 'MITTELWERT' },
];
const gDatenWissen = () => ({ ...pick(DATEN_WISSEN) });

// ======================================================================
// Ergänzungen passend zum Lambacher Schweizer 6 (Baden-Württemberg, G9)
// ======================================================================

const match = (q, pairs, why) => ({ t: 'match', q, pairs, why });

// Bruch mit Vorzeichen anzeigen: {−3/4}
const SF = (n, d) => (n < 0 ? `{-${-n}/${d}}` : `{${n}/${d}}`);
// gekürzt, mit Vorzeichen, als Anzeige
const SFr = (n, d) => {
  const g = gcd(n, d);
  const a = n / g; const b = d / g;
  if (b === 1) return neg(a);
  return SF(a, b);
};
const SFp = (n, d) => (n < 0 ? `(${SF(n, d)})` : SF(n, d));

// ---------- Kapitel I: Rationale Zahlen ----------

const gGanzesAusAnteil = () => {
  const d = rnd(3, 9);
  const n = coprime(1, d - 1, d);
  const k = rnd(2, 6);
  const [ding, verb] = pick([['Trauben', 'sind noch zu sehen'], ['Kugeln', 'nimmt Ben heraus'], ['Schokolinsen', 'hat Leo genommen'], ['Seiten', 'hat Mia schon gelesen']]);
  return { t: 'num', q: `${n * k} ${ding} sind ${F(n, d)} aller ${ding} (${verb}).\nWie viele ${ding} sind es **insgesamt**?`, c: `${d * k}`, why: `Vom Anteil aufs Ganze schließen: ${n * k} ${ding} sind ${F(n, d)}. Dann ist ${F(1, d)} gleich ${n * k} : ${n} = ${k}. Das Ganze sind ${F(d, d)} = ${k} · ${d} = ${d * k}.` };
};

const gQuotient = () => {
  const b = rnd(3, 13);
  const a = coprime(1, b * 2, b);
  const sa = pick([1, -1]); const sb = pick([1, -1]);
  const r = sa * sb;
  const q = `${par(sa * a)} : ${par(sb * b)}`;
  return mc(`Schreibe das Ergebnis als Bruch:\n${q}`, SF(r * a, b), [SF(-r * a, b), SF(r * b, a), SF(-r * b, a)], { why: `Jede Division kann man als Bruch schreiben: Dividend über den Strich, Divisor darunter. Vorzeichen: ${sa === sb ? 'gleiche Vorzeichen → positiv' : 'verschiedene Vorzeichen → negativ'}.` });
};

const MENGEN = [['7', 0], ['0', 0], ['{8/4}', 0], ['-5', 1], ['{-12/3}', 1], ['-1', 1], ['{-1/2}', 2], ['{3/4}', 2], ['0,25', 2], ['{2 2/3}', 2], ['-3,5', 2], ['{15/5}', 0]];
const gZahlenmenge = () => ({
  t: 'sort', q: 'Zu welcher **kleinsten** Zahlenmenge gehört die Zahl?', cats: ['ℕ', 'ℤ', 'ℚ'],
  items: shuffle(MENGEN).slice(0, 5),
  why: '**ℕ** natürliche Zahlen: 0, 1, 2, 3 … · **ℤ** ganze Zahlen: auch −1, −2 … · **ℚ** rationale Zahlen: alle Zahlen, die man als Bruch schreiben kann. Achtung: {8/4} = 2 gehört schon zu ℕ!',
});

const gBruchGerade = () => {
  const d = pick([2, 3, 4, 5]);
  let n;
  do n = rnd(-2 * d + 1, 2 * d - 1); while (n % d === 0);
  return mc('Welcher Bruch ist auf der Zahlengeraden markiert?', SF(n, d), [SF(-n, d), SF(n + (n > 0 ? 1 : -1), d), SF(n, d + 1), SF(n - (n > 0 ? 1 : -1), d)].filter((x) => x !== SF(n, d) && !/\{-?0\//.test(x)), {
    fig: numLine({ min: -2, max: 2, labelStep: 1, ticks: d, mark: n / d }),
    why: `Zwischen zwei ganzen Zahlen sind ${d} gleich große Schritte – jeder ist ${F(1, d)}. Der Pfeil steht ${Math.abs(n)} Schritte ${n < 0 ? '**links**' : 'rechts'} von der 0.`,
  });
};

const gVerhaeltnis = () => {
  const v = rnd(1, 3);
  if (v === 1) {
    const g = rnd(2, 8); const a = rnd(1, 6); let b = rnd(1, 7);
    if (gcd(a, b) !== 1 || a === b) b = a + 1;
    const [x, y, ctx] = pick([['Kinder kommen mit dem Rad', 'mit dem Bus', ''], ['ml Kirschsaft', 'ml Bananensaft', '🍹 '], ['Nieten', 'Gewinne', '🎟️ ']]);
    return mc(`${ctx}${a * g} ${x}, ${b * g} ${y}.\nGib das Verhältnis mit möglichst kleinen Zahlen an.`, `${a} : ${b}`, [`${b} : ${a}`, `${a * g} : ${b * g}`, `${a} : ${a + b}`, `${a + 1} : ${b + 1}`], { why: `${a * g} : ${b * g} – beide Zahlen durch ${g} teilen (kürzen wie bei Brüchen): ${a} : ${b}.` });
  }
  const a = rnd(1, 5); const b = rnd(1, 6);
  if (a === b) return gVerhaeltnis();
  if (v === 2) return { t: 'num', q: `In einer Klasse ist das Verhältnis von Mädchen zu Jungen **${a} : ${b}**.\nWelchen **Anteil** haben die Mädchen an allen Kindern? (als gekürzter Bruch)`, c: fr(a, a + b), exact: true, why: `Die Kinder werden in ${a} + ${b} = ${a + b} gleiche Teile geteilt, die Mädchen haben ${a} davon: ${Fr(a, a + b)}.` };
  const k = rnd(2, 6);
  return { t: 'num', q: `Ein Getränk wird im Verhältnis **${a} : ${b}** aus Saft und Wasser gemischt. Es sollen insgesamt **${(a + b) * k} Gläser** werden.\nWie viele Gläser **Saft** braucht man?`, c: `${a * k}`, why: `${a} + ${b} = ${a + b} Teile. ${(a + b) * k} : ${a + b} = ${k} Gläser pro Teil. Saft: ${a} · ${k} = ${a * k}.` };
};

const GROESSEN = [['g', 'kg', 1000], ['kg', 't', 1000], ['m', 'km', 1000], ['mm', 'm', 1000], ['cm', 'm', 100], ['ct', '€', 100], ['mg', 'g', 1000], ['ml', 'l', 1000]];
const gGroesseKomma = () => {
  const [klein, gross, f] = pick(GROESSEN);
  const n = rnd(f + 1, f * 40);
  if (n % 10 === 0) return gGroesseKomma();
  if (Math.random() < 0.6) return { t: 'num', q: `Schreibe mit Komma:\n**${n} ${klein}** = ? ${gross}`, c: dec(n / f), unit: gross, why: `${f} ${klein} = 1 ${gross}. Also durch ${f} teilen: Das Komma rückt ${String(f).length - 1} Stellen nach links.` };
  const x = rnd(11, 999) / (f === 100 ? 100 : 100);
  return { t: 'num', q: `Rechne um:\n**${dec(x)} ${gross}** = ? ${klein}`, c: dec(x * f), unit: klein, why: `1 ${gross} = ${f} ${klein}. Also mal ${f}: Das Komma rückt ${String(f).length - 1} Stellen nach rechts.` };
};

const I_WISSEN = [
  { t: 'mc', q: 'Wie nennt man Zahlen, die man als Bruch schreiben kann?', a: ['Rationale Zahlen', 'Natürliche Zahlen', 'Primzahlen', 'Quadratzahlen'], c: 0, why: 'Das Zeichen dafür ist ℚ – von „Quotient“.' },
  { t: 'tf', q: 'Jede ganze Zahl ist auch eine rationale Zahl.', c: true, why: 'Zum Beispiel −5 = {-5/1}. ℤ liegt komplett in ℚ.' },
  { t: 'tf', q: '{2/8} und {1/4} stehen an derselben Stelle der Zahlengeraden.', c: true, why: 'Brüche, die durch Kürzen oder Erweitern auseinander hervorgehen, haben denselben Wert.' },
  { t: 'mc', q: 'Was bedeutet das Verhältnis **2 : 3** bei einem Mischgetränk?', a: ['2 Teile der einen Zutat auf 3 Teile der anderen', '2 Liter von jeder Zutat', '{2/3} Liter insgesamt', 'Die Zutaten werden 2- bis 3-mal gemischt'], c: 0, why: 'Insgesamt sind es dann 5 Teile.' },
  { t: 'mc', q: 'Welcher Bruch ist ein **Dezimalbruch** mit dem Wert 0,07?', a: ['{7/100}', '{7/10}', '{7/1000}', '{70/10}'], c: 0, why: 'Die 7 steht an der zweiten Stelle nach dem Komma – Hundertstel.' },
  { t: 'mc', q: 'Welche Zahl liegt genau in der **Mitte** zwischen 3,49 und 3,5?', a: ['3,495', '3,45', '3,4950 und 3,5', '3,49'], c: 0, why: '3,49 = 3,490 und 3,5 = 3,500. In der Mitte liegt 3,495.' },
];
const gIWissen = () => ({ ...pick(I_WISSEN) });

// ---------- Kapitel II: Addieren und subtrahieren ----------

const gNegBruchAdd = () => {
  const d = rnd(3, 9);
  let a; let b;
  do { a = rnd(-2 * d, 2 * d); b = rnd(-2 * d, 2 * d); } while (!a || !b || a % d === 0 && b % d === 0);
  const plus = Math.random() < 0.5;
  const r = plus ? a + b : a - b;
  if (!r) return gNegBruchAdd();
  const other = plus ? a - b : a + b;
  return mc(`${SF(a, d)} ${plus ? '+' : '−'} ${SFp(b, d)} = ?`, SFr(r, d), [SFr(-r, d), other ? SFr(other, d) : SFr(r + 1, d), SFr(r, 2 * d), SFr(r - 1 || 2, d)], {
    why: `Gleicher Nenner – nur die Zähler rechnen: ${neg(a)} ${plus ? '+' : '−'} ${par(b)} = ${neg(r)}. ${plus ? '' : 'Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren. '}Ergebnis: ${SFr(r, d)}.`,
  });
};

const gDezNeg = () => {
  const a = rnd(-99, 99); const b = rnd(5, 99);
  const plus = Math.random() < 0.5;
  const r = plus ? a + b : a - b;
  return { t: 'num', q: `${neg(dec(a / 10))} ${plus ? '+' : '−'} ${dec(b / 10)} = ?`, c: dec(r / 10), why: `Denk an die Zahlengerade: ${plus ? 'Plus → nach rechts' : 'Minus → nach links'}. Ergebnis: ${neg(dec(r / 10))}.` };
};

const gUeberschlagPlus = () => {
  const a = rnd(101, 899) / 10; const b = rnd(101, 899) / 10;
  const s = Math.round(a) + Math.round(b);
  return mc(`Welches Ergebnis passt ungefähr? (Überschlag)\n${dec(a)} + ${dec(b)}`, `etwa ${s}`, [`etwa ${s * 10}`, `etwa ${dec(s / 10)}`, `etwa ${Math.abs(Math.round(a) - Math.round(b)) || s + 20}`], { why: `Runden: ${dec(a)} ≈ ${Math.round(a)} und ${dec(b)} ≈ ${Math.round(b)}. ${Math.round(a)} + ${Math.round(b)} = ${s}. Genau: ${dec(a + b)}.` });
};

const gRechenvorteil = () => {
  const a = rnd(11, 89); const b = rnd(11, 89);
  if (a % 10 === 0) return gRechenvorteil();
  const items = shuffle([dec(a / 10), dec(b / 10), dec((100 - a) / 10)]);
  return { t: 'num', q: `Rechne geschickt:\n${items.join(' + ')}`, c: dec((100 + b) / 10), why: `Vertauschen (Kommutativgesetz) und geschickt zusammenfassen: ${dec(a / 10)} + ${dec((100 - a) / 10)} = 10. Dann 10 + ${dec(b / 10)} = ${dec((100 + b) / 10)}.` };
};

const gGroesseAdd = () => {
  if (Math.random() < 0.5) {
    const kg = rnd(11, 59) / 10; const g = rnd(1, 9) * 50;
    return { t: 'num', q: `🧺 ${dec(kg)} kg Äpfel und ${g} g Birnen.\nWie viel **kg** sind das zusammen?`, c: dec(kg + g / 1000), unit: 'kg', why: `Erst in dieselbe Einheit umrechnen: ${g} g = ${dec(g / 1000)} kg. Dann ${dec(kg)} + ${dec(g / 1000)} = ${dec(kg + g / 1000)} kg.` };
  }
  const m = rnd(11, 99) / 10; const cm = rnd(5, 95);
  return { t: 'num', q: `📏 Ein Brett ist ${dec(m)} m lang. Es werden ${cm} cm abgesägt.\nWie lang ist es jetzt (in **m**)?`, c: dec(m - cm / 100), unit: 'm', why: `${cm} cm = ${dec(cm / 100)} m. ${dec(m)} − ${dec(cm / 100)} = ${dec(m - cm / 100)} m.` };
};

const II_WISSEN = [
  { t: 'mc', q: 'Welches Rechengesetz erlaubt: 2,7 + 5 + 7,3 = 2,7 + 7,3 + 5?', a: ['Vertauschungsgesetz (Kommutativgesetz)', 'Verbindungsgesetz', 'Punkt vor Strich', 'Kürzen'], c: 0, why: 'Bei Plus darf man die Reihenfolge der Summanden vertauschen.' },
  { t: 'tf', q: '−{1/2} − {1/4} = −{3/4}', c: true, why: 'Von −{2/4} aus noch {1/4} nach links: −{3/4}.' },
  { t: 'mc', q: 'Runde 3,456 auf **Hundertstel**.', a: ['3,46', '3,45', '3,5', '3,4'], c: 0, why: 'Die Ziffer rechts daneben ist eine 6 → aufrunden.' },
  { t: 'mc', q: 'Wozu macht man einen **Überschlag**?', a: ['Um zu prüfen, ob ein Ergebnis ungefähr stimmen kann', 'Um genauer zu rechnen', 'Um Brüche zu kürzen', 'Um Zeit zu messen'], c: 0, why: 'Ein Überschlag mit gerundeten Zahlen entlarvt Kommafehler sofort.' },
];
const gIIWissen = () => ({ ...pick(II_WISSEN) });

// ---------- Kapitel III: Winkel (Ergänzung) ----------

const gSektorAnteil = () => {
  const [deg, n, d] = pick([[180, 1, 2], [90, 1, 4], [120, 1, 3], [60, 1, 6], [45, 1, 8], [270, 3, 4], [72, 1, 5], [36, 1, 10], [240, 2, 3]]);
  return mc(`Ein Kreisausschnitt hat den Mittelpunktswinkel **${deg}°**.\nWelcher Anteil des Kreises ist das?`, F(n, d), [F(n, d + 1), F(d - n || 1, d + 2), F(1, Math.round(deg / 10))].filter((x) => x !== F(n, d)), { why: `Der ganze Kreis hat 360°. ${deg}° : 360° = ${F(deg, 360)} = ${F(n, d)}.` });
};

// ---------- Kapitel IV: Multiplizieren und dividieren (Ergänzung) ----------

const gDezDurchGanz = () => {
  const k = rnd(2, 9);
  const x = rnd(11, 299) / 100;
  if (Math.round(x * 100) % 10 === 0) return gDezDurchGanz();
  return { t: 'num', q: `${dec(x * k)} : ${k} = ?`, c: dec(x), why: `Schriftlich dividieren wie gewohnt – sobald du beim Teilen über das Komma kommst, setzt du auch im Ergebnis das Komma. Probe: ${dec(x)} · ${k} = ${dec(x * k)}.` };
};

const gPunktVorStrich = () => {
  const b = pick([2, 3, 4, 5, 6]);
  const k = rnd(2, 5);
  return { t: 'num', q: `${F(1, b)} + ${F(1, b)} · ${k} = ?`, c: fr(1 + k, b), why: `**Punkt vor Strich!** Zuerst ${F(1, b)} · ${k} = ${F(k, b)}, dann ${F(1, b)} + ${F(k, b)} = ${Fr(1 + k, b)}.` };
};

const gUeberschlagMal = () => {
  const a = rnd(2, 9) + rnd(1, 9) / 10; const b = rnd(11, 49) + rnd(1, 9) / 10;
  const s = Math.round(a) * Math.round(b);
  return mc(`Überschlage: Welches Ergebnis kann stimmen?\n${dec(a)} · ${dec(b)}`, dec(a * b, 2), [dec(a * b * 10, 2), dec(a * b / 10, 3), dec(a * b * 100, 1)], { why: `Überschlag: ${Math.round(a)} · ${Math.round(b)} = ${s}. Nur ${dec(a * b, 2)} liegt in der Nähe.` });
};

const IV_WISSEN = [
  { t: 'mc', q: 'Was rechnet man zuerst bei 2 + 3 · (4 − 1)?', a: ['Die Klammer', '2 + 3', '3 · 4', 'Egal'], c: 0, why: 'Klammer zuerst, dann Punkt vor Strich: 2 + 3 · 3 = 2 + 9 = 11.' },
  { t: 'tf', q: 'Wenn man eine Zahl durch 0,5 teilt, wird das Ergebnis größer.', c: true, why: 'Durch 0,5 teilen ist dasselbe wie mal 2.' },
  { t: 'mc', q: 'Wie viele Nachkommastellen hat 0,03 · 0,2?', a: ['3', '2', '1', '5'], c: 0, why: '2 + 1 = 3 Nachkommastellen: 0,006.' },
  { t: 'mc', q: '{3/4} · 8 = ?', a: ['6', '{3/32}', '{24/32}', '{11/4}'], c: 0, why: '{3/4} von 8: 8 : 4 · 3 = 6.' },
];
const gIVWissen = () => ({ ...pick(IV_WISSEN) });

// ---------- Kapitel V: Flächeninhalte ----------

const gTrapez = () => {
  const a = rnd(4, 12); let c = rnd(2, a - 1);
  if ((a + c) % 2) c = c > 2 ? c - 1 : c + 1;
  const h = rnd(2, 8);
  return { t: 'num', q: 'Berechne den Flächeninhalt des **Trapezes**.', c: `${((a + c) / 2) * h}`, unit: 'cm²', fig: trapFig(a, c, h), why: `A = (a + c) : 2 · h = (${a} + ${c}) : 2 · ${h} = ${(a + c) / 2} · ${h} = ${((a + c) / 2) * h} cm². Mittlere Breite mal Höhe.` };
};

const gKreisUmfang = () => {
  const useR = Math.random() < 0.5;
  const v = rnd(1, 12);
  const d = useR ? 2 * v : v;
  return { t: 'num', q: `Ein Kreis hat den ${useR ? `**Radius** r = ${v} cm` : `**Durchmesser** d = ${v} cm`}.\nBerechne den **Umfang**. Rechne mit π ≈ 3,14.`, c: dec(3.14 * d, 2), unit: 'cm', fig: circleFig(useR ? v : null, useR ? null : v), why: `u = π · d${useR ? ` = π · 2r = 3,14 · ${d}` : ` = 3,14 · ${d}`} = ${dec(3.14 * d, 2)} cm.` };
};

const gKreisFlaeche = () => {
  const useR = Math.random() < 0.6;
  const r = rnd(1, 10);
  return { t: 'num', q: `Ein Kreis hat den ${useR ? `**Radius** r = ${r} cm` : `**Durchmesser** d = ${2 * r} cm`}.\nBerechne den **Flächeninhalt**. Rechne mit π ≈ 3,14.`, c: dec(3.14 * r * r, 2), unit: 'cm²', fig: circleFig(useR ? r : null, useR ? null : 2 * r), why: `A = π · r · r${useR ? '' : ` (r = d : 2 = ${r} cm)`} = 3,14 · ${r} · ${r} = ${dec(3.14 * r * r, 2)} cm².` };
};

const V_WISSEN = [
  { t: 'mc', q: 'Wie misst man den **Abstand** eines Punktes von einer Geraden?', a: ['Senkrecht (im rechten Winkel) zur Geraden', 'Schräg zur nächsten Ecke', 'Parallel zur Geraden', 'Von irgendeinem Punkt der Geraden'], c: 0, why: 'Der kürzeste Weg ist immer der senkrechte – mit dem Geodreieck.' },
  { t: 'mc', q: 'Wie viele **Höhen** hat ein Dreieck?', a: ['3', '1', '2', '4'], c: 0, why: 'Zu jeder Seite gehört eine Höhe – sie geht senkrecht zur Seite durch die gegenüberliegende Ecke.' },
  { t: 'tf', q: 'Bei einem stumpfwinkligen Dreieck können Höhen auch außerhalb des Dreiecks liegen.', c: true, why: 'Dann muss man die Grundseite verlängern.' },
  { t: 'match', q: 'Welche Formel gehört zu welcher Figur?', pairs: [['Parallelogramm', 'A = g · h'], ['Dreieck', 'A = g · h : 2'], ['Trapez', 'A = (a + c) : 2 · h'], ['Kreis', 'A = π · r · r']], why: 'Alle Formeln lassen sich auf das Rechteck zurückführen.' },
  { t: 'mc', q: 'Was ist ungefähr **π** (Pi)?', a: ['3,14', '2,71', '1,41', '3,41'], c: 0, why: 'π gibt an, wie oft der Durchmesser in den Umfang passt – etwas mehr als dreimal.' },
  { t: 'tf', q: 'Verdoppelt man den Radius eines Kreises, verdoppelt sich auch sein Flächeninhalt.', c: false, why: 'Er vervierfacht sich, weil r zweimal in der Formel steckt (r · r).' },
];
const gVWissen = () => ({ ...pick(V_WISSEN) });

// ---------- Kapitel VI: Dreisatz ----------

const PROP = [
  ['Hefte', 'kosten', '€', 70, 180], ['kg Äpfel', 'kosten', '€', 150, 320], ['Liter Saft', 'kosten', '€', 90, 240],
  ['Kinokarten', 'kosten', '€', 650, 1100], ['m Stoff', 'kosten', '€', 400, 900],
];
const gDreisatzProp = () => {
  const [ding, verb, unit, lo, hi] = pick(PROP);
  const p = rnd(lo / 10, hi / 10) * 10; // Preis pro Stück in Cent
  const n1 = rnd(2, 8); let n2 = rnd(2, 12);
  if (n2 === n1) n2 = n1 + 3;
  const eur = (c) => (c / 100).toFixed(2).replace('.', ',');
  return { t: 'num', q: `🛒 ${n1} ${ding} ${verb} ${eur(n1 * p)} ${unit}.\nWie viel ${verb} **${n2} ${ding}**?`, c: dec(n2 * p / 100, 2), unit, why: `Dreisatz (proportional – „je mehr, desto mehr“):\n${n1} ${ding} → ${eur(n1 * p)} ${unit}\n1 → ${eur(n1 * p)} : ${n1} = ${eur(p)} ${unit}\n${n2} → ${eur(p)} · ${n2} = ${eur(n2 * p)} ${unit}` };
};

// [Wer, Satz mit {n} und {x}, Frage mit {m}, Einheit]
const ANTI = [
  ['Pumpen', '{n} Pumpen leeren ein Becken in {x} Stunden.', 'Wie lange brauchen **{m} Pumpen**?', 'h'],
  ['Maler', '{n} Maler streichen ein Haus in {x} Tagen.', 'Wie lange brauchen **{m} Maler**?', 'Tage'],
  ['Kinder', '{n} Kinder teilen sich ein Geschenk, jedes zahlt {x} €.', 'Wie viel zahlt jedes Kind, wenn es **{m} Kinder** sind?', '€'],
  ['Helfer', '{n} Helfer pflücken ein Erdbeerfeld in {x} Stunden.', 'Wie lange brauchen **{m} Helfer**?', 'h'],
];
const gDreisatzAnti = () => {
  const [wer, satz, frage, unit] = pick(ANTI);
  const total = pick([12, 24, 36, 48, 60, 72]);
  const divs = [];
  for (let i = 2; i <= 12; i++) if (total % i === 0 && total / i > 1) divs.push(i);
  const [a, b] = shuffle(divs).slice(0, 2);
  return { t: 'num', q: `${satz.replace('{n}', a).replace('{x}', total / a)}\n${frage.replace('{m}', b)}`, c: `${total / b}`, unit, why: `Antiproportional – „je mehr, desto weniger“:\n${a} ${wer} → ${total / a} ${unit}\n1 → ${total / a} · ${a} = ${total} ${unit}\n${b} → ${total} : ${b} = ${total / b} ${unit}` };
};

const ZUSAMMENHANG = [
  ['Anzahl Brötchen → Preis', 0], ['Anzahl Arbeiter → Arbeitszeit', 1], ['Alter → Körpergröße', 2], ['Getankte Liter → Kosten', 0],
  ['Geschwindigkeit → Fahrzeit (gleiche Strecke)', 1], ['Seitenlänge eines Quadrats → Umfang', 0], ['Anzahl Gäste → Pizza pro Gast', 1], ['Uhrzeit → Temperatur', 2],
];
const gZusammenhang = () => ({ t: 'sort', q: 'Welcher Zusammenhang liegt vor?', cats: ['proportional', 'antiproportional', 'keins von beiden'], items: shuffle(ZUSAMMENHANG).slice(0, 5), why: '**Proportional:** doppelt so viel → doppelt so viel. **Antiproportional:** doppelt so viel → halb so viel. Wachstum oder Temperatur folgen keiner solchen Regel.' });

const gTabelle = () => {
  const anti = Math.random() < 0.5;
  if (!anti) {
    const k = rnd(2, 9); const x1 = rnd(2, 6); let x2 = rnd(3, 12);
    if (x2 === x1) x2 += 2;
    return { t: 'num', q: `Die Tabelle ist **proportional**:\nx: ${x1} → y: ${x1 * k}\nx: ${x2} → y: ?`, c: `${x2 * k}`, why: `Bei proportionalen Zuordnungen ist der **Quotient** y : x immer gleich: ${x1 * k} : ${x1} = ${k}. Also ${x2} · ${k} = ${x2 * k}.` };
  }
  const total = pick([24, 36, 48, 60]);
  const divs = [2, 3, 4, 6, 12].filter((d) => total % d === 0);
  const [x1, x2] = shuffle(divs).slice(0, 2);
  return { t: 'num', q: `Die Tabelle ist **antiproportional**:\nx: ${x1} → y: ${total / x1}\nx: ${x2} → y: ?`, c: `${total / x2}`, why: `Bei antiproportionalen Zuordnungen ist das **Produkt** x · y immer gleich: ${x1} · ${total / x1} = ${total}. Also ${total} : ${x2} = ${total / x2}.` };
};

const VI_WISSEN = [
  { t: 'mc', q: 'Wie sieht der Graph einer **proportionalen** Zuordnung aus?', a: ['Eine Gerade durch den Nullpunkt', 'Eine Kurve, die immer flacher wird', 'Eine waagrechte Linie', 'Ein Kreis'], c: 0, why: 'Er beginnt immer im Ursprung (0 | 0) – nichts kostet nichts.' },
  { t: 'mc', q: 'Bei einer antiproportionalen Zuordnung ist immer gleich …', a: ['das Produkt x · y', 'der Quotient y : x', 'die Summe x + y', 'die Differenz y − x'], c: 0, why: 'Doppelt so viele Arbeiter, halb so viel Zeit: Die Gesamtarbeit bleibt gleich.' },
  { t: 'tf', q: '„Je mehr, desto mehr“ ist immer proportional.', c: false, why: 'Proportional ist es nur, wenn das Doppelte auch genau das Doppelte ergibt. Eine Taxifahrt mit Grundgebühr wächst zwar, ist aber nicht proportional.' },
  { t: 'order', q: 'Ordne die Schritte des Dreisatzes.', items: ['Gegebenes Wertepaar aufschreiben', 'Auf die Einheit (1) schließen', 'Auf die gesuchte Menge schließen', 'Antwortsatz schreiben'], why: 'Drei Zeilen – daher der Name **Dreisatz**.' },
];
const gVIWissen = () => ({ ...pick(VI_WISSEN) });

// ---------- Kapitel VII: Daten darstellen und interpretieren ----------

const gGrundwert = () => {
  const [p, d] = pick([[10, 10], [20, 5], [25, 4], [50, 2], [5, 20]]);
  const pw = rnd(2, 20) * (d === 20 ? 1 : 2);
  return { t: 'num', q: `🏷️ **${p} %** sind ${pw} €.\nWie viel sind **100 %** (der Grundwert)?`, c: `${pw * d}`, unit: '€', why: `${p} % = ${F(1, d)}. Wenn ${F(1, d)} schon ${pw} € sind, ist das Ganze ${d}-mal so viel: ${pw} · ${d} = ${pw * d} €.` };
};

const gProzentSatzSchwer = () => {
  const total = pick([20, 25, 40, 50, 80, 200]);
  const pct = pick([5, 10, 15, 20, 30, 35, 40, 45, 60, 75, 85]);
  const part = (total * pct) / 100;
  if (!Number.isInteger(part)) return gProzentSatzSchwer();
  const [wer, was] = pick([['Kindern', 'spielen Fußball'], ['Losen', 'sind Nieten'], ['Würfen', 'treffen'], ['Befragten', 'mögen Pizza am liebsten']]);
  return { t: 'num', q: `Von ${total} ${wer} ${was}: **${part}**.\nWie viel **Prozent** sind das?`, c: `${pct}`, unit: '%', why: `Prozentsatz = Prozentwert : Grundwert = ${part} : ${total} = ${F(part, total)} = ${Fr(pct, 100)} = ${pct} %.` };
};

const gUrliste = () => {
  const vals = Array.from({ length: rnd(12, 18) }, () => pick([1, 2, 2, 3, 3, 3, 4, 4, 5, 6]));
  const x = pick([...new Set(vals)]);
  const n = vals.filter((v) => v === x).length;
  if (Math.random() < 0.5) return { t: 'num', q: `📋 Urliste der Noten einer Klassenarbeit:\n**${vals.join('  ')}**\nWie oft kommt die Note **${x}** vor (absolute Häufigkeit)?`, c: `${n}`, why: `Mit einer Strichliste zählen: Die ${x} kommt ${n}-mal vor.` };
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  if (Math.round(mean * 100) % 10 && Math.round(mean * 10) !== mean * 10) {
    return { t: 'num', q: `📋 Urliste der Noten einer Klassenarbeit:\n**${vals.join('  ')}**\nWie viele Noten sind es **insgesamt**?`, c: `${vals.length}`, why: 'Jede Zahl in der Urliste ist eine Note – einfach alle zählen.' };
  }
  return { t: 'num', q: `📋 Urliste der Noten:\n**${vals.join('  ')}**\nBerechne den **Notendurchschnitt** (arithmetisches Mittel).`, c: dec(mean), why: `Summe ${vals.reduce((s, v) => s + v, 0)} : Anzahl ${vals.length} = ${dec(mean)}.` };
};

const gMittelDez = () => {
  const n = pick([3, 4, 5]);
  const mean = rnd(75, 105) / 10;
  const vals = Array.from({ length: n }, () => Math.round(mean * 10));
  for (let i = 0; i < 4; i++) {
    const a = rnd(0, n - 1); const b = rnd(0, n - 1); const d = rnd(1, 9);
    if (a !== b && vals[b] - d > 60) { vals[a] += d; vals[b] -= d; }
  }
  return { t: 'num', q: `⏱️ Sprintzeiten über 50 m (in s): **${vals.map((v) => dec(v / 10)).join(' · ')}**\nBerechne das **arithmetische Mittel**.`, c: dec(mean), unit: 's', why: `Summe: ${dec(vals.reduce((s, v) => s + v, 0) / 10)} s. Geteilt durch ${n}: ${dec(mean)} s.` };
};

const VII_PROZENT = [
  match('Was bedeuten die Begriffe der Prozentrechnung?', [['Grundwert', 'das Ganze (100 %)'], ['Prozentwert', 'der Anteil als Größe, z. B. 15 €'], ['Prozentsatz', 'der Anteil in Prozent, z. B. 30 %']], 'Beispiel: 30 % (Prozentsatz) von 50 € (Grundwert) sind 15 € (Prozentwert).'),
  { t: 'mc', q: 'Wie viel Prozent sind {3/4}?', a: ['75 %', '34 %', '25 %', '3,4 %'], c: 0, why: '{3/4} = {75/100} = 75 %.' },
  { t: 'tf', q: '120 % von 50 € sind mehr als 50 €.', c: true, why: 'Mehr als 100 % ist mehr als das Ganze: 120 % von 50 € = 60 €.' },
  { t: 'mc', q: 'Ein Pulli kostet 40 € und ist um 25 % reduziert. Wie viel kostet er jetzt?', a: ['30 €', '10 €', '15 €', '35 €'], c: 0, why: '25 % von 40 € = 10 € Rabatt. 40 € − 10 € = 30 €.' },
];
const VII_DIAGRAMM = [
  { t: 'mc', q: 'Welches Diagramm passt am besten, um **Anteile an einem Ganzen** zu zeigen?', a: ['Kreisdiagramm', 'Liniendiagramm', 'Strichliste', 'Urliste'], c: 0, why: 'Jeder Kreisausschnitt ist ein Anteil – zusammen 100 %.' },
  { t: 'mc', q: 'Welches Diagramm passt am besten, um eine **Entwicklung über die Zeit** zu zeigen (z. B. Temperatur im Laufe eines Tages)?', a: ['Liniendiagramm', 'Kreisdiagramm', 'Strichliste', 'Venn-Diagramm'], c: 0, why: 'Die Linie zeigt sofort, ob etwas steigt oder fällt.' },
  { t: 'mc', q: 'In einem Säulendiagramm beginnt die Hochachse nicht bei 0, sondern bei 90. Was ist das Problem?', a: ['Kleine Unterschiede sehen riesig aus', 'Die Säulen sind zu breit', 'Man kann nichts ablesen', 'Es gibt kein Problem'], c: 0, why: 'So werden Diagramme oft „geschönt“. Immer zuerst die Achsen prüfen!' },
  { t: 'tf', q: 'Die Summe aller relativen Häufigkeiten ergibt 1 (also 100 %).', c: true, why: 'Alle Anteile zusammen sind das Ganze.' },
];
const VII_MITTEL = [
  { t: 'mc', q: 'Die Werte 3, 4, 5, 4 und **24** – was passiert mit dem Mittelwert durch den Ausreißer 24?', a: ['Er wird viel größer, als die meisten Werte sind', 'Er bleibt bei 4', 'Er wird kleiner', 'Ausreißer zählen nicht'], c: 0, why: 'Mittelwert: 40 : 5 = 8 – obwohl vier von fünf Werten bei etwa 4 liegen.' },
  { t: 'tf', q: 'Das arithmetische Mittel kann eine Kommazahl sein, auch wenn alle Werte ganze Zahlen sind.', c: true, why: 'Zum Beispiel (1 + 2) : 2 = 1,5.' },
  { t: 'mc', q: 'Wie berechnet man das **arithmetische Mittel**?', a: ['Alle Werte addieren und durch ihre Anzahl teilen', 'Größten minus kleinsten Wert', 'Den mittleren Wert der Liste nehmen', 'Den häufigsten Wert nehmen'], c: 0, why: 'Größter minus kleinster Wert wäre die Spannweite.' },
];
const VII_STATISTIK = [
  { t: 'order', q: 'Ordne die Schritte einer **statistischen Untersuchung**.', items: ['Frage formulieren', 'Daten erheben (Umfrage, Messung)', 'Daten ordnen (Strichliste, Tabelle)', 'Daten darstellen (Diagramm)', 'Ergebnis auswerten und deuten'], why: 'Am Ende steht immer eine Antwort auf die Frage vom Anfang.' },
  match('Was ist was?', [['Urliste', 'Daten in der Reihenfolge, wie sie erhoben wurden'], ['Strichliste', 'Zählen mit Strichen, je 5 gebündelt'], ['Häufigkeitstabelle', 'jeder Wert mit seiner Anzahl'], ['Stichprobe', 'nur ein Teil wird befragt']]),
  { t: 'mc', q: 'Welche Umfrage-Frage ist **gut** formuliert?', a: ['Wie viele Stunden schläfst du an einem Schultag?', 'Schläfst du nicht auch viel zu wenig?', 'Findest du Schlaf gut?', 'Wie geht es dir so?'], c: 0, why: 'Eine gute Frage ist neutral, klar und liefert vergleichbare Antworten.' },
  { t: 'tf', q: 'Wer nur seine besten Freunde befragt, erhält ein Ergebnis, das für die ganze Schule gilt.', c: false, why: 'Die Stichprobe muss zur Frage passen – sonst ist das Ergebnis verzerrt.' },
  { t: 'mc', q: 'Wie viele Striche stehen bei einer Strichliste in einem Bündel?', a: ['5 (vier Striche und einer quer)', '10', '3', '4'], c: 0, why: 'So kann man schnell in Fünferschritten zählen.' },
];

// ---------- Figuren für Kapitel V ----------

function trapFig(a, c, h) {
  const s = 'var(--text)';
  return `<svg class="fig fig-w" viewBox="0 0 240 130" role="img" aria-label="Trapez">
    <path d="M20 98 H210 L160 22 H70 Z" fill="var(--primary)" fill-opacity="0.25" stroke="${s}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M70 22 V98" stroke="${s}" stroke-width="2" stroke-dasharray="5 4"/><path d="M70 88 h10 v10" fill="none" stroke="${s}" stroke-width="1.5"/>
    <text x="115" y="118" fill="${s}" font-size="13" font-weight="700" text-anchor="middle">a = ${a} cm</text>
    <text x="115" y="16" fill="${s}" font-size="13" font-weight="700" text-anchor="middle">c = ${c} cm</text>
    <text x="52" y="64" fill="${s}" font-size="13" font-weight="700" text-anchor="middle">h = ${h}</text></svg>`;
}
function circleFig(r, d) {
  const s = 'var(--text)';
  return `<svg class="fig fig-m" viewBox="0 0 200 200" role="img" aria-label="Kreis">
    <circle cx="100" cy="100" r="80" fill="var(--primary)" fill-opacity="0.2" stroke="${s}" stroke-width="2.5"/>
    <circle cx="100" cy="100" r="3.5" fill="${s}"/>
    ${r ? `<path d="M100 100 H180" stroke="#dc2626" stroke-width="3"/><text x="140" y="92" fill="#dc2626" font-size="14" font-weight="800" text-anchor="middle">r = ${r} cm</text>`
    : `<path d="M20 100 H180" stroke="#dc2626" stroke-width="3"/><text x="100" y="92" fill="#dc2626" font-size="14" font-weight="800" text-anchor="middle">d = ${d} cm</text>`}</svg>`;
}

// ---------- Stationen (Reihenfolge wie im Lambacher Schweizer 6) ----------

export const MATHE = {
  id: 'mathe',
  name: 'Mathe',
  emoji: '🔢',
  who: 'alpaca',
  motto: 'Zahlen-Expedition',
  intro: 'Willkommen zur **Zahlen-Expedition**! Die Stationen folgen den sieben Kapiteln deines Mathebuchs. Jede hat einen Spickzettel und mehrere Level – die Aufgaben sind jedes Mal neu. 😉',
  credit: 'Kapitel und Reihenfolge passen zum Lambacher Schweizer 6 (Baden-Württemberg, G9). Alle Erklärungen und Aufgaben sind selbst geschrieben – nichts ist aus dem Buch kopiert.',
  topics: [
    {
      id: 'k1', chapter: 'I', title: 'Rationale Zahlen', emoji: '🍕', sub: 'Anteile, Kürzen, Zahlengerade, Verhältnisse, Dezimalzahlen',
      say: 'Brüche, Dezimalzahlen, negative Brüche – das sind alles **rationale Zahlen**. Los geht’s mit Anteilen!',
      explain: [
        ['Anteile und Brüche', 'Der **Nenner** sagt, in wie viele gleich große Teile das Ganze geteilt wird, der **Zähler**, wie viele man nimmt.\n**Anteil berechnen:** durch den Nenner teilen, mit dem Zähler malnehmen.\n**Vom Anteil aufs Ganze:** erst auf {1/n} schließen, dann aufs Ganze.', '{2/5} von 20 = 20 : 5 · 2 = 8  ·  6 sind {2/7} → 3 sind {1/7} → 21 sind das Ganze'],
        ['Kürzen und Erweitern', 'Zähler und Nenner mit derselben Zahl (≠ 0) malnehmen bzw. durch sie teilen. Der Wert bleibt gleich. **Vollständig gekürzt** ist ein Bruch, wenn Zähler und Nenner keinen gemeinsamen Teiler (außer 1) haben.', '{24/36} = {6/9} = {2/3}'],
        ['Brüche als Quotienten', 'Jede Division kann man als Bruch schreiben: 3 : 4 = {3/4}. Vorzeichenregel: gleiche Vorzeichen → positiv, verschiedene → negativ.', '(−7) : 11 = {-7/11}'],
        ['Zahlengerade und Zahlenmengen', 'Jeder Bruch hat seinen Platz auf der Zahlengeraden – auch negative. Gemischte Schreibweise: {5/2} = {2 1/2}.\n**ℕ** natürliche Zahlen ⊂ **ℤ** ganze Zahlen ⊂ **ℚ** rationale Zahlen.', ''],
        ['Brüche vergleichen', 'Gleicher Nenner → größerer Zähler ist größer. Gleicher Zähler → kleinerer Nenner ist größer. Sonst auf einen gemeinsamen Nenner bringen (kgV der Nenner).', '{3/8} und {5/11}: Nenner 88 → {33/88} < {40/88}'],
        ['Verhältnisse', '**2 : 3** („zwei zu drei“) heißt: auf 2 Teile kommen 3 Teile – zusammen 5 Teile. Der erste Teil ist also {2/5} vom Ganzen. Verhältnisse kürzt man wie Brüche.', '150 ml : 250 ml = 3 : 5'],
        ['Dezimalschreibweise', 'Nach dem Komma: Zehntel, Hundertstel, Tausendstel. Zum Umwandeln den Bruch auf 10, 100 oder 1000 erweitern. Nullen am Ende darf man weglassen: 0,40 = 0,4.', '{3/5} = {6/10} = 0,6  ·  7,020 = {351/50}'],
      ],
      facts: ['Die alten Ägypter rechneten fast nur mit Stammbrüchen: {3/4} schrieben sie als {1/2} + {1/4}.', 'Das Zeichen ℚ für die rationalen Zahlen kommt vom Wort „Quotient“.'],
      levels: [
        { title: 'Anteile & Brüche', emoji: '🍕', gens: [gPie, gAnteil, gGanzesAusAnteil, gBruchBegriff, gPie] },
        { title: 'Kürzen & Erweitern', emoji: '✂️', gens: [gErweitern, gKuerzen, gFehlend, gKuerzen] },
        { title: 'Zahlengerade & Vergleichen', emoji: '📏', gens: [gBruchGerade, gZahlenmenge, gQuotient, gVergleich, gZuGemischt, gOrdnen] },
        { title: 'Verhältnisse & Dezimalzahlen', emoji: '🔢', gens: [gVerhaeltnis, gBruchZuDez, gDezZuBruch, gStellenwert, gDezVergleich, gGroesseKomma, gIWissen] },
      ],
    },
    {
      id: 'k2', chapter: 'II', title: 'Addieren und subtrahieren', emoji: '➕', sub: 'Brüche und Dezimalzahlen, Runden, Rechenvorteile, Größen',
      say: 'Merke: Man kann nur **gleich große Stücke** zusammenzählen. Und bei negativen Zahlen hilft die Zahlengerade!',
      explain: [
        ['Positive Brüche', 'Gleiche Nenner: Zähler addieren/subtrahieren, Nenner bleibt. Verschiedene Nenner: zuerst auf den **Hauptnenner** (kgV) erweitern. Am Ende kürzen.', '{1/2} + {1/3} = {3/6} + {2/6} = {5/6}'],
        ['Brüche mit Vorzeichen', 'Wie bei ganzen Zahlen: Plus → nach rechts, Minus → nach links. Eine negative Zahl subtrahieren = ihre Gegenzahl addieren.', '{1/4} − ({-3/4}) = {1/4} + {3/4} = 1'],
        ['Dezimalzahlen', '**Komma unter Komma** schreiben, fehlende Stellen mit Nullen auffüllen.', '3,7 + 1,45 = 3,70 + 1,45 = 5,15'],
        ['Runden und Überschlagen', 'Ziffer rechts neben der Rundungsstelle: 0–4 abrunden, 5–9 aufrunden. Mit gerundeten Zahlen macht man einen **Überschlag**, um Ergebnisse zu prüfen.', '39,8 + 21,3 ≈ 40 + 21 = 61'],
        ['Rechenvorteile und Größen', 'Summanden darf man vertauschen und geschickt zusammenfassen. Bei Größen erst in **dieselbe Einheit** umrechnen.', '2,7 + 5,4 + 7,3 = 10 + 5,4  ·  3,5 kg + 750 g = 4,25 kg'],
      ],
      facts: ['Der häufigste Bruch-Fehler der Welt: Zähler plus Zähler und Nenner plus Nenner. Wenn du das nicht machst, bist du schon besser als viele Erwachsene!'],
      levels: [
        { title: 'Positive Brüche', emoji: '🟰', gens: [gGleichnamig, gUngleichnamig(['+']), gUngleichnamig(['−']), gAddFehler, gGemischtAdd, gAddSach] },
        { title: 'Brüche mit Vorzeichen', emoji: '➖', gens: [gNegBruchAdd, gNegBruchAdd, gNegAdd(true), gIIWissen] },
        { title: 'Dezimalzahlen & Runden', emoji: '🎯', gens: [gDezAdd, gDezNeg, gRunden, gUeberschlagPlus, gDezAdd] },
        { title: 'Rechenvorteile & Größen', emoji: '🧠', gens: [gRechenvorteil, gGroesseAdd, gRechenvorteil, gGroesseAdd, gIIWissen] },
      ],
    },
    {
      id: 'k3', chapter: 'III', title: 'Winkel messen und zeichnen', emoji: '📐', sub: 'Winkelweite, Winkelarten, überstumpfe Winkel, Kreisdiagramme',
      say: 'Skater kennen Winkel längst: ein „180er“ ist eine halbe Drehung, ein „360er“ eine ganze!',
      explain: [
        ['Winkel und Winkelweite', 'Zwei Schenkel mit gemeinsamem **Scheitel** bilden einen Winkel. Seine Weite misst man in Grad (°). Winkel heißen α, β, γ …', 'Volle Drehung = 360°'],
        ['Messen und Zeichnen', 'Geodreieck: Nullpunkt auf den Scheitel, lange Seite auf einen Schenkel, an der Skala ablesen, die bei 0 beginnt. Tipp: erst schätzen!', ''],
        ['Winkelarten', '**spitz** < 90° · **recht** = 90° · **stumpf** zwischen 90° und 180° · **gestreckt** = 180° · **überstumpf** zwischen 180° und 360° · **Vollwinkel** = 360°', ''],
        ['Überstumpfe Winkel', 'Man misst den kleinen Winkel und rechnet 360° minus diesen Wert.', '360° − 70° = 290°'],
        ['Kreisausschnitte und Kreisdiagramme', 'Der Mittelpunktswinkel gibt den Anteil an: 360° sind 100 %, also 1 % = 3,6°.', '25 % → 90°  ·  120° → {1/3}'],
      ],
      facts: ['Warum 360°? Die Babylonier rechneten vor 4000 Jahren mit der Zahl 60 – und 360 lässt sich durch sehr viele Zahlen teilen.'],
      levels: [
        { title: 'Winkel-Detektiv', emoji: '🕵️', gens: [gWinkelArtBild, gWinkelArtZahl, gWinkelWissen, gWinkelArtBild] },
        { title: 'Augenmaß', emoji: '👁️', gens: [gSchaetzen, gUhr, gDrehung, gSchaetzen, gErgaenzen] },
        { title: 'Kreisdiagramme', emoji: '🥧', gens: [gKreisdiagramm, gSektorAnteil, gKreisdiagramm, gErgaenzen, gWinkelWissen] },
      ],
    },
    {
      id: 'k4', chapter: 'IV', title: 'Multiplizieren und dividieren', emoji: '✖️', sub: 'Brüche und Dezimalzahlen, Zehnerpotenzen, Rechenvorteile',
      say: 'Gute Nachricht: Malnehmen ist bei Brüchen viel einfacher als Plus – kein Hauptnenner nötig!',
      explain: [
        ['Brüche vervielfachen und teilen', 'Bruch · Zahl: Zähler mal Zahl. Bruch : Zahl: Nenner mal Zahl.', '{2/7} · 3 = {6/7}  ·  {2/7} : 3 = {2/21}'],
        ['Brüche multiplizieren', '**Zähler mal Zähler, Nenner mal Nenner** – vorher kürzen spart Arbeit. „von“ heißt „mal“.', '{2/3} · {4/5} = {8/15}'],
        ['Brüche dividieren', 'Mit dem **Kehrwert** malnehmen.', '{2/3} : {4/5} = {2/3} · {5/4} = {5/6}'],
        ['Rechenarten verbinden', 'Klammer zuerst, dann **Punkt vor Strich**. Rechengesetze nutzen, um geschickt zu rechnen.', '2 + 3 · 4 = 14'],
        ['Zehnerpotenzen und Dezimalzahlen', 'Mal 10, 100, 1000 → Komma nach rechts; geteilt → nach links. Dezimalzahlen multiplizieren: ohne Komma rechnen, Nachkommastellen addieren. Durch eine Dezimalzahl teilen: bei beiden Zahlen das Komma gleich weit verschieben.', '0,3 · 0,4 = 0,12  ·  5,6 : 0,7 = 56 : 7 = 8'],
      ],
      facts: ['Wenn du ein Blatt Papier 42-mal falten könntest, wäre der Stapel dicker als die Strecke zum Mond!'],
      levels: [
        { title: 'Brüche mal & geteilt', emoji: '✖️', gens: [gMalZahl, gDurchZahl, gMalBruch, gMalWissen, gMalSach] },
        { title: 'Kehrwert & Punkt vor Strich', emoji: '🤸', gens: [gKehrwert, gDurchBruch, gPunktVorStrich, gIVWissen, gDurchBruch] },
        { title: 'Komma-Akrobatik', emoji: '🎪', gens: [gKomma, gDezMal, gDezDurchGanz, gDezDurch, gUeberschlagMal] },
      ],
    },
    {
      id: 'k5', chapter: 'V', title: 'Flächeninhalte', emoji: '🔷', sub: 'Abstände, Parallelogramm, Dreieck, Trapez, Kreis',
      say: 'Fast jede Fläche lässt sich in ein Rechteck verwandeln – schneiden, verschieben, fertig!',
      explain: [
        ['Abstände und Höhen', 'Der **Abstand** eines Punktes von einer Geraden wird **senkrecht** gemessen. Die **Höhe** eines Dreiecks geht senkrecht von einer Seite zur gegenüberliegenden Ecke – jedes Dreieck hat drei.', ''],
        ['Parallelogramm', '**A = g · h**. Schneidet man ein Dreieck ab und setzt es auf der anderen Seite an, entsteht ein Rechteck.', 'g = 6 cm, h = 4 cm → 24 cm²'],
        ['Dreieck', '**A = g · h : 2** – genau die Hälfte eines Parallelogramms.', ''],
        ['Trapez', 'Zwei parallele Seiten a und c. **A = (a + c) : 2 · h** – mittlere Breite mal Höhe.', '(8 + 4) : 2 · 3 = 18 cm²'],
        ['Kreis', 'π ≈ 3,14. **Umfang:** u = π · d = 2 · π · r. **Flächeninhalt:** A = π · r · r.', 'r = 5 cm → u ≈ 31,4 cm, A ≈ 78,5 cm²'],
      ],
      facts: ['π hat unendlich viele Nachkommastellen, die sich nie wiederholen. Computer kennen schon über 100 Billionen davon.', 'Am 14. März (3/14) feiern Mathe-Fans auf der ganzen Welt den Pi-Tag.'],
      levels: [
        { title: 'Parallelogramm & Dreieck', emoji: '🟦', gens: [gPara, gDreieck, gVWissen, gPara, gRueck] },
        { title: 'Trapez', emoji: '⏢', gens: [gTrapez, gTrapez, gDreieck, gVWissen] },
        { title: 'Rund um den Kreis', emoji: '⭕', gens: [gKreisUmfang, gKreisFlaeche, gKreisMass, gKreisFlaeche, gVWissen] },
      ],
    },
    {
      id: 'k6', chapter: 'VI', title: 'Dreisatzrechnung', emoji: '⚖️', sub: 'Proportional, antiproportional, Dreisatz, Graphen',
      say: 'Drei Hefte kosten so viel – wie viel kosten sieben? Mit dem **Dreisatz** kein Problem!',
      explain: [
        ['Proportional', '„Je mehr, desto mehr“ – und zwar genau: doppelt so viel → doppelt so viel. Der **Quotient** y : x ist immer gleich. Der Graph ist eine Gerade durch den Nullpunkt.', '1 kg → 3 €, 2 kg → 6 €'],
        ['Dreisatz (proportional)', '1. Gegebenes aufschreiben. 2. Auf 1 schließen (teilen). 3. Auf das Gesuchte schließen (malnehmen).', '3 Hefte → 4,50 € · 1 Heft → 1,50 € · 7 Hefte → 10,50 €'],
        ['Antiproportional', '„Je mehr, desto weniger“ – doppelt so viel → halb so viel. Das **Produkt** x · y ist immer gleich.', '2 Pumpen → 6 h, 4 Pumpen → 3 h'],
        ['Dreisatz (antiproportional)', 'Auf 1 schließen heißt hier **malnehmen**, dann auf das Gesuchte **teilen**.', '4 Maler → 6 Tage · 1 Maler → 24 Tage · 3 Maler → 8 Tage'],
        ['Zusammenhänge darstellen', 'Mit Tabelle und Graph: Proportional → Ursprungsgerade. Antiproportional → Kurve (Hyperbel), die immer flacher wird.', ''],
      ],
      facts: ['Gorillababys werden etwa 2 kg schwer geboren – erwachsene Männchen über 150 kg. Wachstum ist aber nicht proportional zum Alter!'],
      levels: [
        { title: 'Je mehr, desto …', emoji: '🔍', gens: [gZusammenhang, gTabelle, gVIWissen, gTabelle] },
        { title: 'Dreisatz proportional', emoji: '🛒', gens: [gDreisatzProp, gDreisatzProp, gTabelle, gVIWissen] },
        { title: 'Dreisatz antiproportional', emoji: '🔄', gens: [gDreisatzAnti, gDreisatzAnti, gDreisatzProp, gZusammenhang] },
      ],
    },
    {
      id: 'k7', chapter: 'VII', current: true, title: 'Daten darstellen und interpretieren', emoji: '📊', sub: 'Prozente, relative Häufigkeit, Diagramme, Mittelwert, Statistik',
      say: 'Wer Daten lesen kann, lässt sich nicht so leicht hereinlegen. Werde **Daten-Detektiv**!',
      explain: [
        ['Prozente', 'Prozent heißt „von Hundert“: 1 % = {1/100} = 0,01.\n**Grundwert** = das Ganze (100 %) · **Prozentwert** = der Teil · **Prozentsatz** = der Anteil in %.\nProzentsatz = Prozentwert : Grundwert.', '15 von 60 = {15/60} = {1/4} = 25 %'],
        ['Wichtige Prozentsätze', '50 % = {1/2} · 25 % = {1/4} · 20 % = {1/5} · 10 % = {1/10} · 75 % = {3/4} · 1 % = {1/100}', ''],
        ['Absolute und relative Häufigkeit', '**Absolut:** die Anzahl. **Relativ:** der Anteil = absolute Häufigkeit : Gesamtzahl (als Bruch, Dezimalzahl oder Prozent). Zum fairen Vergleich braucht man die relative Häufigkeit.', '12 von 30 Kindern = 0,4 = 40 %'],
        ['Diagramme', '**Säulen-/Balkendiagramm:** Anzahlen vergleichen. **Kreisdiagramm:** Anteile am Ganzen (1 % = 3,6°). **Liniendiagramm:** Entwicklung über die Zeit. Immer zuerst die Achsen lesen!', ''],
        ['Arithmetisches Mittel', 'Alle Werte addieren und durch ihre Anzahl teilen. Achtung vor **Ausreißern** – sie verschieben den Mittelwert stark.\n**Spannweite** = größter − kleinster Wert.', '(4 + 6 + 8) : 3 = 6'],
        ['Statistische Untersuchungen', 'Frage stellen → Daten erheben (Umfrage, Messung) → ordnen (Urliste, Strichliste, Häufigkeitstabelle) → darstellen → auswerten.', ''],
      ],
      facts: ['Im Durchschnitt hat ein Mensch weniger als zwei Beine – weil manche nur eines haben. Der Mittelwert kann ganz schön überraschen!', 'Das Wort „Statistik“ kommt von „Staat“: Früher zählten vor allem Könige ihre Untertanen und deren Steuern.'],
      levels: [
        { title: 'Prozente', emoji: '💯', genCount: 6, gens: [gProzentVon, gProzentAnteil, gProzentPaare, gGrundwert, gProzentSatzSchwer, gBruchZuDez], questions: VII_PROZENT },
        { title: 'Häufigkeiten & Diagramme', emoji: '📊', genCount: 6, gens: [gRelH, gChart, gKreisdiagramm, gRelH, gChart], questions: VII_DIAGRAMM },
        { title: 'Arithmetisches Mittel', emoji: '⚖️', genCount: 6, gens: [gMittel, gMittelDez, gMittelFehlt, gSpannweite, gMittel], questions: VII_MITTEL },
        { title: 'Statistische Untersuchungen', emoji: '🕵️', genCount: 4, gens: [gUrliste, gUrliste, gRelH, gChart], questions: VII_STATISTIK },
      ],
    },
    {
      id: 'grund', chapter: 'Kl. 5', title: 'Grundwissen aus Klasse 5', emoji: '🧰', sub: 'Teiler, Primzahlen, ganze Zahlen, Einheiten, Volumen',
      say: 'Fürs Check-in jedes Kapitels brauchst du dein Wissen aus Klasse 5. Hier kannst du es auffrischen!',
      explain: [
        ['Teilbarkeitsregeln', 'Durch **2**: letzte Ziffer gerade · durch **5**: letzte Ziffer 0 oder 5 · durch **4**: letzte zwei Ziffern durch 4 teilbar · durch **3** bzw. **9**: Quersumme durch 3 bzw. 9 teilbar.', '4 518 → Quersumme 18 → durch 3 und 9 teilbar'],
        ['Primzahlen, ggT, kgV', 'Eine **Primzahl** hat genau zwei Teiler. Die 1 ist keine Primzahl. Jede Zahl lässt sich in Primfaktoren zerlegen.\n**ggT** zum Kürzen, **kgV** für den Hauptnenner.', '20 = 2 · 2 · 5  ·  ggT(12, 18) = 6  ·  kgV(4, 6) = 12'],
        ['Ganze Zahlen', 'Links von 0 die negativen Zahlen. Plus → nach rechts, Minus → nach links. Eine negative Zahl subtrahieren = addieren.', '−2 + 5 = 3  ·  3 − (−6) = 9'],
        ['Einheiten', 'Länge: Umrechnungszahl 10 (mm, cm, dm, m), 1000 (m → km). Fläche: 100 (mm², cm², dm², m², a, ha, km²). Volumen: 1000 (mm³, cm³, dm³, m³). 1 dm³ = 1 l.', '38 m² = 3800 dm²  ·  2 m³ = 2 000 000 cm³'],
        ['Rechteck und Quader', 'Rechteck: A = a · b, u = 2a + 2b. Quader: V = a · b · c.', ''],
      ],
      facts: ['Manche Zikaden schlüpfen nur alle 13 oder 17 Jahre – das sind Primzahlen. So treffen sie selten auf ihre Fressfeinde.', 'Die kälteste je gemessene Temperatur auf der Erde: −89,2 °C in der Antarktis.'],
      levels: [
        { title: 'Teiler & Primzahlen', emoji: '🔍', gens: [gDivTF([2, 5, 10, 4]), gDivTF([3, 9]), gQuersumme, gPrimSort, gPrimfaktor, gGgt, gKgv, gKeinTeiler] },
        { title: 'Ganze Zahlen', emoji: '🌡️', gens: [gNegStrahl, gNegVergleich, gTemp, gNegAdd(false), gNegAdd(true), gKonto, gNegWissen] },
        { title: 'Einheiten & Volumen', emoji: '📦', gens: [gEinheiten, gRechteck, gQuader, gWuerfel, gLiter, gEinheiten, gFlaechenWissen] },
      ],
    },
  ],
};

const LEVEL_SIZE = 8;

// n verschiedene Aufgaben aus den Generatoren eines Levels
export function makeQuestions(level, n = LEVEL_SIZE) {
  const out = [];
  const seen = new Set();
  let order = shuffle(level.gens);
  let i = 0;
  let tries = 0;
  while (out.length < n && tries < n * 12) {
    tries++;
    if (i >= order.length) { order = shuffle(level.gens); i = 0; }
    const q = order[i++]();
    const key = q.q + (q.fig || '') + (q.items || q.pairs || '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
