import React from "react";
import NextImage from "next/image";

function Image({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  // Handle relative paths if necessary or just pass through
  // If src starts with /, it's public. If it's http, it's external.

  // Since we are using NextImage, we need width/height if we don't use fill.
  // The original component had fixed width/height 300.

  return (
    <NextImage
      src={src}
      alt={alt}
      width={300}
      height={300}
      className={`rounded-lg ${className}`}
      style={{ objectFit: "contain" }} // Added to behave like img
    />
  );
}

export default Image;
