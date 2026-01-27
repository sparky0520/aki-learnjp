"use client";

import { useState, useEffect } from "react";
import ReadingSpeakingRenshuuC from "@/components/ReadingSpeakingRenshuuC";
import BottomBar from "@/components/BottomBar";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useProgressUpdater } from "@/contexts/ProgressContext";

const apiUrl = "/api";

export default function RenshuuCPage() {
  const { updateLessonProgress } = useProgressUpdater();
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter(); // Use useRouter for navigation
  const [parts, setParts] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const finalQuestion = parts.length;
  const finalOption = 1;

  const handleNext = async () => {
    if (currentQuestion === finalQuestion - 1 && index === finalOption) {
      await updateLessonProgress(lessonNumber, "renshuu_c");
      router.push(`/lesson/${lessonNumber}/mondai`);
    } else if (index === finalOption) {
      setCurrentQuestion((prev) => ++prev);
      setIndex(0);
    } else {
      setIndex((prev) => ++prev);
    }
  };

  const handlePrev = () => {
    if (currentQuestion === 0 && index === 0) return;
    else if (index === 0) {
      setCurrentQuestion((prev) => --prev);
      setIndex(finalOption);
    } else {
      setIndex((prev) => --prev);
    }
  };

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
        }}
      />

      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalQuestion}
        currentQuestion={currentQuestion}
      />
    </div>
  );
}
