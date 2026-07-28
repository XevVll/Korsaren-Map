// Szenen-Definition für die Grimsgate-Karte.
//
// Jede Szene hat eine ID, ein Label (für das Admin-Panel) und eine Liste
// von Markern, die in dieser Szene sichtbar sein sollen.
//
// Um eine neue Szene hinzuzufügen: einfach ein neues Objekt in SCENES
// ergänzen. Um einen neuen Marker (Ort) hinzuzufügen: einfach ein neues
// Objekt in die "markers"-Liste einer Szene einfügen.
//
// Marker-Felder:
//   id     - eindeutiger Bezeichner (frei wählbar, aber pro Marker einmalig)
//   top    - Position von oben in % (wie bisher per Augenmaß/Pixel ermittelt)
//   left   - Position von links in %
//   title  - Überschrift im Tooltip/Overlay
//   desc   - Beschreibungstext im Tooltip/Overlay
//   img    - Dateiname des Innenraumbilds (liegt im selben Ordner)
//
// Szenen-Feld "background":
//   Dateiname des Kartenbilds, auf dem die Marker dieser Szene liegen.
//   Grimsgate-Szenen (1.1/1.2) nutzen beide dieselbe Stadtkarte
//   (grimsgate_map.png). Andere Karten (z.B. das Golden-Lion-Schiff,
//   siehe golden_lion_scenes.js) haben eigene Hintergrundbilder - die
//   neue Spieler-Seite korsaren_szenen.html liest dieses Feld pro Szene
//   aus und lädt automatisch das passende Bild.

// Szenen-Feld "sound" (optional):
//   YouTube-Video-ID (nicht die volle URL, nur die ID nach "v=" bzw. nach
//   "youtu.be/") eines Videos, dessen TON als Hintergrundgeräusch für diese
//   Szene läuft - das Video selbst wird nirgends angezeigt, nur der Ton.
//   Fehlt das Feld, läuft für diese Szene kein Ton.
//   Beispiel: sound: "dQw4w9WgXcQ"

const SCENES = {
  "1.1": {
    label: "1.1 – Grimsgate (Start)",
    background: "grimsgate_map.png",
    markers: [
      {
        id: "heuer",
        top: 58.3, left: 40,
        title: "Zur letzten Heuer",
        desc: "Raue Hafenkneipe. Kaum Stammgäste — die meisten, die hier trinken, sieht man Jahre nicht wieder. Wer anheuern will, landet früher oder später hier.",
        img: "interior_heuer.png"
      },
      {
        id: "hafenmeisterei",
        top: 27.5, left: 9.4,
        title: "Hafenmeisterei",
        desc: "Verwaltet Anlegerechte, Fracht und Papiere. Ordnungsmacht des Hafens.",
        img: "interior_hafenmeisterei.png"
      },
      {
        id: "lagerhaeuser",
        top: 26.7, left: 26.3,
        title: "Lagerhäuser",
        desc: "Von außen chaotisch, im Kern strikt organisiert. Hier läuft die Beladung des Konvois wie ein Uhrwerk.",
        img: "interior_lagerhaeuser.png"
      },
      {
        id: "markt",
        top: 74.6, left: 53.2,
        title: "Marktplatz",
        desc: "Handel, Menschenmengen, guter Ort für Gerüchte und Zufallsbegegnungen.",
        img: "interior_markt.png"
      },
      {
        id: "kraemerladen",
        top: 58.9, left: 49.8,
        title: "Krämerladen",
        desc: "Ausrüstung und Grundbedarf. Der Krämer hört viel — und vergisst wenig.",
        img: "interior_kraemerladen.png"
      },
      {
        id: "bordell",
        top: 50.5, left: 85.1,
        title: "Bordell",
        desc: "Etwas abseits der Stadt gelegen, unauffällig. Rote Fenster, wenig Fragen.",
        img: "interior_bordell.png"
      }
    ]
  },

  "1.2": {
    label: "1.2 – Golden Lion sichtbar",
    background: "grimsgate_map.png",
    // Alle Marker aus 1.1 plus den neuen Golden-Lion-Marker.
    // Position ist ein Platzhalter (top/left) - wird noch final festgelegt.
    markers: [
      {
        id: "heuer",
        top: 58.3, left: 40,
        title: "Zur letzten Heuer",
        desc: "Raue Hafenkneipe. Kaum Stammgäste — die meisten, die hier trinken, sieht man Jahre nicht wieder. Wer anheuern will, landet früher oder später hier.",
        img: "interior_heuer.png"
      },
      {
        id: "hafenmeisterei",
        top: 27.5, left: 9.4,
        title: "Hafenmeisterei",
        desc: "Verwaltet Anlegerechte, Fracht und Papiere. Ordnungsmacht des Hafens.",
        img: "interior_hafenmeisterei.png"
      },
      {
        id: "lagerhaeuser",
        top: 26.7, left: 26.3,
        title: "Lagerhäuser",
        desc: "Von außen chaotisch, im Kern strikt organisiert. Hier läuft die Beladung des Konvois wie ein Uhrwerk.",
        img: "interior_lagerhaeuser.png"
      },
      {
        id: "markt",
        top: 74.6, left: 53.2,
        title: "Marktplatz",
        desc: "Handel, Menschenmengen, guter Ort für Gerüchte und Zufallsbegegnungen.",
        img: "interior_markt.png"
      },
      {
        id: "kraemerladen",
        top: 58.9, left: 49.8,
        title: "Krämerladen",
        desc: "Ausrüstung und Grundbedarf. Der Krämer hört viel — und vergisst wenig.",
        img: "interior_kraemerladen.png"
      },
      {
        id: "bordell",
        top: 50.5, left: 85.1,
        title: "Bordell",
        desc: "Etwas abseits der Stadt gelegen, unauffällig. Rote Fenster, wenig Fragen.",
        img: "interior_bordell.png"
      },
      {
        id: "golden_lion",
        top: 40, left: 15,   // PLATZHALTER - Position später anpassen
        title: "Golden Lion",
        desc: "Ein stolzes kleines Kriegsschiff, mitten im Konvoi vor Anker.",
        img: "golden_lion.png"
      }
    ]
  }
};

// ID der Szene, die angezeigt wird, falls (noch) keine Verbindung zu
// Firebase besteht oder noch nichts gesetzt wurde.
const DEFAULT_SCENE = "1.1";
