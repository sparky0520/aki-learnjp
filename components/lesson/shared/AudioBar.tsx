"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

function AudioBar() {
  const timerRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);
  const [arr, setArr] = useState(
    Array.from({ length: 17 }, () => Math.random() * 2 - 1),
  );

  const handleSubmit = () => {};

  const handleStart = () => {
    if (!recording) {
      setRecording(true);
      timerRef.current = setInterval(() => {
        setArr((prev) => [...prev.slice(1), Math.random() * 2 - 1]);
      }, 475);
    }
  };

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center w-min gap-4">
      <div className="flex gap-2 items-end">
        <div className="border rounded-lg flex items-center gap-4 w-min h-12 px-3 py-2 bg-white">
          <div
            className="w-64 flex items-center gap-2 overflow-x-hidden"
            id="bar"
          >
            {arr.map((item, index) => (
              <div
                className="w-2 bg-black opacity-90 rounded-full"
                style={{ height: Math.abs(item) * 2 * 15 }}
                key={index}
              ></div>
            ))}
          </div>
          <button
            disabled={!recording}
            onClick={handleStart}
            className="disabled:cursor-not-allowed disabled:opacity-50 transition opacity-90"
          >
            {/* Using Next Image for assets */}
            <Image
              src="/assets/close.svg"
              alt="cancel"
              width={20}
              height={20}
              onClick={handleStop}
            />
          </button>
          <button onClick={recording ? handleSubmit : handleStart}>
            <Image
              src={recording ? "/assets/arrow_upward.svg" : "/assets/mic.svg"}
              alt="start"
              width={24}
              height={24}
              className="btn p-2 rounded-full opacity-90"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioBar;
