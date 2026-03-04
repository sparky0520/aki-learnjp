"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAki } from "@/contexts/lesson/AkiContext";

export function MotherTongueSelector() {
    const { languagePreference, setLanguagePreference } = useAki()!;
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", name: "English", icon: "🇺🇸" },
        { code: "hi", name: "Hindi", icon: "🇮🇳" },
        { code: "mr", name: "Marathi", icon: "🇮🇳" },
        { code: "bn", name: "Bengali", icon: "🇮🇳" },
        { code: "te", name: "Telugu", icon: "🇮🇳" },
        { code: "ta", name: "Tamil", icon: "🇮🇳" },
        { code: "ja", name: "Japanese", icon: "🇯🇵" },
    ];

    // Wait until mounted to avoid hydration mismatch when reading from localStorage
    useEffect(() => {
        setMounted(true);
    }, []);

    const currentLang = languages.find((lang) => lang.code === languagePreference) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return (
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Explanation Language
                </label>
                <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200" ref={dropdownRef}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Explanation Language
            </label>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-gray-50 rounded border border-gray-300 transition-colors text-sm font-medium text-gray-900 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <span>{currentLang.icon}</span>
                        <span>{currentLang.name}</span>
                    </div>
                    <svg
                        className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-50 bottom-full left-0 right-0 mb-1 py-1 bg-white rounded border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-5">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguagePreference(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${languagePreference === lang.code
                                        ? "bg-amber-50 text-amber-900 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span>{lang.icon}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
