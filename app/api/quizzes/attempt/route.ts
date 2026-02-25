import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { userId, orgId } = await auth();
        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { quiz_id, score, total_questions, results } = await request.json();

        if (!quiz_id || score === undefined || !total_questions || !results) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save the attempt
        const { data, error } = await supabase
            .from("org_quiz_attempts")
            .insert({
                quiz_id,
                user_id: userId,
                org_id: orgId,
                score,
                total_questions,
                results
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: "Attempt saved successfully", data });
    } catch (error) {
        console.error("Error saving quiz attempt:", error);
        return NextResponse.json(
            { error: "Failed to save attempt" },
            { status: 500 }
        );
    }
}
