"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Sparkles, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TasbihPage() {
    const [count, setCount] = useState(0);
    const [goal, setGoal] = useState(33);
    const [isPressed, setIsPressed] = useState(false);

    const increment = useCallback(() => {
        setCount((c) => c + 1);
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
        if (window.navigator?.vibrate) window.navigator.vibrate(40);
    }, []);

    const reset = () => {
        setCount(0);
    };

    const setTarget = (val: number) => {
        setGoal(val);
        setCount(0);
    };

    const progress = Math.min((count / goal) * 100, 100);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in duration-700 max-w-4xl mx-auto pb-20 px-4">
            {/* Header */}
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-5xl md:text-6xl font-arabic text-quran-green dark:text-quran-gold leading-tight">
                    المسبحة الإلكترونية
                </h1>
                <div className="flex items-center justify-center gap-2 text-foreground/40 text-sm tracking-widest uppercase font-light">
                    <Sparkles className="w-4 h-4 text-quran-gold/60" />
                    <p>Digital Dhikr Counter</p>
                    <Sparkles className="w-4 h-4 text-quran-gold/60" />
                </div>
            </div>

            {/* Main Tasbih UI */}
            <div className="ayah-card-bg p-8 md:p-14 rounded-[4rem] w-full max-w-md flex flex-col items-center shadow-2xl relative border border-border/40 overflow-hidden">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-quran-gold)_1px,_transparent_1px)] bg-[size:24px_24px]" />
                </div>

                {/* Target Selector */}
                <div className="flex bg-foreground/5 p-1 rounded-2xl mb-12 relative z-10">
                    {[33, 99, 100, 1000].map((val) => (
                        <button
                            key={val}
                            onClick={() => setTarget(val)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                                goal === val
                                    ? "bg-white dark:bg-quran-gold text-quran-green-dark dark:text-quran-green-dark shadow-sm scale-105"
                                    : "text-foreground/40 hover:text-foreground/60"
                            )}
                        >
                            {val === 1000 ? "∞" : val}
                        </button>
                    ))}
                </div>

                {/* The Counter Display */}
                <div className="relative mb-12 flex flex-col items-center">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.4em] text-quran-gold font-bold opacity-60">
                        Current Count
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-8xl font-bold tracking-tighter text-quran-green dark:text-white transition-all duration-300">
                            {count}
                        </span>
                        <span className="text-xl font-medium text-foreground/20 italic">
                            / {goal === 1000 ? "∞" : goal}
                        </span>
                    </div>

                    {/* Tiny Progress Bar */}
                    <div className="w-40 h-1 bg-foreground/5 rounded-full mt-6 overflow-hidden">
                        <div
                            className="h-full bg-quran-gold transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* The Big Button */}
                <div className="relative flex justify-center items-center">
                    {/* Ring Outer Effect */}
                    <div className={cn(
                        "absolute w-40 h-40 rounded-full border border-quran-gold/20 transition-all duration-500",
                        isPressed ? "scale-125 opacity-0" : "scale-100 opacity-100"
                    )} />

                    <button
                        onClick={increment}
                        className={cn(
                            "w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-150 relative z-10 active:scale-90",
                            isPressed
                                ? "bg-quran-green-light dark:bg-white scale-95"
                                : "bg-gradient-to-tr from-quran-green to-quran-green-light dark:from-quran-gold-dark dark:to-quran-gold"
                        )}
                        aria-label="سبح"
                    >
                        <div className="w-24 h-24 rounded-full border border-white/20 flex flex-col items-center justify-center text-white dark:text-quran-green-dark">
                            <Fingerprint className={cn("w-10 h-10 transition-all", isPressed ? "scale-110 opacity-60" : "opacity-100")} />
                        </div>
                    </button>

                    {/* Reset Button (Beside main button) */}
                    <button
                        onClick={reset}
                        className="absolute -right-20 p-4 rounded-full bg-foreground/5 text-foreground/20 hover:text-red-500/60 hover:bg-red-500/5 transition-all active:scale-90"
                        aria-label="إعادة ضبط"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                <p className="mt-12 text-[11px] text-foreground/30 text-center italic tracking-wide">
                    &ldquo;Ala bidhikrillaahi tatma'innul quloob&rdquo; <br />
                    (Verily, in the remembrance of Allah do hearts find rest)
                </p>
            </div>
        </div>
    );
}
