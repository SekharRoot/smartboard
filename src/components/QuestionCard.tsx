import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Lightbulb, Edit3, CheckCircle2 } from 'lucide-react';
import { Question } from '../types';
import MathRenderer from './MathRenderer';

interface QuestionCardProps {
  question: Question;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenScratchpad: () => void;
  onSubmitAndShowSolution: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  onOpenScratchpad,
  onSubmitAndShowSolution,
}) => {
  const [showHint, setShowHint] = useState(false);

  const getChapterColor = (chapter: string) => {
    switch (chapter) {
      case 'Units & Dimensions':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Motion in a Straight Line':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Simple Derivatives':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Simple Integration':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getChapterColor(question.chapter)}`}>
            {question.chapter}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id={`btn-bookmark-${question.id}`}
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
            id="btn-open-scratchpad"
            onClick={onOpenScratchpad}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        {/* Question Header & Body */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-100">
              Q{question.id}
            </span>
            <div className="text-lg md:text-xl font-medium text-slate-900 leading-relaxed pt-0.5">
              <MathRenderer text={question.question} />
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-6">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.label;
            return (
              <button
                key={opt.label}
                id={`option-${question.id}-${opt.label}`}
                onClick={() => onSelectOption(opt.label)}
                className={`flex items-center p-4 rounded-xl text-left border-2 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold mr-3.5 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {opt.label}
                </span>
                <div className="text-slate-800 font-medium text-base">
                  <MathRenderer text={opt.text} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint Section */}
        {question.formulaUsed && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {!showHint ? (
              <button
                id="btn-show-hint"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Need a hint? (Show formula clue)
              </button>
            ) : (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-900 animate-fadeIn">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Formula Clue: </span>
                  <MathRenderer text={question.formulaUsed} />
                  {question.tips && <p className="mt-1 text-amber-800">{question.tips}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {selectedOption ? (
              <span className="text-indigo-600 font-semibold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Option {selectedOption} chosen (Ready to submit)
              </span>
            ) : (
              <span>Select an option or wait for the 2-minute timer to auto-transition.</span>
            )}
          </div>

          <button
            id="btn-submit-solution"
            onClick={onSubmitAndShowSolution}
            className="flex items-center px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm transition-all"
          >
            Submit & View Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
