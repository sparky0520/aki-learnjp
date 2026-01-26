import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });

    const totalLessons = count || 12;

    return NextResponse.json({
        totalLessons: totalLessons,
        newsInsights: [
            {
                link: "https://en.jff.jpf.go.jp/",
                description: "Japan Film Festival starting from 31st October 2025 to 3rd February",
                media: {
                    type: "image",
                    link: "/insight1.png",
                },
            },
            {
                link: "https://www.youtube-nocookie.com/embed/Y_1VVBEC96I?si=2SBwrbntlTVipTSG",
                description: "Learn about days of the week in Japanese in a fun mnemonic",
                media: {
                    type: "youtube",
                    link: "https://www.youtube-nocookie.com/embed/Y_1VVBEC96I?si=2SBwrbntlTVipTSG",
                },
            },
            {
                link: "https://www.youtube-nocookie.com/embed/-D0sd7rzpLA?si=Nt3OD3qCOk4n3zZA",
                description: "Immerse yourself in Cherry Blossoms with this informative guide",
                media: {
                    type: "youtube",
                    link: "https://www.youtube-nocookie.com/embed/-D0sd7rzpLA?si=Nt3OD3qCOk4n3zZA",
                },
            },
            {
                link: "https://app.kanjialive.com",
                description: "Learn the correct way to write kanji and it's meaning using KanjiAlive",
                media: {
                    type: "image",
                    link: "/kanji_alive.png",
                },
            },
        ],
    });
  } catch (error) {
      return NextResponse.json({ error: `Error fetching home data: ${error}` }, { status: 500 });
  }
}
