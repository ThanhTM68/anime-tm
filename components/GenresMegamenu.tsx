
import React from 'react';
import { Check, X, Filter } from 'lucide-react';

const GENRE_GROUPS = [
  { label: 'Phổ biến', items: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance'] },
  { label: 'Cảm xúc & Kinh dị', items: ['Horror', 'Mystery', 'Psychological', 'Suspense', 'Thriller', 'Slice of Life'] },
  { label: 'Chủ đề khác', items: ['Sci-Fi', 'Sports', 'Supernatural', 'Ecchi', 'Harem', 'Isekai'] }
];

interface GenresMegamenuProps {
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
  onClear: () => void;
}

const GenresMegamenu: React.FC<GenresMegamenuProps> = ({ selectedGenres, onToggleGenre, onClear }) => {
  return (
    <div className="absolute top-full left-[-150px] md:left-[-200px] pt-4 z-[150] animate-in fade-in slide-in-from-top-2 duration-300 cursor-default">
      {/* Pointer */}
      <div className="absolute top-[8px] left-[195px] md:left-[245px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-slate-900/90" />
      
      <div className="bg-[#0d1117]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 min-w-[320px] md:min-w-[650px]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-pink-500" />
            <h3 className="font-anime text-sm font-black tracking-[0.2em] text-white uppercase">Bộ Lọc Thể Loại</h3>
          </div>
          {selectedGenres.length > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="flex items-center gap-2 text-[9px] font-black text-pink-500 hover:text-white transition-colors uppercase tracking-widest bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20"
            >
              <X size={12} /> Xóa tất cả ({selectedGenres.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {GENRE_GROUPS.map((group) => (
            <div key={group.label} className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{group.label}</h4>
              <div className="flex flex-col gap-2">
                {group.items.map((genre) => {
                  const isActive = selectedGenres.includes(genre);
                  return (
                    <button 
                      key={genre} 
                      onClick={(e) => { e.stopPropagation(); onToggleGenre(genre); }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group/btn ${
                        isActive 
                          ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.3)]' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{genre}</span>
                      {isActive ? (
                        <Check size={14} className="animate-in zoom-in duration-200" />
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-slate-700 group-hover/btn:bg-pink-500 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">
            Hệ thống sẽ lọc kết quả theo <span className="text-pink-500/50">"Giao điểm"</span> (Phim chứa tất cả thể loại chọn)
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenresMegamenu;
