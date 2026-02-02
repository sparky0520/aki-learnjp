"use client";

import { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";

interface AudioButtonProps {
  text: string;
  romaji?: string;
  className?: string;
}

export default function AudioButton({
  text,
  romaji,
  className = "",
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const playAudio = () => {
    if (!window.speechSynthesis) return;

    // Always cancel previous utterance to prevent queue stuck issues
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP"; // Japanese
    utterance.rate = 1; //0.8; // Slightly slower for learning

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("Audio playback error", e);
      setIsPlaying(false);
    };

    // Try to find a Japanese voice
    const jaVoice = voices.find(
      (v) => v.lang === "ja-JP" || v.lang.includes("ja"),
    );
    if (jaVoice) {
      utterance.voice = jaVoice;
    } else {
      console.warn("No Japanese voice found. Using default.");
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={playAudio}
      className={`flex items-center gap-4 p-3 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded-full transition-all group shadow-sm hover:shadow-md ${className}`}
    >
      <div
        className={`relative w-6 h-6 transition-transform duration-300 ${isPlaying ? "scale-110" : ""}`}
      >
        <Volume2
          className={`w-full h-full text-ink opacity-70 group-hover:opacity-100 ${isPlaying ? "animate-pulse" : ""}`}
        />
      </div>
      {romaji && (
        <span className="text-gray-500 group-hover:text-blue-500 font-bold">
          {romaji}
        </span>
      )}
    </button>
  );
}
