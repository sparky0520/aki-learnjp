"use client";

import AudioBar from "@/components/AudioBar";
import ImageComponent from "@/components/Image";

function ReadingSpeakingRenshuuC({ data }: { data: any }) {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Rei */}
      <div className="w-max max-w-5/6 flex gap-8 items-end">
        {/* Text */}
        <div className="text-lg">
          <div>
            <ruby>
              例<rt>れい</rt>
            </ruby>
            {" → "}
          </div>
          <div className="h-50 overflow-y-auto custom-scroll">
            {/* Map over content array properly */}
            {data.rei &&
              data.rei.map((item: string, index: number) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="mb-4"
                />
              ))}
          </div>
        </div>
        {/* Rei Image */}
        {data.img && <ImageComponent src={data.img} />}
      </div>
      <div className="flex flex-col items-center text-lg">
        <span className="font-extrabold opacity-90">{data.part}.</span>
        {/* Question Image */}
        {data.questionImg && <ImageComponent src={data.questionImg} />}
      </div>

      {/* Input */}
      <div className="my-4">
         <AudioBar />
      </div>
    </div>
  );
}

export default ReadingSpeakingRenshuuC;
