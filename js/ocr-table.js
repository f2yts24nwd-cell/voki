// Macht aus den erkannten Wörtern eines Fotos (mit ihrer Position) eine Vokabel-Tabelle.
// Reine Rechenlogik ohne Bildschirm – lässt sich deshalb auch ohne Browser testen.
//
// Vokabelseiten im Schulbuch sind fast immer Tabellen: links das Wort, in der Mitte oft
// Lautschrift oder ein Beispielsatz, rechts die deutsche Bedeutung. Die Texterkennung liefert
// zu jedem Wort ein Rechteck (bbox). Daraus werden hier
//   1. Zeilen   – Wörter, die auf gleicher Höhe stehen,
//   2. Spalten  – senkrechte Streifen, in denen (fast) kein Wort steht, trennen die Spalten,
//   3. Einträge – Zeilen ohne Fremdwort gehören noch zum Eintrag darüber (umgebrochene Bedeutung).

const median = (arr) => {
  if (!arr.length) return 0;
  const a = [...arr].sort((x, y) => x - y);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

// Lautschrift erkennt man an eckigen Klammern oder typischen IPA-Zeichen.
const IPA_CHARS = /[ˈˌːəɪʊʌæɒɔθðŋʃʒɜɑɐɛœøʁ]/;
const GERMAN_WORDS = /(^|[\s(])(der|die|das|den|dem|des|ein|eine|einen|einem|sich|etw\.?|jdn\.?|jdm\.?|jmd\.?|und|oder|nicht|mit|von|zu|auf|im|in|ist|sein|haben)(?=$|[\s),.;])/gi;
const GERMAN_CHARS = /[äöüßÄÖÜ]/g;
const FOREIGN_WORDS = /(^|[\s(])(the|a|an|to|of|sb\.?|sth\.?|is|are|you|your|le|la|les|l'|un|une|des|du|de|et|est|il|elle|je|tu|qn|qc|ce|ça)(?=$|[\s),.;])/gi;
const FRENCH_CHARS = /[éèêàâçîïôûùœë]/g;

// Typische Lesefehler, die sich aus dem Zusammenhang sicher erkennen lassen.
function fixCommon(text) {
  let t = String(text);
  // Das "l" mancher Schulbuch-Schriften hat unten einen Haken und wird als "j" gelesen:
  // "ja ville [lavil]" – beginnt die Lautschrift mit "l", war es "la"/"le".
  t = t.replace(/^[jJ]([ae])(\s*\S+\s*[\[{(|]\s*l)/, 'l$1$2');
  t = t.replace(/^ja\s/, 'la '); // "ja" gibt es im Französischen und Englischen nicht
  return t;
}

// Säubert den Text einer Zelle.
export function cleanCell(text) {
  return fixCommon(text)
    .replace(/[’‘`´]/g, "'")
    .replace(/[„“”«»]/g, '"')
    .replace(/\[[^\]]*(\]|$)/g, ' ') // [ˈzuː kiːpə] – Lautschrift
    .replace(/[{(|]\s*[^\s\]\[(){}]*\]/g, ' ') // falsch gelesene Klammer: {latur]
    .replace(/^[^\[\]]*\]\s*/, '') // Rest umgebrochener Lautschrift: "sẽpatik] m./f."  ("]" steht in keiner Vokabel)
    .replace(/(^|\s)\/[^/\s][^/]*\/(?=\s|$)/g, (m) => (IPA_CHARS.test(m) ? ' ' : m)) // /ˈzuː/
    // Grammatik-Kürzel aus dem Wörterverzeichnis (m. = männlich, adv. = Adverb, fam. = umgangssprachlich …)
    .replace(/(^|\s)(m\.\s*\/\s*f\.|m\.|f\.|adj\.|adv\.|fam\.|inv\.|pl\.|\(p[l1I|/]\)|\(f\)|\(m\))(?=\s|$|,)/g, ' ')
    .replace(/^[\s•·▪■▶►▸→➝*–—-]+/, '') // Aufzählungszeichen, Pfeile
    .replace(/^\d{1,3}[.)]?\s+(?=\D)/, '') // "12. " Nummerierung, Randnummern im Buch
    .replace(/^['‘’`´,."]+(?=\w)/, '') // Fleck vor dem Wort
    .replace(/\s*;\s*/g, ', ') // ";" trennt in Voki den Hinweis ab
    .replace(/=/g, ':')
    .replace(/\s+/g, ' ')
    .replace(/^[,.:\s]+|[,:\s]+$/g, '')
    .trim();
}

function score(texts, re) {
  let n = 0;
  for (const t of texts) n += (t.match(re) || []).length;
  return n;
}

// Sagt grob, welche Spalte was enthält. Liefert { foreign, german, hint } als Spalten-Index (oder -1).
export function guessRoles(table) {
  const n = table.columns;
  if (n <= 1) return { foreign: 0, german: -1, hint: -1 };
  const rows = table.rows;
  const info = [];
  for (let c = 0; c < n; c++) {
    const cells = rows.map((r) => r.cells[c]?.raw || '').filter(Boolean);
    const fill = cells.length / Math.max(1, rows.length);
    const ipa = cells.filter((t) => /^\s*\[/.test(t) || IPA_CHARS.test(t)).length / Math.max(1, cells.length);
    const words = median(cells.map((t) => t.split(/\s+/).length));
    const sentences = cells.filter((t) => /[.!?]$/.test(t.trim()) && t.split(/\s+/).length >= 4).length / Math.max(1, cells.length);
    const german = (score(cells, GERMAN_CHARS) * 2 + score(cells, GERMAN_WORDS)) / Math.max(1, cells.length);
    const foreign = (score(cells, FOREIGN_WORDS) + score(cells, FRENCH_CHARS) * 2) / Math.max(1, cells.length);
    info.push({ c, fill, ipa, words, sentences, german, foreign });
  }
  // Kandidaten: gut gefüllt, keine Lautschrift, keine langen Beispielsätze
  let cand = info.filter((i) => i.fill >= 0.3 && i.ipa < 0.5 && i.sentences < 0.5);
  if (cand.length < 2) cand = info.filter((i) => i.fill >= 0.3 && i.ipa < 0.5);
  if (cand.length < 2) cand = [...info];
  // Normalfall: linke Spalte Fremdsprache, Deutsch ist die am besten gefüllte Spalte rechts davon
  // (Beispielsätze und Bemerkungen stehen nur bei manchen Wörtern).
  let foreign = cand[0];
  const rest = cand.slice(1);
  const maxFill = Math.max(...rest.map((i) => i.fill));
  let german = rest.find((i) => i.fill >= maxFill * 0.8) || cand[cand.length - 1];
  // Ausnahme: Deutsch steht links (deutlich mehr Umlaute/deutsche Wörter)
  const lead = (i) => i.german - i.foreign;
  if (lead(foreign) > lead(german) + 0.4) [foreign, german] = [german, foreign];
  // Hinweis: eine Spalte mit Beispielsätzen bleibt zunächst aus (kann man einschalten)
  return { foreign: foreign.c, german: german.c, hint: -1 };
}

// Teilt eine Zeile (eine Spalte) an "=", " - ", ";" oder Tabulator in zwei Teile.
function splitInline(text) {
  const m = text.split(/\t|\s*=\s*|\s+[-–—]\s+|\s*;\s*|\s{3,}/);
  return m.length >= 2 && m[0] && m[1] ? [m[0], m.slice(1).join(' ')] : null;
}

// words: [{ text, confidence, bbox: { x0, y0, x1, y1 }, line }] – line: Nummer der Zeile laut Texterkennung
export function buildTable(words) {
  const ws = words
    .map((w) => ({ ...w, text: String(w.text || '').trim() }))
    .filter((w) => w.text && w.bbox && w.bbox.x1 > w.bbox.x0 && w.bbox.y1 > w.bbox.y0)
    // Krümel (Linienreste, Schmutz, Bildränder) weglassen: kurz und unsicher erkannt
    .filter((w) => {
      const run = Math.max(0, ...(w.text.match(/[a-zà-ÿßœ]+/gi) || []).map((m) => m.length));
      if (run < 2 && w.confidence < 80 && !/^[?!.,…]+$/.test(w.text)) return false;
      if (run < 3 && w.confidence < 50) return false;
      if (run < 4 && w.confidence < 35) return false;
      return true;
    });
  // Doppelt gemeldete Stücke (ein Wort steckt fast ganz in einem anderen) weglassen
  const area = (b) => (b.x1 - b.x0) * (b.y1 - b.y0);
  const inside = (a, b) => {
    const ix = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
    const iy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
    return ix > 0 && iy > 0 ? (ix * iy) / area(a) : 0;
  };
  for (let i = ws.length - 1; i >= 0; i--) {
    const t = ws[i].text.toLowerCase().replace(/[^a-zà-ÿß]/g, '');
    const ai = area(ws[i].bbox);
    if (ws.some((o, j) => j !== i && (area(o.bbox) > ai || (area(o.bbox) === ai && j < i)) && inside(ws[i].bbox, o.bbox) > 0.6
      && o.text.toLowerCase().includes(t))) ws.splice(i, 1);
  }
  if (!ws.length) return { columns: 0, rows: [], lineHeight: 0, slope: 0 };

  const h = median(ws.map((w) => w.bbox.y1 - w.bbox.y0)) || 10;

  // ---- 0. Schräglage: Ist das Foto leicht gedreht, liegen die Wörter einer Zeile nicht auf
  //         gleicher Höhe. Die Neigung wird aus den Zeilen der Texterkennung geschätzt und
  //         herausgerechnet (kleine Drehung aller Wort-Rechtecke).
  const byLine = new Map();
  for (const w of ws) if (w.line != null) byLine.set(w.line, [...(byLine.get(w.line) || []), w]);
  const slopes = [];
  for (const lw of byLine.values()) {
    if (lw.length < 2) continue;
    const pts = lw.map((w) => [(w.bbox.x0 + w.bbox.x1) / 2, w.bbox.y1]);
    const span = Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
    if (span < h * 4) continue;
    const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    let num = 0;
    let den = 0;
    for (const [x, y] of pts) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
    if (den) slopes.push(num / den);
  }
  const slope = slopes.length >= 2 ? Math.max(-0.15, Math.min(0.15, median(slopes))) : 0;
  if (slope) {
    for (const w of ws) {
      const xc = (w.bbox.x0 + w.bbox.x1) / 2;
      const yc = (w.bbox.y0 + w.bbox.y1) / 2;
      const dx = slope * yc;
      const dy = -slope * xc;
      w.orig = w.bbox;
      w.bbox = { x0: w.bbox.x0 + dx, x1: w.bbox.x1 + dx, y0: w.bbox.y0 + dy, y1: w.bbox.y1 + dy };
    }
  }
  for (const w of ws) w.yc = (w.bbox.y0 + w.bbox.y1) / 2;

  // ---- 1. Zeilen: nach Höhe sortieren und zusammenfassen ----
  ws.sort((a, b) => a.yc - b.yc);
  const lines = [];
  for (const w of ws) {
    const line = lines[lines.length - 1];
    if (line && Math.abs(w.yc - line.yc) < h * 0.55) {
      line.words.push(w);
      line.yc = line.words.reduce((s, x) => s + x.yc, 0) / line.words.length;
    } else {
      lines.push({ yc: w.yc, words: [w] });
    }
  }
  for (const l of lines) {
    l.words.sort((a, b) => a.bbox.x0 - b.bbox.x0);
    // Für den Bildstreifen zählen die echten (ungedrehten) Positionen
    l.y0 = Math.min(...l.words.map((w) => (w.orig || w.bbox).y0));
    l.y1 = Math.max(...l.words.map((w) => (w.orig || w.bbox).y1));
  }

  // ---- 2. Spalten ----
  // Die Spalten im Vokabelteil sind linksbündig: Viele Zeilen beginnen an (fast) derselben Stelle.
  // Gesucht werden deshalb Häufungen von Wortanfängen – am Zeilenanfang oder nach einer großen Lücke.
  // (Eine durchgehend leere Lücke zwischen den Spalten gibt es bei schrägen Fotos oft nicht.)
  const starts = [];
  for (const l of lines) {
    l.words.forEach((w, i) => {
      const prev = l.words[i - 1];
      if (!prev || w.bbox.x0 - prev.bbox.x1 > h * 1.2) starts.push(w.bbox.x0);
    });
  }
  starts.sort((p, q) => p - q);
  let clusters = [];
  for (const x of starts) {
    const cl = clusters[clusters.length - 1];
    if (cl && x - cl[cl.length - 1] < h * 0.8) cl.push(x);
    else clusters.push([x]);
  }
  const support = Math.max(2, lines.length * 0.12);
  clusters = clusters.filter((cl) => cl.length >= support);
  // Zu nah beieinander (weniger als 3 Zeichenhöhen)? Dann ist es dieselbe Spalte.
  const colStarts = [];
  for (const cl of clusters) {
    const lo = cl[Math.floor(cl.length * 0.1)];
    const last = colStarts[colStarts.length - 1];
    if (last && lo - last.hi < h * 3) {
      if (cl.length > last.n) Object.assign(last, { lo, hi: cl[cl.length - 1], n: cl.length });
    } else {
      colStarts.push({ lo, hi: cl[cl.length - 1], n: cl.length });
    }
  }
  // Die erste Spalte beginnt links; Spaltengrenze knapp vor jedem weiteren Spaltenanfang
  const cuts = colStarts.slice(1).map((c) => c.lo - h * 0.4);
  const columnOf = (w) => {
    let c = 0;
    while (c < cuts.length && w.bbox.x0 >= cuts[c]) c++;
    return c;
  };
  const columns = cuts.length + 1;

  // ---- 3. Textzeilen je Spalte ----
  // Jede Spalte wird für sich in Zeilen zerlegt (innerhalb einer Spalte stört die Schräglage kaum).
  const cols = Array.from({ length: columns }, () => []);
  for (const w of ws) w.col = columnOf(w);
  for (let c = 0; c < columns; c++) {
    const cw = ws.filter((w) => w.col === c).sort((x, y) => x.yc - y.yc);
    for (const w of cw) {
      const it = cols[c][cols[c].length - 1];
      if (it && Math.abs(w.yc - it.y) < h * 0.5) {
        it.words.push(w);
        it.y = it.words.reduce((sum, x) => sum + x.yc, 0) / it.words.length;
      } else {
        cols[c].push({ y: w.yc, words: [w] });
      }
    }
  }

  // ---- 4. Spalten nebeneinanderlegen ----
  // Ist die Seite gewölbt oder schräg fotografiert, steht die deutsche Bedeutung nicht exakt auf
  // gleicher Höhe wie das Fremdwort. Deshalb werden die Zeilen jeder Spalte der Reihe nach mit der
  // Hauptspalte abgeglichen (wie beim Vergleichen zweier Listen): Die Reihenfolge bleibt erhalten,
  // und ein langsam wachsender Höhenversatz wird mitgeschätzt.
  const most = Math.max(...cols.map((c) => c.length));
  const anchor = cols.findIndex((c) => c.length >= most * 0.6);
  const A = cols[anchor];
  const diffs = [];
  for (let i = 1; i < A.length; i++) if (A[i].y - A[i - 1].y > h * 0.8) diffs.push(A[i].y - A[i - 1].y);
  const pitch = Math.max(h * 1.3, median(diffs) || h * 2);

  const align = (B, offsetAt) => {
    // dp[i][j]: kleinste Kosten für A[0..i) und B[0..j)
    const n = A.length;
    const m = B.length;
    const SKIP = 0.45;
    const dp = Array.from({ length: n + 1 }, () => new Float64Array(m + 1).fill(Infinity));
    const how = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
    dp[0][0] = 0;
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        const cur = dp[i][j];
        if (cur === Infinity) continue;
        if (i < n && cur + SKIP < dp[i + 1][j]) { dp[i + 1][j] = cur + SKIP; how[i + 1][j] = 1; }
        if (j < m && cur + SKIP < dp[i][j + 1]) { dp[i][j + 1] = cur + SKIP; how[i][j + 1] = 2; }
        if (i < n && j < m) {
          const d = (A[i].y - B[j].y - offsetAt(A[i].y)) / pitch;
          if (Math.abs(d) < 0.7) {
            const cost = cur + d * d;
            if (cost < dp[i + 1][j + 1]) { dp[i + 1][j + 1] = cost; how[i + 1][j + 1] = 3; }
          }
        }
      }
    }
    const pairs = [];
    for (let i = n, j = m; i > 0 || j > 0;) {
      const k = how[i][j];
      if (k === 3) { pairs.push([i - 1, j - 1]); i--; j--; } else if (k === 1) i--; else j--;
    }
    return { pairs: pairs.reverse(), cost: dp[n][m] };
  };

  const match = cols.map(() => new Map()); // Spalte -> (Index in A -> Index in B)
  const offsets = cols.map(() => () => 0);
  for (let c = 0; c < columns; c++) {
    if (c === anchor) continue;
    const B = cols[c];
    // 1. Grob: den besten Versatz suchen – gleichbleibend oder gleichmäßig wachsend
    //    (höchstens eine gute halbe Zeile, über die ganze Höhe höchstens eine Zeile Unterschied)
    const yMid = (A[0].y + A[A.length - 1].y) / 2;
    const span = Math.max(1, A[A.length - 1].y - A[0].y);
    let best = null;
    for (let k = -6; k <= 6; k++) {
      for (let t = -4; t <= 4; t++) {
        const d0 = (k / 10) * pitch;
        const slope = ((t / 4) * pitch) / span;
        const r = align(B, (y) => d0 + slope * (y - yMid));
        if (!best || r.cost < best.cost) best = r;
      }
    }
    let pairs = best.pairs;
    // 2. Versatz als Gerade über die Seite (schräg fotografiert), 3. örtlich verfeinert (gewölbte Seite)
    if (pairs.length >= 3) {
      const pts = pairs.map(([i, j]) => [A[i].y, A[i].y - B[j].y]);
      const mx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
      const my = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
      let num = 0;
      let den = 0;
      for (const [x, y] of pts) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
      const b = den ? num / den : 0;
      const line = (y) => my + b * (y - mx);
      offsets[c] = line;
      pairs = align(B, line).pairs;
    }
    if (pairs.length >= 5) {
      const pts = pairs.map(([i, j]) => [A[i].y, A[i].y - B[j].y]);
      const local = (y) => median([...pts].sort((p, q) => Math.abs(p[0] - y) - Math.abs(q[0] - y)).slice(0, 5).map((p) => p[1]));
      const r = align(B, local);
      if (r.pairs.length >= pairs.length) { pairs = r.pairs; offsets[c] = local; }
    }
    for (const [i, j] of pairs) match[c].set(i, j);
  }

  // ---- 5. Tabellenzeilen ----
  const rows = [];
  const used = cols.map(() => new Set());
  const cell = (its) => {
    const wsOf = its.flatMap((it) => it.words).sort((x, y) => x.bbox.x0 - y.bbox.x0);
    // Gelb markieren nur, wenn ein Wort unsicher ist, das auch übrig bleibt (nicht die Lautschrift)
    const low = wsOf.some((w) => w.confidence < 70 && !/[[\]{}]/.test(w.text) && cleanCell(w.text));
    return { raw: wsOf.map((w) => w.text).join(' '), low };
  };
  const box = (its) => {
    const all = its.flatMap((it) => it.words).map((w) => w.orig || w.bbox);
    return { y0: Math.min(...all.map((b) => b.y0)), y1: Math.max(...all.map((b) => b.y1)) };
  };
  A.forEach((it, i) => {
    const parts = Array.from({ length: columns }, () => []);
    parts[anchor].push(it);
    for (let c = 0; c < columns; c++) {
      if (c === anchor || !match[c].has(i)) continue;
      const j = match[c].get(i);
      parts[c].push(cols[c][j]);
      used[c].add(j);
    }
    rows.push({ y: it.y, ...box(parts.flat()), cells: parts.map(cell) });
  });
  // Zeilen der anderen Spalten ohne Partner (z. B. umgebrochene Bedeutung) als eigene Zeile
  for (let c = 0; c < columns; c++) {
    if (c === anchor) continue;
    cols[c].forEach((it, j) => {
      if (used[c].has(j)) return;
      const parts = Array.from({ length: columns }, () => []);
      parts[c].push(it);
      rows.push({ y: it.y + offsets[c](it.y), ...box([it]), cells: parts.map(cell) });
    });
  }
  rows.sort((p, q) => p.y - q.y);

  const table = { columns, rows, lineHeight: h, slope };

  // Nur eine Spalte? Vielleicht steht alles in einer Zeile: "giraffe = Giraffe"
  if (columns === 1) {
    const split = rows.map((r) => splitInline(r.cells[0].raw));
    if (split.filter(Boolean).length >= rows.length * 0.5) {
      table.columns = 2;
      rows.forEach((r, i) => {
        const [a, b] = split[i] || [r.cells[0].raw, ''];
        r.cells = [{ raw: a, low: r.cells[0].low }, { raw: b, low: r.cells[0].low }];
      });
    }
  }
  return table;
}

// Macht aus der Tabelle die Vokabel-Einträge. Zeilen ohne Fremdwort werden an den Eintrag
// darüber angehängt (die deutsche Bedeutung ist umgebrochen).
export function tableToEntries(table, roles) {
  const get = (r, c) => (c >= 0 && r.cells[c] ? r.cells[c] : { raw: '', low: false });
  const entries = [];
  for (const r of table.rows) {
    const f = get(r, roles.foreign);
    const g = get(r, roles.german);
    const hi = get(r, roles.hint);
    const fText = cleanCell(f.raw);
    const gText = cleanCell(g.raw);
    const hText = cleanCell(hi.raw);
    const prev = entries[entries.length - 1];
    if (!fText && prev && (gText || hText)) {
      const join = (a, b) => {
        if (!a || !b) return a || b;
        if (/\/$/.test(a)) return a + b; // "Mitschüler/" + "in"
        if (/[a-zäöüß]-$/.test(a) && /^[a-zäöüß]/.test(b)) return a.slice(0, -1) + b; // Silbentrennung
        return `${a} ${b}`;
      };
      prev.de = join(prev.de, gText);
      prev.hint = join(prev.hint, hText);
      prev.lowDe ||= g.low;
      prev.y1 = r.y1;
      continue;
    }
    if (!fText && !gText) continue;
    // Überschriften wie "Unit 3" oder "Station 2" weglassen, wenn rechts nichts steht
    entries.push({ fremd: fText, de: gText, hint: hText, lowFremd: f.low, lowDe: g.low, y0: r.y0, y1: r.y1 });
  }
  return entries;
}
