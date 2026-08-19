import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Lightbulb, Bookmark, BookmarkCheck, Edit3, Award, Sparkles } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto w-full">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white border border-slate-900">
            Solution & Derivation
          </span>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            Problem #{question.id}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-300">
            Level: {question.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id={`btn-bookmark-sol-${question.id}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
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
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-slate-900" />
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Smartboard Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 md:p-8">
        
        {/* Top Quick Status Ribbon */}
        <div
          className={`p-3.5 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3 border ${
            !isAnswered
              ? 'bg-slate-50 text-slate-800 border-slate-200'
              : isCorrect
              ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
              : 'bg-rose-50 text-rose-950 border-rose-200'
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
              <div className="font-bold text-sm md:text-base">
                {!isAnswered
                  ? 'Solution Slide Review'
                  : isCorrect
                  ? 'Correct Answer! +4 Marks'
                  : `Incorrect (Your choice: Option ${selectedOption})`}
              </div>
              <div className="text-xs opacity-90 mt-0.5 flex items-center">
                <span>Correct Option:</span>
                <span className="font-bold ml-1.5 px-2 py-0.5 rounded bg-white/80 border border-current text-xs">
                  Option {question.correctOption}
                </span>
                {correctOptionObject?.text && (
                  <span className="ml-2 font-medium">
                    = <MathRenderer text={correctOptionObject.text} />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-lg border border-slate-900 text-xs shadow-xs">
            <span className="text-slate-300 font-medium">Final Answer:</span>
            <span className="font-bold font-mono text-white text-sm">
              <MathRenderer text={question.finalAnswer} />
            </span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Question Recall & Core Formula (5 Cols on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Question Card */}
            <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                Question Statement
              </div>
              <div className="text-slate-900 font-medium text-base leading-relaxed">
                <MathRenderer text={question.question} />
              </div>
            </div>

            {/* Core Formula Used (Sleek dark theme) */}
            {question.formulaUsed && (
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm">
                <div className="flex items-center text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Key Physics Formula / Concept
                </div>
                <div className="text-white font-bold text-base md:text-lg py-0.5">
                  <MathRenderer text={question.formulaUsed} />
                </div>
              </div>
            )}

            {/* CBSE Examiner Pro-Tip */}
            {question.tips && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start space-x-2.5">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    CBSE Tip / Shortcut
                  </div>
                  <div className="text-xs md:text-sm text-amber-900 font-medium leading-relaxed">
                    <MathRenderer text={question.tips} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Step-by-Step Mathematical Derivation (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
                  Step-by-Step Derivation & Calculation
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">
                  {question.solutionSteps.length} Steps
                </span>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-2.5">
                {question.solutionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="text-slate-900 font-medium text-sm md:text-base leading-relaxed pt-0.5">
                      <MathRenderer text={step} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action / Next Question Trigger */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Auto-advancing in <span className="font-bold text-slate-900 font-mono text-sm">{timeLeft}s</span>
              </div>

              <button
                id="btn-next-question"
                onClick={onProceedToNext}
                className="flex items-center px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-black active:scale-95 text-white shadow-sm transition-all cursor-pointer"
              >
                <span>{isLastQuestion ? 'Complete Practice & View Report' : 'Proceed to Next Question'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SolutionCard;

