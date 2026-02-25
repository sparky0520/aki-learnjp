"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

export default function ZoomableImage({
    src,
    alt,
    className = "w-full h-full aspect-video",
    containerClassName = "aspect-video bg-white hand-drawn-border flex items-center justify-center relative overflow-hidden group cursor-pointer",
}: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={containerClassName}
                onClick={() => setIsOpen(true)}
            >
                <span className="text-pencil-gray font-handwriting transform group-hover:scale-110 transition-transform w-full h-full">
                    <img
                        alt={alt}
                        src={src}
                        className={className}
                    />
                </span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/80 px-4 py-2 rounded-full text-sm font-bold text-ink border border-ink opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        Click to zoom
                    </span>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 z-110 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        aria-label="Close zoom"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Maximized Image */}
                    <div className="relative z-105 max-w-full max-h-full flex items-center justify-center animate-in zoom-in duration-300">
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-sm shadow-2xl border-4 border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
