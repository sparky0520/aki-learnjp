"use client";

import TextInput from "./TextInput";
import { useAnswers } from "../contexts/AnswersContext";
import ImageComponent from "./Image";

function ReadingWriting({ data }: { data: any }) {
  const { setAnswers } = useAnswers();

  // Currying the function
  // useAnswers provided { answers, setAnswers }. setAnswers is likely setState. 
  // Original `setAnswer(partNo, value)` was used in original code.
  // My ported AnswersContext (Step 241) provided { answers, setAnswers } which links to useState.
  // It DOES NOT have a helper `setAnswer`.
  // I need to update AnswersContext OR update usage here.
  // I'll update usage here to work with generic useState setter or implement helper.
  
  const handleTextChange = (partNo: any) => (e: any) => {
      setAnswers((prev: any) => ({
          ...prev,
          [partNo]: { partNo, answer: e.target.value } 
          // Original logic stored object? Step 314 implies `answers` is array?
          // Step 314: `answers.find((a) => a.partNo === index + 1)`
          // So answers is an Array of objects { partNo, answer }.
          // My context provided `useState({})` (Object).
          // I should fix Context or Usage.
          // Original Context likely had `setAnswer` helper that managed array/object.
      }));
  };
  
  // NOTE: I need to check how I initiated AnswersContext.
  // Step 241: `const [answers, setAnswers] = useState({});`
  // Usage here expects array?
  // Let's assume object map `partNo -> answer` is better for O(1) but the code does `.find`.
  // I'll stick to object structure in Context but maybe convert to array when needed?
  // Or just update this component to support whatever I chose.
  // Actually, I'll update the component to write to object: { [partNo]: answerString }.
  // and ExerciseEndResult to read from it.
  
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2 text-lg font-extrabold opacity-90">
      {/* Image */}
      {data.img && <ImageComponent src={data.img} className="mb-8 max-w-1/2" />}
      {/* Rei */}
      <div className="flex items-center">
        <div>
          <ruby>
            例<rt>れい</rt>
          </ruby>
          ：
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.rei[0] }} />
        <div>{"　→　"}</div>
        <div dangerouslySetInnerHTML={{ __html: data.rei[1] }} />
      </div>
      {/* Question */}
      <div className="mt-4 text-2xl flex items-center">
        <div>{data.part}）</div>
        <div dangerouslySetInnerHTML={{ __html: data.question }} />
        <div>{"　→　"}</div>
      </div>
      {/* Input */}
      <TextInput
        partNo={data.part}
        handleTextChange={(e) => {
            // Re-implementing handleTextChange inline to fix context usage match
             const val = e.target.value;
             setAnswers((prev: any) => {
                 // Return array-like object or specific logic?
                 // Original expected array in ExerciseEndResult.
                 // Let's use array for compatibility if I can.
                 // Or better, let's make answers an array in Context.
                 // For now, I'll allow object and fix ExerciseEndResult to use object keys.
                 return { ...prev, [data.part]: val };
             });
        }}
      />
    </div>
  );
}

export default ReadingWriting;
