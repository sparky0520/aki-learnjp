"use client";

import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const apiUrl = "/api";

export function useProgressUpdater() {
  const { currentUser } = useAuth();

  //   Mark exercise as completed
  const updateLessonProgress = async (
    lessonNumber: string | number,
    exercise: string,
    courseNumber: string | number = 1, // TODO: Make a current Lesson, Course, Exercise, exercise part context
  ) => {
    if (!currentUser) return;

    try {
      // 1. Determine local updates
      const updates = {};
      switch (exercise) {
        case "renshuu_b":
          updates.renshuu_b_completed = true;
          break;
        case "renshuu_c":
          updates.renshuu_c_completed = true;
          break;
        case "mondai":
          updates.mondai_completed = true;
          break;
        case "kaiwa":
          updates.kaiwa_completed = true;
          break;
      }

      // 2. Fetch CURRENT progress state from DB to know if *everything* is done
      //    We'll use a GET endpoint or select directly if we were server-side.
      //    Since we are client-side, we can call the GET endpoint we found:
      //    /api/progress/[userId]/lesson/[lessonNumber]
      const { data: currentProgress } = await axios.get(
        `${apiUrl}/progress/${currentUser.id}/lesson/${lessonNumber}`,
      );

      // 3. Merge current progress with new updates
      const newProgress = { ...currentProgress, ...updates };

      // 4. Check if ALL required parts are completed
      if (
        newProgress.renshuu_b_completed &&
        newProgress.renshuu_c_completed &&
        // newProgress.mondai_completed &&  - Till mondai is completed
        newProgress.kaiwa_completed
      ) {
        updates.completed = true;
        updates.completed_at = new Date().toISOString();
        await updateCourseProgress(courseNumber, lessonNumber);
      }

      // 5. Send only the UPDATES (not the whole object)
      await axios.post(`${apiUrl}/progress/lesson`, {
        user_id: currentUser.id,
        lesson_number: parseInt(lessonNumber.toString()),
        updates: updates,
      });

      console.log("Progress updated");
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const updateCourseProgress = async (
    courseNumber: string | number,
    lessonNumber: string | number,
  ) => {
    if (!currentUser) return;

    try {
      const updates = {
        completed: true,
        completed_at: new Date().toISOString(),
      };

      await axios.post(`${apiUrl}/progress/course`, {
        user_id: currentUser.id,
        course_number: parseInt(courseNumber.toString()),
        lesson_number: parseInt(lessonNumber.toString()),
        updates: updates,
      });
      console.log("Course progress updated");
    } catch (err) {
      console.error("Error updating course progress:", err);
    }
  };

  return {
    updateLessonProgress,
    updateCourseProgress,
  };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
