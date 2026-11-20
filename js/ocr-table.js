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

// Säubert den Text einer Zelle.
export function cleanCell(text) {
  return String(text)
    .replace(/[’‘`´]/g, "'")
    .replace(/[„“”«»]/g, '"')
    .replace(/\[[^\]]*\]?/g, ' ') // [ˈzuː kiːpə] – Lautschrift
    .replace(/(^|\s)\/[^/\s][^/]*\/(?=\s|$)/g, (m) => (IPA_CHARS.test(m) ? ' ' : m)) // /ˈzuː/
    .replace(/^[\s•·▪■▶►▸→➝*–—-]+/, '') // Aufzählungszeichen, Pfeile
    .replace(/^\d{1,3}[.)]\s+/, '') // "12. " Nummerierung
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
  // Normalfall: linke Spalte Fremdsprache, rechte Deutsch
  let foreign = cand[0];
  let german = cand[cand.length - 1];
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
    // Einzelne Krümel (Schmutz, Ränder) mit sehr niedriger Sicherheit weglassen
    .filter((w) => !(w.confidence < 30 && w.text.length <= 2 && !/[a-zà-ÿ]{2}/i.test(w.text)));
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

  // ---- 2. Spalten: Lücken im senkrechten "Schatten" aller Wörter ----
  const minX = Math.floor(Math.min(...ws.map((w) => w.bbox.x0)));
  const maxX = Math.ceil(Math.max(...ws.map((w) => w.bbox.x1)));
  const cover = new Uint16Array(maxX - minX + 1);
  for (const w of ws) {
    for (let x = Math.floor(w.bbox.x0); x < Math.ceil(w.bbox.x1); x++) cover[x - minX]++;
  }
  // Ein paar Ausreißer (ein langer Beispielsatz ragt in die Nachbarspalte) sind erlaubt.
  const allowed = Math.floor(lines.length * 0.06);
  const minGap = h * 1.1;
  let gaps = [];
  let start = -1;
  for (let i = 0; i <= cover.length; i++) {
    const free = i < cover.length && cover[i] <= allowed;
    if (free && start < 0) start = i;
    if (!free && start >= 0) {
      if (i - start >= minGap && start > 0) gaps.push({ x: minX + (start + i) / 2, width: i - start });
      start = -1;
    }
  }
  // Höchstens 5 Spalten – die breitesten Lücken gewinnen
  if (gaps.length > 4) gaps = gaps.sort((a, b) => b.width - a.width).slice(0, 4);
  // Lücken, die kaum eine Zeile wirklich trennen (Wörter auf beiden Seiten), zählen nicht
  gaps = gaps.filter((g) => {
    const split = lines.filter((l) => l.words.some((w) => w.bbox.x1 <= g.x) && l.words.some((w) => w.bbox.x0 >= g.x)).length;
    return split >= Math.max(1, lines.length * 0.2);
  });
  const cuts = gaps.map((g) => g.x).sort((a, b) => a - b);
  const columnOf = (w) => {
    const xc = (w.bbox.x0 + w.bbox.x1) / 2;
    let c = 0;
    while (c < cuts.length && xc > cuts[c]) c++;
    return c;
  };

  // ---- 3. Zellen ----
  const columns = cuts.length + 1;
  const rows = lines.map((l) => {
    const cells = Array.from({ length: columns }, () => ({ words: [] }));
    for (const w of l.words) cells[columnOf(w)].words.push(w);
    return {
      y0: l.y0,
      y1: l.y1,
      cells: cells.map((c) => ({
        raw: c.words.map((w) => w.text).join(' '),
        low: c.words.some((w) => w.confidence < 70),
      })),
    };
  });

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
