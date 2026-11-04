// Comic-Zeichnungen für die Lern-Werkstatt: Elara, Flocke (Schaf) und Paco (Alpaka).
// Alles als SVG gezeichnet – funktioniert offline und passt sich jeder Größe an.
//
// Ein Comic-Bild (Panel) wird so beschrieben:
// {
//   bg: 'room' | 'outside' | 'school' | 'night',
//   cast: [['elara', 'left', 'happy', 'wave'], ['sheep', 'right', 'confused']],
//   props: [['book', x, y, scale?, label?]],
//   say: [['left', 'Text'], ['right', 'Gedanke', 'think']],
//   caption: 'Am nächsten Tag …',
// }
// Positionen: 'left' | 'center' | 'right' (oder eine Zahl für x)
// Stimmungen: happy, excited, sad, confused, surprised, thinking, proud, neutral, tired
// Elara-Posen: down, wave, point, think, cheer, hold, shrug, write

const SLOTS = { left: 50, center: 120, right: 190 };
const W = 240;
const H = 150;
const INK = '#1f2937';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Text mit **fett** für Sprechblasen
const bubbleText = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

// ---------- Gesichter ----------

function face({ x, y, dx = 8, mood = 'happy', r = 2.6, my = 11, mw = 6 }) {
  const L = x - dx;
  const R = x + dx;
  let eyes = '';
  let brows = '';
  let mouth = '';
  const dot = (cx) => `<circle cx="${cx}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${cx + 0.9}" cy="${y - 0.9}" r="${r * 0.35}" fill="#fff"/>`;
  const arcUp = (cx) => `<path d="M${cx - 3} ${y + 1} q3 -4 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  const arcDown = (cx) => `<path d="M${cx - 3} ${y - 0.5} q3 3 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  const ym = y + my;

  switch (mood) {
    case 'happy':
      eyes = arcUp(L) + arcUp(R);
      mouth = `<path d="M${x - mw} ${ym} Q${x} ${ym + mw} ${x + mw} ${ym}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
    case 'excited':
      eyes = dot(L) + dot(R);
      mouth = `<path d="M${x - mw} ${ym - 1} Q${x} ${ym + mw * 1.6} ${x + mw} ${ym - 1} Z" fill="#7f1d1d"/><path d="M${x - mw * 0.5} ${ym + mw * 0.55} Q${x} ${ym + mw * 0.2} ${x + mw * 0.5} ${ym + mw * 0.55}" fill="#f87171"/>`;
      break;
    case 'proud':
      eyes = arcDown(L) + arcDown(R);
      mouth = `<path d="M${x - mw} ${ym} Q${x} ${ym + mw} ${x + mw} ${ym}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
    case 'sad':
      eyes = dot(L) + dot(R);
      brows = `<path d="M${L - 4} ${y - 5} L${L + 2} ${y - 7.5} M${R + 4} ${y - 5} L${R - 2} ${y - 7.5}" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>`;
      mouth = `<path d="M${x - mw * 0.8} ${ym + 3} Q${x} ${ym - 2} ${x + mw * 0.8} ${ym + 3}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
    case 'confused':
      eyes = dot(L) + dot(R);
      brows = `<path d="M${L - 3} ${y - 6} L${L + 3} ${y - 6} M${R - 3} ${y - 9} Q${R} ${y - 11} ${R + 3} ${y - 8}" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M${x - mw} ${ym + 1} q${mw / 2} -3 ${mw} 0 t${mw} 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
    case 'surprised':
      eyes = `<circle cx="${L}" cy="${y}" r="${r + 1}" fill="#fff" stroke="${INK}" stroke-width="1.2"/><circle cx="${L}" cy="${y}" r="${r * 0.7}" fill="${INK}"/><circle cx="${R}" cy="${y}" r="${r + 1}" fill="#fff" stroke="${INK}" stroke-width="1.2"/><circle cx="${R}" cy="${y}" r="${r * 0.7}" fill="${INK}"/>`;
      brows = `<path d="M${L - 3} ${y - 8} q3 -2 6 0 M${R - 3} ${y - 8} q3 -2 6 0" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="${x}" cy="${ym + 1}" rx="${mw * 0.45}" ry="${mw * 0.6}" fill="#7f1d1d"/>`;
      break;
    case 'thinking':
      eyes = `<circle cx="${L + 1}" cy="${y - 1}" r="${r}" fill="${INK}"/><circle cx="${R + 1}" cy="${y - 1}" r="${r}" fill="${INK}"/>`;
      brows = `<path d="M${R - 3} ${y - 8} Q${R} ${y - 10} ${R + 3} ${y - 7}" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M${x - mw * 0.3} ${ym + 1} L${x + mw * 0.8} ${ym}" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
      break;
    case 'tired':
      eyes = `<path d="M${L - 3} ${y} h6 M${R - 3} ${y} h6" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
      mouth = `<path d="M${x - mw * 0.6} ${ym + 1} h${mw * 1.2}" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
      break;
    default:
      eyes = dot(L) + dot(R);
      mouth = `<path d="M${x - mw * 0.7} ${ym} Q${x} ${ym + mw * 0.6} ${x + mw * 0.7} ${ym}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  }
  return brows + eyes + mouth;
}

// ---------- Figuren ----------

// Elara: Mädchen, 6. Klasse, lange dunkle Haare mit Zopf, türkises T-Shirt
const ELARA_HANDS = {
  down: [[-22, 116], [22, 116]],
  wave: [[-22, 116], [33, 58]],
  point: [[-22, 116], [44, 80]],
  think: [[-22, 116], [5, 79]],
  cheer: [[-32, 56], [32, 56]],
  hold: [[-12, 100], [12, 100]],
  shrug: [[-36, 78], [36, 78]],
  write: [[-22, 116], [18, 106]],
};

function elara(mood = 'happy', pose = 'down') {
  const hair = '#3b2417';
  const skin = '#f1c7a0';
  const shirt = '#14b8a6';
  const [hl, hr] = ELARA_HANDS[pose] || ELARA_HANDS.down;
  const arm = ([x, y], sx) => `<path d="M${sx} 87 Q${(sx + x) / 2 + (sx < 0 ? -4 : 4)} ${(87 + y) / 2} ${x} ${y}" stroke="${shirt}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="4.6" fill="${skin}"/>`;
  return `
    <g>
      <path d="M-25 54 Q-27 92 -18 96 L18 96 Q27 92 25 54 Z" fill="${hair}"/>
      <circle cx="24" cy="98" r="4.5" fill="${hair}"/><circle cx="25" cy="106" r="4" fill="${hair}"/><circle cx="25.5" cy="113" r="3.4" fill="${hair}"/>
      <rect x="22" y="116" width="7" height="3" rx="1.5" fill="#f43f5e"/>
      <rect x="-12" y="118" width="9" height="20" rx="3" fill="#334155"/>
      <rect x="3" y="118" width="9" height="20" rx="3" fill="#334155"/>
      <ellipse cx="-8" cy="140" rx="8" ry="3.5" fill="#f43f5e"/>
      <ellipse cx="8" cy="140" rx="8" ry="3.5" fill="#f43f5e"/>
      <path d="M-18 84 Q0 78 18 84 L22 121 L-22 121 Z" fill="${shirt}"/>
      <path d="M0 96 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.7 -4.9 2.7 1.1 -5.3 -4 -3.7 5.4 -.6 Z" fill="#fde047"/>
      <rect x="-4" y="76" width="8" height="8" fill="${skin}"/>
      ${arm(hl, -17)}${arm(hr, 17)}
      <circle cx="0" cy="58" r="22" fill="${skin}"/>
      <path d="M-23 56 Q-23 33 0 34 Q23 33 23 56 Q16 44 6 45 Q-6 41 -23 56 Z" fill="${hair}"/>
      <circle cx="-13" cy="66" r="4" fill="#fb7185" opacity=".45"/><circle cx="13" cy="66" r="4" fill="#fb7185" opacity=".45"/>
      ${face({ x: 0, y: 58, dx: 8, mood, my: 10 })}
    </g>`;
}

// Flocke: weißes, wolliges Schaf – macht viele Fehler und lacht darüber
function sheep(mood = 'happy') {
  const wool = [[-20, 104], [-8, 95], [6, 95], [18, 103], [12, 116], [-2, 118], [-16, 116]];
  const tuft = [[19, 82], [26, 79], [33, 83]];
  const ring = (pts, r) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#94a3b8" stroke-width="2"/>`).join('')
    + pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r - 1.6}" fill="#fff"/>`).join('');
  return `
    <g>
      ${[-17, -7, 6, 16].map((x) => `<rect x="${x}" y="116" width="5.5" height="22" rx="2.5" fill="#475569"/>`).join('')}
      <circle cx="-31" cy="102" r="6" fill="#fff" stroke="#94a3b8" stroke-width="2"/>
      ${ring(wool, 14)}
      <ellipse cx="14" cy="90" rx="8" ry="4" transform="rotate(-25 14 90)" fill="#e5cfc1" stroke="#b9a090" stroke-width="1.2"/>
      <ellipse cx="38" cy="90" rx="8" ry="4" transform="rotate(25 38 90)" fill="#e5cfc1" stroke="#b9a090" stroke-width="1.2"/>
      <ellipse cx="26" cy="99" rx="12" ry="14" fill="#f3e6dc" stroke="#b9a090" stroke-width="1.2"/>
      ${ring(tuft, 6.5)}
      <circle cx="20" cy="104" r="2.6" fill="#fb7185" opacity=".45"/><circle cx="32" cy="104" r="2.6" fill="#fb7185" opacity=".45"/>
      ${face({ x: 26, y: 96, dx: 5.5, mood, r: 2.1, my: 9, mw: 4 })}
    </g>`;
}

