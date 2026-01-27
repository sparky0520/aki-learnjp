"use client";

import React, { useState } from "react";
import Link from "next/link";
import PaymentModal from "@/components/ui/PaymentModal";

type PlanDetails = {
  name: string;
  price: number;
  period: "mo" | "yr";
};

export default function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails>({
    name: "Basic",
    price: 29.99,
    period: "mo",
  });

  const openPayment = (name: string, price: number) => {
    setSelectedPlan({ name, price, period: "mo" });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />

      <div className="grow flex flex-col items-center justify-center p-8 sm:p-20 w-full relative z-10">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-ink-color mb-4">
            Plans & Pricing
          </h1>
          <p className="text-xl text-pencil-gray font-light">
            Invest in your Japanese journey
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-5xl justify-center items-stretch">
          {/* Basic Plan */}
          <div className="paper-card p-8 sm:p-10 flex-1 relative flex flex-col min-h-125">
            {/* Paper holes decoration */}
            <div className="absolute top-0 left-4 w-full h-8 flex gap-4 -mt-4 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-black/10"></div>
              ))}
            </div>

            <div className="hanko-stamp absolute -top-4 -right-4 rotate-12 bg-white/80">
              Free
              <br />
              Beta
            </div>

            <h2 className="text-3xl font-bold text-ink-color mb-2">Basic</h2>
            <div className="text-sm text-pencil-gray mb-6 h-6">
              Everything you need to start
            </div>

            <div className="mb-8 relative">
              <span className="text-4xl sm:text-5xl font-bold text-ink-color">
                $29.99
              </span>
              <span className="text-lg text-pencil-gray">/mo</span>
              {/* Sale strikethrough for "Free for testing" visual effect slightly visible or implied by badge */}
            </div>

            <div className="grow">
              <ul className="space-y-4 text-left text-pencil-gray leading-relaxed text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">あ</span>
                  Access to curated reading, listening, speaking and writing
                  exercises.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">い</span>
                  5,000 Aki credits for Aki realtime voice assistant and dynamic
                  web page generation.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => openPayment("Basic", 29.99)}
                className="w-full relative group focus:outline-none cursor-pointer"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                <span className="relative block border-2 border-black px-8 py-3 text-lg font-bold uppercase tracking-widest text-black bg-paper-bg">
                  Start Free
                </span>
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="paper-card p-8 sm:p-10 flex-1 relative flex flex-col min-h-125">
            {/* Paper holes decoration */}
            <div className="absolute top-0 left-4 w-full h-8 flex gap-4 -mt-4 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-black/10"></div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-ink-color mb-2">Pro</h2>
            <div className="text-sm text-pencil-gray mb-6 h-6">
              For serious learners
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-bold text-ink-color">
                  $39.99
                </span>
                <span className="text-xl text-pencil-gray">/mo</span>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-pencil-gray">
                  <span className="font-bold text-ink-color">$431.89</span> /
                  year
                </p>
                <p className="text-xs font-bold text-accent-red tracking-wide uppercase">
                  10% OFF YEARLY
                </p>
              </div>
            </div>

            <div className="grow">
              <ul className="space-y-4 text-left text-pencil-gray leading-relaxed text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">⚡</span>
                  All features in Basic
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">う</span>
                  $2/1000 Aki credits extension if you run out.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => openPayment("Pro", 39.99)}
                className="block w-full relative group focus:outline-none cursor-pointer"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                <span className="relative block border-2 border-black px-8 py-3 text-lg font-bold uppercase tracking-widest text-black bg-white text-center">
                  Go
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-pencil-gray hover:text-ink-color underline decoration-wavy underline-offset-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
