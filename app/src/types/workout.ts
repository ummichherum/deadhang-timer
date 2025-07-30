// Workout and Profile-related TypeScript interfaces

/**
 * Workout Profile - Configuration for a specific workout
 * Can be saved, loaded, and reused
 */
export interface WorkoutProfile {
  /** Unique identifier for the profile */
  id: string
  /** User-friendly name for the profile */
  name: string
  /** Number of repetitions in the workout */
  repetitions: number
  /** Hang times in seconds - can be uniform (number) or individual per rep (array) */
  hangTimes: number | number[]
  /** Rest times in seconds - can be uniform (number) or individual per rep (array) */
  pauseTimes: number | number[]
  /** Initial start pause time in seconds (time to get to the bar) */
  startPause: number
  /** Whether this is a built-in template (non-editable) */
  isTemplate: boolean
  /** Creation date of the profile */
  createdAt: Date
  /** Last modification date */
  updatedAt: Date
  /** Optional description of the workout */
  description?: string
  /** Difficulty level for filtering and display */
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'custom'
}

/**
 * Workout Session - Record of a completed or ongoing workout
 * Used for statistics and history tracking
 */
export interface WorkoutSession {
  /** Unique identifier for the session */
  id: string
  /** Reference to the workout profile used */
  profileId: string
  /** Snapshot of profile name at time of workout */
  profileName: string
  /** Session start time */
  startTime: Date
  /** Session end time (null if ongoing) */
  endTime: Date | null
  /** Number of repetitions completed */
  completedReps: number
  /** Total number of planned repetitions */
  totalReps: number
  /** Current session status */
  status: 'running' | 'paused' | 'completed' | 'cancelled'
  /** Total hang time achieved in seconds */
  totalHangTime: number
  /** Total rest time taken in seconds */
  totalRestTime: number
  /** Total workout duration in seconds */
  totalDuration: number
  /** Completion percentage (0-100) */
  completionPercentage: number
  /** Optional notes about the session */
  notes?: string
}

/**
 * Template Definitions - Built-in workout templates
 */
export interface WorkoutTemplate {
  /** Template identifier */
  id: string
  /** Template name */
  name: string
  /** Template description */
  description: string
  /** Target difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  /** Template configuration */
  config: Omit<WorkoutProfile, 'id' | 'createdAt' | 'updatedAt' | 'isTemplate'>
}

/**
 * Predefined Templates - Available built-in templates
 */
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'beginner',
    name: 'Anfänger',
    description: '3 × 30s Deadhang, 30s Pause - Perfekt für den Einstieg',
    difficulty: 'beginner',
    config: {
      name: 'Anfänger Template',
      repetitions: 3,
      hangTimes: 5,
      pauseTimes: 5,
      startPause: 5,
      difficulty: 'beginner'
    }
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: '5 × 45s Deadhang, 45s Pause - Für fortgeschrittene Kletterer',
    difficulty: 'intermediate',
    config: {
      name: 'Intermediate Template',
      repetitions: 5,
      hangTimes: 45,
      pauseTimes: 45,
      startPause: 10,
      difficulty: 'intermediate'
    }
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: '5 × 60s Deadhang, 60s Pause - Für erfahrene Athleten',
    difficulty: 'advanced',
    config: {
      name: 'Advanced Template',
      repetitions: 5,
      hangTimes: 60,
      pauseTimes: 60,
      startPause: 10,
      difficulty: 'advanced'
    }
  }
]

/**
 * Profile Validation Result
 */
export interface ProfileValidation {
  /** Whether the profile is valid */
  isValid: boolean
  /** List of validation errors */
  errors: string[]
  /** List of validation warnings */
  warnings: string[]
}

/**
 * Profile Statistics - Aggregated statistics for a specific profile
 */
export interface ProfileStats {
  /** Profile ID */
  profileId: string
  /** Total number of sessions with this profile */
  totalSessions: number
  /** Total completed sessions */
  completedSessions: number
  /** Total hang time across all sessions (seconds) */
  totalHangTime: number
  /** Best completion rate achieved */
  bestCompletionRate: number
  /** Average completion rate */
  averageCompletionRate: number
  /** Last session date */
  lastSessionDate: Date | null
  /** Total workout time across all sessions (seconds) */
  totalWorkoutTime: number
} 