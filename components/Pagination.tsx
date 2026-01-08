
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  last: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, last, onPageChange }) => {
  if (last <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(last, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-black text-xs transition-all duration-300 ${
            current === i 
              ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)] scale-110' 
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-24 mb-10">
      <button 
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {current > 3 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10">1</button>
          <span className="text-slate-600 font-bold px-1">...</span>
        </>
      )}

      <div className="flex gap-2">
        {renderPages()}
      </div>

      {current < last - 2 && (
        <>
          <span className="text-slate-600 font-bold px-1">...</span>
          <button onClick={() => onPageChange(last)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10">{last}</button>
        </>
      )}

      <button 
        disabled={current === last}
        onClick={() => onPageChange(current + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
