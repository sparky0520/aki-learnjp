"use client";

import QuestionPart from "@/components/QuestionPart";

function ExerciseEndResult({ questions, correctAnswers, answers }: any) {
  // Answers is object { [partNo]: answerString } based on my ReadingWriting logic.
  // Original expected Array. I will adapt this code to handle Object.
  
  return (
    <div className="flex-1">
      {/* Overview */}
      <div className="mb-4 bold-text">Overview</div>
      {/* Content */}
      <div className="flex flex-col gap-6">
        {correctAnswers.map((ans: string, index: number) => {
          const partNo = index + 1;
          const answerStr = answers[partNo]; // Direct access from object
          
          if (answerStr !== undefined) {
             if (answerStr != ans) {
                 return (
                    <QuestionPart
                      key={"question_part" + index}
                      answered={answerStr}
                      correct={ans}
                      questionNumber={partNo}
                      questionContent={questions[index]}
                    />
                 );
             } else {
                 return (
                    <div className="text-green-400" key={"question_part" + index}>
                      ✓ {partNo}. correct
                    </div>
                 );
             }
          }
          return null; // No answer?
        })}
      </div>
    </div>
  );
}

export default ExerciseEndResult;
