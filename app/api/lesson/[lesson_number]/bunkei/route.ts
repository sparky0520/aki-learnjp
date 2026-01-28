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

    const lessonId = lessonRes.id;

    const { data: response, error: bunkeiError } = await supabase
      .from("bunkei")
      .select("patterns")
      .eq("lesson_id", lessonId)
      .single();

    if (bunkeiError) {
      if (bunkeiError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw bunkeiError;
    }

    let val = response.patterns;
    if (typeof val === "string") {
      try {
        val = JSON.parse(val);
      } catch (e) {}
    }

    return NextResponse.json(val);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching bunkei: ${error}` },
      { status: 500 },
    );
  }
}
