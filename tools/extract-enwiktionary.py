#!/usr/bin/env python3
"""Zieht aus dem englischen Wiktionary (wiktextract/kaikki.org) die deutschen und französischen
Übersetzungen englischer Wörter heraus – Zwischenschritt für tools/build-dict.py.

Quelle: https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz
        (English Wiktionary, englische Einträge, CC BY-SA 4.0)
Aufruf (die ca. 530 MB werden gestreamt, nicht gespeichert):
  curl -sS https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz \\
    | gunzip | python3 -I tools/extract-enwiktionary.py > enwikt-de-fr.jsonl
Ausgabe je Zeile: {"w": Wort, "p": Wortart, "f": [Formen], "t": [[Bedeutung, Sprache, Übersetzung, Geschlecht], ...]}
"""
import json
import sys

LANGS = {'de', 'fr'}
BLOCK = {'vulgar', 'derogatory', 'offensive', 'pejorative', 'slur', 'ethnic-slur', 'obsolete', 'archaic', 'dated'}
GENDER = {'masculine': 'm', 'feminine': 'f', 'neuter': 'n'}


def standard(tags):
    # Dialekte und Varianten (Alemannisch, Bairisch, Schweiz, Québec …) weglassen
    for t in tags:
        if t in BLOCK:
            return False
        if any(x in t for x in ('German-', 'Alemannic', 'Bavarian', 'Swiss', 'Austrian', 'Quebec',
                                 'Belgian', 'Canadian', 'Louisiana', 'Cajun', 'Old', 'Middle', 'Low-German')):
            return False
    return True


def main():
    for line in sys.stdin:
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if d.get('lang_code') != 'en':
            continue
        word = d.get('word') or ''
        if not word or len(word) > 60:
            continue
        trs = list(d.get('translations') or [])
        for s in d.get('senses') or []:
            trs.extend(s.get('translations') or [])
        out = []
        for t in trs:
            if t.get('lang_code') not in LANGS or not t.get('word'):
                continue
            # Nur Standardsprache: "Bavarian German", "Austrian German" … tragen ebenfalls den Code "de"
            if t.get('lang') not in ('German', 'French'):
                continue
            tags = t.get('tags') or []
            if not standard(tags + (t.get('raw_tags') or [])):
                continue
            g = ''.join(sorted({GENDER[x] for x in tags if x in GENDER}, key='mfn'.index))
            out.append([(t.get('sense') or '')[:80], t['lang_code'], t['word'][:80], g])
        forms = sorted({f.get('form') for f in d.get('forms') or []
                        if f.get('form') and ' ' not in f['form'] and len(f['form']) <= 40})
        form_of = [fo.get('word') for s in d.get('senses') or [] for fo in (s.get('form_of') or []) if fo.get('word')]
        if not out and not forms and not form_of:
            continue
        rec = {'w': word, 'p': d.get('pos') or '', 'f': forms, 't': out}
        if form_of:
            rec['o'] = sorted(set(form_of))
        sys.stdout.write(json.dumps(rec, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
