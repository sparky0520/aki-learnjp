import fs from "fs";
import path from "path";
import https from "https";
import { KANA_DATA } from "../lib/kana-data";

// Define types for the data we want to generate
interface KanaStrokes {
  [character: string]: string[]; // Array of path strings
}

const OUTPUT_FILE = path.join(process.cwd(), "lib", "kana-strokes.json");
const KANJIVG_BASE_URL =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";

// Helper to get hex code for a character
function getHex(char: string): string {
  return char.charCodeAt(0).toString(16).padStart(5, "0");
}

// Helper to fetch SVG content
function fetchSvg(hex: string): Promise<string | null> {
  const url = `${KANJIVG_BASE_URL}${hex}.svg`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`Failed to fetch ${hex} (Status: ${res.statusCode})`);
        resolve(null);
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", (err) => {
        console.error(`Error fetching ${hex}:`, err);
        resolve(null);
      });
    });
  });
}

// Helper to extract paths from SVG
function extractPaths(svg: string): string[] {
  // Simple regex to find path d="..."
  // KanjiVG files usually have paths in format: <path ... d="..." ... />
  // We want to extract the d attribute value.
  const paths: string[] = [];
  const regex = /<path[^>]*\sd="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svg)) !== null) {
    // KanjiVG sometimes includes paths for stroke numbers, we need to filter those.
    // Usually stroke paths are in groups with id "kvg:StrokePaths_..." or similar.
    // However due to the consistent format, the first N paths correspond to strokes,
    // and stroke numbers are usually in a separate group <g id="kvg:StrokeNumbers_..."> which contains <text> elements, not paths (or paths if converted, but KanjiVG uses text for numbers in recent versions).
    // Let's verify standard KanjiVG format.
    // Based on 03042.svg seen earlier:
    // <g id="kvg:StrokePaths_03042"> ... <path ... d="..." /> ... </g>
    // <g id="kvg:StrokeNumbers_03042"> ... <text> ... </text> ... </g>
    // So extracting all path d attributes should be safe as long as we don't pick up other paths.
    // But just to be safe, let's assume all 'd' attributes in the file belong to strokes.
    // Actually strictly speaking, we only want paths inside the kvg:StrokePaths group.

    paths.push(match[1]);
  }
  return paths;
}

async function main() {
  console.log("Starting Kana data fetch...");

  const uniqueChars = new Set<string>();

  // Collect all characters from KANA_DATA
  KANA_DATA.forEach((day) => {
    day.chars.forEach((char) => {
      // User requested: "Make sure the animations are there only for individual characters"
      // Filter out multi-char strings (combos)
      if (char.length === 1) {
        uniqueChars.add(char);
      }
    });

    // Also check previous/next chars logic if needed?
    // Usually standard hiragana/katakana are single chars.
    // Small chars like 'っ' are also single chars.
    // Combos like 'きゃ' are two chars. 'chars' array in data sometimes has them together?
    // Let's check the data.
    // Day 16: chars: ["きゃ", "きゅ"...] -> length 2.
    // We strictly filter for length === 1.
  });

  const encodedData: KanaStrokes = {};

  console.log(`Found ${uniqueChars.size} unique single characters.`);

  for (const char of uniqueChars) {
    const hex = getHex(char);
    process.stdout.write(`Fetching ${char} (${hex})... `);

    const svg = await fetchSvg(hex);
    if (svg) {
      const paths = extractPaths(svg);
      if (paths.length > 0) {
        encodedData[char] = paths;
        console.log(`OK (${paths.length} strokes)`);
      } else {
        console.log("No paths found");
      }
    } else {
      console.log("Failed");
    }

    // Polite delay
    await new Promise((r) => setTimeout(r, 100));
  }

  // Also manually add 'small tsu' or others if they were missed?
  // They should be in KANA_DATA.

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(encodedData, null, 2));
  console.log(`\nWritten stroke data to ${OUTPUT_FILE}`);
}

main().catch(console.error);
