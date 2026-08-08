---
name: pnp-session-review
description: Wertet ein Session-Transkript zusammen mit dem regie.html-Export (Ausgelöste Ereignisse/Notizen/Charakter-Status/Ruf) gegen die Kampagnen-Bibel aus und liefert einen erzählerischen Recap, einen GM-Kontinuitäts-Check und konkrete Content-Vorschläge. Nutzen, wenn Hendrik nach einer Session ein Transkript (z. B. via Craig+Whisper aus dem Discord-Voice-Call) und/oder einen Export aus dem Admin-Panel zur Nachbereitung einreicht.
---

# Session-Transkript + Export gegen die Bibel auswerten

Diese Skill baut auf dem Session-Export in `regie.html` (Button „📤 Export") auf — siehe Skill
`pnp-scene` für die Datenstruktur dahinter. Sie ersetzt keine der bestehenden Skills, sondern
verarbeitet deren Ergebnis (den Export) plus ein Transkript zu einer Nachbereitung.

**Aufnahme/Transkription ist NICHT Teil dieser Skill.** Das Transkript entsteht extern (z. B.
Discord-Voice-Aufnahme via „Craig"-Bot + Transkription via Whisper o. Ä.) und wird von Hendrik
fertig eingefügt/angehängt — diese Skill erwartet nur das Ergebnis.

## Eingaben

- **Transkript** (Pflicht für den erzählerischen Recap, Rohtext von Hendrik eingefügt/angehängt).
  Kann fehlerhaft sein (Whisper verhaspelt sich oft bei Eigennamen) und muss nicht nach Sprechern
  getrennt sein.
- **Session-Export** (empfohlen, Markdown aus `regie.html`) — strukturierte Ground Truth: welche
  Trigger tatsächlich ausgelöst wurden, Ort-Notizen, Charakter-Status, Ruf-Stand. Falls kein Export
  vorliegt: nur aus dem Transkript arbeiten, aber explizit darauf hinweisen, dass die
  Kontinuitäts-Prüfung dann weniger verlässlich ist (keine strukturierte Bestätigung, was
  mechanisch wirklich passiert ist).
- **KAMPAGNEN-BIBEL.md** — selbst aus dem Repo lesen, nicht von Hendrik anfordern.

## Schritt 1: Personen zuverlässig erkennen

Vor der eigentlichen Auswertung: bekannte Namen aus `js/npc_roster.js` (`CREW`/`MANIFEST_EXTRA`),
`js/characters.js` (`CHARACTERS`) und dem Spieler-Roster (`players` im Export, Abschnitt „Ruf-Stand"
bzw. „Charakter-Status") als Abgleichsliste nutzen. Phonetisch ähnliche/falsch transkribierte Namen
im Transkript diesen bekannten Figuren zuordnen (Whisper-Fehler bei Eigennamen sind normal, kein
Hinweis auf einen neuen NPC, solange eine plausible bekannte Figur passt). Nur wirklich unbekannte
Namen als potenziell neue Figur behandeln.

## Schritt 2: Abgleich Transkript ↔ Export

Wo ein Export vorliegt: prüfen, ob die im Export als „ausgelöst" markierten Ereignisse im
Transkript wiederzufinden sind (bestätigt die Zuordnung) und ob es Momente im Transkript gibt, die
NICHT im Export auftauchen (z. B. weil der SL vergessen hat, den Trigger im Admin-Panel
abzuhaken) — das gehört in den Kontinuitäts-Check als Hinweis, nicht stillschweigend ignoriert oder
selbst nachträglich als „ausgelöst" behauptet.

## Schritt 3: Drei Ausgabe-Abschnitte

### 1. Erzählerischer Session-Recap
Lesbarer Prosa-Rückblick der Sitzung. Ton an KAMPAGNEN-BIBEL.md Abschnitt 2 („Design-Prinzipien")
anlehnen. Falls der Recap auch für Spieler gedacht sein könnte: Design-Regel 2.8 beachten (keine
Vorwegnahme von GM-Wissen, das die Spieler in der Fiktion noch nicht haben) — im Zweifel
nachfragen, für wen der Recap gedacht ist, statt anzunehmen.

### 2. GM-Kontinuitäts-Check
Direkt und unverblümt (Bibel 17: Hendrik erwartet klare Einschätzungen, auch unbequeme). Auflisten:
- Widersprüche zwischen Transkript und Bibel/bisherigem Stand
- Im Transkript erkennbare, aber im Export nicht abgehakte Ereignisse (siehe Schritt 2)
- Offene Fäden/Fragen, die als `[OFFEN]` in der Bibel landen könnten
- Was für die nächste Session vorzubereiten wäre

Nur für Hendrik — nicht spielertauglich formulieren, keine Rücksicht auf Spoiler nötig.

### 3. Konkrete Content-Vorschläge
Basierend auf dem, was tatsächlich am Tisch passiert ist: neue/geänderte `SZENEN_REGIE`-Ghosts,
`ORTE`-Einträge, `charStatus`-Updates, Bibel-Ergänzungen. **Nur als Vorschlag im Chat formulieren,
niemals selbstständig in Dateien schreiben** — Bibel 17: keine proaktiven Inhaltsänderungen ohne
Hendriks Bestätigung, auch wenn diese Skill explizit zur Auswertung aufgerufen wurde. Bei
Zustimmung die eigentliche technische Umsetzung über die Skills `pnp-scene` (Szenen/Orte/
Interaktionen) bzw. `pnp-npc` (NPCs) angehen, nicht hier duplizieren.

## Wichtig

- Kein Schritt dieser Skill schreibt automatisch in `js/regie.js`, `KAMPAGNEN-BIBEL.md` oder sonst
  eine Datei — alle drei Abschnitte sind Text in der Antwort, keine Datei-Edits.
- Fehlt sowohl Transkript als auch Export: nachfragen statt zu raten, woraus die Auswertung
  entstehen soll.
- Bei sehr langen Transkripten (mehrstündige Session): lieber ehrlich zusammenfassen und wichtige
  Momente hervorheben, als jedes Detail gleichgewichtig aufzulisten — der Export liefert bereits die
  strukturierte, vollständige Liste der mechanisch wichtigen Ereignisse; das Transkript liefert vor
  allem Ton/Dialog/Textur dazu.
