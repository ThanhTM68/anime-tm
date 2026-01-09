import React, { useState, useRef, useEffect } from "react";
import {
    Music,
    Play,
    Pause,
    Volume2,
    VolumeX,
    SkipForward,
    SkipBack,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL;

// Danh sách bài hát
const PLAYLIST = [
    {
        src: `${BASE_URL}music/bai1.mp3`, // Tên file bạn vừa chép vào public/music
        name: "orange 7",
    },
    {
        src: `${BASE_URL}music/bai2.mp3`,
        name: "ロクデナシ愛が灯る",
    },
    {
        src: `${BASE_URL}music/bai3.mp3`,
        name: "ロクデナシ",
    },
    {
        src: `${BASE_URL}music/bai4.mp3`,
        name: "Kimi no Na wa",
    },
    {
        src: `${BASE_URL}music/bai5.mp3`,
        name: "DAOKO",
    },
    // Thêm bài khác nếu có...
];

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);

    // Ref để điều khiển thẻ Audio thật
    const audioRef = useRef<HTMLAudioElement>(null);

    // Xử lý khi đổi bài hát -> Tự động phát
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.log("Trình duyệt chặn tự phát:", err);
                    setIsPlaying(false); // Nếu bị chặn thì tắt trạng thái play
                });
            }
        }
    }, [currentTrack, isPlaying]);

    // Xử lý Mute/Unmute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true); // Chuyển bài là auto phát
    };

    const prevTrack = () => {
        setCurrentTrack(
            (prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length
        );
        setIsPlaying(true);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-4">
            {/* --- THẺ AUDIO CHÍNH (ẨN ĐI) --- */}
            {/* Đây là cách phát nhạc chuẩn nhất, không cần thư viện */}
            <audio
                ref={audioRef}
                src={PLAYLIST[currentTrack].src}
                onEnded={nextTrack} // Hết bài tự qua bài mới
                preload="auto"
            />
            {/* ------------------------------- */}

            {/* GIAO DIỆN ĐIỀU KHIỂN */}
            {showControls && (
                <div className="glass px-6 py-3 rounded-full flex items-center gap-4 animate-in slide-in-from-right fade-in duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-white/10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${
                                    isPlaying ? "animate-pulse" : ""
                                }`}
                            />
                            <span className="text-[9px] text-pink-500 font-black tracking-widest uppercase">
                                Track {currentTrack + 1}/{PLAYLIST.length}
                            </span>
                        </div>
                        <span className="text-[11px] text-white font-bold max-w-[120px] truncate">
                            {PLAYLIST[currentTrack].name}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-1" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={prevTrack}
                            className="text-slate-400 hover:text-white transition-colors p-1 active:scale-90"
                        >
                            <SkipBack size={16} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-8 h-8 flex items-center justify-center bg-pink-600/20 text-pink-500 hover:bg-pink-600 hover:text-white rounded-full transition-all active:scale-90"
                        >
                            {isPlaying ? (
                                <Pause size={14} fill="currentColor" />
                            ) : (
                                <Play
                                    size={14}
                                    fill="currentColor"
                                    className="ml-0.5"
                                />
                            )}
                        </button>

                        <button
                            onClick={nextTrack}
                            className="text-slate-400 hover:text-white transition-colors p-1 active:scale-90"
                        >
                            <SkipForward size={16} />
                        </button>

                        <button
                            onClick={toggleMute}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                        >
                            {isMuted ? (
                                <VolumeX size={16} />
                            ) : (
                                <Volume2 size={16} />
                            )}
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setShowControls(!showControls)}
                className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                    showControls
                        ? "bg-pink-600 shadow-[0_0_30px_rgba(236,72,153,0.5)] border-pink-500"
                        : "glass hover:bg-white/10 border-white/10"
                } border-2 overflow-hidden`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Music
                    className={`relative z-10 transition-transform duration-[4000ms] linear infinite ${
                        isPlaying
                            ? "rotate-[360deg] scale-110 text-white"
                            : "group-hover:rotate-12 text-slate-400"
                    }`}
                    size={22}
                />

                {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full border-2 border-pink-400/30 rounded-full animate-ping" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default MusicPlayer;
