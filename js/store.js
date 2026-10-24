// Speicherung im Browser (localStorage) und Lernfortschritt (Karteikasten).

import { BUILTIN_LISTS } from './vocab.js';

const KEY = 'voki.v1';
const DAY = 24 * 60 * 60 * 1000;
// Abstand bis zur nächsten Abfrage (in Tagen) je Fach im Karteikasten
const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = INTERVALS.length - 1;

export const DEFAULT_SETTINGS = {
  subject: 'en',           // aktuelles Fach: 'en' | 'fr'
  direction: 'de-en',      // 'de-en' = Deutsch ➜ Fremdsprache | 'en-de' = umgekehrt | 'mixed'
  engine: 'auto',          // 'auto' | 'native' | 'google' | 'keyboard'
  tolerance: 1,            // 1 = streng (nur bestes Ergebnis zählt), 3 = großzügig
  caseSensitive: false,
  penOnly: 'auto',         // 'auto' | 'on' | 'off'
  speak: true,
  sessionSize: 10,
};

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
      progress: data.progress || {},
      custom: data.custom || [],
      stats: { xp: 0, streak: 0, lastDay: '', ...(data.stats || {}) },
    };
  } catch {
    return { settings: { ...DEFAULT_SETTINGS }, progress: {}, custom: [], stats: { xp: 0, streak: 0, lastDay: '' } };
  }
}

export const store = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Speicher voll oder gesperrt (privater Modus) – App funktioniert trotzdem
  }
}

export function exportData() {
  return JSON.stringify({ app: 'voki', version: 1, ...store }, null, 2);
}

export function importData(json) {
  const data = JSON.parse(json);
  if (data.app !== 'voki') throw new Error('Das ist keine Voki-Sicherung.');
  store.settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
  store.progress = data.progress || {};
  store.custom = data.custom || [];
  store.stats = { xp: 0, streak: 0, lastDay: '', ...(data.stats || {}) };
  save();
}

export function resetProgress() {
  store.progress = {};
  store.stats = { xp: 0, streak: 0, lastDay: '' };
  save();
}

// ---------- Listen ----------

// Eigene Listen von vor der Französisch-Erweiterung haben keine Sprache -> Englisch
const customLists = () => store.custom.map((l) => ({ type: 'vocab', lang: 'en', ...l }));

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
