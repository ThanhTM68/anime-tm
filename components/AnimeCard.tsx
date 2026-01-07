import React from "react";
import { Star, Trophy, ArrowUpRight } from "lucide-react";
import { Anime } from "../src/types";

interface AnimeCardProps {
    anime: Anime;
    onClick: (anime: Anime) => void;
    rank?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, rank }) => {
    // Giả lập dữ liệu lượt xem tương ứng với quy mô AnimeVietSub
    const viewCount = (Math.random() * 2000000 + 50000).toLocaleString(
        "vi-VN",
        { maximumFractionDigits: 0 }
    );
    const isCompleted = Math.random() > 0.4;

    return (
        <div
            className="group cursor-pointer flex flex-col gap-3 relative"
            onClick={() => onClick(anime)}
        >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-slate-900">
                <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Rank Badge */}
                {rank !== undefined && (
                    <div className="absolute top-0 left-0 z-20">
                        <div
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-br-2xl font-black text-[10px] shadow-2xl ${
                                rank <= 3
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                                    : "bg-pink-600 text-white"
                            }`}
                        >
                            <Trophy
                                size={12}
                                className={rank <= 3 ? "animate-bounce" : ""}
                            />
                            TOP {rank}
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${
                            isCompleted ? "bg-green-500" : "bg-blue-500"
                        } animate-pulse`}
                    />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                        {isCompleted ? "Full" : "Airing"}
                    </span>
                </div>

                {/* Hover Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="flex flex-col gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2">
                            <Star
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                            />
                            <span className="text-sm font-black text-white">
                                {anime.rating}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pink-500">
                            Chi tiết gợi ý <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-1">
                <h3 className="text-sm font-black text-white line-clamp-2 leading-tight group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                    {anime.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {viewCount} Views
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold uppercase">
                        {anime.year}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;
