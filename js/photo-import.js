// Vokabeln vom Foto einlesen.
// Die Texterkennung (Tesseract.js, Apache-2.0-Lizenz) liegt in vendor/tesseract/ und läuft
// komplett auf dem Gerät: Das Foto verlässt das iPad nicht, es gibt keinen Server und keine Lizenzkosten.
// Programm und Sprachdaten (ca. 5–7 MB) werden beim ersten Benutzen geladen und danach vom
// Service Worker gespeichert – ab dann geht es auch offline.
//
// Ablauf: Foto aufnehmen ➜ Bereich mit der Vokabelliste zuschneiden ➜ erkennen ➜
//         Tabelle prüfen und verbessern ➜ in die Liste übernehmen.

import { buildTable, guessRoles, tableToEntries } from './ocr-table.js';

const BASE = new URL('../vendor/tesseract/', import.meta.url).href;
const MAX_SIDE = 3000; // größere Fotos werden verkleinert (Speicher auf dem iPad)
const OCR_LANGS = { en: 'deu+eng', fr: 'deu+fra' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Texterkennung ----------

let worker = null;
let workerLangs = '';
let onProgress = () => {};

// Kann das Gerät WebAssembly-SIMD? (schnellere Variante der Erkennung)
const simd = () => {
  try {
    return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
  } catch {
    return false;
  }
};

async function getWorker(langs) {
  if (worker && workerLangs === langs) return worker;
  await stopWorker();
  const { createWorker } = (await import('../vendor/tesseract/tesseract.esm.min.js')).default;
  worker = await createWorker(langs, 1 /* nur LSTM */, {
    workerPath: BASE + 'worker.min.js',
    corePath: BASE + (simd() ? 'tesseract-core-simd-lstm.js' : 'tesseract-core-lstm.js'),
    langPath: BASE + 'lang',
    gzip: true,
    cacheMethod: 'none', // speichert der Service Worker
    workerBlobURL: false,
    logger: (m) => onProgress(m),
  });
  await worker.setParameters({
    tessedit_pageseg_mode: '11', // verstreuter Text: Tabellen ohne Rahmen
    preserve_interword_spaces: '1',
    user_defined_dpi: '300',
  });
  workerLangs = langs;
  return worker;
}

async function stopWorker() {
  const w = worker;
  worker = null;
  workerLangs = '';
  if (w) await w.terminate().catch(() => {});
}

// ---------- Bild ----------

async function loadImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode(); // berücksichtigt die Drehung aus den Foto-Daten (EXIF)
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function rotate(src) {
  const c = document.createElement('canvas');
  c.width = src.height;
  c.height = src.width;
  const ctx = c.getContext('2d');
  ctx.translate(c.width, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(src, 0, 0);
  return c;
}

// Ausschnitt in Graustufen, Kontrast gestreckt; kleine Ausschnitte werden vergrößert.
function prepare(src, f) {
  const sx = Math.round(f.x0 * src.width);
  const sy = Math.round(f.y0 * src.height);
  const sw = Math.max(1, Math.round((f.x1 - f.x0) * src.width));
  const sh = Math.max(1, Math.round((f.y1 - f.y0) * src.height));
  // Tesseract liest am besten, wenn die Buchstaben nicht zu klein sind: auf ca. 2400 px Breite
  // vergrößern (höchstens 2,5-fach und höchstens ca. 12 Megapixel).
  const scale = Math.max(1, Math.min(2.5, 2400 / sw, Math.sqrt(12e6 / (sw * sh))));
  const c = document.createElement('canvas');
  c.width = Math.round(sw * scale);
  c.height = Math.round(sh * scale);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) {
    const g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0;
    d[i] = g;
    hist[g]++;
  }
  // 1 % dunkelste/hellste Punkte abschneiden und dazwischen strecken
  const n = d.length / 4;
  let lo = 0;
  let hi = 255;
  for (let s = 0; lo < 255 && (s += hist[lo]) < n * 0.01; lo++);
  for (let s = 0; hi > 0 && (s += hist[hi]) < n * 0.01; hi--);
  const range = Math.max(1, hi - lo);
  for (let i = 0; i < d.length; i += 4) {
    const g = Math.max(0, Math.min(255, ((d[i] - lo) * 255) / range));
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function collectWords(data) {
  const out = [];
  let line = 0;
  for (const b of data.blocks || []) {
    for (const p of b.paragraphs || []) {
      for (const l of p.lines || []) {
        line++;
        for (const w of l.words || []) out.push({ text: w.text, confidence: w.confidence, bbox: w.bbox, line });
      }
    }
  }
  return out;
}

// ---------- Oberfläche ----------

const STATUS = {
  'loading tesseract core': 'Texterkennung wird geladen …',
  'initializing tesseract': 'Texterkennung startet …',
  'loading language traineddata': 'Sprachdaten werden geladen …',
  'initializing api': 'Texterkennung startet …',
  'recognizing text': 'Text wird erkannt …',
};

// lang: 'en' | 'fr'. onAdd(words) bekommt [{ fremd, de, hint }].
export function openPhotoImport({ lang, onAdd }) {
  const ocrLangs = OCR_LANGS[lang] || OCR_LANGS.en;
  const langName = lang === 'fr' ? 'Französisch' : 'Englisch';
  const prevFocus = document.activeElement;
  const el = document.createElement('div');
  el.className = 'overlay ocr';
  el.innerHTML = `
    <div class="sheet wide" role="dialog" aria-modal="true" aria-label="Vokabeln fotografieren">
      <button class="icon-btn sheet-close" aria-label="Schließen">✕</button>
      <h3 class="ocr-title">📷 Vokabeln fotografieren</h3>
      <div class="ocr-body"></div>
    </div>`;
  document.body.appendChild(el);
  const body = el.querySelector('.ocr-body');
  let src = null; // Foto als Canvas
  let frame = null; // Ausschnitt 0..1
  let crop = null; // vorbereiteter Ausschnitt
  let table = null;
  let roles = null;
  let entries = [];
  let busy = false;
  let closed = false;

  function close() {
    if (closed) return;
    closed = true;
    onProgress = () => {};
    el.remove();
    document.removeEventListener('keydown', onKey);
    stopWorker();
    prevFocus?.focus?.();
  }
  const onKey = (e) => { if (e.key === 'Escape' && !busy) close(); };
  document.addEventListener('keydown', onKey);
  el.addEventListener('click', (e) => {
    if (e.target.closest('.sheet-close') || (e.target === el && !busy)) close();
  });

  // ---- 1. Foto wählen ----
  function stepPick(error = '') {
    body.innerHTML = `
      <p>Fotografiere die Vokabelliste aus dem ${langName}-Buch. Voki liest die Wörter und du prüfst sie danach.</p>
      <ul class="ocr-tips">
        <li>📖 Buch flach hinlegen, <b>gerade von oben</b> fotografieren</li>
        <li>💡 Gutes Licht, kein Schatten vom iPad auf der Seite</li>
        <li>✂️ Danach schneidest du die Liste zurecht</li>
      </ul>
      ${error ? `<p class="ocr-error">${esc(error)}</p>` : ''}
      <label class="btn primary big ocr-file">📷 Foto aufnehmen oder auswählen
        <input type="file" accept="image/*" hidden>
      </label>
      <p class="muted small">Die Erkennung läuft nur auf diesem Gerät – das Foto wird nirgendwohin geschickt.</p>`;
    body.querySelector('input').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      body.innerHTML = '<p class="center muted">Foto wird geladen …</p>';
      try {
        src = await loadImage(file);
        frame = { x0: 0.04, y0: 0.04, x1: 0.96, y1: 0.96 };
        stepCrop();
      } catch {
        stepPick('Das Foto konnte nicht geöffnet werden. Bitte versuch es noch einmal.');
      }
    });
  }

  // ---- 2. Zuschneiden ----
  function stepCrop() {
    body.innerHTML = `
      <p>Zieh den Rahmen an den Ecken, bis nur noch die Vokabeln drin sind.</p>
      <div class="ocr-stage">
        <div class="ocr-frame" data-h="move">
          ${['nw', 'ne', 'sw', 'se'].map((h) => `<span class="ocr-handle ${h}" data-h="${h}"></span>`).join('')}
        </div>
      </div>
      <div class="row">
        <button class="btn" type="button" data-act="rotate">⟳ Drehen</button>
        <button class="btn" type="button" data-act="again">📷 Anderes Foto</button>
        <button class="btn primary" type="button" data-act="ocr">Text erkennen ➜</button>
      </div>`;
    const stage = body.querySelector('.ocr-stage');
    const fr = body.querySelector('.ocr-frame');
    src.classList.add('ocr-photo');
    stage.prepend(src);
    stage.style.aspectRatio = `${src.width} / ${src.height}`;
    stage.style.width = `min(100%, calc(62dvh * ${(src.width / src.height).toFixed(4)}))`;
    const place = () => {
      Object.assign(fr.style, {
        left: `${frame.x0 * 100}%`, top: `${frame.y0 * 100}%`,
        width: `${(frame.x1 - frame.x0) * 100}%`, height: `${(frame.y1 - frame.y0) * 100}%`,
      });
    };
    place();
    let drag = null;
    stage.addEventListener('pointerdown', (e) => {
      const h = e.target.closest('[data-h]')?.dataset.h;
      if (!h) return;
      e.preventDefault();
      stage.setPointerCapture(e.pointerId);
      drag = { h, id: e.pointerId, x: e.clientX, y: e.clientY, start: { ...frame } };
    });
    stage.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - drag.x) / r.width;
      const dy = (e.clientY - drag.y) / r.height;
      const s = drag.start;
      const min = 0.05;
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const f = { ...s };
      if (drag.h === 'move') {
        const w = s.x1 - s.x0;
        const hh = s.y1 - s.y0;
        f.x0 = clamp(s.x0 + dx, 0, 1 - w); f.x1 = f.x0 + w;
        f.y0 = clamp(s.y0 + dy, 0, 1 - hh); f.y1 = f.y0 + hh;
      } else {
        if (drag.h.includes('w')) f.x0 = clamp(s.x0 + dx, 0, s.x1 - min);
        if (drag.h.includes('e')) f.x1 = clamp(s.x1 + dx, s.x0 + min, 1);
        if (drag.h.includes('n')) f.y0 = clamp(s.y0 + dy, 0, s.y1 - min);
        if (drag.h.includes('s')) f.y1 = clamp(s.y1 + dy, s.y0 + min, 1);
      }
      frame = f;
      place();
    });
    const end = (e) => { if (drag && e.pointerId === drag.id) drag = null; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    body.querySelector('[data-act=rotate]').addEventListener('click', () => {
      src = rotate(src);
      frame = { x0: 0.04, y0: 0.04, x1: 0.96, y1: 0.96 };
      stepCrop();
    });
    body.querySelector('[data-act=again]').addEventListener('click', () => stepPick());
    body.querySelector('[data-act=ocr]').addEventListener('click', runOcr);
  }

  // ---- 3. Erkennen ----
  async function runOcr() {
    busy = true;
    body.innerHTML = `
      <p class="ocr-status">Texterkennung wird geladen …</p>
      <div class="ocr-bar"><span></span></div>
      <p class="muted small">Beim ersten Mal werden einmalig ca. 5 MB geladen. Danach geht es auch ohne Internet.</p>`;
    const status = body.querySelector('.ocr-status');
    const bar = body.querySelector('.ocr-bar span');
    onProgress = (m) => {
      if (closed) return;
      status.textContent = STATUS[m.status] || 'Einen Moment …';
      const loading = m.status !== 'recognizing text';
      // Laden zählt bis 30 %, Erkennen von 30 bis 100 %
      const p = loading ? (m.progress || 0) * 0.3 : 0.3 + (m.progress || 0) * 0.7;
      bar.style.width = `${Math.round(p * 100)}%`;
    };
    try {
      crop = prepare(src, frame);
      const blob = await new Promise((res) => crop.toBlob(res, 'image/png'));
      const w = await getWorker(ocrLangs);
      const { data } = await w.recognize(blob, {}, { blocks: true, text: false });
      if (closed) return;
      table = buildTable(collectWords(data));
      roles = guessRoles(table);
      entries = tableToEntries(table, roles);
      busy = false;
      if (!entries.length) {
        stepPick('Voki konnte auf dem Foto keine Vokabeln lesen. Tipp: näher ran, gerade von oben und mit gutem Licht.');
        return;
      }
      stepReview();
    } catch (err) {
      busy = false;
      if (closed) return;
      console.error(err);
      stepPick(navigator.onLine
        ? 'Die Texterkennung hat nicht geklappt. Bitte versuch es noch einmal.'
        : 'Für das erste Mal braucht die Texterkennung Internet (einmalig ca. 5 MB). Danach geht es auch offline.');
    }
  }

  // ---- 4. Prüfen ----
  function roleSelect(name, label, value, optional) {
    const opts = [];
    if (optional) opts.push(`<option value="-1" ${value < 0 ? 'selected' : ''}>keine</option>`);
    for (let c = 0; c < table.columns; c++) {
      // Beispiel aus einer vollständigen Zeile (nicht aus einer Überschrift)
      const full = table.rows.find((r) => r.cells.filter((x) => x.raw).length >= Math.min(2, table.columns) && r.cells[c]?.raw);
      const sample = (full || table.rows.find((r) => r.cells[c]?.raw))?.cells[c].raw || '';
      opts.push(`<option value="${c}" ${c === value ? 'selected' : ''}>Spalte ${c + 1}${sample ? ` („${esc(sample.slice(0, 18))}${sample.length > 18 ? '…' : ''}“)` : ''}</option>`);
    }
    return `<label>${label}<select data-role="${name}">${opts.join('')}</select></label>`;
  }

  function rowStrip(e) {
    const pad = table.lineHeight * 0.2;
    const y0 = Math.max(0, Math.floor(e.y0 - pad));
    const y1 = Math.min(crop.height, Math.ceil(e.y1 + pad));
    const scale = Math.min(1, 900 / crop.width);
    const c = document.createElement('canvas');
    c.width = Math.round(crop.width * scale);
    c.height = Math.max(1, Math.round((y1 - y0) * scale));
    c.getContext('2d').drawImage(crop, 0, y0, crop.width, y1 - y0, 0, 0, c.width, c.height);
    c.className = 'ocr-strip';
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  function stepReview() {
    const foreignLabel = lang === 'fr' ? '🇫🇷 Französisch' : '🇬🇧 Englisch';
    body.innerHTML = `
      <p>Voki hat <b>${entries.length}</b> Einträge gefunden. Vergleich sie mit dem Foto und verbessere, was falsch ist –
        <mark class="ocr-low-key">gelb</mark> markierte Felder waren schwer zu lesen.
        Zeilen ohne deutsches Wort (z. B. Überschriften) werden nicht übernommen.</p>
      ${table.columns >= 2 ? `
        <details class="ocr-cols" ${table.columns >= 3 ? 'open' : ''}>
          <summary>Spalten zuordnen</summary>
          <div class="ocr-roles">
            ${roleSelect('foreign', foreignLabel, roles.foreign, false)}
            ${roleSelect('german', '🇩🇪 Deutsch', roles.german, false)}
            ${table.columns >= 3 ? roleSelect('hint', '💡 Hinweis (z. B. Beispielsatz)', roles.hint, true) : ''}
          </div>
          <button class="btn" type="button" data-act="swap">⇄ Spalten tauschen</button>
        </details>` : ''}
      <ol class="ocr-rows"></ol>
      <button class="btn" type="button" data-act="addrow">＋ Zeile hinzufügen</button>
      <div class="row ocr-actions">
        <button class="btn" type="button" data-act="again">📷 Neues Foto</button>
        <button class="btn primary" type="button" data-act="take"></button>
      </div>`;
    const list = body.querySelector('.ocr-rows');
    const takeBtn = body.querySelector('[data-act=take]');
    const updateCount = () => {
      const n = entries.filter((e) => e.fremd.trim() && e.de.trim()).length;
      takeBtn.textContent = `✓ ${n} ${n === 1 ? 'Wort' : 'Wörter'} übernehmen`;
      takeBtn.disabled = !n;
    };
    const renderRows = () => {
      list.innerHTML = '';
      entries.forEach((e, i) => {
        const li = document.createElement('li');
        li.className = 'ocr-row';
        li.innerHTML = `
          <div class="ocr-fields">
            <input aria-label="${foreignLabel}" data-k="fremd" value="${esc(e.fremd)}" class="${e.lowFremd ? 'low' : ''}"
              lang="${lang}" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${langName}">
            <input aria-label="Deutsch" data-k="de" value="${esc(e.de)}" class="${e.lowDe ? 'low' : ''}"
              lang="de" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Deutsch">
            ${roles.hint >= 0 || e.hint ? `<input aria-label="Hinweis" data-k="hint" value="${esc(e.hint)}" class="hint" placeholder="Hinweis" spellcheck="false">` : ''}
          </div>
          <div class="ocr-row-btns">
            ${i > 0 ? '<button class="icon-btn" type="button" data-act="merge" aria-label="Mit der Zeile darüber verbinden" title="Mit der Zeile darüber verbinden">⤒</button>' : ''}
            <button class="icon-btn" type="button" data-act="del" aria-label="Zeile löschen" title="Zeile löschen">✕</button>
          </div>`;
        if (e.y1 > e.y0) li.prepend(rowStrip(e));
        li.addEventListener('input', (ev) => {
          const k = ev.target.dataset.k;
          if (!k) return;
          e[k] = ev.target.value;
          ev.target.classList.remove('low');
          updateCount();
        });
        li.querySelector('[data-act=del]').addEventListener('click', () => { entries.splice(i, 1); renderRows(); });
        li.querySelector('[data-act=merge]')?.addEventListener('click', () => {
          const p = entries[i - 1];
          const join = (a, b) => [a, b].map((s) => s.trim()).filter(Boolean).join(' ');
          p.fremd = join(p.fremd, e.fremd);
          p.de = join(p.de, e.de);
          p.hint = join(p.hint, e.hint);
          p.lowFremd ||= e.lowFremd;
          p.lowDe ||= e.lowDe;
          p.y1 = Math.max(p.y1, e.y1);
          entries.splice(i, 1);
          renderRows();
        });
        list.appendChild(li);
      });
      updateCount();
    };
    renderRows();

    body.querySelectorAll('[data-role]').forEach((s) => s.addEventListener('change', () => {
      roles[s.dataset.role] = Number(s.value);
      entries = tableToEntries(table, roles);
      stepReview();
    }));
    body.querySelector('[data-act=swap]')?.addEventListener('click', () => {
      [roles.foreign, roles.german] = [roles.german, roles.foreign];
      entries = tableToEntries(table, roles);
      stepReview();
    });
    body.querySelector('[data-act=addrow]').addEventListener('click', () => {
      entries.push({ fremd: '', de: '', hint: '', y0: 0, y1: 0 });
      renderRows();
      list.lastElementChild?.querySelector('input')?.focus();
    });
    body.querySelector('[data-act=again]').addEventListener('click', () => stepPick());
    takeBtn.addEventListener('click', () => {
      const words = entries
        .map((e) => ({ fremd: e.fremd.trim(), de: e.de.trim(), hint: (e.hint || '').trim() }))
        .filter((e) => e.fremd && e.de);
      if (!words.length) return;
      onAdd(words);
      close();
    });
  }

  stepPick();
  el.querySelector('.sheet-close').focus();
  return close;
}
