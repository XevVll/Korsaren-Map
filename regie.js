// Regie-Daten für die Admin-Ansicht: Inhalte pro Ort.
//
// Orte sind FLACH definiert (eine Definition pro Ort-ID), nicht pro Szene -
// ein Ort wie "heuer" bleibt inhaltlich gleich, unabhängig davon, in
// welcher Szene die Karte gerade ist. WELCHE Orte in einer Szene auftauchen,
// bestimmt weiterhin allein scenes.js (SCENES[sceneId].markers) - die
// Admin-Ansicht zeigt für die gewählte Szene also automatisch nur die dort
// vorhandenen Marker, nachgeschlagen in ORTE.
//
// WICHTIG: Diese Datei enthält nur STATISCHE Inhalte (Texte, Trigger-
// Definitionen). Der dynamische Teil (welcher Trigger ausgelöst wurde,
// was in den Notizfeldern steht) liegt in Firebase unter
// "regie/{szeneId}/{ortId}/..." - pro Szene getrennt gespeichert, falls
// z.B. ein Ort in mehreren Szenen mit unterschiedlichem Zustand vorkommt.
//
// Um einen Ort auszuformulieren: "interaktionen" befüllen. Orte ohne
// Interaktionen werden in der Admin-Ansicht als "noch nicht ausformuliert"
// angezeigt.
//
// Trigger-Felder:
//   id    - eindeutiger Bezeichner innerhalb der Interaktion (Firebase-Pfad)
//   label - Anzeigetext in der Admin-Ansicht

