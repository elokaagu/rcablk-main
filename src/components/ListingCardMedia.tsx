"use client";

import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { BlurImage, type BlurImageAspectRatio } from "@/components/BlurImage";
import { isVideoMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const ASPECT_CLASS: Record<BlurImageAspectRatio, string> = {
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
};

/**
 * Listing-card media wrapper used by news and events grids. Renders a
 * `BlurImage` for image URLs and a muted, hover-to-play `<video>` (with a
 * play affordance overlay) for video URLs detected by `isVideoMediaUrl`.
 */
export function ListingCardMedia({
  src,
  alt,
  aspectRatio,
  sizes,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  aspectRatio: BlurImageAspectRatio;
  sizes: string;
  className?: string;
  imgClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayHint, setShowPlayHint] = useState(true);

  const onEnter = useCallback(() => {
    void videoRef.current?.play().catch(() => {});
  }, []);

  const onLeave = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  if (!isVideoMediaUrl(src)) {
    return (
      <BlurImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        sizes={sizes}
        className={className}
        imgClassName={imgClassName}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-black",
        ASPECT_CLASS[aspectRatio],
        className,
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={alt}
        onPlay={() => setShowPlayHint(false)}
        onPause={() => setShowPlayHint(true)}
        className={cn(
          "h-full w-full object-cover transition-[transform,opacity] duration-500 ease-out will-change-transform",
          imgClassName,
        )}
      />
      {showPlayHint ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-black/55 text-white shadow-md sm:size-14">
            <Play className="ml-0.5 size-6 fill-current sm:size-7" strokeWidth={0} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
