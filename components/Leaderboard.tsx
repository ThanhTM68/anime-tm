
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, RefreshCw, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';
import { Anime } from '../src/types';
import { fetchLeaderboardData } from '../src/geminiService';
import AnimeCard from './AnimeCard';

interface LeaderboardProps {
  onSelect: (anime: Anime) => void;
}

type TabType = 'week' | 'season' | 'year' | 'upcoming' | 'all';

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchLeaderboardData(activeTab);
      setData(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs = [
    { id: 'week', label: 'TUẦN NÀY', desc: 'Anime Đang Chiếu Hot' },
    { id: 'season', label: 'MÙA NÀY', desc: 'Anime Mùa Hiện Tại' },
    { id: 'upcoming', label: 'SẮP RA MẮT', desc: 'Anime Mong Đợi Nhất' },
    { id: 'year', label: 'NĂM NAY', desc: 'Dự Kiến Năm Năm' },
    { id: 'all', label: 'MỌI THỜI ĐẠI', desc: 'Top Rating Thế Giới' },
  ];

  const SkeletonCard = () => (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="aspect-[3/4.2] bg-slate-800/20 rounded-2xl border border-white/5" />
      <div className="h-4 bg-slate-800/20 rounded w-full" />
      <div className="h-3 bg-slate-800/10 rounded w-1/2" />
    </div>
  );

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 md:px-12 bg-[#020617] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section optimized like image */}
        <div className="flex flex-col gap-8 mb-16 animate-in fade-in slide-in-from-left-6 duration-1000">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-2.5 h-16 bg-pink-600 rounded-sm shadow-[0_0_20px_rgba(236,72,153,0.3)]" />
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none italic">
                BẢNG VÀNG ANIME
              </h1>
            </div>
            
            <div className="flex items-center gap-3 ml-2.5 opacity-80">
              <Trophy size={16} className="text-yellow-500 fill-yellow-500/20" />
              <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.8em]">Global Power Rankings Sync</p>
            </div>
          </div>

          {/* Refined Small Tabs Navigation */}
          <div className="flex flex-wrap gap-1 bg-white/[0.02] p-1.5 rounded-full border border-white/5 w-fit shadow-2xl backdrop-blur-3xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative px-7 py-2.5 rounded-full text-[9px] font-black tracking-widest transition-all duration-500 overflow-hidden group active:scale-95 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <span className="relative z-10 uppercase">{tab.label}</span>
                {activeTab === tab.id && (
                   <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-in fade-in zoom-in duration-500" />
                )}
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>

          <div className="ml-2">
             <div className="flex items-center gap-2">
                <Zap size={10} className="text-pink-500 fill-pink-500" />
                <p className="text-pink-500/60 font-black text-[8px] uppercase tracking-[0.4em] italic">
                  Chế độ hiển thị: {tabs.find(t => t.id === activeTab)?.desc}
                </p>
             </div>
          </div>
        </div>

        {/* Content Segment */}
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {error ? (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
              <AlertCircle size={48} className="text-red-500/50" />
              <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">Neural Link Severed</h2>
              <button 
                onClick={loadData}
                className="px-10 py-4 bg-pink-600 rounded-full font-black text-[9px] tracking-widest uppercase flex items-center gap-3 hover:bg-pink-500 transition-all shadow-xl active:scale-95"
              >
                <RefreshCw size={14} /> Retry Sync
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
                {loading ? (
                  Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  data.map((anime, idx) => (
                    <div 
                      key={`${anime.id}-${activeTab}`} 
                      className="animate-in fade-in zoom-in-95 duration-500" 
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <AnimeCard 
                        anime={anime} 
                        onClick={onSelect} 
                        rank={idx + 1}
                      />
                    </div>
                  ))
                )}
              </div>
              
              {!loading && data.length === 0 && (
                <div className="py-40 text-center flex flex-col items-center gap-4">
                  <PlayCircle size={40} className="text-slate-800" />
                  <p className="text-slate-700 font-black uppercase tracking-[0.8em] italic text-[10px]">No dimensional signals in this segment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
