import React from 'react';
import { ArrowLeft, ArrowRight, Zap, ArrowUp } from 'lucide-react';

interface VirtualPadProps {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
}

export function VirtualPad({ onKeyDown, onKeyUp }: VirtualPadProps) {
  const handleTouchStart = (key: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onKeyDown(key);
  };

  const handleTouchEnd = (key: string) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onKeyUp(key);
  };

  return (
    <div className="fixed bottom-3 inset-x-0 px-4 flex items-end justify-between pointer-events-none select-none z-40">
      {/* Direction Controls (Left / Right) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onTouchStart={handleTouchStart('ArrowLeft')}
          onTouchEnd={handleTouchEnd('ArrowLeft')}
          onMouseDown={handleTouchStart('ArrowLeft')}
          onMouseUp={handleTouchEnd('ArrowLeft')}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border-2 border-slate-700/80 active:bg-slate-700 text-slate-100 flex items-center justify-center shadow-lg active:scale-95 transition-transform backdrop-blur-sm"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <button
          onTouchStart={handleTouchStart('ArrowRight')}
          onTouchEnd={handleTouchEnd('ArrowRight')}
          onMouseDown={handleTouchStart('ArrowRight')}
          onMouseUp={handleTouchEnd('ArrowRight')}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 border-2 border-slate-700/80 active:bg-slate-700 text-slate-100 flex items-center justify-center shadow-lg active:scale-95 transition-transform backdrop-blur-sm"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Action Buttons (Shoot Z, Jump Up) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Shoot Button */}
        <button
          onTouchStart={handleTouchStart('KeyZ')}
          onTouchEnd={handleTouchEnd('KeyZ')}
          onMouseDown={handleTouchStart('KeyZ')}
          onMouseUp={handleTouchEnd('KeyZ')}
          className="w-14 h-14 rounded-full bg-rose-600/90 border-2 border-rose-400 active:bg-rose-500 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-900/50 active:scale-95 transition-transform backdrop-blur-sm"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-bold">射擊</span>
        </button>

        {/* Jump Button */}
        <button
          onTouchStart={handleTouchStart('ArrowUp')}
          onTouchEnd={handleTouchEnd('ArrowUp')}
          onMouseDown={handleTouchStart('ArrowUp')}
          onMouseUp={handleTouchEnd('ArrowUp')}
          className="w-16 h-16 rounded-full bg-sky-600/90 border-2 border-sky-400 active:bg-sky-500 text-white flex flex-col items-center justify-center shadow-lg shadow-sky-900/50 active:scale-95 transition-transform backdrop-blur-sm"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
          <span className="text-[10px] font-bold">跳躍</span>
        </button>
      </div>
    </div>
  );
}
