import React from 'react';

interface ProgressIndicatorProps {
  currentRep: number;
  totalReps: number;
  progress: number; // 0-100
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentRep,
  totalReps,
  progress,
  className = ''
}) => {
  return (
    <div className={`w-full mobile-spacing ${className}`}>
      {/* Rep Counter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-2 space-y-1 sm:space-y-0">
        <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 text-center sm:text-left">
          Training Fortschritt
        </span>
        <span className="text-base sm:text-sm font-semibold text-blue-600 dark:text-blue-400 text-center sm:text-right">
          Wiederholung {currentRep} von {totalReps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 sm:h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        >
          {/* Shimmer effect for active progress */}
          {progress > 0 && progress < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator; 