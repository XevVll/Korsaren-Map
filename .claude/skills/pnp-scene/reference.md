# Referenz: echte Code-Beispiele

Alle Snippets sind wörtlich aus dem Repo kopiert (Stand: siehe Datei-Kommentar oben in der
jeweiligen Quelldatei). Bei Zweifel: Originaldatei direkt lesen, dies ist nur eine kuratierte
Auswahl.

## Flaches Muster — `js/scenes.js`

```js
const SCENES = {
  "1.1": {
    label: "Grimsgate",
    background: "images/grimsgate_map.webp",
    markers: [
      {
        id: "heuer",
        top: 58.3, left: 40,
        title: "Zur letzten Heuer",
        desc: "Raue Hafenkneipe. Kaum Stammgäste — die meisten, die hier trinken, sieht man Jahre nicht wieder. Wer anheuern will, landet früher oder später hier.",
        img: "images/interior_heuer.webp"
      }
      // ... weitere Marker
    ]
    // optional: soundFile: "hafen_ambience.mp3"
  }
};
```

## Basis/Override-Muster — `js/golden_lion_scenes.js`

```js
const GOLDEN_LION_MARKERS_BASE = {
  frachtraum: {
    top: 70, left: 82,
    title: "Frachtraum / Laderaum",
    desc: "Dunkel, still, vollgestopft: Fässer und Kisten dicht gestaut...",
    img: "images/interior_frachtraum.webp",
    // optional: mehrere umschaltbare Bildzustände, unabhängig von Szene/Trigger
    variants: {
      standard: { label: "Standard (versteckt)", img: "images/interior_frachtraum.webp", desc: "..." },
      leer: { label: "Leer (Junge weg/gefunden)", img: "images/interior_frachtraum_leer.webp" }
    }
  }
  // ... weitere Basis-Marker
};

const GOLDEN_LION_SCENES = {
  "2.1": {
    label: "Golden Lion (Basis)",
    background: "images/golden_lion_cutaway.webp",
    imgOverrides: {}   // nutzt für alle Marker einfach die img aus BASE
  },
  "3.1": {
    label: "Golden Lion im Sturm",
    background: "images/golden_lion_cutaway_sturm.webp",
    hiddenMarkers: ["bug", "offiziersquartier", "unterdeck", "werkstatt", "kombuese"],
    imgOverrides: { oberdeck: "images/interior_oberdeck_sturm.webp" /* ... */ },
    descOverrides: { oberdeck: "Regen peitscht fast waagerecht über das Deck..." /* ... */ },
    soundFile: "storm1.ogg"
  }
};
```

Die Merge-Logik (`getGoldenLionMarkers(sceneId)`, `js/golden_lion_scenes.js`): überschreibt bei
einer aktiven `imgOverrides[id]` automatisch `variants` auf `null` für diesen Marker in dieser
Szene — sonst könnte eine alte Bild-Variante aus der Basis-Definition durchscheinen, obwohl die
Szene ein eigenes Bild vorschreibt. Das muss man beim Anlegen einer neuen Override-Szene nicht
selbst nachbauen, passiert automatisch — nur wissen, dass man `variants` nicht zusätzlich manuell
in `imgOverrides` „mit-überschreiben" muss.

## `MAP_REGISTRY`-Eintrag — `karte.html`

```js
const MAP_REGISTRY = [
  {
    getScene: function (sceneId) {
      return (typeof SCENES !== 'undefined') ? SCENES[sceneId] : undefined;
    },
    getMarkers: function (sceneId) {
      return (typeof SCENES !== 'undefined' && SCENES[sceneId]) ? SCENES[sceneId].markers : null;
    }
  },
  // ein weiterer Eintrag pro Kartenquelle (Golden Lion, Schatzinsel, ...),
  // bei Basis/Override ruft getMarkers() die Merge-Funktion statt .markers direkt auf
];
```

Eine neue Kartenquelle bekommt hier einen neuen Eintrag nach exakt diesem Muster.

## Registry-Gegenstück — `js/regie_vault.js`

```js
function getAllSceneEntries() {
  const entries = [];
  Object.keys(SCENES).forEach(function (id) { entries.push({ id: id, label: SCENES[id].label, source: 'town' }); });
  if (typeof GOLDEN_LION_SCENES !== 'undefined') {
    Object.keys(GOLDEN_LION_SCENES).forEach(function (id) { entries.push({ id: id, label: GOLDEN_LION_SCENES[id].label, source: 'ship' }); });
  }
  if (typeof SCHATZINSEL_SCENES !== 'undefined') {
    Object.keys(SCHATZINSEL_SCENES).forEach(function (id) { entries.push({ id: id, label: SCHATZINSEL_SCENES[id].label, source: 'island' }); });
  }
  return entries;
}
```
`getSceneLabel(sceneId)` und `getMarkersForScene(sceneId)` folgen demselben if/else-Muster (nach
`typeof ... !== 'undefined'` prüfen, dann zugreifen) — bei einer neuen Kartenquelle alle drei
Funktionen um einen analogen Block erweitern.

