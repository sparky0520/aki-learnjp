import React from "react";
import TextInput from "./TextInput";
import { useAnswers } from "../contexts/AnswersContext";
import Image from "./Image";

interface ReadingWritingProps {
  data: {
    img?: string;
    rei: string[];
    question: string;
    part: number;
  };
}

function ReadingWriting({ data }: ReadingWritingProps) {
  const { setAnswer } = useAnswers();

  // Currying the function
  const handleTextChange =
    (partNo: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(partNo, e.target.value);
    };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2 text-lg font-extrabold opacity-90">
      {/* Image */}
      {data.img && <Image src={data.img} className="mb-8 max-w-1/2" />}
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
        handleTextChange={handleTextChange(data.part)}
      />
    </div>
  );
}

export default ReadingWriting;
