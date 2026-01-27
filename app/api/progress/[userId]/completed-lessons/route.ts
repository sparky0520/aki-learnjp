import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const { count, error } = await supabase
      .from("user_lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching completed lessons count:", error);
      return NextResponse.json(
        { error: `Error fetching completed lessons count: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ completed_lessons: count || 0 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
