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
//
// Interaktions-Feld "nurSzenen" (optional, z.B. bei "kanone_sturm" genutzt):
//   Liste von Szenen-IDs, z.B. ["3.1"]. Ist das Feld gesetzt, taucht diese
//   Interaktion im Admin-Panel NUR auf, wenn genau eine dieser Szenen
//   gerade betrachtet wird (gefiltert in regie.html über
//   getSceneInteraktionen()). Fehlt das Feld, ist die Interaktion wie
//   bisher in JEDER Szene sichtbar - wichtig für Orte wie Batteriedeck
//   oder Frachtraum, die in mehreren Szenen vorkommen, aber dort
//   TEILWEISE unterschiedliche Interaktionen haben (z.B. Dirks
//   Fachkenntnis-Vertrauen gilt immer, die losgerissene Kanone nur im
//   Sturm).
//
// Interaktions-Feld "nichtInSzenen" (Gegenstück, z.B. bei "dirk_vertrauen"
// genutzt): Liste von Szenen-IDs, in denen diese Interaktion AUSGESETZT
// ist, sonst aber überall gilt. Dirk ist im Sturm mit anderem beschäftigt
// (siehe "kanone_sturm") und daher während "3.1" nicht für seine normale
// Fachkenntnis-Prüfung ansprechbar - in jeder anderen Szene (auch
// zukünftigen) aber schon, ohne dass die Liste dafür gepflegt werden muss.
//
// Ort-Feld "szenenUeberschreibungen" (optional, Juli 2026, z.B. bei
// "achterdeck"/"oberdeck"/"batteriedeck"/"frachtraum" für Szene "3.1"
// genutzt): { [sceneId]: { personen?, kurz?, ortHinweis? } }. Ein Ort
// bleibt zwar weiterhin FLACH definiert (s.o.), aber personen/kurz/
// ortHinweis beschreiben oft nur den ruhigen Grundzustand - in einer
// inhaltlich komplett anderen Szene (z.B. dem Sturm) wäre es irreführend,
// dieselbe Zusammenfassung weiter anzuzeigen. Ist für die aktuelle Szene
// ein Override gesetzt, ersetzt er NUR die angegebenen Felder (gefiltert
// in regie.html über resolveOrtForScene()); fehlende Felder fallen auf
// den Basiswert zurück. "interaktionen" ist davon unabhängig und bleibt
// weiterhin über nurSzenen/nichtInSzenen gesteuert.

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
  },

  "achterdeck": {
    personen: "Tom Fletcher",
    kurz: "Tom am Ruder, wirkt nebenbei, hält aber mühelos Kurs. Zwei NPC-Wünsche statt fester Trigger.",
    ortHinweis: "Kein Auftrag im klassischen Sinn — Tom initiiert selbst, wenn Spieler in seiner Nähe herumstehen. Wunsch 1 (Knoten-Streich) funktioniert unabhängig von Wunsch 2 (Ruder halten) und kann beide in derselben Szene auftreten, wenn ein Spieler wegen des Streichs losläuft und Tom sich daraufhin an die übrigen wendet.",
    // 3.1 (Sturm): komplett eigener Zustand statt der ruhigen 2.1-Beschreibung -
    // Tom kämpft mit dem Ruder, keine der beiden Wunsch-Interaktionen passt hierher
    // (siehe nichtInSzenen bei "knoten_streich"/"ruder_halten" unten).
    szenenUeberschreibungen: {
      "3.1": {
        personen: "Tom Fletcher (kämpft mit dem Ruder)",
        kurz: "Tom kämpft mit dem Ruder, sichtlich angestrengt — keine Interaktionen in dieser Szene.",
        ortHinweis: "Tom kämpft mit dem Ruder, beide Hände fest um die Speichen, Muskeln sichtbar angespannt — von der lässigen Mühelosigkeit sonst keine Spur. Jede Welle versucht, ihm das Ruder aus der Hand zu reißen.\n\nKein Auftrag, kein Small Talk — Tom ist vollständig mit dem Ruder beschäftigt. Knoten-Streich und Ruder-Bitte setzen beide voraus, dass er entspannt bei der Sache ist, und sind für diese Szene deshalb ausgesetzt."
      }
    },
    interaktionen: {
      "knoten_streich": {
        title: "Tom Fletcher — Der Knoten-Streich",
        kurz: "Schickt den Spieler mit dem niedrigsten Seefahrt-Wert los, um \"mehr Knoten\" aus dem Frachtraum zu holen. Reaktion entscheidet über Ruf.",
        nichtInSzenen: ["3.1"], // setzt voraus, dass Tom entspannt am Ruder steht - im Sturm kämpft er laut Szenentext mit dem Ruder
        details: "Tom hält Kurs, wirkt dabei kaum bei der Sache. Er liest die Gruppe schnell und wendet sich beiläufig an den Spieler mit dem niedrigsten Seefahrt-Wert (objektiver Vergleich der Charakterbögen, kein Bauchgefühl).\n\n„Wir sind zu langsam. Lauf runter in den Frachtraum, hol mir ein paar Knoten mehr.“\n\nSpielt mit dem echten Fachbegriff (Geschwindigkeit wird per Logleine mit Knoten gemessen) — kein erfundener Unsinn, sondern Fachjargon als Falle. Ein erfahrener Seemann würde sofort erkennen, dass man Geschwindigkeit nicht „nachfüllen“ kann.\n\nReaktion des angesprochenen Spielers entscheidet:\n— Durchschaut den Witz, reagiert locker/witzig → kleiner Ruf-Plus bei Tom\n— Durchschaut, reagiert genervt/vorwurfsvoll → neutral\n— Ignoriert/geht nicht drauf ein → neutral\n— Läuft tatsächlich los, um Knoten zu holen → kleiner Ruf-Minus bei Tom\n\nVerbindung: Läuft der Spieler tatsächlich in den Frachtraum, trifft er dort je nach Timer-Stand entweder auf die versteckten Hände des Jungen oder einen leeren Raum (siehe Frachtraum-Bildvariante).",
        trigger: [
          { id: "streich_ausgeloest", label: "Streich ausgelöst" },
          { id: "durchschaut_witzig", label: "Durchschaut, reagiert witzig/locker → Ruf-Plus" },
          { id: "durchschaut_genervt", label: "Durchschaut, reagiert genervt/ignoriert → neutral" },
          { id: "losgelaufen", label: "Spieler läuft tatsächlich los → Ruf-Minus" }
        ]
      },
      "ruder_halten": {
        title: "Tom Fletcher — Ruder kurz halten",
        kurz: "Bittet einen zufälligen verbleibenden Spieler, das Ruder zu übernehmen, wenn jemand losläuft. Seefahrt-Probe entscheidet über Ruf.",
        nichtInSzenen: ["3.1"], // im Sturm hält Tom das Ruder selbst mit beiden Händen fest - er gibt es nicht kurz ab
        details: "Läuft ein Spieler los (z.B. wegen des Knoten-Streichs) und bleiben andere zurück, bittet Tom beiläufig einen zufälligen der Verbliebenen, kurz zu übernehmen — und verschwindet dann selbst.\n\n„Halt mal kurz, ja? Nur geradeaus. Bin gleich wieder da.“\n\n— Greift sofort zu, Seefahrt-Probe gelingt (bei Körper ≤2 zusätzlich Körper-Probe nötig, beide müssen gelingen) → Ruf-Plus bei Tom\n— Greift zu, Probe(n) misslingen, Kontrolle verloren (Ruder schlägt aus o.ä.) → Ruf-Minus bei Tom\n— Lehnt ab / zögert → neutral, kein Risiko",
        trigger: [
          { id: "angefragt", label: "Tom fragt nach Ruder-Übernahme" },
          { id: "angenommen_erfolg", label: "Angenommen, Probe(n) erfolgreich → Ruf-Plus" },
          { id: "angenommen_misserfolg", label: "Angenommen, Kontrolle verloren → Ruf-Minus" },
          { id: "abgelehnt", label: "Abgelehnt / gezögert → neutral" }
        ]
      }
    }
  },

  "oberdeck": {
    personen: "Francesco Almeida",
    kurz: "Francesco lehnt an der Reeling, faulenzt statt zu beaufsichtigen. Kein Auftrag — freundliche Präsenz, ehrliche Einschätzungen auf Nachfrage.",
    ortHinweis: "Francesco hängt sich bei Spielern ein, die hier herumstehen, macht aber von sich aus nicht viel. Ohne Ansprache sehnt er sich hörbar nach Sonne und warmer Luft — \"nicht wie hier in diesem traurigen, grauen England\". Zahlt sich später aus, sobald die Golden Lion in der Karibik ankommt (deutliche Kontraständerung in seinem Auftreten möglich).",
    // 3.1 (Sturm): Francesco tritt hier nicht auf (siehe nichtInSzenen bei
    // "einschaetzungen" unten) - stattdessen zwei eigene Sturm-Interaktionen mit
    // Cormac und Ned (Juli 2026, Inhalt von Hendrik).
    szenenUeberschreibungen: {
      "3.1": {
        personen: "Cormac Daly · Ned Sharpe (situativ, stürzt)",
        kurz: "Cormac ruft Befehle, schickt die geschicktesten Spieler zum Segel-Einschnüren hoch. Ned rutscht am Bug aus und wird übers Deck geschliffen — auffangbar.",
        ortHinweis: "Regen peitscht fast waagerecht über das Deck, Blitze zerreißen den Himmel. Cormac steht mitten im Chaos und ruft Befehle — die Segel sind noch zu weit draußen, es droht, den Mast abzureißen, wenn sie nicht bald eingeschnürt werden.\n\nKommen Spieler in seine Nähe, schickt er die zwei mit dem höchsten Geschick-Wert hoch in die Takelage (siehe Interaktion \"Segel einschnüren\")."
      }
    },
    interaktionen: {
      "cormac_segel_sturm": {
        title: "Cormac — Segel einschnüren (nur Sturm-Szene 3.1)",
        kurz: "Cormac schickt die 2 Spieler mit dem höchsten Geschick-Wert in die Takelage. Geschick+10-Probe, um das Segel oben einzuschnüren. Guter Erfolg beeindruckt Cormac.",
        nurSzenen: ["3.1"],
        details: "Cormac steht an Deck und ruft Befehle — die Segel sind noch zu weit draußen, der Mast droht abgerissen zu werden, wenn sie nicht bald eingeschnürt werden. Kommen Spieler in seine Nähe, schickt er die zwei mit dem höchsten Geschick-Wert hoch in die Takelage (objektiver Vergleich der Charakterbögen).\n\nDer Aufstieg in der Takelage ist bei diesem Wetter gefährlich — Regen und Wind reißen an den Spielern, während oben das Segel eingeschnürt werden muss.\n\nProbe: Geschick+10.\n\n— Guter Erfolg: beeindruckt Cormac sichtbar\n— Normaler/Schlechter Erfolg: geschafft, kein besonderer Kommentar → neutral\n— Misserfolg: [OFFEN] Konsequenz noch nicht festgelegt\n\nGleichzeitig würfeln die übrigen Spieler an Deck Körper-Proben, um sich festzuhalten.",
        trigger: [
          { id: "ausgeloest", label: "Cormac schickt 2 Spieler hoch (höchstes Geschick)" },
          { id: "aufstieg_gut", label: "Aufstieg: Guter Erfolg → beeindruckt Cormac" },
          { id: "aufstieg_normal", label: "Aufstieg: Normaler/Schlechter Erfolg → neutral" },
          { id: "aufstieg_misserfolg", label: "Aufstieg: Misserfolg" },
          { id: "deck_koerper", label: "Übrige Spieler: Körper-Probe zum Festhalten gewürfelt" }
        ]
      },
      "ned_sturz_sturm": {
        title: "Ned — Rutscht über das Deck (nur Sturm-Szene 3.1)",
        kurz: "Ned rutscht vorne am Bug aus und wird übers ganze Deck geschliffen. Auffangen möglich → Freund fürs Leben.",
        nurSzenen: ["3.1"],
        details: "Ned Sharpe rutscht vorne am Bug aus und wird übers ganze Deck geschliffen. Spieler können versuchen, ihn aufzufangen (Probe: Körper oder Geschick, [OFFEN] welche genau bzw. ob wahlweise).\n\n— Aufgefangen: Ned hat einen Freund fürs Leben gewonnen — großer, dauerhafter Ruf-Gewinn bei Ned\n— Nicht aufgefangen: [OFFEN] Konsequenz noch nicht festgelegt",
        trigger: [
          { id: "ausgeloest", label: "Ned rutscht aus und wird übers Deck geschliffen" },
          { id: "aufgefangen", label: "Aufgefangen → Freund fürs Leben (großer Ruf-Gewinn bei Ned)" },
          { id: "nicht_aufgefangen", label: "Nicht aufgefangen" }
        ]
      },
      "einschaetzungen": {
        title: "Francesco — Ehrliche Einschätzungen",
        kurz: "Auf direkte Frage nach anderen Personen: ehrliche, nie proaktiv genannte Meinung. Kein Trigger/Ruf-Effekt, reine Charakterinfo.",
        nichtInSzenen: ["3.1"], // Ruhiges Gespräch - passt nicht zum Sturm, in dem laut Szenentext alle mit den Segeln kämpfen
        details: "Fragt man Francesco gezielt nach jemandem, gibt er seine ehrliche Einschätzung — nie von sich aus, nur auf Nachfrage.\n\n— Harwick: warm, respektvoll, fast bewundernd\n— Cormac: freundlich-distanziert, \"zu streng\"\n— Wat: reserviert, spürbares Unbehagen, hält nicht viel von ihm\n— Tom: \"Der ehrlichste Betrüger, den er kennt\" — durchschaut ihn, mag ihn trotzdem\n— Josiah: \"Eine gute Seele\" — schlägt vor, ihn in der Kombüse zu besuchen, falls die Spieler ihn noch nicht kennen (organische Weiterleitung)\n— Dirk: \"Fast mit dem Schiff verwachsen\", lieber in Gesellschaft von Kanonen/Werkzeug als Menschen — bester Ansprechpartner bei Reparaturen, beeilt sich dabei nur, um die Spieler wieder loszuwerden",
        trigger: [
          { id: "gefragt_harwick", label: "Nach Harwick gefragt" },
          { id: "gefragt_cormac", label: "Nach Cormac gefragt" },
          { id: "gefragt_wat", label: "Nach Wat gefragt" },
          { id: "gefragt_tom", label: "Nach Tom gefragt" },
          { id: "gefragt_josiah", label: "Nach Josiah gefragt (Kombüse-Hinweis gegeben)" },
          { id: "gefragt_dirk", label: "Nach Dirk gefragt" }
        ]
      }
    }
  },

  "bug": {
    personen: "Ned Sharpe · Ezra Coombe",
    kurz: "Unterhalten sich über den Bordellbesuch. Reaktion hängt vom Bordell-Ausgang des jeweiligen Spielers ab (vier Varianten).",
    ortHinweis: "Beziehen sich konkret auf den Raubein-Vorfall im Bordell (der raue Gast, Constance' Reaktion) — kein allgemeines, unverfängliches Geplauder.",
    interaktionen: {
      "bordell_nachklang": {
        title: "Ned & Ezra — Nachklang aus dem Bordell",
        kurz: "Reaktion variiert je nachdem, wie der Spieler die Raubein-Szene im Bordell gelöst hat (oder ob er überhaupt dort war).",
        details: "Ned und Ezra reden über den Bordellbesuch, konkret über den Vorfall mit dem groben Gast und Constance' Reaktion darauf. Erkennen einen vorbeikommenden Spieler, falls der dort war — mit deutlich unterschiedlichem Ton je nach Ausgang:\n\n— War dort, hat physisch eingegriffen (Raubein-Szene, Bordell): warm, fast bewundernd — erzählen die Geschichte nochmal nach, mit kleinen Übertreibungen\n— War dort, hat sozial deeskaliert: anerkennend, ruhiger, würdigend, weniger überschwänglich\n— War dort, hat nicht eingegriffen: erkennen den Spieler, aber kühler — knapper, leicht distanzierter Kommentar, kein offener Vorwurf\n— War nicht dort: Ned wird sichtlich unangenehm berührt, wechselt das Thema — reine Verlegenheit, keine Folge",
        trigger: [
          { id: "physisch", label: "Spieler hatte Raubein-Szene physisch gelöst → warm/bewundernd" },
          { id: "sozial", label: "Spieler hatte sozial deeskaliert → anerkennend" },
          { id: "nicht_eingegriffen", label: "War dort, nicht eingegriffen → kühl/distanziert" },
          { id: "nicht_dort", label: "War nicht dort → Ned unangenehm, Themawechsel" }
        ]
      }
    }
  },

  "batteriedeck": {
    personen: "Dirk van Hoorn · Trewin-Zwillinge",
    kurz: "Dirk nur bei echter Mechanik-Probe/kaputtem Objekt zugänglich, mit Payoff in der Sturm-Szene. Trewin-Zwillinge reagieren auf den Trinkwettbewerb-Ausgang.",
    ortHinweis: "Durchgehende Kanonenreihe, wenig Ordnung — passt zum Marker-Hinweis \"so viele Kanonen für ein einfaches Begleitschiff?\".",
    // 3.1 (Sturm): bewusst OHNE Dirk/Trewin-Zwillinge namentlich - siehe
    // "kanone_sturm" unten ("Bewusst keine Namen... Dirk hilft zwar mit, wird
    // aber nicht genannt"). Dirks Vertrauens-Interaktion und der Zwillinge-Kater
    // sind ohnehin per nichtInSzenen ausgesetzt.
    szenenUeberschreibungen: {
      "3.1": {
        personen: "Anonyme Crew (keine benannte Figur, siehe Hinweis)",
        kurz: "Losgerissene Kanone im Sturmchaos — anonyme Crew, keine benannten Figuren.",
        ortHinweis: "Wasser strömt in Schwällen von oben herein, das Deck liegt unter einer rutschigen Wasserschicht. Eine der Kanonen hat sich losgerissen und rollt bei jeder Welle bedrohlich hin und her. Lärm und Chaos, so weit man hört.\n\nBewusst keine Namen im Flavortext - Dirk hilft zwar mit und ruft Anweisungen, wird aber nicht genannt (siehe Interaktion \"Losgerissene Kanone\")."
      }
    },
    interaktionen: {
      "dirk_vertrauen": {
        title: "Dirk van Hoorn — Vertrauen durch Fachkenntnis",
        kurz: "Arbeitet allein, will nicht gestört werden. Nur echte Mechanik-/Handwerks-Probe oder kaputtes Objekt weckt Interesse — mit Payoff NACH der Sturm-Szene.",
        nichtInSzenen: ["3.1"],
        details: "Dirk arbeitet für sich an Kanonen und Werkzeug, einsilbig und abweisend bei reinem Small Talk.\n\nAuslöser: eine echte Mechanik-/Handwerks-Probe oder ein konkretes kaputtes Objekt, das der Spieler mitbringt oder anspricht — reines fachlich klingendes Gerede reicht nicht.\n\nBei Erfolg taut er kurz auf, einigermaßen interessiert — und merkt sich den Spieler intern. Kein sofortiger großer Lohn: Erst später, NACH der Sturm-Szene (eigener, noch auszuarbeitender Programmpunkt), kommt Dirk mit einem kniffligen mechanischen Problem auf genau diesen Spieler zu — dort besteht dann die Chance auf einen großen Ruf-Gewinn.\n\n> Korrektur (Juli 2026): Ursprünglich stand hier \"in der Sturm-Szene\" — Dirks Payoff liegt aber NACH dem Sturm, nicht während. Die Kanonen-Szene während des Sturms selbst (siehe Interaktion \"kanone_sturm\" unten) bleibt bewusst anonym, ohne Dirk namentlich zu erwähnen.",
        trigger: [
          { id: "ausloeser_erfolgreich", label: "Mechanik-Probe/kaputtes Objekt erfolgreich → Dirk merkt sich Spieler" },
          { id: "sturm_payoff", label: "NACH der Sturm-Szene: Dirk kommt auf Spieler zu → große Ruf-Chance" }
        ]
      },
      "kanone_sturm": {
        title: "Losgerissene Kanone (nur Sturm-Szene 3.1)",
        kurz: "Nur relevant, wenn Szene 3.1 aktiv ist. Mind. 3 kumulative Körper-Erfolge, um die Kanone zurück auf den Sockel zu stemmen. Guter Erfolg zählt doppelt (Fluff). Misserfolg = 1 Schaden.",
        nurSzenen: ["3.1"],
        details: "Nur relevant in der Sturm-Szene (3.1). Eine Kanone hat sich losgerissen und rollt bei jeder Welle bedrohlich hin und her (siehe Sturm-Flavortext des Batteriedecks).\n\nBewusst keine Namen, keine vorweggenommenen Handlungen im Flavortext — die Spieler wissen zu diesem Zeitpunkt nicht, wessen Position das ist oder wer die Aktion leitet. Dirk hilft zwar mit und ruft Anweisungen, wird aber nicht genannt.\n\nMehrere Spieler können gemeinsam beitragen, es muss nicht einer allein schaffen. Mindestens 3 kumulative erfolgreiche Körperproben nötig, um die Kanone zurück auf den Sockel zu stemmen.\n\n— Normaler oder Guter Erfolg zählt als ein Erfolg\n— Guter Erfolg zählt DOPPELT — reiner Fluff-Moment, keine mechanische Zusatzregel: Die Wucht beeindruckt sichtbar die umstehende Crew. Fällt irgendwann ein Guter Erfolg, braucht es danach nur noch einen weiteren normalen Erfolg\n— Misserfolg → 1 Schadenspunkt (von der Kanone gestreift / auf nassem Deck hingeschlagen)\n\nKein Ruf-Fokus — bleibt anonym im Chaos des Sturms.\n\nZukunfts-Notiz: Schaden aus dieser Szene bleibt bestehen und wirkt sich später auf der Schatzinsel aus — kann dort gefährlich werden oder einen Spieler ganz von der Schatzsuche ausschließen. Details folgen, wenn die Insel-Stationen ausgearbeitet werden.",
        trigger: [
          { id: "erfolg_gewertet", label: "Normaler/Guter Erfolg gewertet" },
          { id: "erfolg_gut_doppelt", label: "Guter Erfolg → zählt doppelt (Fluff)" },
          { id: "kanone_gesichert", label: "3 Erfolge erreicht → Kanone gesichert" },
          { id: "misserfolg_schaden", label: "Misserfolg → 1 Schadenspunkt (wirkt sich später auf Schatzinsel aus)" }
        ]
      },
      "trewin_kater": {
        title: "Trewin-Zwillinge — Nachwehen des Trinkwettbewerbs",
        kurz: "Reaktion hängt vom Ausgang des Trinkwettbewerbs in der Taverne ab (gewonnen / verloren / nie angetreten).",
        nichtInSzenen: ["3.1"], // Kater-Szene passt nicht zum Sturm-Chaos mit der losgerissenen Kanone am selben Ort
        details: "Die Trewin-Zwillinge sind hier anzutreffen, ihr Zustand hängt vom Ausgang des Trinkspiels in der Taverne ab:\n\n— Gewonnen (Spieler hat sie unter den Tisch gesoffen): über Kreuz übereinander in einer Hängematte verkeilt, stöhnen vor Übelkeit, zanken sich gegenseitig an, dass der andere Platz machen soll — können sich kaum bewegen\n— Verloren: triumphierend, spöttisch gegenüber dem Spieler\n— Nie angetreten: neutral, ignorieren den Spieler weitgehend",
        trigger: [
          { id: "gewonnen", label: "Spieler hat Zwillinge besiegt → Kater-Szene" },
          { id: "verloren", label: "Spieler hat verloren → triumphierend/spöttisch" },
          { id: "nie_angetreten", label: "Nie angetreten → neutral" }
        ]
      }
    }
  },

  "werkstatt": {
    personen: "Schiffszimmermann · weitere Handwerker (namenlos)",
    kurz: "Ordentlicher als der Rest des Schiffs. Erster Spieler im Raum wird direkt eingespannt — Mechanik-Probe, nur die Extreme wirken sich auf den Ruf aus.",
    ortHinweis: "Mehrere gelernte Handwerker bei der Arbeit, spürbar ordentlicher als sonst auf dem Schiff. Gute Wahrnehmung oder Mechanik erkennt: keine einfachen Matrosen, sondern Leute vom Fach. Namenlose Crewmitglieder — bewusst kein Wiedererkennungs-Bogen, kein späterer Zahltag (anders als bei Dirk auf dem Batteriedeck).",
    interaktionen: {
      "eingespannt": {
        title: "Erster Spieler im Raum — direkt eingespannt",
        kurz: "Nur der erste Spieler, der den Raum betritt. Mechanik-Probe: Guter Erfolg = Ruf-Plus, Misserfolg = Ruf-Malus, beide mittleren Bänder neutral.",
        details: "Der erste Spieler, der die Werkstatt betritt, wird ohne Umschweife eingespannt:\n\n„Schnapp dir den Fuchsschwanz und gib mir das auf 30 Zoll raus.“\n\n(Fuchsschwanz = Handsäge, benannt nach der spitz zulaufenden Blattform.) Der Mann am Tisch reicht ein Kanthol, schaut kaum auf, bleibt bei seiner eigenen Arbeit.\n\nMechanik-Probe:\n— Guter Erfolg: Schnitt exakt auf Maß, kurzes Nicken → Ruf-Gewinn\n— Normaler Erfolg: brauchbar, kein Kommentar → neutral\n— Schlechter Erfolg: sichtbar daneben, wortlos beiseitegelegt → neutral\n— Misserfolg: Kanthol splittert oder grob falsches Maß — einziger Moment, in dem er wirklich aufsieht → Ruf-Malus\n\nNachkommende Spieler bekommen keine eigene Aufgabe. Auf Nachfrage: „Wir kommen zurecht, geh zu Cormac, wenn du Arbeit suchst.“",
        trigger: [
          { id: "erster_eingespannt", label: "Erster Spieler eingespannt" },
          { id: "guter_erfolg", label: "Guter Erfolg → Ruf-Plus" },
          { id: "normaler_erfolg", label: "Normaler Erfolg → neutral" },
          { id: "schlechter_erfolg", label: "Schlechter Erfolg → neutral" },
          { id: "misserfolg", label: "Misserfolg → Ruf-Malus" }
        ]
      }
    }
  },

  "unterdeck": {
    personen: "Crew (namenlos, rotierend schlafend)",
    kurz: "Der einzige ruhige Ort auf dem Schiff — als Falle angelegt. Durchqueren verlangt Geschick-/Geheim-Probe, Misserfolg kostet Ruf bei allen Anwesenden.",
    ortHinweis: "Enge Reihen fester Kojen (bewusst KEINE Hängematten), Vorhänge für ein wenig Privatsphäre — mehr Komfort, als man auf einem Schiff erwarten würde. Crew schläft in Schichten, rotierend, während andere Wache stehen. Wirkt wie ein Fettnäpfchen-Ort, ist aber außer im Misserfolgsfall folgenlos.",
    interaktionen: {
      "durchqueren": {
        title: "Durchqueren des Unterdecks",
        kurz: "Geschick- oder Geheim-Probe. Erfolg = nichts passiert, Misserfolg = Gemecker + Ruf-Malus für alle anwesenden Spieler.",
        details: "Spieler, die das Unterdeck durchqueren, während dort geschlafen wird, würfeln auf Geschick oder Geheim.\n\n— Erfolg: nichts, unauffällig durch\n— Misserfolg: Gemecker von den Gestörten, Ruf-Malus für alle anwesenden Spieler (nicht nur für den Verursacher)",
        trigger: [
          { id: "erfolg", label: "Erfolg → unauffällig durch" },
          { id: "misserfolg", label: "Misserfolg → Gemecker, Ruf-Malus für alle Anwesenden" }
        ]
      }
    }
  },

  "frachtraum": {
    personen: "Der blinde Passagier (Waisenjunge, situativ) · Wat (situativ, bei Pfad B)",
    kurz: "Kein dauerhafter Aufenthaltsort, nur sporadisch besucht. Zentral für den blinden Passagier (Abschnitt 11) und Toms Knoten-Streich (Achterdeck).",
    ortHinweis: "Dunkel, still, vollgestopft — kein offenes Feuer erlaubt (Tauwerk, Segeltuch, trockener Proviant), nur gedämpftes Lukenlicht von oben. Zwei Bildvarianten: \"Standard\" (Hände hinter einer Kiste sichtbar, blinder Passagier versteckt, inkl. Zusatzsatz \"Habe ich da gerade etwas gehört? Bestimmt nur das Schiff.\") und \"Leer\" (Junge weg/gefunden, reiner Basistext). Umschaltung manuell im Admin-Panel unter Bildvarianten — wirkt sich sowohl auf das Spieler-Bild als auch auf den angezeigten Hinweistext aus.",
    // 3.1 (Sturm): löst das Varianten-System (Standard/Leer, blinder Passagier)
    // komplett ab - der Junge ist laut "wassereinbruch_sturm" kein Thema mehr im
    // Raum. Personen/kurz/ortHinweis daher komplett unabhängig vom Basiszustand.
    szenenUeberschreibungen: {
      "3.1": {
        personen: "–",
        kurz: "Wassereinbruch im Sturm — kein Bezug mehr zum blinden Passagier. Zwei Schritte nötig (Pumpen + Abdichten).",
        ortHinweis: "Der Frachtraum steht knöcheltief unter Wasser — bei jeder Welle schwappt es zwischen den Fässern hin und her. Irgendwo dringt Wasser ein, das hier nicht hingehört. Wenn niemand bald etwas unternimmt, wird es mehr.\n\nDie Bildvarianten (Standard/Leer) und der blinde Passagier spielen hier keine Rolle mehr, siehe Interaktion \"Wassereinbruch\"."
      }
    },
    interaktionen: {
      "blinder_passagier": {
        title: "Der blinde Passagier — Fund im Frachtraum (Abschnitt 11, Pfad A)",
        kurz: "Kein Wurf nötig — aktive Suche bei Variante \"Standard\" findet ihn automatisch. Vier mögliche Folgen je nach Spielerverhalten danach.",
        nichtInSzenen: ["3.1"], // T+30 (spätestens Wat) liegt vor T+60 (Sturm) - Subplot ist bis dahin immer durch
        details: "Ist die Bildvariante \"Standard\" aktiv und durchsucht ein Spieler gezielt den Raum (z.B. „ich durchsuche den Raum“), wird der Junge ohne Probe gefunden.\n\nDanach, drei mögliche Verläufe:\n— Spieler holen ihn aus dem Frachtraum heraus → Wat bekommt es mit, die Konfrontationsszene an Deck (Pfad B) startet\n— Spieler lassen ihn dort, gehen aber vor T+30 direkt zu Josiah, Francesco, Cormac oder Tom → Wat findet ihn nicht\n— Spieler lassen ihn dort, unternehmen lange Zeit nichts → er findet irgendwann aus Hunger von selbst zu Josiah\n\nSL-Ermessen: Ob und wie hart Pfad B (Wat-Konfrontation) tatsächlich ausfällt, liegt im Spielraum des Spielleiters — abhängig z.B. davon, ob die Gruppe Wat schon kennengelernt hat, ob eine härtere Version gerade der Charakterbildung nützt, oder ob die Gruppe ohnehin aggressiv gestimmt ist und eskalieren würde. Keine feste Regel, reine Spielleiter-Freiheit (vgl. Design-Prinzip \"Gutes Rollenspiel schlägt Mechanik\").",
        trigger: [
          { id: "gefunden", label: "Junge im Frachtraum gefunden" },
          { id: "rausgeholt", label: "Spieler holen ihn raus → Wat bemerkt es, Pfad B startet" },
          { id: "vertrauensperson", label: "Josiah/Francesco/Cormac/Tom vor T+30 informiert → Wat findet ihn nicht" },
          { id: "untaetig", label: "Spieler bleiben untätig → Junge findet von selbst zu Josiah" }
        ]
      },
      "knoten_streich": {
        title: "Knoten-Streich — Anlaufpunkt (ausgelöst vom Achterdeck)",
        kurz: "Wer wegen Toms Streich in den Frachtraum läuft, trifft je nach aktiver Bildvariante auf den versteckten Jungen oder einen leeren Raum.",
        nichtInSzenen: ["3.1"], // dito - Frachtraum-Varianten spielen im Sturm keine Rolle mehr, siehe "wassereinbruch_sturm"
        details: "Siehe Achterdeck-Interaktion „Knoten-Streich“: Tom schickt den Spieler mit dem niedrigsten Seefahrt-Wert in den Frachtraum, um „ein paar Knoten mehr“ zu holen. Trifft der Spieler dort ein, hängt der Zustand von der aktiven Bildvariante ab — versteckter Junge (Standard) oder leerer Raum (Leer).",
        trigger: [
          { id: "angekommen", label: "Spieler wegen Knoten-Streich im Frachtraum angekommen" }
        ]
      },
      "wassereinbruch_sturm": {
        title: "Wassereinbruch (nur Sturm-Szene 3.1)",
        kurz: "Nur relevant, wenn Szene 3.1 aktiv ist. Zwei nötige Schritte (Pumpen + Abdichten). Ruf nur bei Selbstorganisation, kein Malus bei Misserfolg.",
        nurSzenen: ["3.1"],
        details: "Nur relevant in der Sturm-Szene (3.1) — löst die Frachtraum-Varianten (Standard/Leer) für diese Szene ab, der blinde Passagier ist zu diesem Zeitpunkt kein Thema mehr im Raum. Der Frachtraum steht knöcheltief unter Wasser, sofort sichtbar beim Betreten (kein Wurf).\n\nZwei nötige Schritte, um das Problem zu lösen:\n1. Pumpen — Spieler mit Seefahrt-Wissen wissen sofort, wo die schiffseigene Pumpe sitzt und wie man sie bedient (kein Wurf, reines Fachwissen). Das Pumpen selbst ist eine Körper-Probe. Hält den Wasserstand nur im Zaum, dichtet aber nichts ab.\n2. Abdichten — jemand muss aktiv in der Werkstatt nach Planken fragen (keine Probe, reine Handlung), dann Mechanik-Probe (alternativ Geschick), um das Leck zu stopfen.\n\nRuf hängt am WIE, nicht am WOHER der Lösung:\n— Selbstorganisiert (Spieler erkennen das Problem, bringen Pumpen + Planken von sich aus in Gang) → Ruf-Gewinn bei der Crew allgemein\n— Auf Anweisung von Cormac oder Dirk (falls Spieler nicht selbst aktiv werden) → neutral\n— Misserfolg bei Pumpen/Abdichten → kein Malus, geht im allgemeinen Chaos des Sturms unter\n\nDirks eigentlicher Sturm-Payoff (siehe Batteriedeck-Interaktion „dirk_vertrauen“) ist ein separates, späteres Ereignis NACH dem Sturm — nicht dieses hier.",
        trigger: [
          { id: "erkannt", label: "Wassereinbruch erkannt" },
          { id: "selbstorganisiert", label: "Spieler organisieren sich selbst → Ruf-Gewinn Crew" },
          { id: "auf_anweisung", label: "Auf Anweisung (Cormac/Dirk) → neutral" },
          { id: "geloest", label: "Pumpen + Abdichten erfolgreich → Problem gelöst" }
        ]
      }
    }
  },

  "kombuese": {
    personen: "Josiah Pryce",
    kurz: "Herzlicher Empfang für jeden, unabhängig vom Ruf. Bewusst kein aktiver Wunsch, keine Ruf-Mechanik — reiner Charakter zum Spielen.",
    ortHinweis: "Anlaufstelle für den blinden Passagier (siehe Frachtraum-Interaktion „Der blinde Passagier“ und Abschnitt 11).",
    interaktionen: {
      "standardverhalten": {
        title: "Josiah — Herzlicher Empfang (kein aktiver Wunsch)",
        kurz: "Begrüßt jeden herzlich, unabhängig vom Ruf oder davon, ob der Spieler freiwillig/gepresst an Bord ist. Bewusst keine Ruf-Mechanik, kein Trigger-Automat.",
        details: "Josiah begrüßt jeden, der die Kombüse betritt, herzlich — unabhängig vom Ruf, unabhängig davon, ob der Spieler freiwillig oder durch Erpressung/Gewalt an Bord ist. Bietet von sich aus etwas zu essen oder Ähnliches an. Beantwortet Fragen offen und ehrlich.\n\nSieht in jedem das Gute — redet über niemanden schlecht, egal wer gerade Zielscheibe ist. Lästern Spieler vor ihm über irgendjemanden an Bord, widerspricht er warm und automatisch, nie belehrend, einfach weil er es so empfindet.\n\nBewusst kein aktiver Wunsch und keine Ruf-Mechanik hier — anders als Tom, Dirk oder die Werkstatt. Reiner Charakter zum Spielen, kein Trigger-Automat.\n\nSein großer Moment: die Wat-Konfrontationsszene (Frachtraum-Interaktion „Der blinde Passagier“, Pfad B) — kommt schwer atmend an Deck (die Kombüse liegt tief unten, er ist kein schneller Mann) und hält Wat auf.",
        trigger: []
      }
    }
  }
};
