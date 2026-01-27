import { useState } from "react";
import { useAnswers } from "../../../contexts/lesson/AnswersContext";
import Image from "../../ui/Image";

function ListeningWritingMondai2Input({
  part,
  option1Image,
  option2Image,
  option3Image,
}: {
  part: number;
  option1Image: string;
  option2Image: string;
  option3Image: string;
}) {
  const { setAnswer } = useAnswers();
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="flex gap-5">
      {/* Option 1 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => {
          setChosen("1");
          setAnswer(part, option1Image);
        }}
      >
        <div
          className={`p-px rounded-full ${chosen === "1" ? "border-2 border-black" : ""}`}
        >
          <div
            className={`rounded-full border border-gray-400 p-4 cursor-pointer select-none w-min relative opacity-90 w-12 h-12 flex items-center justify-center`}
          >
            <div className="text-xl font-bold">1</div>
          </div>
        </div>
        <Image src={option1Image} className="max-w-[200px]" alt="option 1" />
      </div>
      {/* Option 2 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => {
          setChosen("2");
          setAnswer(part, option2Image);
        }}
      >
        <div
          className={`p-px rounded-full ${chosen === "2" ? "border-2 border-black" : ""}`}
        >
          <div
            className={`rounded-full border border-gray-400 p-4 cursor-pointer select-none w-min relative opacity-90 w-12 h-12 flex items-center justify-center`}
          >
            <div className="text-xl font-bold">2</div>
          </div>
        </div>
        <Image src={option2Image} className="max-w-[200px]" alt="option 2" />
      </div>
      {/* Option 3 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => {
          setChosen("3");
          setAnswer(part, option3Image);
        }}
      >
        <div
          className={`p-px rounded-full ${chosen === "3" ? "border-2 border-black" : ""}`}
        >
          <div
            className={`rounded-full border border-gray-400 p-4 cursor-pointer select-none w-min relative opacity-90 w-12 h-12 flex items-center justify-center`}
          >
            <div className="text-xl font-bold">3</div>
          </div>
        </div>
        <Image src={option3Image} className="max-w-[200px]" alt="option 3" />
      </div>
    </div>
  );
}

export default ListeningWritingMondai2Input;
