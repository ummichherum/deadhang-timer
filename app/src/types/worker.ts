/**
 * Web Worker Message Types for Timer Communication
 */

// Message types that can be sent TO the worker
export type TimerWorkerInputMessage = 
  | { type: 'START'; duration: number; interval?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'SET_TIME'; time: number };

// Message types that can be received FROM the worker
export type TimerWorkerOutputMessage = 
  | { type: 'TICK'; timeLeft: number; timestamp: number }
  | { type: 'FINISHED'; timestamp: number }
  | { type: 'STARTED'; duration: number; timestamp: number }
  | { type: 'PAUSED'; timeLeft: number; timestamp: number }
  | { type: 'RESUMED'; timeLeft: number; timestamp: number }
  | { type: 'STOPPED'; timestamp: number }
  | { type: 'ERROR'; error: string; timestamp: number };

// Worker state interface
export interface TimerWorkerState {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  duration: number;
  interval: number;
  startTime: number | null;
  pausedTime: number;
}

// Worker configuration
export interface TimerWorkerConfig {
  interval: number; // Update interval in milliseconds (default: 100ms for smooth updates)
  precision: number; // Precision for time calculations (default: 1 second)
}

// Default configuration
export const DEFAULT_TIMER_WORKER_CONFIG: TimerWorkerConfig = {
  interval: 100, // 100ms updates for smooth progress bars
  precision: 1000 // 1 second precision for timer display
};

// Error types that can occur in the worker
export type TimerWorkerError = 
  | 'INVALID_DURATION'
  | 'TIMER_NOT_RUNNING'
  | 'TIMER_ALREADY_RUNNING'
  | 'INVALID_TIME_VALUE'
  | 'WORKER_INITIALIZATION_FAILED';

// Utility type for worker message handling
export interface TimerWorkerMessageEvent {
  data: TimerWorkerOutputMessage;
}

// Worker lifecycle events
export type TimerWorkerLifecycleEvent = 
  | 'WORKER_CREATED'
  | 'WORKER_READY'
  | 'WORKER_ERROR'
  | 'WORKER_TERMINATED';

export interface TimerWorkerInfo {
  id: string;
  created: number;
  status: 'initializing' | 'ready' | 'error' | 'terminated';
  config: TimerWorkerConfig;
} 