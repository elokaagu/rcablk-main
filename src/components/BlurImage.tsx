"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

// 1×1 mid-grey JPEG used by next/image's `placeholder="blur"`. We rely on this
// for the fast LQIP and stack our own CSS blur transition on top so the
// reveal is obvious even on cached images.
export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEBAT8B/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwH/2Q==";

export type BlurImageAspectRatio = "4/3" | "4/5" | "3/4" | "1/1" | "3/2" | "16/9";
type AspectRatio = BlurImageAspectRatio;

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: AspectRatio;
  sizes?: string;
  priority?: boolean;
  hoverOpacity?: boolean;
  /** When true, the wrapper grows to fill its parent rather than enforcing an aspect-ratio. */
  fill?: boolean;
  /** Additional classes applied directly to the underlying <img>. */
  imgClassName?: string;
  /** Override the object fit behaviour. Defaults to `cover`. */
  objectFit?: "cover" | "contain";
  /** Forwarded to next/image — defaults to `lazy` unless `priority` is set. */
  loading?: ImageProps["loading"];
}

const ASPECT_CLASS: Record<AspectRatio, string> = {
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
};

export function BlurImage({
  src,
  alt,
  className = "",
  aspectRatio = "4/3",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  hoverOpacity = false,
  fill = false,
  imgClassName = "",
  objectFit = "cover",
  loading,
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already in the browser cache, `onLoad` may have fired
  // before React attached our handler. Detect that on mount so we still
  // transition out of the blurred state.
  useEffect(() => {
    if (loaded) return;
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [loaded]);

  const wrapperClass = fill
    ? `relative h-full w-full overflow-hidden ${className}`
    : `relative w-full overflow-hidden ${ASPECT_CLASS[aspectRatio]} ${className}`;

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={`${wrapperClass} bg-black/[0.04]`}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading ?? (priority ? "eager" : "lazy")}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`${fitClass} transition-[opacity,filter,transform] duration-[900ms] ease-out will-change-[opacity,filter,transform] ${
          loaded
            ? "opacity-100 blur-0 scale-100"
            : "opacity-70 blur-2xl scale-[1.04]"
        } ${hoverOpacity ? "group-hover:opacity-80" : ""} ${imgClassName}`}
      />
    </div>
  );
}
