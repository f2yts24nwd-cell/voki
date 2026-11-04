// Lern-Werkstatt: Lernmethoden für die 6. Klasse – mit Comics, Lexikon,
// Challenges und interaktiven Detektiv-Fällen.

import { store, toggleTried, solveCase } from './store.js';
import { comicHtml, portrait, talk, CAST } from './comic.js';
import {
  ISLANDS, LADDER, METHODS, PHASES, CASES, SPELLS, GLOSSARY, SUBJECTS,
  DETECTIVE_CARD, MUSCLE_CARD, cardById, islandById, caseById, findTerm, spellOfTheDay,
} from './lernen-data.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// **fett** und [[Begriff]] bzw. [[Begriff|angezeigter Text]] (Link ins Lexikon)
function fmt(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\[\[(.+?)(?:\|(.+?))?\]\]/g, (m, key, shown) => {
      const g = findTerm(key);
      const label = shown || key;
      return g ? `<button type="button" class="term" data-term="${g.id}">${label}</button>` : label;
    });
}

const subjectChip = (id) => {
  const s = SUBJECTS[id] || SUBJECTS.alle;
  return `<span class="subj">${s.emoji} ${esc(s.name)}</span>`;
};

const tried = (id) => !!store.learn.tried[id];
const solved = (id) => !!store.learn.cases[id];

function islandProgress(island) {
  if (island.id === 'leiter') {
    const m = METHODS.filter((x) => x.island === 'leiter');
    return { done: m.filter((x) => tried(x.id)).length, total: m.length, unit: 'ausprobiert' };
  }
  if (island.id === 'vokabeln') return { done: PHASES.filter((x) => tried(x.id)).length, total: PHASES.length, unit: 'geschafft' };
  if (island.id === 'detektiv') return { done: CASES.filter((c) => solved(c.id)).length, total: CASES.length, unit: 'Fälle gelöst' };
  return { done: tried(MUSCLE_CARD.id) ? 1 : 0, total: 1, unit: 'Challenge', extra: `${SPELLS.length} Zaubersätze` };
}

// Alle Sticker: jede Karte + jeder Fall
function allStickers() {
  return [
    ...METHODS.map((m) => ({ emoji: m.emoji, title: m.title, got: tried(m.id), href: `#/lernen/karte/${m.id}` })),
    ...PHASES.map((m) => ({ emoji: m.emoji, title: m.title, got: tried(m.id), href: `#/lernen/karte/${m.id}` })),
    { emoji: DETECTIVE_CARD.emoji, title: DETECTIVE_CARD.title, got: tried(DETECTIVE_CARD.id), href: `#/lernen/karte/${DETECTIVE_CARD.id}` },
    { emoji: MUSCLE_CARD.emoji, title: MUSCLE_CARD.title, got: tried(MUSCLE_CARD.id), href: `#/lernen/karte/${MUSCLE_CARD.id}` },
    ...CASES.map((c) => ({ emoji: '🕵️', title: `Fall: ${SUBJECTS[c.subject].name}`, got: solved(c.id), href: `#/lernen/fall/${c.id}` })),
  ];
}

// ---------- Begriffs-Fenster ----------

