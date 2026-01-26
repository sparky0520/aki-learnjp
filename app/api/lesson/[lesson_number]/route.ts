import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { lesson_number: string } }
) {
  try {
    // Await params to avoid Next.js warnings/errors in newer versions
    const { lesson_number: lessonNumberStr } = await Promise.resolve(params);
    const lessonNumber = parseInt(lessonNumberStr);

    if (isNaN(lessonNumber)) {
        return NextResponse.json({ error: 'Invalid lesson number' }, { status: 400 });
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('lesson_number', lessonNumber)
      .single();

    if (error) {
       // If no data found, it might return error code 'PGRST116' (JSON object requested, multiple (or no) rows returned)
       if (error.code === 'PGRST116') {
           return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
       }
       throw error;
    }

    return NextResponse.json({
      lessonNo: lesson.lesson_number,
      lessonTopic: lesson.title,
      lessonDescription: "This lesson explores Japanese grammar and vocabulary.",
    });

  } catch (error) {
    return NextResponse.json({ error: `Error fetching lesson: ${error}` }, { status: 500 });
  }
}
