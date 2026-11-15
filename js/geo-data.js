// Erdkunde (Geographie) Klasse 6, Gymnasium Baden-Württemberg.
// Themenauswahl und Reihenfolge folgen dem Kapitel "Wir erkunden Deutschland" im Schulbuch
// (Diercke Geographie 5/6, Gymnasium Baden-Württemberg, S. 50–77) und den Heftaufschrieben:
// Orientierung in Deutschland und Baden-Württemberg, Wetter und Klima, Nordseeküste,
// Küstenschutz, Wattenmeer, Hamburger Hafen, Nutzungskonflikte, Harz.
// Alle Texte, Fragen und Zeichnungen sind selbst erstellt – nichts ist aus dem Buch kopiert.

import { mapFig, klimaFig, tideFig, CITIES, RIVERS, MOUNTAINS, STATIONS, MONTHS } from './maps.js';
import { chart } from './figures.js';

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const dec = (x) => String(Math.round(x * 10) / 10).replace('.', ',');

const mc = (q, a, why, extra = {}) => ({ t: 'mc', q, a, c: 0, why, ...extra });
const tf = (q, c, why) => ({ t: 'tf', q, c, why });
const sort = (q, cats, items, why) => ({ t: 'sort', q, cats, items, why });
const match = (q, pairs, why) => ({ t: 'match', q, pairs, why });
const order = (q, items, why) => ({ t: 'order', q, items, why });
const word = (q, c, why) => ({ t: 'scramble', q, c, why });

// ---------- Karten-Aufgaben ----------

const others = (all, name, n = 3) => shuffle(all.filter((x) => x !== name)).slice(0, n);
const REGION = { de: 'Deutschland', bw: 'Baden-Württemberg' };

const CITY_HINT = {
  Hamburg: 'Hamburg liegt im Norden an der Elbe.', Bremen: 'Bremen liegt im Nordwesten an der Weser.', Hannover: 'Hannover ist die Landeshauptstadt von Niedersachsen.',
  Berlin: 'Berlin liegt im Osten – die Bundeshauptstadt.', Köln: 'Köln liegt im Westen am Rhein.', Leipzig: 'Leipzig liegt in Sachsen, westlich von Dresden.',
  Dresden: 'Dresden liegt ganz im Osten an der Elbe.', 'Frankfurt am Main': 'Frankfurt liegt in der Mitte am Main.', Nürnberg: 'Nürnberg liegt in Bayern, nördlich von München.',
  Stuttgart: 'Stuttgart liegt im Südwesten am Neckar.', München: 'München liegt im Süden, nicht weit von den Alpen.', Kiel: 'Kiel liegt ganz im Norden an der Ostsee.',
  Rostock: 'Rostock liegt im Nordosten an der Ostsee.',
  Mannheim: 'Mannheim liegt ganz im Nordwesten – dort mündet der Neckar in den Rhein.', Heidelberg: 'Heidelberg liegt am Neckar, kurz vor Mannheim.',
  Heilbronn: 'Heilbronn liegt am Neckar, nördlich von Stuttgart.', Karlsruhe: 'Karlsruhe liegt am Rhein im Westen.', Pforzheim: 'Pforzheim liegt zwischen Karlsruhe und Stuttgart.',
  'Baden-Baden': 'Baden-Baden liegt am Westrand des Schwarzwalds.', Offenburg: 'Offenburg liegt in der Rheinebene zwischen Karlsruhe und Freiburg.',
  Reutlingen: 'Reutlingen liegt am Fuß der Schwäbischen Alb, südlich von Stuttgart.', Ulm: 'Ulm liegt ganz im Osten an der Donau.',
  Freiburg: 'Freiburg liegt im Südwesten am Rand des Schwarzwalds.', Friedrichshafen: 'Friedrichshafen liegt am Nordufer des Bodensees.', Konstanz: 'Konstanz liegt am Bodensee – direkt an der Grenze zur Schweiz.',
};

// Ein roter Punkt – welche Stadt ist das?
const gCity = (kind) => () => {
  const name = pick(Object.keys(CITIES[kind]));
  return mc('Welche Stadt liegt beim **roten Punkt**?', [name, ...others(Object.keys(CITIES[kind]), name)], CITY_HINT[name], { fig: mapFig(kind, { dots: [{ name }] }) });
};

// Vier nummerierte Punkte – wo liegt die Stadt?
const gCityWhere = (kind) => () => {
  // vier Städte, die auf der Karte nicht zu dicht beieinanderliegen
  const minDist = kind === 'bw' ? 0.4 : 1.2;
  const names = [];
  for (const n of shuffle(Object.keys(CITIES[kind]))) {
    const [la, lo] = CITIES[kind][n];
    if (names.every((m) => Math.hypot(CITIES[kind][m][0] - la, (CITIES[kind][m][1] - lo) * 0.65) >= minDist)) names.push(n);
    if (names.length === 4) break;
  }
  const i = rnd(0, names.length - 1);
  return { t: 'mc', q: `Bei welcher Nummer liegt **${names[i]}**?`, a: names.map((_, k) => `${k + 1}`), c: i, fixed: true, why: CITY_HINT[names[i]], fig: mapFig(kind, { dots: names.map((name, k) => ({ name, label: k + 1 })) }) };
};

const RIVER_HINT = {
  Rhein: 'Der Rhein kommt aus den Alpen, fließt durch den Bodensee und dann nach Norden bis in die Niederlande.',
  Elbe: 'Die Elbe fließt von Dresden über Magdeburg nach Hamburg und mündet in die Nordsee.',
  Donau: 'Die Donau entspringt im Schwarzwald und fließt nach **Osten** – bis ins Schwarze Meer.',
  Weser: 'Die Weser fließt durch Bremen und mündet bei Bremerhaven in die Nordsee.',
  Main: 'Der Main fließt durch Würzburg und Frankfurt und mündet bei Mainz in den Rhein.',
  Oder: 'Die Oder bildet die Grenze zu Polen und mündet in die Ostsee.',
  Neckar: 'Der Neckar fließt durch Tübingen, Stuttgart, Heilbronn und Heidelberg und mündet in Mannheim in den Rhein.',
};
const gRiver = (kind) => () => {
  const name = pick(Object.keys(RIVERS[kind]));
  const pool = kind === 'bw' ? ['Rhein', 'Neckar', 'Donau', 'Main', 'Elbe'] : Object.keys(RIVERS.de);
  return mc('Welcher Fluss ist **orange** hervorgehoben?', [name, ...others(pool, name)], RIVER_HINT[name], { fig: mapFig(kind, { river: name }) });
};

const MOUNTAIN_HINT = {
  Harz: 'Der Harz ist das nördlichste Mittelgebirge Deutschlands. Höchster Berg: der Brocken (1142 m).',
  Schwarzwald: 'Der Schwarzwald liegt im Südwesten, entlang des Rheins. Höchster Berg: der Feldberg (1493 m).',
  'Schwäbische Alb': 'Die Schwäbische Alb zieht sich schräg von Südwesten nach Nordosten durch Baden-Württemberg.',
  Erzgebirge: 'Das Erzgebirge liegt an der Grenze zu Tschechien, südlich von Dresden.',
  'Bayerischer Wald': 'Der Bayerische Wald liegt im Osten Bayerns an der Grenze zu Tschechien.',
  'Thüringer Wald': 'Der Thüringer Wald liegt mitten in Deutschland.',
  Alpen: 'Die Alpen liegen ganz im Süden – das einzige Hochgebirge Deutschlands.',
  Eifel: 'Die Eifel liegt ganz im Westen, an der Grenze zu Belgien und Luxemburg.',
  Odenwald: 'Der Odenwald liegt im Norden Baden-Württembergs, östlich von Heidelberg.',
};
const gMountain = (kind) => () => {
  const name = pick(Object.keys(MOUNTAINS[kind]));
  const pool = kind === 'bw' ? ['Schwarzwald', 'Schwäbische Alb', 'Odenwald', 'Harz', 'Alpen'] : Object.keys(MOUNTAINS.de);
  return mc('Welches Gebirge ist **orange** hervorgehoben?', [name, ...others(pool, name)], MOUNTAIN_HINT[name], { fig: mapFig(kind, { mountain: name }) });
};

// ---------- Bundesländer ----------

const LAENDER = [
  ['Baden-Württemberg', 'Stuttgart'], ['Bayern', 'München'], ['Berlin', 'Berlin'], ['Brandenburg', 'Potsdam'], ['Bremen', 'Bremen'], ['Hamburg', 'Hamburg'],
  ['Hessen', 'Wiesbaden'], ['Mecklenburg-Vorpommern', 'Schwerin'], ['Niedersachsen', 'Hannover'], ['Nordrhein-Westfalen', 'Düsseldorf'],
  ['Rheinland-Pfalz', 'Mainz'], ['Saarland', 'Saarbrücken'], ['Sachsen', 'Dresden'], ['Sachsen-Anhalt', 'Magdeburg'], ['Schleswig-Holstein', 'Kiel'], ['Thüringen', 'Erfurt'],
];
const FLAECHE = LAENDER.filter(([l, h]) => l !== h);
const gCapitalMatch = () => match('Welche Landeshauptstadt gehört zu welchem Bundesland?', shuffle(FLAECHE).slice(0, 4), 'Achtung, Verwechslungsgefahr: Hessen – Wiesbaden (nicht Frankfurt!), Nordrhein-Westfalen – Düsseldorf (nicht Köln!).');
const gCapitalMC = () => {
  const [land, stadt] = pick(FLAECHE);
  const all = FLAECHE.map((x) => x[1]);
  const tricky = { Hessen: 'Frankfurt am Main', 'Nordrhein-Westfalen': 'Köln', 'Mecklenburg-Vorpommern': 'Rostock', Bayern: 'Nürnberg', Sachsen: 'Leipzig', 'Baden-Württemberg': 'Karlsruhe', 'Schleswig-Holstein': 'Lübeck' }[land];
  const wrong = others(all, stadt, tricky ? 2 : 3);
  return mc(`Wie heißt die Landeshauptstadt von **${land}**?`, [stadt, ...(tricky ? [tricky] : []), ...wrong], `${land} – ${stadt}.`);
};
const gLandOf = () => {
  const [land, stadt] = pick(FLAECHE);
  return mc(`**${stadt}** ist die Hauptstadt von welchem Bundesland?`, [land, ...others(FLAECHE.map((x) => x[0]), land)], `${stadt} ist die Landeshauptstadt von ${land}.`);
};

// Maßstab: Strecke auf der Karte -> Wirklichkeit
const gScale = () => {
  const [per, unit] = pick([[100, 'km'], [50, 'km'], [20, 'km'], [10, 'km']]);
  const cm = rnd(2, 9);
  return { t: 'num', q: `📏 Auf einer Karte entspricht **1 cm** in Wirklichkeit ${per} ${unit}.\nDu misst zwischen zwei Städten **${cm} cm**.\nWie weit sind sie in Wirklichkeit voneinander entfernt (Luftlinie)?`, c: `${cm * per}`, unit, why: `${cm} · ${per} ${unit} = ${cm * per} ${unit}. So benutzt man die Maßstabsleiste: Strecke messen, dann umrechnen.` };
};

// ---------- Klimadiagramm ----------

