
import React, { useState } from 'react';
import { Music, Play, Pause, Volume2 } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-4">
      {showControls && (
        <div className="glass px-6 py-3 rounded-full flex items-center gap-4 animate-in slide-in-from-right fade-in">
          <div className="flex flex-col">
            <span className="text-[10px] text-pink-500 font-bold tracking-tighter uppercase">Now Playing</span>
            <span className="text-xs text-white font-medium max-w-[120px] truncate">Anime Lo-Fi Radio</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-pink-500 transition-colors">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <Volume2 size={18} className="text-slate-400" />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowControls(!showControls)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          showControls ? 'bg-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'glass hover:bg-white/10'
        }`}
      >
        <Music className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} />
      </button>
    </div>
  );
};

export default MusicPlayer;
