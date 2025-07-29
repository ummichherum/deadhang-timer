// Audio System TypeScript interfaces for Deadhang Timer

/**
 * Audio Event Types - Different types of audio events in the app
 */
export type AudioEventType = 
  | 'start'        // Training begins
  | 'end'          // Training completed
  | 'phase_change' // From hang to rest or vice versa
  | 'countdown'    // Last few seconds of a phase
  | 'error'        // Error notification
  | 'notification' // General notification

/**
 * Audio File Configuration
 */
export interface AudioFile {
  /** Unique identifier for the audio file */
  id: string
  /** Event type this audio file is for */
  eventType: AudioEventType
  /** File path or URL */
  src: string
  /** Alternative file format (for fallback) */
  fallbackSrc?: string
  /** Volume level for this specific file (0-1) */
  volume: number
  /** Whether this file should loop */
  loop: boolean
  /** Display name for settings */
  displayName: string
}

/**
 * Audio Settings - User preferences for audio behavior
 */
export interface AudioSettings {
  /** Master audio enabled/disabled */
  enabled: boolean
  /** Master volume (0-100) */
  masterVolume: number
  /** Individual volume settings per event type */
  eventVolumes: Record<AudioEventType, number>
  /** Countdown duration in seconds (how many seconds before end to play countdown) */
  countdownDuration: number
  /** Enable audio for phase transitions */
  enablePhaseTransitions: boolean
  /** Enable countdown audio */
  enableCountdown: boolean
  /** Enable start/end audio */
  enableStartEnd: boolean
  /** Use speech synthesis for announcements (future feature) */
  useSpeechSynthesis: boolean
  /** Speech synthesis voice preference */
  speechVoice?: string
  /** Speech synthesis rate (0.1-2.0) */
  speechRate: number
  /** Speech synthesis pitch (0-2) */
  speechPitch: number
}

/**
 * Audio Context State - Current state of the Web Audio API
 */
export interface AudioContextState {
  /** Whether Audio Context is initialized */
  isInitialized: boolean
  /** Current state of the Audio Context */
  state: 'suspended' | 'running' | 'closed'
  /** Whether user has interacted with the page (required for audio) */
  hasUserInteraction: boolean
  /** Error message if initialization failed */
  error?: string
}

/**
 * Audio Service Interface - Contract for audio service implementation
 */
export interface AudioServiceInterface {
  /** Initialize the audio system */
  initialize(): Promise<void>
  
  /** Play audio for specific event */
  playEvent(eventType: AudioEventType): Promise<void>
  
  /** Set master volume */
  setMasterVolume(volume: number): void
  
  /** Set volume for specific event type */
  setEventVolume(eventType: AudioEventType, volume: number): void
  
  /** Enable/disable audio globally */
  setEnabled(enabled: boolean): void
  
  /** Get current audio settings */
  getSettings(): AudioSettings
  
  /** Update audio settings */
  updateSettings(settings: Partial<AudioSettings>): void
  
  /** Check if audio context is ready */
  isReady(): boolean
  
  /** Cleanup resources */
  destroy(): void
}

/**
 * Predefined Audio Files Configuration
 */
export const AUDIO_FILES: AudioFile[] = [
  {
    id: 'start_beep',
    eventType: 'start',
    src: '/audio/start.mp3',
    fallbackSrc: '/audio/start.ogg',
    volume: 0.8,
    loop: false,
    displayName: 'Start Signal'
  },
  {
    id: 'end_beep',
    eventType: 'end',
    src: '/audio/end.mp3',
    fallbackSrc: '/audio/end.ogg',
    volume: 0.8,
    loop: false,
    displayName: 'End Signal'
  },
  {
    id: 'phase_change_ding',
    eventType: 'phase_change',
    src: '/audio/phase-change.mp3',
    fallbackSrc: '/audio/phase-change.ogg',
    volume: 0.7,
    loop: false,
    displayName: 'Phase Change'
  },
  {
    id: 'countdown_tick',
    eventType: 'countdown',
    src: '/audio/countdown.mp3',
    fallbackSrc: '/audio/countdown.ogg',
    volume: 0.6,
    loop: false,
    displayName: 'Countdown Tick'
  }
]

/**
 * Default Audio Settings
 */
export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  masterVolume: 75,
  eventVolumes: {
    start: 80,
    end: 80,
    phase_change: 70,
    countdown: 60,
    error: 90,
    notification: 50
  },
  countdownDuration: 3,
  enablePhaseTransitions: true,
  enableCountdown: true,
  enableStartEnd: true,
  useSpeechSynthesis: false,
  speechVoice: undefined,
  speechRate: 1.0,
  speechPitch: 1.0
}

/**
 * Audio Error Types
 */
export interface AudioError {
  type: 'initialization' | 'playback' | 'loading' | 'permission'
  message: string
  eventType?: AudioEventType
  timestamp: Date
} 