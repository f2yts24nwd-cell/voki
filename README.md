# ✏️ Voki – Lern-App für die 6. Klasse

Voki ist eine **Progressive Web App** für die 6. Klasse (Gymnasium, Baden-Württemberg) mit sechs Bereichen,
die auf der Startseite als große Kacheln zu sehen sind:

| Bereich | Inhalt |
| --- | --- |
| 🇬🇧 **Englisch** / 🇫🇷 **Französisch** | Vokabeln und Grammatik **mit dem Stift (oder Finger)** schreiben – Voki erkennt die Handschrift und prüft die Rechtschreibung. |
| 🔢 **Mathe** | „Zahlen-Expedition“ passend zum **Lambacher Schweizer 6** (BW, G9): Stationen für die Kapitel I–VII (Rationale Zahlen, Addieren und subtrahieren, Winkel, Multiplizieren und dividieren, Flächeninhalte, Dreisatz, Daten) plus „Grundwissen aus Klasse 5“. Das Kapitel, das gerade im Unterricht dran ist, ist markiert (`current: true` in `js/mathe-data.js`). |
| 🧬 **Biologie (BNT)** | „Forscher-Camp“ passend zu **Natura 5/6** (Klett, BW) und den Arbeitsblättern: Kennzeichen des Lebens, Säugetiere (Kap. 1), Vögel (Kap. 2, als „gerade dran“ markiert), Bau der Blütenpflanzen, Lebensraum Wiese, Pflanzenfamilien & Bestäuber, Samen & Früchte, Bäume bestimmen, Wirbellose Tiere (Kap. 7). |
| 🌍 **Erdkunde** | „Deutschland-Tour“ mit 9 Stationen passend zum Schulbuch-Kapitel „Wir erkunden Deutschland“: Deutschland und Baden-Württemberg auf stummen Karten, Wetter & Klima (Klimadiagramme), Ebbe & Flut, Küstenschutz, Watt & Nationalpark, Hamburger Hafen, Nutzungskonflikte & Nachhaltigkeit, Harz. |
| 🧠 **Lern-Werkstatt** | Lernmethoden mit Comics, Lexikon, Zaubersätzen und Detektiv-Fällen. |

## Mathe, Biologie und Erdkunde

- Jede **Station** hat einen aufklappbaren **Spickzettel** (Bio: Forscher-Wissen), mehrere **Level** mit je 8 Aufgaben
  und eine „Wusstest du?“-Info. In Bio gibt es zusätzlich einen **Forscher-Auftrag** zum Ausprobieren (Kresse-Labor, Flaschentaucher …).
- **Sieben Aufgabentypen** sorgen für Abwechslung: Auswahl, Ja/Nein, Zahl **mit dem Stift schreiben** (Brüche mit eigenen Feldern für
  Zähler und Nenner; umschaltbar auf eine Zahlentastatur),
  Reihenfolge, Zuordnen, Paare finden und Buchstabensalat – dazu Zeichnungen (Bruch-Kreise, Winkel, Uhr, Zahlenstrahl, Figuren, Diagramme).
- Die **Mathe-Aufgaben werden per Zufall erzeugt** – jede Runde ist anders. Nach jeder Antwort gibt es eine kurze Erklärung;
  falsch gelöste Aufgaben kommen am Ende der Runde noch einmal.
- **Motivation:** bis zu 3 Sterne pro Level, Punkte, Serien-Bonus (🔥), Tage-in-Folge, Stufen (vom „Neuling“ zur „Legende“),
  **Tages-Challenge** (6 gemischte Fragen, Bonuspunkte) und **Blitz-Mix** quer durch ein Fach.
- Die Themen orientieren sich am Bildungsplan 2016 Baden-Württemberg (Gymnasium, Klassen 5/6); die Texte und Aufgaben sind selbst geschrieben.
  Inhalte stehen in `js/mathe-data.js`, `js/bio-data.js` und `js/geo-data.js` und lassen sich dort leicht erweitern.
- **Erdkunde** hat zusätzlich **stumme Karten** von Deutschland und Baden-Württemberg (Städte, Flüsse, Gebirge antippen),
  Klimadiagramme und Gezeitenkurven zum Ablesen sowie Aufgaben zum Tidenkalender. Die Karten sind vereinfacht gezeichnet (`js/maps.js`).

