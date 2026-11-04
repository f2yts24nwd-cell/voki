// Inhalte der Lern-Werkstatt ("Lernen lernen").
// Ideen nach den Arbeitsblättern von Caroline von St. Ange ("learn learning with Caroline"),
// in eigenen Worten und mit eigenen Beispielen für die 6. Klasse umgesetzt.
//
// Textformat: **fett**, [[Begriff]] verlinkt ins Lexikon (Begriff oder Synonym aus GLOSSARY).

export const SUBJECTS = {
  mathe: { name: 'Mathe', emoji: '📐' },
  deutsch: { name: 'Deutsch', emoji: '📖' },
  englisch: { name: 'Englisch', emoji: '🇬🇧' },
  franz: { name: 'Französisch', emoji: '🇫🇷' },
  bio: { name: 'Bio', emoji: '🌿' },
  erdkunde: { name: 'Erdkunde', emoji: '🌍' },
  geschichte: { name: 'Geschichte', emoji: '🏛️' },
  physik: { name: 'Naturphänomene', emoji: '🔬' },
  musik: { name: 'Musik', emoji: '🎵' },
  alle: { name: 'Alle Fächer', emoji: '🎒' },
};

// ---------- Inseln ----------

export const ISLANDS = [
  {
    id: 'leiter', emoji: '🪜', title: 'Die Lern-Leiter', color: '#f59e0b',
    subtitle: '17 Lernmethoden – welche bringen am meisten?',
    comic: [
      { bg: 'room', cast: [['elara', 'left', 'happy', 'hold']], props: [['book', 50, 104, 1.1]], say: [['left', 'Morgen ist der Bio-Test. Ich schau mir einfach alles nochmal an!']], caption: 'Am Abend vor dem Test …' },
      { bg: 'school', cast: [['elara', 'center', 'confused', 'think']], props: [['test', 168, 120, 1.1], ['question', 150, 50]], say: [['center', 'Hä? Das hab ich doch gelesen … aber ich weiß es nicht mehr!', 'think']], caption: 'Am nächsten Tag …' },
      { bg: 'room', cast: [['elara', 'left', 'thinking', 'think'], ['alpaca', 'right', 'happy']], say: [['right', 'Anschauen fühlt sich nach Lernen an. Aber dein Gehirn muss **selbst arbeiten**, damit etwas hängen bleibt.']] },
      { bg: 'outside', cast: [['alpaca', 'left', 'proud'], ['sheep', 'right', 'excited']], props: [['ladder', 120, 136, 1.2, '', 'back']], say: [['left', 'Je höher auf der Lern-Leiter, desto mehr arbeitet dein Kopf.'], ['right', 'Ich klettere ganz nach oben! Mäh!']] },
    ],
  },
  {
    id: 'vokabeln', emoji: '🔤', title: 'Vokabel-Profi', color: '#10b981',
    subtitle: 'In 4 Etappen Vokabeln dauerhaft lernen',
    comic: [
      { bg: 'room', cast: [['sheep', 'center', 'sad']], props: [['list', 70, 136, 1.1], ['sweat', 160, 80]], say: [['center', '35 Vokabeln bis Freitag! Das schaff ich nie!']] },
      { bg: 'room', cast: [['sheep', 'left', 'surprised'], ['alpaca', 'right', 'happy']], say: [['right', 'Doch! Und zwar in **4 Etappen** – wie die Level in einem Videospiel.']] },
      { bg: 'room', cast: [['elara', 'center', 'excited', 'point']], props: [['blocks', 190, 136], ['note', 200, 60, 1, 'love']], say: [['center', 'Kennenlernen, üben, testen, wiederholen!']] },
      { bg: 'outside', cast: [['sheep', 'left', 'excited'], ['elara', 'right', 'happy', 'cheer']], props: [['trophy', 120, 136]], say: [['left', 'Level 4 – ich komme!']] },
    ],
  },
  {
    id: 'detektiv', emoji: '🔍', title: 'Aufgaben-Detektiv', color: '#3b82f6',
    subtitle: 'Aufgaben verstehen in 5 Schritten',
  },
  {
    id: 'kopf', emoji: '💪', title: 'Kopf-Power', color: '#ec4899',
    subtitle: '17 Zaubersätze, wenn es schwer wird',
  },
];

// ---------- Die Lern-Leiter: 17 Methoden in 6 Stufen ----------

export const LADDER = [
  { level: 1, title: 'Lesen & Markieren', note: 'Guter Anfang – aber nur der Anfang.' },
  { level: 2, title: 'Hören & Sehen', note: 'Mehrere Sinne helfen mit.' },
  { level: 3, title: 'Ordnen & Abfragen', note: 'Jetzt wird es richtig gut!' },
  { level: 4, title: 'Gemeinsam & mit Tricks', note: 'Reden, Merk-Tricks, Bewegung.' },
  { level: 5, title: 'Aus dem Kopf holen', note: 'Profi-Methoden!' },
  { level: 6, title: 'Selbst testen', note: 'Die stärksten Methoden überhaupt.' },
];

