// Einfache "stumme Karten" von Deutschland und Baden-Württemberg als SVG.
// Umrisse, Flüsse und Gebirge sind vereinfacht aus Längen- und Breitengraden gezeichnet;
// die Städte liegen an ihrer echten Position. Außerdem: Klimadiagramm und Gezeitenkurve.

const INK = 'var(--text)';
const WATER = '#3b82f6';
const HILITE = '#f59e0b';
const r1 = (x) => Math.round(x * 10) / 10;

// [Breite, Länge]
const OUTLINE = {
  de: [[53.24, 7.21], [53.68, 7.1], [53.72, 8.0], [53.5, 8.25], [53.85, 8.7], [53.85, 9.0], [54.3, 8.6], [54.9, 8.6], [54.83, 9.4], [54.35, 10.15],
    [54.4, 11.1], [53.95, 10.9], [54.18, 12.1], [54.45, 12.5], [54.65, 13.4], [54.3, 13.75], [53.9, 14.25], [53.3, 14.4], [52.85, 14.15], [52.35, 14.6],
    [51.8, 14.75], [51.0, 15.0], [50.85, 14.6], [50.9, 14.25], [50.4, 12.9], [50.2, 12.2], [49.75, 12.45], [49.0, 13.4], [48.6, 13.8], [48.55, 13.45],
    [48.2, 13.0], [47.5, 13.0], [47.6, 12.2], [47.42, 10.98], [47.27, 10.2], [47.55, 9.75], [47.65, 9.0], [47.7, 8.6], [47.6, 7.6], [48.0, 7.6],
    [48.6, 7.8], [49.0, 8.2], [49.05, 7.4], [49.2, 6.7], [49.45, 6.4], [49.8, 6.5], [50.15, 6.15], [50.35, 6.35], [50.75, 6.0], [51.05, 5.95],
    [51.4, 6.2], [51.85, 6.0], [51.9, 6.75], [52.25, 7.05], [52.65, 6.75], [52.65, 7.05]],
  bw: [[49.58, 8.42], [49.55, 8.6], [49.62, 8.7], [49.5, 8.9], [49.53, 8.95], [49.58, 9.1], [49.65, 9.25], [49.79, 9.4], [49.72, 9.65], [49.63, 9.85],
    [49.5, 9.93], [49.4, 10.12], [49.15, 10.25], [48.95, 10.45], [48.7, 10.48], [48.65, 10.3], [48.47, 10.1], [48.4, 10.0], [48.1, 10.13], [47.85, 10.1],
    [47.68, 10.12], [47.6, 9.95], [47.58, 9.62], [47.65, 9.47], [47.66, 9.17], [47.7, 8.85], [47.8, 8.6], [47.6, 8.4], [47.56, 7.95], [47.59, 7.59],
    [47.9, 7.57], [48.3, 7.73], [48.58, 7.8], [48.97, 8.23], [49.25, 8.4], [49.45, 8.45]],
};

const BOX = {
  de: { lat0: 55.15, lon0: 5.7, lat1: 47.1, lon1: 15.2, scale: 42, kx: 0.63 },
  bw: { lat0: 49.9, lon0: 7.35, lat1: 47.4, lon1: 10.65, scale: 128, kx: 0.66 },
};

export const RIVERS = {
  de: {
    Rhein: [[47.65, 9.2], [47.56, 7.6], [48.58, 7.8], [49.0, 8.3], [49.49, 8.46], [50.0, 8.27], [50.36, 7.6], [50.94, 6.96], [51.23, 6.77], [51.43, 6.76], [51.83, 6.25]],
    Elbe: [[50.85, 14.2], [51.05, 13.74], [51.87, 12.65], [52.13, 11.63], [53.0, 11.75], [53.4, 10.4], [53.55, 10.0], [53.87, 8.7]],
    Donau: [[47.95, 8.5], [48.09, 9.22], [48.4, 9.99], [48.76, 11.42], [49.02, 12.1], [48.57, 13.46]],
    Weser: [[51.42, 9.65], [51.9, 9.4], [52.29, 8.92], [53.08, 8.8], [53.55, 8.58]],
    Main: [[49.9, 10.9], [49.79, 9.93], [49.75, 9.3], [50.11, 8.68], [50.0, 8.27]],
    Oder: [[51.0, 15.0], [51.8, 14.75], [52.35, 14.6], [52.85, 14.15], [53.3, 14.4], [53.9, 14.25]],
  },
  bw: {
    Rhein: [[47.66, 9.17], [47.7, 8.85], [47.6, 8.4], [47.56, 7.95], [47.59, 7.59], [47.9, 7.57], [48.3, 7.73], [48.58, 7.8], [48.97, 8.23], [49.25, 8.4], [49.45, 8.45], [49.58, 8.42]],
    Neckar: [[48.06, 8.53], [48.3, 8.72], [48.52, 9.05], [48.72, 9.3], [48.78, 9.18], [49.14, 9.22], [49.35, 9.1], [49.41, 8.71], [49.49, 8.47]],
    Donau: [[47.95, 8.5], [47.98, 8.82], [48.09, 9.22], [48.15, 9.47], [48.28, 9.73], [48.4, 9.99]],
  },
};

