// Application Settings and Configuration TypeScript interfaces

import type { WorkoutProfile, WorkoutSession } from './workout'

/**
 * Theme Settings
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Language Settings (for future internationalization)
 */
export type LanguageCode = 'de' | 'en' | 'es' | 'fr'

/**
 * App Settings - Global application configuration
 * Stored in localStorage and managed via SettingsContext
 */
export interface AppSettings {
  /** Theme preference */
  theme: ThemeMode
  /** Audio enabled globally */
  audioEnabled: boolean
  /** Speech synthesis enabled (for future countdown announcements) */
  speechEnabled: boolean
  /** Master volume level (0-100) */
  volume: number
  /** Vibration enabled on mobile devices */
  vibrationEnabled: boolean
  /** Currently selected profile ID for quick access */
  selectedProfileId?: string
  /** Language preference */
  language: LanguageCode
  /** Keep screen on during workouts */
  keepScreenOn: boolean
  /** Show detailed statistics */
  showDetailedStats: boolean
  /** Enable background timer (continue when app is inactive) */
  enableBackgroundTimer: boolean
  /** Auto-save workout sessions */
  autoSaveWorkouts: boolean
  /** Show workout completion notifications */
  showNotifications: boolean
  /** First time user flag */
  isFirstTimeUser: boolean
  /** Last app version used (for migration purposes) */
  lastAppVersion?: string
  /** Settings last updated timestamp */
  updatedAt: Date
}

/**
 * Settings Action Types for useReducer
 */
export type SettingsAction =
  | { type: 'SET_THEME'; theme: ThemeMode }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'TOGGLE_SPEECH' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_VIBRATION' }
  | { type: 'SET_SELECTED_PROFILE'; profileId: string | undefined }
  | { type: 'SET_LANGUAGE'; language: LanguageCode }
  | { type: 'TOGGLE_KEEP_SCREEN_ON' }
  | { type: 'TOGGLE_DETAILED_STATS' }
  | { type: 'TOGGLE_BACKGROUND_TIMER' }
  | { type: 'TOGGLE_AUTO_SAVE' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_FIRST_TIME_USER'; isFirstTime: boolean }
  | { type: 'UPDATE_APP_VERSION'; version: string }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'IMPORT_SETTINGS'; settings: Partial<AppSettings> }

/**
 * Default Settings Configuration
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  audioEnabled: true,
  speechEnabled: false, // Disabled in MVP
  volume: 75,
  vibrationEnabled: true,
  selectedProfileId: undefined,
  language: 'de',
  keepScreenOn: true,
  showDetailedStats: false,
  enableBackgroundTimer: true,
  autoSaveWorkouts: true,
  showNotifications: true,
  isFirstTimeUser: true,
  lastAppVersion: undefined,
  updatedAt: new Date()
}

/**
 * Device Capabilities - Runtime detection of device features
 */
export interface DeviceCapabilities {
  /** Device supports vibration API */
  hasVibration: boolean
  /** Device supports Web Audio API */
  hasWebAudio: boolean
  /** Device supports Speech Synthesis API */
  hasSpeechSynthesis: boolean
  /** Device supports service workers */
  hasServiceWorker: boolean
  /** Device supports push notifications */
  hasNotifications: boolean
  /** Device supports wake lock (keep screen on) */
  hasWakeLock: boolean
  /** Device is touch-enabled */
  isTouchDevice: boolean
  /** Device is running in standalone PWA mode */
  isStandalone: boolean
  /** Device platform information */
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
}

/**
 * Export Settings - For backup/restore functionality
 */
export interface ExportData {
  /** Export format version */
  version: string
  /** Export timestamp */
  exportDate: Date
  /** App settings */
  settings: AppSettings
  /** Workout profiles */
  profiles: WorkoutProfile[]
  /** Workout sessions (optional, may be large) */
  sessions?: WorkoutSession[]
} 