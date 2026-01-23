"use client";

import { useState, useEffect } from "react";
import ReadingWriting from "@/components/ReadingWriting";
import BottomBar from "@/components/BottomBar";
import ExerciseEndResult from "@/components/ExerciseEndResult";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAnswers } from "@/contexts/AnswersContext";
import { useProgressUpdater } from "@/contexts/ProgressContext";

const apiUrl = "/api";

export default function RenshuuBPage() {
  const { answers, setAnswers } = useAnswers();
  const { updateLessonProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finalQuestion, setFinalQuestion] = useState(0);
  const [finalOption, setFinalOption] = useState(0);
  const router = useRouter(); // Helper for navigation
  const [parts, setParts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to reset answers
  const resetAnswers = () => setAnswers({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lesson/${lessonNumber}/renshuu_b`);
        // console.log(response.data);
        if (response.data && response.data.length > 0) {
            setFinalQuestion(response.data.length);
            setFinalOption(response.data[0].questions.length);
            setParts(response.data);
        }
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (lessonNumber) fetchData();
  }, [lessonNumber]);

  const handleNext = async () => {
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

  if (isLoading) return <div>Loading...</div>;
  if (parts.length === 0) return <div>No data</div>;

  return (
    <div className="flex flex-col justify-between min-h-full">
      <div>
        {/* <Shuuryou lessonNo={1} /> */}
        {currentQuestion < finalQuestion && (
          <div className="mb-4 bold-text font-bold">
            Q. {currentQuestion + 1}/{finalQuestion}
          </div>
        )}
      </div>

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

      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalOption}
        currentQuestion={index}
      />
    </div>
  );
}