// [Breite, Länge, halbe Breite, halbe Höhe (in Breitengraden), Drehung]
export const MOUNTAINS = {
  de: {
    Harz: [51.75, 10.65, 0.33, 0.16, 15], Schwarzwald: [48.25, 8.15, 0.2, 0.62, 8], 'Schwäbische Alb': [48.4, 9.45, 0.62, 0.14, -32],
    Erzgebirge: [50.6, 13.1, 0.6, 0.12, -22], 'Bayerischer Wald': [49.0, 13.0, 0.45, 0.14, 38], 'Thüringer Wald': [50.65, 10.75, 0.42, 0.11, 32],
    Alpen: [47.48, 11.45, 1.15, 0.15, 0], Eifel: [50.35, 6.75, 0.3, 0.2, 0],
  },
  bw: {
    Schwarzwald: [48.25, 8.17, 0.2, 0.68, 8], 'Schwäbische Alb': [48.42, 9.5, 0.68, 0.13, -32], Odenwald: [49.52, 9.02, 0.17, 0.14, 0],
  },
};

export const CITIES = {
  de: {
    Hamburg: [53.55, 10.0], Bremen: [53.08, 8.8], Hannover: [52.37, 9.73], Berlin: [52.52, 13.4], Köln: [50.94, 6.96], Leipzig: [51.34, 12.37],
    Dresden: [51.05, 13.74], 'Frankfurt am Main': [50.11, 8.68], Nürnberg: [49.45, 11.08], Stuttgart: [48.78, 9.18], München: [48.14, 11.58],
    Kiel: [54.32, 10.14], Rostock: [54.09, 12.13],
  },
  bw: {
    Mannheim: [49.49, 8.47], Heidelberg: [49.41, 8.69], Heilbronn: [49.14, 9.22], Karlsruhe: [49.01, 8.4], Pforzheim: [48.89, 8.7], Stuttgart: [48.78, 9.18],
    'Baden-Baden': [48.76, 8.24], Offenburg: [48.47, 7.94], Reutlingen: [48.49, 9.21], Ulm: [48.4, 9.99], 'Freiburg': [47.99, 7.85],
    Friedrichshafen: [47.65, 9.48], Konstanz: [47.66, 9.17],
  },
};

