/**
 * Timer Service Singleton
 * Survives React StrictMode component remounting and provides a single timer instance
 */

import { TimerService } from './TimerService';
import type { TimerEventType, TimerEventCallback } from './TimerService';

class TimerServiceSingleton {
  private static instance: TimerServiceSingleton | null = null;
  private timerService: TimerService | null = null;
  private isInitialized = false;
  private eventListeners: Map<string, Set<TimerEventCallback>> = new Map();

  private constructor() {
    console.log('🏗️ TimerServiceSingleton constructor called');
  }

  public static getInstance(): TimerServiceSingleton {
    if (!TimerServiceSingleton.instance) {
      console.log('🚀 Creating new TimerServiceSingleton instance');
      TimerServiceSingleton.instance = new TimerServiceSingleton();
    }
    return TimerServiceSingleton.instance;
  }

  public getTimerService(): TimerService | null {
    this.ensureInitialized();
    return this.timerService;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.isInitialized || this.timerService) {
      console.log('⚠️ TimerService already initialized, skipping...');
      return;
    }

    console.log('🚀 Initializing TimerService in singleton...');
    this.timerService = new TimerService();
    this.isInitialized = true;

    // Re-apply all registered event listeners
    this.eventListeners.forEach((callbacks, eventType) => {
      callbacks.forEach(callback => {
        this.timerService!.addEventListener(eventType as TimerEventType, callback);
      });
    });
  }

  public addEventListener(eventType: TimerEventType, callback: TimerEventCallback): void {
    // Store the listener for future timer service instances
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(callback);

    // Ensure service is initialized before adding listeners
    this.ensureInitialized();

    // Apply to current timer service
    if (this.timerService) {
      this.timerService.addEventListener(eventType, callback);
    }
  }

  public removeEventListener(eventType: TimerEventType, callback: TimerEventCallback): void {
    const callbacks = this.eventListeners.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }

    if (this.timerService) {
      this.timerService.removeEventListener(eventType, callback);
    }
  }

  public isReady(): boolean {
    this.ensureInitialized();
    return this.isInitialized && this.timerService?.isReady() === true;
  }

  public start(duration: number): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.start(duration);
    }
  }

  public pause(): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.pause();
    }
  }

  public resume(): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.resume();
    }
  }

  public stop(): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.stop();
    }
  }

  public reset(): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.reset();
    }
  }

  public setTime(time: number): void {
    this.ensureInitialized();
    if (this.timerService) {
      this.timerService.setTime(time);
    }
  }

  public removeAllEventListeners(): void {
    console.log('🧹 Removing all event listeners from singleton...');
    this.eventListeners.clear();
    if (this.timerService) {
      this.timerService.removeAllEventListeners();
    }
  }

  // Only terminate when the app actually closes
  public terminate(): void {
    console.log('🧹 Terminating TimerService singleton...');
    if (this.timerService) {
      this.timerService.terminate();
      this.timerService = null;
    }
    this.isInitialized = false;
    this.eventListeners.clear();
    TimerServiceSingleton.instance = null;
  }
}

// Export the singleton instance
export const timerServiceSingleton = TimerServiceSingleton.getInstance(); 