## Vokabeln (Englisch und Französisch)

Man sieht das deutsche Wort, schreibt das fremdsprachige Wort mit dem Stift auf die Schreibfläche,
und Voki erkennt die Handschrift und prüft, ob es richtig geschrieben ist.

## Funktionen

- **Zwei getrennte Bereiche: 🇬🇧 Englisch und 🇫🇷 Französisch** – jeweils über eine eigene Kachel auf der Startseite,
  jeder Bereich mit eigener Farbe, eigenen Listen und eigener Wiederholung
- **Englisch Klasse 6**: 15 Wortschatz-Themen (orientiert am Bildungsplan Baden-Württemberg, ca. 320 Wörter)
- **Französisch 1. Lernjahr**: Unité 1 (Volet 1 + 2, thematischer Wortschatz), Begrüßung, Zahlen 0–20
- **Grammatik** als Lückensätze mit Merkregel (wird bei Fehlern angezeigt):
  - Englisch: Simple Past (regelmäßig + unregelmäßige Verben), Present Progressive, Steigerung, some/any, Plural
  - Französisch: être (inkl. on, vous = Sie, ils/elles), le/la/l'/les, un/une/des, c'est / ce sont, Plural, de / à / en / dans
- Französische Nomen in Farbe: männlich blau, weiblich rot (wie im Vokabelheft)
- Französisch: Akzente zählen mit (é ≠ e), beim Tippen gibt es eine Akzent-Leiste
- **Eigene Listen** für die Wörter aus dem Schulbuch (z. B. „Unit 3“) – einfach `englisch = deutsch` pro Zeile
- **📷 Vokabeln fotografieren**: Vokabelliste aus dem Buch abfotografieren, statt sie abzutippen (siehe unten)
- **Handschrifterkennung** für Apple Pencil, Android-Stift, Finger oder Maus
- **Neue Wörter einprägen**: neues Wort wird gezeigt, vorgelesen und einmal abgeschrieben
- **Fehler abschreiben**: Bei einem Fehler werden die falschen Buchstaben markiert, danach schreibt man das Wort richtig ab
- **Karteikasten** (Spaced Repetition): Wörter kommen in größer werdenden Abständen wieder
- **Test-Modus** mit allen Wörtern einer Liste, Sterne-Auswertung, „Fehler üben“
- Abfrage Deutsch ➜ Englisch, Englisch ➜ Deutsch oder gemischt
- **Handballen-Schutz**: Sobald ein Stift benutzt wird, werden Finger-Berührungen ignoriert
- Aussprache per Sprachausgabe, Tipp-Funktion (erster Buchstabe), Tastatur als Ausweichlösung
- Funktioniert komplett **offline**, der Fortschritt bleibt nur auf dem Gerät

## 🧠 Lern-Werkstatt („Lernen lernen“)

Dritter Reiter neben Englisch und Französisch: Lernmethoden kindgerecht erklärt, mit Comics
(Elara, Schaf Flocke und Alpaka Paco), Lexikon, Challenges und Stickern.

- **🪜 Die Lern-Leiter**: 17 Lernmethoden in 6 Stufen von „weniger“ bis „sehr effektiv“ – jede mit
  „Was ist das?“, „So geht’s“, Beispielen aus verschiedenen Fächern, „Warum wirkt das?“ und einer Challenge
- **🔤 Vokabel-Profi**: die 4 Etappen Erarbeitung, Automatisierung, Testen, Wiederholen + Profi-Tipps,
  mit Sprung in die passende Voki-Übung
- **🔍 Aufgaben-Detektiv**: die 5 Schritte, um Aufgabenstellungen zu verstehen, und 9 interaktive
  Fälle (Mathe, Deutsch, Bio, Erdkunde, Englisch, Französisch, Naturphänomene): leise lesen, laut lesen,
  rückwärts lesen, Schlüsselwörter antippen, erklären – plus Operatoren-Übersicht
- **💪 Kopf-Power**: „Dein Gehirn ist ein Muskel“ und 17 Zaubersätze zum Umdrehen, Zaubersatz des Tages
- **📖 Lern-Lexikon**: Mindmap, Eselsbrücke, Mnemotechnik, Brain Dump, Operatoren … – Begriffe im Text
  sind antippbar
