// Speicherung im Browser (localStorage) und Lernfortschritt (Karteikasten).

import { BUILTIN_LISTS, LANGUAGES } from './vocab.js';

const KEY = 'voki.v1';
const DAY = 24 * 60 * 60 * 1000;
// Abstand bis zur nächsten Abfrage (in Tagen) je Fach im Karteikasten
const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = INTERVALS.length - 1;

export const DEFAULT_SETTINGS = {
  subject: 'en',           // aktuelles Fach: 'en' | 'fr'
  direction: 'de-en',      // 'de-en' = Deutsch ➜ Fremdsprache | 'en-de' = umgekehrt | 'mixed'
  engine: 'auto',          // 'auto' (Handschrift, wenn das Gerät sie selbst erkennt) | 'keyboard'
  tolerance: 1,            // 1 = streng (nur bestes Ergebnis zählt), 3 = großzügig
  caseSensitive: false,
  penOnly: 'auto',         // 'auto' | 'on' | 'off'
  speak: true,
  sessionSize: 10,
  mathInput: 'pen',        // Mathe-Ergebnisse: 'pen' = mit dem Stift schreiben | 'keys' = tippen
};

// Lern-Werkstatt (ausprobierte Methoden, gelöste Fälle) und Quiz (Sterne, Aufträge, Tages-Challenge)
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const obj = (v) => (isObj(v) ? v : {});
const str = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v) => (Number.isFinite(v) ? v : 0);
const oneOf = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

// Gespeicherte Daten streng prüfen: nur bekannte Felder mit passendem Typ übernehmen
function cleanSettings(s) {
  s = obj(s);
  const d = DEFAULT_SETTINGS;
  return {
    subject: Object.hasOwn(LANGUAGES, s.subject) ? s.subject : d.subject,
    direction: oneOf(s.direction, ['de-en', 'en-de', 'mixed'], d.direction),
    // frühere Werte 'native' und 'google' -> 'auto' (nur noch Erkennung auf dem Gerät)
    engine: oneOf(s.engine, ['auto', 'keyboard'], d.engine),
    tolerance: oneOf(s.tolerance, [1, 3], d.tolerance),
    caseSensitive: s.caseSensitive === true,
    penOnly: oneOf(s.penOnly, ['auto', 'on', 'off'], d.penOnly),
    speak: typeof s.speak === 'boolean' ? s.speak : d.speak,
    sessionSize: oneOf(s.sessionSize, [5, 10, 15, 20], d.sessionSize),
    mathInput: oneOf(s.mathInput, ['pen', 'keys'], d.mathInput),
  };
}

function cleanList(l) {
  if (!isObj(l) || typeof l.id !== 'string' || !/^eigene-[a-z0-9]+$/.test(l.id) || !Array.isArray(l.words)) return null;
  const words = l.words.filter(isObj).map((w) => ({ en: str(w.en), de: str(w.de), hint: str(w.hint) })).filter((w) => w.en && w.de);
  return {
    id: l.id,
    // Eigene Listen von vor der Französisch-Erweiterung haben keine Sprache -> Englisch
    lang: Object.hasOwn(LANGUAGES, l.lang) ? l.lang : 'en',
    type: 'vocab',
    title: str(l.title, 40) || 'Meine Liste',
    emoji: str(l.emoji, 8) || '📘',
    words,
  };
}

function cleanProgress(p) {
  const out = {};
  for (const [k, v] of Object.entries(obj(p))) {
    if (!isObj(v)) continue;
    out[k] = { box: Math.min(MAX_BOX, Math.max(0, Math.trunc(num(v.box)))), due: num(v.due), right: num(v.right), wrong: num(v.wrong), last: num(v.last) };
  }
  return out;
}

// Zeitstempel (Sticker, Aufträge) bzw. Sternzahlen
const cleanMap = (m, max = Infinity) => Object.fromEntries(Object.entries(obj(m)).filter(([, v]) => Number.isFinite(v)).map(([k, v]) => [k, Math.min(max, v)]));

function freshLearn(l = {}) {
  return { tried: cleanMap(obj(l).tried), cases: cleanMap(obj(l).cases) };
}

function freshQuiz(q = {}) {
  q = obj(q);
  return { stars: cleanMap(q.stars, 3), tasks: cleanMap(q.tasks), daily: str(q.daily, 20), played: num(q.played) };
}

function cleanStats(s) {
  s = obj(s);
  return { xp: Math.max(0, num(s.xp)), streak: Math.max(0, num(s.streak)), lastDay: str(s.lastDay, 20) };
}

function load() {
  let data = {};
  try {
    data = obj(JSON.parse(localStorage.getItem(KEY) || '{}'));
  } catch {
    // kaputte oder gesperrte Daten -> frisch anfangen
  }
  return {
    settings: cleanSettings(data.settings),
    progress: cleanProgress(data.progress),
    custom: (Array.isArray(data.custom) ? data.custom : []).map(cleanList).filter(Boolean),
    stats: cleanStats(data.stats),
    learn: freshLearn(data.learn),
    quiz: freshQuiz(data.quiz),
  };
}

export const store = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Speicher voll oder gesperrt (privater Modus) – App funktioniert trotzdem
  }
}

export function resetProgress() {
  store.progress = {};
  store.stats = { xp: 0, streak: 0, lastDay: '' };
  store.learn = freshLearn();
  store.quiz = freshQuiz();
  save();
}

// ---------- Mathe & Bio (Quiz) ----------

export function addXp(n) {
  store.stats.xp += n;
  touchStreak();
  save();
}

