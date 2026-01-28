import QuestionPart from "./QuestionPart";

function ExerciseEndResult({
  questions,
  correctAnswers,
  answers,
}: {
  questions;
  correctAnswers;
  answers;
}) {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto self-start justify-self-start">
      {/* <div className="mb-4 text-lg font-bold">{exerciseName}</div> */}
      {/* Overview */}
      <div className="mb-4 text-xl font-extrabold opacity-90">Overview</div>
      {/* Content */}
      <div className="flex flex-col gap-6">
        {correctAnswers.map((ans, index) => {
          // Find answer by partNo (1-indexed)
          // The answers context stores it as { partNo: value } where partNo matches
          // But here answers is passed as array of objects? Wait.
          // Let's assume standard answers object from context is passed, which is { [key: number]: string }
          // Or array of objects { partNo, answer } as in original code logic:
          // const a = answers.find((a) => a.partNo === index + 1);

          // I need to adapt based on how AnswersContext works in aki-nextjs.
          // In aki-nextjs AnswersContext, it seems to be Record<string | number, any>
          // So answers[index + 1] would get the value.

          // Wait, the original code used `answers.find` implying answers was an array of objects.
          // In aki-nextjs, useAnswers provides `answers` as a generic object/map usually.
          // I will assume aki-nextjs uses { [key]: value }.

          // Let's support both or normalize.
          let userAns;
          if (Array.isArray(answers)) {
            const found = answers.find((a) => a.partNo === index + 1);
            userAns = found ? found.answer : null;
          } else {
            userAns = answers[index + 1];
          }

          if (userAns !== undefined && userAns !== null) {
            if (userAns != ans) {
              return (
                <QuestionPart
                  key={"question_part" + index}
                  answered={userAns}
                  correct={ans}
                  questionNumber={index + 1}
                  questionContent={questions[index]}
                />
              );
            } else {
              return (
                <div
                  className="text-green-500 font-bold text-lg"
                  key={"question_part" + index}
                >
                  ✓ {index + 1}. correct
                </div>
              );
            }
          }
          return null; // Skip unanswered or handle differently
        })}
      </div>
    </div>
  );
}

export default ExerciseEndResult;
