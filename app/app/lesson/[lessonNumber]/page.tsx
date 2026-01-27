"use client";

import Link from "next/link";
import BottomBar from "../../../../components/BottomBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

// Constants
const apiUrl = "/api";

export default function LessonPage({
  params,
}: {
  params: { lessonNumber: string };
}) {
  // In Next.js App Router, params are passed as prop to page.
  // But we need to unwrap it or use useParams (client component).
  // Since "use client", useParams works. Or props.
  // Using unwrapped params from props usually requires async component in latest generic canary, but standard is fine.
  // Using useParams hook for consistency.
  const paramsHook = useParams();
  const lessonNumber = paramsHook?.lessonNumber as string;

  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lesson/${lessonNumber}`);
        setContent(response.data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonNumber) {
      fetchData();
    }
  }, [lessonNumber]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>No lesson data available</div>;
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-8">
        {/* Heading */}
        <div className="text-lg font-bold">Lesson {content.lessonNo}</div>
        {/* Lesson Topic */}
        <div className="text-lg font-extrabold opacity-90">
          {content.lessonTopic}
        </div>
        {/* Lesson description */}
        <div>{content.lessonDescription}</div>
        {/* Start */}
        <div>
          Start with{" "}
          <Link className="text-blue-400" href={`/lesson/${lessonNumber}/goi`}>
            Goi
          </Link>
        </div>
      </div>
      {/* Bottom bar */}
      <BottomBar reading={true} />
    </div>
  );
}
