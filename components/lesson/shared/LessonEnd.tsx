import React from "react";

function LessonEnd({ lessonNumber = 1 }: { lessonNumber?: number }) {
  return (
    <div className="text-center font-extrabold opacity-90 flex flex-col gap-4 py-12">
      <div>
        <div>You completed Lesson {lessonNumber}</div>
        <div className="mt-2 text-2xl">第 {lessonNumber} 課　できました！</div>
      </div>
      <div>
        <div>Congratulations!</div>
        <div className="mt-2 text-2xl">かんぱいい</div>
      </div>
    </div>
  );
}

export default LessonEnd;