export const METHODS = [
  {
    id: 'textmarker', island: 'leiter', level: 1, emoji: '🖍️',
    title: 'Mit Textmarker lesen',
    short: 'Wichtige Wörter im Text markieren',
    was: 'Du liest einen Text und markierst die wichtigsten Wörter – die [[Schlüsselwörter]].',
    schritte: [
      'Lies den Text erst einmal ganz – **ohne** zu markieren.',
      'Beim zweiten Lesen markierst du nur das Wichtigste: **höchstens 3 Wörter pro Absatz!**',
      'Klappe das Buch zu: Kannst du nur mit den markierten Wörtern erzählen, worum es geht?',
    ],
    beispiele: [
      ['bio', 'Im Text über Pflanzen markierst du nur „Blätter“, „Sonnenlicht“ und „Sauerstoff“.'],
      ['geschichte', 'Bei einem Text über die Steinzeit: „Jäger“, „Sammler“, „Feuer“.'],
    ],
    warum: 'Markieren hilft dir, das Wichtige zu finden. Aber Achtung: Wenn alles gelb ist, ist nichts mehr wichtig. Und nur weil etwas markiert ist, ist es noch nicht in deinem Kopf – deshalb steht diese Methode ganz unten auf der Leiter.',
    challenge: '**3-Wörter-Challenge:** Markiere in einem Absatz aus deinem Schulbuch nur 3 Wörter. Klappe das Buch zu und erkläre den Absatz nur mit diesen 3 Wörtern.',
  },
  {
    id: 'bilder', island: 'leiter', level: 1, emoji: '✏️',
    title: 'Kleine Bilder malen',
    short: 'Neben wichtige Begriffe Mini-Bilder malen',
    was: 'Neben ein wichtiges Wort malst du ein winziges Bild – eine Mini-Skizze. Kunst ist egal, nur DU musst es erkennen.',
    schritte: [
      'Suche die wichtigen Begriffe auf deiner Seite.',
      'Male neben jeden Begriff ein schnelles Bild – in höchstens 10 Sekunden.',
      'Später deckst du die Wörter ab: Weißt du beim Bild noch, welcher Begriff dazu gehört?',
    ],
    beispiele: [
      ['erdkunde', 'Neben „Delta“ malst du einen Fluss, der sich in viele kleine Arme aufteilt.'],
      ['englisch', 'Neben „umbrella“ einen Regenschirm, neben „cloudy“ eine Wolke.'],
    ],
    warum: 'Dein Gehirn merkt sich Bilder leichter als Wörter. Wort + Bild = zwei Wege zur gleichen Erinnerung.',
    challenge: 'Male zu 5 Wörtern aus deiner Vokabelliste je ein Mini-Bild. Lass jemanden aus deiner Familie raten, welches Wort gemeint ist.',
  },
  {
    id: 'notizen', island: 'leiter', level: 1, emoji: '📝',
    title: 'Notizen machen',
    short: 'Am Rand oder im Heft in eigenen Worten notieren',
    was: 'Du schreibst am Rand eines Textes oder in dein Heft, was wichtig ist – und zwar **in eigenen Worten**, nicht abgeschrieben.',
    schritte: [
      'Lies einen Abschnitt.',
      'Leg das Buch kurz weg.',
      'Schreibe in eigenen Worten 1–2 Sätze oder Stichwörter auf.',
      'Mach ein **?** an den Rand, wo du etwas nicht verstehst – das fragst du später nach.',
    ],
    beispiele: [
      ['geschichte', 'Neben einen Text über die Römer: „Römer bauen Straßen → Soldaten kommen schneller überall hin“.'],
      ['physik', 'Nach einem Versuch: „Warmes Wasser steigt nach oben, kaltes sinkt.“'],
    ],
    warum: 'Wenn du etwas in eigene Worte packst, musst du es verstehen. Abschreiben geht dagegen auch ganz ohne Nachdenken.',
    challenge: 'Fasse heute einen Text aus einem Fach in **einem einzigen Satz** zusammen – höchstens 15 Wörter!',
  },
  {
    id: 'videos', island: 'leiter', level: 2, emoji: '📺',
    title: 'Erklärvideos schauen',
    short: 'Ein Video zum Thema anschauen',
    was: 'Du schaust ein Erklärvideo zu deinem Thema, z. B. auf YouTube. Such dir mit deinen Eltern gute Lernkanäle aus.',
    schritte: [
      'Such ein kurzes Video zu genau deinem Thema.',
      'Schreibe beim Schauen 3 Stichwörter auf.',
      'Video aus! Erkläre jetzt in eigenen Worten, was du gelernt hast.',
    ],
    beispiele: [
      ['mathe', 'Du hast Brüche in der Schule nicht verstanden? Ein Video erklärt es nochmal anders – vielleicht klickt es dann.'],
      ['bio', 'Ein Video zeigt, wie ein Vogel fliegt – das ist anschaulicher als jedes Bild im Buch.'],
    ],
    warum: 'Videos erklären oft sehr anschaulich. Aber Zuschauen ist bequem – dein Gehirn lehnt sich zurück wie auf dem Sofa. Erst wenn du danach **selbst** erklärst, wird daraus richtiges Lernen.',
    challenge: 'Schau ein kurzes Erklärvideo. Schreibe danach aus dem Kopf 3 Dinge auf, die du gelernt hast.',
  },
  {
    id: 'vorlesen', island: 'leiter', level: 2, emoji: '🎤',
    title: 'Laut vorlesen wie ein Redner',
    short: 'Texte laut vortragen',
    was: 'Du liest deinen Lernstoff laut vor – so, als würdest du eine Rede halten oder die Nachrichten sprechen.',
    schritte: [
      'Steh auf – Redner stehen!',
      'Lies den Text laut und mit Betonung.',
      'Wichtige Wörter sagst du extra laut und langsam.',
    ],
    beispiele: [
      ['deutsch', 'Ein Gedicht laut vortragen, bevor du es auswendig lernst.'],
      ['englisch', 'Den Lektionstext laut lesen – so übst du gleich die Aussprache.'],
    ],
    warum: 'Du liest, sprichst und hörst gleichzeitig. Drei Sinne arbeiten zusammen – das merkt sich besser als nur leise lesen.',
    challenge: 'Lies einen Lerntext vor wie ein Fußball-Kommentator: „Und jetzt … die FOTOSYNTHESE! Unglaublich!“',
  },
  {
    id: 'aufnehmen', island: 'leiter', level: 2, emoji: '📱',
    title: 'Aufnehmen und anhören',
    short: 'Sich selbst aufnehmen und nebenbei anhören',
    was: 'Du nimmst dich beim Vorlesen mit dem Handy auf. Später hörst du dir die Aufnahme an – beim Spielen, Malen, Basteln oder Zähneputzen.',
    schritte: [
      'Sprachaufnahme am Handy oder Tablet starten.',
      'Langsam und deutlich vorlesen.',
      'Die Aufnahme immer wieder anhören, während du etwas mit den Händen machst.',
    ],
    beispiele: [
      ['englisch', 'Vokabeln aufsprechen: „the weather – das Wetter … the cloud – die Wolke …“'],
      ['erdkunde', 'Die Bundesländer mit Hauptstädten aufsprechen.'],
    ],
    warum: 'Du hörst den Stoff ganz oft – ohne Extra-Zeit. Und deine eigene Stimme merkt sich dein Gehirn besonders gut.',
    challenge: 'Nimm 10 Vokabeln auf und hör sie dir 3 Tage lang beim Zähneputzen an. Wie viele kannst du danach?',
  },
  {
    id: 'mindmap', island: 'leiter', level: 3, emoji: '🗺️',
    title: 'Eine Mindmap erstellen',
    short: 'Eine Gedanken-Landkarte zeichnen',
    was: 'Eine [[Mindmap]] ist eine Gedanken-Landkarte: Das Thema steht in der Mitte, und alles, was dazu gehört, wächst wie Äste drumherum.',
    schritte: [
      'Nimm ein Blatt quer. Schreib das Thema in die Mitte und kreise es ein.',
      'Zeichne dicke **Hauptäste** für die großen Unterthemen.',
      'An die Hauptäste kommen dünne **Zweige** mit Einzelheiten.',
      'Nur Stichwörter, keine ganzen Sätze! Farben und kleine Bilder helfen.',
    ],
    beispiele: [
      ['bio', '„Der Hund“ in der Mitte. Äste: Körperbau, Ernährung, Sinne, Verhalten. Am Ast „Sinne“: riecht super, hört hohe Töne.'],
      ['erdkunde', '„Deutschland“ in der Mitte. Äste: Flüsse, Gebirge, Städte, Nachbarländer.'],
      ['englisch', '„Weather“ in der Mitte. Äste: sunny, rainy, windy … mit kleinen Bildern.'],
    ],
    warum: 'Dein Gehirn speichert Wissen wie ein Netz. Eine Mindmap sieht genauso aus – du siehst auf einen Blick, was zusammengehört.',
    challenge: 'Mach eine Mindmap über DICH: Hobbys, Familie, Lieblingsessen, Schule. Danach eine zu deinem aktuellen Thema in Bio oder Erdkunde.',
    comic: [
      { bg: 'room', cast: [['elara', 'left', 'sad', 'shrug']], props: [['messy', 150, 136, 1.3]], say: [['left', 'Mein Erdkunde-Heft ist ein einziges Durcheinander!']] },
      { bg: 'room', cast: [['alpaca', 'left', 'happy']], props: [['mindmap', 170, 110, 1.4]], say: [['left', 'Mach eine **Mindmap**! Das Thema kommt in die Mitte.']] },
      { bg: 'room', cast: [['sheep', 'center', 'excited']], props: [['mindmap', 60, 70, 1.1]], say: [['center', 'Und dann wachsen Äste – wie bei einem Baum! Oder bei meiner Wolle!']] },
      { bg: 'room', cast: [['elara', 'right', 'excited', 'cheer']], props: [['mindmap', 60, 110, 1.4], ['stars', 130, 40]], say: [['right', 'Jetzt sehe ich alles auf einen Blick!']] },
    ],
  },
  {
    id: 'karteikarten', island: 'leiter', level: 3, emoji: '🗂️',
    title: 'Karteikarten schreiben',
    short: 'Vorne die Frage, hinten die Antwort',
    was: '[[Karteikarten]] sind kleine Kärtchen: vorne steht eine Frage oder ein Wort, hinten die Antwort. Das geht auf Papier oder digital in einer App.',
    schritte: [
      'Vorne: Frage oder Wort. Hinten: Antwort.',
      'Pro Karte nur **eine** Sache.',
      'Kurz und deutlich schreiben – keine Romane.',
    ],
    beispiele: [
      ['mathe', 'Vorne: „Wie berechnet man den Flächeninhalt eines Rechtecks?“ – Hinten: „Länge · Breite“.'],
      ['erdkunde', 'Vorne: „Hauptstadt von Baden-Württemberg?“ – Hinten: „Stuttgart“.'],
    ],
    warum: 'Beim Schreiben überlegst du, was wichtig ist. So richtig stark werden Karteikarten aber erst, wenn du dich damit **abfragst** – das ist die nächste Methode.',
    challenge: 'Schreib 10 Karteikarten zu deinem nächsten Test-Thema.',
  },
  {
    id: 'kartei-abfragen', island: 'leiter', level: 3, emoji: '🔁',
    title: 'Eine Woche täglich abfragen',
    short: 'Mit Karteikarten jeden Tag ein bisschen',
    was: 'Du fragst dich mit deinen Karteikarten **jeden Tag** ab – mindestens eine Woche lang. Gewusste Karten wandern im [[Karteikasten]] ein Fach weiter, schwere bleiben vorne.',
    schritte: [
      'Karte anschauen und die Antwort **im Kopf** sagen.',
      'Umdrehen und prüfen.',
      'Gewusst → ein Fach weiter. Nicht gewusst → zurück ins erste Fach.',
      'Jeden Tag nur 5–10 Minuten.',
    ],
    beispiele: [
      ['englisch', 'Voki macht das automatisch: Der Karteikasten fragt Wörter in immer größeren Abständen wieder ab.'],
      ['bio', 'Karten mit den Teilen einer Blüte – jeden Abend 5 Minuten auf der Bettkante.'],
    ],
    warum: 'Jedes Mal, wenn du etwas aus dem Kopf holst, wird der Weg dorthin breiter – wie ein Trampelpfad im Wald. Das nennt man [[Wiederholen mit Abstand]].',
    challenge: '**7-Tage-Challenge:** Frag dich eine Woche lang jeden Tag 5 Minuten ab. Mach jeden Tag ein Kreuz in den Kalender!',
    link: { href: '#/', label: '🔁 Voki-Karteikasten öffnen' },
    comic: [
      { bg: 'night', cast: [['sheep', 'center', 'tired']], props: [['cards', 60, 136, 1.3], ['sweat', 160, 80], ['zzz', 168, 60]], say: [['center', 'Ich lerne alle 50 Karten am Sonntag vor dem Test …']] },
      { bg: 'room', cast: [['alpaca', 'left', 'happy']], props: [['calendar', 180, 110, 1.4]], say: [['left', 'Besser: **jeden Tag ein bisschen**. Dein Gehirn liebt kleine Häppchen.']] },
      { bg: 'room', cast: [['elara', 'center', 'happy', 'hold']], props: [['cards', 120, 108], ['clock', 200, 60]], say: [['center', 'Montag … Dienstag … Mittwoch … immer nur 5 Minuten!']] },
      { bg: 'outside', cast: [['elara', 'left', 'excited', 'cheer'], ['sheep', 'right', 'excited']], props: [['trophy', 120, 136]], say: [['right', 'Am Test-Tag wussten wir alles!']] },
    ],
  },
  {
    id: 'kleingruppe', island: 'leiter', level: 4, emoji: '👥',
    title: 'In Kleingruppen lernen',
    short: 'Mit anderen den Stoff durchsprechen',
    was: '2 bis 4 Kinder lernen zusammen und sprechen über den Stoff. Das geht am Küchentisch oder auch per Videoanruf.',
    schritte: [
      'Verabredet euch und legt das Thema fest.',
      'Jeder bereitet **3 Fragen** vor.',
      'Abwechselnd fragen, antworten und erklären.',
      'Handys weg – beim Thema bleiben!',
    ],
    beispiele: [
      ['geschichte', 'Jeder erklärt den anderen eine Seite aus dem Buch.'],
      ['franz', 'Ihr fragt euch gegenseitig die Formen von „être“ ab.'],
    ],
    warum: 'Wenn du redest und zuhörst, denkst du mit. Und andere Kinder erklären manchmal besser als jedes Buch.',
    challenge: 'Verabrede dich mit einem Freund oder einer Freundin: Stellt euch gegenseitig 5 Fragen zum nächsten Test.',
  },
  {
    id: 'eselsbruecke', island: 'leiter', level: 4, emoji: '🫏',
    title: 'Eselsbrücken ausdenken',
    short: 'Merk-Tricks mit Reimen, Sätzen und Bildern',
    was: 'Eine [[Eselsbrücke]] ist ein Merk-Trick: ein Satz, ein Reim oder ein verrücktes Bild, das dir hilft, dir etwas Schweres zu merken.',
    schritte: [
      'Was kannst du dir einfach nicht merken?',
      'Suche etwas, das ähnlich **klingt** oder **aussieht**.',
      'Mach daraus einen lustigen Satz, Reim oder ein Bild im Kopf.',
      'Je verrückter, desto besser!',
    ],
    beispiele: [
      ['erdkunde', 'Himmelsrichtungen im Uhrzeigersinn: **N**ie **O**hne **S**eife **W**aschen = Nord, Ost, Süd, West.'],
      ['deutsch', '„Wer nämlich mit h schreibt, ist dämlich.“'],
      ['englisch', '„eye“ klingt wie „Ei“ – stell dir ein Gesicht mit zwei Eiern statt Augen vor!'],
    ],
    warum: 'Dein Gehirn merkt sich Lustiges, Komisches und Bilder viel besser als trockene Fakten.',
    challenge: 'Erfinde eine Eselsbrücke für ein Wort oder eine Regel, die du dir nie merken kannst. Erzähl sie beim Abendessen!',
    comic: [
      { bg: 'outside', cast: [['elara', 'center', 'confused', 'think']], props: [['compass', 200, 70, 1.2], ['question', 50, 40]], say: [['center', 'Nord, Ost, Süd, West … in welcher Reihenfolge?!']] },
      { bg: 'outside', cast: [['sheep', 'center', 'excited']], props: [['soap', 190, 136, 1.4]], say: [['center', '**N**ie **O**hne **S**eife **W**aschen!']] },
      { bg: 'outside', cast: [['alpaca', 'left', 'proud']], props: [['compass', 180, 70, 1.2]], say: [['left', 'Genau! Die Anfangsbuchstaben: N – O – S – W. Das ist eine **Eselsbrücke**.']] },
      { bg: 'outside', cast: [['elara', 'left', 'happy', 'point'], ['sheep', 'right', 'surprised']], props: [['sweat', 210, 80]], say: [['left', 'Und weil Flocke so ungern badet, vergesse ich das nie!']] },
    ],
  },
  {
    id: 'bewegung', island: 'leiter', level: 4, emoji: '🏃',
    title: 'Lernen in Bewegung',
    short: 'Beim Laufen, Wippen oder Hüpfen lernen',
    was: 'Du lernst, während du dich bewegst: auf einem Gymnastikball wippen, um den Tisch laufen, auf dem Trampolin hüpfen.',
    schritte: [
      'Lernzettel in die Hand.',
      'Bewegung starten: laufen, wippen oder hüpfen.',
      'Bei jedem Schritt oder Hüpfer sagst du ein Wort oder einen Teil.',
    ],
    beispiele: [
      ['englisch', 'Bei jedem Hüpfer eine Vokabel.'],
      ['mathe', 'Einmaleins auf der Treppe – jede Stufe eine Aufgabe.'],
      ['musik', 'Einen Liedtext im Takt beim Laufen lernen.'],
    ],
    warum: 'Bewegung macht dein Gehirn wach, und der Rhythmus hilft beim Merken. Außerdem ist Stillsitzen auf Dauer anstrengend!',
    challenge: 'Lerne ein kurzes Gedicht oder 10 Vokabeln, während du um den Tisch läufst. Klappt es danach auch im Sitzen?',
  },
  {
    id: 'braindump', island: 'leiter', level: 5, emoji: '🧠',
    title: 'Brain Dump',
    short: 'Alles aus dem Kopf aufs Papier kippen',
    was: '[[Brain Dump]] ist Englisch und heißt „Gehirn auskippen“: Du schreibst **alles**, was du zu einem Thema weißt, auf ein leeres Blatt – ohne nachzuschauen.',
    schritte: [
      'Leeres Blatt, Buch zu!',
      '5 Minuten: Schreib alles auf, was dir einfällt.',
      'Blatt weglegen. Lies den Text im Buch nochmal.',
      'Buch zu, neues Blatt: Schreib wieder alles auf. Was ist neu dazugekommen?',
    ],
    beispiele: [
      ['bio', '„Alles, was ich über Vögel weiß“: Federn, Schnabel, Eier, Zugvögel …'],
      ['geschichte', '„Alles über die Ägypter“: Pyramiden, Pharao, Nil, Hieroglyphen …'],
    ],
    warum: 'Wenn du etwas ohne Hilfe aus dem Kopf holst, trainierst du genau das, was du im Test brauchst. Und du siehst sofort, wo deine Lücken sind.',
    challenge: '**Brain-Dump-Duell:** Mach einen Brain Dump vor und nach dem Lesen. Zähle die Stichwörter. Wie viele mehr sind es beim zweiten Mal?',
    comic: [
      { bg: 'room', cast: [['alpaca', 'left', 'happy']], props: [['paper', 180, 120, 1.3], ['closedbook', 180, 136]], say: [['left', 'Buch zu! Schreib alles auf, was du über Vögel weißt.']] },
      { bg: 'room', cast: [['elara', 'center', 'thinking', 'write']], props: [['paper', 150, 120], ['bird', 60, 50, 1.3]], say: [['center', 'Federn … Schnabel … Eier … hmm …', 'think']] },
      { bg: 'room', cast: [['elara', 'center', 'surprised', 'hold']], props: [['book', 120, 104, 1.1]], say: [['center', 'Ah, die Zugvögel! Die hatte ich vergessen.']] },
      { bg: 'room', cast: [['elara', 'left', 'excited', 'cheer']], props: [['paper', 140, 136, 1, 'Runde 1'], ['paper', 190, 136, 1.2, 'Runde 2'], ['stars', 170, 40]], say: [['left', 'Beim zweiten Mal: 12 statt 5 Wörter!']] },
    ],
  },
  {
    id: 'spickzettel', island: 'leiter', level: 5, emoji: '📄',
    title: 'Die Spickzettel-Methode',
    short: 'Einen Zettel immer kleiner schreiben',
    was: 'Du schreibst einen großen [[Spickzettel]] – und machst ihn immer kleiner, bis das Wichtigste auf einen Mini-Zettel passt. (Natürlich nur zum Lernen, nicht für den Test! 😉)',
    schritte: [
      'Schreib alles Wichtige auf ein großes Blatt (DIN A4).',
      'Übertrage es auf ein **halb so großes** Blatt – jetzt musst du kürzen!',
      'Nochmal halbieren. Und nochmal.',
      'Am Ende passt alles auf einen Mini-Zettel – und eigentlich ist es schon in deinem Kopf.',
    ],
    beispiele: [
      ['mathe', 'Alle Regeln zu Brüchen. Am Ende steht auf dem Mini-Zettel nur noch: „erweitern ↑ · kürzen ↓ · gleicher Nenner +“.'],
      ['erdkunde', 'Alles über Gewitter – am Ende: „Blitz → Donner · Sekunden ÷ 3 = km“.'],
    ],
    warum: 'Beim Kürzen musst du entscheiden, was wirklich wichtig ist. Und du schreibst alles mehrmals – jedes Mal ein bisschen mehr aus dem Kopf.',
    challenge: 'Schaffst du es, dein aktuelles Thema auf einen Zettel so groß wie eine Briefmarke zu bringen?',
    comic: [
      { bg: 'room', cast: [['elara', 'left', 'happy', 'point']], props: [['paper', 170, 120, 1.8, 'Brüche']], say: [['left', 'Alles über Brüche – auf ein großes Blatt.']] },
      { bg: 'room', cast: [['sheep', 'left', 'excited']], props: [['paper', 170, 120, 1.1, 'Brüche']], say: [['left', 'Und jetzt: halb so groß!']] },
      { bg: 'room', cast: [['elara', 'left', 'thinking', 'think']], props: [['note', 170, 110, 0.9]], say: [['left', 'Nur noch das Wichtigste passt drauf …', 'think']] },
      { bg: 'room', cast: [['alpaca', 'left', 'proud'], ['elara', 'right', 'excited', 'cheer']], say: [['left', 'Und jetzt brauchst du den Zettel gar nicht mehr. Es ist alles im Kopf!']] },
    ],
  },
  {
    id: 'erklaeren', island: 'leiter', level: 5, emoji: '👩‍🏫',
    title: 'Jemand anderem erklären',
    short: 'Erklären, bis es der andere auch kann',
    was: 'Du erklärst den Lernstoff jemandem – so lange, bis er oder sie es auch kann. Das geht mit einer [[Lernpartner|Lernpartnerin]], deinen Eltern oder sogar mit einem Kuscheltier.',
    schritte: [
      'Such dir einen Zuhörer – Mensch oder Kuscheltier.',
      'Erkläre das Thema, **ohne** ins Buch zu schauen.',
      'Lass dir Fragen stellen.',
      'Wo du stockst, ist noch eine Lücke → nachlesen und nochmal erklären.',
    ],
    beispiele: [
      ['erdkunde', 'Erkläre deiner Oma, warum es Tag und Nacht gibt.'],
      ['mathe', 'Erkläre deinem Kuscheltier, warum ½ mehr ist als ¼.'],
    ],
    warum: 'Wer erklärt, muss es selbst richtig verstanden haben. Sogar Lehrerinnen und Lehrer lernen beim Erklären noch dazu!',
    challenge: 'Erkläre heute deinem Kuscheltier (oder Haustier) ein Thema aus der Schule – in 2 Minuten.',
    comic: [
      { bg: 'room', cast: [['elara', 'left', 'happy', 'point'], ['sheep', 'right', 'neutral']], props: [['board', 120, 60, 1, '½  ¼', 'back']], say: [['left', 'Flocke, ich erkläre dir jetzt die Brüche.']] },
      { bg: 'room', cast: [['sheep', 'center', 'confused']], props: [['question', 190, 50]], say: [['center', 'Aber warum ist ein Halb **mehr** als ein Viertel? Vier ist doch mehr als zwei!']] },
      { bg: 'room', cast: [['elara', 'left', 'thinking', 'think']], props: [['pizza', 170, 120, 1.4]], say: [['left', 'Hmm … gute Frage. Stell dir eine Pizza vor …']] },
      { bg: 'room', cast: [['sheep', 'left', 'excited'], ['elara', 'right', 'proud', 'cheer']], props: [['pizza', 120, 136]], say: [['left', 'Ah! Lieber die halbe Pizza!'], ['right', 'Und ich hab es jetzt auch richtig verstanden!']] },
    ],
  },
  {
    id: 'test-erstellen', island: 'leiter', level: 6, emoji: '✏️',
    title: 'Selbst einen Test erstellen',
    short: 'Selbst Lehrer sein und Testfragen ausdenken',
    was: 'Du bist jetzt die Lehrerin oder der Lehrer: Du denkst dir selbst Testfragen zu deinem Thema aus.',
    schritte: [
      'Überlege: Was würde deine Lehrkraft fragen?',
      'Schreibe 5–10 Fragen – leichte und schwere.',
      'Schreibe die Lösungen auf ein extra Blatt.',
      'Ein paar Tage später machst du deinen eigenen Test!',
    ],
    beispiele: [
      ['bio', '„Nenne drei Merkmale von Säugetieren.“ – „Warum haben Fische Kiemen?“'],
      ['deutsch', '„Setze die Verben ins Präteritum: ich gehe, du läufst …“'],
    ],
    warum: 'Wer gute Fragen stellen kann, weiß, was wichtig ist. Du denkst wie der Test – und wirst im echten Test nicht überrascht.',
    challenge: 'Schreibe einen Mini-Test mit 5 Fragen zu deinem Bio- oder Erdkunde-Thema – für deine Eltern! Bestehen sie ihn? 😄',
  },
  {
    id: 'testen', island: 'leiter', level: 6, emoji: '🏆',
    title: 'Testen, Testen, Testen',
    short: 'Mit Probetests üben wie im echten Test',
    was: 'Du übst mit echten Aufgaben – mit einem [[Probetest]]: alte Tests, „Teste dich“-Seiten im Buch oder Übungen aus dem Internet. So, als wäre es die echte Klassenarbeit.',
    schritte: [
      'Besorge Übungsaufgaben (Buch, Arbeitsheft, Lehrkraft fragen, Internet).',
      'Bearbeite sie **ohne Hilfe** – mit Uhr, wie im Test.',
      'Kontrolliere danach mit den Lösungen.',
      'Übe die Aufgaben mit Fehlern nochmal.',
    ],
    beispiele: [
      ['mathe', 'Die „Teste dich“-Seiten am Ende jedes Kapitels im Schulbuch.'],
      ['englisch', 'Der Test-Modus in Voki: alle Wörter einer Liste, ohne Tipps.'],
    ],
    warum: 'Das ist die stärkste Methode überhaupt! Du übst genau das, was du im Test tun musst: Wissen aus dem Kopf holen. Und vor dem echten Test bist du viel ruhiger, weil du weißt, was kommt.',
    challenge: 'Mach vor deiner nächsten Klassenarbeit mindestens **einen** Probetest – zu Hause, mit Uhr, ohne Hilfe.',
    link: { href: '#/', label: '📝 Zum Vokabel-Test in Voki' },
    comic: [
      { bg: 'room', cast: [['elara', 'left', 'neutral', 'hold']], props: [['test', 50, 110], ['clock', 190, 60, 1.2]], say: [['left', 'Probetest! 20 Minuten, ohne Hilfe – wie in echt.']] },
      { bg: 'room', cast: [['elara', 'left', 'surprised', 'think'], ['alpaca', 'right', 'happy']], props: [['test', 120, 136]], say: [['left', 'Oh, Aufgabe 3 konnte ich nicht.'], ['right', 'Super, dass du das **jetzt** merkst – und nicht erst in der Klassenarbeit!']] },
      { bg: 'school', cast: [['elara', 'center', 'proud', 'cheer']], props: [['test', 200, 136, 1.2], ['stars', 50, 50]], say: [['center', 'Die Klassenarbeit? Kannte ich alles schon!']], caption: 'Eine Woche später …' },
    ],
  },
];

