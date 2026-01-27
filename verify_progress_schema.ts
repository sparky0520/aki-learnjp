import * as fs from "fs";
import * as path from "path";

// Manual .env parsing
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, { encoding: "utf8" });
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"](.*)['"]$/, "$1");
      process.env[key] = value;
    }
  });
}

const { supabase } = require("./lib/supabase");

async function main() {
  console.log("Checking user_lesson_progress columns...");
  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("No data found in user_lesson_progress to infer columns.");
      // Try inserting a dummy row to see columns if allowed, or just trust the detailed plan
      // For now, let's assume if no data, we might need to rely on assumptions or insert a test row if needed.
    }
  }
}

main();
