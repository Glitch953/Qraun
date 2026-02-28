import { MapPin, Clock, Sun, Sunrise, Sunset, Moon, CloudMoon } from "lucide-react";

async function getPrayerTimes() {
    const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi Arabia&method=4`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch prayer times");
    }

    const data = await res.json();
    return data.data;
}

const ArabicNames: Record<string, string> = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
};

const PrayerIcons: Record<string, any> = {
    Fajr: CloudMoon,
    Sunrise: Sunrise,
    Dhuhr: Sun,
    Asr: Sun,
    Maghrib: Sunset,
    Isha: Moon,
};

export default async function PrayerTimesPage() {
    const prayerData = await getPrayerTimes();
    const timings = prayerData.timings;

    const prayers = [
        { name: "Fajr", time: timings.Fajr },
        { name: "Sunrise", time: timings.Sunrise },
        { name: "Dhuhr", time: timings.Dhuhr },
        { name: "Asr", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isha", time: timings.Isha },
    ];

    const dateStr = prayerData.date.readable;
    const hijri = prayerData.date.hijri;
    const hijriStr = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-5xl md:text-6xl font-arabic text-quran-green dark:text-quran-gold leading-tight">
                    مواقيت الصلاة
                </h1>
                <div className="flex items-center justify-center gap-2 text-foreground/40 text-sm md:text-base">
                    <MapPin className="w-4 h-4 text-quran-gold/60" />
                    <p className="tracking-widest uppercase font-light">Makkah, Saudi Arabia</p>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="bg-quran-gold/10 px-4 py-1.5 rounded-full border border-quran-gold/20">
                        <span className="text-xs font-bold text-quran-gold tracking-widest uppercase">{dateStr}</span>
                    </div>
                    <div className="bg-quran-green/10 dark:bg-quran-gold/10 px-4 py-1.5 rounded-full border border-quran-green/20 dark:border-quran-gold/20">
                        <span className="text-sm font-arabic text-quran-green dark:text-quran-gold">{hijriStr}</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {prayers.map((prayer) => {
                    const Icon = PrayerIcons[prayer.name] || Clock;
                    return (
                        <div
                            key={prayer.name}
                            className="ayah-card-bg p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:shadow-xl transition-all border border-border/50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-quran-green/5 dark:bg-quran-gold/5 flex items-center justify-center text-quran-green dark:text-quran-gold group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-arabic text-quran-green dark:text-quran-gold">
                                        {ArabicNames[prayer.name]}
                                    </h3>
                                    <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] mt-1 font-bold">
                                        {prayer.name}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex items-baseline justify-between border-t border-border/40 pt-6">
                                <span className="text-sm text-foreground/30 font-medium">Time</span>
                                <span className="text-3xl font-bold tracking-tight text-quran-green dark:text-white">
                                    {prayer.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="p-8 surah-card-bg rounded-3xl text-center border border-border/40 max-w-2xl mx-auto mt-12">
                <p className="text-foreground/40 text-sm leading-relaxed">
                    Default location is set to <strong>Makkah al-Mukarramah</strong>. <br className="hidden md:block" />
                    In a production build, this dynamically adjusts to your local timezone and location.
                </p>
            </div>
        </div>
    );
}
