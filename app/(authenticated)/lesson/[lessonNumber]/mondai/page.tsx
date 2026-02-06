"use client";

import { useState, useEffect, useCallback } from "react";
import ListeningWritingMondai1 from "@/components/lesson/mondai/ListeningWritingMondai1";
import ListeningWritingMondai2 from "@/components/lesson/mondai/ListeningWritingMondai2";
import ListeningWritingMondai3 from "@/components/lesson/mondai/ListeningWritingMondai3";
import ListeningWritingMondai456 from "@/components/lesson/mondai/ListeningWritingMondai456";
import ExerciseEndResult from "@/components/lesson/shared/ExerciseEndResult";
import { useProgressUpdater } from "@/contexts/lesson/ProgressContext";
import BottomBar from "@/components/layout/BottomBar";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAnswers } from "@/contexts/lesson/AnswersContext";
// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

export default function MondaiPage() {
  const { answers, setAnswers } = useAnswers();
  const { updateLessonProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [parts, setParts] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lessonDescription, setLessonDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/mondai`,
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

  const finalOption = 0;
  const finalQuestion = parts.length;

  const handleNext = useCallback(async () => {
    if (currentQuestion === finalQuestion - 1 && index === finalOption) {
      await updateLessonProgress(lessonNumber, "mondai");
      setAnswers({});
      router.push(`/lesson/${lessonNumber}/kaiwa`);
    }

    // Exercise end screen visible
    else if (index === finalOption + 1) {
      setAnswers({});
      setIndex(0);
      setCurrentQuestion((prev) => ++prev);
    }
    // Question visible
    else {
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
    setAnswers,
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

  if (isLoading) return <div>Loading...</div>;

  // Determine correct answer
  const currentPart = parts[currentQuestion];
  const hasCorrectAnswers =
    currentPart?.correct_answers && currentPart.correct_answers.length > 0;
  // If we are looking at specific sub-questions in exercise results or similar, we might need more logic context
  // but for the main question wrapper:
  const correctAnswer = hasCorrectAnswers
    ? currentPart.correct_answers
    : "Self Answered";

  return (
    <div className="flex flex-col justify-between h-full">
      <AkiContext
        questionType="mondai"
        lessonAboutContent={lessonDescription}
        currentQuestion={parts[currentQuestion]}
        correctAnswer={correctAnswer}
        userAnswer={answers}
        mistakes={0} // Placeholder until mistake tracking is implemented
      />
      <div>
        {/* <Shuuryou lessonNo={parseInt(lessonNumber)} page="mondai" /> */}
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
        nextFlag={false}
      />
    </div>
  );
}
