import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function summarizeSession(transcript: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found, skipping summarization.");
    return "";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Summarize the following Japanese language learning session in 2-3 concise sentences. Focus on what the user practiced, what they struggled with, and what they learned. Do not include greetings or filler.

    Session Transcript:
    ${transcript}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error summarizing session:", error);
    return "";
  }
}
