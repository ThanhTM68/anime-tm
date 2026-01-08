
import React from 'react';
import { Check, X, Filter, Sparkles } from 'lucide-react';

export const GENRE_MAP = [
  { id: 1, name: 'Action', label: 'Hành động' },
  { id: 2, name: 'Adventure', label: 'Phiêu lưu' },
  { id: 4, name: 'Comedy', label: 'Hài hước' },
  { id: 8, name: 'Drama', label: 'Kịch tính' },
  { id: 10, name: 'Fantasy', label: 'Kỳ ảo' },
  { id: 7, name: 'Mystery', label: 'Bí ẩn' },
  { id: 22, name: 'Romance', label: 'Lãng mạn' },
  { id: 24, name: 'Sci-Fi', label: 'Viễn tưởng' },
  { id: 36, name: 'Slice of Life', label: 'Đời thường' },
  { id: 37, name: 'Supernatural', label: 'Siêu nhiên' },
  { id: 41, name: 'Suspense', label: 'Gây cấn' },
  { id: 30, name: 'Sports', label: 'Thể thao' },
  { id: 14, name: 'Horror', label: 'Kinh dị' },
  { id: 40, name: 'Psychological', label: 'Tâm lý' },
  { id: 62, name: 'Isekai', label: 'Trùng sinh' }
];

interface GenresMegamenuProps {
  selectedGenreIds: number[];
  onToggleGenre: (genreId: number) => void;
  onClear: () => void;
}

const GenresMegamenu: React.FC<GenresMegamenuProps> = ({ selectedGenreIds, onToggleGenre, onClear }) => {
  return (
    <div className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 pt-3 z-[150] animate-in fade-in slide-in-from-top-1 duration-200 cubic-bezier(0.16, 1, 0.3, 1) cursor-default">
      {/* 
        Minimizing the bridge to prevent "sticky" hover.
        The height is just enough to bridge the tiny gap between button and menu.
      */}
      <div className="absolute -top-1 inset-x-0 h-2 bg-transparent" />
      
      {/* Connector Arrow - more precise positioning */}
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-slate-900/95" />
      
      <div className="bg-[#0f172a]/95 backdrop-blur-[40px] rounded-[1.2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 min-w-[280px] md:min-w-[500px] overflow-hidden relative group/menu">
        {/* Ambient neon flares */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-pink-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-600/10 flex items-center justify-center border border-pink-500/20">
              <Filter size={14} className="text-pink-500" />
            </div>
            <div className="flex flex-col">
                <h3 className="font-anime text-[8.5px] font-black tracking-[0.2em] text-white uppercase leading-none">Filters</h3>
                <span className="text-[5.5px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic">Matrix Hub</span>
            </div>
          </div>
          
          {selectedGenreIds.length > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="flex items-center gap-1.5 text-[6.5px] font-black text-pink-500 hover:text-white transition-all duration-300 uppercase tracking-widest bg-pink-500/5 hover:bg-pink-600 px-2 py-1 rounded-md border border-pink-500/10 active:scale-95 group/clear"
            >
              <X size={9} className="group-hover/clear:rotate-90 transition-transform" /> CLEAR ({selectedGenreIds.length})
            </button>
          )}
        </div>

        {/* 4-column grid optimized for even smaller footprint */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 relative z-10">
          {GENRE_MAP.map((genre) => {
            const isActive = selectedGenreIds.includes(genre.id);
            return (
              <button 
                key={genre.id} 
                onClick={(e) => { e.stopPropagation(); onToggleGenre(genre.id); }}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[7px] font-black transition-all duration-200 group/btn border active:scale-95 ${
                  isActive 
                    ? 'bg-pink-600 border-pink-500 text-white shadow-[0_3px_8px_rgba(236,72,153,0.3)] z-20' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:border-pink-500/30 hover:bg-pink-600/10 hover:text-white'
                }`}
              >
                <span className="uppercase tracking-widest">{genre.label}</span>
                {isActive && <Check size={9} className="animate-in zoom-in duration-200" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between relative z-10 opacity-20 group-hover/menu:opacity-60 transition-opacity">
          <p className="text-[5.5px] text-slate-600 font-black uppercase tracking-[0.3em]">
             Status: <span className="text-pink-500">Syncing...</span>
          </p>
          <span className="text-[5px] text-slate-800 font-black uppercase tracking-widest italic">V3.0.1</span>
        </div>
      </div>
    </div>
  );
};

export default GenresMegamenu;