// Paco: ruhiges Alpaka mit Brille und rotem Schal – kennt alle Lerntricks
function alpaca(mood = 'happy') {
  const fur = '#ead7b7';
  const line = '#a57f52';
  const light = '#f7eedf';
  return `
    <g>
      ${[-22, -12, 6, 16].map((x) => `<rect x="${x}" y="110" width="7" height="28" rx="3" fill="${fur}" stroke="${line}" stroke-width="1.2"/><rect x="${x - 0.5}" y="135" width="8" height="4" rx="2" fill="#6b4f2a"/>`).join('')}
      <circle cx="-34" cy="98" r="6" fill="${light}" stroke="${line}" stroke-width="1.2"/>
      <ellipse cx="-4" cy="104" rx="31" ry="17" fill="${fur}" stroke="${line}" stroke-width="1.5"/>
      <rect x="13" y="56" width="20" height="52" rx="10" fill="${fur}" stroke="${line}" stroke-width="1.5"/>
      <rect x="11.5" y="72" width="23" height="8" rx="4" fill="#dc2626"/>
      <rect x="27" y="76" width="7" height="16" rx="3" fill="#dc2626"/>
      <ellipse cx="15" cy="31" rx="4" ry="10" transform="rotate(-18 15 31)" fill="${fur}" stroke="${line}" stroke-width="1.2"/>
      <ellipse cx="37" cy="31" rx="4" ry="10" transform="rotate(18 37 31)" fill="${fur}" stroke="${line}" stroke-width="1.2"/>
      <ellipse cx="26" cy="51" rx="14" ry="15" fill="${fur}" stroke="${line}" stroke-width="1.5"/>
      <circle cx="18" cy="38" r="6.5" fill="${light}"/><circle cx="26" cy="35" r="7" fill="${light}"/><circle cx="34" cy="38" r="6.5" fill="${light}"/>
      <ellipse cx="27" cy="61" rx="9" ry="6.5" fill="${light}" stroke="${line}" stroke-width="1"/>
      <path d="M25 58 q2 1.5 4 0" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      ${face({ x: 26, y: 48, dx: 6, mood, r: 2.2, my: 15, mw: 3.5 })}
      <circle cx="20" cy="48" r="5" fill="none" stroke="${INK}" stroke-width="1.3"/>
      <circle cx="32" cy="48" r="5" fill="none" stroke="${INK}" stroke-width="1.3"/>
      <path d="M25 48 h2" stroke="${INK}" stroke-width="1.3"/>
    </g>`;
}

