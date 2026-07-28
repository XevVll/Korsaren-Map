// Register aller Charakter-Portraits, die der Spielleiter pro Szene
// ein-/ausblenden kann (Admin-Panel: Checkboxen; Spieler-Seite: Leiste
// am rechten Bildschirmrand).
//
// Um einen neuen Charakter hinzuzufügen: einfach ein neues Objekt in
// CHARACTERS ergänzen, Bilddatei in denselben Ordner legen wie alle
// anderen Bilder.
//
// Felder:
//   id   - eindeutiger Bezeichner (frei wählbar, wird intern/in Firebase genutzt)
//   name - Anzeigename für den Spielleiter im Admin-Panel und als Bildunterschrift
//   img  - exakter Dateiname des Portraits (liegt im selben Ordner)

const CHARACTERS = [
  { id: "harwick", name: "James Harwick", img: "James_Harwick.png" },
  { id: "cormac", name: "Cormac Daly", img: "Cormac_Daly.png" },
  { id: "tom", name: "Tom Fletcher", img: "Tom_Fletcher.png" },
  { id: "dirk", name: "Dirk van Hoorn", img: "Dirk_van_Hoorn.png" },
  { id: "francesco", name: "Francesco Almeida", img: "Francesco_Benedetto_Almeida.png" },
  { id: "wat", name: "Walter „Wat“ Crozier", img: "Walter_Wat_Crozier.png" },
  { id: "josiah", name: "Josiah Pryce", img: "Josiah_Pryce.png" }
];
