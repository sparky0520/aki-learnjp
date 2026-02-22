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
      const { updates } = body;

      // Resolve course_id
      let course_id = body.course_id;
      if (!course_id && body.course_number) {
         const { data: courseRes } = await supabase.from('courses').select('id').eq('course_number', body.course_number).single();
         if (courseRes) course_id = courseRes.id;
      }

      // Resolve lesson_id
      let lesson_id = body.lesson_id;
      if (!lesson_id && body.lesson_number) {
         // Need course_id to strictly find lesson if needed, or just finding by number is enough if unique across system? 
         // Original code used course_id to filter lesson.
         const query = supabase.from('lessons').select('id').eq('lesson_number', body.lesson_number);
         if (course_id) query.eq('course_id', course_id);
         const { data: lessonRes } = await query.single();
         if (lessonRes) lesson_id = lessonRes.id;
      }

      if (!course_id || !lesson_id) {
         return NextResponse.json({ error: 'Missing identifiers' }, { status: 400 });
      }

      const { data: existing } = await supabase
         .from('user_course_progress')
         .select('id')
         .eq('user_id', userId)
         .eq('org_id', orgId)
         .eq('course_id', course_id)
         .eq('lesson_id', lesson_id);

      let response;
      if (existing && existing.length > 0) {
         response = await supabase
            .from('user_course_progress')
            .update(updates)
            .eq('user_id', userId)
            .eq('org_id', orgId)
            .eq('course_id', course_id)
            .eq('lesson_id', lesson_id)
            .select();
      } else {
         response = await supabase
            .from('user_course_progress')
            .insert({
               user_id: userId,
               org_id: orgId,
               course_id,
               lesson_id,
               started_at: new Date().toISOString(),
               ...updates
            })
            .select();
      }

      if (response.error) throw response.error;
      return NextResponse.json({ message: 'Course progress updated', data: response.data });

   } catch (error) {
      return NextResponse.json({ error: `Error updating course progress: ${error}` }, { status: 500 });
   }
}
