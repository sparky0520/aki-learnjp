export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="grow flex flex-col items-center justify-start p-8 sm:p-20 w-full">
        <main className="flex flex-col gap-12 items-center max-w-4xl z-10 w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-ink-color mb-4">Terms of Service</h1>
            <p className="text-xl text-pencil-gray">Please read these terms carefully.</p>
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
                <h2 className="text-2xl font-bold text-ink-color mb-3">Acceptance of Terms</h2>
                <p>
                  By accessing or using Aki, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of the terms, you may not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Educational Content</h2>
                <p>
                  Aki is an educational tool designed to assist with learning Japanese. 
                  While we strive for accuracy, we cannot guarantee that the content is free from errors. 
                  Especially regarding AI-generated interactions, users should use their judgment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">User Conduct</h2>
                <p>
                  You agree to use the service only for lawful purposes. 
                  Harassment or misuse of the AI conversational partner is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Dispute Resolution</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. 
                  All disputes arising out of or in connection with these Terms shall be subject to the 
                  exclusive jurisdiction of the courts of <strong>Delhi, India</strong>.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
