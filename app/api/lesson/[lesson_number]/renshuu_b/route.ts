import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { getSignedImageUrl } from "../../../../../lib/utils";

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

    const { data: rbRes, error: rbError } = await supabase
      .from("renshuu_b")
      .select("id")
      .eq("lesson_id", lessonRes.id)
      .single();

    if (rbError) {
      if (rbError.code === "PGRST116")
        return NextResponse.json([], { status: 200 });
      throw rbError;
    }

    const { data: partsData, error: partsError } = await supabase
      .from("renshuu_b_parts")
      .select("*")
      .eq("renshuu_b_id", rbRes.id)
      .order("part_number");

    if (partsError) throw partsError;

    // Process image URLs
    // Process image URLs
    const processedParts = await Promise.all(
      partsData.map(async (part) => {
        if (part.image_url) {
          part.image_url = await getSignedImageUrl(part.image_url);
        }
        return part;
      }),
    );

    return NextResponse.json(processedParts);
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching renshuu_b: ${error}` },
      { status: 500 },
    );
  }
}
