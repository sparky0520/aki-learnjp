"use client";

import axios from "axios";
import { useAuth } from "./AuthContext";

const apiUrl = "/api";

export function useProgressUpdater() {
  const { currentUser } = useAuth();

  //   Mark exercise as completed
  const updateLessonProgress = async (
    lessonNumber: string | number,
    exercise: string,
  ) => {
    if (!currentUser) return;

    try {
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
          updates.completed = true;
          updates.completed_at = new Date().toISOString();
      }

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
