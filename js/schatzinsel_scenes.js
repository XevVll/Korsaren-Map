// Szenen-Definition für die Schatzinsel-Karte.
//
// Gleiches flaches Muster wie scenes.js (nicht das Basis/Override-Muster
// aus golden_lion_scenes.js) - bisher gibt es nur einen einzigen Szenen-
// Zustand für diese Insel, daher lohnt sich die Basis/Override-Abstraktion
// (noch) nicht. Sollte die Insel später mehrere Zustände bekommen (z.B.
// "bei Tag" / "bei Nacht" mit abweichenden Bildern pro Ort), kann sie bei
// Bedarf auf das golden_lion_scenes.js-Muster umgebaut werden.
//
// Marker-Felder: siehe scenes.js (id/top/left/title/desc/img/variants).
//
// Bewusst nur EIN Marker bisher (Schiffswrack) - weitere Orte der Insel
// (Höhle, knorriger Baum, Felsformationen) folgen erst in einem späteren
// Schritt, auf ausdrücklichen Wunsch schrittweise statt auf einmal.

const SCHATZINSEL_SCENES = {
  "3.2": {
    label: "3.2 – Schatzinsel (Strandung)",
    background: "images/schatzinsel.webp",
    soundFile: "island1.ogg",
    markers: [
      {
        id: "schiffswrack",
        top: 70, left: 73,
        title: "Die gestrandete Golden Lion",
        desc: "Die Golden Lion liegt zerzaust in einer sandigen Bucht auf der Seite, der Hauptmast gebrochen, der Rumpf übel zugerichtet. Tauwerk und Trümmer verteilen sich über den Strand. Für die meisten an Bord wirkt es wie reines Glück, hier überhaupt festen Boden unter den Füßen zu haben — dass Tom sie mit gezielten Ankermanövern genau hierher gesteuert hat, wissen nur die wenigsten."
        // img bewusst weggelassen - noch kein eigenes Bild für diesen Ort.
        // karte.html (openOverlay) zeigt in diesem Fall automatisch
        // "Kein Bild hinterlegt." an, kein Sonderfall nötig.
      }
    ]
  }
};

// ID der Szene, die angezeigt wird, falls (noch) keine Verbindung zu
// Firebase besteht oder noch nichts gesetzt wurde. Wird von karte.html/
// regie.html NICHT automatisch als globaler Fallback genutzt (das bleibt
// DEFAULT_SCENE = "1.1", siehe karte.html) - dient hier nur als
// Referenzwert für eine mögliche künftige Verwendung.
const DEFAULT_SCHATZINSEL_SCENE = "3.2";
