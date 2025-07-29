# 🧗‍♂️ Deadhang Timer - PWA

Ein moderner Progressive Web App Timer für Deadhang-Training, speziell für Kletterer und Fitness-Enthusiasten.

## 🚀 Live Demo

**🌐 [Deadhang Timer Live App](https://DEINE-URL.netlify.app)** *(Nach Deployment verfügbar)*

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)

---

## ✨ Features

### 🏋️‍♂️ Training Features
- **⏱️ Präziser Timer**: Web Worker für sekundengenaue Zeitmessung
- **🔄 Phasen-Management**: Start → Hängen → Pause → Wiederholung → Ende
- **📊 Fortschritts-Anzeige**: Visuelle Timeline und Fortschrittsbalken
- **🎵 Audio-Feedback**: Sounds für Phasen-Übergänge (mit Fallbacks)
- **📱 Touch-optimiert**: Große Buttons für mobile Nutzung

### 📱 PWA Features
- **🔗 Installierbar**: Als App auf Desktop & Mobile installierbar
- **⚡ Offline-fähig**: Funktioniert ohne Internet-Verbindung
- **🎯 Performance**: Optimiert für schnelle Ladezeiten
- **🔄 Service Worker**: Intelligentes Caching für bessere Performance

### 🎨 Design Features
- **📱 Mobile-First**: Responsive Design für alle Geräte
- **🌙 Modern UI**: Sauberes, intuitives Interface
- **🎯 Accessibility**: WCAG-konforme Bedienbarkeit
- **⚡ Fast**: Optimierte Bundle-Größe und Ladezeiten

---

## 🛠️ Technologie-Stack

### Frontend
- **⚛️ React 18** + **📘 TypeScript 5**
- **⚡ Vite** - Build Tool und Dev Server
- **🎨 TailwindCSS** - Utility-First CSS Framework
- **🔄 React Context + useReducer** - State Management

### PWA & Performance
- **🔧 Vite PWA Plugin** - Service Worker Generation
- **👷‍♂️ Web Workers** - Background Timer für Präzision
- **🎵 Web Audio API** - Hochwertige Audio-Wiedergabe
- **📦 Workbox** - Intelligentes Caching

### Development & Deployment
- **🏗️ Netlify** - Hosting und Continuous Deployment
- **📋 TypeScript** - Typsicherheit und bessere DX
- **🎯 ESLint + Prettier** - Code Quality
- **🧪 Vitest + Playwright** - Testing (geplant)

---

## 🏗️ Projekt-Struktur

```
deadhangs/
├── app/                          # React PWA Application
│   ├── src/
│   │   ├── components/           # UI Components
│   │   │   ├── timer/           # Timer-spezifische Komponenten
│   │   │   ├── setup/           # Konfigurations-Komponenten
│   │   │   └── common/          # Wiederverwendbare Komponenten
│   │   ├── contexts/            # React Context Provider
│   │   ├── services/            # Business Logic (Timer, Audio)
│   │   ├── types/               # TypeScript Definitionen
│   │   ├── workers/             # Web Workers
│   │   ├── utils/               # Utility Functions
│   │   └── hooks/               # Custom React Hooks
│   ├── public/                  # Static Assets
│   │   └── audio/               # Audio Files (MP3/OGG)
│   ├── netlify.toml             # Netlify Configuration
│   └── public/_redirects        # SPA Routing Rules
├── .cursor/                     # Cursor Rules
├── PRD_Deadhang_Timer.md       # Product Requirements
├── Software_Architecture_Plan.md # Technical Architecture
├── TODO_Core_MVP.md            # Development Progress
└── DEPLOYMENT.md               # Deployment Guide
```

---

## 🚀 Quick Start

### 1. Installation

```bash
# Repository klonen
git clone https://github.com/YOUR-USERNAME/deadhang-timer
cd deadhang-timer/app

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

### 2. Production Build

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

### 3. Deployment

Siehe **[DEPLOYMENT.md](./app/DEPLOYMENT.md)** für detaillierte Anweisungen.

---

## 📱 Usage

1. **⚙️ Konfiguration**: Wähle ein vorgefertigtes Template oder konfiguriere manuell
2. **▶️ Training starten**: Drücke "Start Training"
3. **⏱️ Phasen folgen**: Start → Hängen → Pause → Wiederholung
4. **🎵 Audio-Cues**: Lass dich von Sounds durch das Workout führen
5. **📊 Fortschritt verfolgen**: Sieh deinen Progress in Echtzeit

### 🎯 Vorgefertigte Templates

- **🟢 Anfänger**: 3×30s Hängen, 30s Pause
- **🟡 Intermediate**: 5×45s Hängen, 45s Pause  
- **🔴 Advanced**: 5×60s Hängen, 60s Pause

---

## 🎵 Audio-System

### Unterstützte Events
- **🏁 Start**: Training beginnt
- **🧗‍♂️ Phase Change**: Wechsel zwischen Hängen/Pause
- **🎉 Ende**: Training abgeschlossen

### Fallback-Strategie
1. **🎹 Web Audio API** (primär)
2. **🔊 HTML Audio Element** (Fallback)
3. **📢 Programmatische Töne** (Ultimate Fallback)

---

## 📊 MVP Status

### ✅ Completed Features (Phase 1-3)

**Phase 1: Setup & Foundation**
- [x] Projekt-Setup (Vite + React + TypeScript)
- [x] Projekt-Struktur
- [x] TailwindCSS Setup
- [x] TypeScript Interfaces
- [x] Timer Context & Reducer

**Phase 2: Core Timer Functionality**
- [x] Timer UI Components
- [x] Manual Configuration
- [x] Web Worker Timer
- [x] Phase Management
- [x] Control Buttons
- [x] Audio Service

**Phase 3: PWA & Deployment**
- [x] Audio Files Integration
- [x] Service Worker
- [x] Responsive Design
- [x] Netlify Deployment Setup

---

## 🔜 Roadmap (Post-MVP)

- **💾 localStorage**: Workout-Profile speichern
- **📈 Statistiken**: Training-Verlauf und Fortschritt
- **🌙 Themes**: Hell/Dunkel-Modus
- **🔊 Audio-Einstellungen**: Lautstärke & Sound-Auswahl
- **📱 Native Apps**: iOS/Android über Capacitor
- **👥 Sharing**: Workout-Profile teilen

---

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

---

## 📄 License

Dieses Projekt ist unter der **MIT License** lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 🙏 Acknowledgments

- **🧗‍♂️ Klettergemeinschaft** für Inspiration und Feedback
- **⚛️ React Team** für das großartige Framework
- **🎨 TailwindCSS** für das utility-first CSS System
- **🚀 Netlify** für kostenloses PWA-Hosting

---

## 📞 Support & Contact

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/YOUR-USERNAME/deadhang-timer/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/YOUR-USERNAME/deadhang-timer/discussions)
- **📧 Email**: your.email@example.com

---

**🧗‍♂️ Happy Climbing & Training! 🏋️‍♂️** 