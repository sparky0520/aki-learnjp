"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("Bug");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, details }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setDetails("");
        setType("Bug");
      }, 2000);
    } catch (error) {
      console.error("Feedback submission error:", error);
      setStatus("error");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 mt-2 text-gray-600 hover:text-gray-900 transition-colors rounded hover:bg-gray-100 w-full"
      >
        <MessageSquare size={20} />
        <span className="font-medium">Feedback</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Send Feedback</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <div className="p-8 text-center text-green-600 font-medium">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Content Issue">Content Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your feedback..."
              />
            </div>

            {status === "error" && (
              <div className="text-red-500 text-sm text-center">
                Something went wrong. Please try again.
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
                disabled={status === "submitting"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
