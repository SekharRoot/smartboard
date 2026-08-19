import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Lightbulb, Bookmark, BookmarkCheck, Edit3 } from 'lucide-react';
import { Question } from '../types';
import MathRenderer from './MathRenderer';

interface SolutionCardProps {
  question: Question;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenScratchpad: () => void;
  onProceedToNext: () => void;
  isLastQuestion: boolean;
  timeLeft: number;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  question,
  selectedOption,
  isBookmarked,
  onToggleBookmark,
  onOpenScratchpad,
  onProceedToNext,
  isLastQuestion,
  timeLeft,
}) => {
  const isAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === question.correctOption;

  const correctOptionObject = question.options.find((o) => o.label === question.correctOption);

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            Solution & Derivation
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Question #{question.id}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id={`btn-bookmark-sol-${question.id}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isBookmarked
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Bookmark</span>
              </>
            )}
          </button>

          <button
            id="btn-open-scratchpad-sol"
            onClick={onOpenScratchpad}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Main Solution Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        {/* Answer Feedback Banner */}
        <div
          className={`p-4 rounded-xl mb-6 flex items-center justify-between border ${
            !isAnswered
              ? 'bg-slate-50 text-slate-700 border-slate-200'
              : isCorrect
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            {!isAnswered ? (
              <HelpCircle className="w-6 h-6 text-slate-500 flex-shrink-0" />
            ) : isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-base">
                {!isAnswered
                  ? 'Time Up / Solution Review'
                  : isCorrect
                  ? 'Correct Answer! Well done!'
                  : `Incorrect (You selected Option ${selectedOption})`}
              </h3>
              <p className="text-xs opacity-90 mt-0.5">
                Correct Choice: <strong className="font-bold">Option {question.correctOption}</strong> (
                {correctOptionObject?.text && <MathRenderer text={correctOptionObject.text} />})
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-500 block font-medium">Final Answer</span>
            <span className="font-mono font-bold text-slate-800 text-sm">
              <MathRenderer text={question.finalAnswer} />
            </span>
          </div>
        </div>

        {/* Question Recall */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70 mb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Question #{question.id}
          </div>
          <div className="text-slate-800 font-medium text-sm md:text-base">
            <MathRenderer text={question.question} />
          </div>
        </div>

        {/* Core Formula Box */}
        {question.formulaUsed && (
          <div className="mb-6 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              Key Physics Formula Used
            </div>
            <div className="text-indigo-950 font-semibold text-base py-1">
              <MathRenderer text={question.formulaUsed} />
            </div>
          </div>
        )}

        {/* Step-by-Step Derivation & Solution */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
            Step-by-Step Derivation & Solution
          </h4>
          <div className="space-y-3">
            {question.solutionSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-slate-800 text-sm md:text-base leading-relaxed pt-0.5">
                  <MathRenderer text={step} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip / CBSE Tip */}
        {question.tips && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-0.5">
                CBSE Examiner Tip / Shortcut
              </div>
              <div className="text-xs md:text-sm text-amber-900 font-medium">
                <MathRenderer text={question.tips} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Control */}
        <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Advancing to next question in <span className="font-bold text-emerald-700 font-mono text-sm">{timeLeft}s</span> (or click below)
          </div>

          <button
            id="btn-next-question"
            onClick={onProceedToNext}
            className="flex items-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition-all"
          >
            <span>{isLastQuestion ? 'Complete Practice & View Report' : 'Proceed to Next Question'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