- **🏅 Sticker-Album**: „Hab ich ausprobiert“ bei jeder Challenge, Sticker für gelöste Fälle

Die Ideen stammen von Arbeitsblättern von Caroline von St. Ange („learn learning with Caroline“) und sind
in eigenen Worten und mit eigenen Zeichnungen umgesetzt.

## Handschrifterkennung

Die Handschrift wird **nur auf dem Gerät** erkannt – Voki schickt nichts ins Internet.

1. **Stift-Fläche**: die eingebaute *Handwriting Recognition API* des Browsers – derzeit in manchen
   Chromium-Browsern (z. B. Chrome auf Android/ChromeOS). Man schreibt auf die Zeichenfläche.
2. **Schreibfeld auf dem iPad**: Hier gibt es diese Schnittstelle nicht. Stattdessen zeigt Voki ein großes Schreibfeld,
   in das man mit dem **Apple Pencil** schreibt; iPadOS erkennt die Schrift selbst auf dem iPad
   (Funktion „Handschrift“/Scribble, einschalten unter *Einstellungen ➜ Apple Pencil*).
3. Auf allen anderen Geräten wird **getippt**.

In den Einstellungen gibt es zwei Prüfstufen:
- **Streng** (Standard): Nur das, was die Erkennung als wahrscheinlichstes Wort gelesen hat, zählt –
  so werden Rechtschreibfehler zuverlässig erkannt.
- **Großzügig**: Das Wort darf auch unter den ersten 3 Vorschlägen sein (bei unordentlicher Schrift).

Falls die Schrift mal falsch gelesen wird, kann man „Ich hatte es richtig“ antippen.

## 📷 Vokabeln fotografieren

Unter *Neue Liste* (oder *Liste bearbeiten*) gibt es den Knopf **„Vokabeln aus dem Buch fotografieren“**:

1. Foto aufnehmen (oder aus den Fotos wählen) – auf dem iPad öffnet sich direkt die Kamera.
2. Rahmen an den Ecken auf die Vokabelliste ziehen, bei Bedarf **drehen**.
3. **Text erkennen** – Voki liest die Seite und baut daraus eine Tabelle.
4. Prüfen: Zu jedem Eintrag wird der passende Streifen aus dem Foto angezeigt; schwer lesbare Felder sind gelb.
   Zeilen lassen sich korrigieren, löschen, mit der Zeile darüber verbinden oder neu hinzufügen.
   Bei Büchern mit drei Spalten (Wort · Beispielsatz · Deutsch) kann man unter „Spalten zuordnen“ wählen,
   welche Spalte was ist – der Beispielsatz kann als Hinweis mitgenommen werden.
5. **Übernehmen** – die Wörter landen im Wörterfeld (`fremdsprache = deutsch`) und können noch bearbeitet werden.

**Technik:** Die Texterkennung ist [Tesseract.js](https://github.com/naptha/tesseract.js) 6.0.1 (Apache-2.0-Lizenz,
WebAssembly). Sie liegt komplett in `vendor/tesseract/` und läuft **nur auf dem Gerät** – das Foto wird nirgendwohin
geschickt, es gibt keinen Server, kein Konto und keine Lizenzkosten.

- Sprachdaten: `eng`, `fra`, `deu` (Variante *best_int*), erkannt wird immer zusammen mit Deutsch (`deu+eng` bzw. `deu+fra`),
  damit Umlaute und Akzente stimmen.
- Beim ersten Benutzen werden ca. 5 MB geladen (Programm + zwei Sprachen), der Service Worker speichert sie in einem
  eigenen Speicher (`voki-ocr-1`). Danach geht es auch offline. Wer die Erkennung nie benutzt, lädt nichts davon.
- Vorbereitung des Bildes (`prepare` in `js/photo-import.js`): Graustufen über den dunkelsten Farbkanal (rote Artikel
  und blaue Bedeutungen werden kräftig, farbig hinterlegte Spalten hell), Kontrast strecken, auf ca. 2400 px vergrößern
  und die **Tabellenlinien entfernen** – sie berühren bei schrägen Fotos die Buchstaben (aus „le“ wird sonst „je“).
  Tesseract läuft mit Seitenmodus 4 und Sauvola-Schwellenwert (kommt mit Schatten zurecht).
