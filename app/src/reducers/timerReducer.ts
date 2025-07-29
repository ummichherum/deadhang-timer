/**
 * Timer Reducer
 * Implements state machine logic for the deadhang timer using useReducer pattern
 */

import type { TimerAction, TimerState, TimerPhase, WorkoutProfile } from '@/types'

export const initialTimerState: TimerState = {
  status: 'idle',
  currentPhase: 'start',
  timeLeft: 0,
  currentRep: 1,
  totalReps: 0,
  workoutProfile: null,
  isBackground: false,
  totalElapsedTime: 0
}

/**
 * Calculate the next phase in the workout sequence
 */
export const calculateNextPhase = (
  currentPhase: TimerPhase,
  currentRep: number,
  totalReps: number
): { phase: TimerPhase; isNewRep: boolean; isFinished: boolean } => {
  switch (currentPhase) {
    case 'start':
      return { phase: 'hang', isNewRep: false, isFinished: false }
    
    case 'hang':
      // After hang phase: check if this was the last rep
      if (currentRep >= totalReps) {
        // Last rep completed - workout finished
        return { phase: 'start', isNewRep: false, isFinished: true }
      }
      // More reps to go - go to rest phase
      return { phase: 'rest', isNewRep: false, isFinished: false }
    
    case 'rest':
      // After rest phase: start next rep with hang phase
      return { phase: 'hang', isNewRep: true, isFinished: false }
    
    default:
      return { phase: 'start', isNewRep: false, isFinished: false }
  }
}

/**
 * Calculate time duration for a specific phase
 */
export const calculatePhaseTime = (
  phase: TimerPhase,
  rep: number,
  profile: WorkoutProfile
): number => {
  switch (phase) {
    case 'start':
      return profile.startPause
    
    case 'hang':
      if (Array.isArray(profile.hangTimes)) {
        return profile.hangTimes[rep - 1] || profile.hangTimes[0]
      }
      return profile.hangTimes
    
    case 'rest':
      if (Array.isArray(profile.pauseTimes)) {
        return profile.pauseTimes[rep - 1] || profile.pauseTimes[0]
      }
      return profile.pauseTimes
    
    default:
      return 0
  }
}

/**
 * Calculate overall workout progress percentage
 */
export const calculateProgress = (state: TimerState): number => {
  if (!state.workoutProfile || state.totalReps === 0) {
    return 0
  }

  // Calculate total expected duration for entire workout
  const hangTime = Array.isArray(state.workoutProfile.hangTimes) 
    ? state.workoutProfile.hangTimes[0] 
    : state.workoutProfile.hangTimes;
  const restTime = Array.isArray(state.workoutProfile.pauseTimes) 
    ? state.workoutProfile.pauseTimes[0] 
    : state.workoutProfile.pauseTimes;

  const totalDuration = state.workoutProfile.startPause + 
    (hangTime + restTime) * state.totalReps;

  // Progress based on elapsed time
  const progress = (state.totalElapsedTime / totalDuration) * 100;
  return Math.min(100, Math.max(0, progress))
}

/**
 * Timer Reducer - Main state machine
 */
export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        status: 'running',
        workoutProfile: action.profile,
        currentPhase: 'start',
        currentRep: 1,
        totalReps: action.profile.repetitions,
        timeLeft: action.profile.startPause,
        totalElapsedTime: 0
      }

    case 'PAUSE_TIMER':
      if (state.status !== 'running') return state
      return {
        ...state,
        status: 'paused'
      }

    case 'RESUME_TIMER':
      if (state.status !== 'paused') return state
      return {
        ...state,
        status: 'running'
      }

    case 'STOP_TIMER':
      return {
        ...state,
        status: 'idle',
        currentPhase: 'start',
        timeLeft: 0,
        currentRep: 1,
        totalElapsedTime: 0
      }

    case 'RESET_TIMER':
      return {
        ...initialTimerState,
        workoutProfile: state.workoutProfile
      }

    case 'TICK':
      // Updated to handle Web Worker tick format
      return {
        ...state,
        timeLeft: action.timeLeft,
        totalElapsedTime: state.totalElapsedTime + 1
      }

    case 'NEXT_PHASE':
      return {
        ...state,
        currentPhase: action.nextPhase,
        timeLeft: action.nextTime
      }

    case 'NEXT_REP':
      return {
        ...state,
        currentRep: action.nextRep
      }

    case 'FINISH_WORKOUT':
      return {
        ...state,
        status: 'finished',
        currentPhase: 'start',
        timeLeft: 0
      }

    case 'SET_BACKGROUND':
      return {
        ...state,
        isBackground: action.isBackground
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        workoutProfile: action.profile
      }

    default:
      return state
  }
} 