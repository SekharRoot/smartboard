import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Lightbulb, Edit3, CheckCircle2, Send } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto w-full">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getChapterColor(question.chapter)}`}>
            {question.chapter}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {question.topic}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            Level: {question.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id={`btn-bookmark-${question.id}`}
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
            id="btn-open-scratchpad"
            onClick={onOpenScratchpad}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Smartboard Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Large Question Display (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8">
            <div>
              {/* Question Badge & Title */}
              <div className="flex items-center space-x-2.5 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  {question.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Physics Numerical Problem
                </span>
              </div>

              {/* High Visibility Large Question Statement for Smartboards */}
              <div className="text-xl md:text-2xl lg:text-[1.65rem] font-semibold text-slate-900 leading-relaxed tracking-normal">
                <MathRenderer text={question.question} />
              </div>
            </div>

            {/* Formula Hint / Clue Accordion */}
            {question.formulaUsed && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                {!showHint ? (
                  <button
                    id="btn-show-hint"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-500 fill-amber-400" />
                    Reveal Formula Clue & Concept Hint
                  </button>
                ) : (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 animate-fadeIn">
                    <div className="flex items-center font-bold text-amber-900 mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400 mr-1.5" />
                      Formula Clue:
                    </div>
                    <div className="font-semibold text-sm text-slate-900 py-0.5">
                      <MathRenderer text={question.formulaUsed} />
                    </div>
                    {question.tips && <p className="mt-1 text-xs text-amber-800">{question.tips}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Options & Submission (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Select Correct Option</span>
                <span className="text-[11px] font-normal text-slate-400">Single Correct (A/B/C/D)</span>
              </div>

              {/* 4 Large Option Buttons Stacked Vertically */}
              <div className="space-y-3">
                {question.options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      id={`option-${question.id}-${opt.label}`}
                      onClick={() => onSelectOption(opt.label)}
                      className={`w-full flex items-center p-3.5 md:p-4 rounded-xl text-left border-2 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-200 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black mr-3.5 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <div className="text-slate-900 font-semibold text-base md:text-lg flex-1">
                        <MathRenderer text={opt.text} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection Status & Submit Action */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="mb-3 text-xs">
                {selectedOption ? (
                  <span className="text-indigo-700 font-bold flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" />
                    Option {selectedOption} chosen — ready to submit
                  </span>
                ) : (
                  <span className="text-slate-500 italic block">
                    Choose an option above to test yourself
                  </span>
                )}
              </div>

              <button
                id="btn-submit-solution"
                onClick={onSubmitAndShowSolution}
                className="w-full flex items-center justify-center px-5 py-3 rounded-xl font-bold text-sm md:text-base bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-sm transition-all"
              >
                <span>Submit & View Solution</span>
                <Send className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

