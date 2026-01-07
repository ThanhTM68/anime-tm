
import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, X, Loader2 } from 'lucide-react';
import { Anime } from '../src/types';

interface HeroProps {
  onSearch: (query: string) => void;
  searchResults: Anime[];
  isSearching: boolean;
  onSelect: (anime: Anime) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, searchResults, isSearching, onSelect }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);

    if (query.trim().length >= 2) {
      debounceTimerRef.current = window.setTimeout(() => {
        onSearch(query);
        setShowDropdown(true);
      }, 400);
    } else {
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setShowDropdown(false);
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/70 to-[#020617] z-10" />
        <img 
          src="https://4kwallpapers.com/images/walls/thumbs_3t/25003.jpg" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-[pulse_20s_ease-in-out_infinite]"
          alt="Anime Background"
        />
      </div>

      <div className="relative z-20 text-center max-w-4xl w-full">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="text-pink-500 fill-pink-500 animate-pulse" size={18} />
          <span className="text-pink-500 font-bold tracking-[0.5em] text-[10px] uppercase">Neural Hub Online</span>
        </div>
        
        <h1 className="font-anime text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-slate-400 drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] uppercase">
          ANIME TM
        </h1>
        
        <div className="relative group max-w-lg mx-auto" ref={dropdownRef}>
          {/* Main Input Box - Styled to match screenshot input feel */}
          <div className="relative flex items-center bg-[#0d1117] rounded-lg border border-white/5 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-white/20">
            <div className="pl-5 pr-3 text-slate-500">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Nhập tên anime..."
              className="bg-transparent border-none outline-none text-white w-full py-4 text-base font-medium placeholder:text-slate-600 focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
            />
            {isSearching && (
              <div className="mr-3">
                <Loader2 className="animate-spin text-pink-500" size={18} />
              </div>
            )}
            {query && (
              <button onClick={handleClear} className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
                <X size={18} className="text-slate-600" />
              </button>
            )}
          </div>

          {/* Floating Dropdown - MATCHES SCREENSHOT EXACTLY */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-0.5 bg-[#1a2329] rounded-b-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-[110] animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map((anime) => (
                    <div 
                      key={anime.id}
                      onClick={() => {
                        onSelect(anime);
                        setShowDropdown(false);
                      }}
                      className="flex items-start gap-3 p-2.5 hover:bg-[#252f35] border-b border-white/[0.02] cursor-pointer transition-colors group/item"
                    >
                      {/* Thumbnail Box */}
                      <div className="w-[50px] h-[72px] bg-black shrink-0 rounded-sm overflow-hidden border border-white/5">
                        <img 
                          src={anime.image} 
                          className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity" 
                          alt="" 
                        />
                      </div>
                      
                      {/* Text Details */}
                      <div className="flex flex-col text-left justify-start pt-0.5">
                        <h4 className="text-[#a5b4bc] font-bold text-[13px] leading-tight line-clamp-2 group-hover/item:text-white transition-colors">
                          {anime.title}
                        </h4>
                        <span className="text-[#64748b] text-[10px] font-bold mt-1.5 uppercase tracking-wider">
                          Full VietSub
                        </span>
                      </div>
                    </div>
                  ))
                ) : !isSearching && (
                  <div className="p-12 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                    No dimensional signals found
                  </div>
                )}
              </div>

              {/* Action Button - Red style from screenshot */}
              <button 
                onClick={() => onSearch(query)}
                className="w-full bg-[#ff4b40] hover:bg-[#e03a30] text-white py-4 font-black text-sm tracking-[0.2em] transition-colors uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.99]"
              >
                Enter để tìm kiếm
              </button>
            </div>
          )}
        </div>
        
        <p className="text-slate-500 mt-14 text-sm font-bold tracking-[0.4em] uppercase">
          Synchronized with <span className="text-pink-500/80">MyAnimeList</span> Network
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;