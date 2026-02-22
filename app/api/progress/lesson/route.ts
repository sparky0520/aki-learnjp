import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized: Missing user or organization context' }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

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
      return NextResponse.json({ error: 'Missing lesson_id' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('user_lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('lesson_id', lesson_id);

    let response;
    if (existing && existing.length > 0) {
      // Update
      response = await supabase
        .from('user_lesson_progress')
        .update(updates)
        .eq('user_id', userId)
        .eq('org_id', orgId)
        .eq('lesson_id', lesson_id)
        .select();
    } else {
      // Insert
      response = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: userId,
          org_id: orgId,
          lesson_id,
          started_at: new Date().toISOString(),
          ...updates
        })
        .select();
    }

    if (response.error) throw response.error;
    return NextResponse.json({ message: 'Progress updated', data: response.data });

  } catch (error) {
    return NextResponse.json({ error: `Error updating lesson progress: ${error}` }, { status: 500 });
  }
}