const ORTE = {
  "heuer": {
    personen: "Francesco · Tom Fletcher · Trewin-Zwillinge · Wat",
    kurz: "Ort zum Rekrutieren. Vier Wege an Bord, mit Fallback-Loop und Wat als letzte Instanz.",
    ortNotizenDefault: "Fallback-Loop: Lehnt der Spieler Tom ab, fängt Francesco ihn ein zweites Mal ab (Gewinn feiern / Verlust ertränken). Erst wenn auch das scheitert, steht der Spieler draußen Walter gegenüber.",
    interaktionen: {
      "francesco": {
        title: "Francesco — Verlockung",
        kurz: "Rum, Charme, beschönigte Fahrt. Freiwilliger Zugang. Kein Ruf.",
        details: "Ein südländischer Mann, weißes Hemd, buntes Halstuch, spricht Spieler proaktiv an. Schenkt hochwertigen Rum aus eigener Flasche, beschönigt die Fahrt (schnelles Geld, kaum Risiko, fast Urlaub in den Tropen). Kein Druck, kein Zeitlimit.\n\n„Setz dich, mein Freund — der hier ist besser als alles, was du unten bestellen würdest.“\n\nNimmt der Spieler an → Anheuerung, gute Konditionen.\nLehnt ab → Francesco lässt locker, bleibt sichtbar (Fallback-Loop nach Tom).",
        trigger: [
          { id: "angenommen", label: "Angebot angenommen" },
          { id: "abgelehnt_1", label: "Angebot abgelehnt (erstes Mal)" },
          { id: "fallback", label: "Fallback-Loop ausgelöst (nach Tom)" }
        ]
      },
      "tom": {
        title: "Tom Fletcher — Falschspiel",
        kurz: "Gezinkte Würfel, Eskalation, Anheuerung als Schuldentilgung. Kein Ruf.",
        details: "Tom spielt mit ranghöheren Männern eines anderen Schiffes, gezinkte Würfel. Spieler verliert 1-2× harmlos, Tom erhöht den Einsatz, lässt zwischendurch gewinnen, dann Alles-oder-Nichts.\n\n„Junge! Heute ist dein Glückstag! Du kannst doch jetzt nicht aufhören!“\n\nEchter Ausstieg vor dem finalen Einsatz jederzeit möglich. Verliert final → Angebot übersteigt den Verlust, Aufforderung mit an Bord zu kommen.",
        trigger: [
          { id: "einstieg", label: "Spieler steigt ein" },
          { id: "vorzeitig_aus", label: "Spieler steigt vorzeitig aus" },
          { id: "finaler_verlust", label: "Finaler Verlust — Angebot gemacht" },
          { id: "angebot_reaktion", label: "Angebot angenommen / abgelehnt" }
        ]
      },
      "zwillinge": {
        title: "Trewin-Zwillinge — Trinkspiel",
        kurz: "Probe: Körper (alt. Auftreten). Einziger Weg mit Rufgewinn.",
        details: "Zwei baugleiche, laute Brüder ziehen komödiantisch Aufmerksamkeit auf sich, fordern zum Trinkspiel heraus. Schaulustige feuern an.\n\n„He, du da! Bist du ein Mann oder ein Fass mit Beinen? Zeig's uns!“\n\nProbe: Körper (Standhaltevermögen)\n— Guter Erfolg: Zwillinge begeistert, rufen es laut durch die Kneipe → Angebot + erhöhter Rufgewinn\n— Normaler Erfolg: besteht → Angebot + normaler Rufgewinn\n— Schlechter Erfolg: kostet 1 Körper, hält sich gerade so → Angebot trotzdem, kein Rufgewinn\n— Misserfolg: Ohnmacht → nächster Morgen an Bord, schlechte Konditionen, kein Ruf\n\nAlternative Probe: Auftreten (rhetorisch/unterhaltsam statt trinken)\n— Guter/Normaler Erfolg → gleiches Ergebnis wie Standhalten (Angebot + Ruf je nach Bandstufe)\n— Schlechter/Misserfolg → Zwillinge verlieren Interesse, kein Angebot über diesen Weg, aber auch kein Malus",
        trigger: [
          { id: "koerper_gut", label: "Körper-Probe: Guter Erfolg" },
          { id: "koerper_normal", label: "Körper-Probe: Normaler Erfolg" },
          { id: "koerper_schlecht", label: "Körper-Probe: Schlechter Erfolg" },
          { id: "auftreten_versucht", label: "Auftreten-Probe versucht (statt Trinken)" },
          { id: "ohnmacht", label: "Misserfolg — Ohnmacht" }
        ]
      },
      "wat": {
        title: "Wat — Zwangsrekrutierung (draußen, nachts)",
        kurz: "Letzte Instanz. Nur wenn kein anderer Weg genutzt wurde. Kein Ruf.",
        details: "Verlässt der Spieler nachts die Kneipe, ohne einen der drei Wege angenommen zu haben: Überfall im Dunkeln, niedergeschlagen. Shanghaiing nach Drake'schem Vorbild.\n\nAufwachen am nächsten Morgen an Bord, ohne Erinnerung an den Übergang.",
        trigger: [
          { id: "verlassen_ohne", label: "Spieler verlässt Kneipe nachts ohne Anheuerung" },
          { id: "ueberfall", label: "Überfall ausgelöst" }
        ]
      }
    }
  },

  "hafenmeisterei": {
    personen: "Bartholomew Ashworth · Gehilfe",
    kurz: "Verwaltet Anlegerechte, Fracht und Papiere. Trigger-Szene möglich, wenn Spieler vor der Kneipe hierher gehen.",
    ortNotizenDefault: "",
    interaktionen: {}
  },
  "lagerhaeuser": {
    personen: "–",
    kurz: "Von außen chaotisch, im Kern strikt organisiert. Noch nicht ausformuliert.",
    ortNotizenDefault: "",
    interaktionen: {}
  },
  "markt": {
    personen: "–",
    kurz: "Handel, Menschenmengen, guter Ort für Gerüchte. Noch nicht ausformuliert.",
    ortNotizenDefault: "",
    interaktionen: {}
  },
  "kraemerladen": {
    personen: "–",
    kurz: "Ausrüstung und Grundbedarf. Noch nicht ausformuliert.",
    ortNotizenDefault: "",
    interaktionen: {}
  },
  "bordell": {
    personen: "Constance Wrey · Ezra Coombe · Ned Sharpe",
    kurz: "Sozialer Zugang + Wat-Falle + 'Raubein'-Zusatzszene. Noch nicht final ausformuliert.",
    ortNotizenDefault: "",
    interaktionen: {}
  },
  "golden_lion": {
    personen: "–",
    kurz: "Ein stolzes kleines Kriegsschiff, mitten im Konvoi vor Anker. Noch nicht ausformuliert.",
    ortNotizenDefault: "",
    interaktionen: {}
  }
};
