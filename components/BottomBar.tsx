"use client";

import { useContext } from "react";
import AskAkiContext from "../contexts/AkiContext";
import Image from "next/image";
// import cancel from "@/public/assets/close.svg"; // Use string path

interface BottomBarProps {
  handleNext?: () => void;
  handlePrev?: () => void;
  currentQuestion?: any;
  finalQuestion?: any;
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
    <div className="flex justify-between items-center sticky bottom-0 bg-[#fffce8] py-4 border-t border-gray-200">
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
        <div className="mr-2">
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
