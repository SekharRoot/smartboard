import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Edit3,
  Sliders,
  Grid,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Question, ViewMode, UserAnswer, ExamSettings } from './types';
import { allQuestions } from './data/questions';
import { sounds } from './utils/audio';
import TimerBar from './components/TimerBar';
import QuestionCard from './components/QuestionCard';
import SolutionCard from './components/SolutionCard';
import QuestionNavDrawer from './components/QuestionNavDrawer';
import ScratchpadModal from './components/ScratchpadModal';
import FormulaSheetModal from './components/FormulaSheetModal';
import SettingsModal from './components/SettingsModal';
import ExamSummaryModal from './components/ExamSummaryModal';

const DEFAULT_SETTINGS: ExamSettings = {
  questionDurationSec: 120, // 2 minutes
  solutionDurationSec: 30, // 30 seconds
  autoAdvance: true,
  soundEnabled: true,
  instantFeedback: true,
};

export default function App() {
  const [questions] = useState<Question[]>(allQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('question');
  const [settings, setSettings] = useState<ExamSettings>(() => {
    try {
      const saved = localStorage.getItem('cbse_phys_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [timeLeft, setTimeLeft] = useState<number>(settings.questionDurationSec);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // User answers & bookmarks state
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>(() => {
    try {
      const saved = localStorage.getItem('cbse_phys_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('cbse_phys_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Modal Dialogs
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cbse_phys_settings', JSON.stringify(settings));
    } catch {
      // Storage unavailable
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('cbse_phys_answers', JSON.stringify(userAnswers));
    } catch {
      // Storage unavailable
    }
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('cbse_phys_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch {
      // Storage unavailable
    }
  }, [bookmarkedIds]);

  // Transition to Solution view
  const goToSolution = useCallback(() => {
    setViewMode('solution');
    setTimeLeft(settings.solutionDurationSec);
    if (settings.soundEnabled) {
      sounds.playTransitionChime();
    }
  }, [settings.solutionDurationSec, settings.soundEnabled]);

  // Transition to Next Question
  const goToNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setViewMode('question');
      setTimeLeft(settings.questionDurationSec);
      if (settings.soundEnabled) {
        sounds.playTransitionChime();
      }
    } else {
      setIsSummaryOpen(true);
    }
  }, [currentIndex, questions.length, settings.questionDurationSec, settings.soundEnabled]);

  // Previous Question
  const goToPrevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setViewMode('question');
      setTimeLeft(settings.questionDurationSec);
    }
  }, [currentIndex, settings.questionDurationSec]);

  // Jump to specific Question
  const jumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setViewMode('question');
      setTimeLeft(settings.questionDurationSec);
    }
  }, [questions.length, settings.questionDurationSec]);

  // Timer Tick Mechanism
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished
          if (settings.autoAdvance) {
            if (viewMode === 'question') {
              goToSolution();
            } else {
              goToNextQuestion();
            }
          }
          return 0;
        }

        // Play subtle warning beep at 5 seconds left in question mode
        if (viewMode === 'question' && prev === 6 && settings.soundEnabled) {
          sounds.playTimerWarning();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, viewMode, settings.autoAdvance, settings.soundEnabled, goToSolution, goToNextQuestion]);

  // Handle Option Pick
  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    const isCorrect = option === currentQuestion.correctOption;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption: option,
        isCorrect,
        timeSpentSeconds: settings.questionDurationSec - timeLeft,
        viewedSolution: false,
      },
    }));

    if (isCorrect && settings.soundEnabled) {
      sounds.playCorrectChime();
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Add 30 seconds to timer
  const handleAdd30Secs = () => {
    setTimeLeft((prev) => prev + 30);
  };

  // Toggle Sound
  const handleToggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Reset Session
  const handleResetProgress = () => {
    setUserAnswers({});
    setBookmarkedIds(new Set());
    setCurrentIndex(0);
    setViewMode('question');
    setTimeLeft(settings.questionDurationSec);
    setIsPaused(false);
  };

  // Calculate current score
  const attemptedCount = Object.keys(userAnswers).length;
  const correctCount = (Object.values(userAnswers) as UserAnswer[]).filter((a) => a?.isCorrect).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top App Bar (Material Clean Header) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              XI
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base md:text-lg leading-tight flex items-center">
                CBSE Class 11 Physics
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hidden sm:inline-block">
                  100 Numericals
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Units & Dimensions • Motion in 1D • Differentiation • Integration
              </p>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center space-x-2">
            {/* Score pill */}
            <button
              id="btn-open-score"
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>
                {correctCount}/{attemptedCount} Correct
              </span>
            </button>

            {/* Formula sheet button */}
            <button
              id="btn-open-formulas"
              onClick={() => setIsFormulaSheetOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Formula Handbook</span>
            </button>

            {/* Scratchpad button */}
            <button
              id="btn-header-scratchpad"
              onClick={() => setIsScratchpadOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Scratchpad</span>
            </button>

            {/* Palette grid drawer trigger */}
            <button
              id="btn-open-palette"
              onClick={() => setIsNavDrawerOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Grid className="w-4 h-4" />
              <span>100 Grid</span>
            </button>

            {/* Settings */}
            <button
              id="btn-open-settings"
              onClick={() => setIsSettingsOpen(true)}
              title="Practice Settings"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Timer & Flow Controller Bar */}
      <TimerBar
        viewMode={viewMode}
        timeLeft={timeLeft}
        totalDuration={
          viewMode === 'question'
            ? settings.questionDurationSec
            : settings.solutionDurationSec
        }
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onAdd30Secs={handleAdd30Secs}
        onAdvance={() => (viewMode === 'question' ? goToSolution() : goToNextQuestion())}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
      />

      {/* Main Practice Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-8">
        {/* Navigation Step Indicator */}
        <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
          <button
            id="btn-prev-q"
            onClick={goToPrevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Problem</span>
          </button>

          {/* Quick chapter jumper pills */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => jumpToQuestion(0)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentIndex >= 0 && currentIndex < 25
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Units (1–25)
            </button>
            <button
              onClick={() => jumpToQuestion(25)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentIndex >= 25 && currentIndex < 60
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Motion 1D (26–60)
            </button>
            <button
              onClick={() => jumpToQuestion(60)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentIndex >= 60 && currentIndex < 80
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Derivatives (61–80)
            </button>
            <button
              onClick={() => jumpToQuestion(80)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentIndex >= 80 && currentIndex < 100
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Integration (81–100)
            </button>
          </div>

          <button
            id="btn-next-q"
            onClick={goToNextQuestion}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Next Problem'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Card View: Question Slide OR Solution Slide */}
        {viewMode === 'question' ? (
          <QuestionCard
            question={currentQuestion}
            selectedOption={userAnswers[currentQuestion.id]?.selectedOption}
            onSelectOption={handleSelectOption}
            isBookmarked={bookmarkedIds.has(currentQuestion.id)}
            onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onSubmitAndShowSolution={goToSolution}
          />
        ) : (
          <SolutionCard
            question={currentQuestion}
            selectedOption={userAnswers[currentQuestion.id]?.selectedOption}
            isBookmarked={bookmarkedIds.has(currentQuestion.id)}
            onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onProceedToNext={goToNextQuestion}
            isLastQuestion={currentIndex === questions.length - 1}
            timeLeft={timeLeft}
          />
        )}
      </main>

      {/* Bottom Footer Bar */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>CBSE Class 11 Physics Syllabus Aligned</span>
            <span className="text-slate-300">•</span>
            <span>KaTeX High-Precision Math Engine</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Formula Reference
            </button>
            <button
              onClick={() => setIsScratchpadOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Scratchpad Calculator
            </button>
            <button
              onClick={() => setIsNavDrawerOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              100 Questions Palette
            </button>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
      <QuestionNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        questions={questions}
        currentQuestionIndex={currentIndex}
        onSelectQuestion={jumpToQuestion}
        userAnswers={userAnswers}
        bookmarkedIds={bookmarkedIds}
      />

      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        questionId={currentQuestion.id}
      />

      <FormulaSheetModal
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetProgress={handleResetProgress}
      />

      <ExamSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        questions={questions}
        userAnswers={userAnswers}
        onSelectQuestion={jumpToQuestion}
        onRestart={handleResetProgress}
      />
    </div>
  );
}
