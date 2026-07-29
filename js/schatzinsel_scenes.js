// Szenen-Definition für die Schatzinsel-Karte.
//
// Gleiches flaches Muster wie scenes.js (nicht das Basis/Override-Muster
// aus golden_lion_scenes.js) - bisher gibt es nur einen einzigen Szenen-
// Zustand für diese Insel, daher lohnt sich die Basis/Override-Abstraktion
// (noch) nicht. Sollte die Insel später mehrere Zustände bekommen (z.B.
// "bei Tag" / "bei Nacht" mit abweichenden Bildern pro Ort), kann sie bei
// Bedarf auf das golden_lion_scenes.js-Muster umgebaut werden.
//
// Szenen-ID "4.1" (nicht "3.x"): "3.x" ist im Code bereits für Zustände
// DES SCHIFFS reserviert (2.1 Basis, 3.1 Sturm) - die Schatzinsel ist aber
// eine komplett neue Karte/Örtlichkeit, kein weiterer Schiffszustand.
// Jede neue Örtlichkeit bekommt daher eine neue führende Ziffer, genau wie
// beim Sprung von Grimsgate (1.x) zum Schiff (2.x).
//
// Marker-Felder: siehe scenes.js (id/top/left/title/desc/img/variants).
//
// Bewusst nur EIN Marker bisher (Schiffswrack) - weitere Orte der Insel
// (Höhle, knorriger Baum, Felsformationen) folgen erst in einem späteren
// Schritt, auf ausdrücklichen Wunsch schrittweise statt auf einmal.

const SCHATZINSEL_SCENES = {
  "4.1": {
    label: "4.1 – Schatzinsel (Strandung)",
    background: "images/schatzinsel.webp",
    soundFile: "island1.ogg",
    markers: [
      {
        id: "schiffswrack",
        top: 70, left: 73,
        title: "Die gestrandete Golden Lion",
        desc: "Die Golden Lion liegt zerzaust in einer sandigen Bucht auf der Seite, der Hauptmast gebrochen, der Rumpf übel zugerichtet. Tauwerk und Trümmer verteilen sich über den Strand. Für die meisten an Bord wirkt es wie reines Glück, hier überhaupt festen Boden unter den Füßen zu haben — dass Tom sie mit gezielten Ankermanövern genau hierher gesteuert hat, wissen nur die wenigsten.",
        // Noch kein eigenes Nahaufnahme-Bild für diesen Ort (wie z.B.
        // interior_oberdeck.webp fürs Schiff) - bis eines existiert, wird
        // hilfsweise dasselbe Insel-Bild wie der Kartenhintergrund gezeigt,
        // statt "Kein Bild hinterlegt." anzuzeigen.
        img: "images/schatzinsel.webp"
      }
    ]
  }
};

// ID der Szene, die angezeigt wird, falls (noch) keine Verbindung zu
// Firebase besteht oder noch nichts gesetzt wurde. Wird von karte.html/
// regie.html NICHT automatisch als globaler Fallback genutzt (das bleibt
// DEFAULT_SCENE = "1.1", siehe karte.html) - dient hier nur als
// Referenzwert für eine mögliche künftige Verwendung.
const DEFAULT_SCHATZINSEL_SCENE = "4.1";
