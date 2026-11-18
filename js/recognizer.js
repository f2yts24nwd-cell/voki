// Handschrifterkennung – ausschließlich auf dem Gerät, es wird nichts ins Internet geschickt.
//
// 1. "Stift-Fläche": eingebaute Handwriting Recognition API des Browsers
//    (z. B. Chrome auf Android/ChromeOS). Die Striche auf der Zeichenfläche werden
//    direkt vom Gerät erkannt.
// 2. "Schreibfeld" auf dem iPad: Ein großes Textfeld, in das man mit dem Apple Pencil
//    schreibt. Die Erkennung übernimmt iPadOS selbst (Funktion „Handschrift“/Scribble,
//    läuft auf dem iPad).
// 3. Überall sonst: Tastatur.

export class RecognitionError extends Error {}

const INK_LANGS = ['en', 'fr', 'de'];
const support = {}; // Sprache -> true/false (eingebaute Erkennung)
const nativeCache = {};

export const isIPad = () => /ipad/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

async function querySupport(lang) {
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

// Einmal beim Start: Welche Sprachen kann das Gerät selbst erkennen?
export async function initInk() {
  await Promise.all(INK_LANGS.map(async (l) => { support[l] = await querySupport(l); }));
}

// Kann das Gerät alle diese Sprachen auf der Stift-Fläche erkennen?
export const canDraw = (langs) => langs.every((l) => support[l]);

// Eingabeart für eine Übung: 'pen' (Stift-Fläche) | 'scribble' (Schreibfeld, iPad) | 'keyboard'
export function inputMode(langs, engine) {
  if (engine === 'keyboard') return 'keyboard';
  if (canDraw(langs)) return 'pen';
  if (isIPad()) return 'scribble';
  return 'keyboard';
}

// Liefert eine Liste von Kandidaten, der wahrscheinlichste zuerst.
export async function recognize(strokes, { lang, pointerType }) {
  if (!strokes.length) return [];
  if (!support[lang]) throw new RecognitionError('Dieses Gerät kann die Handschrift nicht selbst erkennen. Bitte benutz die Tastatur.');
  try {
    if (!nativeCache[lang]) nativeCache[lang] = navigator.createHandwritingRecognizer({ languages: [lang] });
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
  } catch (e) {
    delete nativeCache[lang];
    throw new RecognitionError('Die Erkennung auf dem Gerät ist fehlgeschlagen: ' + e.message);
  }
}
