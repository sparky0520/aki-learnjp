export default function Policy() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="grow flex flex-col items-center justify-start p-8 sm:p-20 w-full">
        <main className="flex flex-col gap-12 items-center max-w-4xl z-10 w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-ink-color mb-4">Refund Policy</h1>
            <p className="text-xl text-pencil-gray">Your satisfaction matters to us.</p>
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
                <h2 className="text-2xl font-bold text-ink-color mb-3">Overview</h2>
                <p>
                  At Aki, we are committed to providing a high-quality learning experience. 
                  However, we understand that our method might not be the right fit for everyone.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">Refund Eligibility</h2>
                <p>
                  We offer a refund (partial, depends on Aki credits spent) window to ensure you have enough time to evaluate the course. 
                  You are eligible for a refund if both of the following conditions are met:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Your request is made within <strong>14 days</strong> of the original purchase date.</li>
                  <li>You have completed less than <strong>25%</strong> of the course lessons.</li>
                </ul>
                <p className="mt-4">
                  The refund window automatically closes if either 14 days have passed or if you have reached the 25% completion mark, whichever comes first.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-ink-color mb-3">How to Request</h2>
                <p>
                  To request a refund, please contact our support team with your order details. 
                  We will process eligible requests promptly.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
