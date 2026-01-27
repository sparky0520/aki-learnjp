"use client";

import { useState, useEffect } from "react";
import ReadingWriting from "@/components/ReadingWriting";
import ExerciseEndResult from "@/components/ExerciseEndResult";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAnswers } from "@/contexts/AnswersContext";
import { useProgressUpdater } from "@/contexts/ProgressContext";
import { useLayout } from "@/contexts/LayoutContext";

const apiUrl = "/api";

function RenshuuBPage() {
  const { answers, setAnswers } = useAnswers();
  const { updateLessonProgress } = useProgressUpdater();
  const { setBottomBarState } = useLayout();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finalQuestion, setFinalQuestion] = useState(0);
  const [finalOption, setFinalOption] = useState(0);
  const router = useRouter();
  const [parts, setParts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to reset answers
  const resetAnswers = () => {
    setAnswers({});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/renshuu_b`,
        );
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          console.log(
            "response.data[0].questions.length: " +
              response.data[0].questions.length,
          );
          setFinalQuestion(response.data.length);
          setFinalOption(response.data[0].questions.length);
          setParts(response.data);
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonNumber) fetchData();
  }, [lessonNumber]);

  const handleNext = async () => {
    // Empty answer check
    // if (index + 1 <= 4 && !getAnswer(index + 1)) {
    //   window.alert(`Answer ${index + 1} can't be empty!`);
    //   return;
    // }

    // Exercise end screen visible
    if (index === finalOption) {
      if (currentQuestion === finalQuestion - 1) {
        await updateLessonProgress(lessonNumber, "renshuu_b");
        resetAnswers();
        router.push(`/lesson/${lessonNumber}/renshuuc`);
        return;
      }
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

  useEffect(() => {
    if (!isLoading) {
      setBottomBarState({
        handleNext,
        handlePrev,
        finalQuestion: finalOption,
        currentQuestion: index,
        nextFlag: false,
      });
    }
    return () =>
      setBottomBarState({
        handleNext: undefined,
        handlePrev: undefined,
        finalQuestion: undefined,
        currentQuestion: undefined,
      });
  }, [
    index,
    finalOption,
    isLoading,
    currentQuestion,
    finalQuestion,
    setBottomBarState,
  ]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-between min-h-full h-full">
      <div>
        {/* <Shuuryou lessonNo={1} /> */}
        {currentQuestion < finalQuestion && (
          <div className="mb-4 bold-text">
            Q. {currentQuestion + 1}/{finalQuestion}
          </div>
        )}
      </div>

      <div className="flex-1 flex justify-center items-center">
        {currentQuestion < finalQuestion ? (
          index < finalOption ? (
            <ReadingWriting
              data={{
                img: parts[currentQuestion].image_url,
                rei: parts[currentQuestion].rei,
                question: parts[currentQuestion].questions[index],
                part: index + 1,
              }}
            />
          ) : (
            <ExerciseEndResult
              // exerciseName={"Renshuu B"}
              questions={parts[currentQuestion].questions}
              correctAnswers={parts[currentQuestion].correct_answers}
              answers={answers}
            />
          )
        ) : null}
      </div>
    </div>
  );
}

export default RenshuuBPage;
