"use client";

import { useState } from "react";
import { useAnswers } from "@/contexts/AnswersContext";
import ImageComponent from "@/components/Image";

interface ListeningWritingMondai2InputProps {
  part: number;
  option1Image: string;
  option2Image: string;
  option3Image: string;
}

function ListeningWritingMondai2Input({
  part,
  option1Image,
  option2Image,
  option3Image,
}: ListeningWritingMondai2InputProps) {
  const { setAnswers } = useAnswers();
  const [chosen, setChosen] = useState<string | null>(null);

  const handleSelect = (choice: string, image: string) => {
      setChosen(choice);
      setAnswers((prev: any) => ({
          ...prev,
          [part]: image
      }));
  }

  return (
    <div className="flex gap-5">
      {/* Option 1 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleSelect("1", option1Image)}
      >
        <div
          className={`p-px rounded-full ${chosen === "1" ? "border-2" : ""}`}
        >
          <div
            className={`rounded-full border p-4 cursor-pointer select-none w-min relative opacity-90`}
          >
            <div className="absolute left-3 top-1.5">1</div>
          </div>
        </div>
        <ImageComponent src={option1Image} className="max-w-2/3" alt="option 1" />
      </div>
      {/* Option 2 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleSelect("2", option2Image)}
      >
        <div
          className={`p-px rounded-full ${chosen === "2" ? "border-2" : ""}`}
        >
          <div
            className={`rounded-full border p-4 cursor-pointer select-none w-min relative opacity-90`}
          >
            <div className="absolute left-3 top-1.5">2</div>
          </div>
        </div>
        <ImageComponent src={option2Image} className="max-w-2/3" alt="option 2" />
      </div>
      {/* Option 3 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleSelect("3", option3Image)}
      >
        <div
          className={`p-px rounded-full ${chosen === "3" ? "border-2" : ""}`}
        >
          <div
            className={`rounded-full border p-4 cursor-pointer select-none w-min relative opacity-90`}
          >
            <div className="absolute left-3 top-1.5">3</div>
          </div>
        </div>
        <ImageComponent src={option3Image} className="max-w-2/3" alt="option 3" />
      </div>
    </div>
  );
}

export default ListeningWritingMondai2Input;
