import React from "react";
import { Star, Heart, Play } from "lucide-react";
import { Anime } from "../src/types";

interface AnimeCardProps {
    anime: Anime;
    onClick: (anime: Anime) => void;
    rank?: number;
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
    anime,
    onClick,
    rank,
    isFavorite,
    onToggleFavorite,
}) => {
    const isAiring = anime.episodes === 0 || !anime.episodes;
    const score = anime.rating || "?.?";

    const getRankBadge = () => {
        if (rank === 1)
            return "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]";
        if (rank === 2) return "bg-slate-300 text-black";
        if (rank === 3) return "bg-orange-600 text-white";
        return "bg-pink-600/80 text-white";
    };

    return (
        <div
            className="group cursor-pointer flex flex-col h-full relative transition-all duration-500 hover:-translate-y-2"
            onClick={() => onClick(anime)}
        >
            {/* Media Container */}
            <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-slate-900 shrink-0">
                <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20">
                    {rank !== undefined && (
                        <div
                            className={`px-2 py-0.5 rounded-md font-anime font-black text-[10px] italic shadow-lg ${getRankBadge()}`}
                        >
                            #{rank}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                        <div
                            className={`w-1.5 h-1.5 rounded-full ${
                                isAiring
                                    ? "bg-blue-400 animate-pulse"
                                    : "bg-green-400"
                            }`}
                        />
                        <span className="text-[7px] font-black text-white/90 uppercase tracking-widest">
                            {isAiring ? "LIVE" : "FULL"}
                        </span>
                    </div>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={onToggleFavorite}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all z-30 border ${
                        isFavorite
                            ? "bg-pink-600 border-pink-500 text-white scale-110 shadow-lg"
                            : "bg-black/40 backdrop-blur-md border-white/10 text-white/60 hover:text-white"
                    }`}
                >
                    <Heart
                        size={14}
                        className={isFavorite ? "fill-white" : ""}
                    />
                </button>

                {/* Score Overlay */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 z-20">
                    <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-[10px] font-anime font-bold text-white leading-none">
                        {score}
                    </span>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <Play
                            size={20}
                            className="text-pink-600 ml-1 fill-pink-600"
                        />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="mt-3 flex flex-col gap-0.5 px-0.5">
                <h3 className="text-[13px] font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-pink-500 transition-colors uppercase">
                    {anime.title}
                </h3>

                <div className="flex items-center gap-2 opacity-50">
                    <span className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[60%]">
                        {anime.studio || "Sensei"}
                    </span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">
                        {anime.episodes ? `${anime.episodes} tập` : "?? tập"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;
