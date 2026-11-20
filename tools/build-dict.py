#!/usr/bin/env python3
"""Baut die Prüf-Wörterbücher für Voki aus dem deutschen Wiktionary.

Quelle: Deutsches Wiktionary (de.wiktionary.org), englische bzw. französische Einträge
mit deutschen Bedeutungen, maschinenlesbar aufbereitet von wiktextract / kaikki.org:
  https://kaikki.org/dewiktionary/Englisch/kaikki.org-dictionary-Englisch.jsonl
  https://kaikki.org/dewiktionary/Franz%C3%B6sisch/kaikki.org-dictionary-Franz%C3%B6sisch.jsonl
Lizenz der Daten: CC BY-SA 4.0 (Autorinnen und Autoren: die Beitragenden des Wiktionary).

Zusätzlich (empfohlen): Übersetzungstabellen des englischen Wiktionary, vorher mit
tools/extract-enwiktionary.py herausgezogen (Lizenz ebenfalls CC BY-SA 4.0).

Aufruf:
  python3 -I tools/build-dict.py <englisch.jsonl> <franzoesisch.jsonl> [enwikt-de-fr.jsonl]
Ergebnis:
  vendor/dict/en-de.json.gz, vendor/dict/fr-de.json.gz

Format (JSON):
  { "lang": "en", "source": "...", "date": "...",
    "e": { "beautiful": [ ["schön"], "adj" ],              # Wort -> [Bedeutungen, Wortarten, Geschlecht?]
           "ville": [ ["Stadt, Ort"], "noun", "f" ] },
    "f": { "chose": "choose", "wives": "wife" } }        # Beugungsform -> Grundform
"""
import gzip
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'vendor', 'dict')
BLOCK_TAGS = {'derogatory', 'vulgar', 'offensive', 'pejorative', 'ethnic slur', 'slur'}
BLOCK_RAW = ('vulgär', 'abwertend', 'pejorativ', 'beleidig', 'obszön')
MAX_GLOSSES = 24
# Derbe und beleidigende deutsche Wörter, die über Übersetzungstabellen hereinkommen können
BAD_DE = re.compile(r'\b(fick\w*|gefick\w*|bums\w*|vögel\w*|gevögel|pimper\w*|rammel\w*|scheiß\w*|beschiss\w*|bescheiß\w*|'
                    r'verarsch\w*|arsch\w*|schwuchtel|tunte|fotze|nutte|hure\w*|wichs\w*|schlampe|pisse\w*|kacke|'
                    r'neger\w*|zigeuner\w*|spast\w*|mongo\w*|geil\w*|pimmel|schwanz)\b', re.I)
ARTICLE = {'m': 'der', 'f': 'die', 'n': 'das'}
SKIP_POS = {'name', 'character', 'symbol', 'abbrev', 'suffix', 'prefix', 'infix', 'affix'}


def clean_gloss(g):
    g = re.sub(r'\s+', ' ', g).strip()
    g = re.sub(r'^\[\d+[a-z]?\]\s*', '', g)
    return g[:140]


