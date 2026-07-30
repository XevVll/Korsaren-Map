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
// Drei Marker: Schiffswrack (Strand, unten rechts), Stammesdorf (beim
// knorrigen Baum, oben mittig) und Höhle (Felshöhlen an der Westklippe,
// unten links) - Positionen anhand von images/schatzinsel.webp geschätzt,
// bei Bedarf im Admin-Panel live nachjustieren. Ausführliche Inhalte für
// Stammesdorf/Höhle (genauer Ablauf der Begegnung etc.) folgen noch -
// hier zunächst Ort + Atmosphäre, damit die Marker schon existieren und
// über den Sichtbarkeits-Schalter im Admin-Panel (regie.html) freigegeben
// werden können (siehe KAMPAGNEN-BIBEL 13.x, "hiddenMarkersLive").

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
        desc: "Die Golden Lion liegt zerzaust in einer sandigen Bucht auf der Seite, der vordere Mast gebrochen, der Rumpf übel zugerichtet. Tauwerk und Trümmer verteilen sich über den Strand. Die Crew ist bereits mitten in den Reparaturarbeiten — Balken werden herangeschafft, der Schmied schlägt am improvisierten Amboss Beschläge zurecht, Leitern lehnen am Rumpf. Für die meisten an Bord wirkt es wie reines Glück, hier überhaupt festen Boden unter den Füßen zu haben.",
        img: "images/interior_schiffswrack.webp"
      },
      {
        id: "stammesdorf",
        top: 24, left: 59,
        title: "Das Dorf am knorrigen Baum",
        desc: "Ein schmaler Pfad führt vom Dschungelrand auf eine Lichtung, in deren Mitte ein knorriger, halb abgestorbener Baum aufragt. Um ihn herum gruppieren sich einfache Hütten aus Holz und geflochtenem Palmblatt, Rauch steigt von einer Feuerstelle auf. Wachsame Blicke der Bewohner folgen jedem Schritt der Fremden. Hier lebt der Stamm, der seit Generationen das Siegel hütet, das den Zugang zur Wasserhöhle der Insel öffnet."
      },
      {
        id: "hoehle",
        top: 58, left: 14,
        title: "Die Wasserhöhle",
        desc: "In die zerklüfteten Klippen an der Westseite der Insel fressen sich zwei Öffnungen, die sich im Inneren zu einer einzigen, weitläufigen Höhle verbinden — die trennende Wand ist längst der Brandung zum Opfer gefallen. Nur mit dem Boot und bei ablaufendem Wasser ist der Zugang zu wagen. Irgendwo im Dunkel soll der Schatz liegen, den Harwick sucht — verschlossen hinter etwas, das nur mit dem Siegel des Inselstamms zu öffnen ist."
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
