# Deadhang Timer - Source Structure

## Ordnerstruktur (gemäß Software Architecture Plan)

```
src/
├── components/           # UI Components
│   ├── common/          # Wiederverwendbare Komponenten (Button, Modal, etc.)
│   ├── timer/           # Timer-spezifische Komponenten (CountdownTimer, PhaseDisplay)
│   └── setup/           # Konfigurations-Komponenten (SetupForm, TemplateSelector)
├── contexts/            # React Context Definitionen
│   ├── TimerContext.tsx     # Timer State Management
│   ├── SettingsContext.tsx  # App Settings (Theme, Audio)
│   ├── ProfileContext.tsx   # Workout Profile Management
│   └── StatisticsContext.tsx # Training-Verlauf & Statistiken
├── reducers/            # useReducer Logic
│   ├── timerReducer.ts      # Timer State Machine
│   ├── settingsReducer.ts   # Settings State Logic
│   └── profileReducer.ts    # Profile CRUD Logic
├── hooks/               # Custom React Hooks
├── services/            # Business Logic Services
│   ├── AudioService.ts      # Web Audio API + MP3 Management
│   ├── StorageService.ts    # localStorage Abstraction
│   ├── TimerService.ts      # Timer Calculations & Logic
│   └── PWAService.ts        # Service Worker Management
├── types/               # TypeScript Definitionen
│   ├── timer.ts             # Timer-related Types
│   ├── workout.ts           # Workout Profile Types
│   ├── settings.ts          # App Settings Types
│   └── audio.ts             # Audio-related Types
├── workers/             # Web Workers für Background Timer
└── utils/               # Utility Functions
    ├── time.ts              # Zeit-Formatierung
    ├── validation.ts        # Input Validierung
    ├── calculations.ts      # Timer-Berechnungen
    └── helpers.ts           # Allgemeine Helper
```

## Import-Strategie

### Saubere Imports durch Path Mapping:
```typescript
// Anstatt: import { Timer } from '../../../components/timer/Timer'
import { Timer } from '@/components'

// Anstatt: import { formatTime } from '../../utils/time'
import { formatTime } from '@/utils'
```

### Index-Dateien für strukturierte Exports:
```typescript
// @/components/index.ts exportiert alle Komponenten
import { CountdownTimer, PhaseDisplay } from '@/components'

// @/types/index.ts exportiert alle Types  
import type { TimerState, WorkoutProfile } from '@/types'
```

## Architektur-Prinzipien

1. **Separation of Concerns**: UI, Business Logic und Data Layer getrennt
2. **TypeScript-First**: Strict typing für alle Komponenten
3. **Mobile-First**: Optimiert für Touch-Interfaces
4. **PWA-Ready**: Service Worker für Offline-Funktionalität
5. **Performance**: Web Workers für Background-Timer 