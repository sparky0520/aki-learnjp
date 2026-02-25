import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId, orgId, orgRole } = await auth();

        if (!userId || !orgId || orgRole !== "org:admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        // 1. Fetch all attempts for this organization
        const { data: attempts, error: attemptsError } = await supabase
            .from("org_quiz_attempts")
            .select(`
                id,
                quiz_id,
                user_id,
                score,
                total_questions,
                attempted_at,
                org_quizzes (
                    lesson_ids,
                    created_at
                )
            `)
            .eq("org_id", orgId)
            .order("attempted_at", { ascending: false });

        if (attemptsError) throw attemptsError;

        // 1.5 Fetch all lessons to map IDs to numbers
        const { data: lessons, error: lessonsError } = await supabase
            .from("lessons")
            .select("id, lesson_number");

        if (lessonsError) throw lessonsError;

        const lessonMap = new Map();
        lessons.forEach(l => lessonMap.set(l.id, l.lesson_number));

        // 2. Fetch all members...
        const client = await clerkClient();
        const membersResponse = await client.organizations.getOrganizationMembershipList({
            organizationId: orgId,
            limit: 500,
        });

        const memberMap = new Map();
        membersResponse.data.forEach((membership) => {
            const user = membership.publicUserData;
            memberMap.set(membership.publicUserData?.userId, {
                name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.identifier || "Unknown User",
                imageUrl: user?.imageUrl
            });
        });

        // 3. Combine attempt data with member names and lesson numbers
        const enrichedAttempts = attempts.map(attempt => {
            const member = memberMap.get(attempt.user_id);
            const lessonNumbers = (attempt.org_quizzes as any)?.lesson_ids?.map((id: string) => lessonMap.get(id)) || [];

            return {
                ...attempt,
                student_name: member?.name || "Unknown Student",
                student_image: member?.imageUrl,
                lesson_numbers: lessonNumbers.filter((n: any) => n !== undefined)
            };
        });

        return NextResponse.json(enrichedAttempts);
    } catch (error) {
        console.error("Error fetching admin quiz attempts:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz analysis data" },
            { status: 500 }
        );
    }
}
