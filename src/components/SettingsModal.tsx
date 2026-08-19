import React from 'react';
import { X, Sliders, Clock, Volume2, RotateCcw } from 'lucide-react';
import { ExamSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ExamSettings;
  onUpdateSettings: (newSettings: ExamSettings) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Practice & Timer Settings</h3>
              <p className="text-xs text-slate-500">Customize intervals, flow and audio</p>
            </div>
          </div>

          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Question Timer Duration */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Question Slide Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '1 min', sec: 60 },
                { label: '2 mins (Default)', sec: 120 },
                { label: '3 mins', sec: 180 },
                { label: '5 mins', sec: 300 },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  onClick={() => onUpdateSettings({ ...settings, questionDurationSec: opt.sec })}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    settings.questionDurationSec === opt.sec
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Timer Duration */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Solution Review Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '15 sec', sec: 15 },
                { label: '30 sec (Default)', sec: 30 },
                { label: '45 sec', sec: 45 },
                { label: '60 sec', sec: 60 },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  onClick={() => onUpdateSettings({ ...settings, solutionDurationSec: opt.sec })}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    settings.solutionDurationSec === opt.sec
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Advance Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-800 text-sm block">Auto-Advance on Timer Expiry</span>
              <span className="text-xs text-slate-500 block">
                Automatically slide to solution after 2m, and to next question after 30s
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, autoAdvance: !settings.autoAdvance })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoAdvance ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoAdvance ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Notification Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-800 text-sm block">Sound & Audio Alerts</span>
              <span className="text-xs text-slate-500 block">Subtle bell chime when switching slides</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset All Progress */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-rose-700 text-sm block">Reset Session Progress</span>
              <span className="text-xs text-slate-500 block">Clear all answered questions and start afresh</span>
            </div>
            <button
              id="btn-reset-session"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all answers and progress?')) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
