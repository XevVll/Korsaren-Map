// Szenen-Definition für die Golden-Lion-Schiffskarte.
//
// Gleiches Prinzip wie scenes.js für Grimsgate: Jede Szene hat eine ID,
// ein Label (Admin-Panel) und eine Liste von Markern (Ort-ID, Position,
// Titel, Beschreibung, Innenraumbild).
//
// Positionen (top/left in %) sind vorerst grobes Augenmaß anhand des
// Referenzbilds - Feinjustierung folgt, sobald das Bild final eingebunden
// ist (analog zum bisherigen Vorgehen bei Grimsgate).
//
// Ort-IDs sind bewusst so gewählt, dass sie später 1:1 mit den Regie-Daten
// (ORTE-Objekt, wie bei regie.js) verknüpft werden können.

const GOLDEN_LION_SCENES = {
  "2.1": {
    label: "2.1 – Golden Lion (Basis)",
    background: "golden_lion_cutaway.png",
    markers: [
      {
        id: "bug",
        top: 26, left: 20,
        title: "Bug / Vorschiff",
        desc: "Vorderster Teil des offenen Oberdecks, Bugspriet und vorderes Tauwerk.",
        img: "interior_bug.png"
      },
      {
        id: "oberdeck",
        top: 33, left: 46,
        title: "Oberdeck",
        desc: "Offene Decksmitte um den Hauptmast, Taljen, arbeitende Crew.",
        img: "interior_oberdeck.png"
      },
      {
        id: "achterdeck",
        top: 34, left: 75,
        title: "Achterdeck",
        desc: "Erhöhtes Deck am Heck, Offiziere, vermutlich das Ruder.",
        img: "interior_achterdeck.png"
      },
      {
        id: "kapitaenskajuete",
        top: 40, left: 30,
        title: "Kapitänskajüte",
        desc: "Großzügiger Raum mit hohen Fenstern unter dem Achterdeck, eigener Zugang über einen Niedergang.",
        img: "interior_kapitaenskajuete.png"
      },
      {
        id: "offiziersquartier",
        top: 54, left: 28,
        title: "Offiziersquartier",
        desc: "Kleiner, schlichter eingerichteter Raum mit fester Koje, neben der Kapitänskajüte.",
        img: "interior_offiziersquartier.png"
      },
      {
        id: "batteriedeck",
        top: 56, left: 57,
        title: "Batteriedeck",
        desc: "Durchgehende Kanonenreihe, Hauptbewaffnung des Schiffs.",
        img: "interior_batteriedeck.png"
      },
      {
        id: "unterdeck",
        top: 68, left: 46,
        title: "Unterdeck (Mannschaft)",
        desc: "Hängematten über mehrere Bereiche verteilt, Alltag der einfachen Crew.",
        img: "interior_unterdeck.png"
      },
      {
        id: "werkstatt",
        top: 68, left: 65,
        title: "Werkstatt",
        desc: "Werkbank und Werkzeug des Schiffszimmermanns.",
        img: "interior_werkstatt.png"
      },
      {
        id: "frachtraum",
        top: 73, left: 77,
        title: "Frachtraum / Laderaum",
        desc: "Fässer, Kisten, aufgerolltes Tauwerk.",
        img: "interior_frachtraum.png"
      },
      {
        id: "kombuese",
        top: 78, left: 53,
        title: "Kombüse",
        desc: "Ziegelherd, tief im Rumpf, über dem Ballast erbaut, Koch bei der Arbeit.",
        img: "interior_kombuese.png"
      }
    ]
  }
};

// ID der Szene, die angezeigt wird, falls (noch) keine Verbindung zu
// Firebase besteht oder noch nichts gesetzt wurde.
const DEFAULT_GOLDEN_LION_SCENE = "2.1";
