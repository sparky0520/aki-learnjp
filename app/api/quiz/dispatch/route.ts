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

        if (orgRole !== "org:admin") {
            return NextResponse.json(
                { error: "Forbidden: Only organization admins can dispatch quizzes" },
                { status: 403 }
            );
        }

        const { lesson_ids, questions } = await request.json();

        if (!lesson_ids || !Array.isArray(lesson_ids) || lesson_ids.length === 0) {
            return NextResponse.json(
                { error: "Invalid lesson_ids provided" },
                { status: 400 },
            );
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json(
                { error: "Invalid questions provided" },
                { status: 400 },
            );
        }

        const { error: saveError } = await supabase
            .from("org_quizzes")
            .insert({
                org_id: orgId,
                created_by: userId,
                lesson_ids,
                questions
            });

        if (saveError) throw saveError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error dispatching quiz:", error);
        return NextResponse.json(
            { error: "Failed to dispatch quiz" },
            { status: 500 },
        );
    }
}
