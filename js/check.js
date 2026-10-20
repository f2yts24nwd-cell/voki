// Vergleich von Antwort und Lösung.

export function normalize(s, { caseSensitive = false } = {}) {
  let t = String(s).normalize('NFC')
    .replace(/[’‘`´]/g, "'")
    .replace(/\s*-\s*/g, '-')
    .replace(/[.,!?;:"“”„]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!caseSensitive) t = t.toLocaleLowerCase('de');
  return t;
}

// Trennt an "/" und "," – aber nicht innerhalb von Klammern.
function splitTopLevel(s) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === '/' || ch === ',')) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
}

// Alle akzeptierten Schreibweisen einer Lösung:
// "was/were" -> was, were    "(to) go" -> go, to go
// "Laden, Geschäft" -> Laden, Geschäft    "Nachbar/in" -> Nachbar, Nachbarin
export function variants(answer) {
  const out = new Set();
  const parts = splitTopLevel(String(answer));
  parts.forEach((part, i) => {
    let a = part;
    if (i > 0 && /^(in|innen)$/.test(a)) a = parts[i - 1] + a;
    out.add(a.replace(/-\)/g, ')').replace(/[()]/g, '').trim());
    out.add(a.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim());
  });
  out.delete('');
  return [...out];
}

// Prüft die erkannten Kandidaten. "tolerance" = wie viele Kandidaten
// der Erkennung berücksichtigt werden (1 = nur der wahrscheinlichste).
export function check(candidates, answer, { caseSensitive = false, tolerance = 1 } = {}) {
  const opts = { caseSensitive };
  const accepted = variants(answer).map((v) => normalize(v, opts));
  const considered = candidates.slice(0, Math.max(1, tolerance));
  for (const c of considered) {
    if (accepted.includes(normalize(c, opts))) return { correct: true, read: c };
  }
  return { correct: false, read: candidates[0] || '' };
}

// Markiert die Buchstaben der Lösung, die in der Antwort fehlen/falsch sind.
// Ergebnis: [{ch, ok}]
export function diff(answer, given) {
  const a = [...answer];
  const b = [...String(given).toLowerCase()];
  const al = a.map((c) => c.toLowerCase());
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = al[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length) {
    if (j < b.length && al[i] === b[j]) {
      out.push({ ch: a[i], ok: true }); i++; j++;
    } else if (j < b.length && dp[i][j + 1] >= dp[i + 1][j]) {
      j++;
    } else {
      out.push({ ch: a[i], ok: a[i] === ' ' }); i++;
    }
  }
  return out;
}
