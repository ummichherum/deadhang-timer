# PRD: Deadhang Timer App

## 1. Produktvision
Eine benutzerfreundliche Timer-App für Deadhang-Training, die Sportler durch vollständige Trainingssets führt und dabei individuelle Zeiteinstellungen und Pausen ermöglicht.

## 2. Zielgruppe
- Kletterer und Boulderer
- Fitness-Enthusiasten
- Personen, die ihre Griffkraft trainieren möchten

## 3. Kernfunktionen

### 3.1 Set-Konfiguration
- **Wiederholungen**: Anzahl der Deadhangs pro Set (z.B. 3, 5, 8)
- **Hang-Zeiten**: 
  - Einheitliche Zeit für alle Wiederholungen ODER
  - Individuelle Zeiten pro Wiederholung
  - Eingabe in Sekunden oder Minuten
- **Pausen**:
  - Startpause (Zeit um zur Stange zu gehen)
  - Pause zwischen Wiederholungen
  - Individuelle Pausenzeiten möglich

### 3.2 Timer-Funktionalität
- Durchführung des kompletten Sets
- Anzeige des aktuellen Schritts
- Countdown-Timer für jede Phase
- Automatischer Übergang zwischen Phasen

### 3.3 Benutzeroberfläche
- Aktuelle Phase klar erkennbar
- Zeit deutlich sichtbar
- Fortschrittsanzeige durch das Set

## 4. Offene Fragen

### 3.4 Audio-Features 
- **Akustische Signale**: Töne für Start, Ende und Phasenwechsel
- **Countdown-Ansagen**: Sprachausgabe für die letzten 3-5 Sekunden jeder Phase
- **Unterschiedliche Töne**: Verschiedene Sounds für verschiedene Phasen (Start, Pause, Ende)
- **Lautstärke-Kontrolle**: Anpassbare Lautstärke für alle Audio-Features

### 3.5 Benutzerfreundlichkeit 
- **Plattform**: Web-App (funktioniert auf allen Geräten, einfache Entwicklung)
- **Große Zeitanzeige**: Sehr große, gut lesbare Zeitanzeige für Sichtbarkeit aus der Ferne
- **Pause/Resume**: Training pausieren und fortsetzen möglich
- **Einfaches Abbrechen**: Deutlich sichtbarer "Stopp"-Button zum Trainingsabbruch
- **Wiederholung**: Möglichkeit einzelne Deadhangs oder das komplette Set zu wiederholen
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen (Handy, Tablet, Desktop)

### 3.6 Design & Interface 
- **Farbschema**: Beide Optionen verfügbar (dunkles + helles Theme)
- **Interface-Stil**: Minimalistisch - fokussiert auf die wesentlichen Funktionen
- **Theme-Umschalter**: Einfacher Toggle zwischen Hell/Dunkel-Modus
- **Klare Navigation**: Wenige, gut sichtbare Buttons ohne Überladung

### 3.7 Daten & Verlauf 
- **Workout-Profile**: Verschiedene Trainings-Setups speichern und benennen
- **Statistiken**: Trainingsfortschritt verfolgen (Anzahl Sessions, Gesamtzeit, Rekorde)
- **Lokale Speicherung**: Daten werden im Browser gespeichert (kein Export erforderlich)
- **Schnellauswahl**: Gespeicherte Profile für einfache Wiederverwendung

### 3.8 Vorgefertigte Templates 
- **Anfänger-Template**: 3 × 20s Deadhang, 60s Pause
- **Intermediate-Template**: 5 × 30s Deadhang, 90s Pause  
- **Advanced-Template**: 8 × 45s Deadhang, 120s Pause
- **Custom Templates**: Benutzer können eigene Templates erstellen und speichern

### 3.9 Vereinfachtes Training 
- **Keine Aufwärmphase**: Direkter Start zum ersten Deadhang
- **Keine Cooldown-Phase**: Training endet nach letztem Deadhang
- **Fokus auf Kerntraining**: Konzentration auf die wesentlichen Deadhang-Phasen

## 4. Technische Anforderungen 
- **Plattform**: Progressive Web App (PWA) mit HTML5, CSS3, JavaScript
- **Performance**: Präzise Zeitmessung mit Web Audio API für zuverlässige Sounds
- **Offline-Funktionalität**: Service Worker für vollständige Offline-Nutzung
- **Responsive Design**: Mobile-first Approach, funktioniert auf allen Bildschirmgrößen
- **Browser-Kompatibilität**: Moderne Browser (Chrome, Safari, Firefox, Edge)
- **Audio-Support**: Web Audio API + Fallback für Speech Synthesis

## 5. MVP-Definition (Minimum Viable Product)

### Kernfeatures für erste Version:
- Set-Konfiguration (Wiederholungen, Zeiten, Pausen)
- Timer-Durchführung mit großer Zeitanzeige
- Audio-Signale und Countdown-Ansagen
- Pause/Resume/Stopp-Funktionalität
- Responsive Web-App Design mit Hell/Dunkel-Theme
- Minimalistisches Interface
- Workout-Profile speichern und verwalten
- Statistiken und Trainingsverlauf
- Vorgefertigte Templates (Anfänger, Intermediate, Advanced)
- Custom Template-Erstellung

