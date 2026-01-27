"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Shuuryou from "../../../components/lesson/shared/Shuuryou";
import BottomBar from "../../../components/layout/BottomBar";
import Hiragana from "../../../components/ui/Hiragana";
import Katakana from "../../../components/ui/Katakana";
import Kanji from "../../../components/ui/Kanji";

const finalPage = 1;

export default function HatsuonPage() {
  const [currentPage, setcurrentPage] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    // console.log("currentPage: " + currentPage);
    if (currentPage === 2) {
      router.push("/dashboard");
    } else {
      setcurrentPage((prev) => ++prev);
    }
    // scrollTo(0, 0); // Window scroll not always available or needed if layout scrolls
  };

  const handlePrev = () => {
    // console.log("currentPage: " + currentPage);
    if (currentPage === 0) {
      return;
    } else {
      setcurrentPage((prev) => --prev);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-full">
      <div className="mb-4">
        {/* shuuryou */}
        <Shuuryou lessonNo={1} />
        {/* Heading */}
        <div className="mt-4 text-lg text-center font-bold">はつおん</div>
      </div>
      {/* Content */}
      {currentPage === 1 ? (
        <Katakana />
      ) : currentPage === 2 ? (
        <Kanji />
      ) : (
        <Hiragana />
      )}
      {/* Bottom bar - mae tsugi */}
      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalPage} // This logic in original seems odd (finalPage=1? but logic checks 2?)
        // Original: finalQuestion={finalPage} where finalPage=1. BottomBar uses it to show "Submit" vs "Next"?
        // BottomBar logic: nextFlag ? "次 >" : currentQuestion === finalQuestion ? "提出 >" : "次 >"
        // Here nextFlag is true. So it always shows "次 >" (Next).
        currentQuestion={currentPage}
        nextFlag={true}
      />
    </div>
  );
}
