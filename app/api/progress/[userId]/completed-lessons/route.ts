import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId: authedUserId, orgId } = await auth();
    const { userId: targetUserId } = await params;

    // Security check: Only allow users to view their own progress, or check for admin role
    if (!authedUserId || !orgId || authedUserId !== targetUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count, error } = await supabase
      .from("user_lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", targetUserId)
      .eq("org_id", orgId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching completed lessons count:", error);
      return NextResponse.json(
        { error: `Error fetching completed lessons count: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ completed_lessons: count || 0 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
