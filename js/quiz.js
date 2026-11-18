// Quiz-Maschine für Mathe und Bio: viele verschiedene Aufgabentypen zum Antippen.
//
// Aufgabentypen (Feld "t"):
//   mc       – Auswahl:        { q, a: [..], c: Index der richtigen Antwort, fixed? }
//   tf       – Ja/Nein:        { q, c: true|false, labels?: [ja, nein] }
//   num      – Zahl eingeben:  { q, c: '3/4' | '0,75' | '12', unit?, exact?, formHint? }
//   order    – Reihenfolge:    { q, items: [in richtiger Reihenfolge] }
//   sort     – Zuordnen:       { q, cats: [..], items: [[Text, Kategorie-Index], ..] }
//   match    – Paare finden:   { q, pairs: [[links, rechts], ..] }
//   scramble – Buchstabensalat:{ q, c: 'KIEMEN' }
// Alle Aufgaben können "why" (Erklärung) und "fig" (SVG-Zeichnung) haben.
// Im Text: **fett**, {3/4} = Bruch, {1 1/2} = gemischte Zahl.

import { addXp, store, save } from './store.js';
import { WritingPad } from './pad.js';
import { recognize, RecognitionError, inputMode } from './recognizer.js';
import { talk } from './comic.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function fmt(text) {
  return esc(text)
    .replace(/\{(-?)(?:(\d+) )?([\d□]+)\/([\d□]+)\}/g, (m, sign, whole, n, d) => `<span class="fr">${sign ? '−' : ''}${whole ?? ''}<span class="frac"><i>${n}</i><i>${d}</i></span></span>`)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}

// Schreibfeld (iPad + Apple Pencil) mit derselben Schnittstelle wie die Stift-Fläche
function fieldPad(input, onChange) {
  const history = [];
  input.addEventListener('input', () => { history.push(input.value); onChange(); });
  return {
    isEmpty: () => !input.value.trim(),
    text: () => input.value.trim(),
    clear: () => { input.value = ''; history.length = 0; onChange(); },
    undo: () => { history.pop(); input.value = history.at(-1) || ''; onChange(); },
    destroy: () => {},
    set disabled(v) { input.disabled = v; },
  };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// "3/4", "1 1/2", "0,75", "-3" -> Zahl (oder null)
export function parseNum(s) {
  s = String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ').replace(/\./g, ',');
  let m;
  if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) return +m[4] ? (m[1] ? -1 : 1) * (+m[2] + +m[3] / +m[4]) : null;
  if ((m = s.match(/^(-?)(\d+)\/(\d+)$/))) return +m[3] ? (m[1] ? -1 : 1) * (+m[2] / +m[3]) : null;
  if (/^-?\d+(,\d+)?$/.test(s)) return Number(s.replace(',', '.'));
  return null;
}

