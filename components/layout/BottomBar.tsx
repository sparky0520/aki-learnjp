"use client";

import { useContext } from "react";
import AskAkiContext from "../../contexts/lesson/AkiContext";
import Image from "next/image";

interface BottomBarProps {
  handleNext?: () => void;
  handlePrev?: () => void;
  currentQuestion?: number;
  finalQuestion?: number;
  nextFlag?: boolean;
  reading?: boolean;
}

function BottomBar({
  handleNext,
  handlePrev,
  currentQuestion,
  finalQuestion,
  nextFlag,
  reading = false,
}: BottomBarProps) {
  const { askAki, toggleAskAki } = useContext(AskAkiContext);

  return (
    <div className="flex justify-between items-center sticky bottom-0">
      {reading ? (
        <div></div>
      ) : (
        <button
          className="text-lg font-extrabold opacity-90 cursor-pointer"
          onClick={handlePrev}
        >
          {"<"} 前
        </button>
      )}
      <div
        className="btn flex items-center cursor-pointer select-none"
        style={{ zIndex: askAki ? 999 : "auto" }}
        onClick={toggleAskAki}
      >
        <div className="">
          {askAki && (
            <Image
              src="/assets/close.svg"
              alt="cancel"
              width={16}
              height={16}
              className="opacity-90"
            />
          )}
        </div>
        <div>Ask Aki</div>
      </div>
      {reading ? (
        <div></div>
      ) : (
        <button
          className="text-lg font-extrabold opacity-90 cursor-pointer"
          onClick={handleNext}
        >
          {nextFlag
            ? "次 >"
            : currentQuestion === finalQuestion
              ? "提出 >"
              : "次 >"}
        </button>
      )}
    </div>
  );
}

export default BottomBar;
