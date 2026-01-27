"use client";

import React, { useContext, useEffect, useState } from "react";
import BottomBar from "../../../../../components/BottomBar";
import Shuuryou from "../../../../../components/Shuuryou";
import axios from "axios";
// import { getLessonUrl } from "../../../constants"; // Use inline or env
import AskAkiContext from "../../../../../contexts/AkiContext";
import { useParams } from "next/navigation";

const apiUrl = "/api";

export default function GoiPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/goi`,
        );
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between min-h-full">
      <div className="mb-4">
        {/* shuuryou */}
        <Shuuryou lessonNo={parseInt(lessonNumber)} />
      </div>
      {/* Content */}
      <div className="flex flex-col gap-8 pb-2 overflow-y-auto custom-scroll text-lg">
        {content.map((value, index) => {
          const id = `goi-${index};`;
          return (
            <div
              className={getClassName(
                id,
                "flex justify-between highlightable border-0 border-b-gray-300 border-b p-2",
              )}
              key={id}
              id={id}
              onClick={() => toggleHighlight(id)}
            >
              <div className="w-1/3">{value.jp}</div>
              <div className="w-1/3 text-pencil-gray">{value.kanji}</div>
              <div className="w-1/3">{value.english}</div>
            </div>
          );
        })}
      </div>
      {/* Bottom bar - mae tsugi */}
      <BottomBar reading={true} />
    </div>
  );
}
