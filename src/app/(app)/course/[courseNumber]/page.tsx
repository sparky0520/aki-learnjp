"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BottomBar from "@/components/BottomBar";
import Shuuryou from "@/components/Shuuryou";
import { useAuthSync } from "@/contexts/AuthContext";
import { useLastAccessed } from "@/contexts/LastAccessedContext";

const apiUrl = "/api";

export default function CourseChartPage() {
  const params = useParams();
  const courseNumber = params?.courseNumber as string;
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLastAccessed } = useLastAccessed(); // updateLastAccessed wasn't in port, I provided setLastAccessed

  const { currentUser } = useAuthSync();
  const userId = currentUser?.id;

  // Helper to update last accessed
  const handleUpdateLastAccessed = (cNum: string, lNum: string) => {
      setLastAccessed({ courseNumber: parseInt(cNum), lessonNumber: parseInt(lNum) });
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiUrl}/courses/${courseNumber}/lesson/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const data = await response.json();
        setLessons(data);
      } catch (err: any) {
        console.error("Error fetching lessons:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseNumber && userId) {
      fetchLessons();
    }
  }, [courseNumber, userId]);

  if (loading || !userId) {
    return (
      <div className="text-lg flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-lg flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <span>エラー: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-lg h-screen flex flex-col">
      {/* Heading */}
       <div className="mb-4">
          <Shuuryou lessonNo={1} />
       </div>
      <div className="bold-text text-center"><ruby>目次<rt>もくじ</rt></ruby></div>

      {/* Body element map */}
      <div className="flex flex-col gap-10 items-center mt-10">
        {lessons.length === 0 ? (
          <div className="text-center text-gray-500">
            レッスンが見つかりません
          </div>
        ) : (
          lessons.map((lesson, i) => (
            <div
              className="w-3/5 border-b rounded-lg border-gray-200 pb-7"
              key={i}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                {/* Lesson No */}
                <div className="border bg-green-200 border-gray-400 px-4 py-2 rounded-lg">
                  第 {lesson.lessonNo} 課
                </div>
                {/* Status/Action */}
                <div>
                  {lesson.status === "Continue" ? (
                    <button className="btn text-base">
                      <Link 
                        href={`/lesson/${lesson.lessonNo}`} 
                        onClick={() => handleUpdateLastAccessed(courseNumber, lesson.lessonNo)}
                      >
                        {lesson.status}
                      </Link>
                    </button>
                  ) : (
                    <div
                      className={`hover:underline text-base ${lesson.status === "Completed" ? "text-blue-400" : ""
                        }`}
                    >
                      <Link 
                        href={`/lesson/${lesson.lessonNo}`} 
                        onClick={() => handleUpdateLastAccessed(courseNumber, lesson.lessonNo)}
                      >
                        {lesson.status}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {/* Lesson Metadata */}
              <div className="mt-3 ml-24">
                {lesson.metaData && lesson.metaData.length > 0 ? (
                  lesson.metaData.map((topic: string, index: number) => (
                    <div key={index}>
                      {index + 1}. {topic}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">トピックなし</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex-1"></div>
      <BottomBar reading={true} />
    </div>
  );
}
