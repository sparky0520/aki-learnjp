import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { userId, orgId, orgRole } = await auth();
        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Unauthorized: Missing user or organization context" },
                { status: 401 }
            );
        }

        const { lesson_ids, dispatch } = await request.json();

        if (!lesson_ids || !Array.isArray(lesson_ids) || lesson_ids.length === 0) {
            return NextResponse.json(
                { error: "Invalid lesson_ids provided" },
                { status: 400 },
            );
        }

        if (dispatch && orgRole !== "org:admin") {
            return NextResponse.json(
                { error: "Forbidden: Only organization admins can dispatch quizzes" },
                { status: 403 }
            );
        }

        // Fetch data for selected lessons
        const { data: lessons, error: lessonsError } = await supabase
            .from("lessons")
            .select("id, lesson_number, title")
            .in("id", lesson_ids);

        if (lessonsError) throw lessonsError;

        // Fetch content for these lessons
        const { data: goi, error: goiError } = await supabase
            .from("goi")
            .select("lesson_id, content")
            .in("lesson_id", lesson_ids);

        if (goiError) throw goiError;

        const { data: bunkei, error: bunkeiError } = await supabase
            .from("bunkei")
            .select("lesson_id, patterns")
            .in("lesson_id", lesson_ids);

        if (bunkeiError) throw bunkeiError;

        const { data: reibun, error: reibunError } = await supabase
            .from("reibun")
            .select("lesson_id, sentences")
            .in("lesson_id", lesson_ids);

        if (reibunError) throw reibunError;

        // Prepare context for Gemini
        const context = lessons.map((lesson) => {
            const l_goi = goi.find((g) => g.lesson_id === lesson.id)?.content || [];
            const l_bunkei =
                bunkei.find((b) => b.lesson_id === lesson.id)?.patterns || [];
            const l_reibun =
                reibun.find((r) => r.lesson_id === lesson.id)?.sentences || [];

            return `
Lesson ${lesson.lesson_number}: ${lesson.title}
Vocabulary (Goi): ${JSON.stringify(l_goi)}
Sentence Patterns (Bunkei): ${JSON.stringify(l_bunkei)}
Example Sentences (Reibun): ${JSON.stringify(l_reibun)}
      `;
        }).join("\n---\n");

        const prompt = `
You are a Japanese language teacher. Based on the following lesson content, generate 10 multiple-choice questions (MCQs) to test the user's knowledge.
The questions should cover vocabulary, grammar patterns, and sentence usage from the provided lessons.

Format the output strictly as a JSON array of objects with the following schema:
[
  {
    "question": "The question text in Hiragana, Katakana or English as appropriate",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct_answer": "The correct option text (must calculate to one of the options)",
    "explanation": "Brief explanation of why the answer is correct"
  }
]

Create a mix of question types:
- Fill in the blank (particle usage, conjugation)
- Vocabulary meaning (match word to meaning or vice versa)
- Sentence construction (choose the correct sentence)

Lesson Content:
${context}
    `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    { "role": "user", "content": prompt }
                ],
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            throw new Error(`OpenRouter API Error: ${response.status}`);
        }

        const data = await response.json();
        let responseText = data.choices[0].message.content;

        // Clean up markdown formatting if present
        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/```json\n?/, "").replace(/\n?```$/, "");
        } else if (responseText.startsWith("```")) {
            responseText = responseText.replace(/```\n?/, "").replace(/\n?```$/, "");
        }

        const questions = JSON.parse(responseText);

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error generating quiz:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 },
        );
    }
}
