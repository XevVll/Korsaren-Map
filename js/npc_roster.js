// Ruf-fähiger Charakter-Pool für die "Charaktere"-Leiste im Admin-Panel
// (regie.html, Vault-Ansicht). Zwei Gruppen:
//
//   CREW        - die 7 Kern-Crewmitglieder (dieselben IDs wie js/characters.js,
//                 damit sich Portrait-Leiste und Ruf-Leiste künftig leicht
//                 verbinden lassen). "triggers" sind wörtlich aus den
//                 "Trigger & Ruf-Verbindungen"-Listen in besatzung.html
//                 übernommen (nicht paraphrasiert) - reine Referenz für den SL,
//                 keine automatische Ruf-Berechnung (Bibel 5: Ruf ist
//                 SL-Ermessen, nicht Würfel-getrieben).
//   MANIFEST_EXTRA - weitere benannte Mannschaftsmitglieder aus besatzung.html,
//                 die nicht von Anfang an in der Charakter-Leiste auftauchen,
//                 sondern über "+" im Admin-Panel bei Bedarf hinzugefügt
//                 werden (z.B. wenn eine Nebenfigur in der laufenden Session
//                 relevant wird). Aktivierung liegt in Firebase unter
//                 extraNpcs/{npcId}, damit sie über alle Admin-Sitzungen
//                 hinweg konsistent bleibt.
//
// Ruf selbst ist NICHT hier gespeichert - siehe regie.html: players/{pcId}
// (Spielercharakter-Roster) und pcRuf/{pcId}/{npcKey} (Ruf-Stufe 0-4 je
// Spielercharakter x NPC, inkl. Pseudo-Eintrag "crew_allgemein" für die
// Bibel-5.3-Kategorie "Ruf bei der Crew allgemein").