// Erkannte Handschrift -> Zahl. Typische Verwechsler (O statt 0, l statt 1 …) werden korrigiert.
// Nimmt den ersten Kandidaten, der zum erwarteten Muster passt.
export function readNumber(candidates, pattern) {
  for (const c of candidates || []) {
    const t = String(c).replace(/\s+/g, '').replace(/[Oo]/g, '0').replace(/[lI|]/g, '1').replace(/[−–—_]/g, '-')
      .replace(/[.·']/g, ',').replace(/[:÷]/g, '/').replace(/[Ss]/g, '5').replace(/[Bb]/g, '8').replace(/[gq]/g, '9').replace(/[Zz]/g, '2');
    if (pattern.test(t)) return t;
  }
  return null;
}

const normNum = (s) => String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
// Zahl hübsch anzeigen (Brüche übereinander, echtes Minuszeichen)
export const showNum = (s) => (/\//.test(s) ? fmt(`{${normNum(s)}}`) : esc(String(s).replace(/-/g, '−')));

const PRAISE = ['Richtig! 🎉', 'Super! ⭐', 'Klasse! 💪', 'Genau! ✅', 'Perfekt! 🌟', 'Stark! 🚀', 'Volltreffer! 🎯'];
const COMFORT = ['Noch nicht ganz.', 'Knapp daneben.', 'Mega guter Fehler – daraus lernst du!', 'Fast! Schau mal:'];

// ---------- Aufgabentypen ----------
// Jede Funktion baut die Aufgabe in "el" und ruft done(richtig, lösungHtml) auf.
// ctl.check(fn) zeigt den "Prüfen"-Knopf, ctl.ready(bool) schaltet ihn frei,
// ctl.nudge(text) zeigt einen Hinweis, ctl.onKey(fn) bekommt Tastendrücke.

const TYPES = {
  mc(q, el, done) {
    const opts = (q.fixed ? (x) => x : shuffle)(q.a.map((t, i) => ({ t, i })));
    const short = opts.every((o) => o.t.length <= 16);
    el.innerHTML = `<div class="qopts ${short ? 'two' : ''}">${opts.map((o) => `<button type="button" class="qopt" data-i="${o.i}">${fmt(o.t)}</button>`).join('')}</div>`;
    el.querySelectorAll('.qopt').forEach((b) => b.addEventListener('click', () => {
      const ok = Number(b.dataset.i) === q.c;
      el.querySelectorAll('.qopt').forEach((x) => {
        x.disabled = true;
        if (Number(x.dataset.i) === q.c) x.classList.add('right');
      });
      if (!ok) b.classList.add('wrong');
      done(ok, `Richtig ist: <b>${fmt(q.a[q.c])}</b>`);
    }));
  },

  tf(q, el, done) {
    const [yes, no] = q.labels || ['✅ Stimmt', '❌ Stimmt nicht'];
    el.innerHTML = `<div class="qopts two"><button type="button" class="qopt big" data-v="1">${esc(yes)}</button><button type="button" class="qopt big" data-v="0">${esc(no)}</button></div>`;
    el.querySelectorAll('.qopt').forEach((b) => b.addEventListener('click', () => {
      const ok = (b.dataset.v === '1') === q.c;
      el.querySelectorAll('.qopt').forEach((x) => {
        x.disabled = true;
        if ((x.dataset.v === '1') === q.c) x.classList.add('right');
      });
      if (!ok) b.classList.add('wrong');
      done(ok, `Richtig ist: <b>${esc(q.c ? yes : no)}</b>`);
    }));
  },

  num(q, el, done, ctl) {
    const isFrac = /\//.test(q.c);
    // Schreiben geht mit der Stift-Fläche (Erkennung im Browser) oder auf dem iPad im Schreibfeld (Apple Pencil)
    const ink = inputMode(['de'], 'auto');
    const canWrite = store.settings.engine !== 'keyboard' && ink !== 'keyboard';
    let mode = canWrite ? (store.settings.mathInput || 'pen') : 'keys';
    let val = '';
    let warned = false;
    let busy = false;
    let pads = [];
    let lastPad = null;
    const unit = q.unit ? `<span class="numunit">${esc(q.unit)}</span>` : '';
    const pretty = (v) => (/^-?(\d+ )?\d+\/\d+$/.test(v) ? showNum(v) : esc(v.replace(/-/g, '−').replace(/ /g, ' ')));
    const dropPads = () => { pads.forEach((p) => p.pad.destroy()); pads = []; lastPad = null; };
    ctl.onCleanup(dropPads);

    // Wert prüfen – egal ob getippt oder geschrieben
    function grade(v, viaPen) {
      const num = parseNum(v);
      if (num === null) return ctl.nudge(viaPen ? 'Das konnte ich nicht als Zahl lesen. Schreib es nochmal schön deutlich! ✏️' : 'Das ist noch keine fertige Zahl. Schau nochmal hin! 🔎');
      const same = Math.abs(num - parseNum(q.c)) < 1e-9;
      const formOk = !q.exact || normNum(v) === normNum(q.c);
      if (same && !formOk && !warned) {
        warned = true;
        return ctl.nudge(q.formHint || 'Der Wert stimmt schon! ✂️ Aber kürze noch vollständig.');
      }
      const ok = same && formOk;
      el.querySelectorAll('.key, .mtool, .modebtn').forEach((b) => { b.disabled = true; });
      pads.forEach((p) => { p.pad.disabled = true; });
      el.querySelector('#nf, .penbox')?.classList.add(ok ? 'right' : 'wrong');
      return done(ok, `${viaPen ? `Ich habe gelesen: <b>${pretty(v)}</b><br>` : ''}Richtig ist: <b class="big-ans">${showNum(q.c)}${q.unit ? ` ${esc(q.unit)}` : ''}</b>`, { redo: viaPen });
    }

    const modeBar = () => (!canWrite ? '' : `
      <div class="modebar">
        <button type="button" class="modebtn ${mode === 'pen' ? 'on' : ''}" data-mode="pen">✏️ Schreiben</button>
        <button type="button" class="modebtn ${mode === 'keys' ? 'on' : ''}" data-mode="keys">⌨️ Tippen</button>
      </div>`);

    // ----- Tippen -----
    function renderKeys() {
      const keys = ['7', '8', '9', '⌫', '4', '5', '6', '/', '1', '2', '3', ',', '-', '0', ' ', 'C'];
      const label = { '/': '<small>Bruch</small> ⁄', ' ': '<small>Leer</small> ␣', '-': '−', C: '🗑️' };
      el.innerHTML = `${modeBar()}
        <div class="numrow"><div class="numfield" id="nf"></div>${unit}</div>
        <div class="keypad">${keys.map((k) => `<button type="button" class="key ${/\d/.test(k) ? '' : 'fn'}" data-k="${k}">${label[k] || k}</button>`).join('')}</div>
        ${isFrac ? '<p class="muted small center">Bruch: <b>3 ⁄ 4</b> · gemischte Zahl: <b>1 ␣ 1 ⁄ 2</b></p>' : ''}`;
      const draw = () => {
        el.querySelector('#nf').innerHTML = val ? pretty(val) : '<span class="ph">?</span>';
        ctl.ready(!!val.trim());
      };
      const press = (k) => {
        if (k === '⌫') val = val.slice(0, -1);
        else if (k === 'C') val = '';
        else if (val.length < 12) val += k;
        draw();
      };
      el.querySelector('.keypad').addEventListener('click', (e) => {
        const b = e.target.closest('.key');
        if (b && !b.disabled) press(b.dataset.k);
      });
      ctl.onKey((e) => {
        if (/^[0-9]$/.test(e.key) || e.key === '/' || e.key === ' ' || e.key === '-') { e.preventDefault(); press(e.key); }
        else if (e.key === ',' || e.key === '.') press(',');
        else if (e.key === 'Backspace') { e.preventDefault(); press('⌫'); }
      });
      ctl.check(() => grade(val, false));
      draw();
    }

    // ----- Mit dem Stift schreiben -----
    // Ganze Zahlen und Kommazahlen: ein Feld. Brüche: eigene Felder für Ganze, Zähler und Nenner.
    function renderPen() {
      const scribble = ink === 'scribble';
      const field = (name, hint) => (scribble
        ? `<input class="mpad mfield" data-pad="${name}" aria-label="${hint}" inputmode="decimal" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="✏️">`
        : `<canvas class="mpad" data-pad="${name}" aria-label="${hint}"></canvas>`);
      const box = (name, cls, hint) => `<div class="padcell ${cls}">${field(name, hint)}${cls === 'whole' ? '<small>Ganze<br>(nur wenn nötig)</small>' : ''}</div>`;
      el.innerHTML = `${modeBar()}
        <div class="penbox ${isFrac ? 'isfrac' : ''} ${scribble ? 'scribble' : ''}">
          ${isFrac
            ? `${box('whole', 'whole', 'Ganze')}<div class="padfrac">${box('num', 'part', 'Zähler')}<div class="padbar"></div>${box('den', 'part', 'Nenner')}</div>`
            : box('one', 'one', 'Ergebnis')}
          ${unit}
        </div>
        <div class="mtools">
          <button type="button" class="tool mtool" data-tool="undo" aria-label="Rückgängig">↶</button>
          <button type="button" class="tool mtool" data-tool="clear" aria-label="Löschen">🗑️</button>
          <span class="muted small">${isFrac ? 'Schreib den Zähler oben und den Nenner unten.' : scribble ? 'Schreib dein Ergebnis mit dem Apple Pencil ins Feld.' : 'Schreib dein Ergebnis mit dem Stift oder Finger.'}</span>
        </div>`;
      const update = () => ctl.ready(!busy && pads.some((p) => !p.pad.isEmpty()));
      pads = [...el.querySelectorAll('.mpad')].map((node) => {
        const p = { name: node.dataset.pad, pad: null };
        const onChange = () => { if (!p.pad.isEmpty()) lastPad = p; update(); };
        p.pad = scribble ? fieldPad(node, onChange) : new WritingPad(node, { penOnly: store.settings.penOnly, onChange });
        return p;
      });
      el.querySelector('.mtools').addEventListener('click', (e) => {
        const b = e.target.closest('.mtool');
        if (!b || b.disabled) return;
        if (b.dataset.tool === 'clear') pads.forEach((p) => p.pad.clear());
        else (lastPad && !lastPad.pad.isEmpty() ? lastPad : pads.find((p) => !p.pad.isEmpty()))?.pad.undo();
      });
      ctl.onKey(() => {});
      ctl.check(async () => {
        if (busy) return;
        busy = true;
        ctl.ready(false, 'Lese …');
        const read = {};
        try {
          for (const p of pads) {
            if (p.pad.isEmpty()) continue;
            const cands = scribble ? [p.pad.text()] : await recognize(p.pad.strokes, { lang: 'de', pointerType: p.pad.lastPointerType });
            read[p.name] = readNumber(cands, p.name === 'one' ? /^-?\d+(,\d+)?$|^-?\d+\/\d+$/ : /^\d+$/) ?? '?';
          }
        } catch (e) {
          busy = false;
          ctl.nudge(e instanceof RecognitionError ? e.message : `Fehler bei der Erkennung: ${e.message}`);
          setMode('keys', false);
          return;
        }
        busy = false;
        if (!el.isConnected) return; // Aufgabe inzwischen verlassen
        update();
        let v;
        if (!isFrac) v = read.one;
        else if (read.num && read.den) v = `${read.whole ? `${read.whole} ` : ''}${read.num}/${read.den}`;
        else if (read.whole && !read.num && !read.den) v = read.whole;
        else if (read.num && !read.den && !read.whole) v = read.num; // nur eine ganze Zahl ins obere Feld geschrieben
        else return ctl.nudge('Zu einem Bruch gehören Zähler (oben) und Nenner (unten). ✏️');
        grade(v, true);
      });
      update();
    }

    function setMode(m, remember = true) {
      mode = m;
      if (remember) { store.settings.mathInput = m; save(); }
      dropPads();
      val = '';
      (mode === 'pen' ? renderPen : renderKeys)();
    }
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.modebtn');
      if (b && !b.disabled && b.dataset.mode !== mode) setMode(b.dataset.mode);
    });
    (mode === 'pen' ? renderPen : renderKeys)();
  },

  order(q, el, done, ctl) {
    let pool = shuffle(q.items.map((t, i) => i));
    if (pool.every((v, i) => v === i)) pool.reverse();
    const picked = [];
    const draw = () => {
      el.innerHTML = `
        <div class="order-slots">${q.items.map((_, k) => (picked[k] !== undefined
          ? `<button type="button" class="chip on" data-un="${k}"><b>${k + 1}</b> ${fmt(q.items[picked[k]])}</button>`
          : `<span class="chip slot"><b>${k + 1}</b></span>`)).join('')}</div>
        <div class="order-pool">${pool.map((i) => `<button type="button" class="chip" data-add="${i}" ${picked.includes(i) ? 'disabled' : ''}>${fmt(q.items[i])}</button>`).join('')}</div>`;
      ctl.ready(picked.length === q.items.length);
    };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b || b.disabled || el.dataset.locked) return;
      if (b.dataset.add !== undefined) picked.push(Number(b.dataset.add));
      else if (b.dataset.un !== undefined) picked.splice(Number(b.dataset.un), 1);
      draw();
    });
    ctl.check(() => {
      // gleiche Texte an verschiedenen Stellen gelten als gleich
      const ok = picked.every((i, k) => q.items[i] === q.items[k]);
      el.dataset.locked = '1';
      el.querySelectorAll('.order-slots .chip').forEach((c, k) => c.classList.add(q.items[picked[k]] === q.items[k] ? 'right' : 'wrong'));
      done(ok, `Richtige Reihenfolge:<br><b>${q.items.map(fmt).join(' → ')}</b>`);
    });
    draw();
  },

  sort(q, el, done, ctl) {
    const items = shuffle(q.items.map(([t, c], i) => ({ t, c, i })));
    const chosen = new Map();
    el.innerHTML = `<div class="sort">${items.map((it) => `
      <div class="sort-row" data-i="${it.i}">
        <span class="sort-item">${fmt(it.t)}</span>
        <span class="sort-btns">${q.cats.map((c, k) => `<button type="button" class="seg" data-c="${k}">${esc(c)}</button>`).join('')}</span>
      </div>`).join('')}</div>`;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.seg');
      if (!b || el.dataset.locked) return;
      const row = b.closest('.sort-row');
      row.querySelectorAll('.seg').forEach((x) => x.classList.toggle('on', x === b));
      chosen.set(Number(row.dataset.i), Number(b.dataset.c));
      ctl.ready(chosen.size === items.length);
    });
    ctl.check(() => {
      el.dataset.locked = '1';
      let wrong = 0;
      for (const it of items) {
        const row = el.querySelector(`.sort-row[data-i="${it.i}"]`);
        const ok = chosen.get(it.i) === it.c;
        if (!ok) wrong++;
        row.classList.add(ok ? 'right' : 'wrong');
        row.querySelectorAll('.seg').forEach((x) => { if (Number(x.dataset.c) === it.c) x.classList.add('correct'); });
      }
      done(wrong === 0, `${wrong} ${wrong === 1 ? 'Zuordnung war' : 'Zuordnungen waren'} falsch – die richtigen sind grün umrandet.`);
    });
    ctl.ready(false);
  },

  match(q, el, done) {
    const left = shuffle(q.pairs.map(([l], i) => ({ t: l, i })));
    let right = shuffle(q.pairs.map(([, r], i) => ({ t: r, i })));
    if (q.pairs.length > 1 && right.every((r, k) => r.i === left[k].i)) right = [...right.slice(1), right[0]];
    let sel = null;
    let mistakes = 0;
    let found = 0;
    el.innerHTML = `<div class="match">
      <div class="match-col">${left.map((o) => `<button type="button" class="chip mchoice" data-side="l" data-i="${o.i}">${fmt(o.t)}</button>`).join('')}</div>
      <div class="match-col">${right.map((o) => `<button type="button" class="chip mchoice" data-side="r" data-i="${o.i}">${fmt(o.t)}</button>`).join('')}</div>
    </div>`;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.mchoice');
      if (!b || b.disabled) return;
      if (!sel || sel.dataset.side === b.dataset.side) {
        sel?.classList.remove('on');
        sel = sel === b ? null : b;
        sel?.classList.add('on');
        return;
      }
      if (sel.dataset.i === b.dataset.i) {
        for (const x of [sel, b]) { x.classList.remove('on'); x.classList.add('right'); x.disabled = true; }
        found++;
      } else {
        mistakes++;
        for (const x of [sel, b]) { x.classList.remove('on', 'shake'); void x.offsetWidth; x.classList.add('shake'); }
      }
      sel = null;
      if (found === q.pairs.length) done(mistakes <= 1, `Du hast ${mistakes} Fehlversuche gebraucht. So gehört es zusammen:<br>${q.pairs.map(([l, r]) => `<b>${fmt(l)}</b> ↔ ${fmt(r)}`).join('<br>')}`);
    });
  },

  scramble(q, el, done, ctl) {
    const word = [...q.c.toUpperCase()];
    let letters = shuffle(word.map((ch, i) => ({ ch, i })));
    if (word.length > 2 && letters.every((l, k) => l.ch === word[k])) letters = [...letters.slice(1), letters[0]];
    const picked = [];
    const draw = () => {
      el.innerHTML = `
        <div class="scr-slots">${word.map((_, k) => `<button type="button" class="tile ${picked[k] ? 'on' : 'slot'}" data-un="${k}">${picked[k] ? esc(picked[k].ch) : ''}</button>`).join('')}</div>
        <div class="scr-pool">${letters.map((l) => `<button type="button" class="tile" data-add="${l.i}" ${picked.includes(l) ? 'disabled' : ''}>${esc(l.ch)}</button>`).join('')}</div>`;
      ctl.ready(picked.length === word.length);
    };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.tile');
      if (!b || b.disabled || el.dataset.locked) return;
      if (b.dataset.add !== undefined) picked.push(letters.find((l) => l.i === Number(b.dataset.add)));
      else if (picked[Number(b.dataset.un)]) picked.splice(Number(b.dataset.un), 1);
      draw();
    });
    ctl.check(() => {
      const ok = picked.map((l) => l.ch).join('') === word.join('');
      el.dataset.locked = '1';
      el.querySelectorAll('.scr-slots .tile').forEach((t, k) => t.classList.add(picked[k].ch === word[k] ? 'right' : 'wrong'));
      done(ok, `Richtig ist: <b class="big-ans">${esc(word.join(''))}</b>`);
    });
    draw();
  },
};

