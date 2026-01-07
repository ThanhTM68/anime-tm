
import React, { useRef, useState, useEffect } from 'react';
import { Star, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';

interface Props {
  animeList: Anime[];
  onSelect: (anime: Anime) => void;
}

const TrendingSection: React.FC<Props> = ({ animeList, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => container?.removeEventListener('scroll', checkScroll);
  }, [animeList]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 px-4 md:px-12 bg-[#020617] relative group/section">
      <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-start">
          <h2 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
            <span className="text-pink-500">#</span> XU HƯỚNG HIỆN TẠI
          </h2>
          <div className="h-1 w-20 bg-pink-600 rounded-full mt-2" />
        </div>
      </div>

      <div className="relative max-w-[100vw] overflow-visible">
        <div className={`absolute left-4 md:left-12 top-[40%] -translate-y-1/2 z-40 transition-all duration-500 ${showLeftArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-pink-600 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className={`absolute right-4 md:right-12 top-[40%] -translate-y-1/2 z-40 transition-all duration-500 ${showRightArrow ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-pink-600 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-12 no-scrollbar scroll-smooth"
        >
          {animeList.map((anime) => (
            <div key={anime.id} className="flex-none w-48 md:w-56">
              <AnimeCard anime={anime} onClick={onSelect} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
