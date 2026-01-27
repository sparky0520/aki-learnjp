"use client";

import { useEffect, useState } from "react";
import Shuuryou from "@/components/lesson/shared/Shuuryou";
import BottomBar from "@/components/layout/BottomBar";
import axios from "axios";
import { useParams } from "next/navigation";

// Use environment variable or constant for API URL
const apiUrl = "/api";

function RenshuuAPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/lesson/${lessonNumber}/renshuu_a`,
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
    <div className="flex flex-col justify-between min-h-full h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4">
          <Shuuryou lessonNo={parseInt(lessonNumber)} />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-8 pb-2 overflow-y-auto custom-scroll flex-1">
          {content.map((ele, index) => (
            <div className="flex gap-2" key={"renshuu_a" + index}>
              <div className="p-2 pl-0 text-lg font-extrabold opacity-90">
                {index + 1}.
              </div>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${ele[0]}, auto)`,
                }}
                key={index}
              >
                {ele[1].map((e, i: number) => (
                  <div
                    key={i}
                    className={
                      Array.isArray(e)
                        ? "border border-dashed rounded-lg p-2 bg-[#fff9db]"
                        : "p-2"
                    }
                    dangerouslySetInnerHTML={{ __html: e }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom bar - mae tsugi */}
      <BottomBar reading={true} />
    </div>
  );
}

export default RenshuuAPage;
