
import React, { useState, useEffect } from 'react';
import { X, Calendar, PlayCircle, Info, BrainCircuit, Youtube, Zap, ShieldCheck, Activity, MonitorPlay, Loader2, Heart } from 'lucide-react';
import { Anime } from '../src/types';
import { analyzeAnime } from '../src/geminiService';
import { generateAni4uLink, getAnimeVietSubUrl, getTrailerUrl } from '../src/mappingService';

interface Props {
  anime: Anime | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const AnimeDetails: React.FC<Props> = ({ anime, onClose, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'ai' | 'episodes'>('info');
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [smartLinkData, setSmartLinkData] = useState<any>(null);

  useEffect(() => {
    if (anime) {
      const link = generateAni4uLink(anime);
      setSmartLinkData(link);
    }
  }, [anime]);

  useEffect(() => {
    if (anime && activeTab === 'ai' && !analysis) {
      handleAnalysis();
    }
  }, [anime, activeTab]);

  const handleAnalysis = async () => {
    if (!anime) return;
    setLoadingAnalysis(true);
    const res = await analyzeAnime(anime.title);
    setAnalysis(res);
    setLoadingAnalysis(false);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!anime) return null;

  const totalEpisodes = anime.episodes || 12;
  const episodeArray = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] lg:h-[80vh] bg-[#0c1222] rounded-[1.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col border border-white/5 z-[160] animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-3 px-6 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-4 sm:gap-6 text-white overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('info')} className={`flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'info' ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'}`}><Info size={14} /> INFO</button>
            <button onClick={() => setActiveTab('episodes')} className={`flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'episodes' ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'}`}><MonitorPlay size={14} /> EPISODES</button>
            <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'ai' ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'}`}><BrainCircuit size={14} /> AI ANALYZE</button>
          </div>
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <button 
              onClick={onToggleFavorite}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all border active:scale-90 ${isFavorite ? 'bg-pink-600 text-white border-pink-500' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white hover:bg-white/10'}`}
            >
              <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 active:scale-90"><X size={16} /></button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div className="w-full lg:w-[260px] shrink-0 bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-5 overflow-y-auto no-scrollbar">
            <div className="w-full max-h-[220px] lg:max-h-none aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-white/10 mb-5 shrink-0 bg-slate-900">
              <img src={anime.image} className="w-full h-full object-cover lg:object-fill" alt={anime.title} />
            </div>
            
            <div className="flex flex-col gap-2.5 w-full">
              <button 
                onClick={() => openLink(smartLinkData?.url)}
                className="w-full bg-[#ff4b40] text-white py-3 rounded-lg font-black text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95 group"
              >
                <Zap size={14} fill="currentColor" className="group-hover:animate-pulse" /> XEM TẠI ANI4U
              </button>
              
              <button 
                onClick={() => openLink(getAnimeVietSubUrl(anime))}
                className="w-full bg-white/5 text-slate-400 py-3 rounded-lg font-black text-[9px] tracking-widest uppercase border border-white/10 flex items-center justify-center gap-2 hover:bg-pink-600 hover:text-white transition-all active:scale-95"
              >
                <PlayCircle size={14} /> ANIMEVIETSUB
              </button>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={() => openLink(getTrailerUrl(anime))} className="flex items-center justify-center gap-1.5 py-2.5 bg-white/5 rounded-lg text-[8px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/5 opacity-70"><Youtube size={12} className="text-red-500" /> TRAILER</button>
                <button onClick={() => openLink(`https://myanimelist.net/anime/${anime.mal_id}`)} className="flex items-center justify-center gap-1.5 py-2.5 bg-white/5 rounded-lg text-[8px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/5 opacity-70">MAL</button>
              </div>

              {smartLinkData && (
                <div className="mt-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hidden lg:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Neural Link</span>
                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm ${smartLinkData.confidence === 'high' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {smartLinkData.confidence.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[7px] text-slate-600 truncate italic">Strategy: {smartLinkData.strategy}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-5 sm:p-8 overflow-y-auto custom-scrollbar bg-slate-900/5">
            {activeTab === 'info' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="px-2 py-0.5 bg-pink-600/10 border border-pink-500/20 rounded text-pink-500 text-[8px] font-black tracking-widest uppercase">MAL {anime.rating}</span>
                  <span className="text-slate-500 text-[8px] font-black tracking-widest uppercase flex items-center gap-1"><Calendar size={10} /> {anime.year}</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 tracking-tighter leading-tight uppercase line-clamp-2">{anime.title}</h2>
                <p className="text-pink-500/50 text-[9px] font-bold tracking-widest uppercase mb-5 italic border-l-2 border-pink-600/30 pl-3">
                  {anime.title_english || anime.title}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {anime.genres.map(genre => (
                    <span key={genre} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">{genre}</span>
                  ))}
                </div>

                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-pink-500/80">
                    <span className="text-[8px] font-black tracking-widest uppercase italic">CỐT TRUYỆN</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium text-justify opacity-90 pb-6">
                    {anime.synopsis}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'episodes' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-5">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">CHỌN TẬP PHIM</h3>
                  <p className="text-[7px] text-pink-500 font-bold tracking-widest uppercase mt-0.5 opacity-60">Neural Matrix Synchronization</p>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {episodeArray.map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        const link = generateAni4uLink(anime, num);
                        openLink(link.url);
                      }}
                      className="aspect-square rounded-lg border border-white/5 bg-white/5 flex flex-col items-center justify-center transition-all hover:border-pink-500 hover:bg-pink-600/10 group active:scale-95 shadow-sm"
                    >
                      <span className="text-[11px] font-black text-slate-300 group-hover:text-white">{num}</span>
                      <span className="text-[5px] font-black text-slate-600 uppercase tracking-widest">EP</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-2 duration-500">
                <div className="bg-black/20 p-6 lg:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-lg flex items-center justify-center text-white"><BrainCircuit size={16} /></div>
                    <h4 className="text-white font-black text-[9px] uppercase tracking-widest italic opacity-80">SENSEI ANALYSIS</h4>
                  </div>
                  {loadingAnalysis ? (
                    <div className="py-10 flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-pink-500" size={20} strokeWidth={1.5} />
                      <span className="text-[7px] font-black tracking-widest uppercase text-slate-600">Processing Matrices...</span>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic border-l-2 border-pink-600/40 pl-5 max-w-2xl opacity-90">
                      {analysis}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
