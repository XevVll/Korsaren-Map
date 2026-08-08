---
name: pnp-content-style
description: Prüft neu geschriebene Szenen-/Marker-/Interaktionstexte in diesem PnP-Kampagnentool gegen die etablierten Stilregeln (Ort statt Plot in Marker-Texten, Information statt Interpretation, keine erfundenen Story-Inhalte ohne Anweisung). Nutzen vor dem Commit neuer Inhalte, oder wenn bestehende Texte auf Regelverstöße durchgesehen werden sollen.
---

# Inhalts-Stilregeln gegenlesen

Diese Regeln gelten kampagnenübergreifend für jede über eine Kopie/Fork dieses Repos geleitete
Kampagne — sie stehen im Kern in der jeweiligen Kampagnen-Bibel (hier: `KAMPAGNEN-BIBEL.md`,
Abschnitte 2.8 und 17) und in `ARBEITSSTAND.md`. Diese Skill macht sie zu einem aktiv anwendbaren
Check statt reiner Nachschlage-Prosa.

## Regel 1: Marker-`desc` = Ort/Stimmung, kein Plot (Design-Regel 2.8)

Der `desc`-Text eines Markers (`js/scenes.js`, `js/golden_lion_scenes.js`,
`js/schatzinsel_scenes.js`) ist das, was Spieler beim Anklicken eines Orts sehen. Er darf:
- **Sinneseindrücke und Atmosphäre** beschreiben (Geräusche, Gerüche, Licht, Personen die
  sichtbar sind, ohne dass ihr Zweck erklärt wird)
- **Ort-Fakten** nennen (was für ein Gebäude, wer offiziell dort arbeitet)

Er darf NICHT:
- Handlungsaufträge formulieren ("Hier solltest du nach X fragen")
- Plot-Wissen vorwegnehmen, das der GM eigentlich selbst enthüllen soll (z. B. dass ein NPC
  wirklich jemand anderes ist, dass ein Schiff nicht offiziell registriert ist)
- NPC-Ziele/Absichten verraten, die erst durchs Rollenspiel herauskommen sollen

Alles GM-Hintergrundwissen (was eine Figur wirklich vorhat, welche Konsequenz ein Trigger hat)
gehört ausschließlich in die GM-Datei (`js/regie.js`: `details`/`trigger[].info`/`ortHinweis`),
niemals in `desc`.

**Test beim Gegenlesen:** Würde ein Spieler, der nur `desc` liest (nicht `regie.js`), etwas
erfahren, das die Spielleitung eigentlich noch zurückhalten wollte? Wenn ja: Text kürzen/entfernen
und ins GM-Material verschieben.

## Regel 2: Information statt Interpretation (ARBEITSSTAND.md-Prinzip)

Stimmungstexte (Szenen-`stimmung`, `ortHinweis`, Marker-`desc`) geben **Fakten und
Sinneseindrücke**, keine fertige Deutung. Nicht: "Der Hafen wirkt bedrohlich und gefährlich."
Sondern: konkrete Beobachtungen, aus denen Spieler selbst schließen, ob es bedrohlich wirkt.
Die Interpretation ist Sache der Spieler am Tisch, nicht des Texts.

## Regel 3: Keine proaktiven Inhaltserfindungen (Bibel 17)

Story-Inhalte entwickelt die Spielleitung selbst — diese Skill (und generell Claude in diesem
Projekt) liefert technische Umsetzung, keine neue Handlung, keine erfundenen NPC-Motivationen,
keine ausgedachten Konsequenzen für offene Verzweigungen. Bei einer inhaltlichen Lücke:
`[OFFEN]` im Text vermerken (siehe reales Beispiel in `js/regie.js`, Suche nach `[OFFEN]`) statt
selbst etwas zu erfinden. Ausnahme: rein technische Umgliederung bereits freigegebenen Wortlauts
(z. B. `info`-Felder aus vorhandenem `details`-Text extrahieren) ist KEINE Neuerfindung und daher
erlaubt.

## Ablauf beim Gegenlesen

1. Alle neuen/geänderten `desc`-Felder (Marker) einzeln gegen Regel 1 prüfen.
2. Alle neuen `stimmung`/`ortHinweis`-Texte gegen Regel 2 prüfen.
3. Nach unausgefüllten Entscheidungen suchen (fehlende Konsequenz, offene Mechanik-Frage) — als
   `[OFFEN]` markieren statt zu raten, sofern nicht explizit von der Spielleitung vorgegeben.
4. Bei Funden: konkrete Zeile zitieren und einen Korrekturvorschlag machen, nicht nur „Regel X
   verletzt" behaupten — die Spielleitung entscheidet über die endgültige Formulierung.
