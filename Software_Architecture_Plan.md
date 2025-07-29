# Software Architecture Plan: Deadhang Timer App

## 1. Architektur-Übersicht

### 1.1 Allgemeine Architektur
- **Architekturmuster**: Single Page Application (SPA) mit PWA-Capabilities
- **Client-Side Architektur**: Component-based Frontend mit State Management
- **Datenschicht**: Browser Local Storage + IndexedDB für komplexere Daten
- **Service Layer**: Service Worker für Offline-Funktionalität und Caching

### 1.2 Schichtenarchitektur
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│        (UI Components + Views)      │
├─────────────────────────────────────┤
│           Business Logic Layer      │
│     (Timer, Audio, Profile Manager) │
├─────────────────────────────────────┤
│           Data Access Layer         │
│    (Storage Service, State Manager) │
├─────────────────────────────────────┤
│           Infrastructure Layer      │
│   (PWA, Service Worker, Web APIs)   │
└─────────────────────────────────────┘
```

## 2. Technologie-Stack (Entscheidungen)

### 2.1 Frontend Framework
**Gewählt: React + TypeScript**
- ✅ Typsicherheit durch TypeScript
- ✅ Große Community und Mobile-optimierte Libraries
- ✅ Excellent PWA-Integration
- ✅ Komponent-basierte Architektur ideal für Timer-UI

### 2.2 Build-Tooling
**Gewählt: Vite + TypeScript**
- ✅ Extrem schnelle Entwicklung und Builds
- ✅ Ausgezeichnete PWA-Plugin-Unterstützung
- ✅ Tree Shaking und Bundle-Optimierung
- ✅ TypeScript Support out-of-the-box

### 2.3 State Management
**Gewählt: React Context + useReducer**
- ✅ Keine externe Dependencies - built-in React
- ✅ Bewährtes Pattern, gut dokumentiert  
- ✅ Vollständige TypeScript-Unterstützung
- ✅ Einfach zu testen und zu debuggen
- ✅ Performance-Optimierungen durch React.memo möglich

**Timer State Implementation:**
```typescript
interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'finished'
  currentPhase: 'start' | 'hang' | 'rest'
  timeLeft: number
  currentRep: number
  totalReps: number
  workoutProfile: WorkoutProfile | null
}

type TimerAction = 
  | { type: 'START_TIMER'; profile: WorkoutProfile }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK'; newTime: number }
  | { type: 'NEXT_PHASE' }
  | { type: 'NEXT_REP' }

const TimerContext = createContext<{
  state: TimerState
  dispatch: Dispatch<TimerAction>
} | null>(null)
```

**Context Provider Structure:**
```typescript
// Separate Context für verschiedene App-Bereiche
AppContext
├── TimerContext (Timer-spezifischer State)
├── SettingsContext (Theme, Audio-Settings)
├── ProfileContext (Workout-Profile Management)
└── StatisticsContext (Training-Verlauf)
```

## 3. Komponenten-Architektur

### 3.1 Core Components
```
App
├── Header (Timer Status, Theme Toggle)
├── ConfigurationView
│   ├── SetupForm
│   ├── TemplateSelector
│   └── ProfileManager
├── TimerView
│   ├── PhaseDisplay
│   ├── CountdownTimer
│   ├── ProgressIndicator
│   └── ControlButtons
├── StatisticsView
│   ├── HistoryList
│   ├── StatsChart
│   └── RecordsDisplay
└── Footer (Navigation, Settings)
```

### 3.2 Service Layer
```
TimerService
├── WorkerManager (Web Worker Communication)
├── PhaseController 
└── TimerCalculations

AudioService
├── SoundManager (Audio-Files)
├── AudioContext (Web Audio API)
└── VolumeController

StorageService
├── ProfileStorage (localStorage)
├── StatisticsStorage (localStorage)
└── SettingsStorage (localStorage)

PWAService
├── ServiceWorkerManager
├── CacheManager
└── OfflineDetector
```

**Integration mit React Context:**
- Services werden in Context Providern initialisiert
- Context Reducer rufen Service-Methoden auf
- Services haben keine direkten State-Dependencies

## 4. Datenmodell

### 4.1 Core Entities
```typescript
interface WorkoutProfile {
  id: string
  name: string
  repetitions: number
  hangTimes: number[] | number // Array für individuelle Zeiten
  pauseTimes: number[] | number // Array für individuelle Pausen
  startPause: number
  isTemplate: boolean
  createdAt: Date
}

