import React, { useState } from "react";
import { Smartphone, Lock } from "lucide-react";

interface RazorpayCheckoutProps {
  amount: number; // in USD (will be converted/labelled as INR approx)
  planName: string;
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckout({
  amount,
  planName,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay Script
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order
      // For demo, we are converting USD to INR roughly x85
      const inrAmount = Math.round(amount * 85);

      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: inrAmount, currency: "INR" }),
      });

      const orderData = await response.json();

      if (orderData.error) throw new Error(orderData.error);
      if (!orderData.id) throw new Error("Server returned invalid order");

      // 2. Open Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_PLACEHOLDER",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Aki App",
        description: `Subscription to ${planName} Plan`,
        // image: "/logo.png", // Add logo if available
        order_id: orderData.id,
        handler: function (response: any) {
          alert(
            `Payment Successful! Payment ID: ${response.razorpay_payment_id}`,
          );
          // Verify payment on server here
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Aki Corporate Office",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      setError("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#fffce8] p-6 rounded-xl border-2 border-black w-full mb-6 relative">
        <div className="absolute top-2 right-2 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded">
          UPI / Cards
        </div>

        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Pay via Razorpay
        </h3>
        <p className="text-sm text-pencil-gray mb-6">
          Securely pay using UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or
          Netbanking.
        </p>

        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ₹{Math.round(amount * 85)}
            </>
          )}
        </button>
      </div>

      <div className="flex justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
        {/* Simple Visual Placeholders */}
        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px]">
          UPI
        </div>
        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px]">
          VISA
        </div>
        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px]">
          RuPay
        </div>
        <span className="text-xs self-center">Trusted by Razorpay</span>
      </div>
    </div>
  );
}
