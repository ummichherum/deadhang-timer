/**
 * Timer Web Worker
 * Handles precise timing operations in a separate thread to avoid blocking the main UI
 */

import type { 
  TimerWorkerInputMessage, 
  TimerWorkerOutputMessage, 
  TimerWorkerState,
  TimerWorkerError
} from '../types/worker';

// Worker state
let state: TimerWorkerState = {
  isRunning: false,
  isPaused: false,
  timeLeft: 0,
  duration: 0,
  interval: 100, // 100ms for smooth updates
  startTime: null,
  pausedTime: 0
};

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Send a message to the main thread
 */
const postMessage = (message: TimerWorkerOutputMessage): void => {
  self.postMessage(message);
};

/**
 * Send an error message to the main thread
 */
const postError = (error: TimerWorkerError, details?: string): void => {
  postMessage({
    type: 'ERROR',
    error: details || error,
    timestamp: Date.now()
  });
};

/**
 * Start the timer with a given duration
 */
const startTimer = (duration: number, interval: number = 100): void => {
  if (state.isRunning && !state.isPaused) {
    postError('TIMER_ALREADY_RUNNING');
    return;
  }

  if (duration <= 0) {
    postError('INVALID_DURATION', `Duration must be positive, got: ${duration}`);
    return;
  }

  // Reset state for new timer
  state = {
    isRunning: true,
    isPaused: false,
    timeLeft: duration,
    duration: duration,
    interval: interval,
    startTime: Date.now(),
    pausedTime: 0
  };

  // Start the interval
  startInterval();

  postMessage({
    type: 'STARTED',
    duration: duration,
    timestamp: Date.now()
  });
};

/**
 * Pause the timer
 */
const pauseTimer = (): void => {
  if (!state.isRunning) {
    postError('TIMER_NOT_RUNNING');
    return;
  }

  if (state.isPaused) {
    return; // Already paused
  }

  state.isPaused = true;
  state.pausedTime = Date.now();
  stopInterval();

  postMessage({
    type: 'PAUSED',
    timeLeft: state.timeLeft,
    timestamp: Date.now()
  });
};

/**
 * Resume the timer
 */
const resumeTimer = (): void => {
  if (!state.isRunning) {
    postError('TIMER_NOT_RUNNING');
    return;
  }

  if (!state.isPaused) {
    return; // Already running
  }

  // Adjust start time to account for paused duration
  const pausedDuration = Date.now() - state.pausedTime;
  if (state.startTime) {
    state.startTime += pausedDuration;
  }

  state.isPaused = false;
  state.pausedTime = 0;
  startInterval();

  postMessage({
    type: 'RESUMED',
    timeLeft: state.timeLeft,
    timestamp: Date.now()
  });
};

/**
 * Stop the timer
 */
const stopTimer = (): void => {
  state.isRunning = false;
  state.isPaused = false;
  state.timeLeft = 0;
  state.startTime = null;
  state.pausedTime = 0;
  
  stopInterval();

  postMessage({
    type: 'STOPPED',
    timestamp: Date.now()
  });
};

/**
 * Reset the timer to initial state
 */
const resetTimer = (): void => {
  stopTimer();
  
  state = {
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    duration: 0,
    interval: 100,
    startTime: null,
    pausedTime: 0
  };
};

/**
 * Set the timer to a specific time (useful for phase transitions)
 */
const setTime = (time: number): void => {
  if (time < 0) {
    postError('INVALID_TIME_VALUE', `Time must be non-negative, got: ${time}`);
    return;
  }

  state.timeLeft = time;
  
  // Update duration if timer is not running
  if (!state.isRunning) {
    state.duration = time;
  }

  // Send immediate tick
  postMessage({
    type: 'TICK',
    timeLeft: state.timeLeft,
    timestamp: Date.now()
  });
};

/**
 * Start the interval for timer updates
 */
const startInterval = (): void => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    if (!state.isRunning || state.isPaused || !state.startTime) {
      return;
    }

    // Calculate elapsed time
    const elapsed = Date.now() - state.startTime;
    const newTimeLeft = Math.max(0, state.duration - Math.floor(elapsed / 1000));

    state.timeLeft = newTimeLeft;

    // Send tick update
    postMessage({
      type: 'TICK',
      timeLeft: newTimeLeft,
      timestamp: Date.now()
    });

    // Check if timer finished
    if (newTimeLeft <= 0) {
      state.isRunning = false;
      state.isPaused = false;
      stopInterval();

      postMessage({
        type: 'FINISHED',
        timestamp: Date.now()
      });
    }
  }, state.interval);
};

/**
 * Stop the interval
 */
const stopInterval = (): void => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

/**
 * Handle messages from the main thread
 */
self.onmessage = (event: MessageEvent<TimerWorkerInputMessage>) => {
  const message = event.data;

  try {
    switch (message.type) {
      case 'START':
        startTimer(message.duration, message.interval);
        break;

      case 'PAUSE':
        pauseTimer();
        break;

      case 'RESUME':
        resumeTimer();
        break;

      case 'STOP':
        stopTimer();
        break;

      case 'RESET':
        resetTimer();
        break;

      case 'SET_TIME':
        setTime(message.time);
        break;

      default:
        postError('WORKER_INITIALIZATION_FAILED', `Unknown message type: ${(message as any).type}`);
    }
  } catch (error) {
    postError('WORKER_INITIALIZATION_FAILED', `Worker error: ${error}`);
  }
};

/**
 * Worker initialization
 */
self.onmessageerror = () => {
  postError('WORKER_INITIALIZATION_FAILED', 'Message error occurred');
};

// Signal that worker is ready
postMessage({
  type: 'STARTED',
  duration: 0,
  timestamp: Date.now()
});

export {}; // Ensure this file is treated as a module 