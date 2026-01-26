"use client";

import { useContext, useEffect, useState } from "react";
import Shuuryou from "../../../../../components/Shuuryou";
import BottomBar from "../../../../../components/BottomBar";
import axios from "axios";
import AskAkiContext from "../../../../../contexts/AkiContext";
import { useParams } from "next/navigation";

const apiUrl = "/api";

export default function BunkeiPage() {
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
          `${apiUrl}/lesson/${lessonNumber}/bunkei`
        );
        setContent(response.data);
      } catch (err: any) {
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
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* shuuryou */}
        <div className="mb-4">
          <Shuuryou lessonNo={parseInt(lessonNumber)} />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4 text-lg">
          {content.map((ele, index) => {
            const id = `bunkei-${index}`;
            return (
              <div
                className={getClassName(
                  id,
                  "flex gap-2 items-center highlightable border-0"
                )}
                key={id}
                id={id}
                onClick={() => toggleHighlight(id)}
              >
                <div className="mr-2 text-lg font-extrabold opacity-90">
                  {index + 1}.
                </div>
                {/* Security risk with HTML but required for ruby tags support as per original */}
                <div dangerouslySetInnerHTML={{ __html: ele }} />
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
