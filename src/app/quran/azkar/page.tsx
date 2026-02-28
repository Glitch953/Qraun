"use client";

import { useState } from "react";
import { Sparkles, Sun, Moon, CheckCircle2, Heart, Shield, Star, CloudMoon } from "lucide-react";
import { cn } from "@/lib/utils";

const AZKAR_DATA = {
    morning: [
        {
            id: 1,
            arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
            translation: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
            target: 1,
        },
        {
            id: 2,
            arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
            translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and unto You is the resurrection.",
            target: 1,
        },
        {
            id: 3,
            arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
            translation: "Glory is to Allah and praise is to Him, by the multitude of His creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.",
            target: 3,
        }
    ],
    evening: [
        {
            id: 101,
            arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
            translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
            target: 1,
        },
        {
            id: 102,
            arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
            translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and unto You is the return.",
            target: 1,
        }
    ],
    prayer: [
        {
            id: 201,
            arabic: "أستغفر الله (3 مرات). اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
            translation: "I seek Allah's forgiveness (3 times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
            target: 1,
        },
        {
            id: 202,
            arabic: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
            translation: "None has the right to be worshiped but Allah alone, Who has no partner. His is the dominion and His is the praise, and He is Able to do all things.",
            target: 1,
        }
    ],
    various: [
        {
            id: 301,
            arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
            translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
            target: 10,
        },
        {
            id: 302,
            arabic: "سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر",
            translation: "Glory be to Allah, and praise be to Allah, and there is no god but Allah, and Allah is most great.",
            target: 33,
        }
    ]
};

const CATEGORIES = [
    { id: "morning", name: "أذكار الصباح", icon: Sun },
    { id: "evening", name: "أذكار المساء", icon: Moon },
    { id: "prayer", name: "أذكار الصلاة", icon: Shield },
    { id: "various", name: "أذكار متنوعة", icon: Star },
];

export default function AzkarPage() {
    const [tab, setTab] = useState<keyof typeof AZKAR_DATA>("morning");
    const [counts, setCounts] = useState<Record<number, number>>({});

    const handleIncrement = (id: number, target: number) => {
        const current = counts[id] || 0;
        if (current < target) {
            setCounts({ ...counts, [id]: current + 1 });
            if (window.navigator?.vibrate) window.navigator.vibrate(50);
        }
    };

    const azkarList = AZKAR_DATA[tab];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-5xl md:text-6xl font-arabic text-quran-green dark:text-quran-gold leading-tight">
                    الأذكار اليومية
                </h1>
                <p className="text-foreground/40 text-sm tracking-widest uppercase font-light">Comprehensive Remembrances</p>

                {/* Tab Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setTab(cat.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all border",
                                tab === cat.id
                                    ? "bg-quran-gold/10 border-quran-gold/30 text-quran-gold shadow-lg"
                                    : "bg-card border-border text-foreground/40 hover:text-foreground/60"
                            )}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Azkar List */}
            <div className="grid grid-cols-1 gap-6">
                {azkarList.map((zekr) => {
                    const count = counts[zekr.id] || 0;
                    const isDone = count >= zekr.target;

                    return (
                        <div
                            key={zekr.id}
                            className={cn(
                                "ayah-card-bg p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 border border-border/60 cursor-pointer select-none",
                                isDone ? "opacity-60 grayscale-[0.5]" : "hover:border-quran-gold/30 hover:shadow-2xl"
                            )}
                            onClick={() => handleIncrement(zekr.id, zekr.target)}
                        >
                            {/* Progress Indicator */}
                            {zekr.target > 1 && (
                                <div className="absolute top-0 left-0 bottom-0 bg-quran-gold/5 transition-all duration-500" style={{ width: `${(count / zekr.target) * 100}%` }} />
                            )}

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-center">
                                {/* Counter Badge */}
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <div className={cn(
                                        "w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500",
                                        isDone
                                            ? "border-quran-green dark:border-quran-gold bg-quran-green/10 dark:bg-quran-gold/10 text-quran-green dark:text-quran-gold"
                                            : "border-border bg-foreground/5 text-foreground"
                                    )}>
                                        {isDone ? (
                                            <CheckCircle2 className="w-8 h-8" />
                                        ) : (
                                            <>
                                                <span className="text-2xl font-bold leading-none">{count}</span>
                                                <span className="text-[10px] uppercase tracking-widest mt-1 opacity-40">/ {zekr.target}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 space-y-4">
                                    <p className="text-2xl md:text-3xl font-arabic text-quran-green dark:text-quran-gold text-right leading-[1.8]" dir="rtl">
                                        {zekr.arabic}
                                    </p>
                                    <p className="text-sm md:text-base text-foreground/50 font-light leading-relaxed italic">
                                        {zekr.translation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reset Button */}
            <div className="flex flex-col items-center gap-4 mt-10">
                <button
                    onClick={() => setCounts({})}
                    className="text-xs uppercase tracking-widest font-bold text-foreground/20 hover:text-red-500/60 transition-colors"
                >
                    Reset All Counters
                </button>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <p className="text-[10px] text-foreground/20 uppercase tracking-[0.2em]">Crafted by WebFinity</p>
            </div>
        </div>
    );
}
