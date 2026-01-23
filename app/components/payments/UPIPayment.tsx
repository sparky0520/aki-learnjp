import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";

export default function UPIPayment({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);
  // Example UPI ID - effectively a placeholder for the demo
  const upiId = "darshjain05.in@okhdfcbank"; 
  const upiLink = `upi://pay?pa=${upiId}&pn=AkiApp&am=${amount}&cu=USD`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 relative">
        <div className="corner-tape" />
        <QRCodeSVG
          value={upiLink}
          size={200}
          level={"L"}
          includeMargin={false}
        />
      </div>

      <div className="text-center mb-6">
        <p className="text-pencil-gray text-sm mb-2">Scan with any UPI app</p>
        <div className="flex items-center gap-2 justify-center bg-gray-100 px-4 py-2 rounded-lg group hover:bg-gray-200 transition-colors cursor-pointer" onClick={copyToClipboard}>
          <span className="font-mono text-ink text-lg">{upiId}</span>
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-black" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-xs opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Simple placeholders for payment app icons */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">GPay</div>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">PhonePe</div>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">Paytm</div>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">BHIM</div>
      </div>
      
      <p className="text-xs text-pencil-gray mt-8 text-center max-w-sm">
        After payment, please take a screenshot and email it to support@aki-app.com to activate your account immediately.
        <br/>
        <span className="italic opacity-70">(Automated verification coming soon)</span>
      </p>
    </div>
  );
}
