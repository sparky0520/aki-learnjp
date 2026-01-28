import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lesson_number: string }> },
) {
  try {
    // Await params to avoid Next.js warnings/errors in newer versions
    const { lesson_number: lessonNumberStr } = await Promise.resolve(params);
    const lessonNumber = parseInt(lessonNumberStr);

    if (isNaN(lessonNumber)) {
      return NextResponse.json(
        { error: "Invalid lesson number" },
        { status: 400 },
      );
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("id, lesson_number, title")
      .eq("lesson_number", lessonNumber)
      .maybeSingle();

    if (error || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const { data: aboutData } = await supabase
      .from("about_lessons")
      .select("content")
      .eq("lesson_id", lesson.id)
      .maybeSingle();

    return NextResponse.json({
      lessonNo: lesson.lesson_number,
      lessonTopic: lesson.title,
      lessonDescription:
        aboutData?.content ||
        "This lesson explores Japanese grammar and vocabulary.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching lesson: ${error}` },
      { status: 500 },
    );
  }
}
