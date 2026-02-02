"use client";

import { useState, useRef } from "react";
import { Check, X, Mic } from "lucide-react";

interface SpeechCheckProps {
  targetText: string;
}

// Define basic interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function SpeechCheck({ targetText }: SpeechCheckProps) {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (
      typeof window === "undefined" ||
      !(window as any).webkitSpeechRecognition
    ) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;

      rec.continuous = false;
      rec.lang = "ja-JP";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
        setResult(null);
        setIsMatch(null);
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setResult(text);

        // Normalize for comparison (remove punctuation, whitespace)
        // Japanese punctuation: 。 、
        const cleanInput = text.replace(/[ 。、]/g, "").trim();
        const cleanTarget = targetText.replace(/[ 。、]/g, "").trim();

        const match =
          cleanInput === cleanTarget || cleanTarget.includes(cleanInput);
        setIsMatch(match);
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "no-speech") {
          setError("No speech detected. Try again.");
        } else if (event.error === "network") {
          setError("Network error. Please check your connection.");
        } else if (event.error === "not-allowed") {
          setError("Microphone access denied.");
        } else {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition", err);
      setError("Failed to start microphone.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <button
        onClick={startListening}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
          isListening
            ? "bg-red-50 border-red-400 animate-pulse"
            : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
        } ${!!error && error !== "No speech detected. Try again." ? "opacity-50" : ""}`}
      >
        <div className="relative w-8 h-8">
          <Mic
            className={`w-full h-full text-ink ${isListening ? "" : "opacity-60"}`}
          />
        </div>
        {isListening && (
          <span className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin"></span>
        )}
      </button>

      <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-max min-h-8 text-center px-4 pointer-events-none">
        {result && (
          <div
            className={`flex items-center justify-center gap-2 text-lg font-bold ${isMatch ? "text-green-400" : "text-red-400"}`}
          >
            {isMatch ? (
              <Check className="w-6 h-6 shrink-0" />
            ) : (
              <X className="w-6 h-6 shrink-0" />
            )}
            <span className="break-all">{result}</span>
          </div>
        )}
        {!result && isListening && (
          <span className="text-gray-500 font-medium animate-pulse">
            Listening...
          </span>
        )}
        {error && (
          <span className="text-red-500 text-sm font-bold bg-red-50 px-2 py-1 rounded">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