// ---------- Vokabel-Profi: 4 Etappen ----------

export const PHASES = [
  {
    id: 'etappe-1', island: 'vokabeln', step: 1, emoji: '🌱',
    title: 'Etappe 1: Erarbeitung',
    short: 'Neue Wörter kennenlernen',
    was: 'In der [[Erarbeitung]] lernst du neue Wörter zum ersten Mal kennen: Wie klingen sie, wie schreibt man sie, was bedeuten sie? Diese Methoden helfen beim Einstieg:',
    methoden: [
      ['🚿', 'Vokabel-Dusche', 'Leg dich entspannt hin. Jemand liest dir die Vokabeln mit Bedeutung langsam vor – gerne mehrmals. Oder du nimmst dich selbst auf und hörst es immer wieder an.'],
      ['🧱', 'Bauklötze', 'Klebe Malerkrepp auf Duplo- oder Holzbausteine und schreibe die Vokabeln drauf: vorne Englisch, hinten Deutsch. Jetzt lernst du ganz nebenbei beim Bauen.'],
      ['🗺️', 'Vokabel-Mindmap', 'Eine große, bunte [[Mindmap]]: Wörter, die zusammengehören, verbinden und zu jeder Vokabel ein kleines Bild malen – auf einem großen Papier oder mit Kreidestiften ans Fenster.'],
      ['🫏', 'Mnemotechnik', '[[Mnemotechnik]] heißt: Merk-Tricks benutzen – Eselsbrücken, Bilder, Reime, verrückte Geschichten. Beispiel: „eye“ klingt wie „Ei“ → stell dir ein Gesicht mit Eiern statt Augen vor.'],
      ['🙂', 'Kopfwörter', 'Male den Umriss eines Kopfes. Geh die Vokabelliste durch: Wörter, die du schon kannst, schreibst du **in** den Kopf, unbekannte **außen** herum. So siehst du sofort, was du noch üben musst.'],
      ['🔀', 'Wörter sortieren', 'Sortiere die Vokabeln: nach Länge, nach ABC, nach Klang (weich oder hart), nach „mag ich / mag ich nicht“ oder nach Schwierigkeit. Beim Sortieren beschäftigst du dich mit jedem Wort.'],
    ],
    beispiele: [
      ['englisch', 'Neue Unit „Weather“: Erst Vokabel-Dusche, dann Kopfwörter – welche kenne ich schon?'],
      ['franz', 'Bei französischen Nomen mit Farben arbeiten: männlich blau, weiblich rot.'],
    ],
    warum: 'Ein neues Wort muss erst einmal „ankommen“. Je mehr Sinne du benutzt – hören, sehen, malen, anfassen –, desto mehr Haken hat das Wort in deinem Gehirn.',
    challenge: 'Nimm dir deine nächste Vokabelliste und mach **Kopfwörter**: Wie viele Wörter sind schon im Kopf?',
    link: { href: '#/', label: '✍️ In Voki: Neue Wörter einprägen' },
  },
  {
    id: 'etappe-2', island: 'vokabeln', step: 2, emoji: '⚙️',
    title: 'Etappe 2: Automatisierung',
    short: 'Üben, bis es von allein geht',
    was: '[[Automatisierung]] heißt: So oft üben, bis das Wort ganz von allein kommt – wie beim Fahrradfahren. Dafür ist regelmäßiges Abfragen und Anwenden wichtig.',
    methoden: [
      ['🟨', 'Post-its', 'Vokabel und Bedeutung auf getrennte Post-its schreiben und in der Wohnung verteilen. Jetzt suchst du die passenden Paare – eine Vokabel-Schatzsuche!'],
      ['🃏', 'Vokabel-Memory', 'Bastle ein Memory: Jede Vokabel und ihre Übersetzung sind ein Paar. Spiel es mit Freunden oder der Familie.'],
      ['🛏️', 'Regelmäßig abfragen', 'Abends auf der Bettkante, im Bus, beim Kochen – schon **5 Minuten täglich** wirken Wunder.'],
      ['📱', 'Vokabel-Apps', 'Apps wie Voki fragen schwere Wörter automatisch öfter ab, im passenden Abstand. Du siehst auch, wie viel du schon kannst.'],
    ],
    beispiele: [
      ['englisch', 'Post-its mit „fridge“ und „Kühlschrank“ – eins klebt am Kühlschrank, das andere versteckt im Flur.'],
      ['franz', 'Memory mit „le chien“ / „der Hund“, „la maison“ / „das Haus“ …'],
    ],
    warum: 'Jedes Abfragen macht den Weg zum Wort im Gehirn breiter. Viele kurze Übungen sind stärker als eine lange.',
    challenge: '**Post-it-Schatzsuche:** Verteile 10 Vokabel-Paare in der Wohnung. Wie schnell findest du alle Paare?',
    link: { href: '#/', label: '🔁 In Voki: Lernen & Karteikasten' },
  },
  {
    id: 'etappe-3', island: 'vokabeln', step: 3, emoji: '📝',
    title: 'Etappe 3: Testen',
    short: 'Schreiben, ohne nachzuschauen',
    was: 'Erst wenn du die Vokabeln **schriftlich und ohne Hilfe** hinschreiben kannst, sind sie wirklich in deinem Gedächtnis. Kleine Tests zu Hause helfen dabei – ganz ohne Druck.',
    methoden: [
      ['📋', 'Mini-Test', 'Eine einfache Liste mit **10 deutschen Wörtern** und Platz für die Übersetzung reicht völlig.'],
      ['🔤', 'Rechtschreibung', 'Achte genau auf jeden Buchstaben – „frend“ statt „friend“ ist im Test ein Fehler.'],
      ['📱', 'Test in der App', 'In Voki gibt es einen Test-Modus mit allen Wörtern einer Liste und Sternen am Ende.'],
    ],
    beispiele: [
      ['englisch', 'Mama sagt 10 deutsche Wörter, du schreibst die englischen auf. Dann kontrollierst du selbst.'],
    ],
    warum: 'So übst du die Test-Situation in einer entspannten Umgebung. Und du siehst deinen Lernfortschritt schwarz auf weiß.',
    challenge: 'Schreib heute einen Mini-Test mit 10 Wörtern. Wie viele hast du richtig – und wie viele schaffst du in 3 Tagen?',
    link: { href: '#/', label: '📝 In Voki: Test starten' },
  },
  {
    id: 'etappe-4', island: 'vokabeln', step: 4, emoji: '🔁',
    title: 'Etappe 4: Wiederholen',
    short: 'Damit es für immer bleibt',
    was: 'Damit die Vokabeln nicht nur bis zum nächsten Test, sondern **lange** im Kopf bleiben, brauchen sie regelmäßige Wiederholung – [[Wiederholen mit Abstand]].',
    methoden: [
      ['🗃️', 'Karteikasten', 'Der Voki-Karteikasten „merkt“ sich, welche Wörter schwer waren, und fragt sie automatisch häufiger ab.'],
      ['⭐', 'Liste der schweren Wörter', 'Führe eine Liste oder Karteikarten nur mit besonders schwierigen Vokabeln – und geh sie regelmäßig durch.'],
    ],
    beispiele: [
      ['englisch', 'Jeden Morgen beim Frühstück: „Wiederholen“ in Voki drücken – nur die fälligen Wörter kommen dran.'],
    ],
    warum: 'Das Gehirn vergisst, was es lange nicht braucht. Wenn du ein Wort kurz vor dem Vergessen wiederholst, bleibt es danach noch länger hängen.',
    challenge: 'Leg in Voki eine eigene Liste „Meine schweren Wörter“ an und übe sie eine Woche lang jeden Tag.',
    link: { href: '#/', label: '🔁 In Voki: Wiederholen' },
  },
  {
    id: 'profi-tipps', island: 'vokabeln', step: 5, emoji: '💡',
    title: 'Profi-Tipps',
    short: 'Was immer hilft',
    was: 'Diese Tipps helfen in **allen** Etappen:',
    methoden: [
      ['⏱️', 'Häufig kurz statt selten lang', 'Eine Woche lang jeden Tag 5–7 Vokabeln ist leichter und wirkt besser als 35 auf einmal. Das Gehirn liebt kleine Häppchen!'],
      ['📅', 'Routine', 'Kurze Lernzeiten zu festen Tageszeiten – z. B. immer nach dem Mittagessen. Dann musst du nicht jeden Tag neu überlegen (und diskutieren 😉). Das nennt man [[Routine]].'],
      ['🎨', 'Viele Sinne', 'Spiele, Apps, Malen, Sprechen, Bewegung – benutze möglichst viele Sinne.'],
      ['🤸', 'In Bewegung', 'Um den Tisch laufen, auf dem Gymnastikball hopsen, beim Spaziergang oder hüpfend auf dem Trampolin abfragen – oder draußen mit Kreide.'],
    ],
    beispiele: [],
    warum: 'Wenn Lernen eine Gewohnheit ist wie Zähneputzen, kostet es kaum noch Überwindung.',
    challenge: 'Such dir eine **feste Vokabel-Zeit** für jeden Tag aus und halte sie eine Woche lang durch.',
  },
];

