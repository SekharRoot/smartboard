import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle, XCircle, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';
import { Question, UserAnswer } from '../types';

interface ExamSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  onSelectQuestion: (index: number) => void;
  onRestart: () => void;
}

export const ExamSummaryModal: React.FC<ExamSummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  userAnswers,
  onSelectQuestion,
  onRestart,
}) => {
  const total = questions.length;
  const attempted = Object.keys(userAnswers).length;
  const correct = (Object.values(userAnswers) as UserAnswer[]).filter((a) => a?.isCorrect).length;
  const incorrect = attempted - correct;
  const unattempted = total - attempted;

  const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const accuracyPercentage = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  useEffect(() => {
    if (isOpen && scorePercentage >= 50) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, scorePercentage]);

  if (!isOpen) return null;

  // Group by chapter
  const chapters = [
    'Units & Dimensions',
    'Motion in a Straight Line',
    'Simple Derivatives',
    'Simple Integration',
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Performance & Score Report</h3>
              <p className="text-xs text-slate-500">100 Numericals Practice Completion</p>
            </div>
          </div>

          <button
            id="btn-close-summary"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Overview Bento Card */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Correct</span>
              <span className="text-3xl font-bold text-emerald-700 mt-1 block">{correct}</span>
              <span className="text-[11px] text-emerald-600">out of {total}</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">Incorrect</span>
              <span className="text-3xl font-bold text-rose-700 mt-1 block">{incorrect}</span>
              <span className="text-[11px] text-rose-600">mistakes to review</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block">Accuracy</span>
              <span className="text-3xl font-bold text-indigo-700 mt-1 block">{accuracyPercentage}%</span>
              <span className="text-[11px] text-indigo-600">{attempted} attempted</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Score Rate</span>
              <span className="text-3xl font-bold text-slate-800 mt-1 block">{scorePercentage}%</span>
              <span className="text-[11px] text-slate-500">{unattempted} skipped</span>
            </div>
          </div>

          {/* Chapter-wise Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
              Chapter-Wise Mastery Breakdown
            </h4>

            <div className="space-y-3">
              {chapters.map((ch) => {
                const chapterQuestions = questions.filter((q) => q.chapter === ch);
                const chapterAttempted = chapterQuestions.filter((q) => userAnswers[q.id]);
                const chapterCorrect = chapterAttempted.filter((q) => userAnswers[q.id]?.isCorrect).length;
                const percent =
                  chapterQuestions.length > 0
                    ? Math.round((chapterCorrect / chapterQuestions.length) * 100)
                    : 0;

                return (
                  <div key={ch} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{ch}</span>
                      <span className="font-semibold text-slate-600">
                        {chapterCorrect} / {chapterQuestions.length} correct ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Review / Jump to Mistakes List */}
          {incorrect > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
                Review Mistakes ({incorrect} Questions)
              </h4>
              <div className="flex flex-wrap gap-2">
                {questions
                  .filter((q) => userAnswers[q.id] && !userAnswers[q.id].isCorrect)
                  .map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        onSelectQuestion(q.id - 1);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 flex items-center space-x-1"
                    >
                      <span>Q{q.id}: {q.topic}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Restart all 100 questions from Question 1?')) {
                onRestart();
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake 100 Numericals</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs"
          >
            Continue Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSummaryModal;
