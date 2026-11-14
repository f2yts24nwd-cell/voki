// Mathe Klasse 6 (Gymnasium, Baden-Württemberg).
// Die Themen orientieren sich am Bildungsplan 2016 (Klassen 5/6) und an der üblichen
// Reihenfolge in Klasse 6 – sie sind keine Kopie eines bestimmten Schulbuchs.
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

// ---------- Themen ----------
// Jedes Level: n Aufgaben, reihum aus den Generatoren (ohne doppelte Aufgaben).

export const MATHE = {
  id: 'mathe',
  name: 'Mathe',
  emoji: '🔢',
  who: 'alpaca',
  motto: 'Zahlen-Expedition',
  intro: 'Willkommen zur **Zahlen-Expedition**! Jede Station hat einen Spickzettel und drei Level. Die Aufgaben sind jedes Mal neu – Abschreiben unmöglich. 😉',
  topics: [
    {
      id: 'teilbar', title: 'Teiler & Primzahlen', emoji: '🔍', sub: 'Teilbarkeitsregeln, Primzahlen, ggT und kgV',
      say: 'Ob eine Zahl teilbar ist, sieht man ihr oft an der Nasenspitze an – man muss nur wissen, wo man hinschaut!',
      explain: [
        ['Endziffern-Regeln', 'Eine Zahl ist teilbar durch …\n**2**, wenn die letzte Ziffer gerade ist (0, 2, 4, 6, 8).\n**5**, wenn die letzte Ziffer 0 oder 5 ist.\n**10**, wenn die letzte Ziffer 0 ist.\n**4**, wenn die letzten **zwei** Ziffern eine durch 4 teilbare Zahl bilden.', '7 316 → 16 ist durch 4 teilbar ✔'],
        ['Quersummen-Regeln', 'Quersumme = alle Ziffern addieren.\nEine Zahl ist durch **3** teilbar, wenn ihre Quersumme durch 3 teilbar ist.\nSie ist durch **9** teilbar, wenn ihre Quersumme durch 9 teilbar ist.', '4 518 → 4 + 5 + 1 + 8 = 18 → durch 3 und durch 9 teilbar ✔'],
        ['Primzahlen', 'Eine **Primzahl** hat genau zwei Teiler: 1 und sich selbst.\nDie ersten: 2, 3, 5, 7, 11, 13, 17, 19, 23 …\nAchtung: Die 1 ist **keine** Primzahl. Die 2 ist die einzige gerade Primzahl.\nJede Zahl lässt sich in Primfaktoren zerlegen.', '60 = 2 · 2 · 3 · 5'],
        ['ggT und kgV', '**ggT** = größter gemeinsamer Teiler (brauchst du zum Kürzen).\n**kgV** = kleinstes gemeinsames Vielfaches (brauchst du für den Hauptnenner).', 'ggT(12, 18) = 6 · kgV(4, 6) = 12'],
      ],
      facts: ['Die größte bekannte Primzahl hat über 41 Millionen Ziffern. Ausgedruckt wäre das ein Stapel aus Tausenden Seiten!', 'Manche Zikaden schlüpfen nur alle 13 oder 17 Jahre – das sind Primzahlen. So treffen sie selten auf ihre Fressfeinde.'],
      levels: [
        { title: 'Endziffern-Check', emoji: '👀', gens: [gDivTF([2, 5, 10]), gDivTF([4]), gDivWhich([2, 5, 4]), gDivTF([2, 5, 10, 4])] },
        { title: 'Quersummen-Trick', emoji: '➕', gens: [gQuersumme, gDivTF([3]), gDivTF([9]), gDivWhich([3, 9]), gDivTF([3, 9, 6])] },
        { title: 'Primzahl-Jagd', emoji: '🏹', gens: [gPrimSort, gPrimTF, gGgt, gKgv, gKeinTeiler, gPrimfaktor] },
      ],
    },
    {
      id: 'brueche', title: 'Brüche verstehen', emoji: '🍕', sub: 'Anteile, Erweitern, Kürzen, Vergleichen',
      say: 'Brüche sind überall: eine halbe Pizza, eine Viertelstunde, drei Viertel vom Akku. Los geht’s!',
      explain: [
        ['Zähler und Nenner', 'Der **Nenner** (unten) sagt, in wie viele gleich große Teile das Ganze geteilt ist.\nDer **Zähler** (oben) zählt, wie viele Teile man nimmt.', '{3/4} Pizza: in 4 Stücke geteilt, 3 davon genommen'],
        ['Erweitern und Kürzen', '**Erweitern:** Zähler und Nenner mit derselben Zahl malnehmen.\n**Kürzen:** Zähler und Nenner durch dieselbe Zahl teilen.\nDer Wert des Bruchs bleibt dabei gleich!', '{2/3} = {4/6} = {8/12}  ·  {12/18} = {2/3} (gekürzt mit 6)'],
        ['Brüche vergleichen', 'Gleicher Nenner → der größere Zähler gewinnt.\nGleicher Zähler → der **kleinere** Nenner gewinnt (größere Stücke!).\nSonst: erst auf den gleichen Nenner bringen.', '{2/3} und {3/4} → {8/12} < {9/12}'],
        ['Gemischte Zahlen', 'Ist der Zähler größer als der Nenner, steckt mehr als ein Ganzes drin.', '{7/4} = {1 3/4}  (7 : 4 = 1 Rest 3)'],
      ],
      facts: ['Die alten Ägypter rechneten fast nur mit Stammbrüchen (Zähler 1). {3/4} schrieben sie als {1/2} + {1/4}.', 'Das Wort „Bruch“ kommt wirklich von „brechen“ – eine gebrochene Zahl.'],
      levels: [
        { title: 'Pizza-Stücke', emoji: '🍕', gens: [gPie, gPie, gAnteil, gBruchBegriff] },
        { title: 'Erweitern & Kürzen', emoji: '✂️', gens: [gErweitern, gKuerzen, gFehlend, gKuerzen] },
        { title: 'Bruch-Duell', emoji: '⚔️', gens: [gVergleich, gZuUnecht, gZuGemischt, gOrdnen, gVergleich] },
      ],
    },
    {
      id: 'dezimal', title: 'Dezimalzahlen & Prozent', emoji: '💯', sub: 'Kommazahlen, Runden, Prozent',
      say: 'Ein Bruch, eine Kommazahl, eine Prozentzahl – das sind oft nur drei Verkleidungen für dieselbe Zahl!',
      explain: [
        ['Stellenwerte', 'Nach dem Komma kommen Zehntel, Hundertstel, Tausendstel.', '3,472 = 3 Einer + 4 Zehntel + 7 Hundertstel + 2 Tausendstel'],
        ['Bruch ↔ Dezimalzahl', 'Erweitere auf Zehntel oder Hundertstel – dann kannst du die Dezimalzahl ablesen.', '{1/4} = {25/100} = 0,25  ·  {3/5} = {6/10} = 0,6'],
        ['Prozent', 'Prozent heißt „von Hundert“: 1 % = {1/100} = 0,01.', '50 % = {1/2} · 25 % = {1/4} · 20 % = {1/5} · 10 % = {1/10}'],
        ['Runden', 'Schau auf die Ziffer rechts neben der Rundungsstelle: bei 0, 1, 2, 3, 4 abrunden – bei 5, 6, 7, 8, 9 aufrunden.', '3,476 ≈ 3,5 (auf Zehntel) · 3,476 ≈ 3,48 (auf Hundertstel)'],
      ],
      facts: ['Das Prozentzeichen % entstand aus der italienischen Abkürzung „per cento“ – irgendwann wurde daraus ein schräger Strich mit zwei Kringeln.', 'In England und den USA schreibt man einen Punkt statt eines Kommas: 3.5 statt 3,5.'],
      levels: [
        { title: 'Komma-Kunde', emoji: '🔢', gens: [gStellenwert, gBruchZuDez, gDezVergleich, gZahlenstrahl] },
        { title: 'Prozent-Profi', emoji: '💯', gens: [gProzentPaare, gProzentVon, gDezZuBruch, gProzentVon, gBruchZuDez] },
        { title: 'Verwandlungs-Meister', emoji: '🎭', gens: [gRunden, gProzentAnteil, gDezZuBruch, gDezVergleich, gRunden, gProzentPaare] },
      ],
    },
    {
      id: 'plusminus', title: 'Brüche: Plus & Minus', emoji: '➕', sub: 'Addieren und Subtrahieren von Brüchen und Dezimalzahlen',
      say: 'Merke: Man kann nur **gleich große Stücke** zusammenzählen. Drittel plus Viertel? Erst gleichnamig machen!',
      explain: [
        ['Gleiche Nenner', 'Zähler addieren (oder subtrahieren), der Nenner **bleibt gleich**.', '{2/7} + {3/7} = {5/7}'],
        ['Verschiedene Nenner', 'Erst beide Brüche auf den **Hauptnenner** (kgV der Nenner) erweitern, dann rechnen. Am Ende kürzen.', '{1/2} + {1/3} = {3/6} + {2/6} = {5/6}'],
        ['Gemischte Zahlen', 'Erst die Ganzen, dann die Brüche addieren.', '{1 1/2} + {2 1/4} = 3 + {3/4} = {3 3/4}'],
        ['Dezimalzahlen', 'Komma unter Komma schreiben, fehlende Stellen mit Nullen auffüllen.', '3,7 + 1,45 = 3,70 + 1,45 = 5,15'],
      ],
      facts: ['Der häufigste Bruch-Fehler der Welt: Zähler plus Zähler und Nenner plus Nenner. Wenn du das nicht machst, bist du schon besser als viele Erwachsene!'],
      levels: [
        { title: 'Gleiche Nenner', emoji: '🟰', gens: [gGleichnamig, gGleichnamig, gAddFehler, gGleichnamig] },
        { title: 'Hauptnenner-Jagd', emoji: '🎯', gens: [gUngleichnamig(['+']), gUngleichnamig(['−']), gUngleichnamig(), gAddFehler] },
        { title: 'Meister-Mix', emoji: '🏆', gens: [gAddSach, gGemischtAdd, gDezAdd, gUngleichnamig(), gDezAdd] },
      ],
    },
    {
      id: 'malgeteilt', title: 'Brüche: Mal & Geteilt', emoji: '✖️', sub: 'Multiplizieren und Dividieren von Brüchen und Dezimalzahlen',
      say: 'Gute Nachricht: Malnehmen ist bei Brüchen viel einfacher als Plus – kein Hauptnenner nötig!',
      explain: [
        ['Multiplizieren', '**Zähler mal Zähler, Nenner mal Nenner.** Wenn möglich vorher kürzen.\n„von“ bedeutet „mal“: {1/2} von {3/4} = {1/2} · {3/4}.', '{2/3} · {4/5} = {8/15}'],
        ['Dividieren', 'Durch einen Bruch teilen = **mit dem Kehrwert malnehmen**. Der Kehrwert ist der umgedrehte Bruch.', '{2/3} : {4/5} = {2/3} · {5/4} = {10/12} = {5/6}'],
        ['Komma verschieben', 'Mal 10, 100, 1000 → Komma nach **rechts**.\nDurch 10, 100, 1000 → Komma nach **links**.', '3,47 · 100 = 347  ·  52,3 : 10 = 5,23'],
        ['Dezimalzahlen multiplizieren', 'Erst ohne Komma rechnen. Das Ergebnis hat so viele Nachkommastellen wie beide Zahlen zusammen.', '0,3 · 0,4 → 3 · 4 = 12 → 0,12'],
      ],
      facts: ['Wenn du ein Blatt Papier 42-mal falten könntest (jedes Mal · 2), wäre der Stapel dicker als die Strecke zum Mond!'],
      levels: [
        { title: 'Mal-Zeit', emoji: '✖️', gens: [gMalZahl, gMalBruch, gMalWissen, gMalBruch] },
        { title: 'Kopfstand-Trick', emoji: '🤸', gens: [gKehrwert, gDurchBruch, gDurchZahl, gDurchBruch, gMalWissen] },
        { title: 'Komma-Akrobatik', emoji: '🎪', gens: [gKomma, gDezMal, gDezDurch, gMalSach, gKomma] },
      ],
    },
    {
      id: 'winkel', title: 'Winkel & Kreis', emoji: '📐', sub: 'Winkelarten, Schätzen, Messen, Kreis',
      say: 'Skater kennen Winkel längst: ein „180er“ ist eine halbe Drehung, ein „360er“ eine ganze!',
      explain: [
        ['Was ist ein Winkel?', 'Zwei Strahlen (**Schenkel**) mit gemeinsamem Anfangspunkt (**Scheitel**) bilden einen Winkel. Seine Größe misst man in Grad (°). Winkel heißen α, β, γ …', 'Eine ganze Drehung = 360°'],
        ['Winkelarten', '**spitz:** kleiner als 90°\n**recht:** genau 90°\n**stumpf:** zwischen 90° und 180°\n**gestreckt:** genau 180°\n**überstumpf:** zwischen 180° und 360°\n**Vollwinkel:** 360°', 'Ecke eines Heftes = rechter Winkel'],
        ['Messen mit dem Geodreieck', '1. Die Null der langen Seite auf den Scheitel legen.\n2. Die lange Seite auf einen Schenkel legen.\n3. Am anderen Schenkel die Skala ablesen – die, die bei 0 beginnt!\nTipp: Erst schätzen (spitz oder stumpf?), dann messen.', ''],
        ['Kreis', 'Alle Punkte auf einem Kreis sind gleich weit vom **Mittelpunkt** entfernt. Dieser Abstand heißt **Radius** r. Der **Durchmesser** d ist doppelt so lang.', 'r = 4 cm → d = 8 cm'],
      ],
      facts: ['Warum 360°? Die Babylonier rechneten vor 4000 Jahren mit der Zahl 60 – und 360 lässt sich durch sehr viele Zahlen teilen.', 'Eine Eule kann ihren Kopf um etwa 270° drehen – das ist ein überstumpfer Winkel!'],
      levels: [
        { title: 'Winkel-Detektiv', emoji: '🕵️', gens: [gWinkelArtBild, gWinkelArtZahl, gWinkelWissen, gWinkelArtBild] },
        { title: 'Augenmaß', emoji: '👁️', gens: [gSchaetzen, gUhr, gDrehung, gSchaetzen, gKreisMass] },
        { title: 'Dreh-Meister', emoji: '🛹', gens: [gErgaenzen, gKreisdiagramm, gUhr, gWinkelWissen, gErgaenzen] },
      ],
    },
    {
      id: 'flaechen', title: 'Flächen & Rauminhalt', emoji: '📦', sub: 'Dreieck, Parallelogramm, Quader, Einheiten',
      say: 'Wie viel Farbe braucht die Wand? Wie viel Wasser passt ins Aquarium? Mit Flächen und Volumen rechnest du es aus.',
      explain: [
        ['Rechteck', 'Flächeninhalt A = Länge · Breite.\nUmfang u = 2 · Länge + 2 · Breite.', '5 cm · 3 cm = 15 cm²'],
        ['Parallelogramm und Dreieck', 'Parallelogramm: **A = g · h** (Grundseite mal Höhe).\nDreieck: **A = g · h : 2** (die Hälfte davon).\nDie Höhe steht immer **senkrecht** auf der Grundseite.', 'Dreieck mit g = 6 cm, h = 4 cm → 12 cm²'],
        ['Quader und Würfel', 'Volumen **V = Länge · Breite · Höhe**.\nBeim Würfel: V = a · a · a.', '4 cm · 3 cm · 2 cm = 24 cm³'],
        ['Einheiten umrechnen', 'Flächen: Umrechnungszahl **100** (1 m² = 100 dm²).\nVolumen: Umrechnungszahl **1000** (1 m³ = 1000 dm³).\n1 dm³ = 1 Liter · 1 cm³ = 1 Milliliter.', ''],
      ],
      facts: ['Ein Fußballfeld ist etwa 7 000 m² groß. Der Bodensee hat eine Fläche von 536 km² – das sind ungefähr 75 000 Fußballfelder!', 'In einen Würfel mit 1 m Kantenlänge passen 1 000 Liter Wasser – er wäre dann eine Tonne schwer.'],
      levels: [
        { title: 'Flächen-Start', emoji: '🟦', gens: [gRechteck, gPara, gFlaechenWissen, gRueck] },
        { title: 'Dreiecks-Trick', emoji: '🔺', gens: [gDreieck, gPara, gEinheiten, gZusammen, gDreieck] },
        { title: 'Raum-Fahrt', emoji: '🚀', gens: [gQuader, gWuerfel, gLiter, gEinheiten, gFlaechenWissen] },
      ],
    },
    {
      id: 'negativ', title: 'Negative Zahlen', emoji: '🌡️', sub: 'Zahlengerade, Ordnen, Rechnen unter null',
      say: 'Brrr! Unter null wird es spannend: Minusgrade, Schulden, Tauchtiefen – alles negative Zahlen.',
      explain: [
        ['Die Zahlengerade', 'Links von der Null stehen die negativen Zahlen. Je weiter links, desto **kleiner**.', '−8 < −3 < 0 < 5'],
        ['Betrag und Gegenzahl', 'Der **Betrag** ist der Abstand zur Null (nie negativ).\nDie **Gegenzahl** liegt gleich weit weg auf der anderen Seite.', '|−7| = 7 · Gegenzahl von 4 ist −4'],
        ['Addieren und Subtrahieren', 'Plus → nach rechts gehen. Minus → nach links gehen.', '−3 + 8 = 5  ·  3 − 9 = −6  ·  −2 − 5 = −7'],
        ['Minus mal anders', 'Eine negative Zahl addieren = subtrahieren.\nEine negative Zahl subtrahieren = addieren.', '4 + (−3) = 1  ·  4 − (−3) = 7'],
      ],
      facts: ['Die kälteste jemals auf der Erde gemessene Temperatur: −89,2 °C in der Antarktis. In Baden-Württemberg lag der Rekord bei etwa −36 °C!', 'Das Tote Meer liegt über 400 m **unter** dem Meeresspiegel – der tiefste Ort an Land.'],
      levels: [
        { title: 'Unter null', emoji: '❄️', gens: [gNegStrahl, gNegVergleich, gNegOrdnen, gNegWissen] },
        { title: 'Thermometer-Rechnen', emoji: '🌡️', gens: [gTemp, gNegAdd(false), gTempDiff, gNegAdd(false), gKonto] },
        { title: 'Minus-Meister', emoji: '🧊', gens: [gNegAdd(true), gBetrag, gNegAdd(true), gKonto, gNegWissen] },
      ],
    },
    {
      id: 'daten', title: 'Daten & Mittelwert', emoji: '📊', sub: 'Diagramme, Mittelwert, Häufigkeiten',
      say: 'Wer Diagramme lesen kann, lässt sich nicht so leicht hereinlegen. Werde Daten-Detektiv!',
      explain: [
        ['Diagramme lesen', 'Säulendiagramm: Höhe der Säule = Anzahl. Immer zuerst die **Achsenbeschriftung** lesen!\nKreisdiagramm: zeigt Anteile an einem Ganzen.', ''],
        ['Kennwerte', '**Minimum** = kleinster Wert, **Maximum** = größter Wert.\n**Spannweite** = Maximum − Minimum.', 'Werte 3, 8, 5 → Spannweite 8 − 3 = 5'],
        ['Mittelwert', 'Alle Werte addieren und durch die Anzahl der Werte teilen.', '(4 + 6 + 8) : 3 = 6'],
        ['Absolute und relative Häufigkeit', '**Absolut:** die Anzahl (z. B. 5 Kinder).\n**Relativ:** der Anteil (5 von 20 = {1/4} = 25 %). Zum fairen Vergleichen braucht man die relative Häufigkeit.', ''],
      ],
      facts: ['Im Durchschnitt hat ein Mensch weniger als zwei Beine – weil manche Menschen nur eines haben. Der Mittelwert kann also ganz schön überraschen!'],
      levels: [
        { title: 'Diagramm-Leser', emoji: '📊', gens: [gChart, gChart, gSpannweite, gDatenWissen] },
        { title: 'Durchschnitts-Typ', emoji: '⚖️', gens: [gMittel, gSpannweite, gMittel, gChart, gDatenWissen] },
        { title: 'Daten-Detektiv', emoji: '🕵️', gens: [gRelH, gMittelFehlt, gRelH, gMittel, gDatenWissen] },
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
