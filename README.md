# ✏️ Voki – Englisch- und Französisch-Vokabeln mit dem Stift

Ein Vokabeltrainer (ähnlich wie cabuu) als **Progressive Web App**: Man sieht das deutsche Wort,
schreibt das englische Wort **mit dem Stift (oder Finger)** auf die Schreibfläche, und Voki erkennt
die Handschrift und prüft, ob es richtig geschrieben ist.

## Funktionen

- **Zwei getrennte Bereiche: 🇬🇧 Englisch und 🇫🇷 Französisch** – umschaltbar oben auf der Startseite,
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
| `sw.js`, `manifest.webmanifest` | Offline-Funktion und Installierbarkeit |

Wenn du Dateien änderst, in `sw.js` die `VERSION` erhöhen, damit installierte Apps das Update laden.
