"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bookmark, BookmarkCheck, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type AyahType = {
    number: number;
    numberInSurah: number;
    arabicText: string;
    englishText: string;
};

export function SurahReader({
    ayahs,
    surahNumber,
}: {
    ayahs: AyahType[];
    surahNumber: number;
}) {
    const [bookmarked, setBookmarked] = useState<number | null>(null);
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("quran_bookmark");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.surah === surahNumber) {
                setBookmarked(data.ayah);
            }
        }
    }, [surahNumber]);

    const toggleBookmark = (ayahNumber: number) => {
        if (bookmarked === ayahNumber) {
            setBookmarked(null);
            localStorage.removeItem("quran_bookmark");
        } else {
            setBookmarked(ayahNumber);
            localStorage.setItem(
                "quran_bookmark",
                JSON.stringify({ surah: surahNumber, ayah: ayahNumber })
            );
        }
    };

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingAyah(null);
        setIsLoading(false);
    }, []);

    const playAudio = useCallback((globalAyahNumber: number, numberInSurah: number) => {
        if (playingAyah === globalAyahNumber) {
            stopAudio();
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setIsLoading(true);
        setPlayingAyah(globalAyahNumber);

        const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
        const audio = new Audio(audioUrl);

        audio.oncanplaythrough = () => setIsLoading(false);

        audio.onended = () => {
            if (autoPlay) {
                const currentIndex = ayahs.findIndex(a => a.number === globalAyahNumber);
                if (currentIndex >= 0 && currentIndex < ayahs.length - 1) {
                    const nextAyah = ayahs[currentIndex + 1];
                    setTimeout(() => {
                        playAudio(nextAyah.number, nextAyah.numberInSurah);
                        const nextEl = document.getElementById(`ayah-${nextAyah.numberInSurah}`);
                        if (nextEl) nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 300);
                } else {
                    stopAudio();
                }
            } else {
                stopAudio();
            }
        };

        audio.onerror = () => { setIsLoading(false); setPlayingAyah(null); };

        audioRef.current = audio;
        audio.play().catch(() => { setIsLoading(false); setPlayingAyah(null); });
    }, [playingAyah, autoPlay, ayahs, stopAudio]);

    const skipToNext = useCallback(() => {
        if (playingAyah === null) return;
        const currentIndex = ayahs.findIndex(a => a.number === playingAyah);
        if (currentIndex >= 0 && currentIndex < ayahs.length - 1) {
            const nextAyah = ayahs[currentIndex + 1];
            playAudio(nextAyah.number, nextAyah.numberInSurah);
            const nextEl = document.getElementById(`ayah-${nextAyah.numberInSurah}`);
            if (nextEl) nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [playingAyah, ayahs, playAudio]);

    useEffect(() => {
        return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
    }, []);

    useGSAP(() => {
        gsap.from(".ayah-card", {
            opacity: 0, y: 24, stagger: 0.04, duration: 0.5, ease: "power2.out", force3D: true,
        });
    }, { scope: container, dependencies: [ayahs] });

    const playingAyahInfo = playingAyah !== null ? ayahs.find(a => a.number === playingAyah) : null;

    return (
        <>
            <div ref={container} className="flex flex-col gap-5 max-w-4xl mx-auto pb-28">
                {/* Bismillah */}
                {surahNumber !== 1 && surahNumber !== 9 && (
                    <div className="text-center py-10">
                        <p className="text-3xl md:text-4xl font-arabic text-quran-green dark:text-quran-gold leading-relaxed">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-quran-gold/30 to-transparent mx-auto mt-4" />
                    </div>
                )}

                {ayahs.map((ayah) => (
                    <div
                        key={ayah.number}
                        id={`ayah-${ayah.numberInSurah}`}
                        className={cn(
                            "ayah-card rounded-2xl transition-all duration-300",
                            playingAyah === ayah.number
                                ? "ring-2 ring-quran-green-light/60 dark:ring-quran-gold/60 shadow-lg"
                                : "",
                            bookmarked === ayah.numberInSurah && playingAyah !== ayah.number
                                ? "ring-2 ring-quran-gold/40 shadow-md"
                                : ""
                        )}
                    >
                        <div className="ayah-card-bg rounded-2xl p-6 md:p-8 relative">

                            {/* Playing indicator */}
                            {playingAyah === ayah.number && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                                    <div className="w-1 h-3 bg-quran-green-light dark:bg-quran-gold rounded-full animate-pulse" />
                                    <div className="w-1 h-4 bg-quran-green-light dark:bg-quran-gold rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                                    <div className="w-1 h-2 bg-quran-green-light dark:bg-quran-gold rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                                </div>
                            )}

                            {/* Action bar */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-quran-green/8 dark:bg-quran-gold/10 text-quran-green dark:text-quran-gold font-bold text-sm">
                                    {ayah.numberInSurah}
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => playAudio(ayah.number, ayah.numberInSurah)}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            playingAyah === ayah.number
                                                ? "bg-quran-green-light/15 dark:bg-quran-gold/15 text-quran-green-light dark:text-quran-gold"
                                                : "hover:bg-foreground/5 text-foreground/40 hover:text-quran-green dark:hover:text-quran-gold"
                                        )}
                                        aria-label={playingAyah === ayah.number ? "إيقاف" : "تشغيل"}
                                    >
                                        {isLoading && playingAyah === ayah.number ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : playingAyah === ayah.number ? (
                                            <Pause className="w-5 h-5" />
                                        ) : (
                                            <Play className="w-5 h-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            bookmarked === ayah.numberInSurah
                                                ? "text-quran-gold"
                                                : "hover:bg-foreground/5 text-foreground/30 hover:text-quran-gold"
                                        )}
                                        aria-label="حفظ"
                                    >
                                        {bookmarked === ayah.numberInSurah ? (
                                            <BookmarkCheck className="w-5 h-5" />
                                        ) : (
                                            <Bookmark className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-border mb-5" />

                            {/* Arabic Text */}
                            <p
                                className="text-right text-3xl md:text-[2.6rem] leading-[2.6] md:leading-[2.6] font-arabic text-foreground mb-5"
                                dir="rtl"
                            >
                                {ayah.arabicText}
                            </p>

                            {/* Subtle divider */}
                            <div className="w-16 h-px bg-quran-gold/25 mx-auto my-3" />

                            {/* English Translation */}
                            <p className="text-center text-base md:text-lg text-foreground/50 font-light leading-relaxed">
                                {ayah.englishText}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Floating Audio Player Bar ── */}
            {playingAyah !== null && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4">
                    <div className="max-w-xl mx-auto bg-card rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl border border-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-quran-green/10 dark:bg-quran-gold/10 flex items-center justify-center flex-shrink-0">
                                <Volume2 className="w-4 h-4 text-quran-green dark:text-quran-gold" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold truncate">آية {playingAyahInfo?.numberInSurah}</p>
                                <p className="text-xs text-foreground/40">الشيخ مشاري العفاسي</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={stopAudio}
                                className="p-2.5 rounded-full bg-quran-green dark:bg-quran-gold text-white dark:text-quran-green-dark"
                                aria-label="إيقاف"
                            >
                                <Pause className="w-4 h-4" />
                            </button>
                            <button onClick={skipToNext} className="p-2 rounded-full hover:bg-foreground/5 text-foreground/50" aria-label="التالي">
                                <SkipForward className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setAutoPlay(!autoPlay)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all",
                                    autoPlay
                                        ? "bg-quran-green/10 dark:bg-quran-gold/10 text-quran-green dark:text-quran-gold"
                                        : "bg-foreground/5 text-foreground/30"
                                )}
                            >
                                {autoPlay ? "تلقائي ✓" : "تلقائي"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
