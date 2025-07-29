// Timer-related TypeScript interfaces for Deadhang Timer App

import type { WorkoutProfile } from './workout'

// Timer status types
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

// Timer phase types (workout flow)
export type TimerPhase = 'start' | 'hang' | 'rest'

// Timer state interface
export interface TimerState {
  status: TimerStatus
  currentPhase: TimerPhase
  timeLeft: number
  currentRep: number
  totalReps: number
  workoutProfile: WorkoutProfile | null
  isBackground: boolean
  totalElapsedTime: number
}

// Timer actions for useReducer
export type TimerAction =
  | { type: 'START_TIMER'; profile: WorkoutProfile }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK'; timeLeft: number } // Updated for Web Worker
  | { type: 'NEXT_PHASE'; nextPhase: TimerPhase; nextTime: number }
  | { type: 'NEXT_REP'; nextRep: number }
  | { type: 'FINISH_WORKOUT' }
  | { type: 'SET_BACKGROUND'; isBackground: boolean }
  | { type: 'UPDATE_PROFILE'; profile: WorkoutProfile }

// Timer configuration interface
export interface TimerConfig {
  defaultRepetitions: number
  defaultHangTime: number
  defaultRestTime: number
  defaultStartPause: number
  maxRepetitions: number
  maxDuration: number
  tickInterval: number
}

// Timer statistics interface
export interface TimerStats {
  completedWorkouts: number
  totalHangTime: number
  totalRestTime: number
  averageHangTime: number
  personalBest: number
  lastWorkout: Date | null
} 