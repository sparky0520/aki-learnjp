import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Info } from "lucide-react";

type CryptoCurrency = "BTC" | "ETH" | "USDT" | "SOL";

interface CryptoOption {
  id: CryptoCurrency;
  name: string;
  network: string;
  address: string;
  rate: string; // Fake rate for demo
  icon: string; // Emoji for simplicity or path to icon
}

// Demo addresses
const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    rate: "1 BTC ≈ $95,000",
    icon: "₿",
  },
  {
    id: "ETH",
    name: "Ethereum",
    network: "ERC-20",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    rate: "1 ETH ≈ $3,200",
    icon: "Ξ",
  },
  {
    id: "USDT",
    name: "Tether",
    network: "TRC-20",
    address: "T9yD14Nj9j7xAB4dbGeiX9h8zzTheC9s3e",
    rate: "1 USDT = $1.00",
    icon: "$",
  },
  {
    id: "SOL",
    name: "Solana",
    network: "Solana",
    address: "HN7cABqLq46Es1jh92dQQ0bJk6t443w52B",
    rate: "1 SOL ≈ $145",
    icon: "◎",
  },
];

export default function CryptoPayment() {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoOption>(
    CRYPTO_OPTIONS[0],
  );
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedCurrency.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Coin Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {CRYPTO_OPTIONS.map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => setSelectedCurrency(crypto)}
            className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
              selectedCurrency.id === crypto.id
                ? "bg-black text-white border-black"
                : "bg-white text-pencil-gray border-gray-200 hover:border-black/30"
            }`}
          >
            <span className="text-xl mb-1">{crypto.icon}</span>
            <span className="text-xs font-bold">{crypto.id}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#f7931a] via-[#627eea] to-[#26a17b]" />

        <p className="text-sm font-bold text-ink mb-1">
          {selectedCurrency.name} ({selectedCurrency.network})
        </p>
        <p className="text-xs text-pencil-gray mb-4">
          Send only {selectedCurrency.id} to this address
        </p>

        <div className="bg-white p-2 rounded-lg border-2 border-dashed border-gray-200 mb-4">
          <QRCodeSVG
            value={selectedCurrency.address}
            size={160}
            level={"M"}
            includeMargin={false}
          />
        </div>

        <div
          onClick={copyToClipboard}
          className="w-full bg-gray-50 flex items-center justify-between px-3 py-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 group"
        >
          <span className="text-xs font-mono text-gray-500 truncate mr-2 text-left">
            {selectedCurrency.address}
          </span>
          {copied ? (
            <Check className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-black shrink-0" />
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-xs text-blue-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Payments are processed manually for now. Please send exact amount.
          Confirmation may take 10-60 minutes depending on network congestion.
        </p>
      </div>
    </div>
  );
}
