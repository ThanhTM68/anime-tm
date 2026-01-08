import React, { useState, useEffect, useCallback } from "react";
import Hero from "../components/Hero";
import TrendingSection from "../components/TrendingSection";
import AIAssistant from "../components/AIAssistant";
import AnimeDetails from "../components/AnimeDetails";
import Particles from "../components/Particles";
import MusicPlayer from "../components/MusicPlayer";
import AnimeCard from "../components/AnimeCard";
import Pagination from "../components/Pagination";
import GenresMegamenu, { GENRE_MAP } from "../components/GenresMegamenu";
import Leaderboard from "../components/Leaderboard";
import { Anime } from "./types";
import {
    fetchAnimeFromJikan,
    fetchTopAnime,
    fetchCurrentSeason,
    fetchAnimeWithFilters,
    fetchRandomBackground,
} from "./geminiService";
import {
    Heart,
    Loader2,
    ChevronDown,
    Zap,
    Home,
    ChevronRight,
    LayoutGrid,
    Sparkles,
    Trash2,
    Calendar,
} from "lucide-react";

type View = "home" | "genre-view" | "latest" | "rankings" | "favorites";

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>("home");
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const [trendingData, setTrendingData] = useState<Anime[]>([]);
    const [displayData, setDisplayData] = useState<Anime[]>([]);
    const [searchResults, setSearchResults] = useState<Anime[]>([]);

    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState<any>(null);

    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    const [currentBg, setCurrentBg] = useState<string>("");

    const [favorites, setFavorites] = useState<Anime[]>(() => {
        try {
            const saved = localStorage.getItem("anime-tm-v3-favs");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("anime-tm-v3-favs", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleFavorite = (anime: Anime) => {
        setFavorites((prev) => {
            const isExist = prev.find((a) => a.mal_id === anime.mal_id);
            if (isExist) return prev.filter((a) => a.mal_id !== anime.mal_id);
            return [anime, ...prev];
        });
    };

    const isFavorite = (animeId: number) =>
        favorites.some((a) => a.mal_id === animeId);

    const updateViewBackground = async () => {
        const bg = await fetchRandomBackground();
        setCurrentBg(bg);
    };

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                const top = await fetchTopAnime(20);
                setTrendingData(top);
                const season = await fetchCurrentSeason(1, 12);
                if (season) setDisplayData(season.data);
                await updateViewBackground();
            } catch (e) {
                console.error("Init Error:", e);
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        if (currentView === "rankings" || currentView === "favorites") return;

        const updateData = async () => {
            setIsLoading(true);
            try {
                let res;
                if (
                    currentView === "genre-view" &&
                    selectedGenreIds.length > 0
                ) {
                    res = await fetchAnimeWithFilters(
                        selectedGenreIds,
                        currentPage
                    );
                } else if (currentView === "latest") {
                    res = await fetchCurrentSeason(currentPage, 24);
                } else if (
                    currentView === "home" &&
                    selectedGenreIds.length === 0
                ) {
                    res = await fetchCurrentSeason(1, 12);
                }

                if (res && res.data) {
                    setDisplayData(res.data);
                    setPaginationInfo(res.pagination);
                }
            } catch (e) {
                console.error("Data Sync Error:", e);
            } finally {
                setIsLoading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
        updateData();
    }, [currentView, selectedGenreIds, currentPage]);

    const toggleGenre = (genreId: number) => {
        setCurrentPage(1);
        setSelectedGenreIds((prev) => {
            const isExist = prev.includes(genreId);
            const newIds = isExist
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId];
            if (newIds.length > 0) {
                setCurrentView("genre-view");
            } else {
                setCurrentView("home");
            }
            return newIds;
        });
    };

    const handleClearGenres = () => {
        setSelectedGenreIds([]);
        setCurrentPage(1);
        setCurrentView("home");
        setIsGenreOpen(false);
    };

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
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleViewChange = (view: View) => {
        setCurrentPage(1);
        if (view !== "genre-view") {
            setSelectedGenreIds([]);
        }
        setCurrentView(view);
        updateViewBackground();
        setIsGenreOpen(false);
    };

    const ListingLayout = () => {
        const isFavView = currentView === "favorites";
        const items = isFavView ? favorites : displayData;

        let title = "MỚI CẬP NHẬT";
        let icon = <Calendar className="text-pink-500" size={24} />;

        if (isFavView) {
            title = "YÊU THÍCH";
            icon = <Heart className="text-pink-500 fill-pink-500" size={24} />;
        } else if (currentView === "genre-view") {
            const names = selectedGenreIds
                .map((id) => GENRE_MAP.find((g) => g.id === id)?.label)
                .join(", ");
            title =
                selectedGenreIds.length > 0
                    ? `THỂ LOẠI: ${names}`
                    : "BỘ LỌC THỂ LOẠI";
            icon = <LayoutGrid className="text-pink-500" size={24} />;
        }

        return (
            <div className="min-h-screen pt-40 pb-24 px-6 md:px-12 relative bg-[#020617]">
                <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
                    <img
                        src={currentBg}
                        className="w-full h-full object-cover blur-[100px]"
                        alt=""
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col gap-6 mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <button
                                onClick={() => handleViewChange("home")}
                                className="hover:text-pink-500 transition-colors"
                            >
                                Trang chủ
                            </button>
                            <ChevronRight size={12} />
                            <span className="text-white">{title}</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-pink-600/10 flex items-center justify-center border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                                    {icon}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none break-words max-w-2xl">
                                    {title}
                                </h1>
                            </div>

                            {isFavView && favorites.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (confirm("Xóa sạch danh sách?"))
                                            setFavorites([]);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black text-[10px] tracking-widest uppercase border border-red-500/20 active:scale-95"
                                >
                                    <Trash2 size={16} /> XÓA TẤT CẢ
                                </button>
                            )}
                        </div>
                    </div>

                    {isLoading && !isFavView ? (
                        <div className="py-40 flex justify-center">
                            <Loader2
                                className="animate-spin text-pink-500"
                                size={48}
                            />
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {items.map((anime) => (
                                <AnimeCard
                                    key={anime.mal_id}
                                    anime={anime}
                                    onClick={setSelectedAnime}
                                    isFavorite={isFavorite(anime.mal_id)}
                                    onToggleFavorite={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(anime);
                                    }}
                                />
                            ))}
                            {!isFavView && (
                                <div className="col-span-full pt-12">
                                    <Pagination
                                        current={currentPage}
                                        last={
                                            paginationInfo?.last_visible_page ||
                                            1
                                        }
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-40 text-center flex flex-col items-center gap-6">
                            <Sparkles size={48} className="text-slate-800" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest">
                                Không có dữ liệu hiển thị
                            </p>
                            <button
                                onClick={() => handleViewChange("home")}
                                className="px-10 py-4 bg-pink-600 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-pink-500 transition-all active:scale-95 shadow-xl"
                            >
                                QUAY LẠI TRANG CHỦ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const menuItems = [
        { id: "home", label: "Trang Chủ" },
        { id: "genre-view", label: "Thể Loại", hasDropdown: true },
        { id: "latest", label: "Mới Nhất" },
        { id: "rankings", label: "Xếp Hạng" },
    ];

    return (
        <div className="relative min-h-screen bg-[#020617] text-white selection:bg-pink-600/30 overflow-x-hidden">
            <Particles />

            <nav
                className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-b ${
                    isScrolled
                        ? "py-4 bg-white/[0.005] backdrop-blur-[80px] border-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
                        : "py-8 bg-transparent border-transparent"
                }`}
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between relative">
                    <div
                        onClick={() => handleViewChange("home")}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-pink-500 transition-all duration-700 shadow-2xl group-hover:scale-110 group-hover:rotate-6">
                            <img
                                src="https://i.pinimg.com/1200x/19/59/af/1959af0003b1086a02c1fc7fc461fd68.jpg"
                                className="w-full h-full object-cover"
                                alt="Logo"
                            />
                            <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <div className="flex items-center gap-2">
                                <span className="font-anime font-black text-xl tracking-tighter uppercase text-white group-hover:text-pink-500 transition-colors duration-500">
                                    ANIME
                                    <span className="text-pink-600 group-hover:text-white transition-colors duration-500">
                                        TM
                                    </span>
                                </span>
                                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[7px] font-black text-green-500 tracking-widest uppercase">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />{" "}
                                    Stable
                                </div>
                            </div>
                            <span className="text-[7px] font-black text-slate-500 tracking-[0.6em] uppercase mt-1 group-hover:translate-x-1 transition-transform duration-500">
                                ANIME TM V1.0
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 bg-white/[0.02] p-1 rounded-[2rem] border border-white/5 backdrop-blur-3xl relative overflow-visible group/nav">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group/item"
                                onMouseEnter={() =>
                                    item.hasDropdown && setIsGenreOpen(true)
                                }
                                onMouseLeave={() =>
                                    item.hasDropdown && setIsGenreOpen(false)
                                }
                            >
                                <button
                                    onClick={() =>
                                        handleViewChange(item.id as View)
                                    }
                                    className={`relative px-5 py-2 text-[9px] font-black tracking-widest uppercase transition-all duration-500 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-white/[0.03] ${
                                        currentView === item.id
                                            ? "text-white bg-pink-600/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    <span className="relative inline-block">
                                        {item.label}
                                        {/* 
                          Hover line logic: 
                          - Only show when currentView is NOT this item
                          - Expand from left to right (origin-left)
                          - Centered under text
                        */}
                                        {currentView !== item.id && (
                                            <div className="absolute -bottom-1 left-0 h-[1.5px] bg-pink-500 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) w-0 group-hover/item:w-full shadow-[0_0_8px_rgba(236,72,153,0.5)] opacity-0 group-hover/item:opacity-100 origin-left" />
                                        )}
                                        {/* NO line for active item as requested */}
                                    </span>
                                    {item.hasDropdown && (
                                        <ChevronDown
                                            size={11}
                                            className={`transition-transform duration-700 ease-out ${
                                                isGenreOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    )}
                                </button>

                                {item.hasDropdown && isGenreOpen && (
                                    <GenresMegamenu
                                        selectedGenreIds={selectedGenreIds}
                                        onToggleGenre={toggleGenre}
                                        onClear={handleClearGenres}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleViewChange("favorites")}
                            className={`group relative w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-700 shadow-xl overflow-hidden active:scale-90 ${
                                currentView === "favorites"
                                    ? "bg-pink-600 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-pink-500/50"
                            }`}
                        >
                            <Heart
                                size={18}
                                className={`transition-all duration-700 ${
                                    currentView === "favorites"
                                        ? "fill-white scale-110"
                                        : "group-hover:scale-110 group-hover:text-pink-500"
                                }`}
                            />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 text-white rounded-full text-[8px] font-black flex items-center justify-center border-2 border-[#020617] group-hover:animate-bounce">
                                    {favorites.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {currentView === "home" && selectedGenreIds.length === 0 ? (
                    <div className="animate-in fade-in duration-1000">
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
                        <section className="py-24 px-6 md:px-12 bg-slate-950/20 relative">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-4 mb-16 animate-in slide-in-from-left duration-700">
                                    <LayoutGrid
                                        className="text-pink-500 animate-pulse"
                                        size={24}
                                    />
                                    <h2 className="text-4xl font-black uppercase tracking-tight italic text-white">
                                        Anime Mùa Này
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
                                    {displayData
                                        .slice(0, 12)
                                        .map((anime, idx) => (
                                            <div
                                                key={anime.mal_id}
                                                className="animate-in fade-in zoom-in-95 duration-700"
                                                style={{
                                                    animationDelay: `${
                                                        idx * 50
                                                    }ms`,
                                                }}
                                            >
                                                <AnimeCard
                                                    anime={anime}
                                                    onClick={setSelectedAnime}
                                                    isFavorite={isFavorite(
                                                        anime.mal_id
                                                    )}
                                                    onToggleFavorite={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(anime);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                </div>
                                <div className="mt-20 flex justify-center">
                                    <button
                                        onClick={() =>
                                            handleViewChange("latest")
                                        }
                                        className="group relative px-16 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-pink-600 hover:border-pink-500 transition-all shadow-2xl overflow-hidden active:scale-95"
                                    >
                                        <span className="relative z-10 flex items-center gap-4">
                                            KHÁM PHÁ THÊM{" "}
                                            <ChevronRight
                                                size={14}
                                                className="group-hover:translate-x-2 transition-transform"
                                            />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : currentView === "rankings" ? (
                    <Leaderboard onSelect={setSelectedAnime} />
                ) : (
                    <ListingLayout />
                )}
            </main>

            {selectedAnime && (
                <AnimeDetails
                    anime={selectedAnime}
                    onClose={() => setSelectedAnime(null)}
                    isFavorite={isFavorite(selectedAnime.mal_id)}
                    onToggleFavorite={() => toggleFavorite(selectedAnime)}
                />
            )}

            <MusicPlayer />
            <footer className="py-20 px-12 bg-[#010409] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-pink-500/10 to-transparent" />
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="font-anime font-black text-3xl tracking-tighter uppercase mb-6">
                        ANIME<span className="text-pink-600">TM</span>
                    </div>
                    <div className="text-slate-600 font-black text-[9px] tracking-[0.8em] uppercase mb-12 text-center max-w-lg">
                        Nếu hiện thực quá mệt mỏi, hãy để Anime chữa lành tâm
                        hồn bạn.
                    </div>
                    <div className="flex gap-8 text-slate-500 text-[10px] font-black tracking-widest uppercase mb-16">
                        <button
                            onClick={() => handleViewChange("home")}
                            className="hover:text-pink-500 transition-colors"
                        >
                            Trang Chủ
                        </button>
                        <button
                            onClick={() => handleViewChange("genre-view")}
                            className="hover:text-pink-500 transition-colors"
                        >
                            Thể Loại
                        </button>
                        <button
                            onClick={() => handleViewChange("latest")}
                            className="hover:text-pink-500 transition-colors"
                        >
                            Mới Nhất
                        </button>
                        <button
                            onClick={() => handleViewChange("rankings")}
                            className="hover:text-pink-500 transition-colors"
                        >
                            Xếp Hạng
                        </button>
                    </div>
                    <div className="text-slate-800 font-black text-[9px] tracking-[1em] uppercase">
                        © 2024 ANIME TM NETWORK • BY ThanhTM68
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
