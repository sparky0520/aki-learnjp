"use client";

import { useContext, useEffect, useState } from "react";
import Shuuryou from "../../../../../components/Shuuryou";
import BottomBar from "../../../../../components/BottomBar";
import axios from "axios";
import AskAkiContext from "../../../../../contexts/AkiContext";
import { useParams } from "next/navigation";

const apiUrl = "/api";

export default function ReibunPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/lesson/${lessonNumber}/reibun`);
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
    <div className="flex flex-col justify-between min-h-full">
      <div>
        <div className="mb-4">
          {/* shuuryou */}
          <Shuuryou lessonNo={parseInt(lessonNumber)} />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4 pb-2 overflow-y-auto custom-scroll text-lg">
          {content.map((ele, index) => {
            const id = `reibun-${index}`;
            const parts = ele.split(" — ");
            return (
              <div
                className={getClassName(
                  id,
                  "flex gap-4 highlightable p-2 border-0 text-start"
                )}
                key={id}
                id={id}
                onClick={() => toggleHighlight(id)}
              >
                <div className="mr-2 text-lg font-extrabold opacity-90">
                  {index + 1}.
                </div>
                <div>
                  {parts.map((e, i) => (
                    <div
                      key={id + i}
                      className={i > 0 ? `ml-${i * 8} mt-2` : ""}
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
