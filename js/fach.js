// Fach-Seiten für Mathe und Biologie: Themen-Übersicht, Spickzettel, Level und Quiz-Runden.

import { quizStars, recordQuiz, taskDone, toggleTask, dailyDone, markDaily } from './store.js';
import { talk } from './comic.js';
import { runQuiz, fmt, esc, shuffle } from './quiz.js';
import { MATHE, makeQuestions } from './mathe-data.js';
import { BIO } from './bio-data.js';
import { GEO } from './geo-data.js';

export const FAECHER = { mathe: MATHE, bio: BIO, geo: GEO };

// Bezeichnungen je Fach (mit Standardwerten)
const cheatName = (f) => f.cheatName || (f.id === 'bio' ? 'Forscher-Wissen' : 'Spickzettel');
const taskName = (f) => f.taskName || 'Forscher-Auftrag';
const taskEmoji = (f) => f.taskEmoji || '🔬';

const LEVEL_SIZE = 8;
const levelKey = (f, t, i) => `${f.id}/${t.id}/${i}`;
const starStr = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);

// Level können feste Fragen, Zufalls-Generatoren oder beides haben
function questionsFor(level, n = LEVEL_SIZE) {
  if (level.gens && !level.questions) return makeQuestions(level, n);
  if (!level.gens) return shuffle(level.questions).slice(0, n);
  const g = Math.min(n, level.genCount || 3);
  const fixed = shuffle(level.questions).slice(0, n - g);
  return shuffle([...makeQuestions(level, n - fixed.length), ...fixed]);
}

const topicStars = (f, t) => t.levels.reduce((s, _, i) => s + quizStars(levelKey(f, t, i)), 0);

// Fortschritt eines Fachs (für die Startseite)
export function fachStats(id) {
  const f = FAECHER[id];
  let stars = 0;
  let max = 0;
  let tasks = 0;
  let taskMax = 0;
  for (const t of f.topics) {
    stars += topicStars(f, t);
    max += t.levels.length * 3;
    if (t.task) { taskMax++; if (taskDone(`${f.id}/${t.id}`)) tasks++; }
  }
  return { stars, max, tasks, taskMax, percent: Math.round((stars / max) * 100) };
}

// Das nächste Level, das noch keine 3 Sterne hat
function nextUp(f) {
  // Erst das Kapitel, das gerade im Unterricht dran ist
  const cur = f.topics.find((t) => t.current);
  if (cur) for (let i = 0; i < cur.levels.length; i++) if (quizStars(levelKey(f, cur, i)) < 2) return { t: cur, i };
  for (const t of f.topics) {
    for (let i = 0; i < t.levels.length; i++) {
      if (quizStars(levelKey(f, t, i)) < 2) return { t, i };
    }
  }
  return null;
}

const back = (href, title) => `
  <header class="top">
    <a class="icon-btn" href="${href}" aria-label="Zurück">←</a>
    <h1>${title}</h1><span></span>
  </header>`;

// ---------- Fach-Übersicht ----------

export function renderFach(app, id, topicId, ctx) {
  const f = FAECHER[id];
  const topic = f.topics.find((t) => t.id === topicId);
  if (topic) return renderTopic(app, f, topic, ctx);
  ctx.setTitle(f.name);
  const st = fachStats(id);
  const up = nextUp(f);
  app.innerHTML = `
    ${back('#/', `${f.emoji} ${esc(f.name)}`)}
    ${talk(f.who, f.intro, 'excited')}
    <section class="hero">
      <div class="stats">
        <div><b>⭐ ${st.stars}</b><span>von ${st.max} Sternen</span></div>
        <div><b>🗺️ ${f.topics.filter((t) => topicStars(f, t) > 0).length}/${f.topics.length}</b><span>Stationen besucht</span></div>
        ${st.taskMax ? `<div><b>${taskEmoji(f)} ${st.tasks}/${st.taskMax}</b><span>${taskName(f).replace('Auftrag', 'Aufträge')}</span></div>` : `<div><b>🏆 ${f.topics.filter((t) => topicStars(f, t) === t.levels.length * 3).length}</b><span>Stationen gemeistert</span></div>`}
      </div>
      <div class="meter big"><span style="width:${st.percent}%"></span></div>
      ${up ? `<a class="btn primary big" href="#/quiz/${f.id}/${up.t.id}/${up.i}">▶️ Weiter: ${up.t.emoji} ${esc(up.t.levels[up.i].title)}</a>` : '<p class="center"><b>🏆 Alle Level geschafft – du bist ein Profi!</b></p>'}
      <a class="btn big" href="#/quiz/${f.id}/mix">⚡ Blitz-Mix: 10 Fragen quer durch alle Themen</a>
    </section>
    <h2>🗺️ ${esc(f.motto)}: Wähle eine Station</h2>
    <div class="stations">
      ${f.topics.map((t, n) => {
        const s = topicStars(f, t);
        const max = t.levels.length * 3;
        return `
        <a class="station ${s === max ? 'done' : ''} ${t.current ? 'now' : ''}" href="#/fach/${f.id}/${t.id}">
          <span class="station-no">${t.chapter || n + 1}</span>
          ${t.current ? '<span class="station-now">📌 Gerade dran</span>' : ''}
          <span class="station-emoji">${t.emoji}</span>
          <span class="station-text"><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></span>
          <span class="station-stars">${s}/${max} ⭐${t.task && taskDone(`${f.id}/${t.id}`) ? ` · ${taskEmoji(f)}` : ''}</span>
          <span class="meter"><span style="width:${(s / max) * 100}%"></span></span>
        </a>`;
      }).join('')}
    </div>
    <p class="credit">${f.credit || (id === 'bio'
    ? 'Biologie gehört in Baden-Württemberg in Klasse 5/6 zum Fach BNT. Die Themen orientieren sich am Bildungsplan Gymnasium (Klassen 5/6).'
    : 'Die Themen orientieren sich am Bildungsplan Mathematik Gymnasium Baden-Württemberg (Klassen 5/6) und an der üblichen Reihenfolge in Klasse 6.')}</p>
  `;
  return undefined;
}

