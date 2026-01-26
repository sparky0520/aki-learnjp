"use client";

import { useContext } from "react";
import AskAkiContext from "../contexts/AkiContext";

const katakana = {
  basic: [
    ["ア", "a"],
    ["イ", "i"],
    ["ウ", "u"],
    ["エ", "e"],
    ["オ", "o"],
    ["カ", "ka"],
    ["キ", "ki"],
    ["ク", "ku"],
    ["ケ", "ke"],
    ["コ", "ko"],
    ["サ", "sa"],
    ["シ", "shi"],
    ["ス", "su"],
    ["セ", "se"],
    ["ソ", "so"],
    ["タ", "ta"],
    ["チ", "chi"],
    ["ツ", "tsu"],
    ["テ", "te"],
    ["ト", "to"],
    ["ナ", "na"],
    ["ニ", "ni"],
    ["ヌ", "nu"],
    ["ネ", "ne"],
    ["ノ", "no"],
    ["ハ", "ha"],
    ["ヒ", "hi"],
    ["フ", "fu"],
    ["ヘ", "he"],
    ["ホ", "ho"],
    ["マ", "ma"],
    ["ミ", "mi"],
    ["ム", "mu"],
    ["メ", "me"],
    ["モ", "mo"],
    ["ヤ", "ya"],
    ["ユ", "yu"],
    ["ヨ", "yo"],
    ["ラ", "ra"],
    ["リ", "ri"],
    ["ル", "ru"],
    ["レ", "re"],
    ["ロ", "ro"],
    ["ワ", "wa"],
    ["ヲ", "wo"],
    ["ン", "n"],
  ],
  tenten: [
    ["ガ", "ga"],
    ["ギ", "gi"],
    ["グ", "gu"],
    ["ゲ", "ge"],
    ["ゴ", "go"],
    ["ザ", "za"],
    ["ジ", "ji"],
    ["ズ", "zu"],
    ["ゼ", "ze"],
    ["ゾ", "zo"],
    ["ダ", "da"],
    ["ヂ", "ji"],
    ["ヅ", "zu"],
    ["デ", "de"],
    ["ド", "do"],
    ["バ", "ba"],
    ["ビ", "bi"],
    ["ブ", "bu"],
    ["ベ", "be"],
    ["ボ", "bo"],
    ["パ", "pa"],
    ["ピ", "pi"],
    ["プ", "pu"],
    ["ペ", "pe"],
    ["ポ", "po"],
  ],
  mix: [
    ["キャ", "kya"],
    ["キュ", "kyu"],
    ["キョ", "kyo"],
    ["シャ", "sha"],
    ["シュ", "shu"],
    ["ショ", "sho"],
    ["チャ", "cha"],
    ["チュ", "chu"],
    ["チョ", "cho"],
    ["ニャ", "nya"],
    ["ニュ", "nyu"],
    ["ニョ", "nyo"],
    ["ヒャ", "hya"],
    ["ヒュ", "hyu"],
    ["ヒョ", "hyo"],
    ["ミャ", "mya"],
    ["ミュ", "myu"],
    ["ミョ", "myo"],
    ["リャ", "rya"],
    ["リュ", "ryu"],
    ["リョ", "ryo"],
    ["ギャ", "gya"],
    ["ギュ", "gyu"],
    ["ギョ", "gyo"],
    ["ジャ", "ja"],
    ["ジュ", "ju"],
    ["ジョ", "jo"],
    ["ビャ", "bya"],
    ["ビュ", "byu"],
    ["ビョ", "byo"],
    ["ピャ", "pya"],
    ["ピュ", "pyu"],
    ["ピョ", "pyo"],
  ],
};

function Katakana() {
  const { getClassName, toggleHighlight } = useContext(AskAkiContext);

  return (
    <div className="text-lg">
      <div>かたかな</div>
      <div className="flex flex-col gap-16">
        {/* Basic */}
        <div>
          <div></div>
          <div className="grid grid-cols-5 gap-1">
            {katakana.basic.map((e, i) => {
              const id = `katakana-basic-${i}`;
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
            {katakana.tenten.map((e, i) => {
              const id = `katakana-tenten-${i}`;
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
            {katakana.mix.map((e, i) => {
              const id = `katakana-mix-${i}`;
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

export default Katakana;
