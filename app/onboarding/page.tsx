"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    japaneseLevel: "",
    takenCourse: "",
    instituteName: "",
    motivation: "",
    motivationDetails: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  const calculateProgress = () => {
    return (step / 3) * 100;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard"); // Redirect to dashboard or home after success
      } else {
        console.error("Failed to submit");
        // Handle error (optional: show toast)
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper-bg text-ink p-4 font-sans">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent-red transition-all duration-300 ease-out"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-100 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-0 opacity-50" />

          {/* Step 1: Japanese Level */}
          {step === 1 && (
            <div className="z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Rate your Japanese level (Polite version)
              </h2>
              <p className="text-gray-500 text-center mb-8 text-sm">
                1 being absolute beginner, 10 being native.
              </p>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <label
                    key={num}
                    className={cn(
                      "cursor-pointer flex items-center justify-center h-12 rounded-lg border transition-all duration-200",
                      formData.japaneseLevel === String(num)
                        ? "bg-[#d93d3d] text-white border-[#d93d3d] shadow-md transform scale-105"
                        : "bg-white border-gray-200 hover:border-[#d93d3d] hover:bg-red-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="japaneseLevel"
                      value={num}
                      checked={formData.japaneseLevel === String(num)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          japaneseLevel: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    <span className="font-semibold">{num}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Course History */}
          {step === 2 && (
            <div className="z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Have you taken a Japanese course before?
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                <label
                  className={cn(
                    "cursor-pointer flex items-center p-4 rounded-xl border transition-all duration-200",
                    formData.takenCourse === "true"
                      ? "bg-red-50 border-[#d93d3d] ring-1 ring-[#d93d3d]"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <input
                    type="radio"
                    name="takenCourse"
                    value="true"
                    checked={formData.takenCourse === "true"}
                    onChange={(e) =>
                      setFormData({ ...formData, takenCourse: e.target.value })
                    }
                    className="w-5 h-5 text-[#d93d3d] focus:ring-[#d93d3d]"
                  />
                  <span className="ml-3 font-medium">Yes, I have</span>
                </label>

                <label
                  className={cn(
                    "cursor-pointer flex items-center p-4 rounded-xl border transition-all duration-200",
                    formData.takenCourse === "false"
                      ? "bg-red-50 border-[#d93d3d] ring-1 ring-[#d93d3d]"
                      : "bg-white border-gray-200 hover:border-gray-300",
                  )}
                >
                  <input
                    type="radio"
                    name="takenCourse"
                    value="false"
                    checked={formData.takenCourse === "false"}
                    onChange={(e) =>
                      setFormData({ ...formData, takenCourse: e.target.value })
                    }
                    className="w-5 h-5 text-[#d93d3d] focus:ring-[#d93d3d]"
                  />
                  <span className="ml-3 font-medium">No, I haven&apos;t</span>
                </label>
              </div>

              {formData.takenCourse === "true" && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.instituteName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instituteName: e.target.value,
                      })
                    }
                    placeholder="e.g. Tokyo Central Japanese Language School"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d93d3d]/20 focus:border-[#d93d3d] transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Motivation */}
          {step === 3 && (
            <div className="z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-center">
                What is your motivation to learn Japanese?
              </h2>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {[
                  "Travel & Tourism",
                  "Work & Career",
                  "Anime & Manga",
                  "Culture & History",
                  "Family & Friends",
                  "Other",
                ].map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "cursor-pointer flex items-center px-4 py-3 rounded-lg border transition-all duration-200",
                      formData.motivation === option
                        ? "bg-red-50 border-[#d93d3d] ring-1 ring-[#d93d3d]"
                        : "bg-white border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="motivation"
                      value={option}
                      checked={formData.motivation === option}
                      onChange={(e) =>
                        setFormData({ ...formData, motivation: e.target.value })
                      }
                      className="w-4 h-4 text-[#d93d3d] focus:ring-[#d93d3d]"
                    />
                    <span className="ml-3 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>

              <div className="animate-in fade-in zoom-in-95 duration-300">
                <input
                  type="text"
                  value={formData.motivationDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      motivationDetails: e.target.value,
                    })
                  }
                  placeholder="Tell us more (Optional)"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d93d3d]/20 focus:border-[#d93d3d] transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 z-10">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center text-gray-500 hover:text-gray-800 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            ) : (
              <div /> /* Spacer */
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                Skip
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-[#2c2c2c] text-white px-6 py-2 rounded-lg hover:bg-black transition-colors flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#d93d3d] text-white px-8 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit"}
                  {!loading && <Check className="w-4 h-4 ml-2" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