// ---------- Aufgaben-Detektiv ----------

export const DETECTIVE_CARD = {
  id: 'fuenf-schritte', island: 'detektiv', emoji: '🔍',
  title: 'Die 5 Detektiv-Schritte',
  short: 'Aufgabenstellungen selbst verstehen',
  was: '„Ich verstehe die Aufgabe nicht!“ – das kennt jeder. Meistens ist die Aufgabe aber gar nicht so schwer: Man hat sie nur einmal schnell überflogen und dann aufgegeben. Mit diesen 5 Schritten knackst du fast jede [[Aufgabenstellung]] selbst.',
  abmachung: '„Ich helfe dir immer, wenn du mich brauchst. Die Aufgabe erkläre ich dir, wenn du vorher diese 5 Schritte gemacht hast.“',
  steps: [
    ['🤫', 'Leise lesen', 'Lies die Aufgabe einmal ganz leise – nur mit den Augen.'],
    ['🗣️', 'Flüsternd oder laut lesen', 'Jetzt liest du sie flüsternd oder laut. Beim Sprechen fallen dir Wörter auf, die du überlesen hast.'],
    ['⬅️', 'Rückwärts lesen', 'Lies Wort für Wort von hinten nach vorne. So kann dein Gehirn nicht „abkürzen“ und du siehst jedes einzelne Wort.'],
    ['✏️', 'Schlüsselwörter unterstreichen', 'Unterstreiche die wichtigsten Wörter: Was sollst du **tun**? Worum **geht** es? Das sind die [[Schlüsselwörter]].'],
    ['💬', 'Erklär es selbst', '„Erklär mir, was du glaubst, hier tun zu müssen.“ – Sag in eigenen Worten, was die Aufgabe von dir will.'],
  ],
  hintergrund: [
    'Du bist **nicht allein**: Am Anfang steht das Versprechen, dass du Hilfe bekommst.',
    'Du lernst **Tricks**, mit denen du Aufgaben in Zukunft immer öfter selbst verstehst – auch in der Klassenarbeit, wo dir niemand helfen darf.',
  ],
  zitat: ['„Hilf mir, es selbst zu tun.“', 'Maria Montessori, Ärztin und Pädagogin'],
  challenge: 'Mach bei der **nächsten Hausaufgabe**, die du nicht sofort verstehst, alle 5 Schritte – bevor du jemanden fragst. Hat es geklappt?',
  comic: [
    { bg: 'room', cast: [['elara', 'left', 'sad', 'shrug']], props: [['paper', 160, 130, 1.2, 'Aufg. 3'], ['question', 200, 50]], say: [['left', 'Ich versteh die Aufgabe nicht!']] },
    { bg: 'room', cast: [['alpaca', 'left', 'happy']], props: [['magnifier', 180, 100, 1.6]], say: [['left', 'Abgemacht: Ich helfe dir immer. Aber vorher machst du die **5 Detektiv-Schritte**.']] },
    { bg: 'room', cast: [['elara', 'center', 'thinking', 'hold']], props: [['magnifier', 125, 100], ['paper', 200, 136]], say: [['center', 'Leise … laut … rückwärts … Schlüsselwörter …', 'think']] },
    { bg: 'room', cast: [['elara', 'left', 'excited', 'cheer'], ['alpaca', 'right', 'proud']], props: [['bulb', 50, 34]], say: [['left', 'Ach sooo! Ich soll die Tiere ja nur **ordnen**!'], ['right', 'Siehst du – du brauchtest mich gar nicht.']] },
  ],
};

