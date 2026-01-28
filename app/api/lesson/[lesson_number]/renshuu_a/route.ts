import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lesson_number: string }> },
) {
  try {
    const { lesson_number: lessonNumberStr } = await Promise.resolve(params);
    const lessonNumber = parseInt(lessonNumberStr);

    const { data: lessonRes, error: lessonError } = await supabase
      .from("lessons")
      .select("id")
      .eq("lesson_number", lessonNumber)
      .single();

    if (lessonError || !lessonRes) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const { data: response, error: raError } = await supabase
      .from("renshuu_a")
      .select("exercises")
      .eq("lesson_id", lessonRes.id)
      .single();

    if (raError) {
      if (raError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw raError;
    }

    let exercises = response.exercises;
    if (typeof exercises === "string") {
      try {
        exercises = JSON.parse(exercises);
      } catch (e) {}
    }

    return NextResponse.json(exercises);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching renshuu_a: ${error}` },
      { status: 500 },
    );
  }
}
