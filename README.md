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
- **Handschrifterkennung** für Apple Pencil, Android-Stift, Finger oder Maus
- **Neue Wörter einprägen**: neues Wort wird gezeigt, vorgelesen und einmal abgeschrieben
- **Fehler abschreiben**: Bei einem Fehler werden die falschen Buchstaben markiert, danach schreibt man das Wort richtig ab
- **Karteikasten** (Spaced Repetition): Wörter kommen in größer werdenden Abständen wieder
- **Test-Modus** mit allen Wörtern einer Liste, Sterne-Auswertung, „Fehler üben“
- Abfrage Deutsch ➜ Englisch, Englisch ➜ Deutsch oder gemischt
- **Handballen-Schutz**: Sobald ein Stift benutzt wird, werden Finger-Berührungen ignoriert
- Aussprache per Sprachausgabe, Tipp-Funktion (erster Buchstabe), Tastatur als Ausweichlösung
- Funktioniert **offline** (außer der Online-Handschrifterkennung), Fortschritt bleibt auf dem Gerät,
  Sicherung als Datei exportier-/importierbar

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

1. **Auf dem Gerät** (offline): die eingebaute *Handwriting Recognition API* – derzeit nur in manchen
   Chromium-Browsern (z. B. Chrome auf Android/ChromeOS).
2. **Online**: Google-Handschrifterkennung (Google Input Tools) – funktioniert überall, auch in Safari auf dem iPad.
   Dabei werden nur die Stiftstriche übertragen.

In den Einstellungen gibt es zwei Prüfstufen:
- **Streng** (Standard): Nur das, was die Erkennung als wahrscheinlichstes Wort gelesen hat, zählt –
  so werden Rechtschreibfehler zuverlässig erkannt.
- **Großzügig**: Das Wort darf auch unter den ersten 3 Vorschlägen sein (bei unordentlicher Schrift).

Falls die Schrift mal falsch gelesen wird, kann man „Ich hatte es richtig“ antippen.

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
| `sw.js`, `manifest.webmanifest` | Offline-Funktion und Installierbarkeit |

Wenn du Dateien änderst, in `sw.js` die `VERSION` und in `js/app.js` die `APP_VERSION` erhöhen. Die Versionsnummer steht unten in den Einstellungen.
