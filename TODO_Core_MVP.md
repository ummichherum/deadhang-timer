# TODO: Core MVP Implementation Plan
## Deadhang Timer App - MVP-First Ansatz

### Status Legende
- ⏳ **Pending** - Noch nicht begonnen
- 🚧 **In Progress** - Gerade in Bearbeitung  
- ✅ **Completed** - Abgeschlossen
- ❌ **Cancelled** - Nicht mehr benötigt

---

## Phase 1: Grundgerüst (Woche 1)

### 1. ✅ Projekt-Setup
**ID**: `setup-project`
**Beschreibung**: Vite + React + TypeScript initialisieren mit PWA Plugin
**Geschätzte Zeit**: 2-3 Stunden
**Dependencies**: Keine
**Akzeptanzkriterien**:
- [ ] Vite-Projekt erstellt
- [ ] React 18 + TypeScript 5 konfiguriert
- [ ] PWA Plugin installiert und konfiguriert
- [ ] Entwicklungsserver läuft

### 2. ✅ Projekt-Struktur
**ID**: `project-structure`
**Beschreibung**: Basis-Ordnerstruktur erstellen (components/, contexts/, services/, types/)
**Geschätzte Zeit**: 30 Minuten
**Dependencies**: setup-project
**Akzeptanzkriterien**:
- [ ] Ordnerstruktur gemäß Architecture Plan erstellt
- [ ] Index-Dateien für bessere Imports
- [ ] Path-Mapping konfiguriert (@/components, @/services)

### 3. ✅ TailwindCSS Setup
**ID**: `tailwind-setup`
**Beschreibung**: TailwindCSS konfigurieren mit Mobile-first Breakpoints
**Geschätzte Zeit**: 1 Stunde
**Dependencies**: setup-project
**Akzeptanzkriterien**:
- [ ] TailwindCSS installiert und konfiguriert
- [ ] Mobile-first Breakpoints definiert
- [ ] Basis-Styles für App-Theme

### 4. ✅ TypeScript Interfaces
**ID**: `timer-types`
**Beschreibung**: TypeScript Interfaces definieren (TimerState, WorkoutProfile, TimerAction)
**Geschätzte Zeit**: 1-2 Stunden
**Dependencies**: project-structure
**Akzeptanzkriterien**:
- [ ] TimerState Interface komplett
- [ ] WorkoutProfile Interface
- [ ] TimerAction Union Types
- [ ] AppSettings Interface

### 5. ✅ Timer Context
**ID**: `timer-context`
**Beschreibung**: TimerContext + timerReducer implementieren (State Management Kern)
**Geschätzte Zeit**: 3-4 Stunden
**Dependencies**: timer-types
**Akzeptanzkriterien**:
- [ ] TimerContext erstellt
- [ ] timerReducer mit allen Actions
- [ ] Timer Provider Component
- [ ] Custom Hook useTimer()

### 6. ⏳ Basis Timer UI
**ID**: `basic-timer-ui`
**Beschreibung**: Basis Timer-Komponente mit großer Zeitanzeige erstellen
**Geschätzte Zeit**: 2-3 Stunden
**Dependencies**: timer-context, tailwind-setup
**Akzeptanzkriterien**:
- [ ] Große, gut lesbare Zeitanzeige
- [ ] Aktuelle Phase anzeigen
- [ ] Fortschrittsindikator (Rep X von Y)
- [ ] Mobile-optimiert

### 7. ⏳ Manuelle Konfiguration
**ID**: `manual-config`
**Beschreibung**: Einfache Konfiguration für Wiederholungen und Zeiten (hardcoded erstmal)
**Geschätzte Zeit**: 1-2 Stunden
**Dependencies**: basic-timer-ui
**Akzeptanzkriterien**:
- [ ] Einfaches Eingabeformular
- [ ] Wiederholungen einstellen
- [ ] Hang-Zeit und Pause-Zeit
- [ ] Validierung der Eingaben

---

## Phase 2: Timer-Funktionalität (Woche 2)

### 8. ⏳ Web Worker Timer
**ID**: `web-worker-timer`
**Beschreibung**: Web Worker für Background-Timer implementieren
**Geschätzte Zeit**: 4-5 Stunden
**Dependencies**: timer-context
**Akzeptanzkriterien**:
- [ ] Web Worker erstellt
- [ ] Message-Passing zwischen Worker und Main Thread
- [ ] Timer läuft im Hintergrund weiter
- [ ] Präzise Sekunden-Aktualisierung

### 9. ✅ Phasen-Management
**ID**: `phase-management`
**Beschreibung**: Timer-Phasen-Logic (Start → Hang → Rest → Repeat) implementieren
**Status**: `✅ Completed`
**Geschätzte Zeit**: 3-4 Stunden
**Dependencies**: web-worker-timer
**Akzeptanzkriterien**:
- [x] State Machine für Timer-Phasen
- [x] Automatischer Phasen-Übergang
- [x] Wiederholungs-Logic
- [x] Timer-Ende Erkennung

