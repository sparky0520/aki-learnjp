import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseNumber: string; userId: string }> },
) {
  try {
    const { courseNumber, userId } = await params;

    // 1. Get course_id from course_number
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("course_number", parseInt(courseNumber))
      .maybeSingle();

    if (courseError || !courseData) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseId = courseData.id;

    // 2. Fetch all lessons for the course
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id, lesson_number, title, topics")
      .eq("course_id", courseId)
      .order("lesson_number", { ascending: true });

    if (lessonsError) {
      console.error("Error fetching lessons:", lessonsError);
      return NextResponse.json(
        { error: "Failed to fetch lessons" },
        { status: 500 },
      );
    }

    // 3. Fetch user progress
    const { data: userProgress, error: progressError } = await supabase
      .from("user_lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error fetching user progress:", progressError);
      return NextResponse.json(
        { error: "Failed to fetch user progress" },
        { status: 500 },
      );
    }

    // 4. Merge data
    const progressMap = new Map();
    if (userProgress) {
      userProgress.forEach((p) => {
        progressMap.set(p.lesson_id, p);
      });
    }

    const lessons_with_status = lessons.map((lesson) => {
      const progress = progressMap.get(lesson.id);
      let status = "View"; // Default in FastAPI was "View" if no progress

      if (progress) {
        status = progress.completed ? "Completed" : "Continue";
      }

      return {
        lessonNo: String(lesson.lesson_number),
        status: status,
        metaData: lesson.topics || [],
        title: lesson.title,
      };
    });

    return NextResponse.json(lessons_with_status);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
