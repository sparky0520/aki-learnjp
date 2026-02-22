import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function summarizeSession(transcript: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found, skipping summarization.");
    return "";
  }

  try {
    const prompt = `Summarize the following Japanese language learning session in 2-3 concise sentences. Focus on what the user practiced, what they struggled with, and what they learned. Do not include greetings or filler.

    Session Transcript:
    ${transcript}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error summarizing session:", error);
    return "";
  }
}
