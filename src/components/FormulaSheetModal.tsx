import React, { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { physicsFormulaSheets } from '../data/questions';
import MathRenderer from './MathRenderer';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filteredSheets = physicsFormulaSheets.map((sheet) => {
    if (activeTab !== 'ALL' && sheet.chapter !== activeTab) {
      return { ...sheet, formulas: [] };
    }
    if (!search.trim()) return sheet;

    const query = search.toLowerCase();
    const matchingFormulas = sheet.formulas.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.latex.toLowerCase().includes(query)
    );
    return { ...sheet, formulas: matchingFormulas };
  }).filter((sheet) => sheet.formulas.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Class XI CBSE Physics Formula Handbook</h3>
              <p className="text-xs text-slate-500">Units & Dimensions, Kinematics 1D, Differentiation & Integration</p>
            </div>
          </div>

          <button
            id="btn-close-formulas"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          {/* Chapter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Chapters
            </button>
            {physicsFormulaSheets.map((s) => (
              <button
                key={s.chapter}
                onClick={() => setActiveTab(s.chapter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === s.chapter
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.chapter}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search formula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {filteredSheets.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No formulas found for this search.
            </div>
          ) : (
            filteredSheets.map((sheet) => (
              <div key={sheet.chapter} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-base mb-4 flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2"></span>
                  {sheet.chapter}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sheet.formulas.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          {item.name}
                        </div>
                        <div className="text-indigo-900 font-semibold text-base py-1">
                          <MathRenderer text={`$${item.latex}$`} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200/60 leading-normal">
                        <MathRenderer text={item.description} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaSheetModal;
