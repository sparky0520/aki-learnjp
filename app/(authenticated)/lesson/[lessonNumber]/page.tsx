"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Shuuryou from "@/components/Shuuryou";

function LessonPage() {
  const params = useParams();
  const lessonNumber = params?.lessonNumber as string;

  return (
    <div className="flex flex-col gap-8 h-full">
      <Shuuryou lessonNo={parseInt(lessonNumber)} />
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Reading */}
        <div className="bg-[#fff9db] rounded-lg p-6 flex flex-col gap-4 overflow-y-auto custom-scroll">
          <div className="text-xl font-bold border-b border-gray-400 pb-2">
            読む (Reading)
          </div>
          <Link href={`/lesson/${lessonNumber}/goi`} className="btn bg-white">
            語彙 (Vocabulary)
          </Link>
          <Link
            href={`/lesson/${lessonNumber}/bunkei`}
            className="btn bg-white"
          >
            文型 (Sentence Patterns)
          </Link>
          <Link
            href={`/lesson/${lessonNumber}/reibun`}
            className="btn bg-white"
          >
            例文 (Example Sentences)
          </Link>
          <Link
            href={`/lesson/${lessonNumber}/renshuua`}
            className="btn bg-white"
          >
            練習 A (Practice A)
          </Link>
          <Link
            href={`/lesson/${lessonNumber}/renshuub`}
            className="btn bg-white"
          >
            練習 B (Practice B)
          </Link>
          <Link
            href={`/lesson/${lessonNumber}/renshuuc`}
            className="btn bg-white"
          >
            練習 C (Practice C)
          </Link>
        </div>

        {/* Listening / Others */}
        <div className="bg-[#e6fcf5] rounded-lg p-6 flex flex-col gap-4 overflow-y-auto custom-scroll">
          <div className="text-xl font-bold border-b border-gray-400 pb-2">
            聞く・話す (Listening / Speaking)
          </div>
          <Link
            href={`/lesson/${lessonNumber}/mondai`}
            className="btn bg-white"
          >
            問題 (Exercises)
          </Link>
          <Link href={`/lesson/${lessonNumber}/kaiwa`} className="btn bg-white">
            会話 (Conversation)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
