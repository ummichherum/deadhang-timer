import React, { useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { TimerStatus } from '@/types';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
  className?: string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  disabled = false,
  className = ''
}) => {
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const handleStopClick = () => {
    // Show confirmation dialog for running or paused timer
    if (status === 'running' || status === 'paused') {
      setShowStopConfirm(true);
    } else {
      onStop();
    }
  };

  const handleStopConfirm = () => {
    setShowStopConfirm(false);
    onStop();
  };

  const handleStopCancel = () => {
    setShowStopConfirm(false);
  };

  const getControlButtons = () => {
    switch (status) {
      case 'idle':
        return (
          <button
            onClick={onStart}
            disabled={disabled}
            className="btn-primary w-full py-4 text-lg font-semibold touch-manipulation"
          >
            <span className="flex items-center justify-center space-x-3">
              <span className="text-2xl">▶️</span>
              <span>Start Training</span>
            </span>
          </button>
        );

      case 'running':
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onPause}
              disabled={disabled}
              className="btn-secondary py-4 text-base font-semibold touch-manipulation"
            >
              <span className="flex items-center justify-center space-x-2">
                <span className="text-xl">⏸️</span>
                <span>Pause</span>
              </span>
            </button>
            <button
              onClick={handleStopClick}
              disabled={disabled}
              className="btn-danger py-4 text-base font-semibold touch-manipulation"
            >
              <span className="flex items-center justify-center space-x-2">
                <span className="text-xl">⏹️</span>
                <span>Stop</span>
              </span>
            </button>
          </div>
        );

      case 'paused':
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onResume}
              disabled={disabled}
              className="btn-primary py-4 text-base font-semibold touch-manipulation"
            >
              <span className="flex items-center justify-center space-x-2">
                <span className="text-xl">▶️</span>
                <span>Fortsetzen</span>
              </span>
            </button>
            <button
              onClick={handleStopClick}
              disabled={disabled}
              className="btn-danger py-4 text-base font-semibold touch-manipulation"
            >
              <span className="flex items-center justify-center space-x-2">
                <span className="text-xl">⏹️</span>
                <span>Stop</span>
              </span>
            </button>
          </div>
        );

      case 'finished':
        return (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-100 dark:bg-green-900 rounded-2xl">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-green-800 dark:text-green-200 font-bold text-lg">
                Training abgeschlossen!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                Großartige Leistung!
              </p>
            </div>
            <button
              onClick={onReset}
              disabled={disabled}
              className="btn-primary w-full py-4 text-lg font-semibold touch-manipulation"
            >
              <span className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🔄</span>
                <span>Neues Training</span>
              </span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`timer-controls w-full ${className}`}>
        {getControlButtons()}
      </div>

      {/* Stop Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showStopConfirm}
        title="Training beenden?"
        message="Das aktuelle Training wird beendet und der Fortschritt geht verloren. Möchten Sie wirklich stoppen?"
        confirmText="Ja, beenden"
        cancelText="Abbrechen"
        onConfirm={handleStopConfirm}
        onCancel={handleStopCancel}
        variant="warning"
      />
    </>
  );
};

export default TimerControls; 