// Kleine SVG-Zeichnungen für Mathe-Aufgaben: Bruch-Kreise, Winkel, Zahlenstrahl,
// Figuren und Diagramme. Farben kommen aus den CSS-Variablen des Fachs.

const INK = 'var(--text)';
const FILL = 'var(--primary)';
const svg = (w, h, body, cls = '') => `<svg class="fig ${cls}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Zeichnung zur Aufgabe">${body}</svg>`;
const r1 = (x) => Math.round(x * 10) / 10;
const text = (x, y, t, extra = '') => `<text x="${r1(x)}" y="${r1(y)}" fill="${INK}" font-size="13" font-weight="700" text-anchor="middle" ${extra}>${t}</text>`;

// Kreis mit d gleich großen Stücken, n davon gefärbt
export function pie(n, d) {
  const c = 60;
  const r = 52;
  let parts = '';
  if (d === 1) {
    parts = `<circle cx="${c}" cy="${c}" r="${r}" fill="${n ? FILL : 'var(--surface)'}" stroke="${INK}" stroke-width="2"/>`;
  } else {
    for (let i = 0; i < d; i++) {
      const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
      parts += `<path d="M${c} ${c} L${r1(c + r * Math.cos(a0))} ${r1(c + r * Math.sin(a0))} A${r} ${r} 0 0 1 ${r1(c + r * Math.cos(a1))} ${r1(c + r * Math.sin(a1))} Z" fill="${i < n ? FILL : 'var(--surface)'}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    }
  }
  return svg(120, 120, parts, 'fig-s');
}

// Streifen (Schokoladentafel) mit d Stücken, n davon gefärbt
export function bar(n, d) {
  const w = 200 / d;
  let parts = '';
  for (let i = 0; i < d; i++) {
    parts += `<rect x="${r1(10 + i * w)}" y="10" width="${r1(w)}" height="46" fill="${i < n ? FILL : 'var(--surface)'}" stroke="${INK}" stroke-width="2"/>`;
  }
  return svg(220, 66, parts, 'fig-w');
}

// Winkel mit Bogen. rot dreht die ganze Figur (damit es nicht immer gleich aussieht).
export function angle(deg, rot = 0) {
  const c = 100;
  const len = 78;
  const rr = 30;
  const p = (a, r) => [r1(c + r * Math.cos((a * Math.PI) / 180)), r1(c - r * Math.sin((a * Math.PI) / 180))];
  const [x1, y1] = p(rot, len);
  const [x2, y2] = p(rot + deg, len);
  const [ax1, ay1] = p(rot, rr);
  const [ax2, ay2] = p(rot + deg, rr);
  let arc;
  if (deg >= 360) arc = `<circle cx="${c}" cy="${c}" r="${rr}" fill="none" stroke="${FILL}" stroke-width="4"/>`;
  else arc = `<path d="M${c} ${c} L${ax1} ${ay1} A${rr} ${rr} 0 ${deg > 180 ? 1 : 0} 0 ${ax2} ${ay2} Z" fill="${FILL}" fill-opacity="0.35" stroke="${FILL}" stroke-width="3"/>`;
  return svg(200, 200, `
    ${arc}
    <path d="M${c} ${c} L${x1} ${y1} M${c} ${c} L${x2} ${y2}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${c}" cy="${c}" r="4.5" fill="${INK}"/>`, 'fig-m');
}

// Uhr mit Stunden- und Minutenzeiger
export function clock(h, m = 0) {
  const c = 100;
  let marks = '';
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    marks += text(c + 70 * Math.sin(a), c - 70 * Math.cos(a) + 5, i);
  }
  const ha = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
  const ma = (m * 6 * Math.PI) / 180;
  return svg(200, 200, `
    <circle cx="${c}" cy="${c}" r="88" fill="var(--surface)" stroke="${INK}" stroke-width="3"/>
    ${marks}
    <path d="M${c} ${c} L${r1(c + 44 * Math.sin(ha))} ${r1(c - 44 * Math.cos(ha))}" stroke="${FILL}" stroke-width="6" stroke-linecap="round"/>
    <path d="M${c} ${c} L${r1(c + 60 * Math.sin(ma))} ${r1(c - 60 * Math.cos(ma))}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${c}" cy="${c}" r="5" fill="${INK}"/>`, 'fig-m');
}

// Zahlenstrahl von min bis max. ticks = Anzahl Teilstriche zwischen zwei beschrifteten Zahlen,
// labelStep = Abstand der beschrifteten Zahlen, mark = markierte Stelle (mit "?").
export function numLine({ min, max, labelStep = 1, ticks = 1, mark }) {
  const x0 = 24;
  const x1 = 336;
  const X = (v) => r1(x0 + ((v - min) / (max - min)) * (x1 - x0));
  let parts = `<path d="M10 50 H350" stroke="${INK}" stroke-width="2.5"/><path d="M350 50 l-9 -5 v10 z" fill="${INK}"/>`;
  const small = labelStep / ticks;
  const count = Math.round((max - min) / small);
  for (let i = 0; i <= count; i++) {
    const v = min + i * small;
    const big = i % ticks === 0;
    parts += `<path d="M${X(v)} ${big ? 40 : 44} V${big ? 60 : 56}" stroke="${INK}" stroke-width="${big ? 2.5 : 1.5}"/>`;
    if (big) parts += text(X(v), 78, String(Math.round(v)).replace('-', '−'));
  }
  if (mark !== undefined) {
    parts += `<path d="M${X(mark)} 36 l-7 -12 h14 z" fill="${FILL}"/>${text(X(mark), 18, '?', `fill="${FILL}" font-size="16"`)}`;
  }
  return svg(360, 86, parts, 'fig-w');
}

const dash = 'stroke-dasharray="5 4"';

// Rechteck mit Seitenlängen
export function rectFig(a, b, unit = 'cm') {
  return svg(220, 130, `
    <rect x="30" y="18" width="150" height="80" fill="${FILL}" fill-opacity="0.25" stroke="${INK}" stroke-width="2.5"/>
    ${text(105, 118, `${a} ${unit}`)}${text(200, 62, `${b} ${unit}`)}`, 'fig-w');
}

// Parallelogramm mit Grundseite g und Höhe h
export function paraFig(g, h, unit = 'cm') {
  return svg(240, 130, `
    <path d="M20 98 H160 L210 18 H70 Z" fill="${FILL}" fill-opacity="0.25" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M70 18 V98" stroke="${INK}" stroke-width="2" ${dash}/>
    <path d="M70 88 h10 v10" fill="none" stroke="${INK}" stroke-width="1.5"/>
    ${text(90, 118, `g = ${g} ${unit}`)}${text(108, 62, `h = ${h} ${unit}`)}`, 'fig-w');
}

// Dreieck mit Grundseite g und Höhe h
export function triFig(g, h, unit = 'cm') {
  return svg(240, 130, `
    <path d="M20 98 H200 L130 16 Z" fill="${FILL}" fill-opacity="0.25" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M130 16 V98" stroke="${INK}" stroke-width="2" ${dash}/>
    <path d="M130 88 h10 v10" fill="none" stroke="${INK}" stroke-width="1.5"/>
    ${text(110, 118, `g = ${g} ${unit}`)}${text(92, 66, `h = ${h} ${unit}`)}`, 'fig-w');
}

// Quader (Schrägbild) mit Kantenlängen
export function boxFig(a, b, c, unit = 'cm') {
  return svg(240, 150, `
    <path d="M20 50 H150 V130 H20 Z" fill="${FILL}" fill-opacity="0.3" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M20 50 L60 18 H190 L150 50 Z" fill="${FILL}" fill-opacity="0.15" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M150 50 L190 18 V98 L150 130 Z" fill="${FILL}" fill-opacity="0.45" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    ${text(85, 146, `${a} ${unit}`)}${text(196, 126, `${b} ${unit}`, 'text-anchor="start"')}${text(216, 62, `${c} ${unit}`)}`, 'fig-w');
}

// Säulendiagramm. Die Werte müssen an der Achse abgelesen werden.
export function chart(labels, values) {
  const top = Math.max(...values);
  const step = top > 12 ? 5 : 2;
  const maxY = Math.ceil((top + 1) / step) * step;
  const x0 = 34;
  const y0 = 150;
  const H = 130;
  const W = 300;
  const Y = (v) => r1(y0 - (v / maxY) * H);
  let parts = '';
  for (let v = 0; v <= maxY; v += step) {
    parts += `<path d="M${x0} ${Y(v)} H${x0 + W}" stroke="${INK}" stroke-opacity="${v ? 0.2 : 1}" stroke-width="${v ? 1 : 2}"/>${text(x0 - 8, Y(v) + 4, v, 'text-anchor="end" font-size="11"')}`;
  }
  // feine Hilfslinien für jede Einheit
  for (let v = 1; v < maxY; v++) if (v % step) parts += `<path d="M${x0} ${Y(v)} H${x0 + W}" stroke="${INK}" stroke-opacity="0.08" stroke-width="1"/>`;
  const bw = W / labels.length;
  labels.forEach((l, i) => {
    const x = x0 + i * bw + bw * 0.2;
    parts += `<rect x="${r1(x)}" y="${Y(values[i])}" width="${r1(bw * 0.6)}" height="${r1(y0 - Y(values[i]))}" fill="${FILL}" rx="3"/>${text(x + bw * 0.3, y0 + 16, l, 'font-size="11"')}`;
  });
  return svg(346, 174, parts, 'fig-w');
}