const CHARACTERS = { elara, sheep, alpaca };

export const CAST = {
  elara: { name: 'Elara', emoji: '👧', text: 'Geht in die 6. Klasse, ist neugierig und will Dinge am liebsten sofort können. Manchmal gibt sie zu schnell auf – aber sie lernt dazu.' },
  sheep: { name: 'Flocke', emoji: '🐑', text: 'Ein wolliges Schaf, das ständig Fehler macht – und jedes Mal laut „Mäh! Mega guter Fehler!“ ruft. Flocke traut sich alles.' },
  alpaca: { name: 'Paco', emoji: '🦙', text: 'Ein ruhiges Alpaka mit Brille und rotem Schal. Paco kennt jeden Lerntrick und erklärt ihn so, dass man ihn versteht.' },
};

function character(who, x, mood, pose) {
  const draw = CHARACTERS[who];
  if (!draw) return '';
  // Tiere schauen von Natur aus nach rechts; rechts stehend drehen sie sich zur Mitte
  const flip = who !== 'elara' && x > W / 2 + 10;
  return `<g transform="translate(${x} 0)${flip ? ' scale(-1 1)' : ''}">${draw(mood, pose)}</g>`;
}

// Kopf-Porträt (z. B. neben Sprechblasen oder in Listen)
const PORTRAIT_BOX = { elara: '-30 30 60 60', sheep: '1 72 50 50', alpaca: '-3 16 58 58' };
export function portrait(who, mood = 'happy') {
  return `<svg class="portrait" viewBox="${PORTRAIT_BOX[who]}" aria-hidden="true">${CHARACTERS[who]?.(mood, 'down') || ''}</svg>`;
}

