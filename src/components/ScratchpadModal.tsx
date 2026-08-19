import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Undo, Eraser, Pen, Calculator, Copy, Check } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose, questionId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [brushColor, setBrushColor] = useState<string>('#0f172a');
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');
  const [textNotes, setTextNotes] = useState<string>('');
  const [copiedConst, setCopiedConst] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 2.5;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const calculate = () => {
    try {
      // Safe sanitized arithmetic evaluator
      const sanitized = calcInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/pi/gi, 'Math.PI');

      // Only allow mathematical symbols, numbers, and Math.*
      if (!/^[0-9+\-*/().\s,Math.sqrtcosinPIe]+$/.test(sanitized)) {
        setCalcResult('Invalid expression');
        return;
      }

      // eslint-disable-next-line no-new-func
      const res = Function(`"use strict"; return (${sanitized})`)();
      setCalcResult(Number(res).toFixed(4).replace(/\.?0+$/, ''));
    } catch {
      setCalcResult('Error');
    }
  };

  const constants = [
    { name: 'g (Standard)', val: '9.8' },
    { name: 'g (Approx)', val: '10' },
    { name: 'π', val: '3.1416' },
    { name: 'G (Gravity)', val: '6.67e-11' },
    { name: 'h (Planck)', val: '6.63e-34' },
  ];

  const copyConst = (val: string, name: string) => {
    setCalcInput((prev) => prev + val);
    setCopiedConst(name);
    setTimeout(() => setCopiedConst(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              Q{questionId}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Scratchpad & Calculator</h3>
              <p className="text-xs text-slate-500">Solve numerical steps, draw diagrams & calculate</p>
            </div>
          </div>

          <button
            id="btn-close-scratchpad"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Canvas Drawing Area (7 cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Drawing Toolbar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setTool('pen')}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all cursor-pointer ${
                    tool === 'pen'
                      ? 'bg-slate-900 text-white border-slate-950'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Pen className="w-3.5 h-3.5" />
                  <span>Pen</span>
                </button>

                <button
                  onClick={() => setTool('eraser')}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all cursor-pointer ${
                    tool === 'eraser'
                      ? 'bg-slate-900 text-white border-slate-950'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>

                {/* Color swatches */}
                {tool === 'pen' && (
                  <div className="flex items-center space-x-1 ml-2">
                    {['#0f172a', '#2563eb', '#e11d48', '#059669'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBrushColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${
                          brushColor === c ? 'scale-125 border-slate-900' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={clearCanvas}
                className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>

            {/* Drawing Canvas */}
            <div className="relative w-full h-72 md:h-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner flex-1">
              <canvas
                ref={canvasRef}
                width={520}
                height={320}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none"
              />
            </div>
          </div>

          {/* Right Calculator & Notes (4 cols) */}
          <div className="lg:col-span-4 p-4 flex flex-col justify-between space-y-4 bg-slate-50">
            {/* Quick Calculator */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Quick Math Helper
              </div>

              <div className="space-y-2">
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. 20*0.2 + 400/(2*5)"
                    value={calcInput}
                    onChange={(e) => setCalcInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculate()}
                    className="w-full text-xs font-mono px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 focus:bg-white"
                  />
                  <button
                    onClick={calculate}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black cursor-pointer"
                  >
                    =
                  </button>
                </div>

                {calcResult && (
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-right font-mono font-bold text-sm text-slate-900">
                    {calcResult}
                  </div>
                )}
              </div>

              {/* Physical Constants Palette */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Insert Physics Constants</span>
                <div className="flex flex-wrap gap-1">
                  {constants.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => copyConst(c.val, c.name)}
                      className="text-[11px] font-mono px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-md border border-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedConst === c.name ? <Check className="w-3 h-3 text-emerald-600" /> : `${c.name}: ${c.val}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Typed Notes */}
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Quick Typed Scratchpad
              </label>
              <textarea
                placeholder="Type temporary calculations, given variables, or formulas..."
                value={textNotes}
                onChange={(e) => setTextNotes(e.target.value)}
                className="w-full flex-1 min-h-[100px] text-xs p-3 font-mono bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchpadModal;
