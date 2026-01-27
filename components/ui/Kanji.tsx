"use client";

import { useContext } from "react";
import AskAkiContext from "../../contexts/lesson/AkiContext";

const kanji = [
  ["一", "ichi", "one"],
  ["二", "ni", "two"],
  ["三", "san", "three"],
  ["四", "shi/yon", "four"],
  ["五", "go", "five"],
  ["六", "roku", "six"],
  ["七", "shichi/nana", "seven"],
  ["八", "hachi", "eight"],
  ["九", "kyuu/ku", "nine"],
  ["十", "juu", "ten"],
  ["火", "hi/ka", "fire"],
  ["水", "mizu/sui", "water"],
  ["木", "ki/moku", "tree/wood"],
  ["金", "kin/kane", "gold/money"],
  ["土", "tsuchi/do", "earth/soil"],
  ["日", "hi/nichi", "sun/day"],
  ["月", "tsuki/getsu", "moon/month"],
  ["山", "yama/san", "mountain"],
  ["川", "kawa/sen", "river"],
  ["人", "hito/jin", "person"],
];

function Kanji() {
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  return (
    <div className="text-lg">
      <div>かんじ</div>
      {/* Basic */}
      <div>
        <div></div>
        <div className="grid grid-cols-5 gap-1">
          {kanji.map((e, i) => {
            const id = `kanji-${i}`;
            return (
              <button
                className={getClassName(
                  id,
                  "p-4 btn transition-all duration-300",
                )}
                key={id}
                id={id}
                onClick={() => toggleHighlight(id)}
              >
                <div>{e[0]}</div>
                <div className="mt-2 flex items-center justify-around">
                  <div>{e[1]}</div>
                  <div>{e[2]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 opacity-30">
        *Use app.kanjialive.com for detailed stroke order, meaning and words
      </div>
    </div>
  );
}

export default Kanji;
