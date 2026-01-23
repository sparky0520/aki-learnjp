"use client";

import ImageComponent from "@/components/Image";
import KaiwaTextSnippet from "@/components/KaiwaTextSnippet";
import PlaybackBar from "@/components/PlaybackBar";

function ReadingListeningSpeakingKaiwa({ data }: { data: any }) {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-8 items-center">
        {/* Question */}
        <div className="w-1/2 flex justify-center">{data.img && <ImageComponent src={data.img} />}</div>
        <div className="w-1/2">
          {/* Heading */}
          <div className="text-center text-lg font-bold mb-2">
            {data.heading}
          </div>
          {/* Kaiwa text */}
          <div className="flex flex-col gap-8 max-h-80 pr-4 overflow-y-auto custom-scroll">
            {/* Text snippet 1 */}
            {data.text &&
              data.text.map((e: string, i: number) => (
                <KaiwaTextSnippet active={true} text={e} key={i} />
              ))}
          </div>
        </div>
      </div>
      <PlaybackBar audio={data.audio} />
    </div>
  );
}

export default ReadingListeningSpeakingKaiwa;
