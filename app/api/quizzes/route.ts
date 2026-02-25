import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId, orgId } = await auth();
        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch quizzes for this org
        const { data: quizzes, error } = await supabase
            .from("org_quizzes")
            .select(`
                id,
                created_at,
                lesson_ids,
                questions
            `)
            .eq("org_id", orgId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch scores for the current user for these quizzes
        const { data: attempts, error: attemptsError } = await supabase
            .from("org_quiz_attempts")
            .select("quiz_id, score, total_questions, attempted_at")
            .eq("user_id", userId)
            .eq("org_id", orgId)
            .order("attempted_at", { ascending: false });

        if (attemptsError) throw attemptsError;

        // Combine quiz data with attempt status
        const quizzesWithResults = quizzes.map(quiz => {
            const quizAttempts = attempts.filter(a => a.quiz_id === quiz.id);
            return {
                ...quiz,
                attempted: quizAttempts.length > 0,
                attempts: quizAttempts
            };
        });

        return NextResponse.json(quizzesWithResults);
    } catch (error) {
        console.error("Error fetching org quizzes:", error);
        return NextResponse.json(
            { error: "Failed to fetch quizzes" },
            { status: 500 }
        );
    }
}
