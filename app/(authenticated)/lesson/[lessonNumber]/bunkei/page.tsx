"use client";

import { useContext, useEffect, useState } from "react";
import Shuuryou from "@/components/lesson/shared/Shuuryou";
import BottomBar from "@/components/layout/BottomBar";
import axios from "axios";
import AskAkiContext from "@/contexts/lesson/AkiContext";
import { useParams } from "next/navigation";

// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

function BunkeiPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState(null);
  const [lessonDescription, setLessonDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  useEffect(() => {
    console.log("LessonNumber: ", lessonNumber);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/bunkei`,
        );
        setContent(response.data);

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

    if (lessonNumber) {
      fetchData();
    }
  }, [lessonNumber]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col justify-between h-full min-h-full">
      <AkiContext
        questionType="bunkei"
        lessonAboutContent={lessonDescription}
        currentQuestion={content}
        correctAnswer={null}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* shuuryou */}
        <div className="mb-4">
          <Shuuryou lessonNo={parseInt(lessonNumber)} page="bunkei" />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4 text-lg overflow-y-auto custom-scroll flex-1 pb-4">
          {content.map((ele, index) => {
            const id = `bunkei-${index}`;
            return (
              <div
                className={getClassName(
                  id,
                  "flex gap-2 highlightable border-0",
                )}
                key={id}
                id={id}
                onClick={() => toggleHighlight(id)}
              >
                <div className="mr-2 text-lg font-extrabold opacity-90">
                  {index + 1}.
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: ele }}
                  className="text-start"
                />
              </div>
            );
          })}
        </div>
      </div>
      <BottomBar reading={true} />
    </div>
  );
}

export default BunkeiPage;
