export interface KanaDay {
  day: number;
  title: string;
  chars: string[];
  words: { text: string; romaji: string }[];
  sentence: { text: string; translation: string } | null;
}

export const KANA_DATA: KanaDay[] = [
  {
    day: 1,
    title: "Hiragana Vowels",
    chars: ["あ", "い", "う", "え", "お"],
    words: [],
    sentence: null,
  },
  {
    day: 2,
    title: "Hiragana K",
    chars: ["か", "き", "く", "け", "こ"],
    words: [],
    sentence: null,
  },
  {
    day: 3,
    title: "Hiragana S",
    chars: ["さ", "し", "す", "せ", "そ"],
    words: [],
    sentence: null,
  },
  {
    day: 4,
    title: "Hiragana T",
    chars: ["た", "ち", "つ", "て", "と"],
    words: [],
    sentence: null,
  },
  {
    day: 5,
    title: "Hiragana N",
    chars: ["な", "に", "ぬ", "ね", "の"],
    words: [
      { text: "なまえ", romaji: "namae" },
      { text: "にん", romaji: "nin" },
      { text: "です", romaji: "desu" },
    ],
    sentence: null,
  },
  {
    day: 6,
    title: "Hiragana H",
    chars: ["は", "ひ", "ふ", "へ", "ほ"],
    words: [
      { text: "はじめ", romaji: "hajime" },
      { text: "ひと", romaji: "hito" },
      { text: "ほん", romaji: "hon" },
    ],
    sentence: { text: "はじめまして", translation: "Nice to meet you" },
  },
  {
    day: 7,
    title: "Hiragana M",
    chars: ["ま", "み", "む", "め", "も"],
    words: [
      { text: "まま", romaji: "mama" },
      { text: "みみ", romaji: "mimi" },
      { text: "もっと", romaji: "motto" },
    ],
    sentence: { text: "わたしは[Name]です", translation: "I am [Name]" },
  },
  {
    day: 8,
    title: "Hiragana Y",
    chars: ["や", "ゆ", "よ"],
    words: [
      { text: "よく", romaji: "yoku" },
      { text: "ゆめ", romaji: "yume" },
      { text: "やま", romaji: "yama" },
    ],
    sentence: null,
  },
  {
    day: 9,
    title: "Hiragana R",
    chars: ["ら", "り", "る", "れ", "ろ"],
    words: [
      { text: "らく", romaji: "raku" },
      { text: "ろく", romaji: "roku" },
      { text: "りんご", romaji: "ringo" },
    ],
    sentence: null,
  },
  {
    day: 10,
    title: "Hiragana W/N",
    chars: ["わ", "を", "ん"],
    words: [
      { text: "わたし", romaji: "watashi" },
      { text: "を", romaji: "wo" },
      { text: "なに", romaji: "nani" },
    ],
    sentence: { text: "よろしく", translation: "Nice to meet you (regards)" },
  },
  {
    day: 11,
    title: "Hiragana Dakuten KG",
    chars: ["が", "ぎ", "ぐ", "げ", "ご"],
    words: [
      { text: "げんき", romaji: "genki" },
      { text: "がっこう", romaji: "gakkou" },
    ],
    sentence: {
      text: "よろしくお願いします",
      translation: "Please treat me well",
    },
  },
  {
    day: 12,
    title: "Hiragana Dakuten SZ",
    chars: ["ざ", "じ", "ず", "ぜ", "ぞ"],
    words: [{ text: "ぜんぜん", romaji: "zenzen" }],
    sentence: { text: "[Name]です", translation: "I am [Name]" },
  },
  {
    day: 13,
    title: "Hiragana Dakuten TD",
    chars: ["だ", "ぢ", "づ", "で", "ど"],
    words: [{ text: "だいすき", romaji: "daisuki" }],
    sentence: null,
  },
  {
    day: 14,
    title: "Hiragana Dakuten HB",
    chars: ["ば", "び", "ぶ", "べ", "ぼ"],
    words: [{ text: "びょういん", romaji: "byouin" }],
    sentence: null,
  },
  {
    day: 15,
    title: "Hiragana Combos KY/GY",
    chars: ["きゃ", "きゅ", "きょ", "ぎゃ", "ぎゅ", "ぎょ"],
    words: [{ text: "きょうかい", romaji: "kyoukai" }],
    sentence: null,
  },
  {
    day: 16,
    title: "Hiragana Combos SH/J",
    chars: ["しゃ", "しゅ", "しょ", "じゃ", "じゅ", "じょ"],
    words: [{ text: "しゃしん", romaji: "shashin" }],
    sentence: null,
  },
  {
    day: 17,
    title: "Hiragana Combos CH",
    chars: ["ちゃ", "ちゅ", "ちょ"],
    words: [{ text: "ちず", romaji: "chizu" }],
    sentence: null,
  },
  {
    day: 18,
    title: "Review + Small Tsu",
    chars: ["っ (tsu)"],
    words: [{ text: "きっと", romaji: "kitto" }],
    sentence: null,
  },
  {
    day: 19,
    title: "Hiragana Full Review",
    chars: ["All prior"],
    words: [{ text: "Mixed review", romaji: "" }],
    sentence: { text: "Mixed review", translation: "" },
  },
  {
    day: 20,
    title: "Hiragana Mastery",
    chars: ["Mixed quiz prep"],
    words: [{ text: "All vocab", romaji: "" }],
    sentence: { text: "Full intro practice", translation: "" },
  },
  {
    day: 21,
    title: "Katakana Vowels",
    chars: ["ア", "イ", "ウ", "エ", "オ"],
    words: [],
    sentence: {
      text: "わたしはインドからきました",
      translation: "I came from India",
    },
  },
  {
    day: 22,
    title: "Katakana K",
    chars: ["カ", "キ", "ク", "ケ", "コ"],
    words: [{ text: "コーヒー", romaji: "koohii (coffee)" }],
    sentence: null,
  },
  {
    day: 23,
    title: "Katakana S/T",
    chars: ["サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト"],
    words: [{ text: "トーキョー", romaji: "tookyoo (Tokyo)" }],
    sentence: {
      text: "わたしはソフトウェアエンジニアです",
      translation: "I am a software engineer",
    },
  },
  {
    day: 24,
    title: "Katakana N",
    chars: ["ナ", "ニ", "ヌ", "ネ", "ノ"],
    words: [{ text: "インド", romaji: "indo (India)" }],
    sentence: null,
  },
  {
    day: 25,
    title: "Katakana H",
    chars: ["ハ", "ヒ", "フ", "ヘ", "ホ"],
    words: [{ text: "ホテル", romaji: "hoteru (hotel)" }],
    sentence: null,
  },
  {
    day: 26,
    title: "Katakana M",
    chars: ["マ", "ミ", "ム", "メ", "モ"],
    words: [{ text: "ミュージック", romaji: "myuujikku (music)" }],
    sentence: null,
  },
  {
    day: 27,
    title: "Katakana Y",
    chars: ["ヤ", "ユ", "ヨ"],
    words: [{ text: "ユーチューブ", romaji: "yuuchuubu (YouTube)" }],
    sentence: null,
  },
  {
    day: 28,
    title: "Katakana R",
    chars: ["ラ", "リ", "ル", "レ", "ロ"],
    words: [{ text: "ラーメン", romaji: "raamen (ramen)" }],
    sentence: null,
  },
  {
    day: 29,
    title: "Katakana Full Review",
    chars: ["All katakana"],
    words: [{ text: "Mixed foreign words", romaji: "" }],
    sentence: { text: "Full self-intro", translation: "" },
  },
  {
    day: 30,
    title: "Katakana Mastery",
    chars: ["Mixed hiragana/katakana"],
    words: [{ text: "All vocab", romaji: "" }],
    sentence: { text: "Complete intro recording", translation: "" },
  },
  {
    day: 31,
    title: "Final Challenge",
    chars: ["All kana"],
    words: [{ text: "Self-intro template", romaji: "" }],
    sentence: { text: "User creates own intro", translation: "" },
  },
];

export function getDayData(day: number): KanaDay | undefined {
  return KANA_DATA.find((d) => d.day === day);
}
