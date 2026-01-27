"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";
import axios from "axios";
import BottomBar from "../../../../components/layout/BottomBar";

function LessonPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/lesson/${lessonNumber}`);
        setContent(response.data);
      } catch (err) {
        console.error("Error fetching lesson info:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonNumber) {
      fetchData();
    }
  }, [lessonNumber]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!content) {
    return <div className="p-8">No lesson data available</div>;
  }

  return (
    <div className="flex flex-col justify-between h-full bg-paper-bg p-8">
      <div className="flex flex-col gap-8 max-w-4xl">
        {/* Heading
        <div className="text-2xl font-bold text-gray-800">
          Lesson {content.lessonNo}
        </div> */}

        {/* Lesson Topic */}
        <div
          className="text-3xl font-extrabold text-[#2c3e50] opacity-90"
          dangerouslySetInnerHTML={{ __html: content.lessonTopic }}
        ></div>

        {/* Lesson description */}
        <div
          className="text-lg leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: content.lessonDescription }}
        ></div>

        {/* Start link (matching original repo) */}
        <div className="mt-4 text-lg">
          Start with{" "}
          <Link
            className="text-blue-500 hover:underline font-semibold"
            href={`/lesson/${lessonNumber}/goi`}
          >
            Goi
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
