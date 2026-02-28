"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-full relative w-9 h-9 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-transparent"></div>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative flex items-center justify-center w-9 h-9"
            aria-label="Toggle theme"
        >
            <Sun
                className={`absolute h-5 w-5 transition-all text-quran-green-dark dark:text-quran-gold ${theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
                    }`}
            />
            <Moon
                className={`absolute h-5 w-5 transition-all text-quran-gold ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                    }`}
            />
        </button>
    );
}