// ---------- Gegenstände ----------

const PROPS = {
  book: () => `<path d="M-16 0 L-16 -18 Q-8 -22 0 -18 Q8 -22 16 -18 L16 0 Q8 -4 0 0 Q-8 -4 -16 0 Z" fill="#fff" stroke="${INK}" stroke-width="1.4"/><path d="M0 -18 V0" stroke="${INK}" stroke-width="1.2"/><path d="M-12 -14 h8 M-12 -10 h8 M-12 -6 h6 M4 -14 h8 M4 -10 h8 M4 -6 h6" stroke="#94a3b8" stroke-width="1"/>`,
  closedbook: () => `<rect x="-14" y="-10" width="28" height="10" rx="2" fill="#3b82f6" stroke="${INK}" stroke-width="1.3"/><rect x="-12" y="-8" width="24" height="3" fill="#bfdbfe"/>`,
  highlighter: () => `<g transform="rotate(-30)"><rect x="-4" y="-22" width="8" height="18" rx="2" fill="#facc15" stroke="${INK}" stroke-width="1.2"/><path d="M-3 -4 L3 -4 L1 2 L-1 2 Z" fill="#a16207"/></g>`,
  pencil: () => `<g transform="rotate(-35)"><rect x="-2.5" y="-24" width="5" height="20" fill="#f59e0b" stroke="${INK}" stroke-width="1"/><path d="M-2.5 -4 L2.5 -4 L0 2 Z" fill="#fcd34d" stroke="${INK}" stroke-width="1"/><rect x="-2.5" y="-27" width="5" height="3" fill="#fb7185"/></g>`,
  phone: () => `<rect x="-7" y="-24" width="14" height="24" rx="3" fill="#1f2937"/><rect x="-5" y="-21" width="10" height="16" rx="1" fill="#93c5fd"/><circle cx="0" cy="-2.5" r="1" fill="#fff"/>`,
  cards: () => `<rect x="-14" y="-18" width="24" height="16" rx="2" fill="#fef3c7" stroke="${INK}" stroke-width="1.2" transform="rotate(-10)"/><rect x="-10" y="-16" width="24" height="16" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.2"/><path d="M-6 -11 h14 M-6 -7 h10" stroke="#3b82f6" stroke-width="1.4"/>`,
  mindmap: () => `<rect x="-26" y="-34" width="52" height="34" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.2"/><g stroke="#f97316" stroke-width="1.5"><path d="M0 -17 L-16 -27 M0 -17 L16 -27 M0 -17 L-17 -6 M0 -17 L17 -6"/></g><ellipse cx="0" cy="-17" rx="7" ry="4.5" fill="#fde68a" stroke="${INK}"/><g fill="#bae6fd" stroke="${INK}" stroke-width=".8"><circle cx="-17" cy="-27" r="3.5"/><circle cx="17" cy="-27" r="3.5"/><circle cx="-18" cy="-6" r="3.5"/><circle cx="18" cy="-6" r="3.5"/></g>`,
  bulb: () => `<g stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"><path d="M0 -30 v-5 M-12 -24 l-4 -3 M12 -24 l4 -3 M-15 -14 h-5 M15 -14 h5"/></g><circle cx="0" cy="-15" r="10" fill="#fde047" stroke="${INK}" stroke-width="1.3"/><rect x="-4.5" y="-6" width="9" height="6" rx="1.5" fill="#94a3b8" stroke="${INK}" stroke-width="1"/>`,
  question: () => `<text x="0" y="0" font-size="26" font-weight="800" text-anchor="middle" fill="#6366f1" font-family="system-ui,sans-serif">?</text><text x="-12" y="-8" font-size="16" font-weight="800" text-anchor="middle" fill="#a5b4fc" font-family="system-ui,sans-serif">?</text>`,
  exclaim: () => `<text x="0" y="0" font-size="28" font-weight="900" text-anchor="middle" fill="#ef4444" font-family="system-ui,sans-serif">!</text>`,
  stars: () => `<g fill="#facc15" stroke="#ca8a04" stroke-width=".8"><path d="M0 -20 l3 6 6.5 .8 -4.8 4.4 1.3 6.4 -6 -3.3 -6 3.3 1.3 -6.4 -4.8 -4.4 6.5 -.8 Z"/><path d="M-16 -8 l1.6 3.2 3.4 .4 -2.5 2.3 .7 3.4 -3.2 -1.7 -3.2 1.7 .7 -3.4 -2.5 -2.3 3.4 -.4 Z"/><path d="M15 -6 l1.6 3.2 3.4 .4 -2.5 2.3 .7 3.4 -3.2 -1.7 -3.2 1.7 .7 -3.4 -2.5 -2.3 3.4 -.4 Z"/></g>`,
  heart: () => `<path d="M0 0 C-14 -10 -10 -22 0 -15 C10 -22 14 -10 0 0 Z" fill="#f43f5e"/>`,
  sweat: () => `<path d="M0 -12 Q5 -4 0 0 Q-5 -4 0 -12 Z" fill="#7dd3fc" stroke="#0284c7" stroke-width=".8"/>`,
  zzz: () => `<text x="0" y="0" font-size="12" font-weight="800" fill="#64748b" font-family="system-ui,sans-serif">z</text><text x="7" y="-8" font-size="15" font-weight="800" fill="#64748b" font-family="system-ui,sans-serif">Z</text>`,
  paper: (label) => `<rect x="-14" y="-36" width="28" height="36" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.3"/>${label ? `<text x="0" y="-26" font-size="6.5" font-weight="700" text-anchor="middle" fill="${INK}" font-family="system-ui,sans-serif">${esc(label)}</text>` : ''}<path d="M-10 -20 h20 M-10 -15 h20 M-10 -10 h16 M-10 -5 h18" stroke="#94a3b8" stroke-width="1.1"/>`,
  messy: () => `<g transform="rotate(-12)"><rect x="-14" y="-30" width="24" height="30" fill="#fff" stroke="${INK}" stroke-width="1.1"/><path d="M-10 -24 q6 4 12 -2 q-8 10 4 12 M-8 -10 q8 -6 14 4" stroke="#ef4444" fill="none"/></g><g transform="rotate(14)"><rect x="-2" y="-28" width="22" height="28" fill="#fff" stroke="${INK}" stroke-width="1.1"/><path d="M2 -22 q6 6 12 0 M2 -12 q4 -6 14 2" stroke="#3b82f6" fill="none"/></g>`,
  test: () => `<rect x="-14" y="-36" width="28" height="36" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.3"/><text x="0" y="-27" font-size="6.5" font-weight="800" text-anchor="middle" fill="${INK}" font-family="system-ui,sans-serif">TEST</text><g stroke="#16a34a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M-9 -19 l2 2 4 -4 M-9 -11 l2 2 4 -4"/></g><path d="M-9 -4 l5 -5 M-9 -9 l5 5" stroke="#dc2626" stroke-width="1.6"/><path d="M0 -18 h9 M0 -10 h9 M0 -2 h9" stroke="#94a3b8" stroke-width="1.1"/>`,
  note: (label) => `<rect x="-13" y="-26" width="26" height="26" fill="#fde68a" stroke="#ca8a04" stroke-width="1" transform="rotate(-6)"/>${label ? `<text x="0" y="-10" font-size="7" font-weight="700" text-anchor="middle" fill="${INK}" font-family="system-ui,sans-serif" transform="rotate(-6)">${esc(label)}</text>` : ''}`,
  board: (label) => `<rect x="-38" y="-46" width="76" height="40" rx="3" fill="#166534" stroke="#78350f" stroke-width="3"/><path d="M-30 -2 v-4 M30 -2 v-4" stroke="#78350f" stroke-width="3"/>${label ? `<text x="0" y="-22" font-size="9" font-weight="700" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif">${esc(label)}</text>` : ''}`,
  ladder: () => `<g stroke="#b45309" stroke-width="3" stroke-linecap="round"><path d="M-12 0 L-8 -64 M12 0 L8 -64"/><path d="M-11 -10 h22 M-10.4 -21 h20.8 M-9.7 -32 h19.4 M-9 -43 h18 M-8.4 -54 h16.8" stroke-width="2.4"/></g><path d="M0 -76 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.7 -4.9 2.7 1.1 -5.3 -4 -3.7 5.4 -.6 Z" fill="#facc15" stroke="#ca8a04"/>`,
  calendar: () => `<rect x="-16" y="-30" width="32" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.3"/><rect x="-16" y="-30" width="32" height="8" rx="3" fill="#ef4444"/><g stroke="#16a34a" stroke-width="1.6" stroke-linecap="round"><path d="M-12 -16 l2 2 3 -4 M-3 -16 l2 2 3 -4 M6 -16 l2 2 3 -4 M-12 -7 l2 2 3 -4"/></g>`,
  clock: () => `<circle cx="0" cy="-14" r="14" fill="#fff" stroke="${INK}" stroke-width="1.6"/><path d="M0 -14 V-23 M0 -14 L7 -10" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  dumbbell: () => `<rect x="-14" y="-6" width="28" height="4" rx="2" fill="#64748b"/><rect x="-18" y="-12" width="6" height="16" rx="2" fill="#334155"/><rect x="12" y="-12" width="6" height="16" rx="2" fill="#334155"/>`,
  brain: () => `<path d="M-14 -4 Q-20 -12 -14 -20 Q-14 -30 -4 -28 Q0 -34 6 -28 Q16 -30 15 -20 Q21 -12 14 -4 Q8 2 0 -2 Q-8 2 -14 -4 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="1.3"/><path d="M0 -28 V-2 M-8 -20 q4 2 0 6 M8 -20 q-4 2 0 6" stroke="#db2777" stroke-width="1.1" fill="none"/>`,
  ball: () => `<circle cx="0" cy="-16" r="16" fill="#a78bfa" stroke="#6d28d9" stroke-width="1.4"/><path d="M-10 -24 q4 -6 10 -6" stroke="#ede9fe" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  magnifier: () => `<circle cx="-3" cy="-16" r="9" fill="#e0f2fe" stroke="${INK}" stroke-width="2.2"/><path d="M3.5 -9.5 L12 -1" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>`,
  trophy: () => `<path d="M-10 -30 h20 v8 q0 10 -10 12 q-10 -2 -10 -12 Z" fill="#facc15" stroke="#a16207" stroke-width="1.3"/><path d="M-10 -26 q-7 0 -6 6 q1 4 6 4 M10 -26 q7 0 6 6 q-1 4 -6 4" stroke="#a16207" stroke-width="1.3" fill="none"/><rect x="-2" y="-10" width="4" height="5" fill="#a16207"/><rect x="-8" y="-5" width="16" height="5" rx="1" fill="#78350f"/>`,
  soap: () => `<rect x="-11" y="-9" width="22" height="9" rx="4" fill="#f9a8d4" stroke="#be185d" stroke-width="1.1"/><g fill="#e0f2fe" stroke="#7dd3fc" stroke-width=".8"><circle cx="-6" cy="-15" r="4"/><circle cx="4" cy="-20" r="5"/><circle cx="10" cy="-12" r="3"/></g>`,
  compass: () => `<circle cx="0" cy="-16" r="15" fill="#fff" stroke="${INK}" stroke-width="1.4"/><path d="M0 -28 L4 -16 L0 -4 L-4 -16 Z" fill="#ef4444"/><path d="M0 -4 L4 -16 L0 -16 Z" fill="#94a3b8"/><g font-size="6" font-weight="800" text-anchor="middle" fill="${INK}" font-family="system-ui,sans-serif"><text x="0" y="-31.5">N</text><text x="19" y="-13.5">O</text><text x="0" y="5">S</text><text x="-19" y="-13.5">W</text></g>`,
  pizza: () => `<circle cx="0" cy="-14" r="14" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><circle cx="0" cy="-14" r="11" fill="#f87171"/><path d="M0 -14 V-28 M0 -14 V0" stroke="#b45309" stroke-width="1.3"/><g fill="#fef3c7"><circle cx="-5" cy="-19" r="2"/><circle cx="5" cy="-9" r="2"/><circle cx="6" cy="-20" r="1.6"/></g>`,
  shrink: () => `<rect x="-30" y="-34" width="26" height="34" fill="#fff" stroke="${INK}" stroke-width="1.1"/><rect x="0" y="-24" width="18" height="24" fill="#fff" stroke="${INK}" stroke-width="1.1"/><rect x="22" y="-12" width="9" height="12" fill="#fde68a" stroke="${INK}" stroke-width="1.1"/><path d="M-26 -28 h18 M-26 -23 h18 M-26 -18 h18 M-26 -13 h18 M-26 -8 h14 M3 -19 h12 M3 -14 h12 M3 -9 h9 M24 -8 h5" stroke="#94a3b8" stroke-width=".9"/>`,
  bird: () => `<ellipse cx="0" cy="-8" rx="9" ry="6" fill="#60a5fa" stroke="${INK}" stroke-width="1"/><circle cx="8" cy="-13" r="4.5" fill="#60a5fa" stroke="${INK}" stroke-width="1"/><path d="M12 -13 l4 1 -4 1.5 Z" fill="#f59e0b"/><circle cx="9" cy="-14" r=".9" fill="${INK}"/><path d="M-4 -10 q-6 -8 -12 -4" stroke="${INK}" fill="#93c5fd" stroke-width="1"/>`,
  blocks: () => `<rect x="-22" y="-10" width="20" height="10" rx="1.5" fill="#f87171" stroke="${INK}"/><rect x="0" y="-10" width="20" height="10" rx="1.5" fill="#60a5fa" stroke="${INK}"/><rect x="-11" y="-20" width="20" height="10" rx="1.5" fill="#facc15" stroke="${INK}"/><g fill="#fff" opacity=".85"><rect x="-19" y="-7.5" width="14" height="5"/><rect x="3" y="-7.5" width="14" height="5"/><rect x="-8" y="-17.5" width="14" height="5"/></g>`,
  list: () => `<rect x="-12" y="-44" width="24" height="44" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.2"/><path d="M-8 -38 h16 M-8 -33 h16 M-8 -28 h16 M-8 -23 h16 M-8 -18 h16 M-8 -13 h16 M-8 -8 h16" stroke="#94a3b8" stroke-width="1"/>`,
  teddy: () => `<circle cx="-8" cy="-30" r="5" fill="#b45309"/><circle cx="8" cy="-30" r="5" fill="#b45309"/><circle cx="0" cy="-22" r="10" fill="#d97706"/><ellipse cx="0" cy="-6" rx="11" ry="10" fill="#d97706"/><ellipse cx="0" cy="-19" rx="4" ry="3" fill="#fde68a"/><circle cx="-4" cy="-25" r="1.3" fill="${INK}"/><circle cx="4" cy="-25" r="1.3" fill="${INK}"/>`,
  table: () => `<rect x="-34" y="-26" width="68" height="5" rx="2" fill="#b45309"/><rect x="-30" y="-21" width="4" height="21" fill="#92400e"/><rect x="26" y="-21" width="4" height="21" fill="#92400e"/>`,
};

