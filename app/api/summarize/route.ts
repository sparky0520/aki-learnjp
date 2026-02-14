import { NextResponse } from "next/server";
import { summarizeSession } from "@/lib/summarize_session";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!
        );

        const { transcript } = await req.json();
        if (!transcript) {
            return new NextResponse("Missing transcript", { status: 400 });
        }

        const summary = await summarizeSession(transcript);

        if (summary) {
            const { error } = await supabase
                .from("user_context")
                .upsert({
                    user_id: userId,
                    last_session_summary: summary,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
        }

        return NextResponse.json({ summary });
    } catch (err: any) {
        console.error("Summarization error:", err);
        return new NextResponse(err.message, { status: 500 });
    }
}
