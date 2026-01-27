import { useState } from "react";
import { useAnswers } from "../contexts/AnswersContext";

interface Mondai456Data {
  text_content: string;
  rei: string;
  questions: string[];
}

function ListeningWritingMondai456({
  data,
  currentQuestion,
}: {
  data: Mondai456Data;
  currentQuestion: number;
}) {
  const { setAnswer } = useAnswers();
  const [temp, setTemp] = useState<
    { partNo: number; id: number; text: string }[]
  >([]);

  const handleTextChange = (partNo: number, id: number, text: string) => {
    // Create the updated array
    const updated = [
      ...temp.filter((t) => !(t.partNo === partNo && t.id === id)),
      { partNo, id, text },
    ];

    const t = updated.filter((t) => t.partNo === partNo);
    t.sort((a, b) => a.id - b.id);
    const str = t.map((item) => item.text);
    setAnswer(partNo, str.join("、")); // Joining with Japanese comma as in original

    setTemp(updated);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

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
      <div className="flex flex-col gap-8 mt-4 w-full px-10">
        {content.questions.map((ele, i) => (
          <div className="text-lg flex gap-3 items-baseline" key={i}>
            {currentQuestion + 1 !== 6 && ( // specific check from original code
              <span className="font-extrabold opacity-90">{i + 1}.</span>
            )}
            <div className="leading-loose">
              {ele.split("　").map((e, j) => {
                if (j !== 0) {
                  return (
                    <span key={"e" + j}>
                      <input
                        className="border-b border-gray-400 px-1 mb-1 text-center hover:border-gray-800 focus:outline-none w-20 bg-transparent mx-1"
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