const CREW = [
  {
    id: "harwick", name: "James Harwick", role: "Kapitän",
    triggers: [
      "Spieler bemerkt das Porträt und geht sensibel damit um → sofortiger Rufbonus beim Kapitän",
      "Spieler spricht Spanisch → Harwicks Interesse ist sofort geweckt",
      "Höchste Rufstufe Ende Session 2 / Anfang Session 3 → erfährt als Erster vom Tod der Tochter",
      "Beim Artefakthandel emotional am instabilsten → größtes Potential für Ruf-Gewinn oder -Verlust",
      "Ohne sozialen Eingriff beim Schmugglertreffen → Massaker → Crew: „Früher war er anders“",
      "Höchste Rufstufe in Session 3 → opfert sich für die Spieler beim Ritual-Ausgang"
    ]
  },
  {
    id: "cormac", name: "Cormac Daly", role: "Quartiermeister",
    triggers: [
      "Spieler stellt sich nachts wortlos neben ihn ans Deck → stiller Rufgewinn, Cormac geht nicht sofort",
      "Spieler zieht über Katholiken her → Rufverlust, „Pass auf was du sagst. Ich bin einer von denen.“",
      "Spieler rettet beim Massaker das Kind → extremer Rufgewinn, Cormac weiß dass er in der Schuld steht",
      "Spieler fragt nach dem Knoten → Antwort hängt vom bisherigen Vertrauen ab",
      "Spieler spricht ihn direkt und ohne Umschweife an → gewinnt schneller Respekt als durch Smalltalk"
    ]
  },
  {
    id: "tom", name: "Tom Fletcher", role: "Steuermann",
    triggers: [
      "Spieler fällt auf seine Maske rein und schreibt ihn ab → verpasst einen der verlässlichsten Männer an Bord",
      "Spieler steckt in echter Gefahr → Tom ist plötzlich da, ohne Ankündigung, ohne Erklärung danach",
      "Jemand macht einen Witz über die Tochter → Tom wird still. Kein Spruch, kein Lachen. Einziger Moment, in dem die Maske fällt.",
      "Spieler spricht ihn auf seine Vergangenheit an → weicht aus, macht einen Witz, wechselt das Thema",
      "Spieler erweist sich im echten Moment als mutig → Tom kommentiert es trocken aber respektvoll"
    ]
  },
  {
    id: "dirk", name: "Dirk van Hoorn", role: "Kanonenmeister",
    triggers: [
      "Spieler beobachtet das Ritual beim Auslaufen und zieht die richtigen Schlüsse → früher Hinweis auf die wahre Natur des Schiffs",
      "Spieler spricht ihn über Kanonen an → öffnet sich minimal, einziges echtes Gesprächsthema",
      "Spieler versucht Smalltalk → kurze niederländische Antwort, Thema beendet",
      "Spieler erlebt seine Präzision im Kampf aus nächster Nähe → stiller Rufgewinn durch Respekt",
      "Spieler fragt nach den Niederlanden oder seiner Vergangenheit → keine Antwort, wegschauen"
    ]
  },
  {
    id: "francesco", name: "Francesco Almeida", role: "Bootsmann",
    triggers: [
      "Erster Ansprechpartner für neue Spieler — baut von sich aus Kontakt auf",
      "Spanischer Hafen → persönliche Gefahr für Frasco, Spieler die ihn schützen gewinnen stark an Ruf",
      "Spieler spricht Spanisch oder Portugiesisch → sofortige Verbindung",
      "Spieler fragt nach seiner Vergangenheit → erzählt sie mit vollem Stolz und ohne Scham",
      "Frasco vermittelt bei Crew-Konflikten → Spieler die helfen gewinnen Ruf bei der gesamten Crew"
    ]
  },
  {
    id: "wat", name: "Wat Crozier", role: "Waffenmeister",
    triggers: [
      "Spieler behandelt ihn von Anfang an mit ruhigem Respekt statt Misstrauen → stiller früher Rufgewinn, Wat vergisst das nicht",
      "Spieler versucht ihn einzuschmeicheln oder zu manipulieren → durchschaut er sofort, kalte Verachtung",
      "Piraten-Unterschlupf → bewegt sich hier wie zuhause; wer auf ihn hört, kommt sicher durch — Kompetenz hinter der Fassade",
      "Artefakthandel, Massaker-Befehl → führt ihn ohne Zögern aus; wer sich ihm in den Weg stellt, riskiert alles, gewinnt bei Erfolg enormen Respekt",
      "Spieler beweist über die Sessions Wort und Verlässlichkeit → Wat zählt sie zu „den Leuten, die zählen“; ab hier Verlass wie auf keinen zweiten",
      "Finale / Ende des Auftrags → mit Abschluss des Rituals erlischt seine Bindung. Ob er Fels bleibt oder die Gelegenheit ergreift, entscheidet sich hier"
    ]
  },
  {
    id: "josiah", name: "Josiah Pryce", role: "Schiffskoch",
    triggers: [
      "Josiah sieht in jedem das Gute — lästern Spieler vor ihm über jemanden, widerspricht er warm und automatisch, nie belehrend",
      "Spieler, die ihn und Wat in derselben Szene beobachten, bekommen einen stillen Ansatzpunkt für die spätere Enthüllung, warum Wat ihn nie anpöbelt",
      "Sein großer Moment: Wenn Wat den blinden Passagier über die Reeling hält (Frachtraum, Pfad B) — Josiah kommt schwer atmend an Deck und hält ihn auf"
    ]
  }
];

const MANIFEST_EXTRA = [
  {
    id: "ned_sharpe", name: "Ned Sharpe", role: "Matrose",
    triggers: [
      "Spieler beschützen oder umsorgen ihn → die halbe Crew rechnet es ihnen an",
      "Spieler verspotten ihn oder bringen ihn in Gefahr → die Stimmung kippt schnell"
    ]
  },
  {
    id: "ezra_coombe", name: "Ezra Coombe", role: "Vollmatrose",
    triggers: [
      "Spieler hören ihm geduldig zu → er öffnet sich, ein Fragment über den Kapitän von früher",
      "Spieler tun ihn als versoffenen Alten ab → er schweigt endgültig"
    ]
  },
  {
    id: "silas_pott", name: "Silas Pott", role: "Wundversorgung",
    triggers: [
      "Spieler decken ihn, statt ihn bloßzustellen → dankbare Loyalität",
      "Spieler stellen seine Unfähigkeit öffentlich bloß → er wird aus Scham zum Feind"
    ]
  }
];

const RUF_TIERS = ["Unbekannt", "Bemerkt", "Respektiert", "Vertraut", "Unverzichtbar"];
const RUF_EFFECT = [
  "Bekommt Befehle, keine Rückfragen.",
  "Crew hilft aktiv im Kampf.",
  "Darf bei Entscheidungen eine Meinung äußern.",
  "Kapitän hört zu, Crew folgt auch in Gefahr.",
  "Zugang zur Offizierskonferenz, Kapitän teilt Informationen proaktiv."
];