// Detektiv-Fälle: echte Aufgabenstellungen aus verschiedenen Fächern.
// keys = Schlüsselwörter (so geschrieben wie im Text, ohne Satzzeichen, klein)
export const CASES = [
  {
    id: 'mathe-umfang', subject: 'mathe',
    text: 'Berechne den Umfang des Rechtecks mit a = 5 cm und b = 3 cm.',
    keys: ['berechne', 'umfang', 'rechtecks'],
    options: [
      ['Ich soll die Fläche ausrechnen: 5 · 3.', 'Fast! Aber die Fläche heißt „Flächeninhalt“. Hier steht „Umfang“.'],
      ['Ich soll alle Seiten einmal ringsherum zusammenzählen: 5 + 3 + 5 + 3.', ''],
      ['Ich soll das Rechteck zeichnen.', 'Zeichnen steht nicht in der Aufgabe. Das Tu-Wort ist „berechne“.'],
    ],
    correct: 1,
    explain: '„Umfang“ = einmal um die Figur herum. Das Tu-Wort „berechne“ sagt: Du sollst rechnen. Ergebnis: 16 cm.',
  },
  {
    id: 'deutsch-verben', subject: 'deutsch',
    text: 'Unterstreiche im Text alle Verben rot und schreibe sie im Präteritum in dein Heft.',
    keys: ['unterstreiche', 'verben', 'rot', 'schreibe', 'präteritum', 'heft'],
    options: [
      ['Nur die Verben rot unterstreichen.', 'Das ist nur die Hälfte! Die Aufgabe hat zwei Tu-Wörter: „unterstreiche“ UND „schreibe“.'],
      ['Alle Nomen ins Heft schreiben.', 'Hier geht es um Verben (Tu-Wörter), nicht um Nomen.'],
      ['Zwei Dinge: Verben rot unterstreichen UND sie in der Vergangenheitsform (Präteritum) ins Heft schreiben.', ''],
    ],
    correct: 2,
    explain: 'Zwei Tu-Wörter = zwei Aufträge! Tipp: Zähle immer, wie viele Tu-Wörter in einer Aufgabe stecken.',
  },
  {
    id: 'bio-tiere', subject: 'bio',
    text: 'Ordne die Tiere den Gruppen Säugetiere, Vögel und Fische zu. Begründe bei zwei Tieren deine Entscheidung.',
    keys: ['ordne', 'säugetiere', 'vögel', 'fische', 'begründe', 'zwei'],
    options: [
      ['Jedes Tier in eine der drei Gruppen sortieren und bei zwei Tieren erklären, warum.', ''],
      ['Alle Tiere genau beschreiben.', '„Beschreiben“ steht nicht da – gesucht ist „ordne“ und „begründe“.'],
      ['Bei jedem Tier begründen, warum es in die Gruppe gehört.', 'Fast! Aber da steht „bei zwei Tieren“ – das spart dir Arbeit.'],
    ],
    correct: 0,
    explain: '„Begründe“ heißt: Sag, **warum** – am besten mit „…, weil …“. Zum Beispiel: „Der Wal ist ein Säugetier, weil er seine Jungen säugt.“',
  },
  {
    id: 'erdkunde-rhein', subject: 'erdkunde',
    text: 'Beschreibe mithilfe der Karte den Verlauf des Rheins von der Quelle bis zur Mündung.',
    keys: ['beschreibe', 'karte', 'verlauf', 'rheins', 'quelle', 'mündung'],
    options: [
      ['Erklären, warum der Rhein so lang ist.', '„Erklären“ und „warum“ stehen nicht da. Gesucht ist „beschreibe“.'],
      ['Mit der Karte erzählen, wo der Rhein entspringt, wo er langfließt und wo er ins Meer mündet.', ''],
      ['Den Rhein in die Karte einzeichnen.', 'Du sollst die Karte benutzen, aber nichts einzeichnen.'],
    ],
    correct: 1,
    explain: '„Beschreibe“ heißt: Sag, was du siehst – ohne zu erklären, warum. „Verlauf“ = der Weg des Flusses, von der Quelle (Anfang) bis zur Mündung (Ende).',
  },
  {
    id: 'englisch-answer', subject: 'englisch',
    text: 'Read the text and answer the questions in complete sentences.',
    keys: ['read', 'answer', 'questions', 'complete', 'sentences'],
    options: [
      ['Den Text ins Deutsche übersetzen.', '„Translate“ (übersetzen) steht hier nicht.'],
      ['Selbst Fragen zum Text schreiben.', 'Die Fragen gibt es schon – du sollst sie beantworten („answer“).'],
      ['Den Text lesen und die Fragen in ganzen Sätzen beantworten – nicht nur mit einem Wort.', ''],
    ],
    correct: 2,
    explain: '„complete sentences“ = vollständige Sätze. Also nicht nur „Tom.“, sondern „Tom is the boy’s best friend.“',
  },
  {
    id: 'mathe-bruch', subject: 'mathe',
    text: 'Eine Pizza hat 8 Stücke. Tim isst 6 Stücke. Schreibe als Bruch und kürze so weit wie möglich.',
    keys: ['schreibe', 'bruch', 'kürze', 'weit', 'möglich'],
    options: [
      ['Nur „6/8“ hinschreiben.', 'Das ist der erste Schritt – aber da steht auch „kürze so weit wie möglich“.'],
      ['Erst 6/8 hinschreiben, dann kürzen, bis es nicht mehr geht: 3/4.', ''],
      ['Ausrechnen, wie viele Stücke übrig bleiben.', 'Danach ist nicht gefragt.'],
    ],
    correct: 1,
    explain: '„So weit wie möglich“ heißt: so lange kürzen, bis es keine gemeinsame Zahl mehr gibt. 6/8 → 3/4.',
  },
  {
    id: 'physik-luft', subject: 'physik',
    text: 'Plane einen Versuch, mit dem du zeigen kannst, dass Luft Platz braucht. Notiere Material und Durchführung.',
    keys: ['plane', 'versuch', 'luft', 'platz', 'notiere', 'material', 'durchführung'],
    options: [
      ['Den Versuch sofort machen.', '„Plane“ heißt: erst ausdenken und aufschreiben – noch nicht machen.'],
      ['Mir einen Versuch ausdenken und aufschreiben, was ich brauche (Material) und was ich Schritt für Schritt mache (Durchführung).', ''],
      ['Erklären, was Luft ist.', 'Danach ist nicht gefragt.'],
    ],
    correct: 1,
    explain: '„Plane“ + „notiere“: Du schreibst den Versuch auf, bevor du ihn machst. Material = was brauche ich? Durchführung = was tue ich?',
  },
  {
    id: 'franz-etre', subject: 'franz',
    text: 'Complète les phrases avec la bonne forme du verbe être.',
    keys: ['complète', 'phrases', 'bonne', 'forme', 'être'],
    options: [
      ['Die Sätze ins Deutsche übersetzen.', 'Übersetzen heißt auf Französisch „traduis“ – das steht hier nicht.'],
      ['Die Lücken in den Sätzen mit der richtigen Form von „être“ füllen (suis, es, est …).', ''],
      ['„être“ einmal ganz konjugieren und abschreiben.', 'Fast – aber du sollst die Formen in Sätze einsetzen.'],
    ],
    correct: 1,
    explain: '„Complète“ klingt wie „komplett“ – du machst die Sätze komplett, also: ergänzen. „la bonne forme“ = die richtige Form.',
  },
  {
    id: 'deutsch-figuren', subject: 'deutsch',
    text: 'Vergleiche die beiden Hauptfiguren. Nenne je zwei Gemeinsamkeiten und zwei Unterschiede.',
    keys: ['vergleiche', 'hauptfiguren', 'nenne', 'zwei', 'gemeinsamkeiten', 'unterschiede'],
    options: [
      ['Beide Figuren einzeln ausführlich beschreiben.', 'Beim Vergleichen geht es ums Gegenüberstellen, nicht um zwei getrennte Beschreibungen.'],
      ['Sagen, welche Figur ich besser finde.', 'Deine Meinung ist hier nicht gefragt.'],
      ['Zwei Dinge finden, die bei beiden gleich sind, und zwei, die verschieden sind.', ''],
    ],
    correct: 2,
    explain: '„Vergleiche“ = Gemeinsamkeiten und Unterschiede suchen. „Nenne“ = kurz aufzählen, ohne lange Erklärung.',
  },
];

