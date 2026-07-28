// Szenen-Definition für die Golden-Lion-Schiffskarte.
//
// ANDERS ALS BEI GRIMSGATE (scenes.js): Positionen, Titel und Beschreibung
// jedes Markers werden hier NUR EINMAL in GOLDEN_LION_MARKERS_BASE
// definiert. Jede Szene (Basis, Sturm, Karibik, ...) überschreibt in
// GOLDEN_LION_SCENES nur das, was sich für diese Szene tatsächlich
// ändert (meistens: welches Bild angezeigt wird).
//
// WARUM DAS SO GEBAUT IST (statt wie bei Grimsgate jede Szene komplett
// neu aufzulisten):
//
//   Ohne Basis/Override müsstet ihr bei jeder neuen Szene (z.B. "Sturm")
//   alle 10 Marker mit Position, Titel und Beschreibung erneut komplett
//   hinschreiben - auch wenn sich nur das Bild von 3 der 10 Marker
//   ändert. Bei 5 Szenen wären das 50 Marker-Einträge, bei denen sich
//   die Positionsdaten 47 Mal wortwörtlich wiederholen. Vertippt sich
//   dabei jemand bei einer "top"/"left"-Zahl, wandert der Marker in
//   genau dieser einen Szene minimal von der Stelle, an der er in allen
//   anderen Szenen sitzt - ein Fehler, der leicht unbemerkt bleibt,
//   weil er nur beim Durchklicken dieser einen Szene auffällt.
//
//   Mit Basis/Override gibt es die Position jedes Markers nur an EINER
//   Stelle im Code. Eine neue Szene braucht im einfachsten Fall nur:
//
//     "3.1": {
//       label: "3.1 - Golden Lion im Sturm",
//       background: "golden_lion_cutaway_sturm.png",
//       imgOverrides: { oberdeck: "interior_oberdeck_sturm.png" }
//     }
//
//   Alle 10 Marker existieren automatisch weiter, an derselben Stelle,
//   mit demselben Titel/Text - nur "oberdeck" zeigt ein anderes Bild.
//   Ändert sich später eine Marker-POSITION (z.B. weil ihr die
//   Koordinate nachjustiert), passiert das an einer einzigen Stelle
//   und wirkt sich auf alle Szenen gleichzeitig aus.
//
// Nutzung: getGoldenLionMarkers(sceneId) liefert die fertig
// zusammengeführte Marker-Liste für eine Szene - Basis-Daten plus
// alle Overrides dieser Szene, in dieser Reihenfolge angewendet.

const GOLDEN_LION_MARKERS_BASE = {
  bug: {
    top: 26, left: 20,
    title: "Bug / Vorschiff",
    desc: "Vorderster Teil des offenen Oberdecks, Bugspriet und vorderes Tauwerk.",
    img: "interior_bug.png"
  },
  oberdeck: {
    top: 33, left: 46,
    title: "Oberdeck",
    desc: "Offene Decksmitte um den Hauptmast, Taljen, arbeitende Crew.",
    img: "interior_oberdeck.png"
  },
  achterdeck: {
    top: 34, left: 75,
    title: "Achterdeck",
    desc: "Erhöhtes Deck am Heck, Offiziere, vermutlich das Ruder.",
    img: "interior_achterdeck.png"
  },
  kapitaenskajuete: {
    top: 40, left: 30,
    title: "Kapitänskajüte",
    desc: "Großzügiger Raum mit hohen Fenstern unter dem Achterdeck, eigener Zugang über einen Niedergang.",
    img: "interior_kapitaenskajuete.png"
  },
  offiziersquartier: {
    top: 54, left: 28,
    title: "Offiziersquartier",
    desc: "Kleiner, schlichter eingerichteter Raum mit fester Koje, neben der Kapitänskajüte.",
    img: "interior_offiziersquartier.png"
  },
  batteriedeck: {
    top: 56, left: 57,
    title: "Batteriedeck",
    desc: "Durchgehende Kanonenreihe, Hauptbewaffnung des Schiffs.",
    img: "interior_batteriedeck.png"
  },
  unterdeck: {
    top: 68, left: 46,
    title: "Unterdeck (Mannschaft)",
    desc: "Hängematten über mehrere Bereiche verteilt, Alltag der einfachen Crew.",
    img: "interior_unterdeck.png"
  },
  werkstatt: {
    top: 68, left: 65,
    title: "Werkstatt",
    desc: "Werkbank und Werkzeug des Schiffszimmermanns.",
    img: "interior_werkstatt.png"
  },
  frachtraum: {
    top: 73, left: 77,
    title: "Frachtraum / Laderaum",
    desc: "Fässer, Kisten, aufgerolltes Tauwerk.",
    img: "interior_frachtraum.png"
  },
  kombuese: {
    top: 78, left: 53,
    title: "Kombüse",
    desc: "Ziegelherd, tief im Rumpf, über dem Ballast erbaut, Koch bei der Arbeit.",
    img: "interior_kombuese.png"
  }
};

const GOLDEN_LION_SCENES = {
  "2.1": {
    label: "2.1 – Golden Lion (Basis)",
    background: "golden_lion_cutaway.png",
    imgOverrides: {}      // nutzt für alle Marker einfach die img aus BASE
    // descOverrides: {}  // optional, falls in einer Szene auch Texte abweichen sollen
  }

  // Beispiel für später, zum Reinkopieren und Anpassen:
  //
  // "3.1": {
  //   label: "3.1 – Golden Lion im Sturm",
  //   background: "golden_lion_cutaway_sturm.png",
  //   imgOverrides: {
  //     oberdeck: "interior_oberdeck_sturm.png",
  //     achterdeck: "interior_achterdeck_sturm.png"
  //   }
  // },
  //
  // "4.1": {
  //   label: "4.1 – Golden Lion in der Karibik",
  //   background: "golden_lion_cutaway_karibik.png",
  //   imgOverrides: {
  //     oberdeck: "interior_oberdeck_karibik.png"
  //   }
  // }
};

// ID der Szene, die angezeigt wird, falls (noch) keine Verbindung zu
// Firebase besteht oder noch nichts gesetzt wurde.
const DEFAULT_GOLDEN_LION_SCENE = "2.1";

// Führt Basis-Marker-Daten und die Overrides einer Szene zusammen.
// Gibt ein Array von Markern zurück, wie es scenes.js/SCENES[...].markers
// bisher direkt geliefert hat - damit ist die Kartenseite/Admin-Seite
// unverändert nutzbar, sie muss nur diese Funktion statt eines direkten
// Feldzugriffs aufrufen.
function getGoldenLionMarkers(sceneId) {
  const scene = GOLDEN_LION_SCENES[sceneId];
  if (!scene) return [];

  const imgOverrides = scene.imgOverrides || {};
  const descOverrides = scene.descOverrides || {};

  return Object.keys(GOLDEN_LION_MARKERS_BASE).map(function (id) {
    const base = GOLDEN_LION_MARKERS_BASE[id];
    return {
      id: id,
      top: base.top,
      left: base.left,
      title: base.title,
      desc: descOverrides[id] || base.desc,
      img: imgOverrides[id] || base.img
    };
  });
}
