---
name: pnp-assets
description: Führt durch die Bild- und Audio-Optimierungs-Pipeline dieses PnP-Kampagnentools (tools/optimize_images.py, tools/optimize_audio.py). Nutzen, wenn ein neues PNG (z. B. aus Gemini) oder eine neue Audiodatei ins Repo aufgenommen werden soll, bevor sie in js/-Dateien referenziert wird.
---

# Neues Bild oder Audio einbinden

Diese Pipeline ist Teil des generischen Werkzeugkastens (`tools/`) und gilt unverändert für jede
über eine Kopie/Fork dieses Repos geleitete Kampagne. Beide Skripte sind bewusst minimal (kein
`requirements.txt`/`package.json` im Repo — ad hoc gepflegt). Vor dem ersten Lauf prüfen, ob
`pip install pillow` nötig ist (war schon einmal fehlend, siehe CLAUDE.md-Changelog 2026-08-01);
`optimize_audio.py` braucht ein installiertes `ffmpeg` im PATH.

## Bilder (`tools/optimize_images.py`)

1. Neues PNG in `images/` ablegen (z. B. Gemini-Export).
2. `python3 tools/optimize_images.py` ausführen — ohne Argumente verarbeitet es ALLE `*.png` in
   `images/`; einzelne Pfade können auch explizit als Argumente übergeben werden.
3. Größen-Kappung nach Dateinamensmuster (in `cap_for()` fest kodiert, bei Bedarf dort anpassen):
   - `interior_*` → 1600px längste Kante
   - bekannte Kartenbilder (`grimsgate_map.png`, `golden_lion.png`, `golden_lion_cutaway.png`,
     `golden_lion_cutaway_sturm.png`, `schatzinsel.png`) → 1920px
   - alles andere (angenommen: Porträts) → 900px
4. Ergebnis: gleichnamige `.webp`-Datei, Alpha-Kanal entfernt falls ohnehin voll deckend, Qualität
   82.
5. **Das Skript löscht das Quell-PNG NICHT automatisch** — Ergebnis sichtprüfen, dann von Hand
   entfernen.
6. **Das Skript trägt den neuen Dateinamen NICHT automatisch in `.js`-Dateien ein** — je nach
   Verwendungszweck manuell ergänzen:
   - Ort-/Kartenbild → `js/scenes.js`, `js/golden_lion_scenes.js` oder
     `js/schatzinsel_scenes.js` (`img`/`background`/`imgOverrides`-Feld, siehe Skill
     `pnp-scene`)
   - Charakter-Porträt → `js/characters.js`

## Audio (`tools/optimize_audio.py`)

1. Neue Audiodatei (mp3/wav/...) in **`audio/`** (nicht `images/`, nicht Hauptordner) ablegen.
2. `python3 tools/optimize_audio.py <dateiname> [weitere...]` — Dateiname ist Pflichtargument,
   kein automatischer Verzeichnis-Scan wie bei Bildern.
3. Ergebnis: gleichnamige `.ogg`-Datei (Opus, 64 kbps VBR, Metadaten/Cover-Art entfernt) in
   `audio/`.
4. **Quelldatei wird NICHT automatisch gelöscht.**
5. **Pflicht vor dem Mergen: Hendrik hört jede konvertierte Datei komplett durch.** Nicht ohne
   sein explizites „passt" als abgeschlossen behandeln.
6. **Firebase-Falle:** Der abspielende Dateiname pro Szene liegt oft LIVE in Firebase
   (`sceneAudioFile/{sceneId}`), vom Admin-Panel aus gesetzt — nicht nur als `soundFile`-Fallback
   im Code. Wird eine Datei umbenannt/neu konvertiert, die bereits einer Szene zugewiesen war,
   muss der neue Dateiname **zusätzlich im Admin-Panel (Sound-Leiste)** neu eingetragen werden,
   sonst bleibt der alte, jetzt fehlende Dateiname aktiv. Das Skript kann das nicht automatisch
   nachziehen (kein Firebase-Zugriff).

## Definition of Done

- [ ] Optimierte `.webp`/`.ogg`-Datei erzeugt und sichtgeprüft (bei Audio: komplett angehört von
      Hendrik)
- [ ] Neuer Dateiname manuell in der passenden `.js`-Datei eingetragen
- [ ] Bei Audio, das eine bereits laufende Szene ersetzt: Dateiname zusätzlich im Admin-Panel
      (Sound-Leiste) neu gesetzt
- [ ] Alte Quelldatei (PNG/mp3/wav) nach Bestätigung von Hand entfernt
