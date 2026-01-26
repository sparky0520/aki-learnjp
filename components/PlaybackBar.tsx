"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

function PlaybackBar({ audio }: { audio?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(31);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Create audio element
    const audioUrl = audio || "/audio1.mp3"; // Adjust fallback if needed
    const audioElement = new Audio(audioUrl);
    audioRef.current = audioElement;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(Math.floor(audioElement.duration));
    };

    const handleTimeUpdate = () => {
      setTime(Math.floor(audioElement.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setTime(0);
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    // Cleanup
    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.pause();
    };
  }, [audio]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5
      );
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 5
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-min gap-3">
      {/* Controls */}
      <div className="flex items-center gap-5">
        <div onClick={handleRewind} className="cursor-pointer">
          <Image src="/assets/replay_5.svg" alt="Rewind" width={25} height={25} />
        </div>
        <div onClick={handlePlayToggle} className="cursor-pointer">
          <Image 
            src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"} 
            alt="Play" 
            width={50} height={50} 
          />
        </div>
        <div onClick={handleForward} className="cursor-pointer">
          <Image src="/assets/forward_5.svg" alt="Skip" width={25} height={25} />
        </div>
      </div>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-9 text-xs">0:{time < 10 ? "0" + time : time}</div>
        <div className="w-75 border h-2 bg-white rounded-full relative">
           {/* Static width 75 units approx 300px? Tailwind w-75 not standard, using custom style or width */}
          <div className="w-[300px] bg-gray-200 h-full rounded-full overflow-hidden relative">
              <div
                style={{ width: `${(time / (duration || 1)) * 100}%` }}
                className="bg-black h-full opacity-50"
              ></div>
          </div>
        </div>
        <div className="text-xs">0:{duration}</div>
      </div>
    </div>
  );
}

export default PlaybackBar;