// Karte zeichnen. opts: { river: Name (hervorgehoben), mountain: Name, dots: [{ name, label }] }
export function mapFig(kind, opts = {}) {
  const b = BOX[kind];
  const X = (lon) => r1((lon - b.lon0) * b.kx * b.scale);
  const Y = (lat) => r1((b.lat0 - lat) * b.scale);
  const W = X(b.lon1);
  const H = Y(b.lat1);
  const path = (pts, close) => `M${pts.map(([la, lo]) => `${X(lo)} ${Y(la)}`).join(' L')}${close ? ' Z' : ''}`;
  let s = `<path d="${path(OUTLINE[kind], true)}" fill="var(--surface)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
  // Gebirge
  for (const [name, [la, lo, rx, ry, rot]] of Object.entries(MOUNTAINS[kind])) {
    const on = name === opts.mountain;
    if (!on && opts.mountain === undefined && opts.plain) continue;
    s += `<ellipse cx="${X(lo)}" cy="${Y(la)}" rx="${r1(rx * b.scale)}" ry="${r1(ry * b.scale)}" transform="rotate(${rot} ${X(lo)} ${Y(la)})" fill="${on ? HILITE : '#a16207'}" fill-opacity="${on ? 0.9 : 0.28}" ${on ? `stroke="${INK}" stroke-width="2"` : ''}/>`;
  }
  // Bodensee
  s += kind === 'bw'
    ? `<ellipse cx="${X(9.33)}" cy="${Y(47.62)}" rx="${r1(0.27 * b.scale)}" ry="${r1(0.05 * b.scale)}" transform="rotate(22 ${X(9.33)} ${Y(47.62)})" fill="${WATER}"/>`
    : `<ellipse cx="${X(9.35)}" cy="${Y(47.62)}" rx="7" ry="2.5" transform="rotate(22 ${X(9.35)} ${Y(47.62)})" fill="${WATER}"/>`;
  // Flüsse
  for (const [name, pts] of Object.entries(RIVERS[kind])) {
    const on = name === opts.river;
    s += `<path d="${path(pts)}" fill="none" stroke="${on ? HILITE : WATER}" stroke-width="${on ? 5.5 : 2}" stroke-opacity="${on ? 1 : 0.7}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  // Inseln und Meere (nur Deutschland)
  if (kind === 'de') {
    s += `<text x="${X(6.6)}" y="${Y(54.45)}" font-size="11" fill="${WATER}" font-style="italic" font-weight="700">Nordsee</text>`
      + `<text x="${X(11.9)}" y="${Y(54.75)}" font-size="11" fill="${WATER}" font-style="italic" font-weight="700">Ostsee</text>`
      + `<ellipse cx="${X(8.33)}" cy="${Y(54.9)}" rx="2" ry="7" fill="var(--surface)" stroke="${INK}" stroke-width="1.5"/>`
      + `<ellipse cx="${X(7.35)}" cy="${Y(53.78)}" rx="12" ry="1.8" fill="var(--surface)" stroke="${INK}" stroke-width="1.2"/>`;
  }
  // Städte
  for (const d of opts.dots || []) {
    const [la, lo] = CITIES[kind][d.name];
    s += `<circle cx="${X(lo)}" cy="${Y(la)}" r="${d.label ? 10 : 7}" fill="#dc2626" stroke="#fff" stroke-width="2"/>`;
    if (d.label) s += `<text x="${X(lo)}" y="${Y(la) + 4}" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${d.label}</text>`;
  }
  return `<svg class="fig fig-map" viewBox="-6 -6 ${W + 12} ${H + 12}" role="img" aria-label="Stumme Karte">${s}</svg>`;
}

// ---------- Klimadiagramm ----------

export const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

// Langjährige Mittelwerte: Temperatur in °C, Niederschlag in mm
export const STATIONS = [
  { name: 'Stuttgart', h: 314, t: [0.5, 1.9, 5.3, 8.9, 13.3, 16.4, 18.4, 17.9, 14.7, 10.0, 4.7, 1.5], n: [38, 35, 39, 54, 84, 93, 63, 76, 53, 41, 48, 41] },
  { name: 'Berlin', h: 58, t: [-0.4, 0.6, 4.0, 8.4, 13.5, 16.7, 17.9, 17.2, 13.5, 9.3, 4.6, 1.2], n: [43, 37, 38, 42, 55, 71, 53, 65, 46, 36, 50, 55] },
  { name: 'List auf Sylt', h: 26, t: [1.6, 1.5, 3.3, 6.5, 11.1, 14.0, 16.2, 16.6, 13.8, 10.1, 5.9, 3.3], n: [59, 38, 49, 37, 37, 54, 55, 71, 85, 88, 90, 72] },
];