- `js/ocr-table.js` macht daraus die Tabelle:
  - **Spalten** über Häufungen gleicher Wortanfänge (die Spalten im Vokabelteil sind linksbündig),
  - **Zeilen** je Spalte und dann ein **Abgleich der Spalten der Reihe nach** (wie beim Vergleichen zweier Listen,
    mit geschätztem Höhenversatz) – so passt die Zuordnung auch bei gewölbten oder schräg fotografierten Seiten,
  - Krümel (Linienreste) werden über die Erkennungs-Sicherheit aussortiert,
  - Säubern: Lautschrift `[…]`, Grammatik-Kürzel (`m.`, `adj.`, `fam.`, `(pl)` …) und Randnummern weg,
    „ja ville [lavil]“ ➜ „la ville“ (Lautschrift beginnt mit „l“), umgebrochene Bedeutungen an den Eintrag darüber.
- Getestet mit Fotos aus *Découvertes* und *Green Line*: Eine gerade fotografierte Einzelseite wird fast vollständig
  richtig gelesen; einzelne Fehler (fehlendes Leerzeichen, falscher Buchstabe) korrigiert man in der Prüf-Tabelle.
  Stark gewölbte Seitenbereiche und ganze Doppelseiten gehen deutlich schlechter.
- Tesseract.js aktualisieren: Dateien aus den npm-Paketen `tesseract.js` (`dist/tesseract.esm.min.js`, `dist/worker.min.js`),
  `tesseract.js-core` (`tesseract-core-simd-lstm.*`, `tesseract-core-lstm.*`) und `@tesseract.js-data/<sprache>`
  (`4.0.0_best_int/*.traineddata.gz`) kopieren und `OCR_CACHE` in `sw.js` erhöhen.

## 🔍 Wörter prüfen (Wörterbuch)

Nach dem Fotografieren – und im Listen-Editor über **„🔍 Wörter prüfen“** auch für abgetippte Listen – vergleicht Voki
jeden Eintrag mit einem offenen Wörterbuch:

| Prüfung | Beispiel |
| --- | --- |
| Rechtschreibung Fremdsprache | „hospitl“ ➜ „hospital“, „le cinema“ ➜ „le cinéma“, „lethéâtre“ ➜ „le théâtre“ |
| Übersetzung | passt „schön“ zu „beautiful“? Sonst: „Das Wörterbuch kennt andere Bedeutungen: …“ |
| Rechtschreibung Deutsch | „schon“ ➜ „schön“, „gefahrlich“ ➜ „gefährlich“, „Backerei“ ➜ „Bäckerei“ |
| Artikel | „le ville“ ➜ „la ville“ (Geschlecht), „der Kino“ ➜ „das Kino“ |

Jede Zeile bekommt ✓ (passt), ⚠️ (bitte prüfen, mit Vorschlag zum Antippen), ℹ️ (das Buch übersetzt anders als das
Wörterbuch – das ist oft in Ordnung) oder ? (nicht im Wörterbuch). Das Buch hat immer recht: Die Prüfung macht nur
Vorschläge.

**Quelle:** Wiktionary – deutsches Wiktionary (deutsche Bedeutungen englischer und französischer Wörter) und
englisches Wiktionary (Übersetzungstabellen; Französisch ↔ Deutsch über dieselbe englische Bedeutung), aufbereitet von
wiktextract/kaikki.org. Lizenz **CC BY-SA 4.0**, Details in `vendor/dict/LICENSE.md`. Dialekte, veraltete, vulgäre und
abwertende Einträge sind herausgefiltert.

- Englisch: ca. 69 000 Wörter (2,1 MB), Französisch: ca. 62 000 Wörter (1,3 MB) – werden erst beim ersten Prüfen
  geladen und vom Service Worker gespeichert, danach offline.
- An den eingebauten Voki-Listen gemessen: 306 von 321 englischen und 89 von 112 französischen Einträgen „passen“,
  nur 1 Fehlalarm (⚠️ bei einem richtigen Wort); der Rest ist ℹ️/?, z. B. freie Übersetzungen wie „flat = Wohnung“.
