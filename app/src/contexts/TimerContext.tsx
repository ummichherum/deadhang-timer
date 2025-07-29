// Timer Context - Central state management for timer functionality
// Uses React Context + useReducer pattern

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { timerReducer, initialTimerState, calculateNextPhase, calculatePhaseTime } from '@/reducers/timerReducer';
import { timerServiceSingleton } from '@/services/TimerServiceSingleton';
import { AudioService } from '@/services/AudioService';
import type { TimerAction, TimerState, WorkoutProfile } from '@/types';

interface TimerContextType {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}

const TimerContext = createContext<TimerContextType | null>(null);

interface TimerProviderProps {
  children: React.ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const audioServiceRef = useRef<AudioService | null>(null);
  const isAudioInitialized = useRef(false);

  // Initialize AudioService
  useEffect(() => {
    const initializeAudio = async () => {
      if (!isAudioInitialized.current) {
        try {
          console.log('🎵 Initializing AudioService in TimerContext...');
          audioServiceRef.current = new AudioService();
          await audioServiceRef.current.initialize();
          isAudioInitialized.current = true;
          console.log('🎵 AudioService initialized successfully');
        } catch (error) {
          console.warn('🎵 AudioService initialization failed, continuing without audio:', error);
        }
      }
    };

    initializeAudio();

    // Cleanup on unmount
    return () => {
      if (audioServiceRef.current) {
        audioServiceRef.current.destroy();
        audioServiceRef.current = null;
        isAudioInitialized.current = false;
      }
    };
  }, []);

  // Ref to hold current state for event listeners
  const stateRef = useRef(state);
  stateRef.current = state;

  // Set up timer event listeners using the singleton
  useEffect(() => {
    console.log('🔗 Setting up timer event listeners...');
    
    const timerService = timerServiceSingleton;

    timerService.addEventListener('tick', (data) => {
      dispatch({
        type: 'TICK',
        timeLeft: data.timeLeft || 0
      });
    });

    timerService.addEventListener('finished', async () => {
      console.log('🏁 Timer phase finished - transitioning to next phase');
      
      // Use current state values from ref
      const currentState = stateRef.current;
      
      const nextPhaseData = calculateNextPhase(
        currentState.currentPhase,
        currentState.currentRep,
        currentState.totalReps
      );
      
      if (nextPhaseData.isFinished) {
        // Workout completed
        console.log('🎯 Workout completed!');
        dispatch({ type: 'FINISH_WORKOUT' });
        
        // Play end sound
        if (audioServiceRef.current) {
          try {
            await audioServiceRef.current.playEvent('end');
          } catch (error) {
            console.warn('🎵 Failed to play end sound:', error);
          }
        }
      } else {
        // Calculate next phase duration using current state
        const nextTime = calculatePhaseTime(nextPhaseData.phase, currentState.currentRep, currentState.workoutProfile!);
        
        console.log('📋 Phase transition:', {
          from: currentState.currentPhase,
          to: nextPhaseData.phase,
          currentRep: currentState.currentRep,
          isNewRep: nextPhaseData.isNewRep,
          isFinished: nextPhaseData.isFinished
        });
        console.log('⏰ Next phase duration:', nextTime, 'seconds');
        
        // Dispatch phase transition
        dispatch({
          type: 'NEXT_PHASE',
          nextPhase: nextPhaseData.phase,
          nextTime: nextTime
        });
        
        // Handle rep increment
        if (nextPhaseData.isNewRep) {
          dispatch({
            type: 'NEXT_REP',
            nextRep: state.currentRep + 1
          });
        }
        
        // Play phase change sound
        if (audioServiceRef.current) {
          try {
            await audioServiceRef.current.playEvent('phase_change');
          } catch (error) {
            console.warn('🎵 Failed to play phase change sound:', error);
          }
        }
        
        // Start timer for next phase
        console.log('🚀 Starting timer for next phase:', nextPhaseData.phase);
        timerService.start(nextTime);
      }
    });

    timerService.addEventListener('started', () => {
      console.log('▶️ Timer started in worker');
    });

    timerService.addEventListener('paused', () => {
      console.log('⏸️ Timer paused in worker');
    });

    timerService.addEventListener('resumed', () => {
      console.log('▶️ Timer resumed in worker');
    });

    timerService.addEventListener('stopped', () => {
      console.log('⏹️ Timer stopped in worker');
    });

    timerService.addEventListener('error', (data) => {
      console.error('❌ Timer Worker Error:', data.error);
    });

    // Cleanup listeners on unmount
    return () => {
      console.log('🧹 Removing timer event listeners...');
      timerService.removeAllEventListeners();
    };
  }, []); // Empty dependency array - listeners should only be set once

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};

