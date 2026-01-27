import React from "react";
import { CreditCard, Smartphone, Bitcoin } from "lucide-react";

type Method = "card" | "upi" | "crypto";

interface PaymentMethodSelectorProps {
  selected: Method;
  onSelect: (method: Method) => void;
}

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => onSelect("card")}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 w-28 ${
          selected === "card"
            ? "border-black bg-paper-bg shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-1"
            : "border-transparent text-pencil-gray hover:bg-black/5"
        }`}
      >
        <CreditCard className="w-6 h-6" />
        <span className="text-sm font-bold">Card</span>
      </button>

      <button
        onClick={() => onSelect("upi")}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 w-28 ${
          selected === "upi"
            ? "border-black bg-paper-bg shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-1"
            : "border-transparent text-pencil-gray hover:bg-black/5"
        }`}
      >
        <Smartphone className="w-6 h-6" />
        <span className="text-sm font-bold">UPI</span>
      </button>

      <button
        onClick={() => onSelect("crypto")}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 w-28 ${
          selected === "crypto"
            ? "border-black bg-paper-bg shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-1"
            : "border-transparent text-pencil-gray hover:bg-black/5"
        }`}
      >
        <Bitcoin className="w-6 h-6" />
        <span className="text-sm font-bold">Crypto</span>
      </button>
    </div>
  );
}