- Neu bauen (z. B. mit neueren Wiktionary-Daten):
  ```bash
  curl -O https://kaikki.org/dewiktionary/Englisch/kaikki.org-dictionary-Englisch.jsonl
  curl -O https://kaikki.org/dewiktionary/Franz%C3%B6sisch/kaikki.org-dictionary-Franz%C3%B6sisch.jsonl
  curl -sS https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz \
    | gunzip | python3 -I tools/extract-enwiktionary.py > enwikt-de-fr.jsonl     # ca. 530 MB, gestreamt
  python3 -I tools/build-dict.py kaikki.org-dictionary-Englisch.jsonl \
    kaikki.org-dictionary-Französisch.jsonl enwikt-de-fr.jsonl
  ```
  Danach `OCR_CACHE` in `sw.js` erhöhen.

## Starten

Es gibt keinen Build-Schritt – es sind nur statische Dateien.

**Lokal:**
```bash
npx http-server -c-1 .
# dann http://localhost:8080 öffnen
```

**Im Internet über GitHub Pages:** Im Repository unter *Settings ➜ Pages* als Quelle
„Deploy from a branch“, Branch `main`, Ordner `/ (root)` wählen. Nach kurzer Zeit ist die App unter
`https://<benutzername>.github.io/voki/` erreichbar.

**Als App installieren:**
- iPad/iPhone (Safari): *Teilen* ➜ *Zum Home-Bildschirm*
- Android/Chrome/Edge: Menü ➜ *App installieren* (oder der Button auf der Startseite)

## Dateien

| Datei | Inhalt |
| --- | --- |
| `index.html`, `styles.css` | Seite und Design |
| `js/app.js` | Bildschirme, Lernablauf |
| `js/pad.js` | Schreibfläche (Pointer Events, Stift/Finger) |
| `js/recognizer.js` | Handschrifterkennung |
| `js/check.js` | Vergleich Antwort ↔ Lösung, Fehlermarkierung |
| `js/store.js` | Speicherung, Karteikasten, eigene Listen |
| `js/vocab.js` | Englische Wortlisten, Sprachen, Zusammenführung aller Listen |
| `js/vocab-fr.js` | Französische Wortlisten |
| `js/grammar.js` | Grammatik-Übungen (Englisch und Französisch) |
| `js/fach.js` | Fach-Seiten für Mathe und Bio (Stationen, Level, Tages-Challenge) |
| `js/quiz.js` | Quiz-Maschine mit allen Aufgabentypen |
| `js/figures.js` | Zeichnungen für Mathe-Aufgaben (SVG) |
| `js/mathe-data.js` | Mathe-Themen, Spickzettel und Aufgaben-Generatoren |
| `js/bio-data.js` | Bio-Themen, Forscher-Wissen, Fragen und Forscher-Aufträge |
| `js/geo-data.js` | Erdkunde-Themen, Fragen, Karten- und Diagramm-Aufgaben |
| `js/maps.js` | Stumme Karten, Klimadiagramm und Gezeitenkurve (SVG) |
| `js/photo-import.js` | Vokabeln fotografieren: Foto, Zuschneiden, Texterkennung, Prüf-Tabelle |
| `js/ocr-table.js` | Erkannte Wörter ➜ Zeilen, Spalten und Vokabel-Einträge |
| `js/vocab-check.js` | Wörter gegen das Wörterbuch prüfen (Rechtschreibung, Übersetzung, Artikel) |
| `vendor/tesseract/` | Texterkennung Tesseract.js (Apache-2.0, siehe `LICENSE` dort) mit Sprachdaten |
| `vendor/dict/` | Prüf-Wörterbücher aus dem Wiktionary (CC BY-SA 4.0, siehe `LICENSE.md` dort) |
| `tools/` | Skripte zum Bauen der Wörterbücher |
| `sw.js`, `manifest.webmanifest` | Offline-Funktion und Installierbarkeit |

Wenn du Dateien änderst, in `sw.js` die `VERSION` und in `js/app.js` die `APP_VERSION` erhöhen. Die Versionsnummer steht unten in den Einstellungen.
