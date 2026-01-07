
import React, { useState, useEffect } from 'react';
import { X, Calendar, PlayCircle, Info, BrainCircuit, Youtube, Zap, Search, ShieldCheck, ExternalLink, Activity, MonitorPlay, Loader2 } from 'lucide-react';
import { Anime } from '../types';
import { analyzeAnime, getSmartLink } from '../geminiService';
import { generateAni4uLink, getAnimeVietSubUrl, getTrailerUrl } from '../mappingService';

interface Props {
  anime: Anime | null;
  onClose: () => void;
}

const AnimeDetails: React.FC<Props> = ({ anime, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'ai' | 'episodes'>('info');
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [smartLinkData, setSmartLinkData] = useState<any>(null);

  useEffect(() => {
    if (anime) {
      // Tự động chuẩn bị Smart Link cho tập 1 hoặc full phim
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl h-full max-h-[94vh] glass rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col border border-white/10 z-[160] animate-in zoom-in-95 duration-300">
        
        {/* Navbar */}
        <div className="flex items-center justify-between p-6 px-10 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-8 text-white">
            <button onClick={() => setActiveTab('info')} className={`flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase transition-all ${activeTab === 'info' ? 'text-pink-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}><Info size={16} /> Thông Tin</button>
            <button onClick={() => setActiveTab('episodes')} className={`flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase transition-all ${activeTab === 'episodes' ? 'text-pink-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}><MonitorPlay size={16} /> Danh Sách Tập</button>
            <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase transition-all ${activeTab === 'ai' ? 'text-pink-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}><BrainCircuit size={16} /> AI Phân Tích</button>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-pink-600 rounded-xl transition-all border border-white/10"><X size={20} /></button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Panel: Poster & Quick Action */}
          <div className="w-full lg:w-[35%] relative bg-black/40 border-r border-white/5 flex flex-col items-center justify-center p-12 overflow-y-auto">
            <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-10 group">
              <img src={anime.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={anime.title} />
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => openLink(smartLinkData?.url)}
                className="w-full bg-[#ff4b40] text-white py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                <Zap size={18} fill="currentColor" /> Xem Tại Ani4u
              </button>
              
              <button 
                onClick={() => openLink(getAnimeVietSubUrl(anime))}
                className="w-full bg-pink-600/10 text-pink-500 py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase border border-pink-600/20 flex items-center justify-center gap-3 hover:bg-pink-600 hover:text-white transition-all active:scale-95"
              >
                <PlayCircle size={18} /> AnimeVietSub
              </button>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => openLink(getTrailerUrl(anime))} className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg text-[9px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10"><Youtube size={14} className="text-red-500" /> Trailer</button>
                <button onClick={() => openLink(`https://myanimelist.net/anime/${anime.mal_id}`)} className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg text-[9px] font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10">MAL Profile</button>
              </div>

              {/* Smart Metadata Badge */}
              {smartLinkData && (
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Neural Mapping</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${smartLinkData.confidence === 'high' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {smartLinkData.confidence.toUpperCase()} CONFIDENCE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300">
                    <Activity size={12} className="text-pink-500" />
                    <span className="truncate">Strategy: {smartLinkData.strategy}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Content */}
          <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar bg-slate-900/20 backdrop-blur-xl">
            {activeTab === 'info' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-pink-600/10 border border-pink-500/20 rounded-lg text-pink-500 text-[10px] font-black tracking-widest uppercase font-anime">MAL {anime.rating}</span>
                  <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-2 font-anime"><Calendar size={14} /> {anime.year}</span>
                </div>
                
                <h2 className="text-6xl font-black text-white mb-6 tracking-tighter leading-tight uppercase">{anime.title}</h2>
                <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mb-10 opacity-70 border-l-2 border-pink-600 pl-4">{anime.title_english || anime.title}</p>
                
                <div className="flex flex-wrap gap-2 mb-12">
                  {anime.genres.map(genre => (
                    <span key={genre} className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-pink-500 transition-colors cursor-default">{genre}</span>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black tracking-[0.6em] text-slate-600 uppercase">Cốt Truyện</h4>
                  <p className="text-slate-300 text-xl leading-relaxed font-medium font-jp">{anime.synopsis}</p>
                </div>
              </div>
            )}

            {activeTab === 'episodes' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Chọn Tập Phim</h3>
                    <p className="text-[10px] text-pink-500 font-black tracking-[0.3em] uppercase mt-2">Nguồn phát từ Ani4u (Auto-Slug)</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {episodeArray.map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        const link = generateAni4uLink(anime, num);
                        openLink(link.url);
                      }}
                      className="aspect-square rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center transition-all hover:border-pink-500 hover:bg-pink-600/20 group active:scale-95"
                    >
                      <span className="text-sm font-black text-slate-300 group-hover:text-white">{num}</span>
                      <span className="text-[7px] font-black text-slate-600 group-hover:text-pink-500 uppercase tracking-widest">EP</span>
                    </button>
                  ))}
                </div>

                <div className="mt-16 p-8 rounded-2xl bg-slate-950/40 border border-white/5 flex gap-6 items-start">
                  <div className="p-3 bg-white/5 rounded-xl text-pink-500"><ShieldCheck size={20} /></div>
                  <div className="space-y-2">
                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Chế độ liên kết an toàn</p>
                    <p className="text-slate-500 text-xs leading-relaxed font-bold">
                      Hệ thống tự động sử dụng <strong>Title English</strong> hoặc <strong>Romaji</strong> để tạo link chính xác nhất cho hệ thống lọc của Ani4u. 
                      Trường hợp phim có nhiều phần (Season/Part), hệ thống sẽ ưu tiên dẫn về trang <strong>Tìm Kiếm</strong> để bạn chọn đúng bản cập nhật mới nhất.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-slate-950/80 p-12 lg:p-20 rounded-[3rem] border border-white/5 relative overflow-hidden">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><BrainCircuit size={28} /></div>
                    <h4 className="text-white font-black text-xl uppercase tracking-widest font-anime">Neural Review</h4>
                  </div>
                  {loadingAnalysis ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-pink-500" size={32} />
                      <span className="text-[9px] font-black tracking-[0.5em] uppercase text-slate-600">Syncing with Akasha System...</span>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-2xl leading-relaxed italic font-jp border-l-4 border-pink-600 pl-8">{analysis}</p>
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