// ---------- Kopf-Power ----------

export const MUSCLE_CARD = {
  id: 'gehirn-muskel', island: 'kopf', emoji: '💪',
  title: 'Dein Gehirn ist ein Muskel',
  short: 'Anstrengung heißt: Dein Gehirn wächst',
  was: 'Wenn etwas schwer ist, denken viele: „Ich bin dafür nicht schlau genug.“ Stimmt aber nicht! Dein Gehirn funktioniert wie ein Muskel: Wenn es sich anstrengt, wird es stärker. Das nennt man [[Wachstums-Denken]].',
  schritte: [
    'Merk dir: Schwer heißt nicht „Ich kann das nicht“ – sondern „Mein Gehirn trainiert gerade“.',
    'Häng an „Ich kann das nicht“ das Wörtchen **noch** an: „Ich kann das **noch** nicht.“',
    'Sieh Fehler als Hinweise: Sie zeigen dir, was du noch üben musst.',
    'Such dir einen Zaubersatz aus, der dir Mut macht.',
  ],
  beispiele: [
    ['mathe', 'Brüche sind am Anfang schwer. Nach zwei Wochen Üben fühlen sie sich leicht an – dein Gehirn hat neue Verbindungen gebaut.'],
    ['musik', 'Beim ersten Mal klingt ein neues Lied auf der Flöte schief. Beim zehnten Mal klappt es.'],
  ],
  warum: 'Beim Lernen bauen deine Nervenzellen neue Verbindungen. Je öfter du übst, desto dicker und schneller werden sie – genau wie Muskeln beim Sport.',
  challenge: '**Fehler-Challenge:** Wenn dir heute ein Fehler passiert, sag laut: „Mega guter Fehler!“ und schau, was du daraus lernen kannst.',
  comic: [
    { bg: 'room', cast: [['elara', 'left', 'sad', 'down']], props: [['paper', 170, 136, 1, 'Mathe'], ['sweat', 30, 50]], say: [['left', 'Mathe ist zu schwer. Ich bin einfach nicht schlau genug.']] },
    { bg: 'room', cast: [['alpaca', 'left', 'happy']], props: [['brain', 180, 80, 1.6], ['dumbbell', 180, 110, 1.4]], say: [['left', 'Dein Gehirn ist wie ein Muskel. Wenn es anstrengend wird, **wächst** es gerade!']] },
    { bg: 'outside', cast: [['sheep', 'center', 'tired']], props: [['dumbbell', 160, 80, 1.3], ['sweat', 150, 60]], say: [['center', 'So wie Muskelkater? Puh … aber danach bin ich stärker!']] },
    { bg: 'room', cast: [['elara', 'center', 'proud', 'cheer']], props: [['stars', 50, 60]], say: [['center', 'Dann kann ich es vielleicht **noch** nicht. Aber bald!']] },
  ],
};

