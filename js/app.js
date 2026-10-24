import { WritingPad } from './pad.js';
import { recognize, RecognitionError } from './recognizer.js';
import { check, diff } from './check.js';
import {
  store, save, allLists, getList, wordsOf, listStats, dueWords, isDue, progressOf, record,
  currentStreak, saveCustomList, deleteCustomList, parseWordLines, wordsToLines,
  exportData, importData, resetProgress, MAX_BOX,
} from './store.js';
import { LANGUAGES } from './vocab.js';

const app = document.getElementById('app');
let cleanup = () => {};
let installPrompt = null;
let lastMistakes = [];
let updateReady = false;

// Muss zu VERSION in sw.js passen
const APP_VERSION = 4;

// ---------- Hilfsfunktionen ----------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

let voices = [];
function loadVoices() { voices = speechSynthesis.getVoices(); }
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

function speak(text, lang = 'en-GB') {
  if (!('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\//g, ', '));
  u.lang = lang;
  u.rate = 0.9;
  const voice = voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

const langInfo = (lang) => LANGUAGES[lang] || LANGUAGES.en;
const sayWord = (w) => speak(w.en, langInfo(w.lang).voice);

// Farbe und Kopfzeile je Fach (Englisch / Französisch)
function setSubject(lang) {
  document.documentElement.dataset.subject = lang;
}

// Französische Nomen: männlich blau, weiblich rot (wie im Vokabelheft)
function genderOf(w) {
  if (w.lang !== 'fr' || w.oneWay) return '';
  const fr = w.en.toLowerCase();
  if (/^(le|un) /.test(fr)) return 'm';
  if (/^(la|une) /.test(fr)) return 'f';
  if (/^l'/.test(fr)) {
    if (/\bm\./.test(w.hint) || /^der /.test(w.de)) return 'm';
    if (/\bf\./.test(w.hint) || /^die /.test(w.de)) return 'f';
  }
  return '';
}

const foreignWord = (w) => {
  const g = genderOf(w);
  return g ? `<span class="g-${g}">${esc(w.en)}</span>` : esc(w.en);
};

// "___" in Grammatik-Aufgaben als Lücke darstellen
const withGap = (text) => esc(text).replace(/_{2,}/g, '<span class="gap">&nbsp;</span>');

function setTitle(t) {
  document.title = t ? `${t} · Voki` : 'Voki – Vokabeln mit dem Stift';
}

// ---------- Router ----------

function route() {
  if (updateReady && !location.hash.startsWith('#/ueben')) {
    location.reload();
    return;
  }
  cleanup();
  cleanup = () => {};
  window.scrollTo(0, 0);
  const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const [page, a, b] = parts;
  if (page === 'liste' && getList(a)) {
    setSubject(getList(a).lang);
    return renderList(getList(a));
  }
  setSubject(store.settings.subject);
  if (page === 'ueben') return renderPractice(a, b || 'lernen');
  if (page === 'einstellungen') return renderSettings();
  if (page === 'neu') return renderEdit(null);
  if (page === 'bearbeiten' && getList(a) && !getList(a).builtin) return renderEdit(getList(a));
  renderHome();
}

window.addEventListener('hashchange', route);

// ---------- Startseite ----------

function listCard(list) {
  const s = listStats(list);
  return `
    <a class="topic" href="#/liste/${encodeURIComponent(list.id)}">
      <span class="topic-emoji">${esc(list.emoji || '📝')}</span>
      <span class="topic-title">${esc(list.title)}</span>
      <span class="topic-meta">${s.mastered}/${s.total} sicher${s.due ? ` · <b class="due">${s.due} fällig</b>` : ''}</span>
      <span class="meter"><span style="width:${s.percent}%"></span></span>
    </a>`;
}

function renderHome() {
  setTitle('');
  const subject = store.settings.subject;
  const L = langInfo(subject);
  const due = dueWords(subject);
  const lists = allLists(subject);
  const mastered = lists.reduce((n, l) => n + listStats(l).mastered, 0);
  const vocab = lists.filter((l) => l.builtin && l.type === 'vocab');
  const grammar = lists.filter((l) => l.builtin && l.type === 'grammar');
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;

  app.innerHTML = `
    <header class="top">
      <h1>✏️ Voki</h1>
      <a class="icon-btn" href="#/einstellungen" aria-label="Einstellungen">⚙️</a>
    </header>
    <nav class="subjects" role="tablist">
      ${Object.entries(LANGUAGES).map(([code, l]) => `
        <button class="subject ${code === subject ? 'active' : ''}" role="tab" aria-selected="${code === subject}" data-subject="${code}">
          <span class="flag">${l.flag}</span> ${l.name}
        </button>`).join('')}
    </nav>
    <section class="hero">
      <div class="stats">
        <div><b>🔥 ${currentStreak()}</b><span>Tage in Folge</span></div>
        <div><b>⭐ ${store.stats.xp}</b><span>Punkte</span></div>
        <div><b>🧠 ${mastered}</b><span>Wörter sicher</span></div>
      </div>
      ${due.length
        ? `<a class="btn primary big" href="#/ueben/_faellig-${subject}/wiederholen">${L.flag} Wiederholen · ${due.length} ${due.length === 1 ? 'Wort' : 'Wörter'} fällig</a>`
        : `<p class="muted center">In ${L.name} ist heute nichts zu wiederholen. Such dir ein Thema aus und lern neue Wörter! 🚀</p>`}
    </section>
    ${installPrompt ? '<button class="btn install" id="install">📲 Voki als App installieren</button>' : ''}
    ${isIOS && !standalone ? '<p class="tip">📲 Tipp: Im Safari auf <b>Teilen</b> ➜ <b>Zum Home-Bildschirm</b> tippen, dann startet Voki wie eine App.</p>' : ''}
    <h2>📚 Vokabeln</h2>
    <div class="grid">${vocab.map(listCard).join('')}</div>
    <h2>🧩 Grammatik</h2>
    <div class="grid">${grammar.map(listCard).join('')}</div>
    <h2>✏️ Meine Listen</h2>
    <p class="muted small">Leg hier die Wörter aus deinem ${L.name}buch an (z.&nbsp;B. „${subject === 'fr' ? 'Unité 2' : 'Unit 3'}“).</p>
    <div class="grid">
      ${lists.filter((l) => !l.builtin).map(listCard).join('')}
      <a class="topic add" href="#/neu"><span class="topic-emoji">➕</span><span class="topic-title">Neue Liste</span></a>
    </div>
  `;
  app.querySelectorAll('[data-subject]').forEach((b) => b.addEventListener('click', () => {
    store.settings.subject = b.dataset.subject;
    save();
    route();
  }));
  document.getElementById('install')?.addEventListener('click', async () => {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    route();
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  if (!location.hash || location.hash === '#/') route();
});

// ---------- Listenansicht ----------

function renderList(list) {
  setTitle(list.title);
  const s = listStats(list);
  const words = wordsOf(list);
  const isGrammar = list.type === 'grammar';
  if (store.settings.subject !== list.lang) {
    store.settings.subject = list.lang;
    save();
  }
  app.innerHTML = `
    <header class="top">
      <a class="icon-btn" href="#/" aria-label="Zurück">←</a>
      <h1>${esc(list.emoji || '📝')} ${esc(list.title)}</h1>
      ${list.builtin ? '<span></span>' : `<a class="icon-btn" href="#/bearbeiten/${encodeURIComponent(list.id)}" aria-label="Bearbeiten">✏️</a>`}
    </header>
    <section class="hero">
      <div class="stats">
        <div><b>${s.total}</b><span>${isGrammar ? 'Aufgaben' : 'Wörter'}</span></div>
        <div><b>${s.mastered}</b><span>sicher</span></div>
        <div><b>${s.due}</b><span>fällig</span></div>
      </div>
      <div class="meter big"><span style="width:${s.percent}%"></span></div>
      ${s.total ? `
        <a class="btn primary big" href="#/ueben/${encodeURIComponent(list.id)}/lernen">✍️ Lernen</a>
        <a class="btn big" href="#/ueben/${encodeURIComponent(list.id)}/test">📝 Test: alle ${s.total} ${isGrammar ? 'Aufgaben' : 'Wörter'}</a>
      ` : '<p class="muted center">Diese Liste ist noch leer.</p>'}
    </section>
    ${list.lang === 'fr' && !isGrammar && words.some(genderOf) ? '<p class="legend"><span class="g-m">■ männlich</span> <span class="g-f">■ weiblich</span></p>' : ''}
    ${list.rule ? `<section class="rule"><h2>📖 Regel</h2><p>${esc(list.rule).replace(/\n/g, '<br>')}</p></section>` : ''}
    <ul class="words ${isGrammar ? 'grammar' : ''}">
      ${words.map((w) => {
        const p = progressOf(w.id);
        const box = p ? p.box : 0;
        return `
        <li>
          <button class="speak" data-say="${esc(w.en)}" aria-label="Vorlesen">🔊</button>
          ${isGrammar
            ? `<span class="de">${withGap(w.de)}${w.hint ? ` <small>(${esc(w.hint)})</small>` : ''}</span><span class="en">${esc(w.en)}</span>`
            : `<span class="en">${foreignWord(w)}</span><span class="de">${esc(w.de)}${w.hint ? ` <small>(${esc(w.hint)})</small>` : ''}</span>`}
          <span class="dots" title="Fach ${box} von ${MAX_BOX}">${'●'.repeat(box)}${'○'.repeat(MAX_BOX - box)}</span>
        </li>`;
      }).join('')}
    </ul>
  `;
  app.querySelectorAll('[data-say]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.say, langInfo(list.lang).voice)));
}

// ---------- Üben ----------

function buildSession(listId, mode, lang) {
  const size = store.settings.sessionSize;
  let words;
  if (mode === 'wiederholen') {
    words = shuffle(dueWords(lang).slice(0, 20));
  } else if (mode === 'fehler') {
    words = shuffle(lastMistakes);
  } else {
    const all = wordsOf(getList(listId));
    if (mode === 'test') {
      words = shuffle(all);
    } else {
      const now = Date.now();
      const due = shuffle(all.filter((w) => isDue(w.id, now)));
      const fresh = all.filter((w) => !progressOf(w.id));
      let pick = [...due, ...fresh].slice(0, size);
      if (pick.length < size) {
        const rest = all.filter((w) => !pick.includes(w))
          .sort((x, y) => (progressOf(x.id)?.box ?? 0) - (progressOf(y.id)?.box ?? 0));
        pick = pick.concat(rest.slice(0, size - pick.length));
      }
      words = shuffle(pick);
    }
  }
  const items = [];
  for (const w of words) {
    let dir = store.settings.direction;
    if (w.oneWay) dir = 'de-en';
    else if (dir === 'mixed') dir = Math.random() < 0.5 ? 'de-en' : 'en-de';
    // Neue Wörter werden im Lernmodus erst gezeigt und abgeschrieben (Einprägen).
    // Bei Grammatik steht stattdessen die Regel auf der Listenseite.
    if (mode === 'lernen' && !w.oneWay && !progressOf(w.id)) items.push({ word: w, dir, kind: 'intro' });
    else items.push({ word: w, dir, kind: 'ask' });
  }
  return items;
}

function renderPractice(listId, mode) {
  // "_faellig-en" / "_faellig-fr": alle fälligen Wörter eines Fachs
  const dueLang = listId?.startsWith('_faellig-') ? listId.slice(9) : null;
  const list = dueLang && LANGUAGES[dueLang]
    ? { id: listId, title: 'Wiederholen', emoji: '🔁', lang: dueLang, due: true }
    : getList(listId);
  if (!list) return go('#/');
  setSubject(list.lang);
  if (mode === 'fehler' && !lastMistakes.length) return go(`#/liste/${encodeURIComponent(listId)}`);
  const backHash = list.due ? '#/' : `#/liste/${encodeURIComponent(list.id)}`;
  const queue = buildSession(list.id, mode, list.lang);
  if (!queue.length) return go(backHash);
  setTitle(list.title);

  const S = {
    queue,
    pos: 0,
    phase: 'ask',     // 'ask' | 'result' | 'copy'
    results: new Map(),
    requeued: new Map(),
    usedHint: false,
    keyboard: store.settings.engine === 'keyboard',
    busy: false,
    undoRecord: null,
    timer: null,
  };
  const total = new Set(queue.map((i) => i.word.id)).size;

  app.innerHTML = `
    <div class="practice">
      <header class="bar">
        <a class="icon-btn" href="${backHash}" aria-label="Beenden">✕</a>
        <div class="meter"><span id="progress"></span></div>
        <span id="count" class="muted"></span>
      </header>
      <section class="card" id="card">
        <div class="label" id="label"></div>
        <div class="prompt" id="prompt"></div>
        <div class="hint" id="hint"></div>
      </section>
      <section class="feedback" id="fb" aria-live="polite"></section>
      <div class="pad-wrap" id="padWrap">
        <canvas id="pad" aria-label="Schreibfläche"></canvas>
        <input id="kbd" class="kbd" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Hier tippen …" hidden>
        <div class="accents" id="accents" hidden>
          ${[...'éèêëàâçîïôùûœ'].map((c) => `<button type="button" data-char="${c}">${c}</button>`).join('')}
        </div>
      </div>
      <div class="tools" id="tools">
        <button class="tool" id="undo" aria-label="Rückgängig">↶</button>
        <button class="tool" id="clear" aria-label="Löschen">🗑️</button>
        <button class="tool" id="tipp" aria-label="Tipp">💡</button>
        <button class="tool" id="kbdToggle" aria-label="Tastatur">⌨️</button>
        <button class="btn primary check" id="check">Prüfen ✓</button>
      </div>
    </div>
  `;

  const $ = (id) => document.getElementById(id);
  const pad = new WritingPad($('pad'), { penOnly: store.settings.penOnly, onChange: () => updateTools() });
  const kbd = $('kbd');

  const onKey = (e) => {
    if (e.key !== 'Enter') return;
    if (S.phase === 'result') { e.preventDefault(); next(); } else if (S.keyboard && document.activeElement === kbd) { e.preventDefault(); doCheck(); }
  };
  document.addEventListener('keydown', onKey);
  cleanup = () => {
    pad.destroy();
    clearTimeout(S.timer);
    document.removeEventListener('keydown', onKey);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  };

  const item = () => S.queue[S.pos];
  const answerOf = (it) => (it.dir === 'de-en' ? it.word.en : it.word.de);
  const promptOf = (it) => (it.dir === 'de-en' ? it.word.de : it.word.en);
  // Sprache der erwarteten Antwort (für Handschrifterkennung)
  const langOf = (it) => (it.dir === 'de-en' ? langInfo(it.word.lang).ink : 'de');

  // Akzent-Leiste nur beim Tippen auf Französisch
  function updateAccents() {
    $('accents').hidden = !(S.keyboard && S.queue[S.pos] && langOf(S.queue[S.pos]) === 'fr');
  }

  function setKeyboard(on) {
    S.keyboard = on;
    kbd.hidden = !on;
    $('pad').hidden = on;
    $('kbdToggle').classList.toggle('on', on);
    if (on) setTimeout(() => kbd.focus(), 50);
    else pad.resize();
    updateAccents();
    updateTools();
  }

  function updateTools() {
    const inResult = S.phase === 'result';
    $('tools').classList.toggle('hidden', inResult);
    $('undo').disabled = S.keyboard || pad.isEmpty();
    $('clear').disabled = S.keyboard ? !kbd.value : pad.isEmpty();
    $('tipp').disabled = S.phase !== 'ask' || S.usedHint;
    $('check').disabled = S.busy;
    $('check').textContent = S.busy ? 'Lese …' : 'Prüfen ✓';
  }

  function showItem() {
    const it = item();
    const done = S.results.size;
    $('progress').style.width = `${(done / total) * 100}%`;
    $('count').textContent = `${Math.min(done + 1, total)}/${total}`;
    $('card').className = 'card';
    $('fb').innerHTML = '';
    S.usedHint = false;
    S.undoRecord = null;
    pad.clear();
    kbd.value = '';

    const target = it.dir === 'de-en' ? langInfo(it.word.lang).name : 'Deutsch';
    if (it.kind === 'intro') {
      S.phase = 'copy';
      $('label').textContent = '✨ Neues Wort – schreib es einmal ab';
      $('prompt').innerHTML = `${foreignWord(it.word)} <button class="speak inline" id="say" aria-label="Vorlesen">🔊</button>`;
      $('hint').innerHTML = `${esc(it.word.de)}${it.word.hint ? ` <small>(${esc(it.word.hint)})</small>` : ''}`;
      pad.setGuide(it.word.en);
      if (store.settings.speak) sayWord(it.word);
    } else if (it.word.oneWay) {
      S.phase = 'ask';
      $('label').textContent = it.word.task || `Schreib auf ${target}:`;
      $('prompt').innerHTML = withGap(it.word.de);
      $('hint').innerHTML = it.word.hint ? `(${esc(it.word.hint)})` : '';
      pad.setGuide('');
    } else {
      S.phase = 'ask';
      $('label').textContent = `Schreib auf ${target}:`;
      $('prompt').innerHTML = (it.dir === 'en-de' ? foreignWord(it.word) : esc(promptOf(it))) + (it.dir === 'en-de' ? ' <button class="speak inline" id="say" aria-label="Vorlesen">🔊</button>' : '');
      $('hint').innerHTML = it.word.hint && it.dir === 'de-en' ? `(${esc(it.word.hint)})` : '';
      pad.setGuide('');
      if (it.dir === 'en-de' && store.settings.speak) sayWord(it.word);
    }
    $('say')?.addEventListener('click', () => sayWord(it.word));
    updateAccents();
    updateTools();
    if (S.keyboard) kbd.focus();
  }

  function next() {
    clearTimeout(S.timer);
    S.pos++;
    if (S.pos >= S.queue.length) return finish();
    showItem();
  }

  function requeue(it, kind) {
    const n = S.requeued.get(it.word.id) || 0;
    if (n >= 2) return;
    S.requeued.set(it.word.id, n + 1);
    const at = Math.min(S.queue.length, S.pos + 3);
    S.queue.splice(at, 0, { ...it, kind });
  }

  async function doCheck() {
    if (S.busy || S.phase === 'result') return;
    const it = item();
    let candidates;
    if (S.keyboard) {
      if (!kbd.value.trim()) return nudge();
      candidates = [kbd.value];
    } else {
      if (pad.isEmpty()) return nudge();
      S.busy = true;
      updateTools();
      try {
        candidates = await recognize(pad.strokes, {
          engine: store.settings.engine,
          lang: it.kind === 'intro' ? langInfo(it.word.lang).ink : langOf(it),
          width: pad.width,
          height: pad.height,
          pointerType: pad.lastPointerType,
        });
      } catch (e) {
        S.busy = false;
        updateTools();
        $('fb').innerHTML = `
          <div class="msg warn">${esc(e instanceof RecognitionError ? e.message : 'Fehler bei der Erkennung: ' + e.message)}</div>
          <button class="btn" id="useKbd">⌨️ Tastatur benutzen</button>`;
        $('useKbd').addEventListener('click', () => { $('fb').innerHTML = ''; setKeyboard(true); });
        return;
      }
      S.busy = false;
    }
    if (!document.body.contains(pad.canvas)) return; // Seite inzwischen verlassen

    const expected = it.kind === 'intro' ? it.word.en : answerOf(it);
    const res = check(candidates, expected, {
      caseSensitive: store.settings.caseSensitive,
      tolerance: S.keyboard ? 1 : store.settings.tolerance,
    });

    if (S.phase === 'copy') return copyResult(it, res, expected);
    askResult(it, res, expected);
  }

  function nudge() {
    const el = S.keyboard ? kbd : $('pad');
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  function askResult(it, res, expected) {
    S.phase = 'result';
    const id = it.word.id;
    const firstTime = !S.results.has(id);
    if (firstTime) {
      S.undoRecord = { progress: store.progress[id] ? { ...store.progress[id] } : undefined, xp: store.stats.xp };
      record(id, res.correct, { usedHint: S.usedHint });
      S.results.set(id, { word: it.word, correct: res.correct });
    }
    $('card').classList.add(res.correct ? 'right' : 'wrong');
    if (res.correct) {
      $('fb').innerHTML = `
        <div class="msg ok">${pick(['Richtig! 🎉', 'Super! ⭐', 'Klasse! 💪', 'Genau! ✅', 'Perfekt! 🌟'])}
          <span class="solution">${it.dir === 'de-en' ? foreignWord(it.word) : esc(expected)}</span></div>
        <button class="btn primary big" id="next">Weiter ➜</button>`;
      if (store.settings.speak) sayWord(it.word);
      S.timer = setTimeout(next, 1600);
    } else {
      if (mode !== 'test') requeue(it, 'ask');
      const marked = diff(expected, res.read).map((d) => (d.ok ? esc(d.ch) : `<mark>${esc(d.ch)}</mark>`)).join('');
      $('fb').innerHTML = `
        <div class="msg bad">Leider nicht richtig.
          <div class="read">Ich habe gelesen: <b>${esc(res.read || '–')}</b></div>
          <div class="read">Richtig ist: <span class="solution">${marked}</span></div>
        </div>
        ${it.word.rule ? `<div class="msg rule-hint">📖 ${esc(it.word.rule).replace(/\n/g, '<br>')}</div>` : ''}
        <div class="row">
          <button class="btn primary" id="copy">✍️ Richtig abschreiben</button>
          <button class="btn" id="next">Weiter ➜</button>
        </div>
        ${S.keyboard ? '' : '<button class="link" id="override">Ich hatte es richtig – die Schrift wurde falsch erkannt</button>'}`;
      if (store.settings.speak) sayWord(it.word);
      $('copy').addEventListener('click', () => startCopy(it, expected));
      $('override')?.addEventListener('click', () => override(it, expected));
    }
    $('next').addEventListener('click', next);
    updateTools();
  }

  function override(it, expected) {
    const id = it.word.id;
    if (S.undoRecord) {
      if (S.undoRecord.progress) store.progress[id] = S.undoRecord.progress;
      else delete store.progress[id];
      store.stats.xp = S.undoRecord.xp;
      save();
      record(id, true, { usedHint: S.usedHint });
      S.results.set(id, { word: it.word, correct: true });
    }
    // wieder eingereihtes Wort entfernen
    const idx = S.queue.findIndex((q, i) => i > S.pos && q.word.id === id);
    if (idx > 0) S.queue.splice(idx, 1);
    $('card').className = 'card right';
    $('fb').innerHTML = `<div class="msg ok">Okay, zählt als richtig 👍 <span class="solution">${esc(expected)}</span></div>
      <button class="btn primary big" id="next">Weiter ➜</button>`;
    $('next').addEventListener('click', next);
  }

  function startCopy(it, expected) {
    S.phase = 'copy';
    $('card').className = 'card';
    $('label').textContent = '✍️ Schreib das Wort richtig ab:';
    $('prompt').textContent = expected;
    $('hint').innerHTML = withGap(promptOf(it));
    $('fb').innerHTML = '';
    pad.clear();
    pad.setGuide(expected);
    kbd.value = '';
    updateTools();
    if (S.keyboard) kbd.focus();
  }

  function copyResult(it, res, expected) {
    if (res.correct) {
      if (it.kind === 'intro') requeue({ ...it, kind: 'ask' }, 'ask');
      S.phase = 'result';
      $('card').classList.add('right');
      $('fb').innerHTML = `<div class="msg ok">Gut gemacht! ✍️ <span class="solution">${esc(expected)}</span></div>
        <button class="btn primary big" id="next">Weiter ➜</button>`;
      $('next').addEventListener('click', next);
      if (it.kind === 'intro' && store.settings.speak) sayWord(it.word);
      S.timer = setTimeout(next, 1300);
      updateTools();
    } else {
      $('fb').innerHTML = `<div class="msg bad">Noch nicht ganz – ich habe <b>${esc(res.read || '–')}</b> gelesen. Versuch es nochmal!</div>
        <button class="link" id="skip">Überspringen</button>`;
      $('skip').addEventListener('click', () => {
        if (it.kind === 'intro') requeue({ ...it, kind: 'ask' }, 'ask');
        next();
      });
      pad.clear();
      kbd.value = '';
    }
  }

  function finish() {
    cleanup();
    cleanup = () => {};
    const results = [...S.results.values()];
    const right = results.filter((r) => r.correct).length;
    const wrong = results.filter((r) => !r.correct).map((r) => r.word);
    lastMistakes = wrong;
    const ratio = results.length ? right / results.length : 1;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
    app.innerHTML = `
      <header class="top">
        <a class="icon-btn" href="${backHash}" aria-label="Zurück">←</a>
        <h1>Geschafft!</h1><span></span>
      </header>
      <section class="hero center">
        <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <p class="score">${right} von ${results.length} beim ersten Versuch richtig</p>
        <p class="muted">${ratio === 1 ? 'Fehlerfrei – stark! 🏆' : ratio >= 0.7 ? 'Sehr gut, weiter so! 💪' : 'Übung macht den Meister – nochmal? 🙂'}</p>
        ${wrong.length ? `
          <h2>Diese Wörter übst du nochmal:</h2>
          <ul class="words compact">${wrong.map((w) => `<li><span class="en">${esc(w.en)}</span><span class="de">${esc(w.de)}</span></li>`).join('')}</ul>
          <button class="btn primary big" data-go="#/ueben/${encodeURIComponent(list.id)}/fehler">🔁 Fehler üben</button>` : ''}
        <button class="btn big" data-go="#/ueben/${encodeURIComponent(list.id)}/${mode === 'fehler' ? 'lernen' : mode}">Noch eine Runde</button>
        <a class="btn big" href="${backHash}">Fertig</a>
      </section>`;
    // gleiche Adresse löst kein hashchange aus, deshalb über go()
    app.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  }

  $('undo').addEventListener('click', () => pad.undo());
  $('clear').addEventListener('click', () => { pad.clear(); kbd.value = ''; updateTools(); });
  $('check').addEventListener('click', doCheck);
  $('kbdToggle').addEventListener('click', () => setKeyboard(!S.keyboard));
  kbd.addEventListener('input', updateTools);
  $('accents').addEventListener('pointerdown', (e) => e.preventDefault()); // Fokus im Textfeld lassen
  $('accents').addEventListener('click', (e) => {
    const ch = e.target.dataset?.char;
    if (!ch) return;
    const { selectionStart: a, selectionEnd: b, value } = kbd;
    kbd.value = value.slice(0, a) + ch + value.slice(b);
    kbd.setSelectionRange(a + 1, a + 1);
    kbd.focus();
    updateTools();
  });
  $('tipp').addEventListener('click', () => {
    const ans = answerOf(item());
    S.usedHint = true;
    $('hint').innerHTML = `💡 <span class="tipp">${esc([...ans].map((c, i) => (i === 0 || c === ' ' || c === '-' || c === "'" ? c : '_')).join(' '))}</span>`;
    updateTools();
  });

  setKeyboard(S.keyboard);
  showItem();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- Eigene Liste ----------

function renderEdit(list) {
  setTitle(list ? list.title : 'Neue Liste');
  const lang = list?.lang || store.settings.subject;
  app.innerHTML = `
    <header class="top">
      <a class="icon-btn" href="${list ? `#/liste/${encodeURIComponent(list.id)}` : '#/'}" aria-label="Zurück">←</a>
      <h1>${list ? 'Liste bearbeiten' : 'Neue Liste'}</h1><span></span>
    </header>
    <form class="form" id="form">
      <label>Name<input name="title" required maxlength="40" placeholder="z. B. Unit 3 – At the zoo" value="${esc(list?.title || '')}"></label>
      <fieldset><legend>Sprache</legend>
        ${Object.entries(LANGUAGES).map(([code, l]) => `<label class="choice"><input type="radio" name="lang" value="${code}" ${code === lang ? 'checked' : ''}> ${l.flag} ${l.name}</label>`).join('')}
      </fieldset>
      <label>Symbol<input name="emoji" maxlength="4" value="${esc(list?.emoji || '📘')}"></label>
      <label>Wörter – eins pro Zeile: <code>fremdsprache = deutsch</code>
        <textarea name="words" rows="14" placeholder="${lang === 'fr' ? 'la ville = die Stadt&#10;le cinéma = das Kino&#10;souvent = oft' : 'zoo keeper = Tierpfleger/in&#10;giraffe = Giraffe&#10;feed = füttern'}">${esc(list ? wordsToLines(list.words) : '')}</textarea>
      </label>
      <p class="muted small">Tipps: Statt „=“ gehen auch „;“ oder ein Tabulator (Kopieren aus Excel). Mehrere richtige Lösungen mit „/“ trennen (<code>Mum/Mom</code>), optionale Teile in Klammern (<code>(to) go</code>). Ein dritter Teil wird als Hinweis angezeigt. Französische Nomen am besten mit Artikel eintragen (<code>la ville</code>) – Akzente zählen mit.</p>
      <div class="row">
        <button class="btn primary" type="submit">Speichern</button>
        ${list ? '<button class="btn danger" type="button" id="del">Liste löschen</button>' : ''}
      </div>
    </form>
  `;
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const words = parseWordLines(fd.get('words'));
    if (!words.length) {
      alert('Bitte mindestens ein Wort eintragen, z. B. „friend = Freund“.');
      return;
    }
    const id = list?.id || 'eigene-' + Date.now().toString(36);
    const listLang = fd.get('lang') || 'en';
    store.settings.subject = listLang;
    saveCustomList({ id, lang: listLang, type: 'vocab', title: fd.get('title').trim() || 'Meine Liste', emoji: fd.get('emoji').trim() || '📘', words });
    go(`#/liste/${encodeURIComponent(id)}`);
  });
  document.getElementById('del')?.addEventListener('click', () => {
    if (!confirm(`Liste „${list.title}“ wirklich löschen?`)) return;
    deleteCustomList(list.id);
    go('#/');
  });
}

// ---------- Einstellungen ----------

function renderSettings() {
  setTitle('Einstellungen');
  const s = store.settings;
  const opt = (name, value, label, current) => `<label class="choice"><input type="radio" name="${name}" value="${value}" ${String(current) === String(value) ? 'checked' : ''}> ${label}</label>`;
  app.innerHTML = `
    <header class="top">
      <a class="icon-btn" href="#/" aria-label="Zurück">←</a>
      <h1>Einstellungen</h1><span></span>
    </header>
    <form class="form" id="form">
      <fieldset><legend>Abfragerichtung</legend>
        ${opt('direction', 'de-en', 'Deutsch ➜ Englisch/Französisch schreiben', s.direction)}
        ${opt('direction', 'en-de', 'Englisch/Französisch ➜ Deutsch schreiben', s.direction)}
        ${opt('direction', 'mixed', 'Gemischt', s.direction)}
        <p class="muted small">Grammatik-Übungen werden immer in der Fremdsprache beantwortet.</p>
      </fieldset>
      <fieldset><legend>Wie streng wird geprüft?</legend>
        ${opt('tolerance', 1, '<b>Streng</b> – genau so, wie die Schrift erkannt wurde (empfohlen für Rechtschreibung)', s.tolerance)}
        ${opt('tolerance', 3, '<b>Großzügig</b> – auch wenn das Wort nur unter den ersten 3 Vorschlägen der Erkennung ist (bei unordentlicher Schrift)', s.tolerance)}
        <label class="choice"><input type="checkbox" name="caseSensitive" ${s.caseSensitive ? 'checked' : ''}> Groß- und Kleinschreibung beachten</label>
      </fieldset>
      <fieldset><legend>Stift</legend>
        ${opt('penOnly', 'auto', 'Automatisch: Sobald ein Stift benutzt wird, werden Finger/Handballen ignoriert', s.penOnly)}
        ${opt('penOnly', 'on', 'Nur Stift', s.penOnly)}
        ${opt('penOnly', 'off', 'Stift, Finger und Maus', s.penOnly)}
      </fieldset>
      <fieldset><legend>Handschrifterkennung</legend>
        ${opt('engine', 'auto', 'Automatisch', s.engine)}
        ${opt('engine', 'native', 'Nur auf dem Gerät (offline, nur manche Browser, z. B. Chrome auf Android)', s.engine)}
        ${opt('engine', 'google', 'Google-Handschrifterkennung (online, alle Geräte)', s.engine)}
        ${opt('engine', 'keyboard', 'Keine – mit Tastatur tippen', s.engine)}
        <p class="muted small">Bei der Online-Erkennung werden nur die Stiftstriche (keine persönlichen Daten) an Google geschickt.</p>
      </fieldset>
      <fieldset><legend>Sonstiges</legend>
        <label class="choice"><input type="checkbox" name="speak" ${s.speak ? 'checked' : ''}> Wörter vorlesen</label>
        <label>Wörter pro Lernrunde
          <select name="sessionSize">${[5, 10, 15, 20].map((n) => `<option ${n === s.sessionSize ? 'selected' : ''}>${n}</option>`).join('')}</select>
        </label>
      </fieldset>
      <fieldset><legend>Daten</legend>
        <p class="muted small">Dein Fortschritt wird nur auf diesem Gerät gespeichert. Mit einer Sicherung kannst du ihn auf ein anderes Gerät mitnehmen.</p>
        <div class="row">
          <button class="btn" type="button" id="export">💾 Sicherung speichern</button>
          <label class="btn" for="importFile">📂 Sicherung laden</label>
          <input type="file" id="importFile" accept="application/json,.json" hidden>
        </div>
        <button class="btn danger" type="button" id="reset">Fortschritt zurücksetzen</button>
      </fieldset>
    </form>
    <p class="muted small center">Voki · Vokabeltrainer mit Stifterkennung · Version ${APP_VERSION}</p>
  `;
  const form = document.getElementById('form');
  form.addEventListener('change', () => {
    const fd = new FormData(form);
    store.settings = {
      ...store.settings,
      direction: fd.get('direction'),
      tolerance: Number(fd.get('tolerance')),
      caseSensitive: fd.get('caseSensitive') === 'on',
      penOnly: fd.get('penOnly'),
      engine: fd.get('engine'),
      speak: fd.get('speak') === 'on',
      sessionSize: Number(fd.get('sessionSize')),
    };
    save();
  });
  document.getElementById('export').addEventListener('click', () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `voki-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  document.getElementById('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      importData(await file.text());
      alert('Sicherung geladen ✅');
      go('#/');
    } catch (err) {
      alert('Das hat nicht geklappt: ' + err.message);
    }
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Wirklich den ganzen Lernfortschritt löschen? Eigene Listen bleiben erhalten.')) return;
    resetProgress();
    go('#/');
  });
}

// ---------- Start ----------

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
    // Eine App vom Home-Bildschirm wird oft nur fortgesetzt statt neu gestartet –
    // deshalb beim Zurückkehren nach einer neuen Version suchen.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  }).catch(() => {});

  // Neue Version hat übernommen: einmal neu laden – aber nicht mitten im Üben,
  // dann beim nächsten Seitenwechsel (siehe route()).
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || updateReady) return;
    updateReady = true;
    if (!location.hash.startsWith('#/ueben')) location.reload();
  });
}

route();
