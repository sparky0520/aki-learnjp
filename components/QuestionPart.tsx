import React from "react";
import Image from "./Image";

function QuestionPart({
  questionNumber,
  questionContent,
  answered,
  correct,
}: {
  questionNumber: number;
  questionContent: any;
  answered: string;
  correct: string;
}) {
  const isValidUrl = (string: string) => {
    try {
      // Check if it's a URL or a path that starts with /
      if (string.startsWith("/")) return true;
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-1 text-lg">
      <div className="flex items-center gap-4">
        <div>{questionNumber}.</div>
        {Array.isArray(questionContent) ? (
          questionContent.map((e, i) => (
            <Image src={e} key={i} className="w-1/4" />
          ))
        ) : (
          <div
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: questionContent }}
          />
        )}
      </div>
      <div className="flex gap-2 text-red-400 items-center">
        <div>×</div>
        {isValidUrl(answered) ? (
          <Image src={answered} className="w-1/4" />
        ) : (
          <div>{answered}</div>
        )}
      </div>
      <div className="flex gap-2 text-green-400 items-center">
        <div>✓</div>
        {isValidUrl(correct) ? (
          <Image src={correct} className="w-1/4" />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: correct }} />
        )}
      </div>
    </div>
  );
}

export default QuestionPart;
