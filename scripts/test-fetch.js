const https = require("https");

const url =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/03042.svg";

console.log("Fetching", url);

https
  .get(url, (res) => {
    console.log("Status:", res.statusCode);
    let data = "";
    res.on("data", (d) => (data += d));
    res.on("end", () => console.log("Data length:", data.length));
  })
  .on("error", (e) => console.error("Error:", e));
