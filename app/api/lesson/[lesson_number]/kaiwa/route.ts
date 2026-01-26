import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { getPublicImageUrl, getPublicAudioUrl } from '../../../../../lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { lesson_number: string } }
) {
  try {
    const { lesson_number: lessonNumberStr } = await Promise.resolve(params);
    const lessonNumber = parseInt(lessonNumberStr);

    const { data: lessonRes, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('lesson_number', lessonNumber)
      .single();

    if (lessonError || !lessonRes) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const { data: kaiwa, error: kaiwaError } = await supabase
        .from('kaiwa')
        .select('*')
        .eq('lesson_id', lessonRes.id)
        .single();
    
    if (kaiwaError) throw kaiwaError;

    return NextResponse.json({
        img: getPublicImageUrl(kaiwa.image_url),
        heading: kaiwa.heading,
        text: kaiwa.dialogue,
        audio: getPublicAudioUrl(kaiwa.audio_url),
    });

  } catch (error) {
    return NextResponse.json({ error: `Error fetching kaiwa: ${error}` }, { status: 500 });
  }
}
