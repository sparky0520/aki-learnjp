"use client";

import { useState, useEffect, useCallback } from "react";
import ReadingListeningSpeakingKaiwa from "@/components/ReadingListeningSpeakingKaiwa";
import Shuuryou from "@/components/lesson/shared/Shuuryou";
import BottomBar from "@/components/layout/BottomBar";
import LessonEnd from "@/components/LessonEnd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useProgressUpdater } from "@/contexts/ProgressContext";

const apiUrl = "/api";

export default function KaiwaPage() {
  const { updateLessonProgress, updateCourseProgress } = useProgressUpdater();

  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/kaiwa`,
        );
        setData(response.data);
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
      await updateCourseProgress(1, 1);
      router.push("/dashboard"); // Redirect to Dashboard instead of "/" which is landing
      return;
    }
    setLessonCompleted((prev) => ++prev);
  }, [
    lessonCompleted,
    lessonNumber,
    router,
    updateLessonProgress,
    updateCourseProgress,
  ]);

  const handlePrev = useCallback(() => {
    if (lessonCompleted === 0) return;
    setLessonCompleted((prev) => --prev);
  }, [lessonCompleted]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-between h-full">
      {/* shuuryou */}
      <div className="mb-4">
        <Shuuryou lessonNo={parseInt(lessonNumber)} />
      </div>
      {lessonCompleted === 1 ? (
        <LessonEnd />
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