// ---------- Station (Thema) ----------

function renderTopic(app, f, t, ctx) {
  ctx.setTitle(t.title);
  const idx = f.topics.indexOf(t);
  const prev = f.topics[idx - 1];
  const next = f.topics[idx + 1];
  const taskId = `${f.id}/${t.id}`;
  app.innerHTML = `
    ${back(`#/fach/${f.id}`, `${f.emoji} ${esc(f.name)}`)}
    <section class="card-head" style="--c:var(--primary)">
      <span class="card-emoji">${t.emoji}</span>
      <div><h2>${t.chapter ? `Kapitel ${t.chapter}: ` : ''}${esc(t.title)}</h2><p>${esc(t.sub)}</p>${t.current ? '<p class="now-tag">📌 Gerade im Unterricht dran</p>' : ''}</div>
    </section>
    ${talk(t.sayWho || f.who, t.say, t.sayWho === 'sheep' ? 'thinking' : 'happy')}
    <h2>🎮 Level</h2>
    <div class="levels">
      ${t.levels.map((l, i) => {
        const s = quizStars(levelKey(f, t, i));
        return `
        <a class="level ${s ? 'played' : ''}" href="#/quiz/${f.id}/${t.id}/${i}">
          <span class="level-no">${i + 1}</span>
          <span class="level-emoji">${l.emoji}</span>
          <span class="level-text"><b>${esc(l.title)}</b><small>${LEVEL_SIZE} Aufgaben${l.gens ? (l.questions ? ' · mit Zufallsaufgaben' : ' · jedes Mal neu') : ''}</small></span>
          <span class="level-stars">${starStr(s)}</span>
          <span class="level-go">${s ? 'Nochmal' : 'Start'} ▶</span>
        </a>`;
      }).join('')}
    </div>
    <h2>📖 ${cheatName(f)}</h2>
    <div class="cheats">
      ${t.explain.map(([h, text, ex], i) => `
        <details class="cheat" ${i === 0 ? 'open' : ''}>
          <summary>${esc(h)}</summary>
          <p>${fmt(text)}</p>
          ${ex ? `<p class="cheat-ex">${fmt(ex)}</p>` : ''}
        </details>`).join('')}
    </div>
    ${t.task ? `
      <section class="box challenge">
        <h3>${taskEmoji(f)} ${taskName(f)}: ${esc(t.task[0])}</h3>
        <p>${fmt(t.task[1])}</p>
        <button class="btn big ${taskDone(taskId) ? 'got' : 'primary'}" id="task">${taskDone(taskId) ? '✅ Erledigt – Abzeichen gesammelt' : '🙋 Hab ich gemacht!'}</button>
        <div id="taskMsg" aria-live="polite"></div>
      </section>` : ''}
    ${t.facts?.length ? `<div class="fact"><b>🤯 Wusstest du?</b> ${fmt(t.facts[0])}</div>` : ''}
    <nav class="pager">
      ${prev ? `<a class="btn" href="#/fach/${f.id}/${prev.id}">← ${prev.emoji} ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#/fach/${f.id}/${next.id}">${next.emoji} ${esc(next.title)} →</a>` : '<span></span>'}
    </nav>
  `;
  const btn = app.querySelector('#task');
  btn?.addEventListener('click', () => {
    const now = toggleTask(taskId);
    btn.className = `btn big ${now ? 'got' : 'primary'}`;
    btn.textContent = now ? '✅ Erledigt – Abzeichen gesammelt' : '🙋 Hab ich gemacht!';
    app.querySelector('#taskMsg').innerHTML = now ? `<div class="sticker-pop"><span>${taskEmoji(f)}</span><b>Neues Abzeichen!</b> +20 ⭐</div>` : '';
  });
  return undefined;
}

// ---------- Quiz-Runden ----------

// Zufällige Fragen quer durch ein Fach
function mixQuestions(f, n) {
  const levels = shuffle(f.topics.flatMap((t) => t.levels));
  const out = [];
  for (let i = 0; out.length < n && i < levels.length * 2; i++) out.push(...questionsFor(levels[i % levels.length], 1));
  return out;
}

// Tages-Challenge: je 2 Fragen aus Mathe, Bio und Erdkunde
export function dailyQuestions() {
  return shuffle(Object.values(FAECHER).flatMap((f) => mixQuestions(f, 2)));
}

export function renderQuiz(app, [a, b, c], ctx) {
  const againBtn = '<button class="btn primary big" id="again">🔁 Noch eine Runde</button>';
  const bindAgain = () => app.querySelector('#again')?.addEventListener('click', () => ctx.go(location.hash));

  // Tages-Challenge
  if (a === 'heute') {
    ctx.setSubject('home');
    ctx.setTitle('Tages-Challenge');
    return runQuiz(app, {
      title: 'Tages-Challenge', emoji: '⚡', backHash: '#/', who: 'sheep', questions: dailyQuestions(),
      onDone: () => {
        const first = markDaily();
        return { top: first ? '<div class="sticker-pop"><span>⚡</span><b>Tages-Challenge geschafft!</b> +30 ⭐ Bonus</div>' : '<p class="muted small">Den Tages-Bonus hast du heute schon geholt. Morgen gibt es einen neuen!</p>' };
      },
    });
  }

  const f = FAECHER[a];
  if (!f) { ctx.go('#/'); return undefined; }
  ctx.setSubject(f.id);

  // Blitz-Mix
  if (b === 'mix') {
    ctx.setTitle(`${f.name}: Blitz-Mix`);
    return runQuiz(app, {
      title: 'Blitz-Mix', emoji: '⚡', backHash: `#/fach/${f.id}`, who: f.who, questions: mixQuestions(f, 10),
      facts: f.topics.flatMap((t) => t.facts || []),
      onDone: () => ({ html: againBtn, bind: bindAgain }),
    });
  }

  const t = f.topics.find((x) => x.id === b);
  const i = Number(c);
  const level = t?.levels[i];
  if (!level) { ctx.go(`#/fach/${f.id}`); return undefined; }
  ctx.setTitle(level.title);
  const key = levelKey(f, t, i);
  return runQuiz(app, {
    title: level.title, emoji: level.emoji, backHash: `#/fach/${f.id}/${t.id}`, who: f.who,
    questions: questionsFor(level), facts: t.facts,
    onDone: ({ stars }) => {
      const before = quizStars(key);
      const record = recordQuiz(key, stars);
      const nextLevel = t.levels[i + 1];
      const nextTopic = f.topics[f.topics.indexOf(t) + 1];
      let html = '';
      if (stars >= 2 && nextLevel) html += `<a class="btn primary big" href="#/quiz/${f.id}/${t.id}/${i + 1}">▶️ Nächstes Level: ${nextLevel.emoji} ${esc(nextLevel.title)}</a>`;
      else if (stars >= 2 && nextTopic) html += `<a class="btn primary big" href="#/fach/${f.id}/${nextTopic.id}">▶️ Nächste Station: ${nextTopic.emoji} ${esc(nextTopic.title)}</a>`;
      html += stars >= 2 ? '<button class="btn big" id="again">🔁 Noch eine Runde</button>' : againBtn;
      if (stars < 2) html += `<a class="btn big" href="#/fach/${f.id}/${t.id}">📖 Zum ${cheatName(f)}</a>`;
      return {
        top: record ? `<div class="sticker-pop"><span>🏅</span><b>${before ? 'Neuer Rekord!' : 'Level geschafft!'}</b> ${starStr(stars)}</div>` : '',
        html,
        bind: bindAgain,
      };
    },
  });
}
