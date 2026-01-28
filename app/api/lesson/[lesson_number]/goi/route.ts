import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lesson_number: string }> },
) {
  try {
    const { lesson_number: lessonNumberStr } = await Promise.resolve(params);
    const lessonNumber = parseInt(lessonNumberStr);

    // Get lesson_id first
    const { data: lessonRes, error: lessonError } = await supabase
      .from("lessons")
      .select("id")
      .eq("lesson_number", lessonNumber)
      .single();

    if (lessonError || !lessonRes) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lessonId = lessonRes.id;

    const { data: goiRes, error: goiError } = await supabase
      .from("goi")
      .select("content")
      .eq("lesson_id", lessonId)
      .single();

    if (goiError) {
      // Handle case where goi data might not exist for a lesson yet
      if (goiError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw goiError;
    }

    let goiData = goiRes.content;

    // Parse JSON if string (though supabase-js usually handles JSON columns)
    if (typeof goiData === "string") {
      try {
        goiData = JSON.parse(goiData);
      } catch (e) {
        // ignore
      }
    }

    if (
      Array.isArray(goiData) &&
      goiData.length > 0 &&
      typeof goiData[0] === "object" &&
      !Array.isArray(goiData[0])
    ) {
      return NextResponse.json(goiData);
    }

    // Map list of lists to list of dicts if needed
    // Matches python logic: item[0]=read/jp, item[1]=kanji, item[2]=english

    // Wait, TypeScript will complain about push vs append. Use push.
    const finalGoi = [];
    if (Array.isArray(goiData)) {
      for (const item of goiData) {
        if (Array.isArray(item)) {
          finalGoi.push({
            jp: item.length > 0 ? item[0] : "",
            kanji: item.length > 1 ? item[1] : "",
            english: item.length > 2 ? item[2] : "",
          });
        } else {
          // Already object? Logic overhead says if it WAS object we returned earlier.
          // But let's be safe
          finalGoi.push(item);
        }
      }
    }

    return NextResponse.json(finalGoi);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching goi: ${error}` },
      { status: 500 },
    );
  }
}
