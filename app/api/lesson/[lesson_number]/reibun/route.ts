import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

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

    const { data: response, error: reibunError } = await supabase
        .from('reibun')
        .select('sentences')
        .eq('lesson_id', lessonRes.id)
        .single();

    if (reibunError) {
        if (reibunError.code === 'PGRST116') return NextResponse.json([], { status: 200 });
        throw reibunError;
    }

    let val = response.sentences;
    if (typeof val === 'string') {
        try { val = JSON.parse(val); } catch(e) {}
    }

    return NextResponse.json(val);

  } catch (error) {
    return NextResponse.json({ error: `Error fetching reibun: ${error}` }, { status: 500 });
  }
}