const round5 = (x) => Math.round(x / 5) * 5;
const gKlima = () => {
  const st = pick(STATIONS);
  const fig = klimaFig(st);
  const iMaxT = st.t.indexOf(Math.max(...st.t));
  const iMinT = st.t.indexOf(Math.min(...st.t));
  const iMaxN = st.n.indexOf(Math.max(...st.n));
  const iMinN = st.n.indexOf(Math.min(...st.n));
  const months = (i) => { const o = [i, ...others([...MONTHS.keys()], i)].sort((x, y) => x - y); return { a: o.map((k) => MONTHS[k]), c: o.indexOf(i) }; };
  let v = rnd(1, 6);
  if (v === 4 && st.n.filter((n) => n === st.n[iMinN]).length > 1) v = 3; // nicht eindeutig
  if (v === 1) return { t: 'mc', q: 'In welchem Monat ist es hier am **wärmsten**?', ...months(iMaxT), fixed: true, fig, why: `Die rote Temperaturkurve hat im ${MONTHS[iMaxT]} ihren höchsten Punkt (${dec(st.t[iMaxT])} °C).` };
  if (v === 2) return { t: 'mc', q: 'In welchem Monat ist es hier am **kältesten**?', ...months(iMinT), fixed: true, fig, why: `Die rote Temperaturkurve hat im ${MONTHS[iMinT]} ihren tiefsten Punkt (${dec(st.t[iMinT])} °C).` };
  if (v === 3) return { t: 'mc', q: 'In welchem Monat fällt hier am **meisten Niederschlag**?', ...months(iMaxN), fixed: true, fig, why: `Die höchste blaue Säule steht im ${MONTHS[iMaxN]} (${st.n[iMaxN]} mm). Niederschlag liest man an der **rechten** Achse ab.` };
  if (v === 4) return { t: 'mc', q: 'In welchem Monat fällt hier am **wenigsten Niederschlag**?', ...months(iMinN), fixed: true, fig, why: `Die niedrigste blaue Säule steht im ${MONTHS[iMinN]} (${st.n[iMinN]} mm).` };
  const i = rnd(0, 11);
  if (v === 5) {
    const n = round5(st.n[i]);
    const o = [...new Set([n, n + 30, Math.max(5, n - 30), n + 60])].sort((x, y) => x - y);
    return { t: 'mc', q: `Wie viel Niederschlag fällt hier im **${MONTHS[i]}** ungefähr?`, a: o.map((x) => `etwa ${x} mm`), c: o.indexOf(n), fixed: true, fig, why: `Niederschlag: blaue Säule, **rechte** Achse. Im ${MONTHS[i]} sind es ${st.n[i]} mm.` };
  }
  const t = Math.round(st.t[i]);
  const o = [...new Set([t, t + 9, t - 9, t + 18])].sort((x, y) => x - y);
  return { t: 'mc', q: `Wie warm ist es hier im **${MONTHS[i]}** im Durchschnitt ungefähr?`, a: o.map((x) => `etwa ${String(x).replace('-', '−')} °C`), c: o.indexOf(t), fixed: true, fig, why: `Temperatur: rote Kurve, **linke** Achse. Im ${MONTHS[i]} sind es ${dec(st.t[i]).replace('-', '−')} °C.` };
};

const gSchwankung = () => {
  const st = pick(STATIONS);
  const mx = Math.max(...st.t); const mn = Math.min(...st.t);
  return { t: 'num', q: `🌡️ In ${st.name} ist der wärmste Monat im Durchschnitt ${dec(mx)} °C warm, der kälteste ${dec(mn).replace('-', '−')} °C.\nWie groß ist der **Unterschied** zwischen den beiden Monaten?`, c: dec(mx - mn), unit: 'Grad', why: `${dec(mx)} − ${mn < 0 ? `(${dec(mn).replace('-', '−')})` : dec(mn)} = ${dec(mx - mn)} Grad. Diesen Unterschied gibt man an, wenn man ein Klima beschreibt.` };
};

// ---------- Gezeiten ----------

const TIDE_NAMES = ['Hochwasser', 'Niedrigwasser', 'Flut', 'Ebbe', 'Tidenhub'];
const gTideFig = () => {
  const i = rnd(0, 4);
  const why = ['**Hochwasser** ist der höchste Wasserstand.', '**Niedrigwasser** ist der niedrigste Wasserstand.', '**Flut** ist die Zeit, in der das Wasser **steigt** (auflaufendes Wasser).', '**Ebbe** ist die Zeit, in der das Wasser **fällt** (ablaufendes Wasser).', 'Der **Tidenhub** ist der Höhenunterschied zwischen Niedrigwasser und Hochwasser.'][i];
  return { t: 'mc', q: 'Die Kurve zeigt den Wasserstand an der Nordsee. Was ist mit **?** markiert?', a: TIDE_NAMES, c: i, fixed: true, fig: tideFig(['hoch', 'niedrig', 'flut', 'ebbe', 'hub'][i]), why };
};

const hm = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const gTideTime = () => {
  const start = rnd(1, 15) * 60 + rnd(0, 11) * 5;
  const high = Math.random() < 0.5;
  const ans = start + 372; // 6 Stunden 12 Minuten
  const opts = [ans, start + 180, start + 745 - 60, start + 60].map(hm);
  return mc(`⏰ ${high ? 'Hochwasser' : 'Niedrigwasser'} ist um **${hm(start)} Uhr**.\nWann ist ungefähr das nächste **${high ? 'Niedrigwasser' : 'Hochwasser'}**?`, opts.map((x) => `gegen ${x} Uhr`), `Zwischen Hochwasser und Niedrigwasser liegen immer etwa **6 Stunden und 12 Minuten**. ${hm(start)} + 6:12 = ${hm(ans)} Uhr.`);
};

const gTidenhub = () => {
  const low = rnd(2, 12) / 10;
  const hub = rnd(18, 35) / 10;
  return { t: 'num', q: `📏 Am Pegel steht das Wasser bei Niedrigwasser **${dec(low)} m** hoch, bei Hochwasser **${dec(low + hub)} m**.\nWie groß ist der **Tidenhub**?`, c: dec(hub), unit: 'm', why: `Tidenhub = Hochwasser − Niedrigwasser = ${dec(low + hub)} m − ${dec(low)} m = ${dec(hub)} m.` };
};

const gBaden = () => {
  const hw = rnd(10, 17) * 60 + rnd(0, 11) * 5;
  const good = Math.random() < 0.5;
  const t = good ? hw - rnd(2, 6) * 10 : hw + 372 - rnd(2, 6) * 10;
  return { t: 'tf', q: `🏊 Laut Tidenkalender ist heute um **${hm(hw)} Uhr Hochwasser** und um ${hm(hw + 372)} Uhr Niedrigwasser.\nMeike will um **${hm(t)} Uhr** in der Nordsee schwimmen. Ist das eine gute Badezeit?`, c: good, labels: ['Ja 👍', 'Nein 👎'], why: good ? 'Kurz vor Hochwasser ist das Wasser da – und es läuft noch auf. Das ist die beste Badezeit.' : 'Kurz vor Niedrigwasser ist das Meer weit weg – man sieht nur Watt. Außerdem ist ablaufendes Wasser gefährlich: Es zieht einen vom Strand weg.' };
};

// ---------- Hamburger Hafen: Säulendiagramm ----------

const gHafenChart = () => {
  const years = ['1995', '2000', '2005', '2010', '2014'];
  const vals = [2.8, 4.1, 8, 7.8, 9.7];
  const fig = `<div class="fig-title">Containerumschlag im Hamburger Hafen (in Millionen Containern)</div>${chart(years, vals)}`;
  const v = rnd(1, 5);
  if (v === 1) return { t: 'mc', q: 'In welchem Jahr wurden die **meisten** Container umgeschlagen?', a: years, c: 4, fixed: true, fig, why: 'Die höchste Säule steht beim Jahr 2014 (fast 10 Millionen).' };
  if (v === 2) return mc('Zwischen welchen Jahren ist der Umschlag **zurückgegangen**?', ['2005 und 2010', '1995 und 2000', '2000 und 2005', '2010 und 2014'], 'Die Säule von 2010 ist etwas niedriger als die von 2005. Sonst ist der Umschlag immer gestiegen.', { fig });
  if (v === 3) return mc('Etwa wie viele Millionen Container waren es im Jahr **2005**?', ['etwa 8', 'etwa 4', 'etwa 6', 'etwa 10'], 'Geh von der Säule waagrecht nach links zur Achse: Sie endet bei 8.', { fig });
  if (v === 4) return { t: 'tf', q: 'Von 1995 bis 2014 hat sich der Containerumschlag **mehr als verdreifacht**.', c: true, fig, why: '1995 waren es knapp 3 Millionen, 2014 fast 10 Millionen. 3 · 3 = 9 – also sogar etwas mehr als das Dreifache.' };
  return mc('Zwischen welchen Jahren ist der Umschlag **am stärksten** gestiegen?', ['2000 und 2005', '1995 und 2000', '2005 und 2010', '2010 und 2014'], 'Von 2000 bis 2005 hat sich die Zahl fast verdoppelt – von etwa 4 auf 8 Millionen.', { fig });
};

// ---------- Themen ----------

