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
    ortHinweis: "Fallback-Loop: Lehnt der Spieler Tom ab, fängt Francesco ihn ein zweites Mal ab (Gewinn feiern / Verlust ertränken). Erst wenn auch das scheitert, steht der Spieler draußen Walter gegenüber.",
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
        title: "Tom Fletcher — Liar's Dice",
        kurz: "Gezinktes Würfelspiel (Meiern-Regeln), Eskalation, Anheuerung als Schuldentilgung. Kein Ruf.",
        details: "Tom spielt mit ranghöheren Männern eines anderen Schiffes „Liar's Dice“ — jeder würfelt verdeckt (`!roll 2d6`), nennt dann laut ein Ergebnis, das er selbst gewürfelt haben will. Pasch schlägt Summe, (2,1)/„Mariner“ schlägt alles. Wer dem Vorgänger nicht glaubt, deckt auf: stimmt die Angabe, verliert der Zweifler; lügt der Vorgänger, verliert er. Tom hat gezinkte Würfel und lügt bei Bedarf schamlos weiter, auch wenn aufgedeckt wird.\n\nSpieler verliert 1-2× harmlos, Tom erhöht den Einsatz, lässt zwischendurch gewinnen, dann Alles-oder-Nichts.\n\n„Junge! Heute ist dein Glückstag! Du kannst doch jetzt nicht aufhören!“\n\nEchter Ausstieg vor dem finalen Einsatz jederzeit möglich. Verliert final → Angebot übersteigt den Verlust, Aufforderung mit an Bord zu kommen.",
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
    personen: "Bartholomew Ashworth (Hafenmeister) · Gehilfe (namenlos, tollpatschig)",
    kurz: "Verwaltet Anlegerechte, Fracht und Papiere. Zwei Wege: normale Nachfrage oder Sonderfall bei Besuch vor der Kneipe.",
    ortHinweis: "Ein bescheidener Verwaltungsbau, mehr Aktenstaub als Amtswürde. Ashworth sitzt meist hinter einem überladenen Schreibtisch, den Blick eher auf seine Fingernägel als auf die Besucher gerichtet — ein Mann aus gutem Hause, der es nie zu etwas Größerem gebracht hat und sich seit rund 30 Jahren mit Anlegerechten und Frachtpapieren in Grimsgate begnügt. Phlegmatisch, auf Fassade bedacht, aber nicht dumm. Sein Gehilfe — jung, eifrig, notorisch überfordert — sitzt meist mit einem Klemmbrett im Hintergrund und mischt sich öfter ein, als es ihm zusteht.",
    interaktionen: {
      "nachfrage": {
        title: "Normalfall — Spieler fragt aktiv nach",
        kurz: "Nur auf aktive Nachfrage. Gehilfe verrät versehentlich die Kneipe, Ashworth bemerkt die Unstimmigkeit.",
        details: "Nur wenn der Spieler aktiv nachfragt (kein automatischer Trigger). Ashworth lässt sich die Schiffslisten geben, blättert lustlos:\n\n„Alle voll. Tut mir leid, mein Guter — falscher Zeitpunkt, um in Grimsgate anzuheuern.“\n\nSein Gehilfe, bisher stumm im Hintergrund, platzt dazwischen, zu eifrig, um nachzudenken:\n\n„Äh — Sir, 'Zur letzten Heuer' sucht doch noch, oder? Ich hab da gestern noch—“\n\nEr verstummt, wird rot, als ihm auffällt, was er gerade preisgegeben hat. Ashworth runzelt die Stirn, mehr verwirrt als misstrauisch:\n\n„'Zur letzten Heuer'? Welches Schiff heuert denn dort an? Steht mir nichts davon in der Meldeliste.“\n\nKleiner komödiantischer Moment: Ashworth durchschaut allmählich, dass sein Gehilfe selbst in der Kneipe war (vermutlich privat), ohne Konsequenzen für den Spieler. Für den Spieler bestätigt sich hier höchstens: Die Golden Lion ist nicht offiziell registriert — eine Information, kein Zugang. Kein direkter Schiffszugang über diesen Weg.",
        trigger: [
          { id: "nachfrage_aktiv", label: "Spieler fragt aktiv nach Anheuerung" },
          { id: "gehilfe_verraet", label: "Gehilfe verrät \"Zur letzten Heuer\"" },
          { id: "ashworth_unstimmigkeit", label: "Ashworth registriert Unstimmigkeit (Golden Lion nicht gelistet)" }
        ]
      },
      "sonderfall": {
        title: "Sonderfall — Spieler kommt vor der Kneipe",
        kurz: "Ashworth schickt eine Wache mit, Konfrontation mit Harwick am nächsten Morgen.",
        details: "Wenn der Spieler die Hafenmeisterei aufsucht, bevor er in der Kneipe war: Ashworth registriert die Anfrage als ungewöhnlich (jemand, der offensichtlich anheuern will, aber kein Schiff nennen kann) und schickt diskret eine Wache los, die dem Spieler unauffällig folgt — mit dem Auftrag, herauszufinden, zu welchem Schiff er am Ende gehört. Nicht misstrauisch im Sinne von \"verdächtig\", eher pflichtbewusst-bürokratisch: Jemand ohne Schiff, der anheuern will, gehört registriert.\n\nAm nächsten Morgen erscheint Ashworth mit der Wache am Anleger der Golden Lion und stellt Harwick zur Rede — offiziell, aber nicht feindselig. Harwick löst die Situation routiniert mit Charme und/oder diskreter Bestechung, Ashworth zieht zufrieden ab. Für den Spieler bleibt das meist im Hintergrund, es sei denn, er wird von der Wache als derjenige erkannt, der sie hergeführt hat.\n\nErkennungsmechanik: Wahrnehmungs-Probe der Wache gegen Auftreten/Gewandtheit des Spielers (opponierter Wurf). Besteht die Wache, erinnert sie sich an das Gesicht. Konsequenz bei Erkennung: kleiner Rufmalus bei der Crew (Ärger mit der Obrigkeit gleich am ersten Tag provoziert zu haben, kommt nicht gut an) — kein hartes Strafsystem, eher sozialer Dämpfer.",
        trigger: [
          { id: "besuch_vor_kneipe", label: "Spieler besucht Hafenmeisterei vor der Kneipe" },
          { id: "wache_losgeschickt", label: "Wache wird losgeschickt" },
          { id: "konfrontation_morgen", label: "Konfrontation am nächsten Morgen (Harwick löst es)" },
          { id: "erkannt_rufmalus", label: "Spieler von Wache erkannt → Rufmalus" }
        ]
      }
    }
  },
  "lagerhaeuser": {
    personen: "Wachen · Belader (namenlos, abweisend)",
    kurz: "Von außen chaotisch, im Kern strikt organisiert. Abweisender Ort — Wachen lassen kaum durch, Belader haben keine Zeit für Fremde.",
    ortHinweis: "Von außen wirkt es wie ein einziges Durcheinander — Kisten, Fässer, Männer, die sich im Laufschritt kreuzen. Wer genauer hinsieht, erkennt: Das hier läuft wie ein Uhrwerk, jeder Handgriff sitzt, der Konvoi muss beladen werden, und dafür bleibt keine Zeit für Ablenkung.\n\nWachen stehen an den Eingängen und lassen Fremde kaum durch — wer keinen erkennbaren Grund hat, wird höflich, aber bestimmt abgewiesen. Die Belader selbst sind kaum ansprechbar: kurze, einsilbige Antworten, wenn überhaupt, und ein Blick, der sagt, dass man hier niemanden kennt und auch keine Zeit hat, das zu ändern. Alle sind sichtbar im Stress, den Konvoi rechtzeitig fertig zu bekommen.",
    interaktionen: {
      "beobachtung": {
        title: "Zufallsbeobachtung — Wache trifft Kapitän",
        kurz: "Optionale Wahrnehmungs-Probe (keine Erschwernis). Teaser auf die Golden Lion, Wink zur Hafenmeisterei.",
        details: "Am Rand der Lagerhäuser, halb hinter gestapelten Fässern, steht eine Wache im Gespräch mit einem auffällig gut gekleideten Mann — selbstsicheres Auftreten, ein Charme, der nicht so recht zur Nüchternheit des Ortes passen will (Harwick, dem Spieler zu diesem Zeitpunkt unbekannt). Die Wache wirkt zunächst angespannt, blättert in einem Papierstapel, schüttelt den Kopf — bis der Fremde ihm etwas zusteckt (Münzen? ein gefaltetes Papier? aus der Distanz nicht sicher zu erkennen) und die Wache sich sichtlich entspannt, nickend.\n\nNur wahrnehmbar, wenn der Spieler aktiv die Szenerie beobachtet (nicht automatisch, muss selbst aktiv werden). Probe: Wahrnehmung, keine Erschwernis.\n\nBei Erfolg schnappt der Spieler einen Gesprächsfetzen auf:\n„…die Golden Lion steht nirgends auf der Meldeliste, aber wenn Ihr sagt, das regelt sich…“\n\nDient als Wink zur nächsten Station (Hafenmeisterei) — die Meldeliste wird dort relevant.",
        trigger: [
          { id: "probe_versucht", label: "Wahrnehmungsprobe versucht" },
          { id: "erfolg_gehoert", label: "Erfolg — Gesprächsfetzen \"Golden Lion\" gehört" },
          { id: "ignoriert", label: "Spieler ignoriert die Szene / würfelt nicht" }
        ]
      }
    }
  },
  "markt": {
    personen: "Vereinzelt Crew-Mitglieder anderer Schiffe (reine Atmosphäre, keine feste Interaktion)",
    kurz: "Handel, Menschenmengen, guter Ort für Gerüchte und Zufallsbegegnungen. Kein fester Inhalt.",
    ortHinweis: "Der Marktplatz ist der lauteste Ort in Grimsgate — Händler rufen ihre Ware aus, Kisten mit Fisch, Obst, getrocknetem Fleisch stapeln sich neben improvisierten Ständen. Zwischen den Käufern schieben sich immer wieder Männer in Seemannskleidung, manche mit dem Abzeichen eines bestimmten Schiffs auf der Jacke, die meisten einfach nur durstig nach frischer Ware vor der nächsten Fahrt. Gesprächsfetzen wehen vorbei — Klagen über Preise, Gerüchte über die nächste Abfahrt, ein Streit um verdorbene Ware.\n\nKein fester Inhalt — Ort für freie Improvisation, Gerüchte und Zufallsbegegnungen nach Bedarf. Crew-Mitglieder anderer Schiffe (nicht der Golden Lion) können hier auftauchen, rein als Farbe, keine Anheuerungsfunktion.",
    interaktionen: {}
  },
  "kraemerladen": {
    personen: "Krämer (namenlos)",
    kurz: "Ausrüstung und Grundbedarf. Krämer verkauft gerade alles zu Schleuderpreisen, weil morgen ohnehin nichts mehr los ist.",
    ortHinweis: "Ein vollgestopfter kleiner Laden, in dem sich Kisten, Fässer und Regale bis unter die Decke stapeln — Seile, Werkzeug, Konserven, Ersatzkleidung, alles, was man kurz vor einer Abfahrt noch braucht und vergessen hat. Der Krämer kennt jeden Winkel seines Ladens auswendig und findet auch im Chaos sofort, wonach man fragt.\n\nSpieler können hier Ausrüstung kaufen, an die sie vorher nicht gedacht haben. Fragt man ihn grob, wo man hier anheuert, winkt er ab: die meisten Schiffe seien schon voll, und ab morgen sei ohnehin nichts mehr los in Grimsgate — deswegen haut er gerade alles zu Schleuderpreisen raus, solange noch Publikum da ist.\n\n„Frag mich nicht nach 'nem Schiff, frag mich, was du noch brauchst, bevor's zu spät ist — das hier wird nach morgen keiner mehr kaufen wollen.“\n\nKein fester Interaktions-Ablauf — freie Improvisation, ähnlich dem Markt, nur mit Kaufmöglichkeit und dieser einen wiederkehrenden Grundhaltung des Krämers.",
    interaktionen: {}
  },
  "bordell": {
    personen: "Constance Wrey (Madame) · Ezra Coombe · Ned Sharpe · diverse Frauen (namenlos, teils für Wat tätig)",
    kurz: "Sozialer Zugang + Wat-Falle + 'Raubein'-Zusatzszene mit Rufmechanik bei Ezra/Ned.",
    ortHinweis: "Etwas abseits der Stadt, unauffällig von außen, drinnen wärmer und aufwendiger eingerichtet als der Rest von Grimsgate — rote Vorhänge, gedämpftes Licht, der Lärm der Docks bleibt vor der Tür. Constance Wrey führt das Haus mit ruhiger, unmissverständlicher Autorität; nichts passiert hier ohne ihr Wissen. Im Empfangsbereich sitzen häufig Ezra Coombe und Ned Sharpe, zwei Crew-Mitglieder, die das Haus als eine Art zweites Zuhause behandeln.",
    interaktionen: {
      "wat_falle": {
        title: "Wats Falle",
        kurz: "Manche Frauen arbeiten für Wat. Fesselung, Fluchtoptionen vor Wats Ankunft.",
        details: "Manche Frauen im Haus arbeiten (mehr oder weniger freiwillig, mehr oder weniger für den Spieler erkennbar) für Wat. Lässt sich der Spieler auf eine ein, führt sie ihn in einen abgelegeneren Raum — dort wird er überrascht und festgehalten/gefesselt, bis Wat ihn abholen kommt.\n\nFluchtoptionen während der Fesselung:\n— Gutes Auftreten: Spieler redet sich frei, bevor Wat eintrifft — Frau lässt ihn ziehen, ggf. aus Mitleid, Zweifel oder weil er sie überzeugt, dass sich der Ärger nicht lohnt.\n— Freireden trotz Fesselung: Sind die Fesseln nicht sicher genug (Probe auf Körper/Geschick, Feinjustierung offen), kann sich der Spieler befreien, bevor Wat kommt.\n— Keine Flucht: Wat holt ihn ab → identisch zum \"Wat\"-Ausgang der Kneipe (Zwangsrekrutierung, Aufwachen an Bord).",
        trigger: [
          { id: "einlassen", label: "Spieler lässt sich auf eine Frau ein" },
          { id: "hinterraum", label: "Frau führt ihn in den Hinterraum" },
          { id: "flucht_auftreten", label: "Fluchtversuch (Auftreten) — Erfolg/Misserfolg" },
          { id: "flucht_fesseln", label: "Fluchtversuch (Fesseln lösen) — Erfolg/Misserfolg" },
          { id: "wat_holt_ab", label: "Wat holt Spieler ab (keine Flucht)" }
        ]
      },
      "raubein": {
        title: "Raubein-Zusatzszene",
        kurz: "Grober Gast belästigt eine Frau. Physisches Eingreifen = Rufgewinn bei Ezra/Ned.",
        details: "Ein grober Gast belästigt eine der Frauen. Constance will ihn draußen haben, er eskaliert.\n\nZwei Zugänge:\n— Spieler sitzt im Empfangsbereich mit Ezra/Ned → bekommt es direkt mit\n— Spieler ist oben → hört den Tumult, kann herunterstürmen\n\nAuflösung:\n— Physisches Eingreifen (sofort): Kampf, Ezra+Ned helfen mit → Rufgewinn bei Ezra/Ned (einzige Variante mit Belohnung)\n— Soziale Lösung (Auftreten/Rhetorik, Deeskalation): neutral, kein Gewinn, kein Verlust\n— Nicht-Eingreifen: Constance oder ihre eigenen Männer regeln es selbst, ohne den Spieler → kleiner Rufmalus bei Ezra/Ned (Zögern wird als Desinteresse an der Crew-Gemeinschaft gewertet, nicht als Feigheit im engeren Sinn — nur unmittelbares Eingreifen zählt)",
        trigger: [
          { id: "ausgeloest", label: "Raubein-Szene ausgelöst (Empfang oder von oben gehört)" },
          { id: "physisch", label: "Physisches Eingreifen → Rufgewinn" },
          { id: "sozial", label: "Soziale Lösung → neutral" },
          { id: "kein_eingreifen", label: "Kein Eingreifen → Rufmalus" }
        ]
      }
    }
  },
  "golden_lion": {
    personen: "–",
    kurz: "Ein stolzes kleines Kriegsschiff, mitten im Konvoi vor Anker. Noch nicht ausformuliert.",
    ortHinweis: "",
    interaktionen: {}
  }
};
