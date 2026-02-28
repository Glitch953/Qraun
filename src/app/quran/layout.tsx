"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { BookOpen, Sparkles, Heart, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function QuranLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const NAV_LINKS = [
        { href: "/quran", label: "القرآن", labelEn: "Quran" },
        { href: "/quran/hadiths", label: "الأحاديث", labelEn: "Hadiths" },
        { href: "/quran/azkar", label: "الأذكار", labelEn: "Azkar" },
        { href: "/quran/tasbih", label: "التسبيح", labelEn: "Tasbih" },
        { href: "/quran/prayer-times", label: "مواقيت الصلاة", labelEn: "Prayer" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-[118px] lg:pt-[70px]">
            {/* ── Fixed Header ── */}
            <header className="fixed top-0 left-0 right-0 h-auto min-h-[70px] lg:h-[70px] realistic-header z-50 border-b border-white/5 backdrop-blur-md">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/quran" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-quran-green to-quran-green-light dark:from-quran-gold-dark dark:to-quran-gold flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                                <BookOpen className="w-5 h-5 text-white dark:text-quran-green-dark" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-base font-bold text-white leading-tight">القرآن الكريم</h1>
                                <p className="text-[10px] text-quran-gold/60 tracking-widest uppercase font-light">The Noble Quran</p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all relative overflow-hidden group",
                                        pathname === link.href
                                            ? "text-white bg-white/10"
                                            : "text-white/50 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {pathname === link.href && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-quran-gold" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>

                {/* ── Mobile Horizontal Scroll Nav ── */}
                <div className="lg:hidden w-full border-t border-white/5 overflow-x-auto no-scrollbar bg-black/20">
                    <div className="flex items-center gap-1 px-4 py-3 min-w-max">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap",
                                    pathname === link.href
                                        ? "bg-quran-gold text-quran-green-dark shadow-lg shadow-quran-gold/20"
                                        : "text-white/60 hover:text-white"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

            </header>

            {/* ── Main Content ── */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* ── Branding Footer ── */}
            <footer className="w-full py-12 px-4 border-t border-border/40 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-quran-green to-quran-green-light dark:from-quran-gold-dark dark:to-quran-gold flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                                <BookOpen className="w-5 h-5 text-white dark:text-quran-green-dark" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] text-foreground/30 uppercase tracking-widest leading-tight">Developed & Managed by</p>
                                <div className="flex items-center gap-2">
                                    <a
                                        href="https://my-markt3-5ag6o.sevalla.page/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-black tracking-widest text-foreground leading-tight hover:text-quran-gold transition-colors inline-block"
                                    >
                                        WEBFINTY
                                    </a>
                                    <a href="https://www.instagram.com/webfinity.team/" target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-quran-gold transition-colors">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-foreground/30 font-light text-center md:text-left">
                            &copy; {new Date().getFullYear()} Quran App. All spiritual rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="text-[11px] font-bold uppercase tracking-widest text-foreground/20 hover:text-quran-gold transition-colors">
                                {link.labelEn}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-foreground/5 border border-border/40">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Server Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
