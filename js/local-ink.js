// Voki-eigene Handschrifterkennung (Test) – für Geräte ohne eingebaute Erkennung, z. B. das iPad.
//
// Die Striche von der Schreibfläche werden als Bild gezeichnet und mit dem Texterkennungs-Modell
// PP-OCRv5 mobile (PaddleOCR, Apache-2.0) über ONNX Runtime Web (MIT) gelesen.
// Alles liegt in vendor/paddle/ und läuft nur auf dem Gerät. Beim ersten Benutzen werden
// ca. 18 MB geladen; der Service Worker behält sie danach (wie die Foto-Texterkennung).

const BASE = new URL('../vendor/paddle/', import.meta.url).href;
const H = 48; // Bildhöhe, die das Modell erwartet

// Nur Zeichen, die in Englisch, Französisch, Deutsch und Mathe vorkommen
// (das Modell kennt auch chinesische Schriftzeichen u. v. m. – die werden ausgeblendet).
const ALLOWED = new Set([
  ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  ...'äöüÄÖÜßéèêëàâçîïôùûœÉÈÊÀÂÇÎÔŒ',
  ...' \'’-.,?!/:()+=<>%',
]);

let loading = null;

function load() {
  if (!loading) {
    loading = (async () => {
      const ort = await import('../vendor/paddle/ort.wasm.min.mjs');
      ort.env.wasm.wasmPaths = BASE;
      ort.env.wasm.numThreads = 1; // mehrere Threads gehen nur mit besonderen Server-Einstellungen
      const [session, dictText] = await Promise.all([
        ort.InferenceSession.create(BASE + 'PP-OCRv5_mobile_rec_infer.onnx', { executionProviders: ['wasm'] }),
        fetch(BASE + 'ppocrv5_dict.txt').then((r) => {
          if (!r.ok) throw new Error('Wörterliste fehlt');
          return r.text();
        }),
      ]);
      // Klasse i = Zeile i der Liste (Klasse 0 = "leer"/CTC-Blank, letzte Zeile = Leerzeichen)
      const chars = dictText.split('\n').map((l) => l.replace(/\r$/, ''));
      const allowed = chars.map((c, i) => i > 0 && ALLOWED.has(c));
      return { ort, session, chars, allowed };
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

// Schon mal im Hintergrund laden, damit das erste „Prüfen“ nicht so lange dauert
export function preloadLocal() {
  load().catch(() => {});
}

// Striche ({x, y, t}-Punkte) als schwarze Schrift auf weißem Grund zeichnen,
// auf die Schrift zuschneiden und auf 48 px Höhe bringen.
function rasterize(strokes) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const s of strokes) for (const p of s) {
    if (p.x < x0) x0 = p.x;
    if (p.x > x1) x1 = p.x;
    if (p.y < y0) y0 = p.y;
    if (p.y > y1) y1 = p.y;
  }
  let w = x1 - x0;
  let h = y1 - y0;
  // Sehr flache Schrift (z. B. „-“ oder „no“) nicht riesig aufblasen
  const minH = Math.max(40, w / 12);
  if (h < minH) { y0 -= (minH - h) / 2; h = minH; }
  const lw = Math.min(14, Math.max(3, h / 14));
  const pad = lw + h * 0.12;
  x0 -= pad; y0 -= pad; w += 2 * pad; h += 2 * pad;

  const scale = H / h;
  const W = Math.min(3200, Math.max(H, Math.round(w * scale)));
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.setTransform(W / w, 0, 0, scale, -x0 * (W / w), -y0 * scale);
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lw;
  for (const s of strokes) {
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y + 0.1);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }
  const px = ctx.getImageData(0, 0, W, H).data;
  const data = new Float32Array(3 * H * W);
  for (let i = 0; i < H * W; i++) {
    const v = px[i * 4] / 127.5 - 1;
    data[i] = v;
    data[H * W + i] = v;
    data[2 * H * W + i] = v;
  }
  return { data, W };
}

// CTC-Strahlsuche: liefert die wahrscheinlichsten Lesarten (beste zuerst).
function decode(probs, T, C, chars, allowed, beamWidth = 6, n = 5) {
  const TOP = 4;
  let beams = new Map([['', { b: 1, nb: 0, last: 0 }]]);
  const row = new Float32Array(C);
  for (let t = 0; t < T; t++) {
    // Wahrscheinlichkeiten dieses Zeitschritts (nur erlaubte Zeichen), neu normiert
    let sum = probs[t * C];
    row[0] = sum;
    for (let k = 1; k < C; k++) {
      const v = allowed[k] ? probs[t * C + k] : 0;
      row[k] = v;
      sum += v;
    }
    const blank = row[0] / sum;
    const top = [];
    for (let k = 1; k < C; k++) {
      if (!row[k]) continue;
      if (top.length < TOP || row[k] > top[top.length - 1][1]) {
        top.push([k, row[k]]);
        top.sort((a, b) => b[1] - a[1]);
        if (top.length > TOP) top.pop();
      }
    }
    const next = new Map();
    const add = (prefix, last, b, nb) => {
      const e = next.get(prefix) || { b: 0, nb: 0, last };
      e.b += b;
      e.nb += nb;
      e.last = last;
      next.set(prefix, e);
    };
    for (const [prefix, { b, nb, last }] of beams) {
      add(prefix, last, (b + nb) * blank, 0);
      for (const [k, p] of top) {
        const q = p / sum;
        if (q < 0.001) continue;
        if (k === last) {
          add(prefix, k, 0, nb * q); // gleiches Zeichen ohne Lücke = dasselbe Zeichen
          add(prefix + chars[k], k, 0, b * q); // nach einer Lücke = doppeltes Zeichen
        } else {
          add(prefix + chars[k], k, 0, (b + nb) * q);
        }
      }
    }
    beams = new Map([...next].sort((a, c) => (c[1].b + c[1].nb) - (a[1].b + a[1].nb)).slice(0, beamWidth));
    // Gegen Unterlauf bei langen Sätzen
    const best = [...beams.values()][0];
    const norm = best.b + best.nb;
    if (norm > 0 && norm < 1e-30) for (const e of beams.values()) { e.b /= norm; e.nb /= norm; }
  }
  const out = [];
  for (const prefix of beams.keys()) {
    const t = prefix.replace(/\s+/g, ' ').trim();
    if (t && !out.includes(t)) out.push(t);
  }
  return out.slice(0, n);
}

// Liefert eine Liste von Kandidaten, der wahrscheinlichste zuerst.
// oneWord: Die Antwort ist ein einzelnes Wort – dann zählen Lücken in der Schrift nicht als Leerzeichen
// (das Modell liest bei etwas Abstand zwischen zwei Buchstaben sonst z. B. „swim ming“).
export async function recognizeLocal(strokes, { oneWord = false } = {}) {
  const { ort, session, chars, allowed } = await load();
  const { data, W } = rasterize(strokes);
  const out = await session.run({ [session.inputNames[0]]: new ort.Tensor('float32', data, [1, 3, H, W]) });
  const o = out[session.outputNames[0]];
  const [, T, C] = o.dims;
  let probs = o.data;
  // Falls das Modell keine Wahrscheinlichkeiten liefert: Softmax
  if (probs[0] < 0 || probs[0] > 1) {
    probs = new Float32Array(probs);
    for (let t = 0; t < T; t++) {
      let m = -Infinity;
      for (let k = 0; k < C; k++) m = Math.max(m, probs[t * C + k]);
      let s = 0;
      for (let k = 0; k < C; k++) s += (probs[t * C + k] = Math.exp(probs[t * C + k] - m));
      for (let k = 0; k < C; k++) probs[t * C + k] /= s;
    }
  }
  const cands = decode(probs, T, C, chars, allowed);
  return oneWord ? [...new Set(cands.map((c) => c.replace(/ /g, '')))] : cands;
}
