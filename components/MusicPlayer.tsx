import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";

// ==========================================
// CHỈNH LINK NHẠC TẠI ĐÂY (Hỗ trợ .mp3, .ogg, hoặc stream link)
// ==========================================
const AUDIO_SOURCE =
    "https://stream-156.zeno.fm/0r0xa792kwzuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiIwcjB4YTc5Mmt3enV2IiwiaG9zdCI6InN0cmVhbS0xNTYuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6InJ5Sk81Q0RpUWJhRjM2STlJSGlBU0EiLCJpYXQiOjE3Njc4ODg3MjIsImV4cCI6MTc2Nzg4ODc4Mn0.8WSRJmAj12KK-QIc2L0EWRMT5m8yd4V27-fd-kO_XCM"; // Ví dụ link nhạc Lo-fi
const TRACK_NAME = "Nhạc Lofi Anime";

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.log(
                        "Autoplay bị chặn bởi trình duyệt, cần người dùng tương tác."
                    );
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-4">
            {/* Thẻ audio thực tế ẩn đi */}
            <audio ref={audioRef} src={AUDIO_SOURCE} loop preload="auto" />

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
                                Streaming Now
                            </span>
                        </div>
                        <span className="text-[11px] text-white font-bold max-w-[120px] truncate">
                            {TRACK_NAME}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-1" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
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
                <div
                    className={`absolute inset-0 bg-gradient-to-tr from-pink-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

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
