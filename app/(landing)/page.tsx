/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default async function Home() {
  const { userId } = await auth();
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
              {userId ? (
                <Link
                  href="/dashboard"
                  className="group relative inline-block focus:outline-none focus:ring"
                >
                  <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                  <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black bg-white">
                    Dashboard
                  </span>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="group relative inline-block focus:outline-none focus:ring"
                >
                  <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                  <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black bg-white">
                    Sign In
                  </span>
                </Link>
              )}

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
            {/* Section 1: Learn the basics */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Learn Japanese Kana</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Complete beginner? Start with Hiragana and Katakana. Aki will
                  guide you through the basics. Learn to read and write Japanese
                  with ease.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/basics.png"
                  alt="App screenshot"
                />
              </div>
            </div>

            {/* Section 2: Aki Chatbot */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Meet Aki: Your AI Partner</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Your companion to practice speaking and listening Japanese.
                  The Voice Chatbot (&quot;Aki&quot;) provides a natural
                  conversation partner, always there to clear your doubts.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/ai.png"
                  alt="Voice chat screenshot"
                />
              </div>
            </div>

            {/* Section 3: Explanation & Analogies */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Deep Understanding</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Stuck somewhere? Ask Aki to get full explanations or fun analogies in your mother tongue.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/deep_understanding.png"
                  alt="Webpage generation screenshot"
                />
              </div>
            </div>

            {/* Section 4: Feedback and iterate */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Improvise</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Got something wrong? Get instant feedback and improve.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/improvise.png"
                  alt="Curriculum view"
                />
              </div>
            </div>
          </div>

          {/* For Teachers Section */}
          <div className="w-full max-w-5xl mt-32 space-y-32 text-left">
            <div>
              <h2 className="subheading-title text-center mb-4">先生ですか。</h2>
              <p className="text-xl leading-relaxed text-pencil-gray text-center max-w-2xl mx-auto mb-16">
                Aki can help you create engaging lessons and manage your students with ease.
              </p>
            </div>

            {/* Teacher Section 1: Quizzes */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Create & Quiz</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Generate quizzes from your customized lessons and dispatch them to your entire class with one click.
                  Tailor the learning experience to your students&apos; needs.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/generate.png"
                  alt="Webpage generation screenshot"
                />
              </div>
            </div>

            {/* Teacher Section 2: Student Management */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Manage Your Class</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Keep track of your classes, enroll students, and manage their learning pace effortlessly.
                  A centralized hub for all your teaching needs.
                </p>
              </div>
              <div className="flex-1 w-full">
                <ZoomableImage
                  src="/manage.png"
                  alt="Webpage generation screenshot"
                />
              </div>
            </div>

            {/* Teacher Section 3: Performance Tracking */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="subheading-title">Monitor Progress</h2>
                <p className="text-lg leading-relaxed text-pencil-gray">
                  Get detailed insights into student performance. View score history and
                  identify areas where your class needs more focus through Aki&apos;s intelligent analysis.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group">
                  <div className="text-pencil-gray font-handwriting text-center p-8 opacity-40 italic">
                    [Student Scores History Placeholder]
                    <br />
                    (Analytics & Performance Tables)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div >
    </div >
  );
}
