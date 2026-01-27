import { useState } from "react";
import PlaybackBar from "../shared/PlaybackBar";
import { useAnswers } from "../../../contexts/lesson/AnswersContext";

interface Mondai3Data {
  audio_url: string;
  text_content: string;
}

function ListeningWritingMondai3({ data }: { data: Mondai3Data }) {
  const { setAnswer } = useAnswers();
  const [one, setOne] = useState("　");
  const [two, setTwo] = useState("　");
  const [three, setThree] = useState("　");

  if (!data) {
    return <div>Loading...</div>;
  }

  const audio = data.audio_url || "";

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.currentTarget as HTMLDivElement).id;
    let ans = "○";
    switch (id) {
      case "1":
        if (one === "　" || one === "×") {
          ans = "○";
        } else {
          ans = "×";
        }
        setOne(ans);
        setAnswer(1, ans);
        break;
      case "2":
        if (two === "　" || two === "×") {
          ans = "○";
        } else {
          ans = "×";
        }
        setTwo(ans);
        setAnswer(2, ans);
        break;
      case "3":
        if (three === "　" || three === "×") {
          ans = "○";
        } else {
          ans = "×";
        }
        setThree(ans);
        setAnswer(3, ans);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Audio */}
      <PlaybackBar audio={audio} />
      {/* Text */}
      <div>{data.text_content}</div>
      <div className="text-lg font-extrabold opacity-90">
        <ruby>
          例<rt>れい</rt>
        </ruby>
        １：（×）
        <ruby>
          例<rt>れい</rt>
        </ruby>
        ２：（○）
      </div>
      {/* Input */}
      <div className="flex gap-5 mt-4">
        <div
          id="1"
          className="select-none text-2xl font-extrabold opacity-90 p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
          onClick={handleClick}
        >
          １）（{one}）
        </div>
        <div
          id="2"
          className="select-none text-2xl font-extrabold opacity-90 p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
          onClick={handleClick}
        >
          ２）（{two}）
        </div>
        <div
          id="3"
          className="select-none text-2xl font-extrabold opacity-90 p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
          onClick={handleClick}
        >
          ３）（{three}）
        </div>
      </div>
    </div>
  );
}

export default ListeningWritingMondai3;
