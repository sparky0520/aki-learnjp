"use client";

import { useEffect, useState } from "react";
import { KANA_DATA } from "@/lib/kana-data";
import Link from "next/link";
import { X } from "lucide-react";

export default function KanaPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("kana-popup-dismissed");
    if (dismissed === "true") return;

    const saved = localStorage.getItem("kana-learning-progress");
    const completedDays: number[] = saved ? JSON.parse(saved) : [];

    if (completedDays.length < KANA_DATA.length) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (dontShowAgain: boolean) => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem("kana-popup-dismissed", "true");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => handleDismiss(false)}
      />

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => handleDismiss(false)}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Master Japanese Kana!
        </h3>

        <p className="text-gray-600 mb-6">
          You haven&apos;t completed your Kana learning journey yet. Master
          Hiragana and Katakana to build a strong foundation.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/kana"
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-center transition-colors shadow-md hover:shadow-lg"
          >
            Continue Learning
          </Link>

          <button
            onClick={() => handleDismiss(true)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Don&apos;t show this again
          </button>
        </div>
      </div>
    </div>
  );
}
