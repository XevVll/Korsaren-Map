---
name: pnp-npc
description: Führt durch das Anlegen eines neuen NPCs/Crew-Mitglieds in diesem PnP-Kampagnentool (js/npc_roster.js, js/characters.js bzw. die analogen Dateien einer geforkten Kampagne). Nutzen, wenn eine neue Figur mit Ruf-Stichpunkten oder ein neuer Charakter mit Porträt für die Charakter-Leiste angelegt werden soll.
---

# Neuen NPC / neue Figur anlegen

Das Muster ist generisch (jede über eine Kopie/Fork dieses Repos geleitete Kampagne nutzt dieselbe
Struktur) — die Beispiele unten (Crew-Mitglieder der Golden Lion) stammen aus der aktuell
laufenden Korsaren-Kampagne. Zwei getrennte, aber verwandte Datenquellen — je nach Zweck die
richtige wählen:

## Schritt 1: Welche Art von Charakter?

- **Kern-Crew mit Porträt** (aktuell 7: Harwick, Cormac, Tom, Dirk, Francesco, Wat, Josiah) — hat
  einen Eintrag sowohl in `CREW` (`js/npc_roster.js`) als auch in `CHARACTERS`
  (`js/characters.js`, gleiche `id`), erscheint dadurch als Porträt in der Charakter-Leiste
  (`karte.html` rechter Rand, Admin-Panel Charaktere-Rail). Neue Kern-Crew ist selten — meist geht
  es um Fall 2.
- **Weiteres benanntes Mannschaftsmitglied ohne festes Porträt** — gehört in `MANIFEST_EXTRA`
  (`js/npc_roster.js`), analog zu den 14 bereits vorhandenen Einträgen (Ned Sharpe, Ezra Coombe,
  usw., ursprünglich aus `besatzung.html` übernommen). Kein `CHARACTERS`-Eintrag nötig — diese
  Figuren werden im Vault-Adminpanel über den „+"-Flow bei Bedarf aktiviert
  (`extraNpcs/{npcId} = true` in Firebase, ausgelöst durch `vAddManifest(npcId)` in
  `js/regie_vault.js`).
- **Spontaner, szenenlokaler Statist** ("Ghost") — kein Eintrag in einer `.js`-Datei nötig,
  entsteht direkt im Vault-Adminpanel über das „+ Ghost anlegen"-Formular während der Session
  (`vSubmitGhost()`, landet in Firebase unter `extraGhosts/{szeneId}/{ghostId}`). Nur relevant,
  wenn ein NPC dauerhaft in den Quelldateien dokumentiert werden soll — für einmalige
  Session-Statisten reicht der Live-Flow, ohne dass diese Skill gebraucht wird.

## Schritt 2: Objekt-Form (`MANIFEST_EXTRA`, `js/npc_roster.js`)

```js
{
  id: "ned_sharpe", name: "Ned Sharpe", role: "Matrose",
  triggers: [
    "Spieler beschützen oder umsorgen ihn → die halbe Crew rechnet es ihnen an",
    "Spieler verspotten ihn oder bringen ihn in Gefahr → die Stimmung kippt schnell"
  ]
}
```
- `id`: eindeutig, snake_case, wird als Firebase-Pfad-Segment genutzt (`extraNpcs/{id}`,
  `charStatus/npc_{id}`) — keine Punkte/Sonderzeichen.
- `role`: kurze Funktionsbezeichnung an Bord (Matrose, Vollmatrose, Wundversorgung, Böttcher, ...).
- `triggers[]`: **wörtlicher Stil**, wie in `besatzung.html` etabliert — ein oder zwei
  Stichpunkte im Muster „Spieler tun X → Konsequenz Y", **kein** Fließtext, keine
  Ruf-Zahlenwerte (Ruf ist laut Bibel §5 verdeckt/SL-Ermessen, nicht mechanisch berechnet). Bei
  neuem Inhalt: Hendrik liefert den tatsächlichen Trigger-Text — diese Skill erfindet ihn nicht
  selbst (Bibel 17: keine proaktiven Inhaltsvorschläge ohne Anweisung).

Für Kern-Crew (`CREW`, gleiche Datei) ist die Form identisch, plus ein passender `CHARACTERS`-
Eintrag in `js/characters.js`:
```js
{ id: "harwick", name: "James Harwick", img: "images/James_Harwick.webp" }
```
Bild muss vorher durch die Asset-Pipeline gelaufen sein (siehe Skill `korsaren-assets`).

## Schritt 3: Wo der neue NPC danach sichtbar wird

- `MANIFEST_EXTRA`-Einträge erscheinen im Vault-Adminpanel unter „+" am NPC-Bereich der
  Charakter-Leiste, sind aber erst nach Aktivierung (`extraNpcs/{id}`) Teil der
  Erwähnungs-Erkennung (Backlinks) und des `charStatus`-Freitextfelds. Ohne diesen Aktivierungs-
  Schritt taucht ein neuer `MANIFEST_EXTRA`-Eintrag in der Datenquelle auf, aber nicht automatisch
  live im Panel.
- `CREW`/`CHARACTERS`-Einträge (Kern-Crew) sind sofort in der Charakter-Leiste sichtbar, ohne
  Aktivierungsschritt.

## Schritt 4: Definition of Done

- [ ] `id` eindeutig, keine Firebase-illegalen Zeichen (Punkte, `#`, `$`, `[`, `]`)
- [ ] `role`/`triggers` im etablierten Stil, Inhalt kommt von Hendrik (nicht selbst erfunden)
- [ ] Bei Kern-Crew: `CHARACTERS`-Eintrag mit passender `id` + optimiertes Porträtbild ergänzt
- [ ] Kurz geprüft, dass kein bestehender `id`-Wert kollidiert (`js/npc_roster.js` durchsuchen)
