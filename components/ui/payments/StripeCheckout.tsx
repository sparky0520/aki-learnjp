import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

// Initialize Stripe outside of component
// Make sure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is in your .env
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // Demo simulation since we don't have a backend to create PaymentIntent yet
    // In a real app, you would fetch clientSecret from your API here

    // Simulating network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, we'll just simulate success
    setProcessing(false);
    setSucceeded(true);

    /* 
    REAL IMPLEMENTATION:
    const cardElement = elements.getElement(CardElement);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      setError(error.message || "An expected error occurred");
      setProcessing(false);
    } else {
      // Send paymentMethod.id to your server
    }
    */
  };

  if (succeeded) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Payment Successful!</h3>
        <p className="text-pencil-gray text-sm">Welcome to Aki Pro.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-pencil-gray mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#2c2c2c",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  fontFamily: "Arial, sans-serif",
                },
                invalid: {
                  color: "#d93d3d",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-accent-red text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${amount}
          </>
        )}
      </button>

      <div className="mt-4 flex justify-center text-[10px] text-gray-400 gap-4">
        <span>Powered by Stripe</span>
        <span>SSL Secure</span>
      </div>
    </form>
  );
};

export default function StripeCheckout({ amount }: { amount: number }) {
  // If no key is provided, show a warning (dev mode helper)
  const hasKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
      {!hasKey && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 text-[10px] rounded text-center">
          Demo Mode: Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to env
        </div>
      )}
    </Elements>
  );
}
