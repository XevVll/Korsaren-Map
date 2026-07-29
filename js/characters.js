// Register aller Charakter-Portraits, die der Spielleiter pro Szene
// ein-/ausblenden kann (Admin-Panel: Checkboxen; Spieler-Seite: Leiste
// am rechten Bildschirmrand).
//
// Um einen neuen Charakter hinzuzufügen: einfach ein neues Objekt in
// CHARACTERS ergänzen, Bilddatei in den images/-Ordner legen wie alle
// anderen Bilder.
//
// Felder:
//   id   - eindeutiger Bezeichner (frei wählbar, wird intern/in Firebase genutzt)
//   name - Anzeigename für den Spielleiter im Admin-Panel und als Bildunterschrift
//   img  - Pfad des Portraits, relativ zur HTML-Seite (images/-Ordner)

const CHARACTERS = [
  { id: "harwick", name: "James Harwick", img: "images/James_Harwick.png" },
  { id: "cormac", name: "Cormac Daly", img: "images/Cormac_Daly.png" },
  { id: "tom", name: "Tom Fletcher", img: "images/Tom_Fletcher.png" },
  { id: "dirk", name: "Dirk van Hoorn", img: "images/Dirk_van_Hoorn.png" },
  { id: "francesco", name: "Francesco Almeida", img: "images/Francesco_Benedetto_Almeida.png" },
  { id: "wat", name: "Walter „Wat“ Crozier", img: "images/Walter_Wat_Crozier.png" },
  { id: "josiah", name: "Josiah Pryce", img: "images/Josiah_Pryce.png" }
];
