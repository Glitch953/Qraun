import { SurahList, Surah } from "@/components/SurahList";
import { BookOpen, Quote, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

async function getSurahs(): Promise<Surah[]> {
    const res = await fetch("https://api.alquran.cloud/v1/surah", {
        next: { revalidate: 86400 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch surahs");
    }

    const data = await res.json();
    return data.data;
}

// Static high-quality Hadith selection for "Premium" feel and reliability
const DAILY_HADITHS = [
    {
        arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        english: "Actions are but by intentions, and every man shall have only that which he intended.",
        narrator: "عن عمر بن الخطاب رضي الله عنه",
        source: "صحيح البخاري ومسلم"
    },
    {
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        english: "The best among you are those who learn the Quran and teach it.",
        narrator: "عن عثمان بن عفان رضي الله عنه",
        source: "صحيح البخاري"
    },
    {
        arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        english: "None of you will truly believe until you love for your brother what you love for yourself.",
        narrator: "عن أنس بن مالك رضي الله عنه",
        source: "صحيح البخاري ومسلم"
    },
    {
        arabic: "الدِّينُ النَّصِيحَةُ",
        english: "Religion is sincere advice (Nasihah).",
        narrator: "عن تميم الداري رضي الله عنه",
        source: "صحيح مسلم"
    }
];

export default async function QuranDashboard() {
    const surahs = await getSurahs();

    // Pick a hadith based on the day of the year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const hadith = DAILY_HADITHS[dayOfYear % DAILY_HADITHS.length];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12 pt-4">
                <h1 className="text-5xl md:text-7xl font-arabic text-quran-green dark:text-quran-gold leading-tight">
                    القرآن الكريم
                </h1>
                <div className="flex items-center justify-center gap-2 text-foreground/40 text-sm md:text-base">
                    <Sparkles className="w-4 h-4 text-quran-gold/60" />
                    <p className="tracking-[0.2em] uppercase font-light">The Noble Quran</p>
                    <Sparkles className="w-4 h-4 text-quran-gold/60" />
                </div>
                <div className="w-40 h-px bg-gradient-to-r from-transparent via-quran-gold/40 to-transparent mx-auto mt-6" />
            </div>

            {/* Quick Actions & Hadith */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hadith of the Day Card */}
                <div className="lg:col-span-8">
                    <div className="ayah-card-bg rounded-3xl p-6 md:p-8 h-full relative overflow-hidden flex flex-col justify-center border border-border/60">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Quote className="w-32 h-32 text-quran-green dark:text-quran-gold rotate-180" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-quran-gold/10 text-quran-gold">
                                    <Heart className="w-4 h-4 fill-current" />
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase text-quran-gold">Hadith of the Day</span>
                            </div>

                            <div className="space-y-4">
                                <p className="text-2xl md:text-3xl font-arabic text-quran-green dark:text-quran-gold leading-relaxed text-right" dir="rtl">
                                    {hadith.arabic}
                                </p>
                                <p className="text-lg text-foreground/60 italic font-light leading-relaxed">
                                    &ldquo;{hadith.english}&rdquo;
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                <span className="text-xs text-foreground/30">{hadith.narrator}</span>
                                <span className="px-3 py-1 rounded-full bg-foreground/5 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                                    {hadith.source}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                    <Link href="/quran/azkar" className="surah-card-bg group p-6 rounded-3xl border border-border/40 hover:border-quran-gold/30 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-quran-green/10 dark:bg-quran-gold/10 flex items-center justify-center text-quran-green dark:text-quran-gold group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mt-4 md:mt-8 group-hover:text-quran-green dark:group-hover:text-quran-gold transition-colors">Azkar</h3>
                            <p className="text-sm text-foreground/40 mt-1">Morning & Evening Prayers</p>
                        </div>
                    </Link>

                    <Link href="/quran/tasbih" className="surah-card-bg group p-6 rounded-3xl border border-border/40 hover:border-quran-gold/30 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-quran-green/10 dark:bg-quran-gold/10 flex items-center justify-center text-quran-green dark:text-quran-gold group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mt-4 md:mt-8 group-hover:text-quran-green dark:group-hover:text-quran-gold transition-colors">Tasbih</h3>
                            <p className="text-sm text-foreground/40 mt-1">Digital Dhikr Counter</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Surah List Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-1 h-6 bg-quran-gold rounded-full" />
                        Surahs
                    </h2>
                    <span className="text-sm text-foreground/30 font-medium">114 Surahs total</span>
                </div>
                <SurahList surahs={surahs} />
            </div>
        </div>
    );
}