const TYPE_LABEL = {
  mc: 'Tippe die richtige Antwort an',
  tf: 'Was meinst du?',
  num: 'Wie lautet das Ergebnis?',
  order: 'Tippe in der richtigen Reihenfolge an',
  sort: 'Ordne jedes Kärtchen zu',
  match: 'Finde die Paare: erst links, dann rechts antippen',
  scramble: 'Buchstabensalat! Tippe die Buchstaben in der richtigen Reihenfolge an',
};

// ---------- Ablauf einer Runde ----------
//
// opts: { title, emoji, backHash, questions, who, facts, onDone(result) -> { html, bind? } }
// Gibt eine Aufräum-Funktion zurück.

export function runQuiz(app, opts) {
  const total = opts.questions.length;
  const S = {
    queue: opts.questions.map((q, n) => ({ q, n, retry: false })),
    pos: 0,
    first: new Map(), // Aufgabe -> beim ersten Versuch richtig?
    combo: 0,
    bestCombo: 0,
    xp: 0,
    answered: false,
    timer: null,
    keyHandler: null,
    checkHandler: null,
  };

  app.innerHTML = `
    <div class="quiz">
      <header class="bar">
        <a class="icon-btn" href="${opts.backHash}" aria-label="Beenden">✕</a>
        <div class="meter"><span id="qprog"></span></div>
        <span id="qcount" class="muted"></span>
      </header>
      <div class="qcombo" id="qcombo"></div>
      <section class="qcard" id="qcard">
        <div class="qlabel" id="qlabel"></div>
        <div class="qtext" id="qtext"></div>
        <div class="qfig" id="qfig"></div>
      </section>
      <div class="qbody" id="qbody"></div>
      <div class="qfb" id="qfb" aria-live="polite"></div>
      <div class="qact" id="qact"></div>
    </div>`;
  const $ = (id) => app.querySelector(`#${id}`);

  const onKey = (e) => {
    if (e.key === 'Enter') {
      const btn = $('qnext') || $('qcheck');
      if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
      return;
    }
    if (!S.answered) S.keyHandler?.(e);
  };
  document.addEventListener('keydown', onKey);
  const cleanup = () => {
    S.typeCleanup?.();
    S.typeCleanup = null;
    clearTimeout(S.timer);
    document.removeEventListener('keydown', onKey);
  };

  function show() {
    const { q, retry } = S.queue[S.pos];
    S.typeCleanup?.();
    S.typeCleanup = null;
    S.answered = false;
    S.keyHandler = null;
    S.checkHandler = null;
    $('qprog').style.width = `${(S.first.size / total) * 100}%`;
    $('qcount').textContent = retry ? '🔁' : `${Math.min(S.first.size + 1, total)}/${total}`;
    $('qcombo').innerHTML = S.combo >= 2 ? `<span class="combo">🔥 ${S.combo} in Folge!</span>` : '';
    $('qcard').className = 'qcard';
    $('qlabel').textContent = (retry ? '🔁 Nochmal: ' : '') + (q.label || TYPE_LABEL[q.t]);
    $('qtext').innerHTML = fmt(q.q);
    $('qfig').innerHTML = q.fig || '';
    $('qfb').innerHTML = '';
    $('qact').innerHTML = '';
    // frisches Element, damit keine alten Klick-Listener übrig bleiben
    const body = document.createElement('div');
    body.className = 'qbody';
    body.id = 'qbody';
    $('qbody').replaceWith(body);
    const ctl = {
      check(fn) {
        S.checkHandler = fn;
        $('qact').innerHTML = '<button class="btn primary big" id="qcheck" disabled>Prüfen ✓</button>';
        $('qcheck').addEventListener('click', () => { if (!S.answered) fn(); });
      },
      ready(on, label) { const b = $('qcheck'); if (b) { b.disabled = !on; b.textContent = label || 'Prüfen ✓'; } },
      onCleanup(fn) { S.typeCleanup = fn; },
      nudge(msg) {
        $('qfb').innerHTML = `<div class="msg warn">${esc(msg)}</div>`;
        body.classList.remove('shake'); void body.offsetWidth; body.classList.add('shake');
      },
      onKey(fn) { S.keyHandler = fn; },
    };
    TYPES[q.t](q, body, (ok, solution, extra) => answered(ok, solution, extra), ctl);
  }

  function answered(ok, solution, extra = {}) {
    if (S.answered) return;
    S.answered = true;
    const item = S.queue[S.pos];
    const { q } = item;
    const comboBefore = S.combo;
    let gained = 0;
    if (!item.retry) {
      S.first.set(item.n, ok);
      if (ok) {
        S.combo++;
        S.bestCombo = Math.max(S.bestCombo, S.combo);
        gained = 10 + (S.combo > 0 && S.combo % 5 === 0 ? 5 : 0);
      } else {
        S.combo = 0;
        S.queue.push({ q, n: item.n, retry: true });
      }
    } else if (ok) gained = 3;
    if (gained) { S.xp += gained; addXp(gained); }
    $('qprog').style.width = `${(S.first.size / total) * 100}%`;
    $('qcard').classList.add(ok ? 'right' : 'wrong');
    const bonus = !item.retry && ok && S.combo % 5 === 0 ? ` <span class="combo">🔥 ${S.combo}er-Serie! +5 ⭐</span>` : '';
    $('qfb').innerHTML = `
      ${ok ? `<div class="msg ok">${pick(PRAISE)}${bonus}</div>` : `<div class="msg bad">${pick(COMFORT)}<div class="read">${solution}</div></div>`}
      ${q.why ? `<div class="msg info">💡 ${fmt(q.why)}</div>` : ''}`;
    $('qact').innerHTML = `<button class="btn primary big" id="qnext">${S.pos + 1 >= S.queue.length ? 'Zur Auswertung 🏁' : 'Weiter ➜'}</button>`;
    $('qnext').addEventListener('click', next);
    // Handschrift falsch gelesen? Dann darf die Aufgabe ohne Wertung nochmal geschrieben werden.
    if (!ok && extra.redo) {
      $('qact').insertAdjacentHTML('beforeend', '<button class="link" id="qredo">Ich hatte es richtig – die Schrift wurde falsch gelesen. Nochmal schreiben</button>');
      $('qredo').addEventListener('click', () => {
        if (!item.retry) {
          S.first.delete(item.n);
          S.queue.pop();
          S.combo = comboBefore;
        }
        show();
      });
    }
    if (ok && !q.why) S.timer = setTimeout(next, 1100);
    else $('qnext').scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }

  function next() {
    clearTimeout(S.timer);
    S.pos++;
    if (S.pos >= S.queue.length) return finish();
    show();
    window.scrollTo(0, 0);
  }

  function finish() {
    cleanup();
    const right = [...S.first.values()].filter(Boolean).length;
    const ratio = total ? right / total : 1;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
    const extra = opts.onDone?.({ right, total, stars, xp: S.xp, bestCombo: S.bestCombo }) || {};
    const who = opts.who || 'alpaca';
    const say = ratio === 1 ? ['Fehlerfrei! Das war meisterhaft. 🏆', 'excited']
      : stars === 3 ? ['Fast alles richtig – ganz stark!', 'proud']
        : stars === 2 ? ['Gut gemacht! Mit einer Runde mehr holst du den dritten Stern.', 'happy']
          : stars === 1 ? ['Ein Stern ist geschafft! Schau dir die Erklärungen nochmal an – dann klappt der nächste.', 'happy']
            : ['Das war knifflig – völlig okay! Jeder Fehler macht dich schlauer. Probier es gleich nochmal.', 'thinking'];
    const fact = opts.facts?.length ? pick(opts.facts) : '';
    app.innerHTML = `
      <header class="top">
        <a class="icon-btn" href="${opts.backHash}" aria-label="Zurück">←</a>
        <h1>${esc(opts.emoji || '🏁')} Geschafft!</h1><span></span>
      </header>
      ${stars === 3 ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 53) % 100}%;--d:${(i % 6) * 0.15}s;--r:${(i * 67) % 360}deg">${['🎉', '⭐', '✨', '🎊'][i % 4]}</i>`).join('')}</div>` : ''}
      <section class="hero center">
        <div class="stars pop-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <p class="score">${right} von ${total} beim ersten Versuch richtig</p>
        <p class="muted">+${S.xp} ⭐ Punkte${S.bestCombo >= 3 ? ` · längste Serie: 🔥 ${S.bestCombo}` : ''}</p>
        ${extra.top || ''}
      </section>
      ${talk(who, say[0], say[1])}
      ${fact ? `<div class="fact"><b>🤯 Wusstest du?</b> ${fmt(fact)}</div>` : ''}
      <div class="qact">${extra.html || ''}<a class="btn big" href="${opts.backHash}">Fertig</a></div>`;
    window.scrollTo(0, 0);
    extra.bind?.();
  }

  if (!total) { location.hash = opts.backHash; return cleanup; }
  show();
  return cleanup;
}
