// Vokabeln gegen ein offenes Wörterbuch prüfen – komplett auf dem Gerät.
//
// Quelle: Wiktionary (deutsches und englisches Wiktionary, aufbereitet von wiktextract/kaikki.org),
// Lizenz CC BY-SA 4.0. Die Wörterbücher liegen in vendor/dict/ (gebaut mit tools/build-dict.py).
//
// Geprüft wird je Eintrag:
//   1. Rechtschreibung des Fremdworts   – steht es im Wörterbuch? Sonst ähnliches Wort vorschlagen
//                                          ("cinema" ➜ "cinéma", "lethéâtre" ➜ "le théâtre")
//   2. Übersetzung                      – passt das deutsche Wort zu einer Bedeutung im Wörterbuch?
//   3. Deutsche Rechtschreibung         – liegt es knapp daneben ("schon" ➜ "schön")?
//   4. Artikel                          – le/la passend zum Geschlecht, der/die/das passend zum Nomen
//
// Das Ergebnis ist ein Hinweis, keine Bewertung: Schulbücher übersetzen oft freier als ein Wörterbuch.

import { variants } from './check.js';

const cache = {};

// Lädt das Wörterbuch einer Sprache ('en' | 'fr'), entpackt es und baut die Suchhilfen.
export function loadDict(lang) {
  if (!cache[lang]) {
    cache[lang] = (async () => {
      const res = await fetch(new URL(`../vendor/dict/${lang}-de.json.gz`, import.meta.url));
      if (!res.ok) throw new Error('Wörterbuch nicht gefunden');
      const raw = await res.arrayBuffer();
      const json = await gunzipJson(raw);
      return prepareDict(json);
    })();
    cache[lang].catch(() => { delete cache[lang]; });
  }
  return cache[lang];
}

async function gunzipJson(buf) {
  const bytes = new Uint8Array(buf);
  // Manche Server liefern .gz schon entpackt aus (Content-Encoding) – dann ist es direkt JSON.
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return JSON.parse(new TextDecoder().decode(bytes));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}

// Auch für Tests ohne Browser: aus dem JSON die Suchstrukturen bauen.
export function prepareDict(json) {
  const byLen = new Map(); // Länge -> [Wort] für die Ähnlichkeitssuche
  const add = (w) => {
    const k = fold(w).length;
    if (!byLen.has(k)) byLen.set(k, []);
    byLen.get(k).push(w);
  };
  for (const w of Object.keys(json.e)) add(w);
  for (const w of Object.keys(json.f)) add(w);
  const folded = new Map(); // ohne Akzente -> Schreibweise im Wörterbuch
  for (const w of [...Object.keys(json.e), ...Object.keys(json.f)]) {
    const k = fold(w);
    if (!folded.has(k)) folded.set(k, w);
  }
  return { lang: json.lang, source: json.source, date: json.date, e: json.e, f: json.f, byLen, folded };
}

// ---------- Hilfsfunktionen ----------

// Kleinbuchstaben, Akzente und Umlaute weg (für "fast gleich")
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/œ/g, 'oe');

function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

