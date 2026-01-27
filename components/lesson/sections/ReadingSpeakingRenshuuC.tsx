import React from "react";
import Image from "../../ui/Image";

// Assuming data structure based on usage in original code
interface RenshuuCData {
  img?: string;
  rei?: string[];
  questionImg?: string;
  part?: number;
  correctAnswers?: string | string[];
}

function ReadingSpeakingRenshuuC({ data }: { data: RenshuuCData }) {
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
          <div className="h-50 overflow-y-auto custom-scroll pr-2">
            {/* Map over content array properly */}
            {data.rei &&
              data.rei.map((item, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="mb-4"
                />
              ))}
          </div>
        </div>
        {/* Rei Image */}
        {data.img && <Image src={data.img} className="max-w-[300px]" />}
      </div>
      <div className="flex flex-col items-center text-lg">
        <span
          className="font-extrabold opacity-90 mb-2"
          dangerouslySetInnerHTML={{
            __html: `${data.part}. ${Array.isArray(data.correctAnswers) ? data.correctAnswers.join("・") : data.correctAnswers || ""}`,
          }}
        ></span>
        {/* Question Image */}
        {data.questionImg && (
          <Image src={data.questionImg} className="max-w-[300px]" />
        )}
      </div>

      {/* Input */}
      <div className="my-4">{/* <AudioBar /> */}</div>
    </div>
  );
}

export default ReadingSpeakingRenshuuC;
