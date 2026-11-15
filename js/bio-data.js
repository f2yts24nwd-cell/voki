// Biologie Klasse 5/6 (Gymnasium, Baden-Württemberg) im Fach BNT.
// Stationen und Reihenfolge passen zu „Natura 5/6 – Biologie, Naturphänomene und Technik“
// (Klett, Ausgabe Baden-Württemberg) und zu den Heftaufschrieben und Arbeitsblättern aus dem Unterricht:
// Kennzeichen der Lebewesen, Säugetiere (Kap. 1), Vögel (Kap. 2), Blütenpflanzen und Lebensraum Wiese (Kap. 6),
// Bäume bestimmen, Samen und Früchte, Wirbellose Tiere (Kap. 7).
// Alle Texte und Fragen sind selbst formuliert – nichts ist aus dem Buch kopiert.

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const others = (all, x, n = 3) => shuffle(all.filter((y) => y !== x)).slice(0, n);

const mc = (q, a, why) => ({ t: 'mc', q, a, c: 0, why });
const tf = (q, c, why) => ({ t: 'tf', q, c, why });
const sort = (q, cats, items, why) => ({ t: 'sort', q, cats, items, why });
const match = (q, pairs, why) => ({ t: 'match', q, pairs, why });
const order = (q, items, why) => ({ t: 'order', q, items, why });
const word = (q, c, why) => ({ t: 'scramble', q, c, why });

// ---------- Bäume: Blätter und Früchte ----------
// [Name, Blatt (wie im Bestimmungsschlüssel), Frucht, Laub-/Nadelbaum]
const TREES = [
  ['Rosskastanie', 'zusammengesetzt, **gefingert** – 5 bis 7 Blättchen wie eine Hand', 'stachelige grüne Kapsel mit glänzend braunem Samen', 'Laubbaum'],
  ['Eberesche', 'zusammengesetzt, **gefiedert**, Blättchen **fein gesägt**', 'leuchtend rote Beeren in Büscheln (Vogelbeeren)', 'Laubbaum'],
  ['Esche', 'zusammengesetzt, **gefiedert**, Blättchen **unregelmäßig gesägt**', 'längliche Flügelfrüchte, die in Büscheln hängen', 'Laubbaum'],
  ['Rotbuche', 'einzeln, **ganzrandig/wellig**, Blattnerven laufen **gerade zum Rand**', 'dreikantige Bucheckern in einer stacheligen Hülle', 'Laubbaum'],
  ['Eiche', 'einzeln, **gebuchtet**, Rand glatt', 'Eicheln, die in einem kleinen Becher sitzen', 'Laubbaum'],
  ['Weißdorn', 'einzeln, **gebuchtet**, Rand gezähnt', 'kleine dunkelrote Beeren', 'Laubbaum'],
  ['Spitzahorn', 'einzeln, **gelappt**, Lappen zipfelig zugespitzt, Rand sonst glatt', 'zwei Flügelfrüchte, die wie Propeller zusammenhängen', 'Laubbaum'],
  ['Bergahorn', 'einzeln, **gelappt**, Lappen spitz und **Rand gesägt**', 'zwei Flügelfrüchte im spitzen Winkel', 'Laubbaum'],
  ['Linde', 'einzeln, **herzförmig**, gesägt', 'kleine runde Nüsschen an einem langen Flügelblatt', 'Laubbaum'],
  ['Birke', 'einzeln, **dreieckig**, gesägt, Stiel rund', 'winzige Flügelnüsschen in walzenförmigen Kätzchen', 'Laubbaum'],
  ['Hainbuche', 'einzeln, länglich oval, Rand **doppelt gesägt**', 'Nüsschen an einem dreilappigen Flügel', 'Laubbaum'],
  ['Platane', 'einzeln, groß und gelappt wie beim Ahorn, Rinde blättert in Flecken ab', 'stachelige Kugeln an langen Stielen', 'Laubbaum'],
  ['Fichte', 'spitze, stechende Nadeln **rund um den Zweig**', 'lange Zapfen, die nach **unten hängen** und ganz abfallen', 'Nadelbaum'],
  ['Tanne', 'flache, weiche Nadeln mit **zwei weißen Streifen** auf der Unterseite', 'Zapfen, die **aufrecht** stehen und am Baum zerfallen', 'Nadelbaum'],
  ['Kiefer', 'lange Nadeln, immer **zu zweit** zusammen', 'kegelförmige Zapfen mit dicken, holzigen Schuppen', 'Nadelbaum'],
  ['Lärche', 'weiche Nadeln in **Büscheln** – im Herbst werden sie gelb und fallen ab', 'kleine, eiförmige Zapfen, die aufrecht am Zweig sitzen', 'Nadelbaum'],
];
const treeNames = TREES.map((t) => t[0]);
const gLeaf = () => {
  const [n, leaf] = pick(TREES);
  return { t: 'mc', q: `🍃 Welcher Baum hat diese ${leaf.includes('Nadeln') ? 'Nadeln' : 'Blätter'}?\n${leaf}`, a: [n, ...others(treeNames, n)], c: 0, why: `${n}: ${leaf.replace(/\*\*/g, '')}.` };
};
const gFruit = () => {
  const [n, , fruit] = pick(TREES);
  return { t: 'mc', q: `🌰 Welche Frucht gehört zu diesem Baum: **${n}**?`, a: [fruit, ...others(TREES.map((t) => t[2]), fruit)], c: 0, why: `Frucht der ${n}: ${fruit}.` };
};
const gFruitRev = () => {
  const [n, , fruit] = pick(TREES);
  return { t: 'mc', q: `🌰 Von welchem Baum stammt diese Frucht?\n${fruit}`, a: [n, ...others(treeNames, n)], c: 0, why: `Das ist die Frucht der ${n}.` };
};
const gLaubNadel = () => sort('Laubbaum oder Nadelbaum?', ['Laubbaum', 'Nadelbaum'], shuffle(TREES).slice(0, 6).map(([n, , , k]) => [n, k === 'Laubbaum' ? 0 : 1]), 'Die Lärche ist ein Sonderfall: ein Nadelbaum, der im Herbst seine Nadeln abwirft.');

// ---------- Samen und Früchte: Verbreitung ----------
// [Pflanze, Verbreitung, Fruchtart]
const SEEDS = [
  ['Ahorn', 'Wind', 'Schraubenflieger'], ['Löwenzahn', 'Wind', 'Schirmflieger'], ['Linde', 'Wind', 'Schraubenflieger'],
  ['Hainbuche', 'Wind', 'Schraubenflieger'], ['Klatschmohn', 'Wind', 'Streufrucht (Körnchenflieger)'], ['Schneeball', 'Tiere', 'Lockfrucht'],
  ['Klette', 'Tiere', 'Klettfrucht'], ['Haselnuss', 'Tiere', 'Trockenfrucht (wird versteckt)'], ['Eberesche', 'Tiere', 'Lockfrucht'],
  ['Veilchen', 'Tiere', 'Ameisenfrucht'], ['Storchschnabel', 'Selbst', 'Schleuderfrucht'], ['Springkraut', 'Selbst', 'Schleuderfrucht'],
  ['Seerose', 'Wasser', 'Schwimmsamen'], ['Kokospalme', 'Wasser', 'Schwimmfrucht'],
];
const VERB = ['Wind', 'Tiere', 'Wasser', 'Selbst'];
const gSeedSort = () => {
  const pool = shuffle(SEEDS);
  const picked = [];
  for (const v of VERB) { const s = pool.find((x) => x[1] === v); if (s) picked.push(s); }
  for (const s of pool) if (picked.length < 6 && !picked.includes(s)) picked.push(s);
  return sort('Wie wird die Frucht verbreitet?', ['Wind', 'Tiere', 'Wasser', 'selbst'], shuffle(picked).map(([n, v]) => [n, VERB.indexOf(v)]), '**Wind:** leichte Flugfrüchte. **Tiere:** Lock-, Klett- und Ameisenfrüchte, versteckte Nüsse. **Wasser:** Schwimmsamen. **Selbst:** Schleuderfrüchte springen auf.');
};
const FTYPES = ['Schraubenflieger', 'Schirmflieger', 'Lockfrucht', 'Klettfrucht', 'Schleuderfrucht', 'Schwimmsamen', 'Ameisenfrucht', 'Streufrucht (Körnchenflieger)'];
const gSeedType = () => {
  const [n, , typ] = pick(SEEDS.filter((s) => FTYPES.includes(s[2])));
  return { t: 'mc', q: `Welche Art von Frucht bildet **${n}**?`, a: [typ, ...others(FTYPES, typ)], c: 0, why: `${n}: ${typ}.` };
};

// ---------- Stationen ----------

