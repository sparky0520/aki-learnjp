import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseNumber: string; userId: string }> },
) {
  try {
    const { courseNumber, userId } = await params;

    // 1. Fetch all lessons
    // We assume 'lessons' table exists.
    // We'll select * to get all fields.
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .order("lesson_number", { ascending: true });

    if (lessonsError) {
      console.error("Error fetching lessons:", lessonsError);
      return NextResponse.json(
        { error: "Failed to fetch lessons" },
        { status: 500 },
      );
    }

    // 2. Fetch user progress
    const { data: userProgress, error: progressError } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error fetching user progress:", progressError);
      // We could continue without progress info, but better to alert
      return NextResponse.json(
        { error: "Failed to fetch user progress" },
        { status: 500 },
      );
    }

    // 3. Merge data
    const progressMap = new Map();
    if (userProgress) {
      userProgress.forEach((p) => {
        progressMap.set(p.lesson_id, p);
      });
    }

    // Determine status for each lesson
    const formattedLessons = lessons.map((lesson) => {
      const progress = progressMap.get(lesson.id);
      let status = "Start";

      if (progress) {
        if (progress.completed) {
          status = "Completed";
        } else {
          status = "Continue";
        }
      }

      // If previous lesson is completed, this one might be "Start" (default)
      // Logic for "Continue" usually means "Started but not finished".
      // But we just use what's in DB.

      // Map 'topics' or 'meta_data' to 'metaData'
      // Assuming 'topics' is the column name for metadata based on common usage
      // If it fails, we default to empty array or check other fields
      const metaData = lesson.topics || lesson.meta_data || [];

      return {
        lessonNo: lesson.lesson_number,
        status: status,
        metaData: Array.isArray(metaData) ? metaData : [metaData], // Ensure array
        // Include other fields if needed
        id: lesson.id,
      };
    });

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
