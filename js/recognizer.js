// Handschrifterkennung.
// 1. "native": eingebaute Handwriting Recognition API des Browsers
//    (läuft offline auf dem Gerät, z. B. Chrome auf Android/ChromeOS).
// 2. "google": Online-Handschrifterkennung von Google Input Tools
//    (funktioniert in allen Browsern inkl. Safari auf dem iPad, braucht Internet).

const GOOGLE_URLS = [
  'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
  'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
];

export class RecognitionError extends Error {}

const nativeCache = {};

export async function nativeSupported(lang) {
  if (!('createHandwritingRecognizer' in navigator)) return false;
  try {
    if (navigator.queryHandwritingRecognizer) {
      return !!(await navigator.queryHandwritingRecognizer({ languages: [lang] }));
    }
    return true;
  } catch {
    return false;
  }
}

async function recognizeNative(strokes, { lang, pointerType }) {
  if (!nativeCache[lang]) {
    nativeCache[lang] = navigator.createHandwritingRecognizer({ languages: [lang] });
  }
  const recognizer = await nativeCache[lang];
  const inputType = pointerType === 'pen' ? 'stylus' : pointerType === 'mouse' ? 'mouse' : 'touch';
  const drawing = recognizer.startDrawing({ recognitionType: 'text', inputType, alternatives: 5 });
  try {
    for (const s of strokes) {
      const stroke = new HandwritingStroke();
      for (const p of s) stroke.addPoint({ x: p.x, y: p.y, t: p.t });
      drawing.addStroke(stroke);
    }
    const predictions = await drawing.getPrediction();
    return (predictions || []).map((p) => p.text);
  } finally {
    drawing.clear?.();
  }
}

async function recognizeGoogle(strokes, { lang, width, height }) {
  const t0 = strokes[0]?.[0]?.t ?? 0;
  const ink = strokes.map((s) => [
    s.map((p) => Math.round(p.x)),
    s.map((p) => Math.round(p.y)),
    s.map((p) => Math.max(0, Math.round(p.t - t0))),
  ]);
  const body = JSON.stringify({
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: Math.round(width), writing_area_height: Math.round(height) },
      ink,
      language: lang,
      max_num_results: 8,
      max_completions: 0,
    }],
  });

  if (!navigator.onLine) {
    throw new RecognitionError('Keine Internetverbindung – die Handschrifterkennung braucht Internet. Du kannst stattdessen die Tastatur benutzen.');
  }

  let lastError;
  for (const url of GOOGLE_URLS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      // Antwortformat: ["SUCCESS", [[id, [kandidat1, kandidat2, ...], ...]]]
      if (data[0] !== 'SUCCESS') throw new Error(String(data[0]));
      return data[1]?.[0]?.[1] || [];
    } catch (e) {
      lastError = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new RecognitionError('Die Handschrifterkennung ist gerade nicht erreichbar (' + (lastError?.message || 'Fehler') + '). Versuch es nochmal oder nimm die Tastatur.');
}

// Liefert eine Liste von Kandidaten, der wahrscheinlichste zuerst.
export async function recognize(strokes, opts) {
  if (!strokes.length) return [];
  let engine = opts.engine || 'auto';
  if (engine === 'auto') engine = (await nativeSupported(opts.lang)) ? 'native' : 'google';
  if (engine === 'native') {
    try {
      return await recognizeNative(strokes, opts);
    } catch (e) {
      if (opts.engine === 'native') throw new RecognitionError('Die Erkennung auf dem Gerät ist fehlgeschlagen: ' + e.message);
      // bei "auto" auf Google ausweichen
    }
  }
  return recognizeGoogle(strokes, opts);
}
