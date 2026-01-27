import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Ensure these assets exist in public/assets/ or similar
// Creating a helper to handle asset paths might be good if they differ
const playIcon = "/assets/play.svg";
const pauseIcon = "/assets/pause.svg";
const replayIcon = "/assets/replay_5.svg";
const forwardIcon = "/assets/forward_5.svg";

function PlaybackBar({ audio }: { audio: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(31);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Create audio element
    const audioElement = new Audio(audio || "/audio1.mp3");
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
        audioRef.current.currentTime - 5,
      );
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 5,
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-min gap-3">
      {/* Controls */}
      <div className="flex items-center gap-5">
        <div onClick={handleRewind} className="cursor-pointer">
          <Image src={replayIcon} alt="Rewind" width={25} height={25} />
        </div>
        <div onClick={handlePlayToggle} className="cursor-pointer">
          <Image
            src={isPlaying ? pauseIcon : playIcon}
            alt="Play"
            width={50}
            height={50}
          />
        </div>
        <div onClick={handleForward} className="cursor-pointer">
          <Image src={forwardIcon} alt="Skip" width={25} height={25} />
        </div>
      </div>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-9">0:{time < 10 ? "0" + time : time}</div>
        <div className="w-75 border">
          <div
            style={{ width: duration > 0 ? (time / duration) * 75 * 4 : 0 }}
            className="border"
          ></div>
        </div>
        <div>0:{duration}</div>
      </div>
    </div>
  );
}

export default PlaybackBar;