interface WorkoutSession {
  id: string
  profileId: string
  startTime: Date
  endTime?: Date
  completedReps: number
  totalReps: number
  status: 'running' | 'paused' | 'completed' | 'cancelled'
}

interface AppSettings {
  theme: 'light' | 'dark'
  audioEnabled: boolean
  speechEnabled: boolean
  volume: number
  selectedProfile?: string
}
```

### 4.2 Storage Strategy
**Gewählt: localStorage für Einfachheit**
- ✅ Einfacher zu implementieren und debuggen
- ✅ Ausreichend für lokale App ohne Cloud-Sync
- ✅ TypeScript-Interfaces für Typsicherheit
- ✅ Weniger Komplexität, da keine erweiterte Skalierbarkeit geplant

## 5. Audio-Architektur

### 5.1 Audio-System Design
```
AudioService
├── AudioFileManager (lädt MP3/OGG Files)
├── WebAudioContext (für präzise Timing + Lautstärke)
├── SoundScheduler (für zeitgenaue Wiedergabe)
└── AudioSettings (Volume, Mute-Status)
```

**Audio-Assets Struktur:**
```
public/audio/
├── start.mp3
├── end.mp3  
├── phase-change.mp3
└── countdown.mp3
```

**Entscheidungen (Audio ist Must-Have):**

**Sound-Strategie: Vordefinierte Audio-Files**
- ✅ **Audio-Files**: MP3/OGG für verschiedene Sounds
  - Start-Sound (z.B. Beep)
  - End-Sound (z.B. Double-Beep) 
  - Phase-Wechsel (z.B. Ding)
  - Countdown (z.B. Tick für letzte 3 Sekunden)
- ✅ **Web Audio API**: Für präzises Timing und Lautstärke-Kontrolle
- ✅ **HTMLAudioElement Fallback**: Falls Web Audio API nicht verfügbar
- ✅ **Keine Speech Synthesis**: Reduziert Komplexität erheblich

**Audio-Implementierung:**
```typescript
interface AudioService {
  playStartSound(): void
  playEndSound(): void
  playPhaseChangeSound(): void
  playCountdownTick(): void
  setVolume(level: number): void
}
```

**Sound-Files benötigt:**
- `start.mp3` - Training beginnt
- `end.mp3` - Training beendet  
- `phase-change.mp3` - Von Hang zu Pause oder umgekehrt
- `countdown.mp3` - Letzten 3 Sekunden jeder Phase

## 6. Timer-Architektur

### 6.1 Timer-Präzision
**Gewählt: Web Workers + requestAnimationFrame Hybrid**
- ✅ **Web Worker**: Timer läuft im Hintergrund weiter (inaktive Tabs)
- ✅ **requestAnimationFrame**: Smooth UI-Updates im aktiven Tab
- ✅ **Sekunden-Präzision**: Ausreichend für Deadhang-Training
- ✅ **Message Passing**: Worker informiert Main Thread über Zeit-Updates

### 6.2 State Machine für Timer-Phasen
```
TimerStates:
- IDLE → STARTING → HANGING → RESTING → HANGING → ... → FINISHED
```

## 7. PWA & Offline-Strategie

### 7.1 Caching-Strategie
```
Cache Types:
├── App Shell (HTML, CSS, JS) - Cache First
├── Static Assets (Icons, Sounds) - Cache First  
├── Dynamic Content (User Data) - Network First
└── Fallback Pages - Cache Only
```

### 7.2 Service Worker Features
**Gewählt: Rein lokale App**
- ✅ App Updates im Hintergrund
- ✅ Vollständige Offline-Funktionalität
- ✅ Keine Cloud-Synchronisation nötig
- ✅ Datenschutz durch lokale Speicherung

## 8. Performance-Überlegungen

### 8.1 Bundle-Optimierung
- Tree Shaking für ungenutzten Code
- Code Splitting für verschiedene Views
- Lazy Loading für nicht-kritische Features

### 8.2 Runtime-Performance
- Virtual Scrolling für lange Listen (Statistiken)
- Debouncing für Eingaben
- Efficient Re-rendering

**Gewählt: Moderne Browser (Mobile-First)**
- ✅ **Target**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- ✅ **Primär**: Mobile Browser (iOS Safari, Chrome Mobile)
- ✅ **Features**: Web Workers, Web Audio API, PWA APIs verfügbar
- ✅ **Touch-Optimierung**: Große Touch-Targets, Swipe-Gesten

## 9. Testing-Strategie

### 9.1 Test-Pyramide
```
E2E Tests (Playwright für Mobile)
├── Vollständige Timer-Zyklen auf Mobile
├── Audio-Funktionalität (mit User-Activation)
└── PWA-Features (Installation, Offline)

