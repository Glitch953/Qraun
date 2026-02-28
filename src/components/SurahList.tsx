"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, ChevronLeft } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type Surah = {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
};

export function SurahList({ surahs }: { surahs: Surah[] }) {
    const [search, setSearch] = useState("");
    const container = useRef<HTMLDivElement>(null);

    const filteredSurahs = surahs.filter(
        (surah) =>
            surah.englishName.toLowerCase().includes(search.toLowerCase()) ||
            surah.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
            surah.name.includes(search) ||
            surah.number.toString() === search
    );

    useGSAP(() => {
        gsap.from(".surah-card", {
            opacity: 0, y: 16, stagger: 0.025, duration: 0.35, ease: "power2.out", force3D: true,
        });
    }, { scope: container, dependencies: [filteredSurahs] });

    return (
        <div ref={container} className="w-full flex flex-col gap-6">
            {/* Search */}
            <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-foreground/25" />
                </div>
                <input
                    type="text"
                    placeholder="ابحث عن سورة... / Search Surah..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    dir="auto"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border focus:border-quran-gold/50 focus:outline-none transition-all text-base placeholder:text-foreground/25"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {filteredSurahs.map((surah) => (
                    <div key={surah.number} className="surah-card">
                        <Link
                            href={`/quran/${surah.number}`}
                            className="block surah-card-bg p-4 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                {/* Number */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-quran-green/8 dark:bg-quran-gold/8 text-quran-green dark:text-quran-gold font-bold text-sm flex-shrink-0">
                                    {surah.number}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-sm truncate group-hover:text-quran-green dark:group-hover:text-quran-gold transition-colors">
                                            {surah.englishName}
                                        </h3>
                                        <h2 className="text-lg font-arabic text-quran-green dark:text-quran-gold flex-shrink-0">
                                            {surah.name}
                                        </h2>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-xs text-foreground/40">
                                            {surah.englishNameTranslation}
                                        </p>
                                        <p className="text-[11px] text-foreground/30">
                                            {surah.revelationType} • {surah.numberOfAyahs} آية
                                        </p>
                                    </div>
                                </div>

                                <ChevronLeft className="w-4 h-4 text-foreground/15 group-hover:text-foreground/30 transition-colors flex-shrink-0 rtl:rotate-180" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredSurahs.length === 0 && (
                <div className="text-center py-20 text-foreground/30">
                    <p className="text-lg">لا توجد نتائج &quot;{search}&quot;</p>
                </div>
            )}
        </div>
    );
}
