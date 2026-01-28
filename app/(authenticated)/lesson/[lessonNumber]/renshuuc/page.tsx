"use client";

import { useState, useEffect, useCallback } from "react";
import ReadingSpeakingRenshuuC from "@/components/lesson/sections/ReadingSpeakingRenshuuC";

import BottomBar from "@/components/layout/BottomBar";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useProgressUpdater } from "@/contexts/lesson/ProgressContext";
const apiUrl = "/api";

export default function RenshuuCPage() {
  const { updateLessonProgress } = useProgressUpdater();
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [parts, setParts] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const finalQuestion = parts.length;
  const finalOption = 1; // Assuming based on previous code

  const handleNext = useCallback(async () => {
    if (currentQuestion === finalQuestion - 1 && index === finalOption) {
      await updateLessonProgress(lessonNumber, "renshuu_c");
      router.push(`/lesson/${lessonNumber}/mondai`);
    } else if (index === finalOption) {
      setCurrentQuestion((prev) => ++prev);
      setIndex(0);
    } else {
      setIndex((prev) => ++prev);
    }
  }, [
    currentQuestion,
    finalQuestion,
    index,
    finalOption,
    lessonNumber,
    router,
    updateLessonProgress,
  ]);

  const handlePrev = useCallback(() => {
    if (currentQuestion === 0 && index === 0) return;
    else if (index === 0) {
      setCurrentQuestion((prev) => --prev);
      setIndex(finalOption);
    } else {
      setIndex((prev) => --prev);
    }
  }, [currentQuestion, index, finalOption]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/renshuu_c`,
        );
        setParts(response.data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonNumber) fetchData();
  }, [lessonNumber]);

  // ... inside component ... (this comment will be removed by replacement)

  // NOTE: Moving this to the top with other hooks is cleaner, but for now I will just clean up the comment and ensure it works.
  // Actually, I will move it to the top.

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* <Shuuryou lessonNo={1} /> */}
        {currentQuestion < finalQuestion && (
          <div className="mb-4 text-lg font-bold">
            Q. {currentQuestion + 1}/{finalQuestion}
          </div>
        )}
      </div>

      <ReadingSpeakingRenshuuC
        data={{
          img: parts[currentQuestion]?.image_url,
          rei: parts[currentQuestion]?.rei,
          questionImg: parts[currentQuestion]?.question_image_urls?.[index],
          part: index + 1,
          correctAnswers: parts[currentQuestion]?.correct_answers[index],
        }}
      />
      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalQuestion}
        currentQuestion={currentQuestion}
        nextFlag={false}
      />
    </div>
  );
}
