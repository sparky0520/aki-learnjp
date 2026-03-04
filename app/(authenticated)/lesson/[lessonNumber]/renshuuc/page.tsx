"use client";

import { useState, useEffect, useCallback } from "react";
import ReadingSpeakingRenshuuC from "@/components/lesson/sections/ReadingSpeakingRenshuuC";

import BottomBar from "@/components/layout/BottomBar";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useProgressUpdater } from "@/contexts/lesson/ProgressContext";
import Shuuryou from "@/components/lesson/shared/Shuuryou";
// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

export default function RenshuuCPage() {
  const { updateLessonProgress } = useProgressUpdater();
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [parts, setParts] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [index, setIndex] = useState(0);
  const [lessonDescription, setLessonDescription] = useState("");
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

        // Fetch lesson description
        const lessonResponse = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}`,
        );
        if (lessonResponse.data && lessonResponse.data.lessonDescription) {
          setLessonDescription(lessonResponse.data.lessonDescription);
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonNumber) fetchData();
  }, [lessonNumber]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-between h-full">
      <AkiContext
        questionType="renshuu_c"
        lessonAboutContent={lessonDescription}
        currentQuestion={{
          ...parts[currentQuestion],
          active_part_index: index,
          active_question_img:
            parts[currentQuestion]?.question_image_urls?.[index],
        }}
      />
      <div>
        <Shuuryou lessonNo={parseInt(lessonNumber)} page="renshuuc" />
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
