import React from 'react';
import { Play, Pause, Plus, SkipForward, Volume2, VolumeX, Eye, HelpCircle, Zap } from 'lucide-react';
import { ViewMode } from '../types';

interface TimerBarProps {
  viewMode: ViewMode;
  timeLeft: number;
  totalDuration: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onAdd30Secs: () => void;
  onAdvance: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  difficulty?: 'Very Easy' | 'Easy' | 'Medium-Easy' | 'Moderate';
}

export const TimerBar: React.FC<TimerBarProps> = ({
  viewMode,
  timeLeft,
  totalDuration,
  isPaused,
  onTogglePause,
  onAdd30Secs,
  onAdvance,
  soundEnabled,
  onToggleSound,
  currentQuestionIndex,
  totalQuestions,
  difficulty = 'Easy',
}) => {
  const isRapid = currentQuestionIndex < 30;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  const isQuestionMode = viewMode === 'question';
  const isUrgent = isRapid
    ? (isQuestionMode ? timeLeft <= 7 : timeLeft <= 4)
    : (isQuestionMode ? timeLeft <= 15 : timeLeft <= 5);

  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'Very Easy':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Easy':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Medium-Easy':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Moderate':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Question Counter & Mode Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-sm border border-slate-200">
            <span className="text-slate-500 mr-1.5 font-normal">Q</span>
            <span className="font-bold text-indigo-600 text-base">{currentQuestionIndex + 1}</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-600">{totalQuestions}</span>
          </div>

          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
              isQuestionMode
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isQuestionMode ? (
              <>
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                {isRapid ? '30s Rapid Question' : '2m Question'}
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1" />
                {isRapid ? '15s Solution Review' : '30s Solution Review'}
              </>
            )}
          </div>

          {/* Rapid indicator / Difficulty badge */}
          <div className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge()}`}>
            {isRapid && <Zap className="w-3 h-3 mr-1 text-teal-600 fill-teal-500" />}
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Center: Timer Display */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center font-mono text-xl md:text-2xl font-bold px-4 py-1 rounded-xl transition-all ${
              isUrgent
                ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                : isQuestionMode
                ? isRapid ? 'bg-indigo-50 text-indigo-900 border border-indigo-100' : 'bg-slate-100 text-slate-800'
                : 'bg-emerald-100/70 text-emerald-800'
            }`}
          >
            <span>{formattedTime}</span>
            {isPaused && (
              <span className="ml-2 text-xs font-sans font-medium uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                Paused
              </span>
            )}
          </div>

          {/* Quick Timer Controls */}
          <button
            id="btn-timer-pause"
            onClick={onTogglePause}
            title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 active:scale-95 transition-all"
          >
            {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
          </button>

          <button
            id="btn-timer-add30"
            onClick={onAdd30Secs}
            title="Add 30 seconds"
            className="flex items-center text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-0.5" />
            30s
          </button>
        </div>

        {/* Right: Sound & Next Slide Actions */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            id="btn-advance-slide"
            onClick={onAdvance}
            className={`flex items-center font-medium text-sm px-3.5 py-1.5 rounded-lg shadow-xs active:scale-95 transition-all ${
              isQuestionMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>{isQuestionMode ? 'View Solution' : 'Next Problem'}</span>
            <SkipForward className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isUrgent
              ? 'bg-rose-500'
              : isQuestionMode
              ? isRapid ? 'bg-teal-500' : 'bg-indigo-600'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default TimerBar;

