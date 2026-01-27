import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { getPublicImageUrl } from "../../../../../lib/utils";

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

    const { data: rcRes, error: rcError } = await supabase
      .from("renshuu_c")
      .select("id")
      .eq("lesson_id", lessonRes.id)
      .single();

    if (rcError) {
      if (rcError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw rcError;
    }

    const { data: partsData, error: partsError } = await supabase
      .from("renshuu_c_parts")
      .select("*")
      .eq("renshuu_c_id", rcRes.id)
      .order("part_number");

    if (partsError) throw partsError;

    // Process image URLs
    const processedParts = partsData.map((part) => {
      if (part.image_url) {
        part.image_url = getPublicImageUrl(part.image_url);
      }

      if (part.question_image_urls) {
        let urls = part.question_image_urls;
        if (typeof urls === "string") {
          try {
            urls = JSON.parse(urls);
          } catch (e) {}
        }
        if (Array.isArray(urls)) {
          part.question_image_urls = urls.map((url: string) =>
            getPublicImageUrl(url),
          );
        }
      }
      return part;
    });

    return NextResponse.json(processedParts);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching renshuu_c: ${error}` },
      { status: 500 },
    );
  }
}
