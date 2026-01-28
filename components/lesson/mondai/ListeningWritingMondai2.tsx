import React from "react";
import Image from "../../ui/Image";
import ListeningWritingMondai2Input from "./ListeningWritingMondai2Input";
import PlaybackBar from "../shared/PlaybackBar";

interface Mondai2Data {
  audio_url: string;
  text_content: string;
  rei: string[];
  questions: string[][]; // Array of questions, each question has options which are image URLs
}

function ListeningWritingMondai2({ data }: { data: Mondai2Data }) {
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
      {/* Rei */}
      <div className="flex gap-2 items-center justify-center">
        {/* Rei text */}
        <div className="text-lg font-extrabold opacity-90">
          <ruby>
            例<rt>れい</rt>
          </ruby>
          ：
        </div>
        {/* Sample Option */}
        {content.rei &&
          content.rei.map((e, i) => (
            <div
              className="flex flex-col items-center gap-2"
              key={"mondai2-rei" + i}
            >
              <div
                className={`p-px rounded-full ${i === 1 ? "border-2 border-black" : ""}`}
              >
                <div className="rounded-full border border-gray-400 p-4 cursor-pointer select-none relative opacity-90 w-12 h-12 flex items-center justify-center">
                  <div className="text-xl font-bold">{i + 1}</div>
                </div>
              </div>
              <Image
                src={e}
                className="max-w-50 pointer-events-none"
                alt={`rei ${i + 1}`}
              />
            </div>
          ))}
      </div>
      <div className="w-full flex flex-col gap-16 items-center justify-around mt-8">
        <div>
          <span className="font-extrabold opacity-90 text-xl mr-4">1.</span>
          <ListeningWritingMondai2Input
            part={1}
            option1Image={content.questions[0][0]}
            option2Image={content.questions[0][1]}
            option3Image={content.questions[0][2]}
          />
        </div>
        <div>
          <span className="font-extrabold opacity-90 text-xl mr-4">2.</span>
          <ListeningWritingMondai2Input
            part={2}
            option1Image={content.questions[1][0]}
            option2Image={content.questions[1][1]}
            option3Image={content.questions[1][2]}
          />
        </div>
      </div>
    </div>
  );
}

export default ListeningWritingMondai2;
