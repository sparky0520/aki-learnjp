"use client";

import { useState } from "react";
import PlaybackBar from "./PlaybackBar";
import { useAnswers } from "../contexts/AnswersContext";

function ListeningWritingMondai3({ data }: { data: any }) {
  const { setAnswers } = useAnswers();
  const [one, setOne] = useState("　");
  const [two, setTwo] = useState("　");
  const [three, setThree] = useState("　");

  if (!data) {
    return <div>Loading...</div>;
  }

  const audio = data.audio_url || "";

  const updateAnswer = (part: number, val: string) => {
      setAnswers((prev: any) => ({
          ...prev,
          [part]: val
      }));
  }

  const handleClick = (e: any) => {
    let ans = "○";
    // Logic: if blank or X -> O, else X
    
    // Helper
    const toggle = (current: string) => current === "　" || current === "×" ? "○" : "×";

    const id = e.target.id;
    if (id === "1") {
        const newVal = toggle(one);
        setOne(newVal);
        updateAnswer(1, newVal);
    } else if (id === "2") {
        const newVal = toggle(two);
        setTwo(newVal);
        updateAnswer(2, newVal);
    } else if (id === "3") {
        const newVal = toggle(three);
        setThree(newVal);
        updateAnswer(3, newVal);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Audio */}
      <PlaybackBar audio={audio} />
      {/* Text */}
      <div>{data.text_content}</div>
      <div className="text-lg font-extrabold opacity-90">
        <ruby>
          例<rt>れい</rt>
        </ruby>
        １：（×）
        <ruby>
          例<rt>れい</rt>
        </ruby>
        ２：（○）
      </div>
      {/* Input */}
      <div className="flex gap-5 mt-4">
        <div
          id="1"
          className="select-none text-2xl font-extrabold opacity-90 p-2 cursor-pointer"
          onClick={handleClick}
        >
          １）（{one}）
        </div>
        <div
          id="2"
          className="select-none text-2xl font-extrabold opacity-90 p-2 cursor-pointer"
          onClick={handleClick}
        >
          ２）（{two}）
        </div>
        <div
          id="3"
          className="select-none text-2xl font-extrabold opacity-90 p-2 cursor-pointer"
          onClick={handleClick}
        >
          ３）（{three}）
        </div>
      </div>
    </div>
  );
}

export default ListeningWritingMondai3;
