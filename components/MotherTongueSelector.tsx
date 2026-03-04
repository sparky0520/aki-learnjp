"use client";

import React from "react";
import { useAki } from "@/contexts/lesson/AkiContext";

export function MotherTongueSelector() {
    const { languagePreference, setLanguagePreference } = useAki()!;

    const languages = [
        { code: "en", name: "English", icon: "🇮🇳" },
        { code: "hi", name: "Hindi", icon: "🇮🇳" },
        { code: "mr", name: "Marathi", icon: "🇮🇳" },
        { code: "bn", name: "Bengali", icon: "🇮🇳" },
        { code: "te", name: "Telugu", icon: "🇮🇳" },
        { code: "ta", name: "Tamil", icon: "🇮🇳" },
        { code: "ja", name: "Japanese", icon: "🇯🇵" },
    ];

    return (
        <div className="flex flex-col gap-2 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Explanation Language
            </label>
            <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguagePreference(lang.code)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${languagePreference === lang.code
                            ? "bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20 scale-105"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                    >
                        <span className="mr-2">{lang.icon}</span>
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
