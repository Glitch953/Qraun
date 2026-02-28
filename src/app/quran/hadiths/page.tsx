import { Quote, Sparkles, Heart, BookOpen } from "lucide-react";

const HADITHS = [
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
        arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
        english: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.",
        narrator: "عن أبي هريرة رضي الله عنه",
        source: "صحيح مسلم"
    },
    {
        arabic: "تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ",
        english: "I have left among you two things; you will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Prophet.",
        narrator: "عن مالك بن أنس رضي الله عنه",
        source: "موطأ مالك"
    },
    {
        arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
        english: "A good word is charity.",
        narrator: "عن أبي هريرة رضي الله عنه",
        source: "صحيح البخاري"
    }
];

export default function HadithsPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-5xl md:text-6xl font-arabic text-quran-green dark:text-quran-gold leading-tight">
                    الأحاديث النبوية
                </h1>
                <p className="text-foreground/40 text-sm tracking-widest uppercase font-light">Prophetic Traditions</p>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-quran-gold/40 to-transparent mx-auto mt-6" />
            </div>

            {/* Hadiths Grid */}
            <div className="grid grid-cols-1 gap-6">
                {HADITHS.map((hadith, index) => (
                    <div
                        key={index}
                        className="ayah-card-bg p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden border border-border/60 hover:border-quran-gold/30 hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Quote className="w-24 h-24 text-quran-green dark:text-quran-gold rotate-180" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-quran-gold/5 text-quran-gold">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-quran-gold/60">Hadith {index + 1}</span>
                            </div>

                            <div className="space-y-6">
                                <p className="text-2xl md:text-[2.2rem] font-arabic text-quran-green dark:text-quran-gold leading-[1.8] text-right" dir="rtl">
                                    {hadith.arabic}
                                </p>
                                <div className="w-16 h-px bg-quran-gold/20 mr-0 ml-auto md:ml-0 md:mr-auto" />
                                <p className="text-lg text-foreground/50 font-light leading-relaxed italic">
                                    &ldquo;{hadith.english}&rdquo;
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-border/20 gap-4">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-3 h-3 text-red-500/40" />
                                    <span className="text-xs text-foreground/30 font-medium">{hadith.narrator}</span>
                                </div>
                                <span className="w-fit px-4 py-1.5 rounded-full bg-foreground/5 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] border border-border/40">
                                    {hadith.source}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Branding */}
            <div className="text-center pt-10 border-t border-border/20 opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-[0.5em] font-light">Powered by WebFinity</p>
            </div>
        </div>
    );
}
