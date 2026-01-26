"use client";

import { useState } from "react";
import { useAnswers } from "../contexts/AnswersContext";

function ListeningWritingMondai456({ data, currentQuestion }: { data: any, currentQuestion: number }) {
  const { setAnswers } = useAnswers();
  const [temp, setTemp] = useState<any[]>([]);

  const handleTextChange = (partNo: number, id: number, text: string) => {
    // Create the updated array
    const updated = [
      ...temp.filter((t) => !(t.partNo === partNo && t.id === id)),
      { partNo, id, text },
    ];

    const t = updated.filter((t) => t.partNo === partNo);
    t.sort((a, b) => a.id - b.id);
    const str = t.map((item) => item.text);
    
    setAnswers((prev: any) => ({
        ...prev,
        [partNo]: str.join("、")
    }));

    setTemp(updated);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  // Map data keys if needed
  const content = {
    ...data,
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
      <div className="flex flex-col gap-8 mt-4">
        {content.questions.map((ele: string, i: number) => (
          <div className="text-lg flex gap-3" key={i}>
            {currentQuestion + 1 !== 6 && ( // for part 6 check?
              <span className="font-extrabold opacity-90">{i + 1}.</span>
            )}
            <div>
              {ele.split("　").map((e, j) => {
                if (j !== 0) {
                  return (
                    <span key={"e" + j}>
                      <input
                        className="border-b border-gray-400 px-1 mb-1 text-center hover:border-gray-800 focus:outline-none w-min bg-transparent"
                        onChange={(e) =>
                          handleTextChange(i + 1, j, e.target.value)
                        }
                      />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: e.replace(" …", "<br/>&nbsp; …"),
                        }}
                      />
                    </span>
                  );
                } else {
                  return (
                    <span key={"e" + j}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: e,
                        }}
                      />
                    </span>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeningWritingMondai456;