## `ORTE`-Eintrag mit Interaktionen — `js/regie.js`

```js
const ORTE = {
  "heuer": {
    personen: "Francesco · Tom Fletcher · Trewin-Zwillinge · Wat",
    kurz: "Ort zum Rekrutieren. Vier Wege an Bord, mit Fallback-Loop und Wat als letzte Instanz.",
    ortHinweis: "Fallback-Loop: Lehnt der Spieler Tom ab, fängt Francesco ihn ein zweites Mal ab...",
    interaktionen: {
      "francesco": {
        title: "Francesco — Verlockung",
        kurz: "Rum, Charme, beschönigte Fahrt. Freiwilliger Zugang. Kein Ruf.",
        details: "Ein südländischer Mann, weißes Hemd, buntes Halstuch, spricht Spieler proaktiv an...",
        trigger: [
          { id: "angenommen", label: "Angebot angenommen", info: "Ein südländischer Mann, weißes Hemd, buntes Halstuch, spricht proaktiv an, schenkt hochwertigen Rum aus eigener Flasche: „Setz dich, mein Freund...“" },
          { id: "abgelehnt_1", label: "Angebot abgelehnt (erstes Mal)", info: "Lehnt der Spieler ab, lässt Francesco locker — bleibt aber sichtbar." }
        ]
      }
    }
  },

  "hafenmeisterei": {
    personen: "Bartholomew Ashworth (Hafenmeister) · Gehilfe (namenlos, tollpatschig)",
    // "npcs" = an DIESEM Ort fest verankerte NPCs (anders als SZENEN_REGIE.ghosts, die
    // szenenweit frei platzierbar sind)
    npcs: [
      {
        name: "Bartholomew Ashworth",
        rolle: "Hafenmeister von Grimsgate",
        verfassung: "Phlegmatisch, auf Fassade bedacht, nicht dumm...",
        beduerfnis: "Seine Ruhe und den Anschein von Ordnung. Kein Ärger, der Arbeit macht."
      }
    ],
    kurz: "Verwaltet Anlegerechte, Fracht und Papiere...",
    ortHinweis: "Ein bescheidener Verwaltungsbau...",
    interaktionen: { /* ... */ }
  }
};
```

## `nurSzenen`/`nichtInSzenen`/`szenenUeberschreibungen` — echtes Beispiel (Achterdeck, Sturm)

```js
"achterdeck": {
  personen: "Tom Fletcher (lässig am Ruder)",
  // ...
  szenenUeberschreibungen: {
    "3.1": {
      personen: "Tom Fletcher (kämpft mit dem Ruder)"
      // kurz/ortHinweis hier weggelassen -> fallen auf den Basiswert zurück
    }
  },
  interaktionen: {
    "tom_lotse_sturm": {
      title: "Tom — Am Ruder, mit losem Mundwerk",
      nurSzenen: ["3.1"],           // erscheint NUR im Sturm
      trigger: [ /* ... */ ]
    },
    "knoten_streich": {
      title: "Tom Fletcher — Der Knoten-Streich",
      nichtInSzenen: ["3.1"],       // erscheint überall AUSSER im Sturm
      trigger: [ /* ... */ ]
    }
  }
}
```

## `SZENEN_REGIE`-Eintrag (szenenweit, nicht pro Ort) — `js/regie.js`

```js
const SZENEN_REGIE = {
  "1.1": {
    charaktere: ["francesco", "tom", "wat"],  // schränkt die Charakter-Leiste auf diese CHARACTERS-IDs ein
    stimmung: "Grimsgate lebt über seine Verhältnisse...",  // Vorlese-Grundton
    ghosts: [
      {
        name: "Silas Coote",
        rolle: "Böttcher, morgen an Bord",
        verfassung: "Fiebrig aufgekratzt, hat Haus und Werkstatt verkauft, redet von nichts als drüben.",
        beduerfnis: "Jemand, der seinen Rausch teilt — oder ihm bestätigt, dass er das Richtige tut."
      },
      {
        name: "Reuben Slade",
        rolle: "Tagelöhner, kein Platz mehr bekommen",
        verfassung: "Verbittert, kurz angebunden, das Fenster schließt sich vor seiner Nase.",
        beduerfnis: "Irgendwie doch an Bord — oder wenigstens einen, an dem er seinen Zorn auslässt.",
        koerperlich: true   // markiert einen kampffähigen Ghost
      }
    ]
  }
};
```
