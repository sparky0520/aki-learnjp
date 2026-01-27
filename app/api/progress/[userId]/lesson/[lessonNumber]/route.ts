import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string; lessonNumber: string }> },
) {
  try {
    const { userId, lessonNumber } = await params;

    // 1. Resolve lesson_id
    const { data: lessonData, error: lessonError } = await supabase
      .from("lessons")
      .select("id")
      .eq("lesson_number", parseInt(lessonNumber))
      .maybeSingle();

    if (lessonError || !lessonData) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lessonId = lessonData.id;

    // 2. Fetch progress
    const { data: progress, error: progressError } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (progressError) {
      console.error("Error fetching lesson progress:", progressError);
      return NextResponse.json(
        { error: `Error fetching progress: ${progressError.message}` },
        { status: 500 },
      );
    }

    if (!progress) {
      // Return empty progress structure matching FastAPI
      return NextResponse.json({
        renshuu_b_completed: false,
        renshuu_c_completed: false,
        mondai_completed: false,
        kaiwa_completed: false,
        completed: false,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
