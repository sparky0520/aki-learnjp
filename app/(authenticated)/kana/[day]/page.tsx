"use client";

import { use, useEffect, useState, useRef } from "react";
import { getDayData, KanaDay } from "@/lib/kana-data";
import KanaCanvas, { KanaCanvasHandle } from "@/components/kana/KanaCanvas";
import AudioButton from "@/components/kana/AudioButton";
// import SpeechCheck from "@/components/kana/SpeechCheck";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the step type for the carousel
type ExerciseStep =
  | { type: "char"; content: string; romaji?: string }
  | { type: "word"; content: string; romaji: string }
  | { type: "sentence"; content: string; translation: string };

export default function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const router = useRouter();
  const canvasRef = useRef<KanaCanvasHandle>(null);
  // Unwrap params using React.use() or await (but in client component with async prop is tricky in standard React,
  // Next.js 15 allows `params` as Promise in Page props.
  // However, for client components, strict typing might need `use` hook or `await` in parent or treat as standard prop if not async.
  // In Next.js 15 app router `params` is a Promise.
  // Safe way: usage of `use` hook (available in React "actions" but also standard in 19 for promises).
  // Or simply await it if the component was async (Server Component), but this is a Client Component.
  // Actually, client page components receive `params` as a Promise in Next.js 15.
  // Let's use `use(params)` pattern.

  const { day } = use(params);
  const dayNum = parseInt(day);

  const [data, setData] = useState<KanaDay | null>(null);
  const [steps, setSteps] = useState<ExerciseStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const d = getDayData(dayNum);
    if (d) {
      setData(d);

      // Build steps
      const newSteps: ExerciseStep[] = [];

      // Add chars
      // Chars in CSV data like "あ" or "あ (a)"?
      // The data has clean chars in array. Romaji is not explicitly in `chars` array in `KANA_DATA`
      // (some entries have it, but standard ones don't).
      // I might need a look up or just infer execution.
      // For simplicity, let's just show content.
      // Actually `KANA_DATA` `chars` are "あ", "い"...
      // Wait, `KANA_DATA` definition: `chars: string[]`.
      // Some chars might include parens based on my manual review of `lib/kana-data.ts`.
      // Let's clean them if needed.
      d.chars.forEach((c) => newSteps.push({ type: "char", content: c }));

      d.words.forEach((w) =>
        newSteps.push({ type: "word", content: w.text, romaji: w.romaji }),
      );

      if (d.sentence) {
        newSteps.push({
          type: "sentence",
          content: d.sentence.text,
          translation: d.sentence.translation,
        });
      }

      setSteps(newSteps);
    }
  }, [dayNum]);

  const handleNext = () => {
    canvasRef.current?.clearCanvas();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      finishDay();
    }
  };

  const handlePrev = () => {
    canvasRef.current?.clearCanvas();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const finishDay = () => {
    const saved = localStorage.getItem("kana-learning-progress");
    const completedDays: number[] = saved ? JSON.parse(saved) : [];
    if (!completedDays.includes(dayNum)) {
      completedDays.push(dayNum);
      localStorage.setItem(
        "kana-learning-progress",
        JSON.stringify(completedDays),
      );
    }
    setCompleted(true);
  };

  if (!data || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink">
        Loading...
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-ink p-6 space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-green-200">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-center">
          Day {dayNum} Completed!
        </h1>
        <p className="text-gray-600 font-medium">Great job practicing today.</p>
        <div className="flex gap-4">
          <Link
            href="/kana"
            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-bold text-gray-700 shadow-sm"
          >
            Back to Menu
          </Link>
          <Link
            href={`/kana/${dayNum < 31 ? dayNum + 1 : 1}`}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors font-bold shadow-md hover:shadow-lg"
          >
            Next Day
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen text-ink flex flex-col">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between">
        <Link
          href="/kana"
          className="p-2 hover:bg-gray-200/50 rounded-full text-gray-500 hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 font-medium">
            Day {dayNum}
          </span>
          <span className="font-bold text-lg">{data.title}</span>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-200 w-full">
        <div
          className="h-full bg-blue-400 transition-all duration-300 rounded-r-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 max-w-2xl mx-auto w-full space-y-12">
        {/* Step Info */}
        <div className="text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {currentStep.type === "char"
              ? "Character"
              : currentStep.type === "word"
                ? "Word"
                : "Sentence"}
          </span>
          <h2 className="text-7xl sm:text-9xl font-bold tracking-tight text-ink drop-shadow-sm font-jp">
            {currentStep.content}
          </h2>
          {/* Subtext (Romaji/Translation) */}
          <div className="text-2xl text-gray-500 font-medium h-8">
            {currentStep.type === "char" && currentStep.romaji}
            {currentStep.type === "word" && currentStep.romaji}
            {currentStep.type === "sentence" && currentStep.translation}
          </div>
        </div>

        {/* Interactive Area */}
        <div className="w-full space-y-8">
          {/* Audio & Mic Controls */}
          <div className="flex items-center justify-center gap-6 relative z-10 pb-8">
            <AudioButton
              key={`audio-${currentStep.content}`}
              text={currentStep.content}
              romaji={
                currentStep.type !== "sentence"
                  ? (currentStep as any).romaji
                  : undefined
              }
              className="scale-125"
            />
            {/*
            TODO: Re-add speech check without Web API
            <SpeechCheck
              key={`mic-${currentStep.content}`}
              targetText={currentStep.content}
            /> */}
          </div>

          {/* Canvas */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wide">
                Practice Writing
              </span>
            </div>
            <KanaCanvas ref={canvasRef} />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 flex items-center justify-between max-w-2xl mx-auto w-full pb-12">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
            currentStepIndex === 0
              ? "opacity-0 pointer-events-none"
              : "hover:bg-gray-100 text-gray-500 hover:text-ink"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <span className="text-gray-400 text-sm font-mono">
          {currentStepIndex + 1} / {steps.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg transform active:scale-95"
        >
          {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