### 10. ✅ Control Buttons
**ID**: `control-buttons`
**Beschreibung**: Pause/Resume/Stop Buttons mit Funktionalität erstellen
**Status**: `✅ Completed`
**Geschätzte Zeit**: 2-3 Stunden
**Dependencies**: web-worker-timer, phase-management
**Akzeptanzkriterien**:
- [x] Pause/Resume-Funktionalität
- [x] Stop mit Bestätigung
- [x] Touch-optimierte Mobile-Buttons
- [x] State-Management Integration

---

## Phase 3: Audio + PWA (Woche 3)

### 11. ✅ Audio Service
**ID**: `audio-service`
**Beschreibung**: Audio Service mit Web Audio API + vordefinierte MP3s
**Status**: `✅ Completed`
**Geschätzte Zeit**: 4-5 Stunden
**Dependencies**: Keine (parallel entwickelbar)
**Akzeptanzkriterien**:
- [x] Web Audio Context Setup
- [x] Audio-File Loading (mit Fallback)
- [x] Lautstärke-Kontrolle
- [x] Fallback für HTMLAudioElement
- [x] Programmatische Sound-Generierung
- [x] Timer-Integration für Events

### 12. ✅ Audio Dateien
**ID**: `audio-files`
**Beschreibung**: Audio-Dateien erstellen/beschaffen (start.mp3, end.mp3, phase-change.mp3, countdown.mp3)
**Status**: `✅ Completed`
**Geschätzte Zeit**: 1-2 Stunden
**Dependencies**: Keine
**Akzeptanzkriterien**:
- [x] start.mp3 - Training beginnt
- [x] end.mp3 - Training beendet
- [x] phase-change.mp3 - Phasen-Wechsel
- [x] countdown.mp3 - Countdown-Ticks
- [x] OGG Fallback-Dateien
- [x] Integration mit AudioService bestätigt

### 13. ✅ Service Worker
**ID**: `service-worker`
**Beschreibung**: Service Worker für PWA-Grundfunktionalität konfigurieren
**Status**: `✅ Completed`
**Geschätzte Zeit**: 2-3 Stunden
**Dependencies**: setup-project
**Akzeptanzkriterien**:
- [x] Service Worker registriert
- [x] App-Shell Caching
- [x] Audio-Files cachen
- [x] Offline-Funktionalität
- [x] PWA Manifest konfiguriert
- [x] Mobile Meta-Tags optimiert

### 14. ✅ Responsive Design
**ID**: `responsive-design`
**Beschreibung**: Mobile-first responsive Design für Timer-Interface
**Status**: `✅ Completed`
**Geschätzte Zeit**: 3-4 Stunden
**Dependencies**: basic-timer-ui, control-buttons
**Akzeptanzkriterien**:
- [x] Mobile-optimierte Layouts
- [x] Touch-Targets ausreichend groß
- [x] Verschiedene Bildschirmgrößen getestet
- [x] Landscape/Portrait Orientierung
- [x] Debug Panel auf Mobile versteckt
- [x] Responsive Timer-Display und Controls

### 15. ✅ Netlify Deployment
**ID**: `netlify-deployment`
**Beschreibung**: Deployment-Pipeline zu Netlify einrichten
**Status**: `✅ Completed`
**Geschätzte Zeit**: 1-2 Stunden
**Dependencies**: service-worker
**Akzeptanzkriterien**:
- [x] Netlify-Konfiguration erstellt (`netlify.toml`, `_redirects`)
- [x] Production Build getestet und funktionsfähig
- [x] PWA-optimierte Headers konfiguriert
- [x] SPA-Routing für React eingerichtet
- [x] Deployment-Guide erstellt (`DEPLOYMENT.md`)
- [x] Service Worker und Audio-Caching konfiguriert

---

## Zusätzliche Notizen

### Technische Entscheidungen
- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite mit PWA Plugin
- **Styling**: TailwindCSS (mobile-first)
- **State**: React Context + useReducer (keine externen Libraries)
- **Timer**: Web Worker für Background-Ausführung
- **Audio**: Web Audio API + MP3 Files
- **Deployment**: Netlify mit automatischer PWA-Optimierung

### Nach MVP (Phase 4+)
- Workout-Profile (localStorage)
- Vorgefertigte Templates (Anfänger/Intermediate/Advanced)
- Basis-Statistiken
- Theme-Toggle (Hell/Dunkel)
- Erweiterte Audio-Features

### Geschätzte Gesamtzeit
**MVP Core**: ~35-50 Stunden (2-3 Wochen bei Teilzeit)
- Phase 1: ~10-15 Stunden
- Phase 2: ~10-15 Stunden  
- Phase 3: ~15-20 Stunden 