import React from 'react';
import type { TimerPhase } from '@/types';
import { formatTime } from '@/utils';

interface TimerDisplayProps {
  timeLeft: number;
  currentPhase: TimerPhase;
  isRunning: boolean;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  currentPhase,
  isRunning,
  className = ''
}) => {
  const phaseDisplayNames = {
    start: 'Bereit zum Start',
    hang: 'Hängen',
    rest: 'Pause',
    finished: 'Fertig'
  };

  return (
    <div className={`timer-container text-center ${className}`}>
      {/* Phase Indicator */}
      <div className={`timer-phase no-select ${isRunning ? 'animate-pulse' : ''}`}>
        {phaseDisplayNames[currentPhase]}
      </div>

      {/* Time Display */}
      <div className={`timer-display no-select ${isRunning ? 'text-blue-600 dark:text-blue-400' : ''} transition-colors duration-300`}>
        {formatTime(timeLeft)}
      </div>

      {/* Visual pulse effect for running state */}
      {isRunning && (
        <div className="relative mt-4 sm:mt-6">
          <div className="absolute inset-0 mx-auto w-3 h-3 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-3 h-3 sm:w-2 sm:h-2 bg-blue-500 rounded-full mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay; 