import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
     const body = await request.json();
     const { user_id, updates } = body;

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

     if (!user_id || !lesson_id) {
         return NextResponse.json({ error: 'Missing user_id or lesson_id' }, { status: 400 });
     }

     // Check existence
     const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user_id)
        .eq('lesson_id', lesson_id);

     let response;
     if (existing && existing.length > 0) {
         // Update
         response = await supabase
            .from('user_lesson_progress')
            .update(updates)
            .eq('user_id', user_id)
            .eq('lesson_id', lesson_id)
            .select();
     } else {
         // Insert
         response = await supabase
            .from('user_lesson_progress')
            .insert({
                user_id,
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
