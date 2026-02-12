import React from "react";

type PlanCardProps = {
    name: "Basic" | "Pro";
    price: number;
    period?: "mo" | "yr";
    description: string;
    features: React.ReactNode[];
    buttonText: string;
    onButtonClick: () => void;
    isPopular?: boolean;
    yearlyPrice?: number;
    promoText?: string;
    originalPrice?: number; // For strikethrough logic (Basic plan)
};

export default function PlanCard({
    name,
    price,
    period = "mo",
    description,
    features,
    buttonText,
    onButtonClick,
    isPopular = false,
    yearlyPrice,
    promoText,
    originalPrice,
}: PlanCardProps) {
    return (
        <div className="paper-card p-8 sm:p-10 flex-1 relative flex flex-col min-h-125">
            {/* Paper holes decoration */}
            <div className="absolute top-0 left-4 w-full h-8 flex gap-4 -mt-4 opacity-30">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-black/10"></div>
                ))}
            </div>

            {isPopular && (
                <div className="hanko-stamp absolute -top-4 -right-4 rotate-12 bg-white/80">
                    Free
                    <br />
                    Beta
                </div>
            )}

            <h2 className="text-3xl font-bold text-ink-color mb-2">{name}</h2>
            <div className="text-sm text-pencil-gray mb-6 h-6">{description}</div>

            <div className="mb-8 relative">
                {originalPrice ? (
                    <>
                        <span className="text-4xl sm:text-5xl font-bold text-ink-color line-through">
                            ${originalPrice}
                        </span>
                        <span className="text-lg text-pencil-gray">/{period}</span>
                    </>
                ) : (
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl sm:text-6xl font-bold text-ink-color">
                            ${price}
                        </span>
                        <span className="text-xl text-pencil-gray">/{period}</span>
                    </div>
                )}

                {yearlyPrice && (
                    <div className="space-y-1 mt-2">
                        <p className="text-sm text-pencil-gray">
                            <span className="font-bold text-ink-color">${yearlyPrice}</span> /
                            year
                        </p>
                        {promoText && (
                            <p className="text-xs font-bold text-accent-red tracking-wide uppercase">
                                {promoText}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="grow">
                <ul className="space-y-4 text-left text-pencil-gray leading-relaxed text-lg">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <button
                    onClick={onButtonClick}
                    className="w-full relative group focus:outline-none cursor-pointer block"
                >
                    <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
                    <span
                        className={`relative block border-2 border-black px-8 py-3 text-lg font-bold uppercase tracking-widest text-black ${name === "Pro" ? "bg-white text-center" : "bg-paper-bg"
                            }`}
                    >
                        {buttonText}
                    </span>
                </button>
            </div>
        </div>
    );
}
