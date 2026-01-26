"use client";

import ImageComponent from "./Image";
import ListeningWritingMondai2Input from "./ListeningWritingMondai2Input";
import PlaybackBar from "./PlaybackBar";

function ListeningWritingMondai2({ data }: { data: any }) {
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
        {content.rei.map((e: string, i: number) => (
          <div
            className="flex flex-col items-center gap-2"
            key={"mondai2-rei" + i}
          >
            <div className={`p-px rounded-full ${i === 1 ? "border-2" : ""}`}>
              <div className="rounded-full border p-4 cursor-pointer select-none w-min relative opacity-90">
                <div className="absolute left-3 top-1.5">{i + 1}</div>
              </div>
            </div>
            <ImageComponent src={e} className="max-w-2/3" alt={`rei ${i + 1}`} />
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col gap-16 items-center justify-around">
        <div>
          <span className="font-extrabold opacity-90">1.</span>
          <ListeningWritingMondai2Input
            part={1}
            option1Image={content.questions[0][0]}
            option2Image={content.questions[0][1]}
            option3Image={content.questions[0][2]}
          />
        </div>
        <div>
          <span className="font-extrabold opacity-90">2.</span>
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