Integration Tests (Vitest)
├── Timer + Audio Integration
├── Storage + State Management
└── Web Worker Communication

Unit Tests (Vitest + Testing Library)
├── React Components
├── Timer Logic
├── Audio Service
└── Storage Service
```

## 10. Deployment & Distribution

### 10.1 Hosting-Lösung
**Gewählt: Netlify**
- ✅ Automatische PWA-Optimierungen
- ✅ HTTPS by default (für PWA erforderlich)
- ✅ CDN global verfügbar
- ✅ Einfache CI/CD mit GitHub
- ✅ Branch-Previews für Testing

### 10.2 Browser-Kompatibilität (Mobile-First)
**Primary Targets:**
- ✅ **iOS Safari 14+**: PWA-Installation, Web Audio API
- ✅ **Chrome Mobile 90+**: Vollständige Features
- ✅ **Samsung Internet**: Android-Standard Browser
- ✅ **Desktop**: Sekundäre Zielgruppe, responsive Design

## 11. Zusätzliche Technische Details

### 11.1 TypeScript Konfiguration
- **Strict Mode**: Aktiviert für maximale Typsicherheit
- **Path Mapping**: Für saubere Imports (@/components, @/services)
- **Build Target**: ES2020 (moderne Browser)

### 11.2 React-Spezifische Architektur
```typescript
// Hauptkomponenten-Struktur
src/
├── components/           // UI-Komponenten
│   ├── common/          // Wiederverwendbare Komponenten
│   ├── timer/           // Timer-spezifische Komponenten
│   └── setup/           // Konfiguration-Komponenten
├── contexts/            // React Context Definitions
│   ├── TimerContext.tsx
│   ├── SettingsContext.tsx
│   ├── ProfileContext.tsx
│   └── StatisticsContext.tsx
├── reducers/            // useReducer Logic
│   ├── timerReducer.ts
│   ├── settingsReducer.ts
│   └── profileReducer.ts
├── hooks/               // Custom React Hooks
├── services/            // Business Logic Services  
├── types/               // TypeScript Definitionen
├── workers/             // Web Workers für Timer
└── utils/               // Utility Functions
```

**Context Provider Hierarchie:**
```typescript
// App.tsx
<SettingsProvider>
  <ProfileProvider>
    <StatisticsProvider>
      <TimerProvider>
        <Router>
          <AppContent />
        </Router>
      </TimerProvider>
    </StatisticsProvider>
  </ProfileProvider>
</SettingsProvider>
```

### 11.3 Weitere Überlegungen
- **Barrierefreiheit**: WCAG 2.1 AA für Screen Reader und Tastatur-Navigation
- **Security**: CSP Headers, keine externe Dependencies für kritische Funktionen
- **Internationalisierung**: Zunächst nur Deutsch, später erweiterbar

## 12. Empfohlene Packages

### 12.1 Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0"
  // Kein externes State Management - React Context + useReducer built-in
}
```

### 12.2 Development & Build
```json
{
  "vite": "^4.4.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vite-plugin-pwa": "^0.16.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0"
}
```

### 12.3 UI & Styling (Optional)
```json
{
  "tailwindcss": "^3.3.0",
  "clsx": "^2.0.0"
}
```

### 12.4 Testing
```json
{
  "vitest": "^0.34.0",
  "@testing-library/react": "^13.4.0",
  "@playwright/test": "^1.37.0"
}
```