# Prüf-Wörterbücher (vendor/dict)

`en-de.json.gz` (Englisch → Deutsch) und `fr-de.json.gz` (Französisch → Deutsch) sind aus dem
**Wiktionary** gebaut (Skripte: `tools/extract-enwiktionary.py`, `tools/build-dict.py`):

- **Deutsches Wiktionary** (https://de.wiktionary.org), englische und französische Einträge mit
  deutschen Bedeutungen.
- **Englisches Wiktionary** (https://en.wiktionary.org), Übersetzungstabellen englischer Wörter ins
  Deutsche und Französische. Französisch ↔ Deutsch wird über dieselbe Bedeutung eines englischen Worts
  verknüpft.

Maschinenlesbar aufbereitet von **wiktextract** (Tatu Ylonen) und veröffentlicht auf **kaikki.org**
(https://kaikki.org), Datenstand: 30.10.2026 (en) und 1.11.2026 (de).

Urheber: die Autorinnen und Autoren des Wiktionary (siehe die Versionsgeschichte der jeweiligen Seite).

Lizenz: **Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 4.0 International
(CC BY-SA 4.0)**, https://creativecommons.org/licenses/by-sa/4.0/deed.de

Änderungen gegenüber den Quellen: Einträge ausgewählt und zusammengeführt, Dialekte, veraltete,
vulgäre und abwertende Bedeutungen entfernt, in ein kompaktes Format umgewandelt. Diese Wörterbuch-Dateien
stehen ebenfalls unter CC BY-SA 4.0.
