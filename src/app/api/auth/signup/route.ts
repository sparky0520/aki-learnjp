import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const user_data = await request.json();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', user_data.email);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'User already exists', user: existing[0] });
    }

    // Create new user
    const newUser = {
      email: user_data.email,
      name: user_data.name,
      profile_image_url: user_data.profile_image_url,
    };

    const { data: response, error } = await supabase
      .from('users')
      .insert(newUser)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'User created successfully', user: response[0] });

  } catch (error) {
    return NextResponse.json({ error: `Error creating user: ${error}` }, { status: 500 });
  }
}
