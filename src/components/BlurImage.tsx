"use client";

import Image from "next/image";

// Minimal gray blur placeholder
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEBAT8B/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwH/2Q==";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "4/3" | "4/5" | "3/4";
  sizes?: string;
  priority?: boolean;
  hoverOpacity?: boolean;
}

export function BlurImage({
  src,
  alt,
  className = "",
  aspectRatio = "4/3",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  hoverOpacity = false,
}: BlurImageProps) {
  const aspectClass =
    aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "4/5"
        ? "aspect-[4/5]"
        : "aspect-[3/4]";

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectClass} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        className={`object-cover transition-opacity duration-500 ${hoverOpacity ? "group-hover:opacity-80" : ""}`}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        priority={priority}
      />
    </div>
  );
}
