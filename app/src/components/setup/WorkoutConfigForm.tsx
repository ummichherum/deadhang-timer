import React, { useState } from 'react';
import type { WorkoutProfile } from '@/types';

interface WorkoutConfigFormProps {
  onStartWorkout: (profile: WorkoutProfile) => void;
  className?: string;
}

interface ConfigState {
  name: string;
  repetitions: number;
  hangTime: number;
  pauseTime: number;
  startPause: number;
}

interface ErrorState {
  name?: string;
  repetitions?: string;
  hangTime?: string;
  pauseTime?: string;
  startPause?: string;
}

export const WorkoutConfigForm: React.FC<WorkoutConfigFormProps> = ({
  onStartWorkout,
  className = ''
}) => {
  const [config, setConfig] = useState<ConfigState>({
    name: 'Benutzerdefiniert',
    repetitions: 3,
    hangTime: 20,
    pauseTime: 60,
    startPause: 10
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateConfig = (config: ConfigState): ErrorState => {
    const errors: ErrorState = {};

    if (!config.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }

    if (config.repetitions < 1 || config.repetitions > 10) {
      errors.repetitions = 'Wiederholungen: 1-10';
    }

    if (config.hangTime < 5 || config.hangTime > 300) {
      errors.hangTime = 'Hang-Zeit: 5-300 Sekunden';
    }

    if (config.pauseTime < 10 || config.pauseTime > 600) {
      errors.pauseTime = 'Pause-Zeit: 10-600 Sekunden';
    }

    if (config.startPause < 3 || config.startPause > 60) {
      errors.startPause = 'Start-Pause: 3-60 Sekunden';
    }

    return errors;
  };

  const handleInputChange = (field: keyof ConfigState, value: string | number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof ErrorState]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Create workout profile
    const profile: WorkoutProfile = {
      id: `custom-${Date.now()}`,
      name: config.name,
      repetitions: config.repetitions,
      hangTimes: config.hangTime,
      pauseTimes: config.pauseTime,
      startPause: config.startPause,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: `${config.repetitions}x ${config.hangTime}s Hang, ${config.pauseTime}s Pause`,
      difficulty: 'custom'
    };

    onStartWorkout(profile);
    setIsSubmitting(false);
  };

  const resetToDefaults = () => {
    setConfig({
      name: 'Benutzerdefiniert',
      repetitions: 3,
      hangTime: 20,
      pauseTime: 60,
      startPause: 10
    });
    setErrors({});
  };

  return (
    <div className={`card ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Training Konfigurieren
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workout Name
          </label>
          <input
            id="workout-name"
            type="text"
            value={config.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors
              ${errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-offset-2 focus:border-transparent
              placeholder-gray-500 dark:placeholder-gray-400
            `}
            placeholder="z.B. Mein Training"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Repetitions */}
        <div>
          <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wiederholungen
          </label>
          <div className="relative">
            <input
              id="repetitions"
              type="number"
              min="1"
              max="10"
              value={config.repetitions}
              onChange={(e) => handleInputChange('repetitions', parseInt(e.target.value) || 1)}
              className={`
                w-full px-4 py-3 rounded-lg border transition-colors
                ${errors.repetitions 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-offset-2 focus:border-transparent
              `}
            />
            <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
              Sets
            </span>
          </div>
          {errors.repetitions && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.repetitions}</p>
          )}
        </div>

        {/* Hang Time */}
        <div>
          <label htmlFor="hang-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hang-Zeit
          </label>
          <div className="relative">
            <input
              id="hang-time"
              type="number"
              min="5"
              max="300"
              value={config.hangTime}
              onChange={(e) => handleInputChange('hangTime', parseInt(e.target.value) || 5)}
              className={`
                w-full px-4 py-3 rounded-lg border transition-colors
                ${errors.hangTime 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-offset-2 focus:border-transparent
              `}
            />
            <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
              Sekunden
            </span>
          </div>
          {errors.hangTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hangTime}</p>
          )}
        </div>

        {/* Pause Time */}
        <div>
          <label htmlFor="pause-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pause-Zeit
          </label>
          <div className="relative">
            <input
              id="pause-time"
              type="number"
              min="10"
              max="600"
              value={config.pauseTime}
              onChange={(e) => handleInputChange('pauseTime', parseInt(e.target.value) || 10)}
              className={`
                w-full px-4 py-3 rounded-lg border transition-colors
                ${errors.pauseTime 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-offset-2 focus:border-transparent
              `}
            />
            <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
              Sekunden
            </span>
          </div>
          {errors.pauseTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pauseTime}</p>
          )}
        </div>

        {/* Start Pause */}
        <div>
          <label htmlFor="start-pause" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start-Vorbereitungszeit
          </label>
          <div className="relative">
            <input
              id="start-pause"
              type="number"
              min="3"
              max="60"
              value={config.startPause}
              onChange={(e) => handleInputChange('startPause', parseInt(e.target.value) || 3)}
              className={`
                w-full px-4 py-3 rounded-lg border transition-colors
                ${errors.startPause 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-offset-2 focus:border-transparent
              `}
            />
            <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
              Sekunden
            </span>
          </div>
          {errors.startPause && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startPause}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>{isSubmitting ? 'Startet...' : 'Training Starten'}</span>
            </span>
          </button>
          
          <button
            type="button"
            onClick={resetToDefaults}
            className="btn-secondary px-4"
            title="Auf Standardwerte zurücksetzen"
          >
            🔄
          </button>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Trainings-Vorschau:</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <div>📊 {config.repetitions} Wiederholungen</div>
            <div>⏱️ {config.hangTime}s Hängen + {config.pauseTime}s Pause pro Set</div>
            <div>🏁 {config.startPause}s Vorbereitung</div>
            <div className="font-medium">
              ⏰ Gesamtdauer: ca. {Math.ceil((config.startPause + (config.hangTime + config.pauseTime) * config.repetitions) / 60)} Minuten
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkoutConfigForm; 