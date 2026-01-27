import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { getPublicImageUrl, getPublicAudioUrl } from "../../../../../lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { lesson_number: string } },
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

    const { data: mRes, error: mError } = await supabase
      .from("mondai")
      .select("id")
      .eq("lesson_id", lessonRes.id)
      .single();

    if (mError) {
      if (mError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw mError;
    }

    const { data: partsData, error: partsError } = await supabase
      .from("mondai_parts")
      .select("*")
      .eq("mondai_id", mRes.id)
      .order("part_number");

    if (partsError) throw partsError;

    // Helper to process recursive items/URLs
    const lessonPrefix = `lesson${lessonNumber}/`;

    const processItem = (item) => {
      if (typeof item === "string" && item.startsWith(lessonPrefix)) {
        return getPublicImageUrl(item);
      }
      return item;
    };

    const processStructure = (data) => {
      if (Array.isArray(data)) {
        return data.map(processStructure);
      } else if (typeof data === "object" && data !== null) {
        const newData = {};
        for (const key in data) {
          newData[key] = processStructure(data[key]);
        }
        return newData;
      } else {
        return processItem(data);
      }
    };

    const processedParts = partsData.map((part) => {
      // Parse JSON fields
      for (const field of ["rei", "questions", "correct_answers"]) {
        if (part[field] && typeof part[field] === "string") {
          try {
            part[field] = JSON.parse(part[field]);
          } catch (e) {}
        }
      }

      // Audio URL
      if (part.audio_url) {
        part.audio_url = getPublicAudioUrl(part.audio_url);
      }

      // Recursively process images in structures
      if (part.rei) part.rei = processStructure(part.rei);
      if (part.questions) part.questions = processStructure(part.questions);
      if (part.correct_answers)
        part.correct_answers = processStructure(part.correct_answers);

      return part;
    });

    return NextResponse.json(processedParts);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching mondai: ${error}` },
      { status: 500 },
    );
  }
}
