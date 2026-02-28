import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SurahReader } from "@/components/SurahReader";

type Ayah = {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean | object;
};

type SurahEdition = {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
    edition: {
        identifier: string;
        language: string;
        name: string;
        englishName: string;
        format: string;
        type: string;
    };
};

async function getSurahData(id: string): Promise<SurahEdition[]> {
    const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih`,
        { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch surah data");
    }

    const data = await res.json();
    return data.data;
}

export default async function SurahPage({
    params,
}: {
    params: Promise<{ surahId: string }>;
}) {
    const surahId = (await params).surahId;
    const editions = await getSurahData(surahId);

    const arabicEdition = editions.find((e) => e.edition.language === "ar");
    const englishEdition = editions.find((e) => e.edition.language === "en");

    if (!arabicEdition || !englishEdition) {
        return <div>Error loading surah details.</div>;
    }

    const ayahs = arabicEdition.ayahs.map((arabicAyah, index) => ({
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        arabicText: arabicAyah.text,
        englishText: englishEdition.ayahs[index]?.text || "",
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/quran"
                            className="p-2 hover:bg-foreground/5 rounded-full transition-colors group"
                        >
                            <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-quran-green dark:text-quran-gold">
                                {arabicEdition.englishName}
                            </h1>
                            <p className="text-foreground/40 text-sm">
                                {arabicEdition.englishNameTranslation} • {arabicEdition.revelationType} • {arabicEdition.numberOfAyahs} آية
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-arabic text-quran-green dark:text-quran-gold">
                        {arabicEdition.name}
                    </h2>
                </div>
            </div>

            <SurahReader ayahs={ayahs} surahNumber={arabicEdition.number} />
        </div>
    );
}