export const quizStars = (key) => store.quiz.stars[key] || 0;

// Merkt sich die beste Sternzahl eines Levels; gibt true zurück, wenn es ein neuer Rekord ist
export function recordQuiz(key, stars) {
  store.quiz.played++;
  const better = stars > quizStars(key);
  if (better) store.quiz.stars[key] = stars;
  touchStreak();
  save();
  return better;
}

export const taskDone = (id) => !!store.quiz.tasks[id];

export function toggleTask(id) {
  if (store.quiz.tasks[id]) {
    delete store.quiz.tasks[id];
    store.stats.xp = Math.max(0, store.stats.xp - 20);
  } else {
    store.quiz.tasks[id] = Date.now();
    store.stats.xp += 20;
    touchStreak();
  }
  save();
  return !!store.quiz.tasks[id];
}

export const dailyDone = () => store.quiz.daily === dayKey();

export function markDaily() {
  if (dailyDone()) return false;
  store.quiz.daily = dayKey();
  store.stats.xp += 30;
  touchStreak();
  save();
  return true;
}

// ---------- Lern-Werkstatt ----------

export function toggleTried(id) {
  if (store.learn.tried[id]) {
    delete store.learn.tried[id];
    store.stats.xp = Math.max(0, store.stats.xp - 20);
  } else {
    store.learn.tried[id] = Date.now();
    store.stats.xp += 20;
    touchStreak();
  }
  save();
  return !!store.learn.tried[id];
}

export function solveCase(id) {
  if (store.learn.cases[id]) return false;
  store.learn.cases[id] = Date.now();
  store.stats.xp += 15;
  touchStreak();
  save();
  return true;
}

// ---------- Listen ----------

const customLists = () => store.custom;

export function allLists(lang) {
  const lists = [...BUILTIN_LISTS, ...customLists()];
  return lang ? lists.filter((l) => l.lang === lang) : lists;
}

export function getList(id) {
  return allLists().find((l) => l.id === id);
}

export function wordId(list, w) {
  return `${list.id}:${w.en}|${w.de}`;
}

export function wordsOf(list) {
  return list.words.map((w) => ({
    ...w,
    id: wordId(list, w),
    listId: list.id,
    lang: list.lang || 'en',
    oneWay: list.type === 'grammar',
    task: list.task || '',
    rule: list.rule || '',
  }));
}

export function saveCustomList(list) {
  const i = store.custom.findIndex((l) => l.id === list.id);
  if (i >= 0) store.custom[i] = list;
  else store.custom.push(list);
  save();
}

export function deleteCustomList(id) {
  store.custom = store.custom.filter((l) => l.id !== id);
  for (const k of Object.keys(store.progress)) if (k.startsWith(id + ':')) delete store.progress[k];
  save();
}

// Zeilen wie "friend = Freund", "friend ; Freund" oder "friend<TAB>Freund"
export function parseWordLines(text) {
  const words = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.split(/\t|\s*=\s*|\s*;\s*|\s+[-–]\s+/);
    if (m.length < 2 || !m[0] || !m[1]) continue;
    words.push({ en: m[0].trim(), de: m[1].trim(), hint: (m[2] || '').trim() });
  }
  return words;
}

export function wordsToLines(words) {
  return words.map((w) => `${w.en} = ${w.de}${w.hint ? ' = ' + w.hint : ''}`).join('\n');
}

// ---------- Karteikasten ----------

export function progressOf(id) {
  return store.progress[id];
}

export function isDue(id, now = Date.now()) {
  const p = store.progress[id];
  return !!p && p.due <= now;
}

export function record(id, correct, { usedHint = false } = {}) {
  const p = store.progress[id] || { box: 0, due: 0, right: 0, wrong: 0 };
  if (correct) {
    p.right++;
    if (!usedHint) p.box = Math.min(MAX_BOX, p.box + 1);
    else p.box = Math.max(1, p.box);
  } else {
    p.wrong++;
    p.box = 1;
  }
  p.due = startOfDay(Date.now()) + INTERVALS[p.box] * DAY;
  p.last = Date.now();
  store.progress[id] = p;
  if (correct) store.stats.xp += usedHint ? 5 : 10;
  touchStreak();
  save();
}

function startOfDay(t) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayKey(t = Date.now()) {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function touchStreak() {
  const today = dayKey();
  if (store.stats.lastDay === today) return;
  const yesterday = dayKey(Date.now() - DAY);
  store.stats.streak = store.stats.lastDay === yesterday ? store.stats.streak + 1 : 1;
  store.stats.lastDay = today;
}

export function currentStreak() {
  const { lastDay, streak } = store.stats;
  return lastDay === dayKey() || lastDay === dayKey(Date.now() - DAY) ? streak : 0;
}

export function listStats(list) {
  const words = wordsOf(list);
  const now = Date.now();
  let mastered = 0;
  let due = 0;
  let seen = 0;
  let score = 0;
  for (const w of words) {
    const p = store.progress[w.id];
    if (!p) continue;
    seen++;
    score += p.box;
    if (p.box >= 4) mastered++;
    if (p.due <= now) due++;
  }
  return {
    total: words.length,
    seen,
    mastered,
    due,
    percent: words.length ? Math.round((score / (words.length * MAX_BOX)) * 100) : 0,
  };
}

export function dueWords(lang) {
  const now = Date.now();
  return allLists(lang).flatMap(wordsOf).filter((w) => isDue(w.id, now))
    .sort((a, b) => store.progress[a.id].due - store.progress[b.id].due);
}
