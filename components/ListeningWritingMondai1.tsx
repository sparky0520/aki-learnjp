import React from "react";
import PlaybackBar from "./PlaybackBar";
import TextInput from "./TextInput";
import { useAnswers } from "../contexts/AnswersContext";

interface Mondai1Data {
  audio_url: string;
  text_content: string;
  rei: string;
}

function ListeningWritingMondai1({ data }: { data: Mondai1Data }) {
  const { setAnswer } = useAnswers();

  // Currying the function
  const handleTextChange =
    (partNo: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswer(partNo, e.target.value);
    };

  if (!data) {
    return <div>Loading...</div>;
  }

  const content = {
    ...data,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Audio */}
      <PlaybackBar audio={content.audio_url} />
      {/* Text */}
      <div>{content.text_content}</div>
      <div className="flex items-center text-lg font-extrabold opacity-90">
        <div>
          <ruby>
            例<rt>れい</rt>
          </ruby>
          ：{"　"}
        </div>
        <div dangerouslySetInnerHTML={{ __html: content.rei }} />
      </div>
      {Array.from({ length: 5 }).map((e, i) => (
        <div className="text-lg flex items-end gap-3" key={"mondai1" + i}>
          <span className="font-extrabold opacity-90">{i + 1}.</span>
          <TextInput
            partNo={i + 1}
            handleTextChange={handleTextChange(i + 1)} // only partNo passed here - event passed from TextInput
          />
        </div>
      ))}
    </div>
  );
}

export default ListeningWritingMondai1;