export const useTimerActions = () => {
  const { dispatch } = useTimer();
  const audioServiceRef = useRef<AudioService | null>(null);

  useEffect(() => {
    if (!audioServiceRef.current) {
      audioServiceRef.current = new AudioService();
    }
  }, []);

  const startTimer = useCallback(async (profile: WorkoutProfile) => {
    console.log('🚀 Starting timer with profile:', profile.name);
    console.log('🔢 startPause duration:', profile.startPause);
    
    if (!timerServiceSingleton.isReady()) {
      console.warn('❌ TimerService singleton not ready');
      return;
    }

    dispatch({ type: 'START_TIMER', profile });
    
    // Play start sound
    if (audioServiceRef.current) {
      try {
        await audioServiceRef.current.playEvent('start');
      } catch (error) {
        console.warn('🎵 Failed to play start sound:', error);
      }
    }
    
    console.log('⏰ Starting singleton timer for', profile.startPause, 'seconds');
    timerServiceSingleton.start(profile.startPause);
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    console.log('⏸️ Pausing timer');
    dispatch({ type: 'PAUSE_TIMER' });
    timerServiceSingleton.pause();
  }, [dispatch]);

  const resumeTimer = useCallback(() => {
    console.log('▶️ Resuming timer');
    dispatch({ type: 'RESUME_TIMER' });
    timerServiceSingleton.resume();
  }, [dispatch]);

  const stopTimer = useCallback(() => {
    console.log('⏹️ Stopping timer');
    dispatch({ type: 'STOP_TIMER' });
    timerServiceSingleton.stop();
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    console.log('🔄 Resetting timer');
    dispatch({ type: 'RESET_TIMER' });
    timerServiceSingleton.reset();
  }, [dispatch]);

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer
  };
};

export const useTimerState = () => {
  const { state } = useTimer();
  return state;
};

export const useTimerComputed = () => {
  const { state } = useTimer();
  
  const progress = useMemo(() => {
    if (!state.workoutProfile || state.totalReps === 0) return 0;
    
    const completedReps = state.currentRep - 1;
    const repProgress = completedReps / state.totalReps;
    
    // Add progress within current rep based on phase
    let phaseProgress = 0;
    if (state.currentPhase === 'hang') {
      phaseProgress = 0.33; // 1/3 through the rep
    } else if (state.currentPhase === 'rest') {
      phaseProgress = 0.67; // 2/3 through the rep
    }
    
    const currentRepProgress = phaseProgress / state.totalReps;
    
    return Math.min(100, (repProgress + currentRepProgress) * 100);
  }, [state.currentPhase, state.currentRep, state.totalReps, state.workoutProfile]);

  return {
    progress,
    isIdle: state.status === 'idle',
    isRunning: state.status === 'running',
    isPaused: state.status === 'paused',
    isFinished: state.status === 'finished'
  };
};

export const useTimerFull = () => {
  const { state, dispatch } = useTimer();
  const actions = useTimerActions();
  const computed = useTimerComputed();
  
  return {
    state,
    dispatch,
    ...actions,
    ...computed
  };
}; 