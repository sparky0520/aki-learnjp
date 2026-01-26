import React from "react";

// Wrapper for images to match original project styling
function ImageComponent({ src, alt, className }: { src: string, alt?: string, className?: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} width={300} height={300} className={`rounded-lg ${className || ""}`} />;
}

export default ImageComponent;
