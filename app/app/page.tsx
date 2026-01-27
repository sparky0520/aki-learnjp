"use client";

import NewsInsight from "../../components/NewsInsight";
import Link from "next/link";
import BottomBar from "../../components/BottomBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLastAccessed } from "../../contexts/LastAccessedContext";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";

// Constants
const apiUrl = "/api";

export default function DashboardPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(0);
  const { lastAccessed } = useLastAccessed();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/home`);
        setContent(response.data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await axios.get(
          `${apiUrl}/progress/${currentUser.id}/completed-lessons`,
        );
        setCompletedLessons(response.data.completed_lessons);
      } catch (err) {
        // console.error("Error fetching completed lessons:", err.message);
      }
    };

    // fetchCompletedLessons(); // Disabled as stats endpoint not ported yet
  }, [currentUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Heading */}
        <div className="mb-4 text-lg font-extrabold opacity-90">こんにちは</div>
        <div className="flex justify-between">
          {/* Statistics */}
          <div className="flex flex-col gap-4">
            {/* Progress */}
            <div className="flex gap-30 items-center text-lg">
              <div>Lessons</div>
              <div className="flex gap-8 items-center">
                <div>
                  {completedLessons}/{content.totalLessons}
                </div>
                <Link
                  href={`/lesson/${lastAccessed.lessonNumber}`}
                  className="btn text-sm px-4 py-2 bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
                >
                  Continue
                </Link>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full">
              <div className=" bg-gray-400 rounded-lg">
                <div
                  className={`h-5 bg-green-400 rounded-lg`}
                  style={{
                    width:
                      Math.ceil(
                        (completedLessons * 100) / content.totalLessons,
                      ) + "%",
                  }}
                >
                  <div className="text-right mr-3 text-xs text-white leading-5">
                    {Math.ceil((completedLessons * 100) / content.totalLessons)}
                    %
                  </div>
                </div>
              </div>
            </div>
            {/* News and Insights */}
            <div>
              <div className="text-lg mb-2">News and Insights</div>
              {/* Content */}
              <div className="flex flex-col gap-6">
                {content.newsInsights.map((e, index: number) => {
                  if (e.media.type === "youtube") {
                    return (
                      <NewsInsight
                        key={index}
                        link={e.link}
                        description={e.description}
                        sourceCode={
                          <iframe
                            width="560"
                            height="315"
                            src={e.media.link}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="max-w-full h-auto"
                          ></iframe>
                        }
                      />
                    );
                  } else {
                    return (
                      <NewsInsight
                        key={index}
                        link={e.link}
                        description={e.description}
                        sourceCode={
                          <div className="relative w-full max-w-md h-48">
                            <Image
                              src={e.media.link}
                              className="object-contain" // Or cover
                              alt=""
                              fill
                            />
                          </div>
                        }
                      />
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col gap-4 items-end text-lg text-blue-400">
            {/* Practice Links */}
            <PracticeLink text="Practice Hiragana" href="/hatsuon" />
            <PracticeLink text="Practice Katakana" href="/hatsuon" />
            <PracticeLink text="Practice Kanji" href="/hatsuon" />
          </div>
        </div>
      </div>
      {/* Bottom bar - mae tsugi */}
      <BottomBar reading={true} />
    </div>
  );
}

function PracticeLink({ text, href }: { text: string; href: string }) {
  return (
    <Link className="flex items-center gap-2 hover:underline group" href={href}>
      <Image
        src="/assets/open_in_new.svg"
        alt="Open in new window"
        width={16}
        height={16}
        className="opacity-0 group-hover:opacity-90 transition-opacity duration-200"
      />
      <span>{text}</span>
    </Link>
  );
}
