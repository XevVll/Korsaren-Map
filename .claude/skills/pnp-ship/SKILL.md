---
name: pnp-ship
description: Operationalisiert den Branch→Commit→Push→Merge-Ablauf dieses PnP-Kampagnentool-Repos, inklusive Fix für die bekannte Non-Fast-Forward-Push-Eigenheit. Nutzen, wenn eine abgeschlossene, getestete Änderung eingecheckt und gemergt werden soll.
disable-model-invocation: true
---

# Änderung branchen, committen, pushen, mergen

Diese Skill hat echte Seiteneffekte (Git-Push, Merge) — nur auf explizite Anweisung ausführen,
nie proaktiv. `disable-model-invocation: true` sorgt dafür, dass sie nicht automatisch anhand von
Kontext ausgelöst wird.

## Vorbedingung

Änderung ist inhaltlich fertig UND getestet (bei UI-Änderungen: Skill `pnp-safe-test` durchlaufen,
0 Fehler). Nicht committen, um „zwischendurch zu sichern" — nur abgeschlossene Arbeitsschritte.

## Ablauf

1. **Branch erstellen**, falls noch nicht auf einem Feature-Branch:
   `git checkout -b <beschreibender-name>` (trägt uncommittete Änderungen sicher mit über).
2. **Status/Diff prüfen** (`git status`, `git diff`) — nur gezielt die betroffenen Dateien stagen
   (`git add <konkrete-datei>`), nicht `git add -A`/`git add .`, um keine versehentlichen
   Nebeneffekte (Testartefakte, Secrets) mit einzuchecken.
3. **Commit** im etablierten Stil dieses Repos: kurzer, klarer Titel auf Deutsch, was/warum in 1-3
   Zeilen, `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` am Ende. Kein `--amend` außer
   auf explizite Anweisung, kein `--no-verify`.
4. **Push:** `git push -u origin <branch>` (beim ersten Push des Branches).
5. **Bekannte Falle — Non-Fast-Forward-Ablehnung:** Der Remote-Feature-Branch behält manchmal eine
   veraltete Spitze von vor einem früheren Squash-Merge, wodurch `git push` als
   „non-fast-forward" abgelehnt wird, obwohl der Inhalt längst in `main` gemergt ist. Fix:
   ```
   git fetch origin <branch>
   git diff FETCH_HEAD origin/main --stat   # bestätigt: kein echter inhaltlicher Unterschied
   git merge --no-edit FETCH_HEAD
   ```
   Bei Konflikten (kommt vor, wenn dieselben Zeilen mehrfach angefasst wurden):
   `git checkout --ours <datei>` — die eingehende (Remote-)Seite ist in diesem Fall immer die
   veraltete.
6. **PR/Merge:**
   - Ist `gh` CLI installiert und authentifiziert: PR über `gh pr create` anlegen, auf explizites
     „merge" warten, dann Squash-Merge über `gh pr merge --squash`.
   - Ist `gh` NICHT verfügbar (aktuell der Fall in diesem Repo, Stand dieser Skill-Erstellung):
     Alternative ist ein lokaler Merge nach `main` (`git checkout main && git pull && git merge
     --no-ff <branch> && git push origin main`) — das ist ein bewusster, dokumentierter
     Unterschied zum eigentlich üblichen Squash-Merge-Ablauf, kein Ersatz für `gh`. Vor dem ersten
     Einsatz dieser Alternative kurz gegenprüfen, ob `gh` inzwischen installiert/authentifiziert
     wurde (`gh --version`, `gh auth status`) — falls ja, den regulären PR-Weg nehmen.
   - **In beiden Fällen: nie ohne Hendriks explizites „merge"/„direkt mergen" tatsächlich
     mergen.** Ein einmaliges „merge" gilt nur für den gerade vorliegenden Änderungssatz, nicht
     als Dauerfreigabe für zukünftige Änderungen.

## Definition of Done

- [ ] Änderung getestet (bei UI-Code: `pnp-safe-test` durchlaufen, 0 Fehler)
- [ ] Commit-Message beschreibt das Warum, nicht nur das Was
- [ ] Push erfolgreich (Non-Fast-Forward-Fix angewendet, falls nötig)
- [ ] Merge erst nach explizitem Go des Nutzers, nie proaktiv
