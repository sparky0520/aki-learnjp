export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="grow flex flex-col items-center justify-start p-8 sm:p-20 w-full">
        <main className="flex flex-col gap-12 items-center max-w-4xl z-10 w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-ink-color mb-4">Privacy Policy</h1>
            <p className="text-xl text-pencil-gray">How we protect your data.</p>
          </div>

          {/* Main Card */}
          <div className="paper-card p-8 sm:p-12 w-full max-w-3xl bg-white relative">
            {/* Paper holes decoration */}
            <div className="absolute top-0 left-4 w-full h-8 flex gap-4 -mt-4 opacity-30">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-black/10"></div>
              ))}
            </div>

            <div className="space-y-6 text-pencil-gray leading-relaxed text-lg">
              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Data Collection</h2>
                <p>
                  When you use Aki, we collect information necessary to provide our language learning services. 
                  This includes your email address for account management and your progress data (lessons completed, 
                  quiz scores, and voice interactions) to personalize your learning path.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">AI & Voice Data</h2>
                <p>
                  Our service uses AI technologies, including voice processing, to facilitate conversation practice. 
                  Voice data is processed to generate feedback and responses but is not permanently stored for 
                  other purposes without your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Data Usage</h2>
                <p>
                  We do not sell your personal data to third parties. Your information is used solely to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Provide and improve the Aki learning platform.</li>
                  <li>Track your curriculum progress.</li>
                  <li>Communicate important service updates.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data. 
                  However, no method of transmission over the internet is 100% secure.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
