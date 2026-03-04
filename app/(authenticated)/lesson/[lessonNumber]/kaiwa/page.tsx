"use client";

import { useState, useEffect, useCallback } from "react";
import ReadingListeningSpeakingKaiwa from "@/components/lesson/sections/ReadingListeningSpeakingKaiwa";
import Shuuryou from "@/components/lesson/shared/Shuuryou";
import BottomBar from "@/components/layout/BottomBar";
import LessonEnd from "@/components/lesson/shared/LessonEnd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useProgressUpdater } from "@/contexts/lesson/ProgressContext";

// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

export default function KaiwaPage() {
  const { updateLessonProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [data, setData] = useState(null);
  const [lessonDescription, setLessonDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/kaiwa`,
        );
        setData(response.data);

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

  const handleNext = useCallback(async () => {
    if (lessonCompleted === 1) {
      await updateLessonProgress(lessonNumber, "kaiwa");
      router.push("/dashboard"); // Redirect to Dashboard instead of "/" which is landing
      return;
    }
    setLessonCompleted((prev) => ++prev);
  }, [lessonCompleted, lessonNumber, router, updateLessonProgress]);

  const handlePrev = useCallback(() => {
    if (lessonCompleted === 0) return;
    setLessonCompleted((prev) => --prev);
  }, [lessonCompleted]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-between h-full">
      <AkiContext
        questionType="kaiwa"
        lessonAboutContent={lessonDescription}
        currentQuestion={data}
      />
      {/* shuuryou */}
      <div className="mb-4">
        <Shuuryou lessonNo={parseInt(lessonNumber)} page="kaiwa" />
      </div>
      {lessonCompleted === 1 ? (
        <LessonEnd lessonNumber={parseInt(lessonNumber)} />
      ) : (
        <>
          <ReadingListeningSpeakingKaiwa data={data} />
        </>
      )}
      <BottomBar
        handleNext={handleNext}
        handlePrev={handlePrev}
        nextFlag={true}
      />
    </div>
  );
}