export function klimaFig(st) {
  const x0 = 34;
  const y0 = 172; // 0 °C / 0 mm
  const px = 3; // Pixel je °C (und je 2 mm)
  const mw = 22;
  const Yt = (t) => r1(y0 - t * px);
  const Yn = (n) => r1(y0 - (n / 2) * px);
  const W = 12 * mw;
  let s = '';
  for (let t = -10; t <= 50; t += 10) {
    s += `<path d="M${x0} ${Yt(t)} H${x0 + W}" stroke="${INK}" stroke-opacity="${t === 0 ? 0.9 : 0.15}" stroke-width="${t === 0 ? 1.6 : 1}"/>`;
    if (t <= 40) s += `<text x="${x0 - 6}" y="${Yt(t) + 4}" font-size="10" fill="#dc2626" text-anchor="end" font-weight="700">${t}</text>`;
    if (t >= 0) s += `<text x="${x0 + W + 6}" y="${Yt(t) + 4}" font-size="10" fill="${WATER}" font-weight="700">${t * 2}</text>`;
  }
  st.n.forEach((n, i) => {
    s += `<rect x="${x0 + i * mw + 1}" y="${Yn(n)}" width="${mw - 2}" height="${r1(y0 - Yn(n))}" fill="${WATER}" fill-opacity="0.45" stroke="${WATER}" stroke-width="1"/>`;
    s += `<text x="${x0 + i * mw + mw / 2}" y="${Yt(-10) + 14}" font-size="10" fill="${INK}" text-anchor="middle" font-weight="700">${MONTHS[i][0]}</text>`;
  });
  s += `<path d="M${st.t.map((t, i) => `${x0 + i * mw + mw / 2} ${Yt(t)}`).join(' L')}" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linejoin="round"/>`;
  s += st.t.map((t, i) => `<circle cx="${x0 + i * mw + mw / 2}" cy="${Yt(t)}" r="2.6" fill="#dc2626"/>`).join('');
  s += `<text x="${x0 - 6}" y="12" font-size="10" fill="#dc2626" text-anchor="end" font-weight="700">°C</text><text x="${x0 + W + 6}" y="12" font-size="10" fill="${WATER}" font-weight="700">mm</text>`;
  return `<div class="fig-title">${st.name}, ${st.h} m ü. M.</div><svg class="fig fig-w" viewBox="0 0 ${x0 + W + 34} 222" role="img" aria-label="Klimadiagramm">${s}</svg>`;
}

// ---------- Gezeitenkurve ----------
// mark: 'hoch' | 'niedrig' | 'flut' | 'ebbe' | 'hub'
export function tideFig(mark) {
  const x0 = 30;
  const top = 30;
  const bot = 120;
  const mid = (top + bot) / 2;
  const amp = (bot - top) / 2;
  const P = 150; // eine Periode
  const pts = [];
  for (let x = 0; x <= 300; x += 5) pts.push(`${x0 + x} ${r1(mid + amp * Math.cos((x / P) * 2 * Math.PI))}`);
  let s = `<path d="M${x0} ${bot} L${pts.join(' L')} L${x0 + 300} ${bot} Z" fill="${WATER}" fill-opacity="0.3"/>`
    + `<path d="M${pts.join(' L')}" fill="none" stroke="${WATER}" stroke-width="3"/>`
    + `<path d="M${x0} 20 V${bot + 8} H${x0 + 312}" fill="none" stroke="${INK}" stroke-width="2"/>`
    + `<text x="${x0 - 4}" y="14" font-size="10" fill="${INK}" font-weight="700">Wasserstand</text><text x="${x0 + 300}" y="${bot + 22}" font-size="10" fill="${INK}" text-anchor="end" font-weight="700">Zeit →</text>`;
  const q = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${HILITE}" stroke="${INK}" stroke-width="2"/><text x="${x}" y="${y + 4.5}" font-size="13" font-weight="800" text-anchor="middle" fill="#1f2937">?</text>`;
  const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" marker-end="url(#tidearrow)"/>`;
  const defs = '<defs><marker id="tidearrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#dc2626"/></marker></defs>';
  // Kurve: bei x=0 Niedrigwasser (unten), x=75 Hochwasser (oben), x=150 Niedrigwasser …
  if (mark === 'hoch') s += `<path d="M${x0 + 75} ${top} V${bot + 8}" stroke="${INK}" stroke-dasharray="4 4"/>${q(x0 + 75, top - 2)}`;
  else if (mark === 'niedrig') s += q(x0 + 150, bot - 2);
  else if (mark === 'flut') s += arrow(x0 + 22, bot - 22, x0 + 50, top + 24) + q(x0 + 20, mid - 26);
  else if (mark === 'ebbe') s += arrow(x0 + 100, top + 24, x0 + 128, bot - 22) + q(x0 + 132, mid - 26);
  else s += `<path d="M${x0 + 150} ${bot - 2} V${top + 4}" stroke="#dc2626" stroke-width="3.5" marker-end="url(#tidearrow)" marker-start="url(#tidearrow)"/><path d="M${x0 + 75} ${top} H${x0 + 160}" stroke="${INK}" stroke-dasharray="4 4"/>${q(x0 + 172, mid)}`;
  return `<svg class="fig fig-w" viewBox="0 0 350 146" role="img" aria-label="Gezeitenkurve">${defs}${s}</svg>`;
}
