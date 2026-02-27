"use client";

import { useContext } from "react";
import AskAkiContext from "../../contexts/lesson/AkiContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLayout } from "../../contexts/layout/LayoutContext";

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
  const pathname = usePathname();
  const { sidebarVisible } = useLayout();
  const isCoursePage = pathname.includes("/course");

  return (
    <div
      className={`fixed bottom-0 right-0 z-30 bg-transparent
        ${isCoursePage ? "left-0" : sidebarVisible ? "left-0 md:left-64" : "left-0"}
      `}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4 h-full">
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
          id="ask-aki-button"
          className="btn flex items-center cursor-pointer select-none"
          style={{ zIndex: askAki ? 999 : "auto" }}
          onClick={toggleAskAki}
        >
          {askAki && (
            <Image
              src="/assets/close.svg"
              alt="cancel"
              width={16}
              height={16}
              className="opacity-90 mr-2"
            />
          )}
          Ask Aki
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
    </div>
  );
}

export default BottomBar;
