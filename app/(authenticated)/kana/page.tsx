"use client";

import { KANA_DATA } from "@/lib/kana-data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoveRight, Lock, CheckCircle2 } from "lucide-react";

export default function KanaProgressPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kana-learning-progress");
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen p-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-ink">Learn Japanese Kana</h1>
          <p className="text-gray-600 text-lg max-w-2xl font-medium">
            Master Hiragana and Katakana in 31 days. A step-by-step journey to
            reading and writing Japanese.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {KANA_DATA.map((day) => {
            const isCompleted = completedDays.includes(day.day);
            // Optional: Lock future days? For now, open all.
            // const isLocked = !isCompleted && day.day > 1 && !completedDays.includes(day.day - 1);
            const isLocked = false;

            return (
              <Link
                href={isLocked ? "#" : `/kana/${day.day}`}
                key={day.day}
                className={`group relative p-6 paper-card rounded-xl transition-all duration-300 ${
                  isCompleted
                    ? "border-green-400/50 hover:border-green-400"
                    : isLocked
                      ? "opacity-60 cursor-not-allowed bg-gray-100"
                      : "hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/10"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full border ${
                      isCompleted
                        ? "bg-green-100 border-green-200 text-green-700"
                        : "bg-gray-100 border-gray-200 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
                    }`}
                  >
                    Day {day.day}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                  {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                </div>

                <h3 className="text-xl font-bold mb-2 text-ink transition-colors">
                  {day.title}
                </h3>

                <div className="text-gray-500 text-sm mb-4 font-medium">
                  {day.chars.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {day.chars.slice(0, 5).map((c) => (
                        <span key={c} className="inline-block">
                          {c.split(" ")[0]}
                        </span>
                      ))}
                      {day.chars.length > 5 && <span>...</span>}
                    </div>
                  ) : (
                    <span>Review & Practice</span>
                  )}
                </div>

                {!isLocked && (
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <MoveRight className="w-5 h-5 text-blue-400" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