export const GEO = {
  id: 'geo',
  name: 'Erdkunde',
  emoji: '🌍',
  who: 'sheep',
  motto: 'Deutschland-Tour',
  cheatName: 'Reiseführer',
  taskName: 'Entdecker-Auftrag',
  taskEmoji: '🧭',
  credit: 'Themen und Reihenfolge passen zum Kapitel „Wir erkunden Deutschland“ im Diercke Geographie 5/6 (Gymnasium Baden-Württemberg, S. 50–77). Texte, Fragen und Karten sind selbst erstellt; die Karten sind vereinfacht.',
  intro: 'Mäh! Rucksack gepackt? Wir gehen auf **Deutschland-Tour**: vom Schwarzwald bis ans Wattenmeer. Mit stummen Karten, Klimadiagrammen und einem Entdecker-Auftrag an jeder Station!',
  topics: [
    // ------------------------------------------------------------------
    {
      id: 'deutschland', title: 'Deutschland im Überblick', emoji: '🗺️', sub: 'Städte, Flüsse, Gebirge, Bundesländer',
      sayWho: 'alpaca', say: 'Wer sich auf der Karte auskennt, findet sich überall zurecht. Fangen wir mit den wichtigsten Städten, Flüssen und Gebirgen an!',
      explain: [
        ['Die vier Großlandschaften', 'Von Norden nach Süden wird Deutschland immer höher:\n**Norddeutsches Tiefland** – flach, bis etwa 200 m\n**Mittelgebirgsland** – Berge bis etwa 1500 m (Harz, Schwarzwald …)\n**Alpenvorland** – hügelig\n**Alpen** – Hochgebirge, über 2000 m', 'Höchster Berg: die Zugspitze (2962 m)'],
        ['Die großen Flüsse', '**Rhein:** im Westen, fließt nach Norden in die Nordsee.\n**Elbe:** Dresden – Hamburg – Nordsee.\n**Weser:** Bremen – Nordsee.\n**Oder:** Grenze zu Polen – Ostsee.\n**Donau:** fließt als einziger großer Fluss nach **Osten** (Schwarzes Meer).\n**Main** und **Neckar** münden in den Rhein.', ''],
        ['16 Bundesländer', 'Deutschland hat 16 Bundesländer. Drei davon sind **Stadtstaaten**: Berlin, Hamburg und Bremen. Die anderen 13 heißen Flächenländer. Jedes Land hat eine Landeshauptstadt.', 'Baden-Württemberg – Stuttgart · Bayern – München · Hessen – Wiesbaden'],
        ['Meere und Inseln', '**Nordsee:** Sylt, Helgoland, die Ostfriesischen Inseln (z. B. Norderney, Wangerooge).\n**Ostsee:** Rügen (die größte deutsche Insel), Fehmarn, Usedom.', ''],
        ['Entfernungen messen', 'Mit der **Maßstabsleiste** rechnest du Strecken um: Strecke auf der Karte mit dem Lineal messen und mit der Leiste vergleichen.', '1 cm = 100 km → 4 cm = 400 km'],
      ],
      facts: ['Deutschland hat neun Nachbarländer – so viele wie kein anderes Land in Europa.', 'Der Bodensee ist so groß, dass man wegen der Erdkrümmung vom einen Ende das andere Ufer nicht sehen kann.', 'Die Zugspitze ist fast doppelt so hoch wie der Feldberg im Schwarzwald.'],
      task: ['Atlas-Rallye', 'Nimm deinen Atlas (oder eine Online-Karte) und plane eine Reise von deinem Wohnort nach **Hamburg**. Durch welche Bundesländer fährst du? Welche Flüsse überquerst du? Miss mit der Maßstabsleiste die Luftlinie.'],
      levels: [
        { title: 'Stumme Karte', emoji: '📍', genCount: 5, gens: [gCity('de'), gRiver('de'), gMountain('de'), gCityWhere('de'), gCity('de')], questions: [
          order('Ordne die Großlandschaften von **Norden nach Süden**.', ['Norddeutsches Tiefland', 'Mittelgebirgsland', 'Alpenvorland', 'Alpen'], 'Merke: Je weiter südlich, desto höher.'),
          mc('Welche ist die größte deutsche Insel?', ['Rügen', 'Sylt', 'Helgoland', 'Fehmarn'], 'Rügen liegt in der Ostsee und ist berühmt für seine weißen Kreidefelsen.'),
          sort('Nordsee oder Ostsee?', ['Nordsee', 'Ostsee'], [['Sylt', 0], ['Rügen', 1], ['Helgoland', 0], ['Fehmarn', 1], ['Usedom', 1], ['Norderney', 0]], 'Die Nordsee liegt westlich von Schleswig-Holstein, die Ostsee östlich.'),
          mc('Wie heißt der höchste Berg Deutschlands?', ['Zugspitze', 'Feldberg', 'Brocken', 'Watzmann'], 'Die Zugspitze in den Alpen ist 2962 m hoch.'),
          tf('Die Donau fließt in die Nordsee.', false, 'Die Donau fließt nach Osten durch viele Länder und mündet ins Schwarze Meer.'),
          word('Deutschlands höchster Berg:', 'ZUGSPITZE'),
          mc('In welches Meer mündet die Elbe?', ['Nordsee', 'Ostsee', 'Schwarzes Meer', 'Mittelmeer'], 'Die Elbe mündet bei Cuxhaven in die Nordsee – vorher fließt sie durch Hamburg.'),
        ] },
        { title: 'Bundesländer-Profi', emoji: '🏛️', genCount: 4, gens: [gCapitalMatch, gCapitalMC, gLandOf, gScale], questions: [
          mc('Wie viele Bundesländer hat Deutschland?', ['16', '12', '14', '18'], '13 Flächenländer und 3 Stadtstaaten.'),
          sort('Stadtstaat oder Flächenland?', ['Stadtstaat', 'Flächenland'], [['Berlin', 0], ['Hamburg', 0], ['Bremen', 0], ['Bayern', 1], ['Hessen', 1], ['Sachsen', 1]], 'Ein Stadtstaat ist eine Stadt, die gleichzeitig ein eigenes Bundesland ist.'),
          mc('Welches Bundesland ist das größte (nach Fläche)?', ['Bayern', 'Baden-Württemberg', 'Niedersachsen', 'Nordrhein-Westfalen'], 'Bayern ist am größten. Die meisten Einwohner hat aber Nordrhein-Westfalen.'),
          sort('Hat das Bundesland eine Küste?', ['Küste', 'keine Küste'], [['Niedersachsen', 0], ['Schleswig-Holstein', 0], ['Mecklenburg-Vorpommern', 0], ['Bayern', 1], ['Hessen', 1], ['Thüringen', 1]], 'Schleswig-Holstein liegt sogar an zwei Meeren: an der Nordsee und an der Ostsee.'),
          mc('Welches Bundesland hat Anteil an den Alpen?', ['Bayern', 'Hessen', 'Sachsen', 'Niedersachsen'], 'Die deutschen Alpen liegen am Südrand Bayerns.'),
          mc('Wie viele Nachbarländer hat Deutschland?', ['9', '5', '7', '12'], 'Dänemark, Polen, Tschechien, Österreich, Schweiz, Frankreich, Luxemburg, Belgien und die Niederlande.'),
          tf('Schleswig-Holstein liegt an der Nordsee **und** an der Ostsee.', true, 'Es ist das einzige Bundesland mit Küsten an beiden Meeren.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'bw', title: 'Baden-Württemberg', emoji: '🏰', sub: 'Kennst du dich aus? Städte, Flüsse, Landschaften',
      sayWho: 'elara', say: 'Unser Bundesland! Schwarzwald, Schwäbische Alb, Bodensee – und dreizehn Städte, die du auf der Karte finden solltest.',
      explain: [
        ['Lage', 'Baden-Württemberg liegt im **Südwesten** Deutschlands. Nachbarn: Bayern, Hessen und Rheinland-Pfalz – und die Länder Frankreich und Schweiz. Landeshauptstadt ist **Stuttgart**.', ''],
        ['Die Gebirge', '**Schwarzwald:** im Westen entlang des Rheins, höchster Berg ist der Feldberg (1493 m).\n**Schwäbische Alb:** zieht sich schräg von Südwesten nach Nordosten.\n**Odenwald:** im Norden bei Heidelberg.', ''],
        ['Die Flüsse', '**Rhein:** bildet die Grenze im Westen (zu Frankreich) und im Süden (zur Schweiz).\n**Neckar:** fließt durch Tübingen, Stuttgart, Heilbronn und Heidelberg und mündet in Mannheim in den Rhein.\n**Donau:** entspringt im Schwarzwald und fließt nach Osten über Ulm nach Bayern.', '„Brigach und Breg bringen die Donau zuweg.“'],
        ['Die Städte von Nord nach Süd', 'Mannheim · Heidelberg · Heilbronn · Karlsruhe · Pforzheim · Stuttgart · Baden-Baden · Reutlingen · Offenburg · Ulm · Freiburg · Konstanz · Friedrichshafen', ''],
      ],
      facts: ['Die Donau versickert bei Immendingen an manchen Tagen komplett im Boden – ihr Wasser taucht 12 km weiter im Aachtopf wieder auf und fließt dann in den Rhein!', 'Unter der Schwäbischen Alb gibt es über 2 000 Höhlen. In einigen wurden die ältesten Kunstwerke der Menschheit gefunden – rund 40 000 Jahre alt.', 'Der Bodensee versorgt etwa vier Millionen Menschen in Baden-Württemberg mit Trinkwasser.'],
      task: ['Karte aus dem Kopf', 'Zeichne den Umriss von Baden-Württemberg **ohne nachzuschauen**. Trage Rhein, Neckar, Donau, Schwarzwald, Schwäbische Alb, den Bodensee und fünf Städte ein. Vergleiche danach mit dem Atlas: Was hat gestimmt?'],
      levels: [
        { title: 'Städte finden', emoji: '📍', genCount: 5, gens: [gCity('bw'), gCity('bw'), gRiver('bw'), gMountain('bw'), gCityWhere('bw')], questions: [
          mc('Wie heißt die Landeshauptstadt von Baden-Württemberg?', ['Stuttgart', 'Karlsruhe', 'Mannheim', 'Freiburg'], 'Stuttgart liegt am Neckar.'),
          mc('Wie heißt der höchste Berg des Schwarzwalds?', ['Feldberg', 'Brocken', 'Zugspitze', 'Belchen'], 'Der Feldberg ist 1493 m hoch – der höchste Berg aller deutschen Mittelgebirge.'),
          mc('Welcher große See liegt im Süden von Baden-Württemberg?', ['Bodensee', 'Chiemsee', 'Müritz', 'Titisee'], 'Am Bodensee treffen sich Deutschland, die Schweiz und Österreich.'),
          tf('Der Neckar mündet bei Mannheim in den Rhein.', true, 'Mannheim liegt genau an der Mündung.'),
          word('Dieser Fluss fließt durch Stuttgart:', 'NECKAR'),
          mc('Welcher Fluss bildet die Grenze zu Frankreich?', ['Rhein', 'Neckar', 'Donau', 'Main'], 'Der Rhein fließt durch die Oberrheinische Tiefebene – am anderen Ufer liegt das Elsass.'),
        ] },
        { title: 'Landeskenner', emoji: '🥨', genCount: 4, gens: [gCityWhere('bw'), gCity('bw'), gRiver('bw'), gCityWhere('bw')], questions: [
          sort('An welchem Fluss liegt die Stadt?', ['Rhein', 'Neckar', 'Donau'], [['Karlsruhe', 0], ['Heidelberg', 1], ['Ulm', 2], ['Heilbronn', 1], ['Stuttgart', 1], ['Konstanz', 0]], 'In Konstanz fließt der Rhein aus dem Bodensee heraus.'),
          mc('Welches Bundesland grenzt **nicht** an Baden-Württemberg?', ['Saarland', 'Bayern', 'Hessen', 'Rheinland-Pfalz'], 'Die drei Nachbar-Bundesländer sind Bayern, Hessen und Rheinland-Pfalz.'),
          mc('Wo entspringt die Donau?', ['Im Schwarzwald', 'In den Alpen', 'Auf der Schwäbischen Alb', 'Im Bodensee'], 'In Donaueschingen fließen die Quellflüsse Brigach und Breg zusammen.'),
          order('Ordne die Städte von **Norden nach Süden**.', ['Mannheim', 'Karlsruhe', 'Stuttgart', 'Freiburg', 'Konstanz'], 'Mannheim liegt ganz im Norden, Konstanz ganz im Süden am Bodensee.'),
          match('Was passt zu welcher Stadt?', [['Stuttgart', 'Landeshauptstadt'], ['Ulm', 'Münster mit 161 m hohem Turm'], ['Mannheim', 'Mündung des Neckars'], ['Friedrichshafen', 'Zeppelin-Stadt am Bodensee'], ['Karlsruhe', 'Fächerstadt am Rhein']]),
          mc('Aus welchem Gestein besteht die Schwäbische Alb vor allem?', ['Kalkstein', 'Granit', 'Sandstein', 'Lava'], 'Kalk wird von Wasser gelöst – darum gibt es dort so viele Höhlen.'),
          mc('Welche Länder liegen am Bodensee?', ['Deutschland, Schweiz und Österreich', 'Deutschland, Frankreich und Schweiz', 'Nur Deutschland und die Schweiz', 'Deutschland, Italien und Österreich'], 'Deshalb nennt man die Region auch „Dreiländereck“.'),
          tf('Der Schwarzwald liegt im Osten von Baden-Württemberg.', false, 'Er liegt im Westen und Südwesten, entlang des Rheins. Im Osten liegt die Schwäbische Alb.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'klima', title: 'Wetter & Klima', emoji: '⛅', sub: 'Wetterelemente, Steigungsregen, Klimadiagramm',
      sayWho: 'sheep', say: 'Heute regnet es – also haben wir ein Regen-Klima! Mäh … oder ist das gar nicht dasselbe?',
      explain: [
        ['Wetter oder Klima?', '**Wetter** ist das, was gerade jetzt an einem Ort passiert: Heute regnet es in Ulm.\n**Klima** ist der Durchschnitt des Wetters über viele Jahre (mindestens 30): In Freiburg sind die Sommer meist warm.', ''],
        ['Die Wetterelemente', 'Temperatur (Thermometer, °C) · Niederschlag (Regenmesser, mm) · Wind (Windfahne, Windmesser) · Bewölkung · Luftdruck (Barometer) · Luftfeuchtigkeit', 'Niederschlag ist alles Wasser, das vom Himmel fällt: Regen, Schnee, Hagel.'],
        ['Steigungsregen', '1. Feuchte Luft weht auf ein Gebirge zu.\n2. Sie muss aufsteigen und kühlt dabei ab.\n3. Kalte Luft kann weniger Wasserdampf halten – es bilden sich Wolken.\n4. Es regnet auf der Seite, auf der die Luft aufsteigt.\n5. Hinter dem Gebirge sinkt die Luft ab, die Wolken lösen sich auf: **Regenschatten**.', 'Darum regnet es im Schwarzwald viel mehr als in der Rheinebene.'],
        ['Das Klimadiagramm lesen', 'Unten: die zwölf Monate (J F M A M J J A S O N D).\n**Rote Kurve** = Temperatur, abzulesen an der **linken** Achse (°C).\n**Blaue Säulen** = Niederschlag, abzulesen an der **rechten** Achse (mm).\n10 °C links stehen auf gleicher Höhe wie 20 mm rechts.\nOben stehen Ort, Höhe, Jahresmitteltemperatur und Jahresniederschlag.', ''],
        ['Ein Klima beschreiben', 'Nenne den wärmsten und den kältesten Monat, den Unterschied dazwischen, die Monate mit viel und wenig Niederschlag sowie die Jahreswerte.', ''],
        ['Klima in Deutschland', 'An der **Küste** sind die Winter mild und die Sommer kühl. In den **Bergen** ist es kälter und nasser. Am **Oberrhein** ist es besonders warm – dort blühen die Apfelbäume zuerst.', ''],
      ],
      facts: ['Auf der Zugspitze fallen im Jahr rund 2 000 mm Niederschlag – etwa dreimal so viel wie in Stuttgart. Und die Jahresmitteltemperatur liegt unter 0 °C.', 'Die höchste in Deutschland gemessene Temperatur liegt bei über 41 °C, die tiefste bei unter −37 °C.', '1 mm Niederschlag bedeutet: 1 Liter Wasser auf jeden Quadratmeter.'],
      task: ['Wetter-Tagebuch', 'Beobachte **eine Woche lang** jeden Tag zur gleichen Zeit das Wetter: Temperatur, Bewölkung, Niederschlag und Wind. Trag alles in eine Tabelle ein und zeichne am Ende eine Temperaturkurve.'],
      levels: [
        { title: 'Wetterfrosch', emoji: '🐸', questions: [
          sort('Wetter oder Klima?', ['Wetter', 'Klima'], [['Heute regnet es in Ulm.', 0], ['In Freiburg sind die Sommer meist warm.', 1], ['Morgen wird es stürmisch.', 0], ['Auf der Zugspitze liegt die Jahresmitteltemperatur unter 0 °C.', 1], ['Gestern hat es gehagelt.', 0], ['An der Nordsee sind die Winter mild.', 1]], 'Wetter: jetzt und hier. Klima: der Durchschnitt über viele Jahre.'),
          match('Welches Messgerät misst was?', [['Thermometer', 'Temperatur'], ['Regenmesser', 'Niederschlag'], ['Windfahne', 'Windrichtung'], ['Barometer', 'Luftdruck']]),
          mc('Was gehört alles zum **Niederschlag**?', ['Regen, Schnee und Hagel', 'Nur Regen', 'Wolken und Nebel', 'Wind und Sturm'], 'Niederschlag ist alles Wasser, das aus den Wolken auf die Erde fällt.'),
          order('Wie entsteht Steigungsregen? Ordne die Schritte.', ['Feuchte Luft trifft auf ein Gebirge', 'Die Luft steigt auf', 'Die Luft kühlt ab', 'Wolken bilden sich', 'Es regnet'], 'Kalte Luft kann weniger Wasserdampf halten als warme.'),
          mc('Was bedeutet **Regenschatten**?', ['Hinter dem Gebirge regnet es wenig', 'Im Schatten regnet es mehr', 'Es regnet nur nachts', 'Regenwolken werfen Schatten'], 'Die Luft hat sich auf der anderen Seite schon ausgeregnet und sinkt ab – die Wolken lösen sich auf.'),
          tf('Je höher man im Gebirge steigt, desto kälter wird es.', true, 'Pro 100 Höhenmeter wird es etwa ein halbes Grad kälter.'),
          mc('Über wie viele Jahre wird das Wetter beobachtet, um das Klima zu bestimmen?', ['Mindestens 30 Jahre', '1 Jahr', '5 Jahre', '1000 Jahre'], 'Erst über einen so langen Zeitraum gleichen sich Ausreißer aus.'),
          mc('In welcher Einheit wird Niederschlag gemessen?', ['Millimeter (mm)', 'Grad Celsius (°C)', 'Kilogramm (kg)', 'Meter pro Sekunde'], '1 mm bedeutet: 1 Liter Wasser auf einen Quadratmeter.'),
          word('Regen, Schnee und Hagel heißen zusammen …', 'NIEDERSCHLAG'),
          mc('Wo blühen in Deutschland die Apfelbäume zuerst?', ['Am warmen Oberrhein', 'Auf dem Brocken', 'An der Ostsee', 'In den Alpen'], 'Die Rheinebene zwischen Freiburg und Karlsruhe gehört zu den wärmsten Gegenden Deutschlands.'),
        ] },
        { title: 'Klimadiagramm-Profi', emoji: '📈', genCount: 5, gens: [gKlima, gKlima, gKlima, gSchwankung, gKlima], questions: [
          mc('Was zeigt die **rote Kurve** im Klimadiagramm?', ['Die Temperatur', 'Den Niederschlag', 'Den Wind', 'Die Sonnenstunden'], 'Rot wie warm – die Temperaturkurve. Abgelesen wird links.'),
          mc('Was zeigen die **blauen Säulen** im Klimadiagramm?', ['Den Niederschlag', 'Die Temperatur', 'Die Höhe des Ortes', 'Die Bewölkung'], 'Blau wie Wasser – der Niederschlag. Abgelesen wird rechts.'),
          mc('10 °C auf der linken Achse stehen auf gleicher Höhe wie … auf der rechten Achse?', ['20 mm', '10 mm', '100 mm', '5 mm'], 'Die Niederschlagswerte sind immer doppelt so hoch wie die Temperaturwerte.'),
          order('Wie zeichnest du ein Klimadiagramm? Ordne die Schritte.', ['Monate unten eintragen', 'Achsen für °C und mm zeichnen', 'Temperaturen als Kreuze markieren', 'Kreuze zur roten Kurve verbinden', 'Niederschlag als blaue Säulen zeichnen', 'Ort und Jahreswerte darüberschreiben']),
          mc('Wofür stehen die Buchstaben J F M A M J J A S O N D?', ['Für die zwölf Monate', 'Für die Wochentage', 'Für Orte', 'Für Jahreszeiten'], 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember.'),
          tf('Ein Klimadiagramm zeigt, wie das Wetter morgen wird.', false, 'Es zeigt Durchschnittswerte aus vielen Jahren – also das Klima, nicht das Wetter.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'gezeiten', title: 'Ebbe & Flut', emoji: '🌊', sub: 'Die Gezeiten an der Nordseeküste',
      sayWho: 'sheep', say: 'Ich wollte baden – aber das Meer war weg! Einfach weg! Mäh! Wer hat den Stöpsel gezogen?',
      explain: [
        ['Die Gezeiten', 'An der Nordsee steigt und fällt das Wasser ständig. Diesen Wechsel nennt man **Gezeiten** (norddeutsch: Tiden).\n**Flut** = das Wasser steigt (etwa 6 Stunden).\n**Ebbe** = das Wasser fällt (etwa 6 Stunden).', ''],
        ['Hochwasser und Niedrigwasser', '**Hochwasser** = höchster Wasserstand.\n**Niedrigwasser** = niedrigster Wasserstand.\nDazwischen liegen etwa **6 Stunden und 12 Minuten**. Der Höhenunterschied heißt **Tidenhub**.', 'An der deutschen Nordseeküste beträgt der Tidenhub etwa 2 bis 4 Meter.'],
        ['Warum gibt es Gezeiten?', 'Der **Mond** zieht das Wasser der Meere an. Auf der Seite der Erde, die dem Mond zugewandt ist, entsteht ein „Flutberg“ – und auf der gegenüberliegenden Seite ein zweiter. Weil sich die Erde dreht, wandern die Flutberge um die Erde. Darum gibt es zweimal am Tag Hoch- und Niedrigwasser.', ''],
        ['Watt und Priel', 'Das **Watt** ist der Meeresboden, der bei Ebbe trockenfällt und bei Flut wieder überspült wird. Er besteht aus Sand und Schlick.\nEin **Priel** ist ein Wasserlauf im Watt, durch den das Wasser ab- und zuläuft.', ''],
        ['Der Tidenkalender', 'Im Tidenkalender steht, wann Hoch- und Niedrigwasser ist. Jeden Tag verschieben sich die Zeiten um etwa 50 Minuten nach hinten. Beste Badezeit: rund um das Hochwasser.', ''],
      ],
      facts: ['In der Bay of Fundy in Kanada steigt das Wasser bei Flut um bis zu 16 Meter – so hoch wie ein fünfstöckiges Haus.', 'In der Ostsee merkt man von den Gezeiten fast nichts: Der Tidenhub beträgt nur wenige Zentimeter.', 'Der Mond entfernt sich jedes Jahr um etwa 4 Zentimeter von der Erde.'],
      task: ['Gezeiten-Detektiv', 'Such im Internet den **Tidenkalender** für Norderney oder Cuxhaven. Wann ist morgen Hochwasser, wann Niedrigwasser? Rechne aus, wie viele Stunden und Minuten dazwischen liegen – und wann du baden gehen würdest.'],
      levels: [
        { title: 'Wasser kommt, Wasser geht', emoji: '🌙', genCount: 3, gens: [gTideFig, gTideFig, gTideFig], questions: [
          mc('Was sind die **Gezeiten**?', ['Der ständige Wechsel von Ebbe und Flut', 'Die vier Jahreszeiten am Meer', 'Besonders hohe Wellen', 'Stürme an der Küste'], 'Auf Norddeutsch sagt man auch „Tiden“.'),
          mc('Was passiert bei **Flut**?', ['Das Wasser steigt', 'Das Wasser fällt', 'Das Wasser steht still', 'Es stürmt'], 'Flut = auflaufendes Wasser. Am Ende der Flut ist Hochwasser.'),
          mc('Was passiert bei **Ebbe**?', ['Das Wasser fällt', 'Das Wasser steigt', 'Es regnet', 'Das Meer friert zu'], 'Ebbe = ablaufendes Wasser. Am Ende der Ebbe ist Niedrigwasser.'),
          mc('Wie heißt der Meeresboden, der bei Ebbe trockenfällt?', ['Watt', 'Marsch', 'Geest', 'Düne'], 'Das Watt besteht aus Sand und Schlick und steckt voller Leben.'),
          mc('Was ist ein **Priel**?', ['Ein Wasserlauf im Watt', 'Ein kleiner Deich', 'Ein Seevogel', 'Ein Fischerboot'], 'Durch die Priele läuft das Wasser bei Ebbe ab und bei Flut zuerst wieder auf – oft sehr schnell!'),
          mc('Wer verursacht vor allem Ebbe und Flut?', ['Der Mond mit seiner Anziehungskraft', 'Der Wind', 'Die Flüsse', 'Die Schiffe'], 'Der Mond zieht das Wasser der Meere an.'),
          tf('An der Nordsee gibt es zweimal am Tag Hochwasser.', true, 'Und zweimal Niedrigwasser – weil es zwei Flutberge gibt und sich die Erde einmal am Tag dreht.'),
          word('Der Höhenunterschied zwischen Niedrig- und Hochwasser:', 'TIDENHUB'),
          mc('Wie lange dauert es ungefähr von Niedrigwasser bis Hochwasser?', ['Etwa 6 Stunden', 'Etwa 1 Stunde', 'Etwa 12 Stunden', 'Etwa 24 Stunden'], 'Genauer: 6 Stunden und 12 Minuten.'),
        ] },
        { title: 'Tidenkalender-Profi', emoji: '⏰', genCount: 4, gens: [gTideTime, gTidenhub, gBaden, gTideTime], questions: [
          order('Ordne den Ablauf der Gezeiten – beginne mit dem niedrigsten Wasserstand.', ['Niedrigwasser', 'Flut', 'Hochwasser', 'Ebbe'], 'Danach beginnt alles wieder von vorn.'),
          mc('Wie viele „Flutberge“ gibt es gleichzeitig auf der Erde?', ['Zwei', 'Einen', 'Vier', 'Zwölf'], 'Einen auf der Seite, die dem Mond zugewandt ist – und einen genau gegenüber.'),
          tf('In der Ostsee sind Ebbe und Flut genauso stark wie in der Nordsee.', false, 'Die Ostsee ist fast ganz von Land umschlossen. Der Tidenhub beträgt dort nur wenige Zentimeter.'),
          mc('Warum ist Baden bei Ebbe gefährlich?', ['Das ablaufende Wasser zieht einen aufs Meer hinaus', 'Das Wasser ist dann zu salzig', 'Es gibt dann mehr Quallen', 'Das Wasser ist zu warm'], 'Die Strömung ist stärker, als man denkt – besonders in den Prielen.'),
          mc('Warum wandern die Flutberge um die Erde?', ['Weil sich die Erde dreht', 'Weil der Wind sie schiebt', 'Weil die Flüsse nachfüllen', 'Weil das Wasser warm wird'], 'Die Erde dreht sich einmal am Tag unter den beiden Flutbergen hindurch.'),
          mc('Wie nennt man die Gezeiten auf Norddeutsch?', ['Tiden', 'Halligen', 'Warften', 'Priele'], 'Daher kommen die Wörter Tidenhub und Tidenkalender.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'kueste', title: 'Küsten & Küstenschutz', emoji: '🏖️', sub: 'Küstenformen, Sturmflut, Deich und Lahnung',
      sayWho: 'alpaca', say: 'Das Meer gibt – und das Meer nimmt. Seit über 2000 Jahren kämpfen die Menschen an der Nordsee gegen die Sturmfluten.',
      explain: [
        ['Küstenformen', '**Wattenküste** (Nordsee): Meeresboden, der bei Ebbe trockenfällt.\n**Steilküste:** Die Brandung höhlt das Ufer aus, es bricht ab – ein Kliff entsteht.\n**Flachküste:** Die Wellen laufen sanft aus und lagern Sand ab – ein Sandstrand entsteht.\n**Förde** (Ostsee): schmale, lange Meeresbucht, von Gletschern geformt.\n**Bodden** (Ostsee): flache, fast vom Land umschlossene Bucht.', ''],
        ['Sturmflut', 'Wenn starker **Nordwestwind** und die **Flut** zusammentreffen, wird das Wasser gegen die Küste gedrückt: Sturmflut! Flüsse können nicht mehr abfließen, Land wird überschwemmt.', '„Land unter“ heißt es, wenn eine Hallig überflutet wird.'],
        ['Vom Meer bis ins Hinterland', 'Watt → Deichvorland (Salzwiesen) → **Deich** → **Marsch** (flaches, fruchtbares Land hinter dem Deich) → **Geest** (höher gelegenes, sandiges Land).', ''],
        ['Schutzbauten', '**Deich:** Schutzwall gegen das Meer – heute flach und breit, mit Sandkern und Kleidecke.\n**Warft:** aufgeschütteter Hügel, auf dem Häuser stehen.\n**Hallig:** kleine Insel ohne Deich; die Häuser stehen auf Warften.\n**Wellenbrecher:** Steine oder Betonbauten im Wasser.\n**Lahnungen:** Reihen von Holzpflöcken mit Flechtwerk.', ''],
        ['Neuland gewinnen', '1. Lahnungen bauen – sie bremsen die Wellen.\n2. Schlick setzt sich ab.\n3. Salzpflanzen wie der **Queller** siedeln sich an.\n4. Entwässerungsgräben machen den Boden fest.\n5. Das neue Land wird eingedeicht: ein **Koog** (Polder) entsteht.', ''],
      ],
      facts: ['Bei der Sturmflut von 1362, der „Groten Mandränke“, versank der sagenhafte Ort Rungholt im Meer. Seine Reste liegen heute im Watt.', 'Bei der Hamburger Sturmflut 1962 brachen die Deiche an 60 Stellen. Danach wurden die Deiche überall erhöht und flacher gebaut.', 'Auf der Hallig Hooge heißt es mehrmals im Jahr „Land unter“ – dann schauen nur noch die Warften aus dem Meer.'],
      task: ['Deichbau-Labor', 'Baue in einer flachen Wanne aus feuchtem Sand zwei Deiche: einen **steilen** und einen **flachen, breiten**. Gieße Wasser dazu und mach mit der Hand Wellen. Welcher Deich hält länger? Erkläre, warum Deiche heute so gebaut werden.'],
      levels: [
        { title: 'Küsten-Kenner', emoji: '🐚', questions: [
          match('Welche Beschreibung passt zu welcher Küstenform?', [['Wattenküste', 'fällt bei Ebbe trocken'], ['Steilküste', 'Brandung höhlt das Ufer aus'], ['Flachküste', 'Wellen lagern Sand ab'], ['Förde', 'schmale, lange Meeresbucht']]),
          sort('Nordsee oder Ostsee?', ['Nordsee', 'Ostsee'], [['Wattenküste', 0], ['Förden', 1], ['Bodden', 1], ['Halligen', 0], ['Kreidefelsen auf Rügen', 1], ['starke Gezeiten', 0]], 'Die Nordsee hat starke Gezeiten und das Watt. Die Ostsee hat Förden, Bodden, Steil- und Flachküsten.'),
          mc('Wann entsteht eine **Sturmflut**?', ['Wenn starker Wind und Flut zusammentreffen', 'Bei jedem Hochwasser', 'Wenn es lange regnet', 'Bei Vollmond'], 'Der Sturm (meist aus Nordwest) drückt zusätzlich Wasser gegen die Küste.'),
          mc('Was ist ein **Deich**?', ['Ein Schutzwall gegen das Meer', 'Ein Wasserlauf im Watt', 'Eine kleine Insel', 'Ein Hafenbecken'], 'Deiche schützen das flache Marschland dahinter vor Überschwemmungen.'),
          mc('Was ist eine **Warft**?', ['Ein aufgeschütteter Hügel für Häuser', 'Eine Werkstatt für Schiffe', 'Ein Leuchtturm', 'Eine Sandbank'], 'Schon vor über 2000 Jahren bauten die Menschen ihre Häuser auf solche Erdhügel.'),
          mc('Was ist eine **Hallig**?', ['Eine kleine Insel ohne Deich', 'Ein großer Deich', 'Ein Fischerboot', 'Eine Salzpflanze'], 'Bei Sturmflut wird die Hallig überflutet – nur die Warften mit den Häusern bleiben trocken.'),
          mc('Wie heißt das flache, fruchtbare Land direkt hinter dem Deich?', ['Marsch', 'Geest', 'Watt', 'Kliff'], 'Die Marsch ist aus abgelagertem Schlick entstanden – früher war dort Watt.'),
          mc('Wie heißt das höher gelegene, sandige Hinterland?', ['Geest', 'Marsch', 'Koog', 'Priel'], 'Die Geest liegt so hoch, dass sie auch ohne Deich sicher ist.'),
          tf('An einer Steilküste trägt die Brandung das Ufer nach und nach ab.', true, 'Die Wellen höhlen das Kliff unten aus – bis oben Material abrutscht.'),
          word('Reihen von Holzpflöcken, die im Watt die Wellen bremsen:', 'LAHNUNG'),
        ] },
        { title: 'Deichgraf', emoji: '🌬️', questions: [
          order('Ordne vom **Meer ins Landesinnere**.', ['Meer', 'Watt', 'Deichvorland', 'Deich', 'Marsch', 'Geest']),
          order('Wie wird an der Nordsee Neuland gewonnen? Ordne die Schritte.', ['Lahnungen bauen', 'Schlick setzt sich ab', 'Queller siedelt sich an', 'Entwässerungsgräben ziehen', 'Land eindeichen'], 'Am Ende ist ein Koog (Polder) entstanden – zum Beispiel eine Schafweide.'),
          mc('Was ist der **Queller**?', ['Eine Pflanze, die Salzwasser verträgt', 'Ein Seevogel', 'Ein Deicharbeiter', 'Eine Muschel'], 'Der Queller wächst als Erster auf dem neuen Schlick und hält ihn fest.'),
          mc('Was ist ein **Koog** (Polder)?', ['Eingedeichtes, neu gewonnenes Land', 'Ein Hügel für Häuser', 'Ein Boot für die Wattfahrt', 'Ein Sturm aus Nordwest'], 'In Schleswig-Holstein sagt man Koog, in Niedersachsen Polder.'),
          mc('Wie unterscheiden sich heutige Deiche von früheren?', ['Sie sind höher, breiter und zur Seeseite viel flacher', 'Sie sind steiler und schmaler', 'Sie sind aus Holz', 'Sie sind niedriger'], 'Ein Deich ist heute bis zu 100 m breit.'),
          mc('Warum ist die Seeseite eines Deiches so flach?', ['Die Wellen laufen aus und verlieren ihre Kraft', 'Damit Schafe besser grasen können', 'Damit man besser baden kann', 'Weil Sand gespart wird'], 'An einer steilen Wand würden die Wellen mit voller Wucht aufprallen.'),
          mc('Was bedeutet „**Land unter**“?', ['Eine Hallig ist überflutet', 'Das Watt ist trocken', 'Ein Schiff ist gesunken', 'Der Deich wird repariert'], 'Dann ragen nur noch die Warften mit den Häusern aus dem Wasser.'),
          mc('Wie sind die Förden an der Ostsee entstanden?', ['Gletscher der Eiszeit haben sie ausgeschürft', 'Menschen haben sie gegraben', 'Durch Vulkane', 'Durch Sturmfluten'], 'Später füllten sich die Rinnen mit Meerwasser. Bekannt sind die Kieler und die Flensburger Förde.'),
          mc('Warum pflanzt man auf Dünen Strandhafer?', ['Seine Wurzeln halten den Sand fest', 'Er schmeckt den Schafen', 'Er hält Touristen fern', 'Er macht den Sand salzig'], 'So wird die Düne zu einem natürlichen Schutzwall.'),
          tf('Lahnungen dienen dem Küstenschutz **und** der Landgewinnung.', true, 'Sie bremsen die Wellen – und hinter ihnen setzt sich Schlick ab, aus dem neues Land wird.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'watt', title: 'Watt & Nationalpark', emoji: '🦭', sub: 'Lebensraum Watt, Schutzzonen, Tourismus',
      sayWho: 'elara', say: 'Im Watt leben auf einem Quadratmeter mehr Tiere als in vielen Wäldern. Und trotzdem sieht es aus wie Matsch!',
      explain: [
        ['Lebensraum Watt', 'Im Wattboden leben Wattwürmer, Muscheln und Krebse. Davon ernähren sich Vögel wie der Austernfischer. Auf den Sandbänken ruhen Seehunde. Millionen **Zugvögel** machen hier Rast, um sich satt zu fressen. Auf den **Salzwiesen** brüten viele Vögel.', ''],
        ['Nationalpark Wattenmeer', 'Um diese einzigartige Landschaft zu schützen, wurde das Wattenmeer zum **Nationalpark** erklärt. Seit 2009 ist es sogar **UNESCO-Weltnaturerbe**. Ziel: Die Natur soll sich möglichst ungestört entwickeln.', ''],
        ['Die drei Schutzzonen', '**Ruhezone:** am strengsten geschützt – Betreten nur auf markierten Wegen oder mit Führung.\n**Zwischenzone:** Wandern und Baden sind meist erlaubt.\n**Erholungszone:** Hier gibt es auch Strände, Hotels und Häfen.', ''],
        ['Regeln im Nationalpark', 'Auf den Wegen bleiben · keine Pflanzen pflücken · Abstand zu Vögeln und Seehunden halten · nicht zelten · Hunde an die Leine · keine Drachen steigen lassen · keinen Müll hinterlassen · leise sein.', ''],
        ['Tourismus an der Küste', 'Viele Küstenbewohner leben vom **Fremdenverkehr (Tourismus)**. Sie bieten **Dienstleistungen** an: Übernachtung, Gaststätten, Fahrradverleih, Wattführungen. Im Sommer ist Hochbetrieb, im Winter ist wenig los.', ''],
        ['Sicher im Watt', 'Nie ohne Tidenkalender ins Watt · bei ablaufendem Wasser losgehen · in Sichtweite der Küste bleiben · große Touren nur mit Wattführer · bei Nebel oder Wetterwechsel sofort umkehren.', ''],
      ],
      facts: ['Ein Wattwurm frisst im Jahr etwa 25 kg Sand – und macht daraus die typischen Spaghetti-Häufchen.', 'Jedes Jahr rasten rund zehn Millionen Zugvögel im Wattenmeer.', 'Seehunde können bis zu 30 Minuten tauchen und dabei über 200 Meter tief kommen.'],
      task: ['Ranger-Schild', 'Gestalte ein **Nationalpark-Schild** mit fünf Regeln als Bildzeichen (ohne Text!). Zeig es jemandem zu Hause: Kann die Person erraten, was jedes Zeichen bedeutet?'],
      levels: [
        { title: 'Watt-Ranger', emoji: '🪱', questions: [
          mc('Was ist das wichtigste Ziel eines Nationalparks?', ['Die Natur soll sich ungestört entwickeln können', 'Möglichst viele Hotels bauen', 'Fische züchten', 'Neues Land gewinnen'], 'Tiere, Pflanzen und ihre Lebensräume sollen geschützt und erhalten werden.'),
          match('Was gilt in welcher Schutzzone?', [['Ruhezone', 'nur auf markierten Wegen betreten'], ['Zwischenzone', 'Wandern und Baden meist erlaubt'], ['Erholungszone', 'auch Hotels und Häfen']]),
          sort('Im Nationalpark erlaubt oder verboten?', ['erlaubt', 'verboten'], [['auf den Wegen bleiben', 0], ['Pflanzen pflücken', 1], ['Drachen steigen lassen', 1], ['Hund an der Leine führen', 0], ['zelten', 1], ['Vögel mit dem Fernglas beobachten', 0]], 'Ein Drachen sieht für Vögel aus wie ein Greifvogel – sie fliehen und verlieren wertvolle Energie.'),
          mc('Wer hinterlässt die kleinen „Spaghetti-Häufchen“ im Watt?', ['Der Wattwurm', 'Die Miesmuschel', 'Der Seehund', 'Die Strandkrabbe'], 'Er frisst Sand, verdaut die Nährstoffe darin und scheidet den sauberen Sand wieder aus.'),
          mc('Welcher Vogel mit langem rotem Schnabel stochert im Watt nach Muscheln und Würmern?', ['Austernfischer', 'Buntspecht', 'Mäusebussard', 'Kohlmeise'], 'Man erkennt ihn an seinem schwarz-weißen Gefieder.'),
          mc('Wo ruhen sich Seehunde aus?', ['Auf Sandbänken', 'Auf Bäumen', 'In Höhlen', 'Auf dem Deich'], 'Darum muss man großen Abstand halten – gestörte Seehunde flüchten ins Wasser, und Jungtiere können ihre Mutter verlieren.'),
          tf('Das Wattenmeer ist UNESCO-Weltnaturerbe.', true, 'Seit 2009 – weil es auf der ganzen Welt einzigartig ist.'),
          word('Er lebt in einer U-förmigen Röhre im Wattboden:', 'WATTWURM'),
          mc('Warum ist das Watt für Zugvögel so wichtig?', ['Sie fressen sich dort für den Weiterflug satt', 'Sie bauen dort ihre Winternester', 'Sie lernen dort schwimmen', 'Es ist dort besonders warm'], 'Das Watt ist wie eine riesige Raststätte auf dem Weg zwischen Arktis und Afrika.'),
          mc('Was wächst auf den **Salzwiesen**?', ['Pflanzen, die Salzwasser vertragen', 'Weizen und Mais', 'Tannen', 'Gar nichts'], 'Salzwiesen werden nur selten überflutet und sind ein wichtiger Brutplatz für Vögel.'),
        ] },
        { title: 'Insel-Experte', emoji: '🏝️', questions: [
          mc('Was bedeutet **Fremdenverkehr**?', ['Tourismus', 'Schiffsverkehr', 'Flugverkehr', 'Vogelzug'], 'Urlaubsgäste nannte man früher „Fremde“.'),
          sort('Ist das eine **Dienstleistung** für Touristen?', ['Dienstleistung', 'keine Dienstleistung'], [['Wattführung', 0], ['Fahrradverleih', 0], ['Hotelzimmer vermieten', 0], ['Krabben fangen', 1], ['Schiffe bauen', 1], ['Gäste im Restaurant bedienen', 0]], 'Bei einer Dienstleistung wird nichts hergestellt – man tut etwas für andere.'),
          mc('Warum darf man nie ohne Tidenkalender ins Watt gehen?', ['Weil das Wasser schnell zurückkommt und einem den Rückweg abschneidet', 'Weil man sonst Eintritt zahlen muss', 'Weil es dort zu heiß wird', 'Weil man sich sonst verläuft'], 'Die Priele laufen zuerst voll – plötzlich steht man auf einer Sandbank mitten im Wasser.'),
          mc('Was tust du, wenn im Watt plötzlich Nebel aufzieht?', ['Sofort zur Küste zurückgehen', 'Weitergehen und warten', 'Im Priel schwimmen', 'Ein Zelt aufbauen'], 'Im Nebel verliert man die Orientierung – und sieht nicht, wann das Wasser kommt.'),
          mc('Welches Problem haben viele Betriebe auf den Inseln im Winter?', ['Es kommen kaum Gäste, also verdienen sie wenig', 'Es gibt zu viele Gäste', 'Die Fähren fahren zu oft', 'Es ist zu warm'], 'Viele Gaststätten schließen im Winter. Manche Leute arbeiten dann auf dem Festland.'),
          mc('Warum ist nicht die ganze Nordseeküste Nationalpark?', ['Menschen brauchen auch Platz zum Wohnen und Arbeiten, für Häfen und Schifffahrt', 'Weil es dort keine Tiere gibt', 'Weil das Wasser zu flach ist', 'Weil es zu teuer wäre'], 'Deshalb gibt es Schutzzonen: Mal steht die Natur im Vordergrund, mal die Nutzung durch den Menschen.'),
          tf('Auf Sylt übernachten im Jahr viel mehr Gäste, als die Insel Einwohner hat.', true, 'Über eine halbe Million Gäste im Jahr – bei weniger als 20 000 Einwohnern.'),
          mc('Wer führt Urlauber sicher durchs Watt?', ['Ein ausgebildeter Wattführer', 'Der Bürgermeister', 'Ein Krabbenfischer', 'Niemand – das ist verboten'], 'Wattführer kennen die Gezeiten, die Priele und die Tiere.'),
          mc('Das Rote Kliff auf Sylt ist ein Beispiel für eine …', ['Steilküste', 'Flachküste', 'Wattenküste', 'Förde'], 'Die Brandung trägt das Kliff jedes Jahr ein Stück weiter ab.'),
          mc('Warum muss man im Nationalpark leise sein?', ['Lärm stört die Tiere beim Brüten und Ruhen', 'Weil dort Menschen schlafen', 'Damit man die Wellen hört', 'Weil es ein Gesetz gegen Singen gibt'], 'Aufgescheuchte Vögel verlassen ihre Nester – die Eier kühlen aus.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'hafen', title: 'Der Hamburger Hafen', emoji: '🚢', sub: 'Tor zur Welt: Güter, Container, Umschlag',
      sayWho: 'sheep', say: 'In so einen Container passen bestimmt 400 Schafe. Mäh! … Was? Da sind Turnschuhe und Bananen drin?',
      explain: [
        ['Hafen ist nicht gleich Hafen', '**Seehafen:** Hier legen Seeschiffe an, die über die Meere fahren.\n**Binnenhafen:** liegt im Landesinneren an einem Fluss oder Kanal (z. B. Duisburg, Mannheim).\nHamburg liegt an der **Elbe**, rund 100 km von der Nordsee entfernt – und ist trotzdem Deutschlands größter Seehafen.', ''],
        ['Welche Güter gibt es?', '**Massengut:** lose, unverpackte Ware in großen Mengen – Kohle, Erz, Getreide, Erdöl.\n**Stückgut:** einzeln verpackte Ware – Kisten, Maschinen, Autos.\n**Container:** genormte Stahlkisten. Heute reist fast alles Stückgut im Container.', ''],
        ['Warum Container?', 'Alle Container sind gleich groß. Kräne heben sie in wenigen Minuten vom Schiff direkt auf die Bahn oder den Lkw. Das spart Zeit und Geld.', ''],
        ['Wichtige Begriffe', '**Güterumschlag:** das Umladen von Waren (z. B. vom Schiff auf den Zug).\n**Import:** Einfuhr von Waren aus dem Ausland.\n**Export:** Ausfuhr von Waren ins Ausland.\n**Werft:** Hier werden Schiffe gebaut und repariert.', ''],
        ['Warum gerade Hamburg?', 'Über die Elbe erreichen Seeschiffe die Stadt. Von dort führen Autobahnen, Bahnlinien, Flüsse und Kanäle weit ins Hinterland – bis nach Süddeutschland und Osteuropa.', ''],
      ],
      facts: ['Die größten Containerschiffe sind 400 Meter lang und tragen über 20 000 Container. Hintereinander auf Lkw gestellt, wäre das eine Schlange von über 100 Kilometern.', 'Der Standard-Container wurde in den 1950er-Jahren von einem amerikanischen Spediteur erfunden – und hat den Welthandel völlig verändert.', 'Bananen reisen grün und gekühlt im Container und reifen erst in Deutschland nach.'],
      task: ['Weltreise im Kinderzimmer', 'Schau auf die Etiketten von **zehn Dingen** in deinem Zimmer (Kleidung, Spielzeug, Elektronik): „Made in …“. Woher kommen sie? Welche davon sind wohl mit dem Containerschiff gereist? Zeichne die Wege in eine Weltkarte.'],
      levels: [
        { title: 'Hafen-Lotse', emoji: '⚓', questions: [
          match('Welche Erklärung passt?', [['Seehafen', 'Seeschiffe legen hier an'], ['Binnenhafen', 'liegt im Landesinneren an einem Fluss'], ['Werft', 'hier werden Schiffe gebaut'], ['Container', 'genormte Stahlkiste für den Transport']]),
          sort('Massengut oder Stückgut?', ['Massengut', 'Stückgut'], [['Kohle', 0], ['Getreide', 0], ['Erdöl', 0], ['Autos', 1], ['Maschinen in Kisten', 1], ['Fernseher in Kartons', 1]], 'Massengut ist lose und unverpackt. Stückgut kann man einzeln zählen.'),
          mc('An welchem Fluss liegt Hamburg?', ['Elbe', 'Weser', 'Rhein', 'Oder'], 'Über die Elbe fahren die Seeschiffe bis in den Hafen.'),
          tf('Hamburg liegt direkt an der Nordsee.', false, 'Die Stadt liegt rund 100 km landeinwärts an der Elbe.'),
          mc('Was bedeutet **Import**?', ['Waren aus dem Ausland einführen', 'Waren ins Ausland verkaufen', 'Waren lagern', 'Schiffe reparieren'], 'Import = hinein (Einfuhr). Export = hinaus (Ausfuhr).'),
          mc('Was bedeutet **Export**?', ['Waren ins Ausland ausführen', 'Waren aus dem Ausland einführen', 'Waren im Hafen umladen', 'Waren zählen'], 'Deutschland exportiert zum Beispiel viele Autos und Maschinen.'),
          mc('Was versteht man unter **Güterumschlag**?', ['Das Umladen von Waren, z. B. vom Schiff auf die Bahn', 'Das Verpacken von Waren', 'Das Wiegen von Schiffen', 'Das Bezahlen der Fracht'], 'Je schneller umgeschlagen wird, desto kürzer liegt das teure Schiff im Hafen.'),
          word('Genormte Stahlkiste für Schiff, Bahn und Lkw:', 'CONTAINER'),
          mc('Warum nennt man den Hamburger Hafen „Tor zur Welt“?', ['Von hier aus gehen Waren in die ganze Welt – und kommen von dort', 'Weil dort ein großes Tor steht', 'Weil alle Touristen dort ankommen', 'Weil er der älteste Hafen ist'], 'Schiffe verbinden Hamburg mit Häfen auf allen Kontinenten.'),
        ] },
        { title: 'Container-Kapitän', emoji: '🏗️', genCount: 4, gens: [gHafenChart, gHafenChart, gHafenChart, gHafenChart], questions: [
          mc('Was ist der größte Vorteil von Containern?', ['Sie lassen sich schnell zwischen Schiff, Bahn und Lkw umladen', 'Sie sind besonders bunt', 'Sie schwimmen von allein', 'Sie sind aus Holz und daher leicht'], 'Weil alle gleich groß sind, passen sie auf jedes Schiff, jeden Zug und jeden Lkw.'),
          mc('Welcher Hafen ist ein **Binnenhafen**?', ['Duisburg', 'Hamburg', 'Bremerhaven', 'Rostock'], 'Duisburg liegt am Rhein und ist der größte Binnenhafen Europas.'),
          mc('Warum ist Hamburg ein so guter Standort für einen großen Hafen?', ['Gute Verbindungen ins Hinterland: Autobahnen, Bahn, Flüsse', 'Dort ist das Wasser besonders warm', 'Dort gibt es keine Gezeiten', 'Dort wohnen die meisten Seeleute'], 'Die Waren müssen ja weiter – zum Beispiel bis nach Stuttgart oder Prag.'),
          mc('Warum wurde die Elbe immer wieder vertieft?', ['Damit auch sehr große Schiffe den Hafen erreichen', 'Damit mehr Fische darin leben', 'Damit das Wasser schneller fließt', 'Damit man besser baden kann'], 'Große Containerschiffe haben viel Tiefgang. Naturschützer kritisieren die Vertiefung – ein Nutzungskonflikt.'),
          mc('Erdöl ist ein Beispiel für …', ['Massengut (Flüssigladung)', 'Stückgut', 'Containerware', 'Handgepäck'], 'Es wird in Tankschiffen transportiert und durch Rohre gepumpt.'),
          tf('Hamburg ist gleichzeitig eine Stadt und ein Bundesland.', true, 'Hamburg ist einer der drei Stadtstaaten.'),
          mc('Welches Diagramm eignet sich gut, um eine Entwicklung über mehrere Jahre zu zeigen?', ['Säulendiagramm', 'Stadtplan', 'Lageskizze', 'Kreuzworträtsel'], 'Jede Säule steht für ein Jahr – so sieht man sofort, ob etwas steigt oder fällt.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'konflikte', title: 'Nutzungskonflikte & Nachhaltigkeit', emoji: '⚖️', sub: 'Wirtschaft, Umwelt, Gesellschaft – wer hat recht?',
      sayWho: 'alpaca', say: 'Ein Windpark vor der Insel: Die einen jubeln, die anderen protestieren. Wer hat recht? Meistens – alle ein bisschen.',
      explain: [
        ['Was ist ein Nutzungskonflikt?', 'Wenn verschiedene Gruppen dieselbe Landschaft **unterschiedlich nutzen** wollen und sich dabei in die Quere kommen, spricht man von einem Nutzungskonflikt.', 'Windpark oder Vogelschutz? Hotel oder Düne?'],
        ['Drei Bereiche', '**Wirtschaft (Ökonomie):** Geld verdienen, Arbeitsplätze schaffen.\n**Umwelt (Ökologie):** Tiere, Pflanzen und Landschaft schützen.\n**Gesellschaft (Soziales):** gutes Leben für die Menschen – Wohnen, Arbeit, Tradition.\nZusammen bilden sie das **Nachhaltigkeitsdreieck**.', ''],
        ['Nachhaltigkeit', 'Der Begriff stammt aus der **Forstwirtschaft**: Hans Carl von Carlowitz forderte 1713, nur so viele Bäume zu fällen, wie wieder nachwachsen.\nHeute bedeutet er: Wir sollen Rohstoffe und Flächen nur so stark nutzen, dass auch **kommende Generationen** noch gut leben können.', ''],
        ['Beispiel Wangerooge', 'Vor der Nordseeinsel sollte ein Offshore-Windpark gebaut werden.\n**Dafür:** der Ingenieur (sauberer Strom) und der Bürgermeister (Aufschwung für die Insel).\n**Dagegen:** die Naturschützerin (Vögel, Robben, Schweinswale), der Krabbenfischer (Fanggebiete) und der Hotelier (Lärm, verbaute Aussicht).', ''],
        ['Lösungen finden', 'Alle Beteiligten anhören, Vor- und Nachteile abwägen und einen **Kompromiss** suchen, der Wirtschaft, Umwelt und Gesellschaft berücksichtigt.', ''],
      ],
      facts: ['Ein einziges modernes Windrad auf See kann Strom für mehrere Tausend Haushalte liefern.', 'Das Wort „Nachhaltigkeit“ ist über 300 Jahre alt – erfunden von einem sächsischen Bergbau-Beamten, dem das Holz ausging.'],
      task: ['Konflikt vor der Haustür', 'Finde einen **Nutzungskonflikt in deinem Ort**: ein neues Baugebiet, eine Umgehungsstraße, ein Windrad, ein Skatepark … Wer ist dafür, wer dagegen? Ordne die Argumente den drei Bereichen Wirtschaft, Umwelt und Gesellschaft zu.'],
      levels: [
        { title: 'Streitschlichter', emoji: '🤝', questions: [
          mc('Was ist ein **Nutzungskonflikt**?', ['Verschiedene Gruppen wollen dieselbe Landschaft unterschiedlich nutzen', 'Ein Streit unter Touristen um Strandkörbe', 'Ein Verbot, die Natur zu betreten', 'Ein Unfall im Hafen'], 'Zum Beispiel: Naturschutz, Fischerei, Tourismus und Windkraft im selben Gebiet.'),
          match('Welches Fremdwort gehört zu welchem Bereich?', [['Ökonomie', 'Wirtschaft'], ['Ökologie', 'Umwelt'], ['Soziales', 'Gesellschaft']], 'Diese drei bilden die Ecken des Nachhaltigkeitsdreiecks.'),
          sort('Zu welchem Bereich gehört die Aussage?', ['Wirtschaft', 'Umwelt', 'Gesellschaft'], [['Der Windpark bringt Geld und Arbeitsplätze.', 0], ['Seltene Vögel und Schweinswale werden gestört.', 1], ['Die Einwohner brauchen bezahlbare Wohnungen.', 2], ['Hotels verdienen an den Urlaubern.', 0], ['Das Wattenmeer soll erhalten bleiben.', 1], ['Die Fischer wollen ihre Tradition bewahren.', 2]]),
          mc('Was bedeutet **Nachhaltigkeit**?', ['Rohstoffe nur so nutzen, dass auch kommende Generationen genug haben', 'Alles möglichst schnell verbrauchen', 'Nichts in der Natur anfassen', 'Immer mehr produzieren'], 'Wer nachhaltig handelt, denkt auch an die Kinder und Enkel.'),
          mc('Aus welchem Bereich stammt der Begriff Nachhaltigkeit?', ['Aus der Forstwirtschaft', 'Aus der Fischerei', 'Aus dem Bergsteigen', 'Aus der Schifffahrt'], 'Er wurde 1713 von Hans Carl von Carlowitz geprägt.'),
          mc('Welche Regel stellte Carlowitz 1713 für den Wald auf?', ['Nur so viele Bäume fällen, wie nachwachsen', 'Jeden Baum sofort fällen', 'Gar keine Bäume mehr fällen', 'Nur alte Bäume stehen lassen'], 'So bleibt der Wald auch für spätere Generationen erhalten.'),
          tf('Bei einem Nutzungskonflikt hat immer nur eine Seite recht.', false, 'Meist haben alle Seiten verständliche Gründe. Deshalb sucht man nach einem Kompromiss.'),
          word('Eine Lösung, bei der alle ein Stück nachgeben:', 'KOMPROMISS'),
          sort('Nachhaltig oder nicht?', ['nachhaltig', 'nicht nachhaltig'], [['nur so viele Fische fangen, wie nachwachsen', 0], ['einen Wald komplett abholzen', 1], ['Strom aus Wind erzeugen', 0], ['Müll ins Meer kippen', 1], ['Bäume nachpflanzen', 0]]),
        ] },
        { title: 'Insel-Rat', emoji: '🗣️', questions: [
          sort('Windpark vor Wangerooge: Wer ist dafür, wer dagegen?', ['dafür', 'dagegen'], [['Ingenieur der Windpark-Firma', 0], ['Bürgermeister', 0], ['Naturschützerin', 1], ['Krabbenfischer', 1], ['Hotelier', 1]], 'Der Bürgermeister hofft auf Aufschwung für die Insel, weil sie sonst nur vom Tourismus lebt.'),
          mc('Was bedeutet **offshore**?', ['Vor der Küste im Meer', 'Auf einem Berg', 'Unter der Erde', 'Im Hafen'], 'Offshore-Windparks stehen draußen auf See.'),
          mc('Warum ist die Nordsee ein guter Standort für Windräder?', ['Dort weht starker, gleichmäßiger Wind', 'Dort ist das Wasser warm', 'Dort wohnt niemand', 'Dort gibt es keine Schiffe'], 'Auf dem Meer bremsen keine Berge und Häuser den Wind.'),
          mc('Warum ist die Naturschützerin gegen den Windpark?', ['Vögel, Robben und Schweinswale können gestört oder verletzt werden', 'Sie mag keinen Strom', 'Er ist ihr zu teuer', 'Sie möchte lieber ein Hotel'], 'Sie findet Windkraft wichtig – aber nicht an diesem Standort.'),
          mc('Warum sorgt sich der Hotelier?', ['Baulärm und Rotoren am Horizont könnten Gäste vertreiben', 'Er hat Angst vor Wind', 'Er will selbst Strom erzeugen', 'Seine Gäste mögen keine Fische'], 'Die Gäste kommen wegen Ruhe und Nordsee-Idylle.'),
          mc('Wie findet man bei einem Nutzungskonflikt eine gute Lösung?', ['Alle anhören, Vor- und Nachteile abwägen, Kompromiss suchen', 'Der Lauteste bekommt recht', 'Man lost aus', 'Man tut gar nichts'], 'Die Lösung soll Wirtschaft, Umwelt und Gesellschaft berücksichtigen.'),
          mc('Auf einer Nordseeinsel liegt der Flugplatz direkt neben der Ruhezone. Welcher Konflikt entsteht?', ['Fluglärm stört die Tiere in der Schutzzone', 'Die Flugzeuge werden nass', 'Die Vögel wollen mitfliegen', 'Es gibt keinen Konflikt'], 'Verkehr für Touristen und Einwohner gegen Ruhe für die Natur.'),
          mc('Welcher Nutzungskonflikt kann an einer **Talsperre** im Gebirge entstehen?', ['Energiegewinnung und Trinkwasser gegen Naturschutz', 'Fischer gegen Bergsteiger', 'Bauern gegen Seeleute', 'Keiner – Talsperren stören niemanden'], 'Für den Stausee wird ein ganzes Tal überflutet.'),
          tf('Das Nachhaltigkeitsdreieck hat die Ecken Wirtschaft, Umwelt und Gesellschaft.', true, 'Eine nachhaltige Lösung achtet auf alle drei Ecken zugleich.'),
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'harz', title: 'Der Harz – ein Mittelgebirge', emoji: '⛰️', sub: 'Täler, Steigungsregen, Talsperren, Tourismus',
      sayWho: 'elara', say: 'Auf dem Brocken sollen in der Walpurgisnacht die Hexen tanzen. Ich wette, die frieren dabei ganz schön – dort oben ist es nass, kalt und windig!',
      explain: [
        ['Ein Mittelgebirge', 'Der Harz ist das **nördlichste Mittelgebirge** Deutschlands. Sein höchster Berg ist der **Brocken (1142 m)**. Der Gipfel ist waldfrei – dort oben ist es zu kalt und zu windig für Bäume.', ''],
        ['Wie entstehen Täler?', 'Regen sammelt sich zu Bächen und Flüssen. Das Wasser trägt nach und nach Gestein ab. Mitgeführte Steine schleifen Grund und Ufer zusätzlich ab. **Je steiler der Fluss, desto schneller schneidet er sich ein.** Viel Niederschlag und steiles Gelände lassen tiefe Täler entstehen.', ''],
        ['Nass im Westen, trocken im Osten', 'Die feuchte Luft kommt meist von Westen, steigt am Harz auf und regnet sich ab (**Steigungsregen**). Der Brocken bekommt rund 1600 mm Niederschlag im Jahr. Östlich des Gebirges, im **Regenschatten**, sind es nur etwa 550 mm.', ''],
        ['Die Menschen nutzen den Harz', '**Forstwirtschaft:** Holz aus den Wäldern.\n**Bergbau (früher):** Silber und Erze; mit Holzkohle wurde das Metall aus dem Gestein geschmolzen.\n**Talsperren:** Stauseen für Strom, Trinkwasser und Hochwasserschutz.\n**Windkraft** und vor allem **Tourismus**.', ''],
        ['Schutz und Streit', 'Ein **Nationalpark** schützt die Landschaft. Auch hier gibt es **Nutzungskonflikte**: zwischen Tourismus, Forstwirtschaft, Energiegewinnung und Naturschutz.', ''],
      ],
      facts: ['Auf dem Brocken gibt es an rund 300 Tagen im Jahr Nebel – Rekord in Deutschland.', 'Eine Dampfeisenbahn, die Brockenbahn, schnauft bis heute auf den Gipfel hinauf.', 'Im Harzer Bergbau wurde über 1 000 Jahre lang Silber gefördert. Das Rammelsberg-Bergwerk ist heute Weltkulturerbe.'],
      task: ['Tal-Labor', 'Schütte im Sandkasten oder in einer Wanne einen **Sandberg** auf. Gieße langsam Wasser auf den Gipfel und beobachte, wie Rinnen und Täler entstehen. Probier es mit einem flachen und einem steilen Berg: Wo wird das Tal schneller tief?'],
      levels: [
        { title: 'Brocken-Wanderer', emoji: '🥾', questions: [
          mc('Wie heißt der höchste Berg im Harz?', ['Brocken', 'Feldberg', 'Zugspitze', 'Wurmberg'], 'Der Brocken ist 1142 m hoch.'),
          mc('Zu welcher Großlandschaft gehört der Harz?', ['Mittelgebirgsland', 'Norddeutsches Tiefland', 'Alpenvorland', 'Alpen'], 'Er ist das nördlichste Mittelgebirge Deutschlands.'),
          mc('Wie sind die tiefen Täler im Harz entstanden?', ['Flüsse haben das Gestein über lange Zeit abgetragen', 'Menschen haben sie gegraben', 'Durch Vulkanausbrüche', 'Durch Sturmfluten'], 'Mitgeführte Steine schleifen Grund und Ufer ab wie Schmirgelpapier.'),
          mc('Warum ist es auf dem Brocken so oft nass?', ['Wegen des Steigungsregens', 'Weil er am Meer liegt', 'Weil dort ein See ist', 'Wegen der vielen Touristen'], 'Die feuchte Luft muss am Gebirge aufsteigen, kühlt ab und regnet sich aus.'),
          tf('Der Gipfel des Brockens ist dicht bewaldet.', false, 'Er ist waldfrei und karg – dort oben ist es zu kalt, zu windig und zu nass für Bäume.'),
          mc('Wozu dienen die Talsperren im Harz?', ['Für Strom, Trinkwasser und Hochwasserschutz', 'Zum Fischfang für Hamburg', 'Als Hafen für Seeschiffe', 'Zum Salzgewinnen'], 'Das aufgestaute Wasser treibt Turbinen an und wird als Trinkwasser gespeichert.'),
          mc('Wovon leben heute viele Menschen im Harz?', ['Vom Tourismus', 'Vom Fischfang', 'Vom Schiffbau', 'Vom Weinbau'], 'Wandern, Skifahren, die Brockenbahn – die abwechslungsreiche Landschaft zieht viele Gäste an.'),
          mc('Was wurde früher im Harz aus dem Berg geholt?', ['Silber und Erze', 'Erdöl', 'Salz', 'Diamanten'], 'Der Bergbau machte die Region reich.'),
          word('Der höchste Berg im Harz:', 'BROCKEN'),
          mc('Welche Sage gehört zum Brocken?', ['In der Walpurgisnacht tanzen dort die Hexen', 'Dort schläft ein Drache', 'Dort liegt ein Piratenschatz', 'Dort wohnt ein Riese im See'], 'Zur Walpurgisfeier in der Nacht zum 1. Mai kommen viele Touristen.'),
        ] },
        { title: 'Harz-Experte', emoji: '🧙', questions: [
          order('Warum regnet es auf der Westseite des Harzes so viel? Ordne.', ['Feuchte Luft weht von Westen heran', 'Die Luft steigt am Gebirge auf', 'Sie kühlt ab, Wolken entstehen', 'Es regnet am Westhang und am Gipfel', 'Im Osten sinkt die Luft ab – Regenschatten']),
          mc('Ein Ort östlich des Harzes bekommt nur etwa 550 mm Niederschlag im Jahr, der Brocken rund 1600 mm. Warum?', ['Der Ort liegt im Regenschatten', 'Der Ort liegt höher', 'Dort weht kein Wind', 'Dort ist es zu warm für Regen'], 'Die Luft hat sich vorher am Gebirge ausgeregnet.'),
          mc('Wann schneidet sich ein Fluss besonders schnell ins Gestein ein?', ['Wenn er steil bergab fließt', 'Wenn er langsam durch die Ebene fließt', 'Wenn er zugefroren ist', 'Wenn er wenig Wasser führt'], 'Schnelles Wasser hat mehr Kraft und trägt mehr Steine mit.'),
          mc('Wozu brauchte man früher im Harz so viel Holzkohle?', ['Um Silber aus dem Gestein herauszuschmelzen', 'Zum Grillen', 'Zum Heizen der Hotels', 'Für Dampfschiffe'], 'Forstwirtschaft und Bergbau hingen eng zusammen.'),
          mc('Welcher Nutzungskonflikt ist im Harz typisch?', ['Tourismus und Energiegewinnung gegen Naturschutz', 'Fischer gegen Hafenarbeiter', 'Deichbau gegen Landwirtschaft', 'Containerschiffe gegen Wattwanderer'], 'Auch der Nationalpark Harz hat nicht nur Befürworter.'),
          mc('Was haben der Harz und die Nordseeküste gemeinsam?', ['Tourismus, Windräder, einen Nationalpark und Nutzungskonflikte', 'Ebbe und Flut', 'Hohe Berge', 'Große Seehäfen'], 'Fragen, die man an eine Landschaft stellt, lassen sich auf andere übertragen.'),
          tf('Auf dem Brocken ist es im Jahresdurchschnitt kälter als am Fuß des Gebirges.', true, 'Oben liegt die Jahresmitteltemperatur nur bei etwa 3 °C.'),
          mc('In welchen Bundesländern liegt der Harz?', ['Niedersachsen, Sachsen-Anhalt und Thüringen', 'Bayern und Baden-Württemberg', 'Hessen und Rheinland-Pfalz', 'Sachsen und Brandenburg'], 'Der Brocken selbst liegt in Sachsen-Anhalt.'),
          mc('Welches Ziel hat der Nationalpark Harz?', ['Die Landschaft schützen und sich natürlich entwickeln lassen', 'Mehr Holz ernten', 'Neue Bergwerke eröffnen', 'Den Brocken abtragen'], 'Gleichzeitig zieht er weitere Besucher an.'),
        ] },
      ],
    },
  ],
};
