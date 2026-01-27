import React, { useState } from "react";
import { X } from "lucide-react";
import PaymentMethodSelector from "./payments/PaymentMethodSelector";
import StripeCheckout from "./payments/StripeCheckout";
import RazorpayCheckout from "./payments/RazorpayCheckout";
import CoinbaseCheckout from "./payments/CoinbaseCheckout";

type PlanDetails = {
  name: string;
  price: number;
  period: "mo" | "yr";
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails;
}

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"card" | "upi" | "crypto">("card");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="paper-card w-full max-w-lg bg-white relative z-10 px-0 py-0 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 transform-none! rotate-0!">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-bold text-ink mb-1">
              Subscribe to {plan.name}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-xl text-pencil-gray">Total:</span>
              <span className="text-2xl font-bold text-ink">${plan.price}</span>
              <span className="text-sm text-pencil-gray">/{plan.period}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-pencil-gray" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          <PaymentMethodSelector selected={method} onSelect={setMethod} />

          <div className="min-h-75">
            {method === "card" && <StripeCheckout amount={plan.price} />}
            {method === "upi" && (
              <RazorpayCheckout amount={plan.price} planName={plan.name} />
            )}
            {method === "crypto" && (
              <CoinbaseCheckout amount={plan.price} planName={plan.name} />
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-pencil-gray">
            30-day money-back guarantee • Cancel functionality coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
