"use client";

import Shuuryou from "@/components/lesson/shared/Shuuryou";
import BottomBar from "@/components/layout/BottomBar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AskAkiContext from "@/contexts/lesson/AkiContext";
import { useParams } from "next/navigation";

// ... imports
import AkiContext from "@/components/lesson/shared/AkiContext";

const apiUrl = "/api";

function ReibunPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState(null);
  const [lessonDescription, setLessonDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/reibun`,
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
    <div className="flex flex-col justify-between min-h-full h-full">
      <AkiContext
        questionType="reibun"
        lessonAboutContent={lessonDescription}
        currentQuestion={content}
        correctAnswer={null}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4">
          {/* shuuryou */}
          <Shuuryou lessonNo={parseInt(lessonNumber)} page="reibun" />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4 pb-2 overflow-y-auto custom-scroll text-lg flex-1">
          {content.map((ele, index) => {
            const id = `reibun-${index}`;
            // ele is string here, split logic?
            // "Japanese — English"
            // Original code: ele = ele.split(" — ");
            const parts = ele.split(" — ");
            return (
              <div
                className={getClassName(
                  id,
                  "flex gap-4 highlightable p-2 border-0",
                )}
                key={id}
                id={id}
                onClick={() => toggleHighlight(id)}
              >
                <div className="mr-2 text-lg font-extrabold opacity-90">
                  {index + 1}.
                </div>
                <div>
                  {parts.map((e: string, i: number) => (
                    <div
                      key={id + i}
                      className={i > 0 ? `ml-${i * 8} mt-2` : "" + "text-start"}
                      dangerouslySetInnerHTML={{ __html: e }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Bottom bar - mae tsugi */}
      <BottomBar reading={true} />
    </div>
  );
}

export default ReibunPage;
