---
name: pnp-safe-test
description: Führt durch das sichere, offline Testen von regie.html/karte.html in diesem PnP-Kampagnentool via Playwright, ohne die echte (live von Spielern genutzte) Firebase-Datenbank zu berühren. Nutzen vor JEDER automatisierten UI-Interaktion mit den Admin-/Spieler-Seiten dieses Projekts.
---

# Firebase-sicher testen (Playwright, offline)

**Warum das zwingend ist:** Firebase Realtime Database ist in diesem Projekt eine echte
Produktionsumgebung, live von der Spielleitung UND (potenziell) Spielern genutzt. Ein
automatisierter Test, der versehentlich gegen die echte Datenbank läuft, kann echte
Session-Daten überschreiben. Genau das ist in der Entwicklung dieses Systems einmal beinahe
passiert (ein früher Playwright-Testlauf ohne diesen Guard verband sich tatsächlich mit der
Live-Datenbank, sichtbar am Status „Verbunden — live für Spieler: ..."). Dieser Ablauf ist seitdem
für jeden Test verbindlich, ohne Ausnahme.

## Das Prinzip

`regie.html`/`karte.html` versuchen beim Laden, `firebase.initializeApp(firebaseConfig)`
aufzurufen (Konfiguration kommt aus `js/firebase-config.js`). Schlägt das fehl (try/catch), bleibt
`db === null` und JEDE Schreibfunktion im Code ist mit `if (!db) return;` abgesichert — alle
Firebase-Schreibzugriffe werden dadurch zu No-Ops. Der Test-Server liefert absichtlich eine
kaputte/leere Firebase-Konfiguration aus, um genau diesen Zustand zu erzwingen.

## Aufbau

1. Testskripte **niemals im Repo ablegen** — gehören ins Scratchpad-/Arbeitsverzeichnis der
   aktuellen Session, nicht versioniert.
2. Lokaler `http.createServer`, der das Repo-Root statisch ausliefert, mit EINER Ausnahme: die
   Anfrage nach `/js/firebase-config.js` wird abgefangen und liefert
   `const firebaseConfig = null;` statt der echten Datei aus.
3. Playwright öffnet die Zielseite gegen `http://localhost:<port>/...`.
4. **Vor jeder interaktiven Aktion** (Klick, Formular-Submit, Eingabe) im Testskript per
   `page.evaluate(() => db === null)` prüfen. Ist das Ergebnis nicht `true`: Test sofort
   abbrechen (`process.exit(1)`), NICHT fortfahren.
5. Konsolen-/Seitenfehler mitschneiden (`page.on('console', ...)`, `page.on('pageerror', ...)`)
   und am Ende der Skript-Ausgabe zusammenfassen — 0 Fehler ist die Baseline für „grün".

## Minimal-Vorlage

```js
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = '<repo-root-absoluter-pfad>';
const PORT = 8800; // pro parallelem Testlauf einen freien Port wählen
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/regie.html';
  if (p === '/js/firebase-config.js') { res.writeHead(200, { 'Content-Type': 'application/javascript' }); res.end('const firebaseConfig=null;'); return; }
  const full = path.join(ROOT, p);
  fs.readFile(full, (err, data) => { if (err) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' }); res.end(data); });
});
server.listen(PORT, async () => {
  const errors = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 950 } });
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => errors.push('PAGE: ' + e.message + '\n' + e.stack));
  try {
    await page.goto('http://localhost:' + PORT + '/regie.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const dbIsNull = await page.evaluate(() => db === null);
    if (!dbIsNull) { console.log('ABBRUCH: nicht offline.'); process.exit(1); }

    // ... eigentliche Test-Interaktionen hier, erst NACH der obigen Prüfung ...

  } catch (e) {
    errors.push('EXCEPTION: ' + e.message + '\n' + e.stack);
  }
  await browser.close();
  server.close();
  console.log('\n=== ERRORS (' + errors.length + ') ===');
  errors.forEach(e => console.log(e));
  process.exit(errors.length ? 1 : 0);
});
```

Playwright wird im Scratchpad-Verzeichnis installiert (`npm install --no-audit --no-fund
playwright` + `npx playwright install chromium --with-deps`), nicht im Repo — kein
`package.json`/`node_modules` wird hier committet.

## Wann ein neuer, gezielter Test sinnvoll ist

Bei jeder UI-Änderung: bestehende Testskripte aus dem laufenden Scratchpad-Verzeichnis
wiederverwenden/erweitern statt bei null anzufangen, plus ein neues, auf die konkrete Änderung
zugeschnittenes Skript (z. B. „Klick X löst Y aus, ohne Z zu brechen"). Nach jeder Runde alle
bisherigen Testskripte erneut laufen lassen (Regression), bevor committet wird.

## Definition of Done

- [ ] `db === null` wird vor jeder interaktiven Aktion geprüft und bricht bei Verstoß sofort ab
- [ ] `/js/firebase-config.js` wird vom Testserver abgefangen, nicht die echte Datei ausgeliefert
- [ ] 0 Konsolen-/Seitenfehler in der finalen Testausgabe
- [ ] Testskripte liegen im Scratchpad, nicht im Repo
