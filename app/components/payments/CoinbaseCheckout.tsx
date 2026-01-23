import React, { useState } from "react";
import { Bitcoin, ExternalLink, ArrowRight } from "lucide-react";

interface CoinbaseCheckoutProps {
  amount: number;
  planName: string;
}

export default function CoinbaseCheckout({ amount, planName }: CoinbaseCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coinbase/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "USD",
          name: `Aki ${planName} Plan`,
          description: `Subscription to Aki ${planName}`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.hosted_url) {
        // Redirect to Coinbase Hosted Checkout
        window.location.href = data.hosted_url;
      }
    } catch (err: any) {
      console.error("Coinbase Checkout Error:", err);
      setError("Failed to initialize crypto payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full bg-black text-white p-6 rounded-xl flex flex-col items-center text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#f7931a] via-[#627eea] to-[#26a17b]" />
        
        <Bitcoin className="w-12 h-12 mb-4 text-[#ffffff]" />
        
        <h3 className="text-lg font-bold mb-2">Pay with Crypto</h3>
        <p className="text-sm text-gray-300 mb-6 max-w-xs">
          Securely pay using Bitcoin, Ethereum, USDC, and more via Coinbase Commerce.
        </p>

        {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-xs">
                {error}
            </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
        >
          {loading ? (
             <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
          ) : (
            <>
              Proceed to Coinbase <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-pencil-gray opacity-70">
        <ExternalLink className="w-3 h-3" />
        <span>You will be redirected to a secure checkout page</span>
      </div>
    </div>
  );
}
