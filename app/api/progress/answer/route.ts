import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    // Resolve lesson_id
    let lesson_id = body.lesson_id;
    if (!lesson_id && body.lesson_number) {
      const { data: lessonRes } = await supabase
        .from('lessons')
        .select('id')
        .eq('lesson_number', body.lesson_number)
        .single();
      if (lessonRes) lesson_id = lessonRes.id;
    }

    if (!lesson_id) {
      return NextResponse.json({ error: 'Missing lesson_id or lesson_number' }, { status: 400 });
    }

    if (!body.section_type || body.answer === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const answerData = {
      user_id: userId,
      org_id: orgId,
      lesson_id: lesson_id,
      section_type: body.section_type,
      answer: body.answer,
      answered_at: new Date().toISOString(),
      part_id: body.part_id,
      question_index: body.question_index,
      is_correct: body.is_correct
    };

    const { data, error } = await supabase
      .from('user_exercise_progress')
      .insert(answerData)
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Answer recorded', data });

  } catch (error) {
    return NextResponse.json({ error: `Error recording answer: ${error}` }, { status: 500 });
  }
}
