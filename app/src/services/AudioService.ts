/**
 * Audio Service Implementation
 * Provides audio feedback for timer events using Web Audio API with HTMLAudioElement fallback
 */

import type {
  AudioServiceInterface,
  AudioSettings,
  AudioEventType,
  AudioFile,
  AudioContextState,
  AudioError
} from '@/types/audio';

import {
  DEFAULT_AUDIO_SETTINGS,
  AUDIO_FILES
} from '@/types/audio';

export class AudioService implements AudioServiceInterface {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private htmlAudioElements: Map<string, HTMLAudioElement> = new Map();
  private settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
  private contextState: AudioContextState = {
    isInitialized: false,
    state: 'suspended',
    hasUserInteraction: false
  };
  private useWebAudio = true;
  private loadingPromises: Map<string, Promise<void>> = new Map();
  private useFallbackTones = false;

  constructor() {
    console.log('🎵 Initializing AudioService...');
    this.detectWebAudioSupport();
  }

  /**
   * Detect if Web Audio API is supported, fallback to HTML Audio
   */
  private detectWebAudioSupport(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('🎵 Web Audio API not supported, using HTML Audio fallback');
        this.useWebAudio = false;
      }
    } catch (error) {
      console.warn('🎵 Web Audio API detection failed, using HTML Audio fallback');
      this.useWebAudio = false;
    }
  }

  /**
   * Initialize the audio system
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🎵 Starting audio initialization...');
      
      if (this.useWebAudio) {
        await this.initializeWebAudio();
      } else {
        await this.initializeHtmlAudio();
      }

      this.contextState.isInitialized = true;
      console.log(`🎵 Audio initialized successfully (${this.useWebAudio ? 'Web Audio' : 'HTML Audio'})`);
    } catch (error) {
      console.warn('🎵 Audio file loading failed, using programmatic fallback tones');
      this.useFallbackTones = true;
      this.contextState.isInitialized = true;
      
      // Initialize Web Audio for programmatic sounds
      if (!this.audioContext && this.useWebAudio) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      }
    }
  }

  /**
   * Initialize Web Audio API
   */
  private async initializeWebAudio(): Promise<void> {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    
    this.contextState.state = this.audioContext.state;
    
    // Handle state changes
    this.audioContext.addEventListener('statechange', () => {
      if (this.audioContext) {
        this.contextState.state = this.audioContext.state;
        console.log(`🎵 Audio context state changed to: ${this.contextState.state}`);
      }
    });

    // Try to load audio files, fallback to programmatic sounds if failed
    try {
      await this.loadAudioFiles();
    } catch (error) {
      console.warn('🎵 Failed to load audio files, will use programmatic sounds');
      this.useFallbackTones = true;
    }
  }

  /**
   * Initialize HTML Audio elements as fallback
   */
  private async initializeHtmlAudio(): Promise<void> {
    for (const audioFile of AUDIO_FILES) {
      const audio = new HTMLAudioElement();
      audio.preload = 'auto';
      audio.src = audioFile.src;
      audio.volume = (audioFile.volume * this.settings.masterVolume) / 100;
      
      // Handle loading
      const loadPromise = new Promise<void>((resolve, _reject) => {
        const timeout = setTimeout(() => {
          console.warn(`🎵 Timeout loading ${audioFile.displayName}, will use fallback`);
          resolve(); // Resolve even on timeout to prevent hanging
        }, 3000);

        audio.addEventListener('canplaythrough', () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
        
        audio.addEventListener('error', () => {
          clearTimeout(timeout);
          console.warn(`🎵 Error loading ${audioFile.displayName}, will use fallback`);
          resolve(); // Resolve on error to prevent hanging
        }, { once: true });
      });

      this.htmlAudioElements.set(audioFile.id, audio);
      this.loadingPromises.set(audioFile.id, loadPromise);
    }

    // Wait for all files to load (or timeout)
    await Promise.all(Array.from(this.loadingPromises.values()));
    console.log('🎵 HTML audio initialization completed');
  }

  /**
   * Load audio files for Web Audio API
   */
  private async loadAudioFiles(): Promise<void> {
    const loadPromises = AUDIO_FILES.map(async (audioFile) => {
      try {
        const response = await fetch(audioFile.src);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        
        this.audioBuffers.set(audioFile.id, audioBuffer);
        console.log(`🎵 Loaded audio file: ${audioFile.displayName}`);
      } catch (error) {
        console.warn(`🎵 Failed to load ${audioFile.displayName}:`, error);
        
        // Try fallback format if available
        if (audioFile.fallbackSrc) {
          try {
            const response = await fetch(audioFile.fallbackSrc);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
            this.audioBuffers.set(audioFile.id, audioBuffer);
            console.log(`🎵 Loaded fallback audio file: ${audioFile.displayName}`);
          } catch (fallbackError) {
            console.warn(`🎵 Failed to load fallback for ${audioFile.displayName}:`, fallbackError);
          }
        }
      }
    });

    await Promise.all(loadPromises);
    
    // Check if we have any loaded buffers
    if (this.audioBuffers.size === 0) {
      throw new Error('No audio files could be loaded');
    }
  }

  /**
   * Generate programmatic sound using Web Audio API
   */
  private async playProgrammaticSound(eventType: AudioEventType): Promise<void> {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    // Sound configurations for different event types
    const soundConfigs = {
      start: { frequency: 800, duration: 0.5, type: 'sine' as OscillatorType },
      end: { frequency: 600, duration: 1.0, type: 'sine' as OscillatorType },
      phase_change: { frequency: 1000, duration: 0.3, type: 'square' as OscillatorType },
      countdown: { frequency: 1200, duration: 0.2, type: 'triangle' as OscillatorType },
      error: { frequency: 300, duration: 0.8, type: 'sawtooth' as OscillatorType },
      notification: { frequency: 900, duration: 0.4, type: 'sine' as OscillatorType }
    };

    const config = soundConfigs[eventType];
    if (!config) return;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Configure oscillator
    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;

    // Configure volume
    const masterVolume = this.settings.masterVolume / 100;
    const eventVolume = this.settings.eventVolumes[eventType] / 100;
    const finalVolume = masterVolume * eventVolume * 0.3; // Lower volume for programmatic sounds

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);

    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + config.duration);
  }

  /**
   * Resume audio context if suspended (required for user interaction)
   */
  private async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      this.contextState.hasUserInteraction = true;
      console.log('🎵 Audio context resumed after user interaction');
    }
  }

  /**
   * Play audio for specific event
   */
  public async playEvent(eventType: AudioEventType): Promise<void> {
    if (!this.settings.enabled) {
      console.log(`🎵 Audio disabled, skipping ${eventType} event`);
      return;
    }

    if (!this.contextState.isInitialized) {
      console.warn(`🎵 Audio not initialized, cannot play ${eventType} event`);
      return;
    }

    // Check if this event type is enabled
    if (!this.isEventEnabled(eventType)) {
      console.log(`🎵 Event type ${eventType} disabled, skipping`);
      return;
    }

    try {
      // Use programmatic sounds if no audio files available
      if (this.useFallbackTones && this.useWebAudio && this.audioContext) {
        await this.playProgrammaticSound(eventType);
        console.log(`🎵 Played programmatic sound for event: ${eventType}`);
        return;
      }

      const audioFile = AUDIO_FILES.find(file => file.eventType === eventType);
      if (!audioFile) {
        console.warn(`🎵 No audio file found for event: ${eventType}`);
        return;
      }

      if (this.useWebAudio && this.audioContext) {
        await this.playWithWebAudio(audioFile);
      } else {
        await this.playWithHtmlAudio(audioFile);
      }

      console.log(`🎵 Played audio for event: ${eventType}`);
    } catch (error) {
      const audioError: AudioError = {
        type: 'playback',
        message: `Failed to play ${eventType}: ${error}`,
        eventType,
        timestamp: new Date()
      };
      console.error('🎵 Audio playback error:', audioError);
    }
  }

  /**
   * Play audio using Web Audio API
   */
  private async playWithWebAudio(audioFile: AudioFile): Promise<void> {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    const audioBuffer = this.audioBuffers.get(audioFile.id);
    if (!audioBuffer) {
      console.warn(`🎵 Audio buffer not found for: ${audioFile.id}, using programmatic sound`);
      await this.playProgrammaticSound(audioFile.eventType);
      return;
    }

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    const masterVolume = this.settings.masterVolume / 100;
    const eventVolume = this.settings.eventVolumes[audioFile.eventType] / 100;
    const fileVolume = audioFile.volume;
    
    gainNode.gain.value = masterVolume * eventVolume * fileVolume;

    // Create source node
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = audioFile.loop;

    // Connect nodes
    sourceNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play
    sourceNode.start(0);
  }

  /**
   * Play audio using HTML Audio Element
   */
  private async playWithHtmlAudio(audioFile: AudioFile): Promise<void> {
    const audio = this.htmlAudioElements.get(audioFile.id);
    if (!audio || audio.error) {
      console.warn(`🎵 HTML audio element not available for: ${audioFile.id}`);
      // Fallback to programmatic sound if available
      if (this.audioContext) {
        await this.playProgrammaticSound(audioFile.eventType);
      }
      return;
    }

    // Update volume
    const masterVolume = this.settings.masterVolume / 100;
    const eventVolume = this.settings.eventVolumes[audioFile.eventType] / 100;
    const fileVolume = audioFile.volume;
    
    audio.volume = masterVolume * eventVolume * fileVolume;
    
    // Reset to beginning and play
    audio.currentTime = 0;
    
    try {
      await audio.play();
    } catch (error) {
      console.warn(`🎵 Failed to play HTML audio for ${audioFile.id}:`, error);
      // Fallback to programmatic sound if available
      if (this.audioContext) {
        await this.playProgrammaticSound(audioFile.eventType);
      }
    }
  }

  /**
   * Check if event type is enabled in settings
   */
  private isEventEnabled(eventType: AudioEventType): boolean {
    switch (eventType) {
      case 'start':
      case 'end':
        return this.settings.enableStartEnd;
      case 'phase_change':
        return this.settings.enablePhaseTransitions;
      case 'countdown':
        return this.settings.enableCountdown;
      default:
        return true;
    }
  }

  /**
   * Set master volume
   */
  public setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(100, volume));
    console.log(`🎵 Master volume set to: ${this.settings.masterVolume}%`);
    
    // Update HTML audio elements
    if (!this.useWebAudio) {
      this.updateHtmlAudioVolumes();
    }
  }

  /**
   * Set volume for specific event type
   */
  public setEventVolume(eventType: AudioEventType, volume: number): void {
    this.settings.eventVolumes[eventType] = Math.max(0, Math.min(100, volume));
    console.log(`🎵 ${eventType} volume set to: ${this.settings.eventVolumes[eventType]}%`);
    
    if (!this.useWebAudio) {
      this.updateHtmlAudioVolumes();
    }
  }

  /**
   * Update volumes for all HTML audio elements
   */
  private updateHtmlAudioVolumes(): void {
    for (const audioFile of AUDIO_FILES) {
      const audio = this.htmlAudioElements.get(audioFile.id);
      if (audio) {
        const masterVolume = this.settings.masterVolume / 100;
        const eventVolume = this.settings.eventVolumes[audioFile.eventType] / 100;
        const fileVolume = audioFile.volume;
        
        audio.volume = masterVolume * eventVolume * fileVolume;
      }
    }
  }

  /**
   * Enable/disable audio globally
   */
  public setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    console.log(`🎵 Audio ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current audio settings
   */
  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * Update audio settings
   */
  public updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('🎵 Audio settings updated:', newSettings);
    
    if (!this.useWebAudio && (newSettings.masterVolume || newSettings.eventVolumes)) {
      this.updateHtmlAudioVolumes();
    }
  }

  /**
   * Check if audio context is ready
   */
  public isReady(): boolean {
    return this.contextState.isInitialized && 
           (this.useWebAudio ? this.audioContext?.state === 'running' : true);
  }

  /**
   * Get audio context state
   */
  public getContextState(): AudioContextState {
    return { ...this.contextState };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    console.log('🎵 Destroying AudioService...');
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Clean up HTML audio elements
    for (const audio of this.htmlAudioElements.values()) {
      audio.pause();
      audio.src = '';
    }

    this.audioBuffers.clear();
    this.htmlAudioElements.clear();
    this.loadingPromises.clear();
    
    this.contextState.isInitialized = false;
    console.log('🎵 AudioService destroyed');
  }
} 