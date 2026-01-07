import React, { useState, useEffect, useCallback, useMemo } from "react";
import Hero from "../components/Hero";
import TrendingSection from "../components/TrendingSection";
import AIAssistant from "../components/AIAssistant";
import AnimeDetails from "../components/AnimeDetails";
import Particles from "../components/Particles";
import MusicPlayer from "../components/MusicPlayer";
import AnimeCard from "../components/AnimeCard";
import Pagination from "../components/Pagination";
import GenresMegamenu from "../components/GenresMegamenu";
import { Anime } from "./types";
import {
    fetchAnimeFromJikan,
    fetchTopAnime,
    fetchCurrentSeason,
    fetchRecentEpisodes,
} from "./geminiService";
import {
    Heart,
    History,
    BarChart2,
    Loader2,
    Sparkles,
    Compass,
    ChevronDown,
    FilterX,
    Hash,
} from "lucide-react";

type View = "home" | "library" | "rankings";

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>("home");
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

    const [trendingData, setTrendingData] = useState<Anime[]>([]);
    const [recentData, setRecentData] = useState<Anime[]>([]);
    const [topRankings, setTopRankings] = useState<Anime[]>([]);
    const [searchResults, setSearchResults] = useState<Anime[]>([]);

    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingHome, setIsLoadingHome] = useState(true);
    const [isLoadingRankings, setIsLoadingRankings] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    useEffect(() => {
        const loadHomeData = async () => {
            setIsLoadingHome(true);
            try {
                const [trending, recent] = await Promise.all([
                    fetchCurrentSeason(15),
                    fetchRecentEpisodes(25),
                ]);
                setTrendingData(trending);
                setRecentData(recent);
            } catch (error) {
                console.error("Data error:", error);
            } finally {
                setIsLoadingHome(false);
            }
        };
        loadHomeData();
    }, []);

    useEffect(() => {
        if (currentView === "rankings") {
            const loadRankings = async () => {
                setIsLoadingRankings(true);
                try {
                    const [p1, p2] = await Promise.all([
                        fetchTopAnime(25, 1),
                        fetchTopAnime(25, 2),
                    ]);
                    setTopRankings([...p1, ...p2].slice(0, 40));
                } catch (error) {
                    console.error("Rankings error:", error);
                } finally {
                    setIsLoadingRankings(false);
                }
            };
            loadRankings();
        }
    }, [currentView]);

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    const clearGenres = () => setSelectedGenres([]);

    const filteredRecentData = useMemo(() => {
        if (selectedGenres.length === 0) return recentData;
        return recentData.filter((anime) =>
            selectedGenres.every((g) => anime.genres.includes(g))
        );
    }, [recentData, selectedGenres]);

    const handleSearch = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const results = await fetchAnimeFromJikan(query);
            setSearchResults(results || []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const renderView = () => {
        switch (currentView) {
            case "library":
                return (
                    <div className="pt-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
                        <div className="flex flex-col gap-12">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <Compass
                                        className="text-pink-500"
                                        size={32}
                                    />
                                    <h2 className="text-4xl font-black uppercase tracking-tight">
                                        Vừa khám phá
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {recentData.slice(0, 5).map((anime) => (
                                        <AnimeCard
                                            key={anime.id}
                                            anime={anime}
                                            onClick={setSelectedAnime}
                                        />
                                    ))}
                                </div>
                            </section>
                            <section className="mb-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <Heart
                                        className="text-pink-500 fill-pink-500"
                                        size={32}
                                    />
                                    <h2 className="text-4xl font-black uppercase tracking-tight">
                                        Gợi ý yêu thích
                                    </h2>
                                </div>
                                <p className="text-slate-500 font-bold italic uppercase tracking-widest text-xs">
                                    Dimensional Link Empty...
                                </p>
                            </section>
                        </div>
                    </div>
                );
            case "rankings":
                return (
                    <div className="pt-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                            <div className="flex items-center gap-4">
                                <BarChart2
                                    className="text-pink-500"
                                    size={36}
                                />
                                <div>
                                    <h2 className="text-5xl font-black uppercase tracking-tighter">
                                        BẢNG VÀNG ANIME
                                    </h2>
                                    <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mt-1">
                                        Dữ liệu theo MyAnimeList Network
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isLoadingRankings ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-4">
                                <Loader2
                                    className="animate-spin text-pink-500"
                                    size={48}
                                />
                                <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">
                                    Syncing World Rankings...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
                                    {topRankings.map((anime, idx) => (
                                        <AnimeCard
                                            key={`${anime.id}-${idx}`}
                                            anime={anime}
                                            onClick={setSelectedAnime}
                                            rank={idx + 1}
                                        />
                                    ))}
                                </div>
                                <Pagination />
                            </>
                        )}
                    </div>
                );
            default:
                return (
                    <>
                        <Hero
                            onSearch={handleSearch}
                            searchResults={searchResults}
                            isSearching={isSearching}
                            onSelect={setSelectedAnime}
                        />

                        <TrendingSection
                            animeList={trendingData}
                            onSelect={setSelectedAnime}
                        />

                        <AIAssistant />

                        <section className="py-24 px-4 md:px-12 bg-slate-950">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                                    <div className="flex items-center gap-4">
                                        <Sparkles className="text-pink-500" />
                                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                                            MỚI CẬP NHẬT TRÊN HỆ THỐNG
                                        </h2>
                                    </div>

                                    {/* Selected Genres Display */}
                                    {selectedGenres.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right duration-500">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">
                                                Đang lọc:
                                            </span>
                                            {selectedGenres.map((g) => (
                                                <div
                                                    key={g}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600/10 border border-pink-500/20 rounded-lg text-pink-500 text-[10px] font-black uppercase"
                                                >
                                                    <Hash size={10} /> {g}
                                                </div>
                                            ))}
                                            <button
                                                onClick={clearGenres}
                                                className="ml-2 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
                                                title="Xóa lọc"
                                            >
                                                <FilterX size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isLoadingHome ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2
                                            className="animate-spin text-pink-500"
                                            size={32}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {filteredRecentData.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
                                                {filteredRecentData.map(
                                                    (anime) => (
                                                        <AnimeCard
                                                            key={anime.id}
                                                            anime={anime}
                                                            onClick={
                                                                setSelectedAnime
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="py-32 flex flex-col items-center justify-center text-center">
                                                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                                                    <FilterX
                                                        size={32}
                                                        className="text-slate-600"
                                                    />
                                                </div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">
                                                    Không có kết quả
                                                </h3>
                                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-xs">
                                                    Thử bỏ bớt thể loại để tìm
                                                    thấy nhiều anime hơn.
                                                </p>
                                                <button
                                                    onClick={clearGenres}
                                                    className="mt-8 px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all active:scale-95"
                                                >
                                                    Xóa Tất Cả Bộ Lọc
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                                {!isLoadingHome &&
                                    filteredRecentData.length > 5 && (
                                        <Pagination />
                                    )}
                            </div>
                        </section>
                    </>
                );
        }
    };

    return (
        <div className="relative min-h-screen bg-[#020617] text-white selection:bg-pink-500/30">
            <Particles />

            <div
                className={`fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 z-[201] transition-all duration-500 ease-in-out ${
                    isSearching || isLoadingRankings || isLoadingHome
                        ? "w-full opacity-100"
                        : "w-0 opacity-0"
                }`}
            />

            <nav className="fixed top-0 inset-x-0 z-[100] px-8 py-6 flex items-center justify-between pointer-events-none">
                <div
                    onClick={() => {
                        setCurrentView("home");
                        clearGenres();
                    }}
                    className="font-anime text-2xl font-black text-white cursor-pointer pointer-events-auto flex items-center gap-4 group"
                >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border border-white/20 bg-slate-800">
                        <img
                            src="https://i.pinimg.com/1200x/19/59/af/1959af0003b1086a02c1fc7fc461fd68.jpg"
                            className="w-full h-full object-cover"
                            alt="Logo"
                        />
                    </div>
                    <span className="tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500 font-black uppercase text-2xl">
                        ANIME TM
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-2 glass p-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                        onClick={() => setCurrentView("home")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                            currentView === "home"
                                ? "bg-white/10 text-white shadow-inner"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        TRANG CHỦ
                    </button>
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsGenreOpen(true)}
                        onMouseLeave={() => setIsGenreOpen(false)}
                    >
                        <button
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 ${
                                selectedGenres.length > 0
                                    ? "text-pink-500"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            THỂ LOẠI{" "}
                            {selectedGenres.length > 0 &&
                                `(${selectedGenres.length})`}{" "}
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${
                                    isGenreOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        {isGenreOpen && (
                            <GenresMegamenu
                                selectedGenres={selectedGenres}
                                onToggleGenre={toggleGenre}
                                onClear={clearGenres}
                            />
                        )}
                    </div>
                    <button
                        onClick={() => setCurrentView("library")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                            currentView === "library"
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        KHÁM PHÁ
                    </button>
                    <button
                        onClick={() => setCurrentView("rankings")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                            currentView === "rankings"
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        XẾP HẠNG
                    </button>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <button className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-pink-600 transition-all shadow-xl group">
                        <Heart
                            size={20}
                            className="text-slate-400 group-hover:text-white"
                        />
                    </button>
                </div>
            </nav>

            <main>{renderView()}</main>

            {selectedAnime && (
                <AnimeDetails
                    anime={selectedAnime}
                    onClose={() => setSelectedAnime(null)}
                />
            )}

            <footer className="py-24 px-8 bg-slate-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-black mb-6 uppercase text-white tracking-tighter">
                            ANIME<span className="text-pink-600">TM</span>
                        </h3>
                        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed font-bold uppercase text-[11px] tracking-widest">
                            Hub tìm kiếm và gợi ý Anime thông minh. Chúng tôi
                            không lưu trữ nội dung, chỉ hỗ trợ kết nối bạn đến
                            những nền tảng xem phim tốt nhất như AnimeVietSub.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black mb-6 tracking-widest uppercase text-[10px] text-pink-500">
                            Quick Links
                        </h4>
                        <ul className="space-y-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase">
                            <li>
                                <button
                                    onClick={() => setCurrentView("home")}
                                    className="hover:text-white"
                                >
                                    Trang chủ
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setCurrentView("rankings")}
                                    className="hover:text-white"
                                >
                                    Bảng xếp hạng
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black mb-6 tracking-widest uppercase text-[10px] text-pink-500">
                            Support
                        </h4>
                        <ul className="space-y-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase">
                            <li>
                                <a href="#" className="hover:text-white">
                                    Báo lỗi dữ liệu
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    DMCA Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-slate-700 text-[9px] font-black tracking-[0.5em] uppercase">
                    © 2024 ANIME_TM_DASHBOARD • POWERED BY AI SENSEI
                </div>
            </footer>

            <MusicPlayer />
        </div>
    );
};

export default App;
