import React from 'react';
import { WORKOUT_TEMPLATES } from '@/types';
import type { WorkoutProfile } from '@/types';

interface QuickTemplatesProps {
  onSelectTemplate: (profile: WorkoutProfile) => void;
  className?: string;
}

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({
  onSelectTemplate,
  className = ''
}) => {
  const createProfileFromTemplate = (template: typeof WORKOUT_TEMPLATES[0]): WorkoutProfile => {
    return {
      id: `template-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: template.name,
      repetitions: template.config.repetitions,
      hangTimes: template.config.hangTimes,
      pauseTimes: template.config.pauseTimes,
      startPause: template.config.startPause,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: template.description,
      difficulty: template.difficulty
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Anfänger';
      case 'intermediate': return 'Fortgeschritten';
      case 'advanced': return 'Experte';
      default: return difficulty;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚫';
    }
  };

  return (
    <div className={`card ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Schnell-Vorlagen
      </h2>

      <div className="space-y-4">
        {WORKOUT_TEMPLATES.map((template, index) => {
          const hangTime = Array.isArray(template.config.hangTimes) 
            ? template.config.hangTimes[0] 
            : template.config.hangTimes;
          const pauseTime = Array.isArray(template.config.pauseTimes) 
            ? template.config.pauseTimes[0] 
            : template.config.pauseTimes;

          return (
            <button
              key={`template-${index}`}
              onClick={() => onSelectTemplate(createProfileFromTemplate(template))}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {template.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                  {getDifficultyIcon(template.difficulty)} {getDifficultyLabel(template.difficulty)}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  📊 {template.config.repetitions} Sets
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  ⏱️ {hangTime}s Hang
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  😮‍💨 {pauseTime}s Pause
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  ⏰ ~{Math.ceil((template.config.startPause + (hangTime + pauseTime) * template.config.repetitions) / 60)} Min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-start space-x-3">
          <span className="text-lg">💡</span>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Tipps zur Auswahl:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Anfänger:</strong> Kürzere Hang-Zeiten, mehr Erholung</li>
              <li><strong>Fortgeschritten:</strong> Längere Hangs, moderate Pausen</li>
              <li><strong>Experte:</strong> Maximale Intensität und Dauer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTemplates; 