def build(path, lang, date, extra=None):
    entries = {}
    forms = {}
    blocked = set()  # Wörter, die im deutschen Wiktionary nur vulgäre/abwertende Bedeutungen haben
    for line in open(path, encoding='utf-8'):
        d = json.loads(line)
        word = (d.get('word') or '').strip()
        pos = d.get('pos') or ''
        if not word or pos in SKIP_POS or len(word) > 60:
            continue
        glosses = []
        key = word.lower()
        blocked_any = False
        for s in d.get('senses') or []:
            tags = set(s.get('tags') or [])
            # Gebeugte Form ("Plural des Substantivs atrocity") -> nur in die Formen-Tabelle
            if 'form-of' in tags or s.get('form_of'):
                for fo in s.get('form_of') or []:
                    base = (fo.get('word') or '').strip().lower()
                    if base and base != key:
                        forms.setdefault(key, base)
                continue
            # Abwertende und vulgäre Bedeutungen gehören nicht in eine Lern-App für Kinder
            raw = ' '.join(s.get('raw_tags') or []).lower()
            if tags & BLOCK_TAGS or any(x in raw for x in BLOCK_RAW):
                blocked_any = True
                continue
            for g in s.get('glosses') or []:
                g = clean_gloss(g)
                if g and g not in glosses:
                    glosses.append(g)
        if not glosses:
            if blocked_any:
                blocked.add(key)
            continue
        e = entries.setdefault(key, [[], '', ''])
        for g in glosses:
            if g not in e[0]:
                e[0].append(g)
        if pos not in e[1].split(','):
            e[1] = (e[1] + ',' + pos).strip(',')
        tags = set(d.get('tags') or [])
        gender = ('m' if 'masculine' in tags else '') + ('f' if 'feminine' in tags else '')
        if gender and pos == 'noun':
            e[2] = ''.join(sorted(set(e[2] + gender), key='mf'.index))
        e[0] = e[0][:MAX_GLOSSES]
        for f in d.get('forms') or []:
            form = (f.get('form') or '').strip().lower()
            if form and form != key and ' ' not in form and len(form) <= 40 and not form.startswith('-'):
                forms.setdefault(form, key)
    if extra:
        merge_enwiktionary(extra, lang, entries, forms, blocked)
    for k in blocked:
        entries.pop(k, None)
    # Derbe deutsche Wörter aus den Bedeutungen entfernen (Lern-App für Kinder)
    for k in list(entries):
        e = entries[k]
        e[0] = [g for g in e[0] if not BAD_DE.search(g)]
        if not e[0]:
            del entries[k]
    # Nur Formen behalten, deren Grundform im Wörterbuch steht und die nicht selbst Stichwort sind
    forms = {k: v for k, v in forms.items() if v in entries}
    out = {
        'lang': lang,
        'source': 'Deutsches Wiktionary (de.wiktionary.org) via wiktextract/kaikki.org – CC BY-SA 4.0',
        'date': date,
        'e': {k: (v if v[2] else v[:2]) for k, v in sorted(entries.items())},
        'f': dict(sorted(forms.items())),
    }
    os.makedirs(OUT, exist_ok=True)
    target = os.path.join(OUT, f'{lang}-de.json.gz')
    data = json.dumps(out, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    with open(target, 'wb') as fh:
        # mtime=0: gleiche Daten ergeben die gleiche Datei
        with gzip.GzipFile(fileobj=fh, mode='wb', compresslevel=9, mtime=0) as gz:
            gz.write(data)
    print(f'{target}: {len(entries)} Wörter, {len(forms)} Formen, '
          f'{len(data) / 1e6:.1f} MB -> {os.path.getsize(target) / 1e6:.1f} MB')


def german_with_article(word, gender, pos):
    """Deutsches Nomen mit Artikel ("Kino" + n -> "das Kino"), wenn das Geschlecht eindeutig ist."""
    if pos == 'noun' and len(gender) == 1 and gender in ARTICLE and word[:1].isupper() and ' ' not in word:
        return f'{ARTICLE[gender]} {word}'
    return word


def add_gloss(entries, key, gloss, pos, gender=''):
    e = entries.setdefault(key, [[], '', ''])
    low = {g.lower() for g in e[0]}
    if gloss.lower() not in low and len(e[0]) < MAX_GLOSSES:
        e[0].append(gloss)
    if pos and pos not in e[1].split(','):
        e[1] = (e[1] + ',' + pos).strip(',')
    if gender and pos == 'noun' and gender in ('m', 'f'):
        e[2] = ''.join(sorted(set(e[2] + gender), key='mf'.index))


def merge_enwiktionary(path, lang, entries, forms, blocked):
    """Ergänzt Übersetzungen aus dem englischen Wiktionary (tools/extract-enwiktionary.py).
    en: Übersetzungstabellen Englisch -> Deutsch.
    fr: Französisch und Deutsch aus derselben Bedeutungs-Gruppe eines englischen Worts
        ("city: town or large settlement" -> fr: ville, de: Stadt)."""
    for line in open(path, encoding='utf-8'):
        r = json.loads(line)
        word, pos = r['w'], r['p']
        # Eigennamen (Christmas, Germany, London …) nur mit deutscher Übersetzung – die stehen in Vokabellisten
        if (pos in SKIP_POS and pos != 'name') or word.lower() in blocked:
            continue
        groups = {}
        for sense, lg, tr, g in r['t']:
            if len(tr.split()) > 5:
                continue
            groups.setdefault(sense, {'de': [], 'fr': []})[lg].append((tr, g))
        if lang == 'en':
            key = word.lower()
            for grp in groups.values():
                for tr, g in grp['de']:
                    add_gloss(entries, key, german_with_article(tr, g, pos), pos)
            for f in r.get('f') or []:
                if f.lower() != key:
                    forms.setdefault(f.lower(), key)
            for base in r.get('o') or []:
                if base.lower() != key:
                    forms.setdefault(key, base.lower())
        else:
            for grp in groups.values():
                if not grp['de']:
                    continue
                de = [german_with_article(tr, g, pos) for tr, g in grp['de'][:4]]
                for tr, g in grp['fr'][:4]:
                    key = tr.lower()
                    for d in de:
                        add_gloss(entries, key, d, pos, g)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    date = os.environ.get('DICT_DATE', '')
    extra = sys.argv[3] if len(sys.argv) > 3 else None
    build(sys.argv[1], 'en', date, extra)
    build(sys.argv[2], 'fr', date, extra)
