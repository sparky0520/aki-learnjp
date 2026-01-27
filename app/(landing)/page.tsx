/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/app");
  }
  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      <div className="grow flex flex-col items-center justify-center p-8 sm:p-20 w-full">
        <main className="flex flex-col gap-12 items-center text-center max-w-4xl z-10">
          {/* Header Section */}
          <div className="relative flex flex-col items-center">
            {/* Aki logo */}
            <img src="/aki_logo.png" alt="Aki" className="w-32 sm:w-48 mb-4" />
            <p className="text-2xl sm:text-3xl text-pencil-gray font-light">
              Japanese Learning
            </p>

            {/* Decorative Hanko Stamp */}
            <div className="absolute -top-6 -right-12 hanko-stamp hidden sm:flex">
              合格
              <br />
              Pass
            </div>
          </div>

          {/* Main Card */}
          <div className="paper-card p-8 sm:p-12 max-w-2xl bg-white relative">
            {/* Paper holes decoration */}
            <div className="absolute top-0 left-4 w-full h-8 flex gap-4 -mt-4 opacity-30">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-black/10"></div>
              ))}
            </div>

            <p className="text-xl sm:text-2xl leading-relaxed mb-8 text-left ">
              &quot;A journey of a thousand miles begins with a single
              step.&quot;
              <br />
              <span className="text-sm block mt-2 text-right text-gray-400 font-sans">
                - Lao Tzu
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              <Link
                href="/app" /* Changed to dashboard for App entry */
                className="group relative inline-block focus:outline-none focus:ring"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black bg-white">
                  Start Learning
                </span>
              </Link>

              <Link
                href="/pricing"
                className="group relative inline-block focus:outline-none focus:ring"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black bg-paper-bg">
                  Premium Access
                </span>
              </Link>
            </div>
          </div>

          {/* Footer / Decorative Text */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-8 text-center text-sm text-pencil-gray opacity-80 font-sans">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">書く</span>
              <span>Write</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">読む</span>
              <span>Read</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">話す</span>
              <span>Speak</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">聞く</span>
              <span>Listen</span>
            </div>
          </div>
          {/* Background decoration elements */}
          <div className="absolute top-20 left-10 opacity-10 rotate-12 text-9xl pointer-events-none select-none text-gray-600">
            あ
          </div>
          <div className="absolute bottom-20 right-10 opacity-10 -rotate-12 text-9xl pointer-events-none select-none text-gray-600">
            ん
          </div>

          {/* Info Sections */}
          <div className="w-full max-w-5xl mt-32 space-y-32 text-left">
            {/* Section 1: Old School Method */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Old School Pen & Pencil</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  It removes the fluff and goes the old school pen and pencil
                  method encouraging writing down things in your notebook at
                  every step.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group">
                  <span className="text-pencil-gray font-handwriting transform group-hover:scale-110 transition-transform">
                    <img
                      alt="App screenshot"
                      src="/app_screenshot.png"
                      className="w-full h-full aspect-video"
                    />
                  </span>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Section 2: Aki Chatbot */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Meet Aki: Your AI Partner</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  The GPT-Realtime voice chatbot (&quot;Aki&quot;) provides a
                  human conversation partner for listening and speaking
                  practice, always there to clear your doubts.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group">
                  <span className="text-pencil-gray font-handwriting transform group-hover:scale-110 transition-transform">
                    <img
                      alt="Voice chat screenshot"
                      src="/voicechat_aki.png"
                      className="w-full h-full aspect-video"
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Analogies & Webpage Gen */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Deep Understanding</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  You can ask Aki for analogies in your mother tongue or even
                  generate a webpage for a quick detour, aiding ground-level
                  understanding of the Japanese language.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group">
                  <span className="text-pencil-gray font-handwriting transform group-hover:scale-110 transition-transform">
                    <img
                      alt="Webpage generation screenshot"
                      src="/generated_webpage.png"
                      className="w-full h-full aspect-video"
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Curriculum */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Structured Curriculum</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  The curriculum has a strong emphasis on all aspects of the
                  language with detailed assets and a JLPT aligned (not
                  strictly) curriculum so you always walk out with skills to
                  show.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group">
                  <span className="text-pencil-gray font-handwriting transform group-hover:scale-110 transition-transform">
                    <img
                      alt="Curriculum view"
                      src="/curriculum_view.png"
                      className="w-full h-full aspect-video"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
