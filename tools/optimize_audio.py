#!/usr/bin/env python3
"""Verkleinert neue Szenen-Hintergrundtoene (mp3/wav/...) nach Opus/OGG.

Hintergrund: Grimgate1.mp3, ship1.mp3 und storm1.mp3 lagen bei 67-91 MB pro
Datei (zusammen 242 MB) bei 149-192 kbps MP3 - fuer reine Hintergrund-
Atmo-Loops unnoetig hoch. Opus komprimiert bei gleicher wahrgenommener
Qualitaet deutlich staerker als MP3 (siehe Juli 2026, Kampagnen-Bibel 13.1b).

Nutzung: Neue Audiodatei (mp3/wav/...) in audio/ ablegen, dann:

    python3 tools/optimize_audio.py <dateiname>

Erzeugt eine gleichnamige .ogg-Datei (Opus, 64 kbps, VBR, Metadaten/
Cover-Art entfernt) in audio/. Loescht die Quelldatei NICHT
automatisch - erst reinhoeren, dann von Hand entfernen.

(Bis August 2026 lagen die Audiodateien direkt im Hauptordner - beim
Aufraeumen nach images/ als Vorbild in einen eigenen audio/-Ordner
verschoben. karte.html/grimsgate_demo.html haengen ein "audio/"-Praefix
vor den ohnehin schon gespeicherten Dateinamen an, daher bleiben auch
alte, live in Firebase (sceneAudioFile/{sceneId}) gesetzte Dateinamen
unveraendert gueltig - keine Migration noetig.)

WICHTIG - Firebase-Falle: Anders als bei Bildern liegt der abspielende
Dateiname pro Szene oft LIVE in Firebase (sceneAudioFile/{sceneId}), vom
Admin-Panel (regie.html) aus gesetzt - nicht nur im Code. Nach dem
Umbenennen/Konvertieren einer Datei, die bereits fuer eine Szene eingetragen
war, MUSS der neue Dateiname im Admin-Panel (Sound-Leiste oben) erneut
eingetragen werden, sonst bleibt der alte (dann fehlende) Dateiname aktiv.
Dieses Skript kann das nicht automatisch mitziehen, da es keinen
Firebase-Zugriff hat.
"""

import os
import sys
import subprocess

AUDIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'audio')

OPUS_BITRATE = "64k"  # siehe Bibel 13.1b fuer die Herleitung


def optimize(fname):
    path = os.path.join(AUDIO_DIR, fname)
    if not os.path.isfile(path):
        print(f"Nicht gefunden: {path}")
        return
    base, _ext = os.path.splitext(fname)
    out_path = os.path.join(AUDIO_DIR, base + '.ogg')
    before = os.path.getsize(path)

    subprocess.run([
        'ffmpeg', '-y', '-i', path,
        '-c:a', 'libopus', '-b:a', OPUS_BITRATE, '-vbr', 'on',
        '-application', 'audio', '-map_metadata', '-1', '-vn',
        out_path
    ], check=True, capture_output=True)

    after = os.path.getsize(out_path)
    print(f"{fname} -> {os.path.basename(out_path)}  "
          f"{before/1024/1024:.1f} MB -> {after/1024/1024:.1f} MB "
          f"(-{100*(1-after/before):.0f}%)")
    print("Quelldatei wurde NICHT geloescht - nach Anhoeren von Hand entfernen.")
    print("Nicht vergessen: neuen Dateinamen ggf. im Admin-Panel (Sound-Leiste) "
          "fuer die betroffene(n) Szene(n) neu eintragen (siehe Docstring oben).")


def main():
    if len(sys.argv) < 2:
        print("Nutzung: python3 tools/optimize_audio.py <dateiname.mp3> [weitere...]")
        return
    for fname in sys.argv[1:]:
        optimize(fname)


if __name__ == '__main__':
    main()
