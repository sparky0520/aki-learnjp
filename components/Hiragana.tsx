"use client";

import { useContext } from "react";
import AskAkiContext from "../contexts/AkiContext";

const hiragana = {
  basic: [
    ["あ", "a"],
    ["い", "i"],
    ["う", "u"],
    ["え", "e"],
    ["お", "o"],
    ["か", "ka"],
    ["き", "ki"],
    ["く", "ku"],
    ["け", "ke"],
    ["こ", "ko"],
    ["さ", "sa"],
    ["し", "shi"],
    ["す", "su"],
    ["せ", "se"],
    ["そ", "so"],
    ["た", "ta"],
    ["ち", "chi"],
    ["つ", "tsu"],
    ["て", "te"],
    ["と", "to"],
    ["な", "na"],
    ["に", "ni"],
    ["ぬ", "nu"],
    ["ね", "ne"],
    ["の", "no"],
    ["は", "ha"],
    ["ひ", "hi"],
    ["ふ", "fu"],
    ["へ", "he"],
    ["ほ", "ho"],
    ["ま", "ma"],
    ["み", "mi"],
    ["む", "mu"],
    ["め", "me"],
    ["も", "mo"],
    ["や", "ya"],
    ["ゆ", "yu"],
    ["よ", "yo"],
    ["ら", "ra"],
    ["り", "ri"],
    ["る", "ru"],
    ["れ", "re"],
    ["ろ", "ro"],
    ["わ", "wa"],
    ["を", "wo"],
    ["ん", "n"],
  ],
  tenten: [
    ["が", "ga"],
    ["ぎ", "gi"],
    ["ぐ", "gu"],
    ["げ", "ge"],
    ["ご", "go"],
    ["ざ", "za"],
    ["じ", "ji"],
    ["ず", "zu"],
    ["ぜ", "ze"],
    ["ぞ", "zo"],
    ["だ", "da"],
    ["ぢ", "ji"],
    ["づ", "zu"],
    ["で", "de"],
    ["ど", "do"],
    ["ば", "ba"],
    ["び", "bi"],
    ["ぶ", "bu"],
    ["べ", "be"],
    ["ぼ", "bo"],
    ["ぱ", "pa"],
    ["ぴ", "pi"],
    ["ぷ", "pu"],
    ["ぺ", "pe"],
    ["ぽ", "po"],
  ],
  mix: [
    ["きゃ", "kya"],
    ["きゅ", "kyu"],
    ["きょ", "kyo"],
    ["しゃ", "sha"],
    ["しゅ", "shu"],
    ["しょ", "sho"],
    ["ちゃ", "cha"],
    ["ちゅ", "chu"],
    ["ちょ", "cho"],
    ["にゃ", "nya"],
    ["にゅ", "nyu"],
    ["にょ", "nyo"],
    ["ひゃ", "hya"],
    ["ひゅ", "hyu"],
    ["ひょ", "hyo"],
    ["みゃ", "mya"],
    ["みゅ", "myu"],
    ["みょ", "myo"],
    ["りゃ", "rya"],
    ["りゅ", "ryu"],
    ["りょ", "ryo"],
    ["ぎゃ", "gya"],
    ["ぎゅ", "gyu"],
    ["ぎょ", "gyo"],
    ["じゃ", "ja"],
    ["じゅ", "ju"],
    ["じょ", "jo"],
    ["びゃ", "bya"],
    ["びゅ", "byu"],
    ["びょ", "byo"],
    ["ぴゃ", "pya"],
    ["ぴゅ", "pyu"],
    ["ぴょ", "pyo"],
  ],
};

function Hiragana() {
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  return (
    <div className="text-lg">
      <div>ひらがな</div>
      <div className="flex flex-col gap-16">
        {/* Basic */}
        <div>
          <div></div>
          <div className="grid grid-cols-5 gap-1">
            {hiragana.basic.map((e, i) => {
              const id = `hiragana-basic-${i}`;
              return (
                <button
                  className={getClassName(
                    id,
                    "p-4 btn transition-all duration-300"
                  )}
                  key={id}
                  id={id}
                  onClick={() => toggleHighlight(id)}
                >
                  <div>{e[0]}</div>
                  <div>{e[1]}</div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Tenten */}
        <div>
          <div>てんてん</div>
          <div className="grid grid-cols-5 gap-1">
            {hiragana.tenten.map((e, i) => {
              const id = `hiragana-tenten-${i}`;
              return (
                <button
                  className={getClassName(
                    id,
                    "p-4 btn transition-all duration-300"
                  )}
                  key={id}
                  id={id}
                  onClick={() => toggleHighlight(id)}
                >
                  <div>{e[0]}</div>
                  <div>{e[1]}</div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Mix */}
        <div>
          <div>ようおん</div>
          <div className="grid grid-cols-5 gap-1">
            {hiragana.mix.map((e, i) => {
              const id = `hiragana-mix-${i}`;
              return (
                <button
                  className={getClassName(
                    id,
                    "p-4 btn transition-all duration-300"
                  )}
                  key={id}
                  id={id}
                  onClick={() => toggleHighlight(id)}
                >
                  <div>{e[0]}</div>
                  <div>{e[1]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hiragana;