// 17 Zaubersätze (frei nach "17 Zaubersätze beim Lernen mit Kindern") mit Erklärung
export const SPELLS = [
  ['Unser Gehirn ist wie ein Muskel. Wenn es ein bisschen wehtut, wächst es.', 'Anstrengung ist kein Zeichen, dass du schlecht bist – sondern dass du gerade trainierst.'],
  ['Du kannst es vielleicht NOCH nicht.', 'Das kleine Wort „noch“ macht aus „Ich kann das nicht“ ein „Ich lerne das gerade“.'],
  ['Schau mal, was du alles schon kannst!', 'Vor einem Jahr konntest du vieles noch nicht. Schau zurück und sei stolz.'],
  ['Better done than perfect!', 'Englisch für: Lieber fertig als perfekt. Fang an und mach es fertig – verbessern kannst du später.'],
  ['Wer keine Fehler macht, macht auch sonst nicht viel.', 'Fehler passieren nur, wenn man etwas tut. Ein Fehler heißt also: Du bist dabei!'],
  ['So. Heiter weiter!', 'Nach einem Fehler: kurz durchatmen, lächeln, weitermachen.'],
  ['Wie wäre es, wenn wir es heute mal ganz anders machen?', 'Wenn eine Methode nicht klappt, probier eine andere von der Lern-Leiter aus.'],
  ['Mega guter Fehler! Schau mal, was man daran alles lernen kann!', 'Jeder Fehler zeigt dir genau, was du noch üben musst – wie ein Wegweiser.'],
  ['Aus Fehlern wird man klug – deshalb ist einer nicht genug.', 'Ein Witz mit wahrem Kern: Je mehr Fehler du machst (und verstehst), desto mehr lernst du.'],
  ['Du kannst alles lernen. Du brauchst nur Zeit, Übung und eine gute Strategie.', 'Die drei Zutaten fürs Lernen. Die Strategien findest du hier in der Lern-Werkstatt.'],
  ['Es wird nicht leichter – aber du wirst stärker.', 'Die Aufgaben wachsen mit dir mit. Aber du wächst auch!'],
  ['Schon 16 von 20 richtig – schau mal, wie sehr du dich verbessert hast!', 'Schau nicht nur auf die Fehler, sondern auch auf das, was schon klappt.'],
  ['Lieber heute ein bisschen als später ganz viel.', 'Jeden Tag ein kleiner Schritt ist leichter als ein riesiger Berg am Ende.'],
  ['Ok, und jetzt erklärst du es mir – und ich tu so, als könnte ich es überhaupt nicht.', 'Rollentausch! Wer erklärt, lernt doppelt.'],
  ['Nur gar nichts tun ist sinnlos.', 'Ein bisschen ist immer besser als nichts. Fang einfach mit 5 Minuten an.'],
  ['Wir geben alles. Nur nicht auf!', 'Durchhalten lohnt sich – auch wenn es gerade schwer ist.'],
  ['Jeder macht jetzt das, worauf er keine Lust hat – ok?', 'Zusammen ist Unangenehmes leichter: Du machst Hausaufgaben, Mama oder Papa die Steuererklärung. 😄'],
];

