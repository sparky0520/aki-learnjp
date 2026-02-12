"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PlanCard from "@/components/pricing/PlanCard";

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleProClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/plans");
    } else {
      router.push("/plans");
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
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
          <PlanCard
            name="Basic"
            price={0}
            period="mo"
            description="Everything you need to start"
            isPopular={true}
            originalPrice={29.99}
            features={[
              <span key="1">
                <span className="text-xl mt-0.5">あ</span> Access to curated
                reading, listening, speaking and writing exercises.
              </span>,
              <span key="2">
                <span className="text-xl mt-0.5">い</span> 5,000 Aki credits for
                Aki realtime voice assistant and dynamic web page generation.
              </span>,
            ]}
            buttonText="Start free"
            onButtonClick={() => (window.location.href = "/dashboard")}
          />

          {/* Pro Plan */}
          <PlanCard
            name="Pro"
            price={39.99}
            period="mo"
            description="For serious learners"
            yearlyPrice={431.89}
            promoText="10% OFF YEARLY"
            features={[
              <span key="1">
                <span className="text-gray-400">⚡</span> All features in Basic
              </span>,
              <span key="2">
                <span className="text-xl mt-0.5">う</span> $2/1000 Aki credits
                extension if you run out.
              </span>,
            ]}
            buttonText="Go Pro"
            onButtonClick={handleProClick}
          />
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

