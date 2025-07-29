import React, { useState } from 'react'
import { TimerProvider, useTimerState, useTimerActions, useTimerComputed } from '@/contexts'
import { TimerDisplay, PhaseIndicator, ProgressIndicator, TimerControls } from '@/components/timer'
import { WorkoutConfigForm, QuickTemplates } from '@/components/setup'
import { WORKOUT_TEMPLATES } from '@/types'
import type { TimerPhase, WorkoutProfile } from '@/types'

type AppMode = 'setup' | 'timer';

const TimerDemo: React.FC = () => {
  const state = useTimerState();
  const { startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer } = useTimerActions();
  const { progress } = useTimerComputed();

  const [appMode, setAppMode] = useState<AppMode>('setup');
  const [configView, setConfigView] = useState<'templates' | 'custom'>('templates');

  // Handle workout start from either templates or custom config
  const handleStartWorkout = (profile: WorkoutProfile) => {
    startTimer(profile);
    setAppMode('timer');
  };

  // Handle returning to setup
  const handleBackToSetup = () => {
    if (state.status !== 'idle') {
      stopTimer();
    }
    setAppMode('setup');
  };

  // Handle quick template start (backward compatibility)
  const handleQuickStart = () => {
    const beginnerTemplate = WORKOUT_TEMPLATES[0];
    const profile: WorkoutProfile = {
      id: 'quick-start',
      name: beginnerTemplate.name,
      repetitions: beginnerTemplate.config.repetitions,
      hangTimes: beginnerTemplate.config.hangTimes,
      pauseTimes: beginnerTemplate.config.pauseTimes,
      startPause: beginnerTemplate.config.startPause,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: beginnerTemplate.description,
      difficulty: beginnerTemplate.difficulty
    };
    handleStartWorkout(profile);
  };

  // Fixed phases for simplified phase indicator
  const getWorkoutPhases = (): TimerPhase[] => {
    // Always show the same 3 phases: Start → Hang → Rest
    // The repetitions are handled by cycling through Hang and Rest phases
    // End phase will be handled separately in PhaseIndicator
    return ['start', 'hang', 'rest']
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="safe-area">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {appMode === 'timer' && (
                <button
                  onClick={handleBackToSetup}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Zurück zur Konfiguration"
                >
                  <span className="text-lg">←</span>
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Deadhang Timer
              </h1>
            </div>
            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Theme umschalten"
            >
              <span className="text-lg">
                {document.documentElement.classList.contains('dark') ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          {appMode === 'setup' ? (
            /* Setup Phase */
            <>
              {/* Configuration Toggle */}
              <div className="card">
                <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-6">
                  <button
                    onClick={() => setConfigView('templates')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      configView === 'templates'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    📋 Vorlagen
                  </button>
                  <button
                    onClick={() => setConfigView('custom')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      configView === 'custom'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    ⚙️ Benutzerdefiniert
                  </button>
                </div>

                {/* Quick Start Button */}
                <div className="mb-4">
                  <button
                    onClick={handleQuickStart}
                    className="btn-primary w-full"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>⚡</span>
                      <span>Schnellstart (Anfänger)</span>
                    </span>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    3x 10s Hang, 60s Pause - Perfekt zum Testen
                  </p>
                </div>
              </div>

              {/* Configuration Content */}
              {configView === 'templates' ? (
                <QuickTemplates onSelectTemplate={handleStartWorkout} />
              ) : (
                <WorkoutConfigForm onStartWorkout={handleStartWorkout} />
              )}


            </>
          ) : (
            /* Timer Phase */
            <>
              {/* Timer Display Card */}
              <div className="card">
                <TimerDisplay
                  timeLeft={state.timeLeft}
                  currentPhase={state.currentPhase}
                  isRunning={state.status === 'running'}
                  className="mb-6"
                />

                {/* Phase Flow Indicator */}
                {state.workoutProfile && (
                  <PhaseIndicator
                    currentPhase={state.currentPhase}
                    phases={getWorkoutPhases()}
                    status={state.status}
                    currentRep={state.currentRep}
                    totalReps={state.totalReps}
                    className="mb-6"
                  />
                )}

                {/* Progress Indicator */}
                {state.workoutProfile && (
                  <ProgressIndicator
                    currentRep={state.currentRep}
                    totalReps={state.workoutProfile.repetitions}
                    progress={progress}
                    className="mb-6"
                  />
                )}

                {/* Timer Controls */}
                <TimerControls
                  status={state.status}
                  onStart={handleQuickStart}
                  onPause={pauseTimer}
                  onResume={resumeTimer}
                  onStop={stopTimer}
                  onReset={resetTimer}
                />
              </div>

              {/* Debug Info - Development only */}
              {import.meta.env.DEV && state.workoutProfile && (
                <div className="debug-panel card">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Debug Info (Dev Mode):</h4>
                  <div className="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                    <div>Status: <span className="text-blue-600 dark:text-blue-400">{state.status}</span></div>
                    <div>Phase: <span className="text-blue-600 dark:text-blue-400">{state.currentPhase}</span></div>
                    <div>Profile: <span className="text-blue-600 dark:text-blue-400">{state.workoutProfile.name}</span></div>
                    <div>Progress: <span className="text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span></div>
                    <div>Rep: <span className="text-blue-600 dark:text-blue-400">{state.currentRep}/{state.workoutProfile.repetitions}</span></div>
                    <div>Time Left: <span className="text-blue-600 dark:text-blue-400">{state.timeLeft}s</span></div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <TimerProvider>
      <TimerDemo />
    </TimerProvider>
  )
}

export default App