function glossaryBody(g) {
  return `
    <div class="g-head"><span class="g-emoji">${g.emoji}</span><h3>${esc(g.term)}</h3></div>
    <p>${fmt(g.text)}</p>
    ${g.list ? `<dl class="g-list">${g.list.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    ${g.example ? `<p class="g-example"><b>Beispiel:</b> ${fmt(g.example)}</p>` : ''}`;
}

function openTerm(id) {
  const g = GLOSSARY.find((x) => x.id === id);
  if (!g) return;
  closeTerm();
  const el = document.createElement('div');
  el.className = 'overlay';
  el.id = 'termOverlay';
  el.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(g.term)}">
      <button class="icon-btn sheet-close" aria-label="Schließen">✕</button>
      ${glossaryBody(g)}
      <div class="row">
        ${g.method && cardById(g.method) ? `<a class="btn primary" href="#/lernen/karte/${g.method}">${cardById(g.method).emoji} Zur Methode</a>` : ''}
        <a class="btn" href="#/lernen/lexikon/${g.id}">📖 Im Lexikon</a>
      </div>
    </div>`;
  el.addEventListener('click', (e) => {
    if (e.target === el || e.target.closest('.sheet-close') || e.target.closest('a')) closeTerm();
  });
  document.body.appendChild(el);
  el.querySelector('.sheet-close').focus();
}

function closeTerm() {
  document.getElementById('termOverlay')?.remove();
}

// ---------- Hauptfunktion ----------

export function renderLernen(app, [sub, id], ctx) {
  const onClick = (e) => {
    const t = e.target.closest('.term');
    if (t) { e.preventDefault(); openTerm(t.dataset.term); }
  };
  const onKey = (e) => { if (e.key === 'Escape') closeTerm(); };
  app.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  let extraCleanup = () => {};
  const cleanup = () => {
    app.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    closeTerm();
    extraCleanup();
  };

  if (sub === 'insel' && islandById(id)) renderIsland(app, islandById(id), ctx);
  else if (sub === 'karte' && cardById(id)) renderCard(app, cardById(id), ctx);
  else if (sub === 'lexikon') renderGlossary(app, id, ctx);
  else if (sub === 'fall' && caseById(id)) extraCleanup = renderCase(app, caseById(id), ctx) || extraCleanup;
  else renderOverview(app, ctx);
  return cleanup;
}

const back = (href, title) => `
  <header class="top">
    <a class="icon-btn" href="${href}" aria-label="Zurück">←</a>
    <h1>${title}</h1><span></span>
  </header>`;

// ---------- Übersicht ----------

function renderOverview(app, ctx) {
  ctx.setTitle('Lern-Werkstatt');
  const [spell, meaning] = spellOfTheDay();
  const stickers = allStickers();
  const got = stickers.filter((s) => s.got).length;
  app.innerHTML = `
    <header class="top">
      <h1>✏️ Voki</h1>
      <a class="icon-btn" href="#/einstellungen" aria-label="Einstellungen">⚙️</a>
    </header>
    ${ctx.tabs('learn')}
    ${comicHtml([{
      bg: 'outside',
      cast: [['elara', 'center', 'excited', 'wave'], ['sheep', 'left', 'happy'], ['alpaca', 'right', 'happy']],
      say: [['left', 'Fehler sind hier erlaubt! Mäh!'], ['center', 'Willkommen in der **Lern-Werkstatt**!'], ['right', 'Hier lernst du, **wie** man lernt.']],
    }], { single: true })}
    <a class="spell-day" href="#/lernen/insel/kopf">
      <span class="spell-label">✨ Zaubersatz des Tages</span>
      <span class="spell-text">„${esc(spell)}“</span>
      <span class="spell-meaning">${esc(meaning)}</span>
    </a>
    <h2>🏝️ Wähle eine Insel</h2>
    <div class="islands">
      ${ISLANDS.map((i) => {
        const p = islandProgress(i);
        return `
        <a class="island" href="#/lernen/insel/${i.id}" style="--c:${i.color}">
          <span class="island-emoji">${i.emoji}</span>
          <span class="island-title">${esc(i.title)}</span>
          <span class="island-sub">${esc(i.subtitle)}</span>
          <span class="island-meta">${p.extra ? `${esc(p.extra)} · ` : ''}${p.done}/${p.total} ${esc(p.unit)}</span>
          <span class="meter"><span style="width:${(p.done / p.total) * 100}%"></span></span>
        </a>`;
      }).join('')}
    </div>
    <a class="lex-card" href="#/lernen/lexikon">
      <span class="island-emoji">📖</span>
      <span><b>Lern-Lexikon</b><br><span class="muted small">Was ist eigentlich eine Mindmap? Eine Eselsbrücke? Ein Operator? Hier steht’s.</span></span>
    </a>
    <h2>🏅 Deine Sticker · ${got} von ${stickers.length}</h2>
    <p class="muted small">Jede Methode hat eine Challenge. Wenn du sie ausprobiert hast, bekommst du den Sticker. Detektiv-Fälle geben einen 🕵️-Sticker.</p>
    <div class="album">
      ${stickers.map((s) => `<a class="sticker ${s.got ? 'got' : ''}" href="${s.href}" title="${esc(s.title)}" aria-label="${esc(s.title)}${s.got ? ' (geschafft)' : ''}">${s.got ? s.emoji : '?'}</a>`).join('')}
    </div>
    <h2>👋 Wer ist wer?</h2>
    <div class="cast">
      ${Object.entries(CAST).map(([who, c]) => `
        <div class="cast-card">${portrait(who, 'happy')}<div><b>${c.emoji} ${esc(c.name)}</b><p>${esc(c.text)}</p></div></div>`).join('')}
    </div>
    <p class="credit">Die Ideen stammen von den Arbeitsblättern „17 Lernmethoden“, „Vokabeln lernen“, „Aufgabenstellungen verstehen“ und „17 Zaubersätze“ von Caroline von St. Ange (learn learning with Caroline) – hier in eigenen Worten und mit eigenen Bildern umgesetzt.</p>
  `;
  ctx.bindTabs();
}

// ---------- Inseln ----------

function renderIsland(app, island, ctx) {
  ctx.setTitle(island.title);
  let body = '';
  if (island.id === 'leiter') {
    body = `
      ${comicHtml(island.comic)}
      ${talk('alpaca', 'Tippe auf eine Methode, dann erkläre ich sie dir. Fang ruhig unten an – und klettere nach oben!')}
      <div class="ladder">
        <div class="ladder-end hi">🏆 Sehr effektiv</div>
        ${[...LADDER].reverse().map((r) => `
          <div class="rung" style="--lvl:${r.level}">
            <div class="rung-label"><span class="rung-no">${r.level}</span><b>${esc(r.title)}</b><small>${esc(r.note)}</small></div>
            <div class="rung-items">
              ${METHODS.filter((m) => m.level === r.level).map((m) => `
                <a class="mchip ${tried(m.id) ? 'done' : ''}" href="#/lernen/karte/${m.id}">
                  <span class="mchip-emoji">${m.emoji}</span>
                  <span class="mchip-text"><b>${esc(m.title)}</b><small>${esc(m.short)}</small></span>
                  ${tried(m.id) ? '<span class="mchip-check">✅</span>' : ''}
                </a>`).join('')}
            </div>
          </div>`).join('')}
        <div class="rung ground">
          <div class="rung-label"><span class="rung-no">0</span><b>„Ich schau mir alles nochmal an.“</b><small>Nur anschauen ist noch keine Lernmethode – dein Gehirn schläft dabei fast ein. 😴</small></div>
        </div>
        <div class="ladder-end lo">😴 Weniger effektiv</div>
      </div>`;
  } else if (island.id === 'vokabeln') {
    body = `
      ${comicHtml(island.comic)}
      ${talk('elara', 'Vokabeln bleiben am besten im Kopf, wenn man sie **Schritt für Schritt** lernt. Hier sind die 4 Etappen:')}
      <div class="path">
        ${PHASES.map((p) => `
          <a class="path-step ${tried(p.id) ? 'done' : ''}" href="#/lernen/karte/${p.id}">
            <span class="path-no">${p.step <= 4 ? p.step : '★'}</span>
            <span class="path-emoji">${p.emoji}</span>
            <span class="path-text"><b>${esc(p.title)}</b><small>${esc(p.short)}</small></span>
            ${tried(p.id) ? '<span class="mchip-check">✅</span>' : ''}
          </a>`).join('')}
      </div>
      ${talk('alpaca', 'Voki hilft dir bei allen Etappen: **Lernen** (neue Wörter einprägen), **Karteikasten**, **Test** und **Wiederholen**.')}`;
  } else if (island.id === 'detektiv') {
    const op = GLOSSARY.find((g) => g.id === 'operator');
    body = `
      ${comicHtml(DETECTIVE_CARD.comic)}
      <a class="big-link" href="#/lernen/karte/${DETECTIVE_CARD.id}">
        <span class="big-link-title">🔍 Die 5 Detektiv-Schritte ${tried(DETECTIVE_CARD.id) ? '✅' : ''}</span>
        <span class="steps-mini">${DETECTIVE_CARD.steps.map(([e, t], i) => `<span><b>${i + 1}</b> ${e} ${esc(t)}</span>`).join('')}</span>
        <span class="muted small">Antippen für die ganze Erklärung →</span>
      </a>
      <h2>🕵️ Fälle lösen</h2>
      <p class="muted small">Echte Aufgaben aus verschiedenen Fächern. Mach die 5 Schritte – und finde heraus, was die Aufgabe wirklich will!</p>
      <div class="cases">
        ${CASES.map((c, i) => `
          <a class="case ${solved(c.id) ? 'done' : ''}" href="#/lernen/fall/${c.id}">
            <span class="case-head">${subjectChip(c.subject)}<span>${solved(c.id) ? '✅' : `Fall ${i + 1}`}</span></span>
            <span class="case-text">„${esc(c.text)}“</span>
          </a>`).join('')}
      </div>
      <h2>🎯 Aufgaben-Wörter (Operatoren)</h2>
      <p class="muted small">${fmt('Diese Tu-Wörter verraten dir, was du tun sollst. Sie heißen [[Operatoren]].')}</p>
      <dl class="g-list ops">${op.list.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  } else {
    const [spell] = spellOfTheDay();
    body = `
      ${comicHtml(MUSCLE_CARD.comic)}
      <a class="big-link" href="#/lernen/karte/${MUSCLE_CARD.id}">
        <span class="big-link-title">💪 Dein Gehirn ist ein Muskel ${tried(MUSCLE_CARD.id) ? '✅' : ''}</span>
        <span class="muted small">Warum Anstrengung gut ist – mit Fehler-Challenge →</span>
      </a>
      <h2>✨ 17 Zaubersätze</h2>
      ${talk('sheep', 'Tippe auf einen Satz, dann siehst du, was er bedeutet. Mein Lieblingssatz: „Mega guter Fehler!“ Mäh!', 'excited')}
      <div class="spells">
        ${SPELLS.map(([s, m], i) => `
          <button type="button" class="spell ${s === spell ? 'today' : ''}" style="--h:${(i * 47) % 360}">
            <span class="spell-front">${s === spell ? '<small>Heute:</small>' : ''}„${esc(s)}“</span>
            <span class="spell-back">${esc(m)}</span>
          </button>`).join('')}
      </div>
      ${talk('alpaca', 'Sucht euch als Familie einen Lieblingssatz aus und hängt ihn an den Kühlschrank. Wenn es schwer wird, sagt ihn laut!')}`;
  }
  app.innerHTML = `${back('#/lernen', `${island.emoji} ${esc(island.title)}`)}<p class="island-intro">${esc(island.subtitle)}</p>${body}`;
  app.querySelectorAll('.spell').forEach((b) => b.addEventListener('click', () => b.classList.toggle('flipped')));
}

// ---------- Methoden-Karte ----------

function siblings(card) {
  if (card.island === 'leiter') return METHODS.filter((m) => m.island === 'leiter');
  if (card.island === 'vokabeln') return PHASES;
  return [card];
}

function renderCard(app, card, ctx) {
  ctx.setTitle(card.title);
  const island = islandById(card.island);
  const list = siblings(card);
  const idx = list.indexOf(card);
  const prev = list[idx - 1];
  const next = list[idx + 1];
  let badge = '';
  if (card.level) {
    badge = `<div class="level-badge">🪜 Lern-Leiter: Stufe <b>${card.level}</b> von 6
      <span class="level-bar">${[1, 2, 3, 4, 5, 6].map((l) => `<i class="${l <= card.level ? 'on' : ''}"></i>`).join('')}</span></div>`;
  } else if (card.step && card.step <= 4) {
    badge = `<div class="level-badge">🔤 Etappe <b>${card.step}</b> von 4
      <span class="level-bar">${[1, 2, 3, 4].map((l) => `<i class="${l <= card.step ? 'on' : ''}"></i>`).join('')}</span></div>`;
  }

  app.innerHTML = `
    ${back(`#/lernen/insel/${island.id}`, `${island.emoji} ${esc(island.title)}`)}
    <section class="card-head" style="--c:${island.color}">
      <span class="card-emoji">${card.emoji}</span>
      <div><h2>${esc(card.title)}</h2><p>${esc(card.short)}</p></div>
    </section>
    ${badge}
    ${comicHtml(card.comic)}
    <section class="box">
      <h3>🤔 Was ist das?</h3>
      <p>${fmt(card.was)}</p>
    </section>
    ${card.abmachung ? `
      <section class="box deal">
        <h3>🤝 Die Abmachung</h3>
        ${talk('alpaca', card.abmachung)}
      </section>` : ''}
    ${card.steps ? `
      <section class="box">
        <h3>🔍 Die 5 Schritte</h3>
        <ol class="big-steps">${card.steps.map(([e, t, d]) => `<li><span class="bs-emoji">${e}</span><span><b>${esc(t)}</b><br>${fmt(d)}</span></li>`).join('')}</ol>
        <p class="muted small">Erst wenn alle 5 Schritte gemacht sind, erklären Eltern, Lehrkraft oder Betreuer:in die Aufgabe – oder helfen mehr.</p>
      </section>` : ''}
    ${card.schritte ? `
      <section class="box">
        <h3>🛠️ So geht’s</h3>
        <ol class="steps">${card.schritte.map((s) => `<li>${fmt(s)}</li>`).join('')}</ol>
      </section>` : ''}
    ${card.methoden ? `
      <section class="box">
        <h3>🧰 ${card.id === 'profi-tipps' ? 'Die Tipps' : 'Methoden in dieser Etappe'}</h3>
        <div class="minis">${card.methoden.map(([e, t, d]) => `<div class="mini"><span class="mini-emoji">${e}</span><b>${esc(t)}</b><p>${fmt(d)}</p></div>`).join('')}</div>
      </section>` : ''}
    ${card.beispiele?.length ? `
      <section class="box">
        <h3>📚 Beispiele aus den Fächern</h3>
        <ul class="examples">${card.beispiele.map(([s, t]) => `<li>${subjectChip(s)}<span>${fmt(t)}</span></li>`).join('')}</ul>
      </section>` : ''}
    ${card.warum ? `
      <section class="box why">
        <h3>🧠 Warum wirkt das?</h3>
        <p>${fmt(card.warum)}</p>
      </section>` : ''}
    ${card.hintergrund ? `
      <section class="box why">
        <h3>💡 Warum das hilft</h3>
        <ol class="steps">${card.hintergrund.map((s) => `<li>${fmt(s)}</li>`).join('')}</ol>
        <blockquote class="quote">${esc(card.zitat[0])}<cite>– ${esc(card.zitat[1])}</cite></blockquote>
      </section>` : ''}
    <section class="box challenge">
      <h3>🎯 Deine Challenge</h3>
      <p>${fmt(card.challenge)}</p>
      <button class="btn big ${tried(card.id) ? 'got' : 'primary'}" id="tried">${tried(card.id) ? `✅ Ausprobiert – Sticker ${card.emoji} gesammelt` : '🙋 Hab ich ausprobiert!'}</button>
      <div id="triedMsg" aria-live="polite"></div>
    </section>
    ${card.link ? `<a class="btn big" href="${card.link.href}">${esc(card.link.label)}</a>` : ''}
    ${card.id === DETECTIVE_CARD.id ? `<a class="btn big primary" href="#/lernen/fall/${(CASES.find((c) => !solved(c.id)) || CASES[0]).id}">🕵️ Jetzt einen Fall lösen</a>` : ''}
    <nav class="pager">
      ${prev ? `<a class="btn" href="#/lernen/karte/${prev.id}">← ${prev.emoji} ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#/lernen/karte/${next.id}">${next.emoji} ${esc(next.title)} →</a>` : '<span></span>'}
    </nav>
  `;
  const btn = app.querySelector('#tried');
  btn.addEventListener('click', () => {
    const now = toggleTried(card.id);
    btn.className = `btn big ${now ? 'got' : 'primary'}`;
    btn.textContent = now ? `✅ Ausprobiert – Sticker ${card.emoji} gesammelt` : '🙋 Hab ich ausprobiert!';
    app.querySelector('#triedMsg').innerHTML = now
      ? `<div class="sticker-pop"><span>${card.emoji}</span><b>Neuer Sticker!</b> +20 ⭐</div>`
      : '';
  });
}

// ---------- Lexikon ----------

function renderGlossary(app, focus, ctx) {
  ctx.setTitle('Lern-Lexikon');
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'de'));
  app.innerHTML = `
    ${back('#/lernen', '📖 Lern-Lexikon')}
    ${talk('elara', 'Was ist eigentlich eine Mindmap? Und was heißt „Mnemotechnik“? Hier sind alle Lern-Wörter erklärt!', 'thinking')}
    <input class="search" id="q" type="search" placeholder="🔎 Wort suchen …" autocomplete="off">
    <div class="glossary" id="list">
      ${sorted.map((g) => `
        <article class="g-entry ${g.id === focus ? 'focus' : ''}" id="g-${g.id}" data-text="${esc([g.term, ...g.also, g.text].join(' ').toLowerCase())}">
          ${glossaryBody(g)}
          ${g.method && cardById(g.method) ? `<a class="g-more" href="#/lernen/karte/${g.method}">${cardById(g.method).emoji} Zur Methode „${esc(cardById(g.method).title)}“ →</a>` : ''}
        </article>`).join('')}
    </div>
    <p class="muted small center" id="none" hidden>Nichts gefunden. 🤷</p>
  `;
  const q = app.querySelector('#q');
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    let n = 0;
    app.querySelectorAll('.g-entry').forEach((el) => {
      const show = !v || el.dataset.text.includes(v);
      el.hidden = !show;
      if (show) n++;
    });
    app.querySelector('#none').hidden = n > 0;
  });
  if (focus) setTimeout(() => document.getElementById(`g-${focus}`)?.scrollIntoView({ block: 'center' }), 50);
}

// ---------- Detektiv-Fall ----------

const normWord = (w) => w.toLowerCase().replace(/[.,:;!?„“"()»«]/g, '');
const VOICE = { englisch: 'en-GB', franz: 'fr-FR' };

const STEP_TALK = [
  ['Schritt 1: Lies die Aufgabe ganz **leise** – nur mit den Augen. 🤫', 'happy'],
  ['Schritt 2: Jetzt **flüsternd oder laut** lesen. Hörst du ein Wort, das du vorher überlesen hast?', 'happy'],
  ['Schritt 3: Lies **rückwärts** – Wort für Wort, von hinten nach vorne. Tippe jedes Wort an, wenn du es gelesen hast.', 'thinking'],
  ['Schritt 4: Tippe die **Schlüsselwörter** an. Was sollst du **tun**? Worum **geht** es?', 'thinking'],
  ['Schritt 5: Erklär mir, was du glaubst, hier tun zu müssen! Sag es zuerst laut in eigenen Worten – dann tippe an, was am besten passt.', 'happy'],
];

function renderCase(app, c, ctx) {
  const subj = SUBJECTS[c.subject];
  ctx.setTitle(`Fall: ${subj.name}`);
  const words = c.text.split(/\s+/);
  const isKey = words.map((w) => c.keys.includes(normWord(w)));
  const S = { step: 0, rev: 0, marked: new Set(), checked: false, done: false, wrong: new Set() };
  const nr = CASES.indexOf(c) + 1;
  const nextCase = CASES.slice(nr).find((x) => !solved(x.id)) || CASES.find((x) => !solved(x.id) && x !== c);

  app.innerHTML = `
    ${back('#/lernen/insel/detektiv', `🕵️ Fall ${nr}`)}
    <div class="stepper" id="stepper"></div>
    <div id="talk"></div>
    <section class="sheet-task">
      <div class="task-head">${subjectChip(c.subject)}<span class="muted small">Aufgabe</span></div>
      <div class="task" id="task"></div>
    </section>
    <div id="fb" aria-live="polite"></div>
    <div id="actions" class="case-actions"></div>
  `;
  const $ = (id) => app.querySelector(`#${id}`);

  function draw() {
    $('stepper').innerHTML = DETECTIVE_CARD.steps.map(([e, t], i) => `
      <span class="st ${i < S.step || S.done ? 'done' : ''} ${i === S.step && !S.done ? 'now' : ''}"><b>${i < S.step || S.done ? '✓' : e}</b><small>${esc(t)}</small></span>`).join('');
    const [say, mood] = S.done ? ['Fall gelöst! Du bist ein echter Aufgaben-Detektiv. 🕵️', 'proud'] : STEP_TALK[S.step];
    $('talk').innerHTML = talk('alpaca', say, mood);

    // Aufgabentext je nach Schritt
    if (S.step === 2 && !S.done) {
      const rev = words.map((w, i) => ({ w, i })).reverse();
      $('task').innerHTML = `<div class="rev">${rev.map(({ w }, k) => `<button type="button" class="tok ${k < S.rev ? 'read' : ''} ${k === S.rev ? 'next' : ''}" data-k="${k}">${esc(w)}</button>`).join('')}</div>`;
    } else if (S.step >= 3 || S.done) {
      $('task').innerHTML = words.map((w, i) => {
        let cls = S.marked.has(i) ? 'marked' : '';
        if (S.checked || S.step > 3 || S.done) {
          if (isKey[i] && S.marked.has(i)) cls = 'hit';
          else if (isKey[i]) cls = 'miss';
          else if (S.marked.has(i)) cls = 'extra';
        }
        return `<button type="button" class="tok word ${cls}" data-i="${i}" ${S.step !== 3 || S.checked ? 'disabled' : ''}>${esc(w)}</button>`;
      }).join(' ');
    } else {
      $('task').innerHTML = `<p class="task-text ${S.step === 0 ? 'quiet' : ''}">${esc(c.text)}</p>`;
    }

    // Knöpfe
    let actions = '';
    if (S.done) {
      actions = `
        ${nextCase ? `<a class="btn primary big" href="#/lernen/fall/${nextCase.id}">🕵️ Nächster Fall</a>` : '<p class="center"><b>🏆 Du hast alle Fälle gelöst!</b></p>'}
        <a class="btn big" href="#/lernen/insel/detektiv">Zur Übersicht</a>`;
    } else if (S.step === 0) {
      actions = '<button class="btn primary big" data-act="next">✓ Leise gelesen</button>';
    } else if (S.step === 1) {
      actions = `<button class="btn big" data-act="say">🔊 Vorlesen lassen</button>
        <button class="btn primary big" data-act="next">✓ Laut gelesen</button>`;
    } else if (S.step === 2) {
      actions = `<button class="btn primary big" data-act="next" ${S.rev < words.length ? 'disabled' : ''}>${S.rev < words.length ? `Noch ${words.length - S.rev} ${words.length - S.rev === 1 ? 'Wort' : 'Wörter'} …` : '✓ Rückwärts gelesen'}</button>`;
    } else if (S.step === 3 && !S.checked) {
      actions = `<button class="btn primary big" data-act="check" ${S.marked.size ? '' : 'disabled'}>Prüfen ✓</button>`;
    } else if (S.step === 3) {
      actions = '<button class="btn primary big" data-act="next">Weiter zu Schritt 5 ➜</button>';
    } else if (S.step === 4) {
      actions = `<div class="options">${c.options.map(([t, why], i) => `
        <button type="button" class="option ${S.wrong.has(i) ? 'wrong' : ''}" data-opt="${i}" ${S.wrong.has(i) ? 'disabled' : ''}>
          <span>${esc(t)}</span>${S.wrong.has(i) ? `<small>${esc(why)}</small>` : ''}
        </button>`).join('')}</div>`;
    }
    $('actions').innerHTML = actions;
  }

  function checkKeys() {
    S.checked = true;
    const total = c.keys.length;
    const found = words.filter((w, i) => isKey[i] && S.marked.has(i)).length;
    const extra = [...S.marked].filter((i) => !isKey[i]).length;
    let msg;
    if (found === total) msg = '🎯 Perfekt! Du hast alle Schlüsselwörter gefunden.';
    else if (found >= total / 2) msg = `👍 Gut! ${found} von ${total} Schlüsselwörtern gefunden. Die <span class="k-miss">gestrichelten</span> hast du übersehen.`;
    else msg = `🔍 ${found} von ${total} gefunden. Schau dir die <span class="k-miss">gestrichelten</span> Wörter an – die sind wichtig!`;
    if (extra) msg += ` <span class="k-extra">Grau</span> markiert: nicht falsch, aber nicht ganz so wichtig.`;
    $('fb').innerHTML = `<div class="msg info">${msg}</div>`;
    draw();
  }

  app.querySelector('.case-actions').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.act === 'next') { S.step++; $('fb').innerHTML = ''; draw(); }
    else if (b.dataset.act === 'say') ctx.speak(c.text, VOICE[c.subject] || 'de-DE');
    else if (b.dataset.act === 'check') checkKeys();
    else if (b.dataset.opt != null) {
      const i = Number(b.dataset.opt);
      if (i === c.correct) {
        S.done = true;
        const first = solveCase(c.id);
        $('fb').innerHTML = `
          <div class="msg ok">Richtig! ✅ ${esc(c.options[i][0])}</div>
          <div class="msg info">💡 ${fmt(c.explain)}</div>
          ${first ? '<div class="sticker-pop"><span>🕵️</span><b>Fall gelöst!</b> +15 ⭐</div>' : ''}`;
      } else {
        S.wrong.add(i);
      }
      draw();
    }
  });
  $('task').addEventListener('click', (e) => {
    const b = e.target.closest('.tok');
    if (!b || b.disabled) return;
    if (S.step === 2 && b.dataset.k != null) {
      if (Number(b.dataset.k) === S.rev) { S.rev++; draw(); }
      else {
        b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
      }
    } else if (S.step === 3 && !S.checked && b.dataset.i != null) {
      const i = Number(b.dataset.i);
      if (S.marked.has(i)) S.marked.delete(i); else S.marked.add(i);
      draw();
    }
  });
  draw();
  return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
}

// Für die Startseite
export { spellOfTheDay };