export const BIO = {
  id: 'bio',
  name: 'Biologie',
  emoji: '🧬',
  who: 'elara',
  motto: 'Forscher-Camp',
  credit: 'Stationen und Reihenfolge passen zu Natura 5/6 – Biologie, Naturphänomene und Technik (Klett, Baden-Württemberg) und zu den Arbeitsblättern aus dem Unterricht. Alle Texte und Fragen sind selbst formuliert.',
  intro: 'Willkommen im **Forscher-Camp**! Die Stationen folgen deinem BNT-Buch **Natura 5/6**. Überall gibt es Forscher-Wissen, Quiz-Level und einen **Forscher-Auftrag** für draußen oder zu Hause.',
  topics: [
    {
      id: 'leben', chapter: 'Start', title: 'Kennzeichen des Lebens', emoji: '🌱', sub: 'Was lebt – und woran erkennt man das?',
      sayWho: 'sheep', say: 'Mein Kuschel-Roboter bewegt sich und macht „Mäh“. Der lebt doch – oder?!',
      explain: [
        ['Die Kennzeichen des Lebens', 'Lebewesen erkennt man daran, dass sie **alle** diese Merkmale zeigen:\n**Bewegung** aus eigener Kraft\n**Reizbarkeit** – sie nehmen ihre Umwelt wahr und reagieren\n**Stoffwechsel** – Nahrung aufnehmen, umwandeln, Reste ausscheiden, atmen\n**Wachstum und Entwicklung**\n**Fortpflanzung**', 'Merkhilfe: **B**ären **r**ennen **s**elten **w**egen **F**röschen.'],
        ['Auch Pflanzen leben!', 'Pflanzen bewegen sich langsam (Blüten öffnen sich, Blätter drehen sich zum Licht), reagieren auf Reize, wachsen, ernähren sich und pflanzen sich fort.', 'Die Mimose klappt ihre Blätter ein, wenn man sie berührt.'],
        ['Nur eines reicht nicht', 'Ein Auto bewegt sich und „frisst“ Benzin. Eine Kerzenflamme wächst. Ein Kristall wächst auch. Aber keines davon zeigt **alle** Kennzeichen.', ''],
        ['Zellen', 'Alle Lebewesen bestehen aus **Zellen** – winzigen Bausteinen, die man nur mit dem Mikroskop sieht. Manche Lebewesen bestehen aus nur einer einzigen Zelle, du aus vielen Billionen.', ''],
      ],
      facts: ['Das größte Lebewesen der Erde ist ein Pilz: Ein Hallimasch in den USA ist unterirdisch rund 9 Quadratkilometer groß – so groß wie über 1 200 Fußballfelder.', 'Bärtierchen sind kleiner als 1 mm und überleben Eiseskälte, Hitze und sogar das Weltall.'],
      task: ['Lebt es?', 'Such dir draußen **fünf Dinge** (z. B. Stein, Moos, Schnecke, Pfütze, Pilz). Prüfe bei jedem alle fünf Kennzeichen und entscheide: lebendig oder nicht? Erkläre es jemandem zu Hause.'],
      levels: [
        { title: 'Lebendig oder nicht?', emoji: '🔎', questions: [
          sort('Lebewesen oder nicht?', ['lebt', 'lebt nicht'], [['Gänseblümchen', 0], ['Kerzenflamme', 1], ['Regenwurm', 0], ['Roboter-Hund', 1], ['Moos', 0], ['Wolke', 1]], 'Nur wer **alle** Kennzeichen zeigt, lebt. Eine Flamme bewegt sich und „frisst“ Wachs – aber sie pflanzt sich nicht fort und besteht nicht aus Zellen.'),
          mc('Welches ist **kein** Kennzeichen des Lebens?', ['Sprechen', 'Fortpflanzung', 'Wachstum', 'Stoffwechsel'], 'Sprechen können nur Menschen. Die Kennzeichen gelten aber für **alle** Lebewesen – auch für Pilze und Gänseblümchen.'),
          match('Welches Beispiel passt zu welchem Kennzeichen?', [['Bewegung', 'Ein Gepard sprintet'], ['Reizbarkeit', 'Die Mimose klappt die Blätter ein'], ['Fortpflanzung', 'Eine Amsel legt Eier'], ['Stoffwechsel', 'Ein Hamster frisst und atmet']]),
          tf('Pflanzen bewegen sich nicht.', false, 'Doch – nur langsam! Sonnenblumen drehen sich zum Licht, Tulpen öffnen und schließen ihre Blüten.'),
          word('Lebewesen werden größer. Dieses Kennzeichen heißt …', 'WACHSTUM'),
          mc('Was bedeutet **Reizbarkeit**?', ['Lebewesen nehmen Reize aus der Umwelt wahr und reagieren darauf', 'Lebewesen sind schnell genervt', 'Lebewesen können Schmerzen nicht spüren', 'Lebewesen bewegen sich ständig'], 'Reize sind zum Beispiel Licht, Wärme, Berührung oder Geräusche.'),
          tf('Ein Auto bewegt sich, braucht Benzin und gibt Abgase ab. Also lebt es.', false, 'Ein Auto wächst nicht, entwickelt sich nicht und bekommt keine Auto-Babys. 🚗'),
          mc('Was gehört zum **Stoffwechsel**?', ['Nahrung aufnehmen, umwandeln und Reste ausscheiden', 'Die Farbe wechseln', 'Sich im Winter verstecken', 'Von einem Ort zum anderen wandern'], 'Auch die Atmung gehört zum Stoffwechsel.'),
        ] },
        { title: 'Lebens-Experte', emoji: '🔬', questions: [
          mc('Woraus bestehen alle Lebewesen?', ['Aus Zellen', 'Aus Kristallen', 'Aus Fasern', 'Aus Sand'], 'Zellen sind die kleinsten Bausteine des Lebens.'),
          tf('Pilze sind Pflanzen.', false, 'Pilze bilden ein eigenes Reich. Sie haben kein Blattgrün und können keine Fotosynthese betreiben.'),
          sort('Wirbeltier oder wirbelloses Tier?', ['Wirbeltier', 'wirbellos'], [['Frosch', 0], ['Biene', 1], ['Regenwurm', 1], ['Amsel', 0], ['Schnecke', 1], ['Forelle', 0]], 'Wirbeltiere haben eine **Wirbelsäule** und ein Skelett aus Knochen im Inneren.'),
          mc('Die Mimose klappt bei Berührung ihre Blätter zusammen. Welches Kennzeichen zeigt sie damit?', ['Reizbarkeit', 'Fortpflanzung', 'Wachstum', 'Stoffwechsel'], 'Sie reagiert auf einen Reiz (die Berührung) – und bewegt sich dabei sogar.'),
          tf('Eine trockene Bohne aus der Tüte ist ein Lebewesen.', true, 'Der Samen ruht nur. Bekommt er Wasser und Wärme, keimt er und wächst zu einer Pflanze heran.'),
          mc('Womit beschäftigt sich die **Biologie**?', ['Mit den Lebewesen', 'Mit Sternen und Planeten', 'Mit Maschinen', 'Mit Gesteinen'], '„Bios“ ist griechisch und heißt „Leben“.'),
          order('Ordne die Entwicklung eines Huhns.', ['Ei', 'Küken', 'Junghenne', 'Henne'], 'Wachstum und Entwicklung gehören zu den Kennzeichen des Lebens.'),
          word('Der kleinste Baustein aller Lebewesen:', 'ZELLE'),
          mc('Welche fünf Gruppen gehören zu den **Wirbeltieren**?', ['Fische, Amphibien, Reptilien, Vögel, Säugetiere', 'Insekten, Spinnen, Krebse, Würmer, Schnecken', 'Fische, Insekten, Vögel, Würmer, Säugetiere', 'Pflanzen, Pilze, Tiere, Bakterien, Algen'], 'Merkhilfe: **F**este **A**rbeit **r**eicht **v**ielen **S**chülern.'),
        ] },
      ],
    },

  // ------------------------------------------------------------------
  {
    id: 'saeuger', chapter: '1', title: 'Säugetiere', emoji: '🐕', sub: 'Haustiere, Nutztiere, Säugetiere in ihrem Lebensraum',
    sayWho: 'elara', say: 'Wusstest du, dass der Dackel vom Wolf abstammt und eine Kuh vier Mägen hat? Säugetiere sind echte Spezialisten!',
    explain: [
      ['Merkmale der Säugetiere', '**Wirbeltiere** mit Wirbelsäule · **Fell** aus Haaren · **gleichwarm** (Körpertemperatur bleibt gleich) · atmen mit **Lungen** · meist **lebend gebärend** · **säugen** ihre Jungen mit Milch.', 'Auch Wal, Fledermaus und Mensch sind Säugetiere.'],
      ['Hund und Wolf (1.1)', 'Alle Hunde stammen vom **Wolf** ab – durch **Züchtung** entstanden über 300 Rassen. Wölfe leben im **Rudel** mit Rangordnung und sind **Hetzjäger** mit Ausdauer. Hunde verständigen sich mit Körpersprache: Schwanz, Ohren, Zähnezeigen. Sie sind **Zehengänger** und „Nasentiere“.', ''],
      ['Die Katze (1.1)', '**Schleichjägerin:** schleicht lautlos auf weichen Ballen, lauert und springt. Krallen sind **einziehbar**. Große Augen, die im Dunkeln gut sehen; Tasthaare. Junge Katzen kommen **blind** zur Welt (Nesthocker).', ''],
      ['Nutztiere (1.2)', '**Rind:** Pflanzenfresser und **Wiederkäuer** mit vier Mägen (Pansen, Netzmagen, Blättermagen, Labmagen). Es liefert Milch, Fleisch, Leder. Vorfahr: der Auerochse.\n**Hausschwein:** **Allesfresser**, Vorfahr Wildschwein.\n**Pferd:** **Zehenspitzengänger** (Huf), Fluchttier.', ''],
      ['Gebisse im Vergleich', '**Fleischfresser** (Hund, Katze): Fangzähne und scharfe **Reißzähne**.\n**Pflanzenfresser** (Rind, Pferd): breite **Mahlzähne**.\n**Allesfresser** (Schwein, Mensch): von allem etwas.\n**Nagetiere** (Hase, Eichhörnchen): Nagezähne wachsen ständig nach.', ''],
      ['Säugetiere in ihrem Lebensraum (1.3)', '**Maulwurf:** Grabhände, lebt unter Tage. **Fledermaus:** Flughaut, orientiert sich mit **Ultraschall**. **Seehund:** stromlinienförmig, Speckschicht. **Feldhase** (Nestflüchter, offenes Feld) und **Wildkaninchen** (Nesthocker, Bau).\nDer Körperbau passt zum Lebensraum – das biologische Prinzip **Struktur und Funktion**.', ''],
    ],
    facts: ['Eine Hundenase hat bis zu 300 Millionen Riechzellen – wir Menschen nur etwa 5 Millionen.', 'Eine Kuh kaut bis zu 30 000-mal am Tag.', 'Der Blauwal ist das größte Tier, das je gelebt hat – und er ist ein Säugetier.'],
    task: ['Pfoten-Detektiv', 'Beobachte fünf Minuten lang einen Hund oder eine Katze. Wie setzt das Tier die Pfoten auf? Was machen Ohren und Schwanz? Zeichne einen Pfotenabdruck: Sieht man Krallen (Hund) oder nicht (Katze)?'],
    levels: [
      { title: 'Haustiere: Hund & Katze', emoji: '🐾', questions: [
        mc('Von welchem Tier stammen alle Hunde ab?', ['Wolf', 'Fuchs', 'Hyäne', 'Schakal'], 'Vor über 15 000 Jahren begannen Menschen, Wölfe zu zähmen. Durch Züchtung entstanden die Rassen.'),
        sort('Hund oder Katze?', ['Hund', 'Katze'], [['Hetzjäger', 0], ['Schleichjäger', 1], ['Krallen einziehbar', 1], ['Rudeltier', 0], ['jagt mit Ausdauer', 0], ['lauert und springt', 1]], 'Der Hund hetzt seine Beute (wie der Wolf im Rudel), die Katze schleicht sich allein an.'),
        mc('Was bedeutet **Züchtung**?', ['Der Mensch wählt Tiere mit gewünschten Merkmalen zur Fortpflanzung aus', 'Tiere werden im Zoo gehalten', 'Tiere werden dressiert', 'Tiere bekommen besonderes Futter'], 'So entstanden aus dem Wolf Rassen vom Chihuahua bis zur Dogge.'),
        mc('Ein Hund zieht den Schwanz ein und legt die Ohren an. Was zeigt er?', ['Angst oder Unterwerfung', 'Freude', 'Angriffslust', 'Hunger'], 'Hunde verständigen sich vor allem über Körpersprache – wie Wölfe im Rudel.'),
        mc('Warum können Katzen fast lautlos schleichen?', ['Sie ziehen die Krallen ein und laufen auf weichen Ballen', 'Sie sind sehr leicht', 'Sie halten die Luft an', 'Sie haben keine Krallen'], 'Hundekrallen klackern auf hartem Boden – Hunde können sie nicht einziehen.'),
        mc('Welcher Sinn ist beim Hund besonders gut?', ['Geruchssinn', 'Geschmackssinn', 'Farbensehen', 'Tastsinn'], 'Hunde sind „Nasentiere“ – darum gibt es Spür- und Rettungshunde.'),
        tf('Junge Katzen kommen mit offenen Augen auf die Welt.', false, 'Katzenjunge sind Nesthocker: Sie sind anfangs blind und taub und werden gesäugt.'),
        mc('Welche Zähne sind typisch für ein Fleischfressergebiss?', ['Lange Fangzähne und scharfe Reißzähne', 'Breite, flache Mahlzähne', 'Ständig nachwachsende Nagezähne', 'Gar keine Zähne'], 'Mit den Fangzähnen packen, mit den Reißzähnen Fleisch zerschneiden.'),
        word('In dieser Gruppe leben Wölfe zusammen:', 'RUDEL'),
        mc('Woran erkennt man, dass Hund und Katze **Zehengänger** sind?', ['Sie laufen nur auf den Zehen, die Ferse berührt den Boden nicht', 'Sie haben besonders lange Zehen', 'Sie laufen auf der ganzen Fußsohle', 'Sie haben Hufe'], 'So sind sie leise und schnell. Mensch und Bär sind Sohlengänger.'),
      ] },
      { title: 'Nutztiere: Rind, Schwein, Pferd', emoji: '🐄', questions: [
        order('Welchen Weg nimmt das Gras im Rind?', ['abrupfen und schlucken', 'Pansen', 'Netzmagen', 'Wiederkäuen im Maul', 'Blättermagen', 'Labmagen'], 'Erst nach dem Wiederkäuen rutscht der Brei in Blätter- und Labmagen.'),
        mc('Wie viele Abteilungen hat der Magen eines Rindes?', ['4', '1', '2', '7'], 'Pansen, Netzmagen, Blättermagen und Labmagen.'),
        mc('Wer hilft dem Rind im Pansen, das Gras zu verdauen?', ['Milliarden winziger Bakterien', 'Würmer', 'Magensteine', 'Niemand'], 'Die Bakterien zerlegen die harten Pflanzenfasern.'),
        sort('Was frisst das Tier?', ['Pflanzenfresser', 'Fleischfresser', 'Allesfresser'], [['Rind', 0], ['Pferd', 0], ['Katze', 1], ['Hausschwein', 2], ['Wolf', 1], ['Mensch', 2]], 'Am Gebiss erkennt man die Nahrung: Mahlzähne, Reißzähne oder von allem etwas.'),
        mc('Wer ist der wilde Vorfahr des Hausschweins?', ['Wildschwein', 'Auerochse', 'Wildpferd', 'Warzenschwein'], 'Hausschweine sind wie Wildschweine Allesfresser.'),
        mc('Wer ist der Vorfahr unserer Hausrinder?', ['Auerochse', 'Wisent', 'Büffel', 'Elch'], 'Der Auerochse ist seit fast 400 Jahren ausgestorben.'),
        match('Wer läuft wie?', [['Mensch und Bär', 'Sohlengänger'], ['Hund und Katze', 'Zehengänger'], ['Pferd und Rind', 'Zehenspitzengänger']], 'Der Huf des Pferdes ist ein riesiger Zehennagel.'),
        mc('Warum gilt das Pferd als **Fluchttier**?', ['Bei Gefahr rennt es schnell weg statt zu kämpfen', 'Es flieht vor Regen', 'Es lebt allein', 'Es kann nicht schwimmen'], 'Lange Beine, gute Ohren und Augen seitlich am Kopf helfen dabei.'),
        mc('Woran erkennt man ein Pflanzenfressergebiss?', ['An breiten Mahlzähnen', 'An langen Fangzähnen', 'An scharfen Reißzähnen', 'An sehr kleinen Zähnen'], 'Mit den Mahlzähnen wird hartes Gras zerrieben.'),
        word('Die erste und größte Abteilung des Rindermagens:', 'PANSEN'),
      ] },
      { title: 'Spezialisten im Lebensraum', emoji: '🦇', questions: [
        match('Welche Angepasstheit gehört zu welchem Tier?', [['Maulwurf', 'Grabhände wie Schaufeln'], ['Fledermaus', 'Flughaut und Ultraschall'], ['Seehund', 'Speckschicht und Flossen'], ['Feldhase', 'lange Hinterbeine zum Hakenschlagen']]),
        mc('Wie finden Fledermäuse im Dunkeln ihre Beute?', ['Mit Ultraschall-Rufen und deren Echo', 'Mit besonders großen Augen', 'Mit dem Geruchssinn', 'Mit Tasthaaren'], 'Sie „sehen“ mit den Ohren.'),
        sort('Feldhase oder Wildkaninchen?', ['Feldhase', 'Wildkaninchen'], [['Junge kommen sehend und behaart zur Welt', 0], ['lebt in unterirdischen Bauen', 1], ['Junge kommen nackt und blind zur Welt', 1], ['lebt allein auf offenem Feld', 0], ['lebt in großen Gruppen', 1]], 'Hasen sind Nestflüchter, Kaninchen Nesthocker.'),
        tf('Wale sind Fische.', false, 'Wale atmen mit Lungen und säugen ihre Jungen – sie sind Säugetiere. Darum ist „Walfisch“ ein irreführender Name.'),
        mc('Was bedeutet das biologische Prinzip **Struktur und Funktion**?', ['Der Bau eines Körperteils passt zu seiner Aufgabe', 'Alle Tiere sind gleich gebaut', 'Tiere verändern ihren Körper nach Lust', 'Struktur ist wichtiger als Funktion'], 'Beispiel: Die Grabhand des Maulwurfs ist breit wie eine Schaufel.'),
        mc('Warum frieren Seehunde im eiskalten Meer nicht?', ['Eine dicke Speckschicht hält warm', 'Sie haben Federn', 'Sie sind wechselwarm', 'Sie schwimmen immer schnell'], 'Fett isoliert noch besser als Fell im Wasser.'),
        mc('Welches Säugetier lebt fast nur unter der Erde?', ['Maulwurf', 'Eichhörnchen', 'Reh', 'Fledermaus'], 'Er jagt Regenwürmer in seinen Gängen und sieht kaum etwas.'),
        tf('Die Fledermaus ist das einzige Säugetier, das richtig fliegen kann.', true, 'Ihre Flügel sind eine Flughaut zwischen den verlängerten Fingern.'),
        mc('Welches Merkmal haben **alle** Säugetiere?', ['Sie säugen ihre Jungen mit Milch', 'Sie haben vier Beine', 'Sie leben an Land', 'Sie fressen Fleisch'], 'Daher kommt der Name!'),
        mc('Der Orang-Utan ist ein …', ['Menschenaffe', 'Halbaffe', 'Raubtier', 'Beuteltier'], 'Er lebt auf Bäumen im Regenwald – seine langen Arme sind perfekt zum Hangeln.'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: 'voegel', chapter: '2', current: true, title: 'Vögel', emoji: '🐦', sub: 'Merkmale, Fliegen, Vögel in ihren Lebensräumen, vom Ei zum Küken',
    sayWho: 'sheep', say: 'Ich hab mit den Vorderbeinen geflattert – und bin nicht abgehoben. Mäh! Was haben Vögel, was ich nicht habe?',
    explain: [
      ['Merkmale der Vögel', '**Wirbeltiere** · **gleichwarm** (Körpertemperatur bleibt immer gleich) · atmen mit **Lungen** · **legen Eier** · **Federn** · **Schnabel** ohne Zähne · meist **vier Zehen mit Krallen** · **hohle, dünne Knochen** · schnelle Verdauung (spart Gewicht).', ''],
      ['Leicht und stabil – wie Vögel fliegen', 'Fast überall wird Gewicht gespart: **hohle Knochen** mit feinen Streben, ein leichter Schnabel statt schwerer Zähne, schnelle Verdauung, Weibchen haben nur **einen Eierstock**. Die Lunge ist mit **Luftsäcken** verbunden, die den ganzen Körper durchziehen. Starke **Flugmuskeln** sitzen am Brustbein (Brustbeinkamm).', ''],
      ['Federn', '**Daunen** wärmen · **Deckfedern** machen den Körper glatt und stromlinienförmig · **Schwungfedern** an den Flügeln tragen · **Schwanzfedern** steuern und bremsen.', ''],
      ['Flugformen (Mäusebussard)', '**Ruderflug:** aktiv mit den Flügeln schlagen. **Gleitflug:** mit ausgebreiteten Flügeln schräg nach unten. **Segelflug:** in warmer, aufsteigender Luft kreisen, ohne zu schlagen. **Rüttelflug:** auf der Stelle schweben (Turmfalke).', ''],
      ['Vögel in ihren Lebensräumen', '**Amsel:** Singvogel in Gärten, frisst Würmer und Beeren. **Stockente:** Schwimmfüße, Seihschnabel, gefettetes Gefieder. **Buntspecht:** Meißelschnabel, Kletterfuß, Stützschwanz. Der Schnabel verrät die Nahrung.', ''],
      ['Zugvogel oder Standvogel', '**Zugvögel** (Mauersegler, Schwalbe, Storch) ziehen im Herbst in den Süden, weil sie hier keine Insekten finden. **Standvögel** (Amsel, Meise, Spatz, Specht) bleiben. Zugvögel orientieren sich an Sonne, Sternen und dem Magnetfeld der Erde.', ''],
      ['Vom Ei zum Küken', 'Teile des Eis: **Kalkschale** (mit Poren), Schalenhaut, **Luftkammer**, **Eiklar**, **Dotter** (Nahrung), **Hagelschnüre** (halten den Dotter), **Keimscheibe** (hier wächst das Küken). Ein Hühnerküken schlüpft nach **21 Tagen**. **Nesthocker** (Amsel) / **Nestflüchter** (Huhn, Ente).', ''],
      ['Hühnerhaltung', '**Käfig/Kleingruppe**, **Bodenhaltung**, **Freilandhaltung**, **Bio-Haltung** – sie unterscheiden sich in Platz, Auslauf und Futter. Der Code auf dem Ei verrät es: 0 = Bio, 1 = Freiland, 2 = Boden, 3 = Käfig.', ''],
    ],
    facts: ['Der Mauersegler schläft im Flug und bleibt manchmal zehn Monate ohne Landung in der Luft.', 'Vögel sind die letzten lebenden Dinosaurier – das Huhn ist mit dem T. rex verwandt.', 'Ein Specht hämmert bis zu 20-mal pro Sekunde – und bekommt kein Kopfweh.'],
    task: ['Vogel-Zählung', 'Setz dich **zehn Minuten** ans Fenster, auf den Balkon oder in den Park. Mach eine Strichliste: Welche Vögel siehst du, und wie viele? Schau dir bei einem Vogel Schnabel und Füße genau an – was frisst er wohl, und wo lebt er?'],
    levels: [
      { title: 'Merkmale & Fliegen', emoji: '🪶', questions: [
        sort('Ist das ein Merkmal der Vögel?', ['ja', 'nein'], [['Federn', 0], ['hohle Knochen', 0], ['Zähne im Schnabel', 1], ['legen Eier', 0], ['wechselwarm', 1], ['Fell', 1], ['atmen mit Lungen', 0]], 'Vögel sind gleichwarm wie Säugetiere – aber sie haben Federn statt Fell und keine Zähne.'),
        mc('Warum sind Vogelknochen hohl?', ['Damit der Vogel leichter ist', 'Damit Luft für den Gesang hineinpasst', 'Weil Vögel keine Knochen brauchen', 'Damit sie schneller wachsen'], 'Innen stützen feine Streben die Knochen – leicht und trotzdem stabil.'),
        mc('Wozu dienen die **Luftsäcke**?', ['Sie sind mit der Lunge verbunden, verbessern die Atmung und machen leichter', 'Sie speichern Futter', 'Sie dienen als Schwimmhilfe', 'Darin wachsen die Eier'], 'Die Luftsäcke durchziehen den ganzen Körper.'),
        mc('Warum verdauen Vögel ihre Nahrung so schnell?', ['Um kein unnötiges Gewicht mit sich herumzutragen', 'Weil sie keinen Magen haben', 'Weil sie nur Wasser trinken', 'Damit sie mehr singen können'], 'Fliegen kostet viel Kraft – jedes Gramm zählt.'),
        match('Welche Feder hat welche Aufgabe?', [['Daunen', 'wärmen'], ['Schwungfedern', 'tragen beim Fliegen'], ['Deckfedern', 'machen den Körper glatt'], ['Schwanzfedern', 'steuern und bremsen']]),
        mc('Wo sitzen die kräftigen Flugmuskeln?', ['Am Brustbein (Brustbeinkamm)', 'Am Schwanz', 'In den Beinen', 'Am Kopf'], 'Der Brustbeinkamm ist wie ein Kiel – daran setzen die großen Muskeln an.'),
        match('Welche Flugform ist das?', [['Ruderflug', 'kräftig mit den Flügeln schlagen'], ['Gleitflug', 'ohne Flügelschlag schräg abwärts'], ['Segelflug', 'in aufsteigender Warmluft kreisen'], ['Rüttelflug', 'auf der Stelle in der Luft stehen']], 'Der Mäusebussard nutzt beim Segelflug warme Aufwinde – das spart Kraft.'),
        tf('Weibliche Vögel haben nur einen Eierstock.', true, 'Auch das spart Gewicht.'),
        word('Vögel haben keine Zähne, sondern einen …', 'SCHNABEL'),
        tf('Vögel sind gleichwarm.', true, 'Ihre Körpertemperatur liegt sogar bei etwa 40 °C. Federn halten die Wärme.'),
      ] },
      { title: 'Vögel in ihren Lebensräumen', emoji: '🌳', questions: [
        match('Welcher Schnabel passt zu welcher Nahrung?', [['Mäusebussard (Hakenschnabel)', 'Mäuse'], ['Buchfink (Kegelschnabel)', 'Körner und Samen'], ['Stockente (Seihschnabel)', 'Kleintiere und Pflanzen aus dem Wasser'], ['Buntspecht (Meißelschnabel)', 'Insektenlarven unter der Rinde']]),
        mc('Wie ist die Stockente an das Leben am See angepasst?', ['Schwimmfüße mit Schwimmhäuten und gefettetes Gefieder', 'Lange Krallen zum Klettern', 'Ein Hakenschnabel', 'Besonders große Augen'], 'Das Fett aus der Bürzeldrüse macht das Gefieder wasserdicht.'),
        mc('Welche Angepasstheiten hat der Buntspecht?', ['Meißelschnabel, Kletterfuß und Stützschwanz', 'Schwimmhäute und Seihschnabel', 'Lange Beine und spitzer Schnabel', 'Hakenschnabel und Greiffüße'], 'Zwei Zehen zeigen nach vorne, zwei nach hinten – perfekt zum Klettern.'),
        sort('Zugvogel oder Standvogel?', ['Zugvogel', 'Standvogel'], [['Mauersegler', 0], ['Amsel', 1], ['Rauchschwalbe', 0], ['Kohlmeise', 1], ['Weißstorch', 0], ['Buntspecht', 1]], 'Zugvögel fressen meist Insekten, die es im Winter nicht gibt.'),
        mc('Warum ziehen Mauersegler im Herbst nach Afrika?', ['Bei uns gibt es im Winter keine fliegenden Insekten', 'Sie vertragen keinen Schnee', 'Sie wollen dort brüten', 'Die Tage sind bei uns zu lang'], 'Nicht die Kälte, sondern der Futtermangel ist das Problem.'),
        mc('Woran orientieren sich Zugvögel?', ['An Sonne, Sternen und dem Magnetfeld der Erde', 'Nur am Geruch', 'An Flugzeugen', 'Sie fliegen zufällig'], 'Viele Vögel haben einen eingebauten Kompass.'),
        mc('Die Amsel ist ein …', ['Singvogel städtischer Gärten', 'Wasservogel', 'Greifvogel', 'Zugvogel aus Afrika'], 'Früher lebte sie nur im Wald – heute ist sie in Städten zu Hause.'),
        mc('Wie hilft man Vögeln im Winter am besten?', ['Mit geeignetem Futter wie Körnern und Fettfutter – ohne Salz und Brot', 'Mit Brot und Essensresten', 'Mit Milch', 'Gar nicht füttern, sie fliegen alle weg'], 'Brot quillt im Magen auf und macht krank.'),
        mc('Was bedeutet das Prinzip **Angepasstheit**?', ['Körperbau und Verhalten passen zum Lebensraum', 'Tiere passen sich in einem Tag an', 'Alle Vögel sehen gleich aus', 'Vögel ändern ihr Gefieder nach Laune'], 'Schnabel, Füße und Gefieder passen genau zur Lebensweise.'),
      ] },
      { title: 'Vom Ei zum Küken', emoji: '🐣', questions: [
        match('Welcher Teil des Eis hat welche Aufgabe?', [['Dotter', 'Nahrung für das Küken'], ['Kalkschale', 'Schutz, Luft dringt durch Poren'], ['Hagelschnüre', 'halten den Dotter in der Mitte'], ['Keimscheibe', 'hier entwickelt sich das Küken'], ['Luftkammer', 'Luftvorrat für den ersten Atemzug']]),
        mc('Wie lange brütet eine Henne, bis die Küken schlüpfen?', ['Etwa 21 Tage', 'Etwa 3 Tage', 'Etwa 3 Monate', 'Etwa 1 Jahr'], 'Mit dem Eizahn pickt das Küken die Schale von innen auf.'),
        sort('Nesthocker oder Nestflüchter?', ['Nesthocker', 'Nestflüchter'], [['Amsel', 0], ['Haushuhn', 1], ['Stockente', 1], ['Kohlmeise', 0], ['Buntspecht', 0], ['Gans', 1]], 'Nesthocker schlüpfen nackt und blind, Nestflüchter laufen sofort los.'),
        tf('Durch die Kalkschale eines Eis kommt Luft.', true, 'Die Schale hat Tausende winziger Poren.'),
        order('Vom Ei zum Küken – ordne.', ['Befruchtete Eizelle', 'Henne legt das Ei', 'Bebrüten bei etwa 38 °C', 'Küken wächst aus der Keimscheibe heran', 'Küken schlüpft'], 'Nur aus befruchteten Eiern schlüpfen Küken.'),
        match('Welche Haltungsform hat welche Ziffer auf dem Ei?', [['0', 'Bio-Haltung'], ['1', 'Freilandhaltung'], ['2', 'Bodenhaltung'], ['3', 'Käfighaltung (Kleingruppe)']], 'Je kleiner die Zahl, desto mehr Platz und Auslauf.'),
        mc('Was unterscheidet **Legehennen** von **Masthähnchen**?', ['Legehennen sind für viele Eier gezüchtet, Masthähnchen für schnelles Fleischwachstum', 'Es gibt keinen Unterschied', 'Masthähnchen legen mehr Eier', 'Legehennen sind wilde Vögel'], 'Beide sind durch Züchtung entstanden.'),
        mc('Woran erkennt man, ob ein Ei befruchtet war?', ['An der Keimscheibe, die größer ist', 'An der Farbe der Schale', 'Am Gewicht', 'Gar nicht'], 'Supermarkteier sind meist unbefruchtet – es gibt keinen Hahn im Stall.'),
        word('Diese weiße Schicht umgibt den Dotter:', 'EIKLAR'),
        mc('Welche Haltungsform bietet den Hühnern am meisten Platz und Auslauf?', ['Bio-Haltung', 'Käfighaltung', 'Bodenhaltung', 'Alle gleich'], 'Bio-Hühner haben Auslauf ins Freie und bekommen Bio-Futter.'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
    {
      id: 'pflanzen', chapter: '6', title: 'Bau der Blütenpflanzen', emoji: '🌸', sub: 'Wurzel, Spross, Blatt und Blüte',
      sayWho: 'elara', say: 'Pflanzen stehen nur herum? Von wegen! Sie sind kleine Fabriken, die aus Licht, Luft und Wasser Zucker bauen.',
      explain: [
        ['Die Grundorgane', '**Wurzel:** hält die Pflanze fest, nimmt Wasser und Mineralstoffe auf.\n**Sprossachse (Stängel):** trägt Blätter und Blüten, leitet Wasser und Nährstoffe.\n**Blätter:** stellen mit Sonnenlicht Nährstoffe her und verdunsten Wasser.\n**Blüte:** dient der Fortpflanzung.', ''],
        ['Der Bau der Blüte', 'Von außen nach innen:\n**Kelchblätter** (grün, schützen die Knospe)\n**Kronblätter** (bunt, locken Insekten an)\n**Staubblätter** (männlich, bilden den **Pollen**)\n**Stempel** aus Fruchtblättern (weiblich): **Narbe**, **Griffel**, **Fruchtknoten** mit den Samenanlagen', 'Gut zu sehen bei Kirsche, Tulpe oder Raps.'],
        ['Fotosynthese', 'In den grünen Blättern steckt **Blattgrün (Chlorophyll)**. Damit baut die Pflanze aus **Wasser** und **Kohlenstoffdioxid** mithilfe von **Licht** → **Traubenzucker** und **Sauerstoff**.', 'Ohne Pflanzen gäbe es keinen Sauerstoff zum Atmen!'],
        ['Pflanzenfamilien', 'Pflanzen mit ähnlich gebauten Blüten gehören zu einer Familie. **Kreuzblütengewächse** (Raps, Senf) haben 4 Kronblätter in Kreuzform, **Rosengewächse** (Kirsche, Apfel) haben 5 Kronblätter und viele Staubblätter.', ''],
      ],
      facts: ['Der höchste Baum der Welt, ein Küstenmammutbaum in Kalifornien, ist über 115 m hoch – so hoch wie ein Hochhaus mit 35 Stockwerken.', 'Bambus kann an einem einzigen Tag fast einen Meter wachsen. Man kann ihm dabei fast zusehen!', 'Eine große Buche gibt an einem Sommertag genug Sauerstoff für etwa zehn Menschen ab.'],
      task: ['Blumen färben', 'Stell eine **weiße Blume** (Tulpe, Nelke) oder eine Stange Sellerie in ein Glas Wasser mit viel Lebensmittelfarbe oder Tinte. Schau nach ein paar Stunden und am nächsten Tag nach. Was passiert – und was verrät das über die Leitungsbahnen im Stängel?'],
      levels: [
        { title: 'Pflanzen-Bauplan', emoji: '🌷', questions: [
          match('Welche Aufgabe hat welches Pflanzenorgan?', [['Wurzel', 'nimmt Wasser auf und gibt Halt'], ['Sprossachse', 'leitet Wasser und trägt die Blätter'], ['Blatt', 'stellt Nährstoffe her'], ['Blüte', 'dient der Fortpflanzung']]),
          order('Ordne die Teile einer Blüte von **außen nach innen**.', ['Kelchblätter', 'Kronblätter', 'Staubblätter', 'Stempel'], 'Der Stempel mit dem Fruchtknoten sitzt gut geschützt in der Mitte.'),
          mc('Welche Blütenteile sind **männlich** und bilden den Pollen?', ['Staubblätter', 'Kronblätter', 'Kelchblätter', 'Fruchtblätter'], 'Der Pollen (Blütenstaub) sitzt in den Staubbeuteln.'),
          mc('Aus welchen drei Teilen besteht der Stempel?', ['Narbe, Griffel, Fruchtknoten', 'Wurzel, Stängel, Blatt', 'Kelch, Krone, Staubbeutel', 'Pollen, Nektar, Samen'], 'Oben die klebrige Narbe, dann der Griffel, unten der Fruchtknoten.'),
          mc('Wozu sind die Kronblätter oft bunt?', ['Sie locken Insekten an', 'Sie fangen Regen auf', 'Sie schützen vor Sonne', 'Sie halten die Pflanze warm'], 'Farbe und Duft sind Werbung: „Hier gibt es Nektar!“'),
          word('Sie hält die Pflanze im Boden fest:', 'WURZEL'),
          tf('Pflanzen nehmen mit der Wurzel Wasser und Mineralstoffe auf.', true, 'Feine Wurzelhaare vergrößern die Oberfläche – so kommt mehr Wasser hinein.'),
          mc('Was stellen Pflanzen bei der Fotosynthese her?', ['Traubenzucker und Sauerstoff', 'Wasser und Erde', 'Kohlenstoffdioxid und Licht', 'Mineralstoffe'], 'Den Zucker braucht die Pflanze selbst, den Sauerstoff gibt sie ab.'),
        ] },
        { title: 'Blatt-Labor', emoji: '🍃', questions: [
          sort('Fotosynthese: Was braucht die Pflanze, was stellt sie her?', ['braucht sie', 'stellt sie her'], [['Licht', 0], ['Wasser', 0], ['Kohlenstoffdioxid', 0], ['Sauerstoff', 1], ['Traubenzucker', 1]]),
          mc('Wie heißt der grüne Farbstoff in den Blättern?', ['Chlorophyll', 'Melanin', 'Karotin', 'Nektar'], 'Chlorophyll (Blattgrün) fängt das Sonnenlicht ein.'),
          mc('Wo in der Blüte liegen die Samenanlagen mit den Eizellen?', ['Im Fruchtknoten', 'Im Staubbeutel', 'Auf der Narbe', 'In den Kelchblättern'], 'Aus dem Fruchtknoten wird später die Frucht, aus den Samenanlagen werden die Samen.'),
          mc('Welche Aufgabe haben die Kelchblätter?', ['Sie schützen die Blütenknospe', 'Sie bilden den Pollen', 'Sie locken Bienen an', 'Sie nehmen Wasser auf'], 'Solange die Blüte geschlossen ist, umhüllen die grünen Kelchblätter sie.'),
          tf('Pflanzen atmen nicht.', false, 'Doch! Pflanzen atmen Tag und Nacht – genau wie wir verbrauchen sie dabei Sauerstoff. Am Tag stellen sie durch Fotosynthese aber viel mehr Sauerstoff her.'),
          mc('Wozu dienen die winzigen **Spaltöffnungen** an der Blattunterseite?', ['Zum Gasaustausch und zum Verdunsten von Wasser', 'Zum Trinken von Regenwasser', 'Zum Anlocken von Insekten', 'Zum Festhalten'], 'Durch sie kommt Kohlenstoffdioxid hinein, Sauerstoff und Wasserdampf gehen hinaus.'),
          mc('Woran erkennt man **Kreuzblütengewächse** wie Raps und Senf?', ['An vier Kronblättern, die wie ein Kreuz stehen', 'An fünf Kronblättern', 'An ihren Dornen', 'An ihren blauen Blüten'], 'Dazu gehören auch Kohl, Radieschen und Kresse.'),
          mc('Wodurch wird das Wasser von der Wurzel bis in die Blätter transportiert?', ['Durch Leitungsbahnen im Stängel', 'Durch die Blüten', 'Außen am Stängel entlang', 'Durch die Luft'], 'Die feinen Röhren heißen Leitbündel – bei einem Baum sind sie über 30 Meter lang.'),
          word('Der Blütenstaub heißt auch …', 'POLLEN'),
        ] },
      ],
    },
  // ------------------------------------------------------------------
  {
    id: 'wiese', chapter: '6.4', title: 'Lebensraum Wiese', emoji: '🌼', sub: 'Mahd, Fett- und Magerwiese, Weide, Überlebenstricks',
    sayWho: 'alpaca', say: 'Eine Wiese wird mehrmals im Jahr gemäht – und trotzdem wächst sie immer wieder. Welche Tricks haben die Pflanzen?',
    explain: [
      ['Warum wird gemäht?', 'Eine Wiese wird ein- oder mehrmals im Jahr **gemäht** (die **Mahd**) – zum Beispiel für Heu. Ohne Mahd würden dort Büsche und Sträucher wachsen und später ein Wald.', ''],
      ['Die Wiese im Jahreslauf', '**Frühjahr:** gelb von **Löwenzahn** und **Hahnenfuß** – sie bilden schon vor der ersten Mahd Samen.\n**Sommer:** weiß von **Doldengewächsen** wie Wiesenkerbel und Wiesen-Bärenklau; die Gräser blühen.\n**Herbst:** nach der zweiten Mahd grün, kaum Blüten.', ''],
      ['Überlebenstricks bei der Mahd', '**Blattrosette:** Blätter liegen dicht am Boden – die Mähmaschine schneidet darüber (Löwenzahn, Spitzwegerich, Schlüsselblume).\n**Ausläufer:** am Boden kriechende Triebe mit Wurzeln an den Knoten (Kriechender Günsel, Weißklee).\n**Knoten:** Gräser wachsen aus den unteren Knoten und vom Blattgrund nach.\n**Schnelles Wachstum** (Wiesenkerbel) und passende **Blütezeit**.', ''],
      ['Fettwiese und Magerwiese', '**Fettwiese:** stark gedüngt, wächst schnell, wird oft gemäht → viel Gras (etwa 12 t/ha), aber nur wenige Arten.\n**Magerwiese:** nicht gedüngt, nur einmal im Sommer gemäht → wenig Ertrag (etwa 4 t/ha), aber sehr viele Arten (etwa 35).\nViele Pflanzenarten → viele Insekten → viele Vögel und Spinnen: Magerwiesen sind **schützenswert**.', ''],
      ['Weide', 'Auf einer **Weide** fressen Kühe, Pferde oder Schafe. Dort haben Pflanzen Vorteile, die **Tritt** und **Verbiss** vertragen, und Pflanzen mit **Stacheln** (Disteln) oder **ungenießbare** (Sauerampfer), weil das Vieh sie stehen lässt.', ''],
    ],
    facts: ['Auf einer artenreichen Magerwiese können auf einem Quadratmeter über 50 verschiedene Pflanzenarten wachsen.', 'Der Löwenzahn bildet aus einer einzigen Pusteblume rund 200 Flugfrüchte.'],
    task: ['Wiesen-Fotobuch', 'Such dir in der Nähe eine Wiese und fotografiere sie mehrmals im Frühling und Sommer (z. B. alle zwei Wochen) immer von der gleichen Stelle. Welche Farben dominieren wann? Wann wurde gemäht? Mach daraus ein kleines Fotobuch.'],
    levels: [
      { title: 'Wiesen-Kenner', emoji: '🌾', questions: [
        mc('Was bedeutet **Mahd**?', ['Das Mähen der Wiese', 'Das Düngen der Wiese', 'Das Abweiden durch Kühe', 'Das Blühen im Frühling'], 'Das gemähte Gras wird zum Beispiel als Heu getrocknet.'),
        mc('Was würde auf einer Wiese passieren, die nie gemäht wird?', ['Es würden Büsche, Sträucher und später Bäume wachsen', 'Sie würde zur Wüste', 'Es würde nichts passieren', 'Sie würde zu einem See'], 'Erst das Mähen hält die Wiese offen.'),
        match('Welche Farbe hat die Wiese wann – und warum?', [['Frühjahr: gelb', 'Löwenzahn und Hahnenfuß blühen'], ['Sommer: weiß', 'Doldengewächse wie Wiesenkerbel blühen'], ['Herbst: grün', 'kaum Blüten, nur Blätter']]),
        sort('Welcher Überlebenstrick bei der Mahd?', ['Blattrosette', 'Ausläufer', 'schnelles Wachstum'], [['Löwenzahn', 0], ['Spitzwegerich', 0], ['Kriechender Günsel', 1], ['Weißklee', 1], ['Wiesenkerbel', 2], ['Schlüsselblume', 0]], 'Rosetten liegen dicht am Boden, Ausläufer kriechen und wurzeln an den Knoten.'),
        mc('Warum überleben Gräser das häufige Mähen so gut?', ['Ihre Blätter wachsen vom Grund aus nach', 'Sie haben Stacheln', 'Sie blühen erst im Winter', 'Sie haben keine Blätter'], 'Darum entsteht bei häufigem Mähen ein Rasen.'),
        mc('Was ist ein **Ausläufer**?', ['Ein am Boden kriechender Trieb, an dem neue Pflanzen wurzeln', 'Eine Wurzel, die tief in den Boden geht', 'Eine besonders lange Blüte', 'Ein Samen mit Fallschirm'], 'Wird er abgetrennt, lebt die neue Pflanze selbstständig weiter.'),
        tf('Der Löwenzahn bildet schon vor der ersten Mahd reife Samen.', true, 'So kann er sich vermehren, bevor die Wiese gemäht wird.'),
        word('Blätter, die dicht am Boden in einem Kreis liegen:', 'ROSETTE'),
        mc('Warum hat der Wiesenkerbel gute Überlebenschancen?', ['Er wächst sehr schnell und blüht zwischen erster und zweiter Mahd', 'Er hat Dornen', 'Er wächst unter der Erde', 'Kühe mögen ihn nicht'], 'So schafft er es trotz Mahd, Samen zu bilden.'),
      ] },
      { title: 'Fettwiese, Magerwiese, Weide', emoji: '🐮', questions: [
        sort('Fettwiese oder Magerwiese?', ['Fettwiese', 'Magerwiese'], [['stark gedüngt', 0], ['viele Pflanzenarten', 1], ['hoher Ertrag an Gras', 0], ['nur einmal im Jahr gemäht', 1], ['wenige Blumen', 0], ['viele Insekten', 1]], 'Fettwiese: viel Gras, wenige Arten. Magerwiese: wenig Gras, große Vielfalt.'),
        mc('Warum gibt es auf einer Fettwiese nur wenige Blumenarten?', ['Sie wird so oft gemäht, dass viele Blumen keine Samen bilden können', 'Der Dünger ist giftig für Blumen', 'Dort scheint keine Sonne', 'Die Kühe fressen alle Blumen'], 'Nur wenige, schnellwüchsige Arten vertragen das häufige Mähen.'),
        mc('Warum leben auf Magerwiesen auch viele Tierarten?', ['Viele Pflanzenarten bieten vielen Insekten Nahrung – und die locken Vögel und Spinnen an', 'Weil es dort warm ist', 'Weil dort kein Mensch hinkommt', 'Weil das Gras so hoch ist'], 'Vielfalt an Pflanzen bringt Vielfalt an Tieren.'),
        mc('Was unterscheidet eine **Weide** von einer Wiese?', ['Sie wird nicht gemäht, sondern vom Vieh abgefressen', 'Auf ihr wachsen Bäume', 'Sie wird nie genutzt', 'Sie wird mehrmals pro Woche gemäht'], 'Kühe, Pferde oder Schafe grasen dort.'),
        mc('Warum findet man auf Weiden besonders viele **Disteln**?', ['Das Vieh frisst sie wegen der Stacheln nicht', 'Disteln brauchen viel Dünger', 'Disteln werden gepflanzt', 'Disteln blühen im Winter'], 'Auch ungenießbare Pflanzen wie Sauerampfer bleiben stehen.'),
        mc('Mit welchen Schwierigkeiten müssen Pflanzen auf einer Weide zurechtkommen?', ['Tritt durch Hufe und Verbiss durch das Vieh', 'Überschwemmungen', 'Zu viel Schatten', 'Zu wenig Wind'], 'Robuste Pflanzen mit Rosetten oder Stacheln haben dort Vorteile.'),
        tf('Eine Magerwiese bringt mehr Heu als eine Fettwiese.', false, 'Umgekehrt: Fettwiese etwa 12 t/ha, Magerwiese nur etwa 4 t/ha – aber die Magerwiese hat dreimal so viele Arten.'),
        mc('Warum sind blumenreiche Wiesen schützenswert?', ['Sie sind Lebensraum für sehr viele Pflanzen- und Tierarten', 'Weil sie besonders viel Geld bringen', 'Weil dort Getreide wächst', 'Weil sie besonders groß sind'], 'Viele Wiesenblumen und Insekten sind selten geworden.'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: 'familien', chapter: '6', title: 'Pflanzenfamilien & Bestäuber', emoji: '🌺', sub: 'Kreuzblüten, Nelken, Lippenblüten, Korbblüten, Dolden, Rosen, Gräser',
    sayWho: 'elara', say: 'Die Hummel passt genau in den Wiesensalbei, der Schmetterling in die Lichtnelke. Jede Blume hat ihren Lieblingsbesucher!',
    explain: [
      ['Pflanzenfamilien', 'Pflanzen mit ähnlichem Blütenbau werden zu **Familien** zusammengefasst. Die Ähnlichkeit kommt von der **Verwandtschaft**: Arten einer Familie stammen von einem gemeinsamen Vorfahren ab (Prinzip **Stammesgeschichte und Verwandtschaft**).', ''],
      ['Kreuzblütengewächse', '**4 Kelchblätter, 4 Kronblätter** wie ein Kreuz, 2 kurze und 4 lange Staubblätter, Früchte als **Schoten**. Beispiele: Raps, Senf, Radieschen, alle Kohlsorten.', ''],
      ['Nelkengewächse – Falterblumen', 'Gegabelt verzweigter Spross, **5 Kronblätter**, Kelchblätter zu einer **engen Röhre** verwachsen. Nur **Tagfalter** mit langem Saugrüssel kommen an den Nektar. Beispiel: **Rote Lichtnelke**, Kuckucks-Lichtnelke.', ''],
      ['Lippenblütengewächse – Hummelblumen', 'Kelch und Krone zu einer Röhre verwachsen, mit **Ober- und Unterlippe**. Beim **Wiesensalbei** klappen die Staubblätter mit einem **Gelenk** herunter, wenn eine Hummel hineinkriecht, und pudern ihr Pollen auf den Rücken. Viele Gewürze: Salbei, Thymian, Basilikum, Pfefferminze.', 'Hummel und Salbei nützen sich gegenseitig: **Wechselwirkung**.'],
      ['Doldengewächse – Fliegenblumen', 'Viele kleine weiße Blüten auf Stielen, die aus einem Punkt entspringen: eine **Dolde** („Schirm“). Bestäubt vor allem von **Fliegen** (z. B. Schwebfliegen) mit kurzem Rüssel. Beispiele: Wiesen-Bärenklau, Wiesenkerbel, Kümmel, Dill, Petersilie.', ''],
      ['Korbblütengewächse – Bienenblumen', 'Der „Blütenkopf“ ist keine Blüte, sondern ein **Korb** aus vielen Einzelblüten: **Zungenblüten** und **Röhrenblüten**. Bestäubt vor allem von **Bienen**. Der Kelch wird beim Löwenzahn zum **Pappus** („Fallschirm“). Beispiele: Löwenzahn, Gänseblümchen, Sonnenblume, Margerite.', ''],
      ['Rosengewächse und Süßgräser', '**Rosengewächse:** 5 Kelch-, 5 Kronblätter, **viele Staubblätter** – Kirsche, Apfel, Erdbeere.\n**Süßgräser:** runde, hohle **Halme** mit **Knoten**, schmale Blätter, unscheinbare Blüten mit **Spelzen** statt Kronblättern. Sie werden durch den **Wind** bestäubt – ihre Narben sind fedrig und klebrig. Pollen kann **Heuschnupfen** auslösen.', 'Glatthafer, Knäuelgras'],
    ],
    facts: ['In Deutschland gibt es mehrere Tausend Pflanzenarten.', 'Ein Grashalm ist gebaut wie ein Fernsehturm: hohl, mit Verstärkungen (Knoten) – sehr leicht und trotzdem stabil.', 'Die Hasel blüht schon im Februar – für Allergiker beginnt die Pollensaison mitten im Winter.'],
    task: ['Bestimmungs-Spaziergang', 'Such auf einer Wiese oder im Garten **fünf blühende Pflanzen**. Zähle Kronblätter, schau dir die Blütenform an und ordne jede Pflanze einer Familie zu (Kreuzblüten, Nelken, Lippenblüten, Dolden, Korbblüten, Rosen, Gräser). Welche Insekten besuchen sie?'],
    levels: [
      { title: 'Blüte und Besucher', emoji: '🐝', questions: [
        match('Welcher Besucher bestäubt welche Blume?', [['Rote Lichtnelke', 'Tagfalter'], ['Wiesensalbei', 'Hummel'], ['Wiesen-Bärenklau', 'Schwebfliege'], ['Löwenzahn', 'Biene'], ['Glatthafer', 'Wind']]),
        mc('Warum kommen bei der Roten Lichtnelke nur Tagfalter an den Nektar?', ['Die Blütenröhre ist so eng und lang, dass nur ein langer Saugrüssel passt', 'Die Blüte ist nachts geschlossen', 'Bienen mögen kein Rosa', 'Der Nektar ist giftig für Bienen'], 'Wenn nur bestimmte Insekten kommen, wird die Blüte eher mit Pollen derselben Art bestäubt.'),
        order('Der Klappmechanismus beim Wiesensalbei – ordne.', ['Hummel landet auf der Unterlippe', 'Sie steckt den Kopf in die Blütenröhre', 'Die Staubblätter klappen am Gelenk herunter', 'Pollen landet auf dem Rücken der Hummel', 'In der nächsten Blüte streift die Narbe den Pollen ab'], 'Das funktioniert nur, wenn das Insekt kräftig genug und passend groß ist.'),
        mc('Was bedeutet das biologische Prinzip **Wechselwirkung** bei Hummel und Salbei?', ['Beide haben einen Vorteil: Hummel bekommt Nektar, Salbei wird bestäubt', 'Die Hummel schadet dem Salbei', 'Der Salbei frisst die Hummel', 'Beide haben nichts miteinander zu tun'], 'Lebewesen eines Lebensraums beeinflussen sich gegenseitig.'),
        mc('Warum werden Dolden gerne von Fliegen besucht?', ['Der Nektar ist leicht erreichbar – Fliegen haben nur kurze Rüssel', 'Dolden riechen nach Fleisch', 'Fliegen mögen nur Weiß', 'Dolden haben besonders tiefe Röhren'], 'Viele kleine Blüten dicht nebeneinander bilden außerdem eine gute Landefläche.'),
        mc('Was ist das Besondere am gelben „Blütenkopf“ des Löwenzahns?', ['Er besteht aus vielen kleinen Einzelblüten in einem Korb', 'Er ist eine einzige riesige Blüte', 'Er hat gar keine Blüten', 'Er wird durch den Wind bestäubt'], 'Deshalb heißt die Familie Korbblütengewächse.'),
        mc('Wie heißt der „Fallschirm“ an der Löwenzahnfrucht?', ['Pappus', 'Pollen', 'Spelze', 'Dolde'], 'Er entsteht aus dem Kelch der Einzelblüte.'),
        mc('Warum haben Gräser keine bunten Blüten?', ['Sie werden durch den Wind bestäubt und müssen keine Insekten anlocken', 'Sie haben keinen Platz dafür', 'Sie blühen nur nachts', 'Weil Kühe bunte Blüten fressen'], 'Bunte Kronblätter wären für Windbestäuber verschwendete Energie.'),
        mc('Wozu sind die Narben der Grasblüten so stark gefiedert und klebrig?', ['Damit sie möglichst viel Pollen aus der Luft fangen', 'Damit Insekten landen können', 'Zum Schutz vor Regen', 'Zum Anlocken von Vögeln'], 'Wie ein Netz fangen sie die durch die Luft fliegenden Pollenkörner.'),
        tf('Beim Wiesen-Bärenklau reifen die Staubblätter, bevor sich die Narben öffnen.', true, 'So wird Selbstbestäubung verhindert.'),
      ] },
      { title: 'Familien bestimmen', emoji: '🔎', questions: [
        sort('Zu welcher Familie gehört die Pflanze?', ['Kreuzblüten', 'Lippenblüten', 'Korbblüten', 'Dolden'], [['Raps', 0], ['Salbei', 1], ['Gänseblümchen', 2], ['Wiesenkerbel', 3], ['Radieschen', 0], ['Thymian', 1], ['Sonnenblume', 2], ['Dill', 3]], 'Kreuzblüten: 4 Kronblätter im Kreuz. Lippenblüten: Ober- und Unterlippe. Korbblüten: viele Einzelblüten im Korb. Dolden: Schirme aus vielen kleinen Blüten.'),
        match('Welches Merkmal gehört zu welcher Familie?', [['Kreuzblütengewächse', '4 Kronblätter wie ein Kreuz, Schoten'], ['Nelkengewächse', 'gegabelt verzweigter Spross, enge Kelchröhre'], ['Rosengewächse', '5 Kronblätter und sehr viele Staubblätter'], ['Lippenblütengewächse', 'Ober- und Unterlippe'], ['Süßgräser', 'hohle Halme mit Knoten']]),
        mc('Welche Obstsorten gehören zu den **Rosengewächsen**?', ['Kirsche, Apfel, Erdbeere', 'Banane, Ananas, Kiwi', 'Tomate, Gurke, Paprika', 'Kartoffel, Möhre, Zwiebel'], 'Rosengewächse haben oft fünf Kronblätter und viele Staubblätter.'),
        mc('Warum duften viele Lippenblütengewächse so stark?', ['Sie enthalten stark riechende Öle – darum sind viele Gewürze', 'Sie werden parfümiert', 'Sie wachsen im Mist', 'Sie blühen nur nachts'], 'Salbei, Thymian, Basilikum, Oregano, Pfefferminze.'),
        mc('Woran erkennt man **Süßgräser**?', ['Runde, hohle Halme mit Knoten und schmalen Blättern', 'Bunte Kronblätter', 'Dornen am Stängel', 'Blattrosette und Pappus'], 'Die Blüten sitzen in Ährchen am Ende des Halms.'),
        mc('Wie heißt eine Pflanzenfamilie, deren Blütenstand wie ein Schirm aussieht?', ['Doldengewächse', 'Korbblütengewächse', 'Kreuzblütengewächse', 'Nelkengewächse'], 'Alle Blütenstiele entspringen an einer Stelle des Stängels.'),
        mc('Was bedeutet **Stammesgeschichte und Verwandtschaft**?', ['Arten einer Familie stammen von einem gemeinsamen Vorfahren ab', 'Alle Pflanzen sind gleich alt', 'Nur Tiere haben Vorfahren', 'Pflanzen wählen ihre Familie selbst'], 'Je jünger der gemeinsame Vorfahr, desto näher sind die Arten verwandt.'),
        word('Der obere Teil einer Lippenblüte heißt …', 'OBERLIPPE'),
        mc('Wann haben Menschen mit Gräserpollen-Allergie die größten Probleme?', ['Von Mai bis Juli', 'Im Dezember', 'Nur im Februar', 'Das ganze Jahr gleich'], 'Laut Pollenflugkalender blühen die Gräser vor allem im Frühsommer.'),
        tf('Alle Pflanzen im Pollenflugkalender werden durch den Wind bestäubt.', true, 'Nur Windblütler geben so viel Pollen in die Luft ab – deshalb lösen sie Heuschnupfen aus.'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: 'samen', chapter: '6', title: 'Samen & Früchte unterwegs', emoji: '🍁', sub: 'Schraubenflieger, Klettfrucht, Lockfrucht & Co.',
    sayWho: 'sheep', say: 'Mäh! Mir hängen lauter Kletten im Fell. Hab ich jetzt etwa der Pflanze geholfen?',
    explain: [
      ['Warum Samen reisen', 'Früchte enthalten **Samen**, aus denen neue Pflanzen wachsen. Werden sie weit weg getragen, nehmen die jungen Pflanzen der Mutterpflanze nicht Licht, Wasser und Platz weg – und die Art kann **neue Standorte erobern**.', ''],
      ['Verbreitung durch den Wind', '**Flugfrüchte** sind leicht: **Schraubenflieger** drehen sich wie ein Propeller (Ahorn, Linde, Hainbuche). **Schirmflieger** schweben am Fallschirm (Löwenzahn). **Streufrüchte/Körnchenflieger** streuen winzige Samen aus, wenn Wind oder Tiere sie anstoßen (Klatschmohn).', ''],
      ['Verbreitung durch Tiere', '**Lockfrüchte:** auffällig gefärbt, mit hartschaligen, unverdaulichen Samen – Vögel fressen sie und scheiden die Samen woanders aus (Schneeball, Eberesche, Kirsche).\n**Klettfrüchte:** Hakenhaare wie ein Klettverschluss – sie hängen an Fell, Gefieder oder Kleidung (Klette).\n**Ameisenfrüchte:** nahrhafte Anhängsel – Ameisen tragen sie in ihren Bau (Veilchen).\n**Versteckverbreitung:** Eichhörnchen verstecken Nüsse und vergessen manche (Haselnuss, Eichel).', ''],
      ['Verbreitung durch Wasser und selbst', '**Schwimmsamen** treiben mit der Strömung (Seerose, Kokosnuss).\n**Schleuderfrüchte** springen blitzschnell auf und schleudern die Samen heraus (Springkraut, Storchschnabel).', ''],
    ],
    facts: ['Der Klettverschluss wurde der Klette abgeschaut – Technik nach dem Vorbild der Natur nennt man **Bionik**.', 'Das Springkraut schleudert seine Samen mehrere Meter weit – darum heißt es auch „Rühr-mich-nicht-an“.', 'Kokosnüsse können monatelang übers Meer treiben und dann an einer fremden Küste keimen.'],
    task: ['Fantasie-Früchte', 'Erfinde für jeden Fruchttyp (Flugfrucht, Schleuderfrucht, Klettfrucht, Lockfrucht, Schwimmfrucht) eine **möglichst verrückte Fantasie-Frucht** und zeichne sie. Überlege vorher: Was muss die Frucht können, um weit zu reisen? Vergleiche danach mit echten Beispielen.'],
    levels: [
      { title: 'Fliegen, kletten, schleudern', emoji: '🪂', genCount: 4, gens: [gSeedSort, gSeedType, gSeedSort, gSeedType], questions: [
        match('Welcher Fruchttyp funktioniert wie?', [['Schraubenflieger', 'dreht sich wie ein Propeller'], ['Schirmflieger', 'schwebt an einem Fallschirm'], ['Klettfrucht', 'Hakenhaare bleiben im Fell hängen'], ['Lockfrucht', 'bunt und lecker, wird gefressen'], ['Schleuderfrucht', 'springt auf und schleudert Samen weg']]),
        mc('Warum enthalten **Lockfrüchte** hartschalige, unverdauliche Samen?', ['Damit die Samen den Darm der Tiere unbeschadet überstehen', 'Damit sie schwerer sind', 'Damit Tiere sie nicht fressen', 'Damit sie im Wasser schwimmen'], 'Mit dem Kot werden die Samen an einem anderen Ort ausgeschieden – sogar mit Dünger!'),
        mc('Warum tragen Ameisen manche Samen in ihren Bau?', ['Die Samen haben ein nahrhaftes Anhängsel, das Ameisen fressen', 'Ameisen bauen damit ihr Nest', 'Die Samen leuchten', 'Ameisen pflanzen Gärten an'], 'Den Samen selbst lassen sie liegen – so wird er verbreitet.'),
        mc('Warum ist es für eine Pflanze gut, wenn ihre Samen weit weg landen?', ['Die Jungpflanzen machen der Mutterpflanze nicht Licht, Wasser und Platz streitig', 'Weit weg ist es immer wärmer', 'Samen keimen nur nach langer Reise', 'Damit Tiere sie nicht finden'], 'Außerdem kann die Art neue Lebensräume besiedeln.'),
        tf('Eichhörnchen helfen der Haselnuss, sich zu verbreiten.', true, 'Sie verstecken Nüsse als Wintervorrat – und vergessen viele davon.'),
        word('Diese Frucht hat Hakenhaare wie ein Klettverschluss:', 'KLETTE'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: 'baeume', chapter: 'Wald', title: 'Bäume bestimmen', emoji: '🌳', sub: 'Blätter, Nadeln und Früchte – mit dem Bestimmungsschlüssel',
    sayWho: 'alpaca', say: 'Gefingert, gefiedert, gelappt oder gesägt? Mit dem **Bestimmungsschlüssel** findest du jeden Baum!',
    explain: [
      ['Wie ein Bestimmungsschlüssel funktioniert', 'Man beantwortet Schritt für Schritt Fragen mit zwei (oder mehr) Möglichkeiten und folgt dem passenden Weg – bis man beim Namen ankommt.\n1. Ist das Blatt **zusammengesetzt** (aus vielen Blättchen) oder **einzeln**?\n2. Wie ist der **Rand**: ganzrandig, gesägt, gebuchtet oder gelappt?\n3. Welche **Form** hat das Blatt?', ''],
      ['Zusammengesetzte Blätter', '**Gefingert** (wie eine Hand): Rosskastanie.\n**Gefiedert**, Blättchen fein gesägt: Eberesche.\n**Gefiedert**, unregelmäßig gesägt: Esche.', ''],
      ['Einzelne Blätter', '**Ganzrandig/wellig**, Nerven gerade zum Rand: Rotbuche.\n**Gebuchtet:** Eiche (Rand glatt), Weißdorn (gezähnt).\n**Gelappt:** Spitzahorn (Lappen zipfelig, glatt), Bergahorn (Lappen gesägt).\n**Gesägt:** Linde (herzförmig), Birke (dreieckig, Stiel rund), Schwarzpappel (dreieckig, Stiel platt), Hainbuche (oval, doppelt gesägt), Zitterpappel (rundlich, Stiel seitlich platt), Vogelkirsche (Stiel mit roten Drüsen).', ''],
      ['Nadelbäume', '**Fichte:** spitze Nadeln rundherum, Zapfen hängen.\n**Tanne:** flache Nadeln mit zwei weißen Streifen, Zapfen stehen aufrecht.\n**Kiefer:** lange Nadeln zu zweit.\n**Lärche:** Nadeln in Büscheln, wirft sie im Herbst ab.', 'Merkspruch: „Die Fichte sticht, die Tanne nicht.“'],
      ['Bäume und ihre Früchte', 'Eiche → Eichel · Rotbuche → Bucheckern · Ahorn → Flügelfrüchte · Rosskastanie → stachelige Kapsel · Linde → Nüsschen am Flügelblatt · Eberesche → rote Vogelbeeren · Esche → Flügelfrüchte in Büscheln · Platane → Kugeln · Birke → Kätzchen mit Flügelnüsschen · Nadelbäume → Zapfen.', ''],
    ],
    facts: ['Eine große Buche hat rund 200 000 Blätter.', 'Eichen können über 1000 Jahre alt werden.', 'Die Lärche ist der einzige heimische Nadelbaum, der im Herbst seine Nadeln abwirft.'],
    task: ['Blätter-Sammlung', 'Sammle draußen **mindestens acht verschiedene Blätter** (Wald, Park, Straße). Bestimme sie mit dem Bestimmungsschlüssel, presse sie zwischen Zeitungspapier in einem dicken Buch und klebe sie mit Name, Fundort und Datum ins Heft.'],
    levels: [
      { title: 'Blätter-Detektiv', emoji: '🍃', genCount: 5, gens: [gLeaf, gLeaf, gLaubNadel, gLeaf], questions: [
        mc('Was ist der erste Schritt im Bestimmungsschlüssel für Laubbäume?', ['Ist das Blatt zusammengesetzt oder einzeln?', 'Wie groß ist der Baum?', 'Welche Farbe hat die Rinde?', 'Wie alt ist der Baum?'], 'Danach schaut man auf Blattrand und Blattform.'),
        sort('Zusammengesetztes oder einzelnes Blatt?', ['zusammengesetzt', 'einzeln'], [['Rosskastanie', 0], ['Eberesche', 0], ['Esche', 0], ['Rotbuche', 1], ['Eiche', 1], ['Linde', 1]], 'Zusammengesetzte Blätter bestehen aus vielen Blättchen an einem Stiel.'),
        match('Welcher Blattrand ist das?', [['ganzrandig', 'glatter Rand ohne Zähne'], ['gesägt', 'kleine spitze Zähne wie eine Säge'], ['gebuchtet', 'runde Einbuchtungen'], ['gelappt', 'tiefe Einschnitte in Lappen']]),
        mc('Wie unterscheidet man Spitzahorn und Bergahorn?', ['Spitzahorn: zipfelige Lappen mit glattem Rand – Bergahorn: Lappen mit gesägtem Rand', 'Am Geruch', 'An der Blattfarbe', 'Gar nicht, es ist derselbe Baum'], 'Beide haben gelappte Blätter und Flügelfrüchte.'),
        mc('Wie unterscheidet man Birke und Schwarzpappel?', ['Am Blattstiel: Birke rund, Schwarzpappel platt', 'An der Blattgröße', 'Die Birke hat Nadeln', 'Die Schwarzpappel hat gefiederte Blätter'], 'Beide haben dreieckige, gesägte Blätter.'),
      ] },
      { title: 'Früchte & Nadeln', emoji: '🌰', genCount: 5, gens: [gFruit, gFruitRev, gFruit, gLaubNadel], questions: [
        match('Welche Nadeln gehören zu welchem Baum?', [['Fichte', 'spitz, rund um den Zweig'], ['Tanne', 'flach mit zwei weißen Streifen'], ['Kiefer', 'lang, immer zu zweit'], ['Lärche', 'in Büscheln, fallen im Herbst ab']], 'Merkspruch: „Die Fichte sticht, die Tanne nicht.“'),
        tf('Tannenzapfen findet man oft ganz auf dem Waldboden.', false, 'Tannenzapfen stehen aufrecht und zerfallen am Baum. Was man findet, sind meist Fichtenzapfen!'),
        mc('Welcher heimische Nadelbaum verliert im Herbst seine Nadeln?', ['Lärche', 'Fichte', 'Tanne', 'Kiefer'], 'Vorher färben sich die Nadeln goldgelb.'),
        match('Welcher Baum hat welche Frucht?', [['Eiche', 'Eichel'], ['Rotbuche', 'Bucheckern'], ['Rosskastanie', 'Kastanie in stacheliger Kapsel'], ['Eberesche', 'rote Vogelbeeren']]),
        mc('Welche Bäume haben Früchte, die wie ein Propeller fliegen?', ['Ahorn, Linde und Hainbuche', 'Eiche und Rotbuche', 'Rosskastanie und Eberesche', 'Fichte und Tanne'], 'Schraubenflieger drehen sich und fliegen dadurch länger.'),
      ] },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: 'wirbellose', chapter: '7', title: 'Wirbellose Tiere', emoji: '🐝', sub: 'Insekten, Honigbiene, Spinnen, Schnecken, Würmer, Waldboden',
    sayWho: 'sheep', say: 'Eine Spinne ist ein Insekt mit zwei Extra-Beinen. Hab ich recht? Mäh?',
    explain: [
      ['Insekten', 'Drei Körperabschnitte: **Kopf** (Fühler, Facettenaugen), **Brust** (6 Beine, meist 4 Flügel), **Hinterleib**. Außenskelett aus **Chitin**, Atmung durch **Tracheen**. Entwicklung: **vollständige Metamorphose** (Ei → Larve → Puppe → Insekt) oder unvollständig (ohne Puppe, z. B. Heuschrecke).', ''],
      ['Die Honigbiene', '**Königin** (legt Eier), **Arbeiterinnen** (Putzbiene → Ammenbiene → Baubiene → Wächterin → Sammelbiene) und **Drohnen** (Männchen). Mit dem **Schwänzeltanz** zeigen Bienen Richtung und Entfernung von Futter. Auch Ameisen bilden Insektenstaaten.', ''],
      ['Spinnentiere', '**Acht Beine**, nur **zwei Körperabschnitte** (Vorderkörper und Hinterleib), keine Fühler, keine Flügel. Die **Kreuzspinne** baut ein Radnetz und lähmt Beute mit Gift. Auch **Zecken** und Milben sind Spinnentiere – Zecken können Krankheiten übertragen.', ''],
      ['Schnecken', 'Die **Weinbergschnecke** ist ein **Weichtier**: weicher Körper, Kalkgehäuse, kriecht auf einem Schleimfilm mit dem **Kriechfuß**. Augen sitzen auf den langen Fühlern, mit der **Raspelzunge** frisst sie Pflanzen. Sie ist **Zwitter**.', ''],
      ['Regenwurm', 'Körper aus vielen **Ringen (Segmenten)** mit winzigen **Borsten**. Er atmet durch die feuchte **Haut**, frisst Erde und abgestorbene Blätter und **lockert und düngt** den Boden. Bei Regen kommt er nach oben, weil seine Gänge voll Wasser laufen.', ''],
      ['Leben im Waldboden', 'Asseln, Tausendfüßer, Springschwänze, Regenwürmer und Milben zersetzen Laub zu **Humus**. Ohne sie würde der Wald im eigenen Laub ersticken. **Asseln** sind Krebstiere und lieben es **dunkel und feucht**.', ''],
    ],
    facts: ['Eine Biene schlägt etwa 200-mal pro Sekunde mit den Flügeln – daher das Summen.', 'Auf einem Hektar Wiese leben bis zu 3 Millionen Regenwürmer.', 'Spinnenseide ist reißfester als ein gleich dicker Stahlfaden.'],
    task: ['Asseln-Versuch', 'Leg in eine Schale eine **feuchte und eine trockene** Hälfte (Küchenpapier) und decke eine Seite ab, sodass sie **dunkel** ist. Setz ein paar Asseln in die Mitte und schau nach 10 Minuten: Wo sind sie? Lass sie danach wieder frei.'],
    levels: [
        { title: 'Krabbel-Check', emoji: '🐞', questions: [
          mc('Wie viele Beine hat ein Insekt?', ['6', '8', '4', '10'], 'Sechs Beine – immer. Sie sitzen alle an der Brust.'),
          order('Ordne die Körperabschnitte eines Insekts von **vorne nach hinten**.', ['Kopf', 'Brust', 'Hinterleib'], 'Das Wort „Insekt“ kommt von „eingeschnitten“ – wegen der Kerben zwischen den Abschnitten.'),
          sort('Insekt oder kein Insekt?', ['Insekt', 'kein Insekt'], [['Honigbiene', 0], ['Kreuzspinne', 1], ['Marienkäfer', 0], ['Kellerassel', 1], ['Zitronenfalter', 0], ['Zecke', 1]], 'Spinnen und Zecken haben acht Beine, Asseln sogar vierzehn – sie sind Krebstiere.'),
          match('Wer macht was im Bienenstock?', [['Königin', 'legt die Eier'], ['Drohne', 'begattet die Königin'], ['Arbeiterin', 'sammelt Nektar und pflegt die Brut']]),
          order('Vom Ei zum Schmetterling – ordne die Verwandlung.', ['Ei', 'Raupe', 'Puppe', 'Falter'], 'Die Raupe frisst und wächst, in der Puppe wird der Körper komplett umgebaut.'),
          tf('Spinnen sind Insekten.', false, 'Spinnen haben acht Beine und nur zwei Körperabschnitte. Sie gehören zu den Spinnentieren.'),
          word('So heißt die männliche Biene:', 'DROHNE'),
          mc('An welchem Körperabschnitt sitzen Beine und Flügel?', ['An der Brust', 'Am Kopf', 'Am Hinterleib', 'Überall'], 'In der Brust stecken die kräftigen Muskeln zum Laufen und Fliegen.'),
          mc('Woraus machen Bienen Honig?', ['Aus dem Nektar der Blüten', 'Aus Pollen und Wasser', 'Aus Wachs', 'Aus Baumharz'], 'Im Stock wird der Nektar eingedickt und in Waben gelagert – als Wintervorrat.'),
        ] },
        { title: 'Bienen-Flüsterer', emoji: '🍯', questions: [
          mc('Was teilt eine Biene den anderen mit dem **Schwänzeltanz** mit?', ['Richtung und Entfernung einer Futterquelle', 'Dass Gefahr droht', 'Dass die Königin gestorben ist', 'Dass es regnen wird'], 'Je länger sie schwänzelt, desto weiter ist das Futter entfernt.'),
          mc('Wie atmen Insekten?', ['Durch feine Luftröhren, die Tracheen', 'Mit Lungen', 'Mit Kiemen', 'Durch den Mund'], 'Die Luft strömt durch kleine Öffnungen an den Körperseiten ein.'),
          mc('Woraus besteht der Panzer (das Außenskelett) der Insekten?', ['Aus Chitin', 'Aus Knochen', 'Aus Kalk', 'Aus Horn'], 'Der Panzer wächst nicht mit – darum müssen sich Larven häuten.'),
          mc('Was ist das Besondere an **Facettenaugen**?', ['Sie bestehen aus sehr vielen Einzelaugen', 'Sie können im Dunkeln leuchten', 'Sie sehen nur Schwarz-Weiß', 'Sie sitzen an den Beinen'], 'Eine Biene hat pro Auge etwa 5 000 Einzelaugen. Damit erkennt sie Bewegungen sehr schnell.'),
          order('Die Berufe einer Arbeiterin – ordne nach dem Alter.', ['Putzbiene', 'Ammenbiene', 'Baubiene', 'Wächterin', 'Sammelbiene'], 'Erst am Ende ihres kurzen Lebens (im Sommer rund sechs Wochen) fliegt sie nach draußen.'),
          mc('Warum sind Bienen für uns Menschen so wichtig?', ['Sie bestäuben Obstbäume und viele andere Nutzpflanzen', 'Sie fressen Schädlinge', 'Sie lockern den Boden', 'Sie reinigen die Luft'], 'Ohne Bestäuber gäbe es kaum Äpfel, Kirschen oder Erdbeeren.'),
          tf('Eine Honigbiene stirbt, nachdem sie einen Menschen gestochen hat.', true, 'Ihr Stachel hat Widerhaken und bleibt in unserer Haut stecken. Wespen können dagegen mehrmals stechen.'),
          mc('Wie viele Bienen leben im Sommer in einem Bienenvolk?', ['Bis zu 50 000', 'Etwa 50', 'Etwa 500', 'Über 5 Millionen'], 'Im Winter sind es nur noch etwa 10 000, die sich zur Wintertraube zusammenkuscheln.'),
          mc('Woran erkennt man eine **vollständige** Metamorphose?', ['Es gibt ein Puppenstadium', 'Die Larve sieht aus wie das erwachsene Tier', 'Das Tier häutet sich nie', 'Es gibt keine Eier'], 'Heuschrecken haben keine Puppe: Ihre Larven sehen schon aus wie kleine Heuschrecken (unvollständige Metamorphose).'),
          word('Aus diesem Stoff bauen Bienen ihre Waben:', 'WACHS'),
        ] },
      { title: 'Spinnen, Schnecken, Würmer', emoji: '🐌', questions: [
        sort('Insekt, Spinnentier oder anderes?', ['Insekt', 'Spinnentier', 'weder noch'], [['Marienkäfer', 0], ['Kreuzspinne', 1], ['Zecke', 1], ['Weinbergschnecke', 2], ['Regenwurm', 2], ['Ameise', 0], ['Kellerassel', 2]], 'Insekten: 6 Beine. Spinnentiere: 8 Beine. Schnecken, Würmer und Asseln (Krebstiere) sind andere Gruppen der Wirbellosen.'),
        match('Was gehört zu wem?', [['Kreuzspinne', 'Radnetz und Giftklauen'], ['Weinbergschnecke', 'Kalkgehäuse und Kriechfuß'], ['Regenwurm', 'Ringe mit Borsten'], ['Zecke', 'saugt Blut und kann Krankheiten übertragen']]),
        mc('Wie viele Körperabschnitte hat eine Spinne?', ['2', '3', '4', '6'], 'Vorderkörper (mit Beinen) und Hinterleib (mit Spinnwarzen).'),
        mc('Womit atmet der Regenwurm?', ['Durch seine feuchte Haut', 'Mit Lungen', 'Mit Kiemen', 'Mit Tracheen'], 'Darum muss seine Haut immer feucht sein.'),
        mc('Warum ist der Regenwurm so wichtig für den Boden?', ['Er lockert und düngt den Boden', 'Er frisst schädliche Insekten', 'Er macht den Boden trocken', 'Er schützt die Wurzeln vor Kälte'], 'Seine Gänge lassen Luft und Wasser in den Boden; sein Kot ist bester Dünger.'),
        mc('Wo sitzen die Augen der Weinbergschnecke?', ['An der Spitze der langen Fühler', 'Am Gehäuse', 'Am Kriechfuß', 'Sie hat keine Augen'], 'Bei Gefahr zieht sie die Fühler blitzschnell ein.'),
        mc('Welche Bedingungen mögen Asseln?', ['Dunkel und feucht', 'Hell und trocken', 'Heiß und sonnig', 'Kalt und windig'], 'Asseln sind Krebstiere und trocknen an der Luft schnell aus.'),
        mc('Was machen die Tiere im Waldboden mit dem Laub?', ['Sie zersetzen es zu Humus', 'Sie bauen daraus Nester', 'Sie lagern es für den Winter', 'Gar nichts'], 'So entsteht fruchtbare Erde für neue Pflanzen.'),
        word('Ein Tier mit weichem Körper wie die Schnecke ist ein …', 'WEICHTIER'),
        tf('Spinnen haben Fühler und Flügel.', false, 'Spinnen haben weder Fühler noch Flügel – dafür Kieferklauen und Spinnwarzen.'),
      ] },
    ],
  },
  ],
};
