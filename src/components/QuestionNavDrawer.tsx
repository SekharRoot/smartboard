import React, { useState } from 'react';
import { X, Search, Filter, Bookmark, CheckCircle, XCircle } from 'lucide-react';
import { Question, UserAnswer } from '../types';

interface QuestionNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  userAnswers: Record<number, UserAnswer>;
  bookmarkedIds: Set<number>;
}

export const QuestionNavDrawer: React.FC<QuestionNavDrawerProps> = ({
  isOpen,
  onClose,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  userAnswers,
  bookmarkedIds,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  const topics = [
    { label: 'All 100', value: 'ALL' },
    { label: '⚡ Rapid 30s (Q1–30)', value: 'RAPID' },
    { label: 'Units & Dim (1–25)', value: 'Units & Dimensions' },
    { label: 'Motion 1D (26–60)', value: 'Motion in a Straight Line' },
    { label: 'Derivatives (61–80)', value: 'Simple Derivatives' },
    { label: 'Integration (81–100)', value: 'Simple Integration' },
  ];

  const filteredQuestions = questions.filter((q) => {
    if (selectedTopic === 'RAPID' && q.id > 30) {
      return false;
    }
    if (selectedTopic !== 'ALL' && selectedTopic !== 'RAPID' && q.chapter !== selectedTopic) {
      return false;
    }
    if (filterBookmarkOnly && !bookmarkedIds.has(q.id)) {
      return false;
    }
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchId = q.id.toString() === qLower || `q${q.id}` === qLower;
      const matchTopic = q.topic.toLowerCase().includes(qLower);
      const matchText = q.question.toLowerCase().includes(qLower);
      if (!matchId && !matchTopic && !matchText) {
        return false;
      }
    }
    return true;
  });

  // Calculate statistics
  const attemptedCount = Object.keys(userAnswers).length;
  const correctCount = (Object.values(userAnswers) as UserAnswer[]).filter((a) => a?.isCorrect).length;
  const bookmarkedCount = bookmarkedIds.size;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Question Palette (1–100)</h3>
            <p className="text-xs text-slate-500">Jump directly to any problem</p>
          </div>
          <button
            id="btn-close-palette"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-around text-xs font-medium text-slate-700">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Correct: {correctCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <span>Attempted: {attemptedCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Bookmarked: {bookmarkedCount}</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question # or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTopic(t.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  selectedTopic === t.value
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}

            <button
              onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
              className={`flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterBookmarkOnly
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3 mr-1" />
              Bookmarked ({bookmarkedCount})
            </button>
          </div>
        </div>

        {/* 100 Question Grid */}
        <div className="p-4 flex-1 overflow-y-auto">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No questions match your current filters.
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {filteredQuestions.map((q) => {
                const isCurrent = q.id === currentQuestionIndex + 1;
                const answer = userAnswers[q.id];
                const isBookmarked = bookmarkedIds.has(q.id);

                let bgClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-900 hover:bg-slate-100';
                if (answer) {
                  if (answer.isCorrect) {
                    bgClass = 'bg-emerald-600 text-white border-emerald-700';
                  } else {
                    bgClass = 'bg-rose-500 text-white border-rose-600';
                  }
                } else if (isCurrent) {
                  bgClass = 'bg-slate-900 text-white border-slate-950 font-bold ring-2 ring-slate-900';
                }

                return (
                  <button
                    key={q.id}
                    id={`palette-q-${q.id}`}
                    onClick={() => {
                      onSelectQuestion(q.id - 1);
                      onClose();
                    }}
                    className={`relative h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all active:scale-95 cursor-pointer ${bgClass}`}
                  >
                    <span>Q{q.id}</span>
                    {isBookmarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 mr-1.5"></span> Correct
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 mr-1.5"></span> Incorrect
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 mr-1.5"></span> Current
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 mr-1.5"></span> Bookmark
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavDrawer;