const FR_ART = /^(?:(le|la|les|un|une|des|du|de la)\s+|(l'|d'|de l'))/i;
const EN_ART = /^(to|a|an|the)\s+/i;
const DE_ART = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/i;
const OBJ = /\s+(sb|sth|so|somebody|something|qn|qc|qch|quelqu'un|quelque chose)\.?(?=\s|$)/gi;

// Fremdwort ➜ Suchschlüssel(n) im Wörterbuch
function foreignKeys(text, lang) {
  const out = [];
  for (const v of variants(text)) {
    let t = v.toLowerCase().replace(/[’`´]/g, "'").replace(/[!?.…:;"„“«»]+/g, ' ').replace(/\s+/g, ' ').trim();
    let article = '';
    if (lang === 'fr') {
      const m = t.match(FR_ART);
      if (m) { article = (m[1] || m[2]).toLowerCase(); t = t.slice(m[0].length); }
    } else {
      t = t.replace(EN_ART, '');
    }
    t = t.replace(OBJ, '').trim();
    if (t) out.push({ key: t, article });
    else if (article) out.push({ key: article.replace(/'$/, ''), article: '' }); // "un" = eins
    // Französisch: Pronomen mit Apostroph ("j'habite", "il s'appelle") ➜ auch das Verb allein suchen
    const verb = lang === 'fr' && t.match(/^(?:(?:je|tu|il|elle|on|nous|vous|ils|elles)\s+)?(?:j|m|t|s|n|c)'(\S+)$/);
    if (verb) out.push({ key: verb[1], article: '' });
  }
  return out;
}

// Deutsche Übersetzung bzw. Wörterbuch-Bedeutung ➜ vergleichbare Teile
const DE_STOP = /(?<!\p{L})(sich|jdn|jdm|jds|jmdn|jmdm|jemanden|jemandem|jemandes|etw|etwas|zu|von|mit|um|an|auf|für|in|im|am|der|die|das|den|dem|des|ein|eine|einen|einem|einer)(?!\p{L})\.?/gu;
function germanParts(text) {
  const parts = [];
  // Vermerke wie "hier:", "auch:", "wörtlich:" trennen nur ab ("hier" allein ist eine Übersetzung!)
  const cleaned = String(text).replace(/(?<!\p{L})(hier|auch|wörtlich|bzw|ugs|umgangssprachlich)\s*:/giu, ',').replace(/(?<!\p{L})(Fragewort|bzw\.)(?!\p{L})/gu, ',');
  for (const piece of cleaned.split(/[,;]|\s+\/\s+|\s+oder\s+/)) {
    for (const v of variants(piece)) {
      const art = (v.trim().match(DE_ART)?.[1] || '').toLowerCase();
      const base = v.trim().replace(DE_ART, '').replace(/[!?.…"„“]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!base) continue;
      const words = base.toLowerCase().replace(DE_STOP, ' ').split(/\s+/).filter((w) => w.length > 1);
      parts.push({ text: v.trim(), base, art, key: base.toLowerCase(), words });
    }
  }
  return parts;
}

// Gleiches deutsches Wort, auch in einer anderen Form ("Zwilling" / "Zwillinge", "Socke" / "Socken")
function sameWord(a, b) {
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  // Andere Form: Plural, weibliche Form ("Socke" / "Socken", "Lehrer" / "Lehrerin")
  if (s.length >= 3 && l.startsWith(s) && /^(e|n|en|s|es|er|ern|nen|in|innen)$/.test(l.slice(s.length))) return true;
  // Plural mit Umlaut ("Zahn" / "Zähne", "Fuß" / "Füße") – nur hier ohne Umlaute vergleichen
  const fs = fold(s);
  const fl = fold(l);
  if (fs !== fl && fs.length >= 3 && fl.startsWith(fs) && /^(e|er)$/.test(fl.slice(fs.length)) && l !== fl) return true;
  // Verbform: "heißt" / "heißen", "wohne" / "wohnen" (nur kleingeschriebene Wörter)
  const stem = (w) => w.replace(/(est|et|en|st|e|n|t)$/, '');
  if (s === s.toLowerCase() && l === l.toLowerCase() && stem(s).length >= 3 && stem(s) === stem(l)) return true;
  // Zusammengesetztes Wort: "Schuluniform" enthält "Uniform", "Kartoffelchips" enthält "Chips"
  return s.length >= 5 && l.endsWith(s);
}

// Passen zwei deutsche Ausdrücke zusammen? (gleich, oder alle Wörter des kürzeren im längeren)
function sameMeaning(a, b) {
  if (a.key === b.key) return true;
  if (!a.words.length || !b.words.length) return false;
  const [s, l] = a.words.length <= b.words.length ? [a.words, b.words] : [b.words, a.words];
  return s.every((w) => l.some((x) => sameWord(w, x))) && s.some((w) => w.length >= 3);
}

// Ähnliche Wörter im Wörterbuch (für Rechtschreib-Vorschläge)
function similar(dict, word, limit = 3, out = {}) {
  const f = fold(word);
  const exact = dict.folded.get(f);
  out.dist = 0;
  if (exact && exact !== word) return [exact]; // nur Akzent anders: "cinema" ➜ "cinéma"
  const max = f.length <= 6 ? 1 : 2;
  const found = [];
  for (let len = f.length - max; len <= f.length + max; len++) {
    for (const w of dict.byLen.get(len) || []) {
      const d = editDistance(f, fold(w), max);
      if (d <= max) found.push([d, w]);
    }
  }
  found.sort((x, y) => x[0] - y[0] || (dict.e[y[1]] ? 1 : 0) - (dict.e[x[1]] ? 1 : 0));
  out.dist = found.length ? found[0][0] : 99;
  return [...new Set(found.map((x) => x[1]))].slice(0, limit);
}

// Endungen, die man zur Not abschneidet, um die Grundform zu finden
const SUFFIX = {
  en: [['ies', 'y'], ['ves', 'f'], ['es', ''], ['s', ''], ['ied', 'y'], ['ed', ''], ['ed', 'e'], ['d', ''], ['ing', ''], ['ing', 'e']],
  fr: [['es', ''], ['s', ''], ['x', ''], ['e', ''], ['ne', ''], ['le', ''], ['ve', 'f'], ['euse', 'eur'], ['rice', 'eur']],
};

function lookup(dict, key) {
  const direct = dict.e[key];
  const base = dict.f[key];
  if (direct && base && dict.e[base]) {
    // "left" ist ein eigenes Wort und auch eine Form von "leave": beide Bedeutungen zählen
    return { word: key, entry: [[...direct[0], ...dict.e[base][0]], direct[1], direct[2]] };
  }
  if (direct) return { word: key, entry: direct };
  if (base && dict.e[base]) return { word: base, entry: dict.e[base], form: key };
  for (const [suf, rep] of SUFFIX[dict.lang] || []) {
    if (key.length > suf.length + 2 && key.endsWith(suf)) {
      const k = key.slice(0, -suf.length) + rep;
      if (dict.e[k]) return { word: k, entry: dict.e[k], form: key };
    }
  }
  return null;
}

const ARTICLE_FOR = { m: 'le', f: 'la' };
// Für die Anzeige: kurze Bedeutungen zuerst, Doppeltes (nur mit/ohne Artikel) weg
function showMeanings(entry) {
  const seen = new Set();
  const list = [];
  for (const g of [...entry[0].filter((x) => x.length <= 30), ...entry[0].filter((x) => x.length > 30)]) {
    const k = g.toLowerCase().replace(DE_ART, '');
    if (seen.has(k)) continue;
    seen.add(k);
    list.push(g.length > 45 ? g.slice(0, 44) + '…' : g);
    if (list.length === 4) break;
  }
  return list.join('; ');
}

// ---------- Prüfung eines Eintrags ----------
// Ergebnis: { status: 'ok' | 'hint' | 'warn' | 'unknown', text, fixes: [{ field, value, label }], meanings }
export function checkEntry(dict, lang, fremd, de) {
  const fixes = [];
  const notes = [];
  let status = 'ok';
  const fremdText = String(fremd || '').trim();
  const deText = String(de || '').trim();
  if (!fremdText) return { status: 'unknown', text: '', fixes };

  // 1. Fremdwort suchen
  const keys = foreignKeys(fremdText, lang);
  let hit = null;
  let used = null;
  for (const k of keys) {
    hit = lookup(dict, k.key);
    if (hit) { used = k; break; }
  }
  // Wendungen ("to take care of") notfalls über das Hauptwort
  const jeRest = lang === 'fr' && keys[0] && /^j[ae]\s+\S+$/.test(keys[0].key) ? keys[0].key.slice(3) : '';
  const jePos = jeRest ? lookup(dict, jeRest)?.entry[1] || '' : '';
  const jeNoun = /noun/.test(jePos) && !/verb/.test(jePos) && !dict.f[jeRest];
  if (!hit && !jeNoun) {
    for (const k of keys) {
      const words = k.key.split(' ');
      if (words.length < 2) continue;
      // Eigennamen (Großschreibung mitten im Ausdruck), Apostroph-Formen und Endungen großzügig behandeln
      const orig = fremdText.split(/\s+/);
      const isName = (w) => orig.some((o, i) => i > 0 && /^\p{Lu}/u.test(o) && o.toLowerCase().replace(/[^\p{L}']/gu, '') === w);
      const known = (w) => {
        const bare = w.replace(/^(l|d|j|m|t|s|n|c|qu)'/, '').replace(/'(s|d|ll|ve|re|m|t)$/, '').replace(/n't$/, '');
        return lookup(dict, w) || lookup(dict, bare) || bare.length <= 2;
      };
      const unknown = words.filter((w) => w.length > 2 && !isName(w) && !known(w));
      if (!unknown.length) {
        return { status: 'unknown', text: 'Die Wendung steht so nicht im Wörterbuch – die einzelnen Wörter sind richtig geschrieben.', fixes };
      }
      const info = {};
      const sug = /'/.test(unknown[0]) ? [] : similar(dict, unknown[0], 3, info);
      // Nur die Endung anders (gebeugtes Verb wie "appelles")? Dann ist es vermutlich richtig.
      const sameStem = sug.length && fold(sug[0]).slice(0, 4) === fold(unknown[0]).slice(0, 4) && info.dist >= 1 && unknown[0].length >= 6;
      if (sug.length && info.dist <= 1 && !sameStem) {
        return {
          status: 'warn',
          text: `„${unknown[0]}“ steht nicht im Wörterbuch. Meintest du „${sug[0]}“?`,
          fixes: [{ field: 'fremd', value: fremdText.replace(unknown[0], sug[0]), label: `„${sug[0]}“` }],
        };
      }
      return { status: 'unknown', text: `„${unknown[0]}“ steht nicht im Wörterbuch.`, fixes };
    }
  }
  if (!hit) {
    const k = keys[0] || { key: fremdText.toLowerCase(), article: '' };
    // Französisch: "je métro" – das "l" mancher Schulbuch-Schriften wird als "j" gelesen
    if (lang === 'fr') {
      const j = k.key.match(/^j[ae]\s+(.{3,})$/);
      const noun = j && lookup(dict, j[1]);
      if (noun && /noun/.test(noun.entry[1]) && !/verb/.test(noun.entry[1]) && !dict.f[j[1]] && (noun.entry[2] === 'm' || noun.entry[2] === 'f')) {
        const value = `${ARTICLE_FOR[noun.entry[2]]} ${j[1]}`;
        return { status: 'warn', text: `Lesefehler? „${j[1]}“ ist ein Nomen – im Wörterbuch: „${value}“.`, fixes: [{ field: 'fremd', value, label: `„${value}“` }] };
      }
    }
    // Französisch: Artikel ohne Leerzeichen gelesen ("lethéâtre" ➜ "le théâtre")
    if (lang === 'fr') {
      const m = k.key.match(/^(le|la|l)(.{3,})$/);
      const rest = m && lookup(dict, m[2]);
      if (rest) {
        const g = rest.entry[2];
        const art = /^[aeiouyéèêàâîôûh]/i.test(m[2]) ? "l'" : (ARTICLE_FOR[g] || (m[1] === 'l' ? 'le' : m[1]));
        const value = art === "l'" ? `l'${m[2]}` : `${art} ${m[2]}`;
        return { status: 'warn', text: `Fehlt ein Leerzeichen? Im Wörterbuch steht „${value}“.`, fixes: [{ field: 'fremd', value, label: `„${value}“` }] };
      }
    }
    const info = {};
    const sug = similar(dict, k.key, 3, info);
    if (sug.length) {
      const fix = (s) => (k.article ? `${k.article}${k.article.endsWith("'") ? '' : ' '}${s}` : (/^to\s/i.test(fremdText) ? `to ${s}` : s));
      return {
        // Ein Buchstabe anders ➜ wahrscheinlich Lese- oder Tippfehler; zwei ➜ nur ein Hinweis
        status: info.dist <= 1 ? 'warn' : 'unknown',
        text: `„${k.key}“ steht nicht im Wörterbuch. ${info.dist <= 1 ? 'Meintest du' : 'Ähnlich:'} ${sug.map((s) => `„${s}“`).join(' oder ')}?`,
        fixes: sug.slice(0, 2).map((s) => ({ field: 'fremd', value: fix(s), label: `„${fix(s)}“` })),
      };
    }
    return { status: 'unknown', text: 'Steht nicht im Wörterbuch – bitte selbst genau prüfen.', fixes };
  }

  const [meanings, , gender] = hit.entry;
  // Akzent vergessen? ("cinema" steht als Form von "cinéma" nicht drin, aber gefaltet gleich)
  if (lang === 'fr' && used && fold(used.key) === fold(hit.word) && used.key !== hit.word) {
    const value = fremdText.replace(new RegExp(used.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), hit.word);
    fixes.push({ field: 'fremd', value, label: `„${value}“` });
    notes.push(`Akzent: Im Wörterbuch steht „${hit.word}“.`);
    status = 'warn';
  }

  // 4a. Französischer Artikel passend zum Geschlecht?
  if (lang === 'fr' && used && (used.article === 'le' || used.article === 'la') && (gender === 'm' || gender === 'f')) {
    const want = ARTICLE_FOR[gender];
    if (want !== used.article) {
      const value = fremdText.replace(/^(le|la)\b/i, want);
      notes.push(`„${hit.word}“ ist ${gender === 'm' ? 'männlich' : 'weiblich'} – also „${want}“.`);
      fixes.push({ field: 'fremd', value, label: `„${value}“` });
      status = 'warn';
    }
  }

  // 2./3. Deutsche Bedeutung
  if (!deText) {
    return { status: 'hint', text: `Deutsch fehlt. Wörterbuch: ${showMeanings(hit.entry)}`, fixes, meanings };
  }
  const mine = germanParts(deText);
  const theirs = meanings.flatMap(germanParts);
  const match = mine.some((a) => theirs.some((b) => sameMeaning(a, b)));
  if (match) {
    // 4b. Artikel im Deutschen (Wörterbuch kennt ihn bei Nomen)
    for (const a of mine) {
      if (!a.art) continue;
      const b = theirs.find((t) => t.key === a.key && t.art && t.art !== a.art && ['der', 'die', 'das'].includes(a.art));
      if (b && !theirs.some((t) => t.key === a.key && t.art === a.art)) {
        const value = deText.replace(new RegExp(`\\b${a.art}\\s+${a.base}`, 'i'), `${b.art} ${a.base}`);
        notes.push(`Artikel: Im Wörterbuch steht „${b.art} ${b.base}“.`);
        fixes.push({ field: 'de', value, label: `„${b.art} ${b.base}“` });
        status = 'warn';
      }
    }
    return { status, text: notes.join(' ') || `Passt (Wörterbuch: ${showMeanings(hit.entry)})`, fixes, meanings };
  }
  // Knapp daneben? Einzelne deutsche Wörter mit einem Wörterbuch-Wort vergleichen ("schon" ➜ "schön")
  const vocab = new Set(theirs.flatMap((t) => t.base.split(/\s+/)).filter((w) => w.length >= 3));
  for (const word of deText.split(/[\s,;/()]+/).filter((w) => w.length >= 3)) {
    if ([...vocab].some((v) => sameWord(v.toLowerCase(), word.toLowerCase()))) continue;
    const max = word.length <= 6 ? 1 : 2;
    let best = null;
    for (const v of vocab) {
      // Groß/klein muss passen (Nomen bleibt Nomen: "Nähe" ist nicht "nahe")
      if (/^\p{Lu}/u.test(v) !== /^\p{Lu}/u.test(word)) continue;
      const d = fold(v) === fold(word) ? 0.5 : editDistance(word.toLowerCase(), v.toLowerCase(), max);
      if (d <= max && (!best || d < best[0])) best = [d, v];
    }
    if (best) {
      const value = deText.replace(word, best[1]);
      notes.push(`Rechtschreibung? Im Wörterbuch steht „${best[1]}“.`);
      fixes.push({ field: 'de', value, label: `„${value}“` });
      return { status: 'warn', text: notes.join(' '), fixes, meanings };
    }
  }
  notes.push(`Das Wörterbuch kennt andere Bedeutungen: ${showMeanings(hit.entry)}. Bitte mit dem Buch vergleichen.`);
  return { status: status === 'warn' ? 'warn' : 'hint', text: notes.join(' '), fixes, meanings };
}