export function spellOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return SPELLS[day % SPELLS.length];
}

// ---------- Lern-Lexikon ----------

export const GLOSSARY = [
  { id: 'mindmap', term: 'Mindmap', also: ['Mind-Map', 'Mindmaps'], emoji: '🗺️',
    text: 'Eine Gedanken-Landkarte. Das Thema steht in der Mitte, Unterthemen wachsen wie Äste drumherum, Einzelheiten wie kleine Zweige. Das Wort kommt aus dem Englischen: „mind“ = Gedanken, „map“ = Landkarte.',
    example: '„Wald“ in der Mitte → Äste: Tiere, Bäume, Pilze → am Ast „Bäume“: Buche, Eiche, Fichte.',
    method: 'mindmap' },
  { id: 'eselsbruecke', term: 'Eselsbrücke', also: ['Eselsbrücken'], emoji: '🫏',
    text: 'Ein Merk-Trick: ein Satz, Reim oder Bild, das dir hilft, dir etwas Schweres zu merken. Der Name kommt daher, dass Esel nicht gern durch Wasser gehen – man baute ihnen eine kleine Brücke.',
    example: '„Nie Ohne Seife Waschen“ für Nord – Ost – Süd – West.',
    method: 'eselsbruecke' },
  { id: 'mnemotechnik', term: 'Mnemotechnik', also: [], emoji: '🎩',
    text: 'Ein schweres Wort für „Merk-Technik“ (gesprochen: „Mne-mo-technik“, das M am Anfang hört man kaum). Gemeint sind alle Tricks, mit denen man sich Dinge besser merkt: Eselsbrücken, Bilder, Reime, Geschichten.',
    example: '„eye“ klingt wie „Ei“ → Gesicht mit Eiern statt Augen.',
    method: 'eselsbruecke' },
  { id: 'schluesselwort', term: 'Schlüsselwort', also: ['Schlüsselwörter', 'Schlüsselwörtern'], emoji: '🔑',
    text: 'Die wichtigsten Wörter in einem Text oder einer Aufgabe. Wie ein Schlüssel „schließen“ sie den Sinn auf: Wenn du nur die Schlüsselwörter liest, weißt du schon fast, worum es geht.',
    example: 'In „Berechne den Umfang des Rechtecks“ sind „berechne“ und „Umfang“ Schlüsselwörter.' },
  { id: 'braindump', term: 'Brain Dump', also: [], emoji: '🧠',
    text: 'Englisch für „Gehirn auskippen“. Du schreibst alles, was du zu einem Thema weißt, auf ein leeres Blatt – ohne nachzuschauen. So siehst du, was schon in deinem Kopf ist und wo Lücken sind.',
    example: '5 Minuten: alles über die Steinzeit aufschreiben.',
    method: 'braindump' },
  { id: 'spickzettel', term: 'Spickzettel', also: [], emoji: '📄',
    text: 'Ein kleiner Zettel mit dem Wichtigsten. In der Lern-Werkstatt ist er ein Lern-Trick: Du schreibst ihn immer kleiner, bis du ihn nicht mehr brauchst. Im echten Test ist Spicken natürlich verboten!',
    method: 'spickzettel' },
  { id: 'karteikarten', term: 'Karteikarte', also: ['Karteikarten'], emoji: '🗂️',
    text: 'Ein kleines Kärtchen: vorne eine Frage oder ein Wort, hinten die Antwort. Damit kann man sich selbst abfragen.',
    example: 'Vorne „le chien“, hinten „der Hund“.',
    method: 'karteikarten' },
  { id: 'karteikasten', term: 'Karteikasten', also: [], emoji: '🗃️',
    text: 'Ein Kasten mit mehreren Fächern für Karteikarten. Gewusste Karten wandern ein Fach weiter nach hinten und kommen seltener dran. Nicht gewusste Karten wandern zurück nach vorne. Voki hat einen eingebauten Karteikasten.',
    method: 'kartei-abfragen' },
  { id: 'wiederholung', term: 'Wiederholen mit Abstand', also: ['Wiederholung mit Abstand'], emoji: '📆',
    text: 'Man wiederholt etwas nicht dauernd hintereinander, sondern mit immer größeren Pausen: nach 1 Tag, nach 2 Tagen, nach 4 Tagen, nach einer Woche … Kurz bevor du es vergisst, holst du es wieder hervor – dann bleibt es noch länger. Fachwort: „verteiltes Lernen“.',
    method: 'kartei-abfragen' },
  { id: 'erarbeitung', term: 'Erarbeitung', also: [], emoji: '🌱',
    text: 'Die erste Lern-Etappe: Du lernst etwas Neues zum ersten Mal kennen und verstehst es.',
    method: 'etappe-1' },
  { id: 'automatisierung', term: 'Automatisierung', also: [], emoji: '⚙️',
    text: 'Etwas so oft üben, bis es wie von selbst („automatisch“) klappt – ohne lange Nachdenken. Wie Fahrradfahren oder das Einmaleins.',
    method: 'etappe-2' },
  { id: 'aufgabenstellung', term: 'Aufgabenstellung', also: ['Aufgabenstellungen'], emoji: '📋',
    text: 'Der Text, der dir sagt, was du bei einer Aufgabe tun sollst. Meistens beginnt er mit einem Tu-Wort wie „Berechne“, „Beschreibe“ oder „Ordne zu“.',
    method: 'fuenf-schritte' },
  { id: 'operator', term: 'Operator', also: ['Operatoren', 'Aufgaben-Wörter'], emoji: '🎯',
    text: 'So heißen die Tu-Wörter in Aufgabenstellungen. Sie sagen dir genau, WAS du tun sollst. Die wichtigsten:',
    list: [
      ['nenne', 'kurz aufzählen, ohne Erklärung'],
      ['beschreibe', 'sagen, was man sieht oder was passiert – noch ohne „warum“'],
      ['erkläre', 'sagen, wie oder warum etwas so ist'],
      ['begründe', 'deine Antwort mit „…, weil …“ beweisen'],
      ['vergleiche', 'Gemeinsamkeiten und Unterschiede finden'],
      ['ordne zu', 'Dinge in Gruppen sortieren oder Paare bilden'],
      ['berechne', 'mit Rechenweg ausrechnen'],
      ['beurteile', 'deine Meinung sagen und begründen'],
    ] },
  { id: 'probetest', term: 'Probetest', also: ['Altklausur', 'Probetests'], emoji: '📝',
    text: 'Ein Übungstest, den du zu Hause machst – mit alten Tests, Aufgaben aus dem Buch oder aus dem Internet. Bei älteren Schülern heißt so etwas auch „Altklausur“.',
    method: 'testen' },
  { id: 'lernpartner', term: 'Lernpartner', also: ['Lernpartnerin', 'Lernpartner:in'], emoji: '🤝',
    text: 'Jemand, mit dem du zusammen lernst: eine Freundin, ein Freund, deine Eltern – oder auch dein Kuscheltier, dem du etwas erklärst.',
    method: 'erklaeren' },
  { id: 'routine', term: 'Routine', also: [], emoji: '📅',
    text: 'Etwas, das du immer zur gleichen Zeit auf die gleiche Weise machst – wie Zähneputzen. Eine Lern-Routine heißt: feste Lernzeit jeden Tag, dann musst du nicht mehr jedes Mal überlegen.',
    method: 'profi-tipps' },
  { id: 'wachstum', term: 'Wachstums-Denken', also: [], emoji: '🌱',
    text: 'Die Überzeugung: „Ich kann besser werden, wenn ich übe.“ Das Gegenteil wäre: „Entweder man kann es oder nicht.“ Forscher haben herausgefunden, dass Kinder mit Wachstums-Denken mehr lernen. Auf Englisch: „Growth Mindset“.',
    method: 'gehirn-muskel' },
];

// Alles, was eine eigene Karte hat (Methoden, Etappen, Detektiv, Gehirn-Muskel)
export const CARDS = [...METHODS, ...PHASES, DETECTIVE_CARD, MUSCLE_CARD];
export const cardById = (id) => CARDS.find((c) => c.id === id);
export const islandById = (id) => ISLANDS.find((i) => i.id === id);
export const caseById = (id) => CASES.find((c) => c.id === id);

const norm = (s) => s.toLowerCase().trim();
export function findTerm(text) {
  const t = norm(text);
  return GLOSSARY.find((g) => g.id === t || norm(g.term) === t || g.also.some((a) => norm(a) === t));
}
