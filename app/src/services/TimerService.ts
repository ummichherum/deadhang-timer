/**
 * Timer Service
 * Manages the timer Web Worker and provides a clean interface for React components
 */

import type { 
  TimerWorkerInputMessage, 
  TimerWorkerOutputMessage,
  TimerWorkerConfig,
  TimerWorkerInfo,
  TimerWorkerLifecycleEvent
} from '@/types/worker';

export type TimerEventType = 'tick' | 'finished' | 'started' | 'paused' | 'resumed' | 'stopped' | 'error';

export interface TimerEventData {
  type: TimerEventType;
  timeLeft?: number;
  duration?: number;
  error?: string;
  timestamp: number;
}

export type TimerEventCallback = (data: TimerEventData) => void;

export class TimerService {
  private worker: Worker | null = null;
  private listeners: Map<TimerEventType, Set<TimerEventCallback>> = new Map();
  private workerInfo: TimerWorkerInfo;
  private isInitialized = false;

  constructor(config?: Partial<TimerWorkerConfig>) {
    this.workerInfo = {
      id: `timer-worker-${Date.now()}`,
      created: Date.now(),
      status: 'initializing',
      config: {
        interval: config?.interval || 100,
        precision: config?.precision || 1000
      }
    };

    this.initializeWorker();
  }

  /**
   * Initialize the Web Worker
   */
  private initializeWorker(): void {
    try {
      // Create worker from the timer worker module
      this.worker = new Worker(
        new URL('../workers/timerWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.worker.onmessageerror = this.handleWorkerMessageError.bind(this);

      this.workerInfo.status = 'ready';
      this.isInitialized = true;
      this.emit('WORKER_READY');
    } catch (error) {
      this.workerInfo.status = 'error';
      this.emit('WORKER_ERROR');
      console.error('Failed to initialize Timer Worker:', error);
    }
  }

  /**
   * Handle messages from the worker
   */
  private handleWorkerMessage(event: MessageEvent<TimerWorkerOutputMessage>): void {
    const message = event.data;

    switch (message.type) {
      case 'TICK':
        this.emitTimerEvent({
          type: 'tick',
          timeLeft: message.timeLeft,
          timestamp: message.timestamp
        });
        break;

      case 'FINISHED':
        this.emitTimerEvent({
          type: 'finished',
          timestamp: message.timestamp
        });
        break;

      case 'STARTED':
        this.emitTimerEvent({
          type: 'started',
          duration: message.duration,
          timestamp: message.timestamp
        });
        break;

      case 'PAUSED':
        this.emitTimerEvent({
          type: 'paused',
          timeLeft: message.timeLeft,
          timestamp: message.timestamp
        });
        break;

      case 'RESUMED':
        this.emitTimerEvent({
          type: 'resumed',
          timeLeft: message.timeLeft,
          timestamp: message.timestamp
        });
        break;

      case 'STOPPED':
        this.emitTimerEvent({
          type: 'stopped',
          timestamp: message.timestamp
        });
        break;

      case 'ERROR':
        this.emitTimerEvent({
          type: 'error',
          error: message.error,
          timestamp: message.timestamp
        });
        break;
    }
  }

  /**
   * Handle worker errors
   */
  private handleWorkerError(error: ErrorEvent): void {
    this.workerInfo.status = 'error';
    this.emitTimerEvent({
      type: 'error',
      error: `Worker error: ${error.message}`,
      timestamp: Date.now()
    });
  }

  /**
   * Handle worker message errors
   */
  private handleWorkerMessageError(): void {
    this.emitTimerEvent({
      type: 'error',
      error: 'Worker message error occurred',
      timestamp: Date.now()
    });
  }

  /**
   * Send a message to the worker
   */
  private sendToWorker(message: TimerWorkerInputMessage): void {
    if (!this.worker || !this.isInitialized) {
      throw new Error('Timer worker is not initialized');
    }

    this.worker.postMessage(message);
  }

  /**
   * Emit a timer event to all listeners
   */
  private emitTimerEvent(data: TimerEventData): void {
    const listeners = this.listeners.get(data.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in timer event listener for ${data.type}:`, error);
        }
      });
    }
  }

  /**
   * Emit lifecycle events
   */
  private emit(event: TimerWorkerLifecycleEvent): void {
    // For now, just log lifecycle events
    console.log(`Timer Worker Lifecycle: ${event}`);
  }

  /**
   * Start the timer with the given duration
   */
  public start(duration: number): void {
    this.sendToWorker({
      type: 'START',
      duration,
      interval: this.workerInfo.config.interval
    });
  }

  /**
   * Pause the timer
   */
  public pause(): void {
    this.sendToWorker({ type: 'PAUSE' });
  }

  /**
   * Resume the timer
   */
  public resume(): void {
    this.sendToWorker({ type: 'RESUME' });
  }

  /**
   * Stop the timer
   */
  public stop(): void {
    this.sendToWorker({ type: 'STOP' });
  }

  /**
   * Reset the timer
   */
  public reset(): void {
    this.sendToWorker({ type: 'RESET' });
  }

  /**
   * Set the timer to a specific time
   */
  public setTime(time: number): void {
    this.sendToWorker({ type: 'SET_TIME', time });
  }

  /**
   * Add an event listener
   */
  public addEventListener(eventType: TimerEventType, callback: TimerEventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  /**
   * Remove an event listener
   */
  public removeEventListener(eventType: TimerEventType, callback: TimerEventCallback): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Remove all event listeners
   */
  public removeAllEventListeners(): void {
    this.listeners.clear();
  }

  /**
   * Get worker information
   */
  public getWorkerInfo(): TimerWorkerInfo {
    return { ...this.workerInfo };
  }

  /**
   * Check if the service is ready
   */
  public isReady(): boolean {
    return this.isInitialized && this.workerInfo.status === 'ready';
  }

  /**
   * Terminate the worker and cleanup
   */
  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.removeAllEventListeners();
    this.workerInfo.status = 'terminated';
    this.isInitialized = false;
    this.emit('WORKER_TERMINATED');
  }
} 