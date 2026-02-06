"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function Shuuryou({
  lessonNo,
  page = undefined,
}: {
  lessonNo: number;
  page?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!page) {
    return (
      <div className="text-lg font-extrabold opacity-90 hover:opacity-100 my-4"></div>
    );
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div
      className="text-sm opacity-70 hover:opacity-100 mb-4 cursor-pointer select-none"
      onClick={toggleAudio}
    >
      <audio
        ref={audioRef}
        src={`/audio/help/help_${page}.mp3`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-2">
        <Image
          src={isPlaying ? "/assets/close.svg" : "/assets/volume_up.svg"}
          alt={isPlaying ? "Stop" : "Play"}
          width={16}
          height={16}
          className="opacity-70"
        />
        <div>{isPlaying ? "Stop instructions" : "Play instructions"}</div>
      </div>
    </div>
  );
}

export default Shuuryou;