function prop([name, x, y, s = 1, label = '']) {
  const draw = PROPS[name];
  if (!draw) return '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${draw(label)}</g>`;
}

// ---------- Hintergründe ----------

const BACKGROUNDS = {
  room: `<rect width="${W}" height="${H}" fill="#fef9ef"/><rect x="170" y="14" width="44" height="34" rx="3" fill="#dbeafe" stroke="#cbd5e1" stroke-width="2"/><path d="M192 14 V48 M170 31 H214" stroke="#cbd5e1" stroke-width="2"/><rect y="138" width="${W}" height="12" fill="#e7d3b8"/>`,
  outside: `<rect width="${W}" height="${H}" fill="#e0f2fe"/><circle cx="210" cy="22" r="11" fill="#fde047"/><ellipse cx="50" cy="26" rx="18" ry="7" fill="#fff"/><rect y="132" width="${W}" height="18" fill="#bbf7d0"/>`,
  school: `<rect width="${W}" height="${H}" fill="#f1f5f9"/><rect x="72" y="10" width="96" height="44" rx="3" fill="#14532d" stroke="#a16207" stroke-width="3"/><rect y="138" width="${W}" height="12" fill="#cbd5e1"/>`,
  night: `<rect width="${W}" height="${H}" fill="#e0e7ff"/><circle cx="200" cy="24" r="10" fill="#fef9c3"/><circle cx="204" cy="21" r="9" fill="#e0e7ff"/><rect y="138" width="${W}" height="12" fill="#c7d2fe"/>`,
  plain: `<rect width="${W}" height="${H}" fill="#fef9ef"/><rect y="138" width="${W}" height="12" fill="#f3e8d6"/>`,
};

