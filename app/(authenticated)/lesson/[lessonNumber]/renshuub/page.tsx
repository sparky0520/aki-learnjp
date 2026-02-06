"use client";

import { useState, useEffect } from "react";
import ReadingWriting from "@/components/lesson/sections/ReadingWriting";
import ExerciseEndResult from "@/components/lesson/shared/ExerciseEndResult";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAnswers } from "@/contexts/lesson/AnswersContext";
import { useProgressUpdater } from "@/contexts/lesson/ProgressContext";
import BottomBar from "@/components/layout/BottomBar";
import Shuuryou from "@/components/lesson/shared/Shuuryou";

// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

function RenshuuBPage() {
  const { answers, setAnswers } = useAnswers();
  const { updateLessonProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finalQuestion, setFinalQuestion] = useState(0);
  const [finalOption, setFinalOption] = useState(0);
  const router = useRouter();
  const [parts, setParts] = useState([]);
  const [index, setIndex] = useState(0);
  const [lessonDescription, setLessonDescription] = useState(""); // [NEW]
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

        // [NEW] Fetch lesson description
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

  const handleNext = async () => {
    // ... existing handleNext code ...
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

  return (
    <div className="flex flex-col justify-between min-h-full h-full">
      <AkiContext
        questionType="renshuu_b"
        lessonAboutContent={lessonDescription}
        currentQuestion={{
          ...parts[currentQuestion],
          // Current active sub-question (index)
          active_question_index: index,
          active_question_text: parts[currentQuestion]?.questions?.[index],
        }}
        correctAnswer={parts[currentQuestion]?.correct_answers?.[index]}
      />
      <div>
        <Shuuryou lessonNo={parseInt(lessonNumber)} page="renshuub" />
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
      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        finalQuestion={finalOption}
        currentQuestion={index}
        nextFlag={false}
      />
    </div>
  );
}

export default RenshuuBPage;
