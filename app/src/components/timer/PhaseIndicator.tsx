import React from 'react';
import type { TimerPhase } from '@/types';

interface PhaseIndicatorProps {
  currentPhase: TimerPhase;
  phases: TimerPhase[]; // Will be ignored, we use fixed phases
  status: 'idle' | 'running' | 'paused' | 'finished';
  currentRep: number;
  totalReps: number;
  className?: string;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  currentPhase,
  status,
  currentRep: _currentRep, // Not used in current simplified implementation
  totalReps,
  className = ''
}) => {
  // Fixed 4 phases that are always displayed
  const fixedPhases = ['start', 'hang', 'rest', 'end'] as const;
  
  const phaseIcons = {
    start: '🏁',
    hang: '🧗‍♂️',
    rest: '😮‍💨',
    end: '🎉'
  };

  const phaseNames = {
    start: 'Start',
    hang: 'Hängen',
    rest: 'Pause',
    end: 'Ende'
  };

  const getPhaseState = (phase: typeof fixedPhases[number]) => {
    switch (phase) {
      case 'start':
        return {
          isActive: currentPhase === 'start' && status !== 'finished',
          isCompleted: currentPhase !== 'start' && status !== 'finished'
        };
      
      case 'hang':
        return {
          isActive: currentPhase === 'hang' && status !== 'finished',
          isCompleted: false // Hang cycles through multiple times, so no "completed" state
        };
      
      case 'rest':
        return {
          isActive: currentPhase === 'rest' && status !== 'finished',
          isCompleted: false // Rest cycles through multiple times, so no "completed" state
        };
      
      case 'end':
        return {
          isActive: status === 'finished',
          isCompleted: false
        };
      
      default:
        return { isActive: false, isCompleted: false };
    }
  };

  const renderConnector = (fromPhase: string, toPhase: string) => {
    // Special rotation symbol between hang and rest
    if (fromPhase === 'hang' && toPhase === 'rest') {
      return (
        <div className="flex items-center justify-center mx-0.5 sm:mx-1">
          <div className="flex flex-col items-center min-w-[30px] max-w-[45px]">
            <span className="text-sm sm:text-base text-blue-500 dark:text-blue-400 animate-spin-slow">
              ↻
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {totalReps > 1 ? `${totalReps}×` : ''}
            </span>
          </div>
        </div>
      );
    }
    
    // Regular connecting line
    return (
      <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1 max-w-3 sm:max-w-6">
      </div>
    );
  };

  return (
    <div className={`phase-timeline-container ${className}`}>
      <div className="phase-timeline-track">
        {fixedPhases.map((phase, index) => {
          const { isActive, isCompleted } = getPhaseState(phase);
          
          return (
            <React.Fragment key={`${phase}-${index}`}>
              {/* Phase Item */}
              <div className={`
                phase-timeline-item transition-all duration-300 no-select
                ${isActive ? 'scale-105 sm:scale-110' : isCompleted ? 'opacity-70' : 'opacity-40'}
              `}>
                {/* Phase Icon */}
                <div className={`
                  phase-timeline-icon
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/30' 
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  <span className={isActive ? 'animate-pulse' : ''}>
                    {phaseIcons[phase]}
                  </span>
                </div>
                
                {/* Phase Name */}
                <span className={`
                  phase-timeline-label
                  ${isActive 
                    ? 'text-gray-900 dark:text-gray-100 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {phaseNames[phase]}
                </span>
              </div>

              {/* Connector (except after last phase) */}
              {index < fixedPhases.length - 1 && renderConnector(phase, fixedPhases[index + 1])}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseIndicator; 