// ---------- Zusammenbauen ----------

function scene(panel) {
  const parts = [BACKGROUNDS[panel.bg || 'room'] || BACKGROUNDS.room];
  // Gegenstände hinter den Figuren (z. B. Tafel, Leiter) mit "back: true"
  for (const p of panel.props || []) if (p[5] === 'back') parts.push(prop(p));
  for (const [who, slot, mood, pose] of panel.cast || []) {
    const x = typeof slot === 'number' ? slot : SLOTS[slot] ?? SLOTS.center;
    parts.push(character(who, x, mood, pose));
  }
  for (const p of panel.props || []) if (p[5] !== 'back') parts.push(prop(p));
  return `<svg class="scene" viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true">${parts.join('')}</svg>`;
}

function bubbles(panel) {
  return (panel.say || []).map(([slot, text, kind = 'say']) => {
    const pos = typeof slot === 'number' ? (slot < 90 ? 'left' : slot > 150 ? 'right' : 'center') : slot;
    return `<div class="bubble ${kind} from-${pos}">${bubbleText(text)}</div>`;
  }).join('');
}

export function panelHtml(panel) {
  return `
    <figure class="panel">
      ${panel.caption ? `<figcaption>${bubbleText(panel.caption)}</figcaption>` : ''}
      <div class="bubbles">${bubbles(panel)}</div>
      ${scene(panel)}
    </figure>`;
}

export function comicHtml(panels, { single = false } = {}) {
  if (!panels?.length) return '';
  return `<div class="comic ${single || panels.length === 1 ? 'single' : ''}">${panels.map(panelHtml).join('')}</div>`;
}

// Kleine Sprechszene: Porträt + Sprechblase (z. B. Paco gibt einen Tipp)
export function talk(who, text, mood = 'happy') {
  return `<div class="talk">${portrait(who, mood)}<div class="talk-bubble"><b>${esc(CAST[who]?.name || '')}:</b> ${bubbleText(text)}</div></div>`;
}
