"use client";

import { useState, useEffect } from "react";
import ListeningWritingMondai1 from "@/components/ListeningWritingMondai1";
import ListeningWritingMondai2 from "@/components/ListeningWritingMondai2";
import ListeningWritingMondai3 from "@/components/ListeningWritingMondai3";
import ListeningWritingMondai456 from "@/components/ListeningWritingMondai456";
import ExerciseEndResult from "@/components/ExerciseEndResult";
import BottomBar from "@/components/BottomBar";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAnswers } from "@/contexts/AnswersContext";
import { useProgressUpdater } from "@/contexts/ProgressContext";

const apiUrl = "/api";

export default function MondaiPage() {
  const { answers, setAnswers } = useAnswers();
  const { updateLessonProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [parts, setParts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to reset
  const resetAnswers = () => setAnswers({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lesson/${lessonNumber}/mondai`);
        setParts(response.data);
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonNumber) fetchData();
  }, [lessonNumber]);

  const finalOption = 0;
  const finalQuestion = parts.length;

  const handleNext = async () => {
    if (currentQuestion === finalQuestion - 1 && index === finalOption) {
      await updateLessonProgress(lessonNumber, "mondai");
      resetAnswers();
      router.push(`/lesson/${lessonNumber}/kaiwa`);
    }

    // Exercise end screen visible
    else if (index === finalOption + 1) {
      resetAnswers();
      setIndex(0);
      setCurrentQuestion((prev) => ++prev);
    }
    // Question visible
    else {
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
        {currentQuestion < parts.length && (
          <div className="mb-4 text-lg font-bold">
            Q. {currentQuestion + 1}/{parts.length}
          </div>
        )}
      </div>

      {index === finalOption ? (
        currentQuestion === 0 && parts.length > 0 ? (
          <ListeningWritingMondai1 data={parts[0]} />
        ) : currentQuestion === 1 && parts.length > 1 ? (
          <ListeningWritingMondai2 data={parts[1]} />
        ) : currentQuestion === 2 && parts.length > 2 ? (
          <ListeningWritingMondai3 data={parts[2]} />
        ) : (
          <ListeningWritingMondai456
            data={parts[currentQuestion]}
            currentQuestion={currentQuestion}
          />
        )
      ) : (
        <ExerciseEndResult
          questions={parts[currentQuestion].questions}
          correctAnswers={parts[currentQuestion].correct_answers}
          answers={answers}
        />
      )}

      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalQuestion}
        currentQuestion={currentQuestion}
      />
    </div>
  );
}
