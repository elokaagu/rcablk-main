"use client";

import { BlurImage } from "@/components/BlurImage";
import { isVideoMediaUrl } from "@/lib/media-url";

interface NewsArticleGalleryProps {
  images: string[];
  title: string;
}

/** Narrow vertical frames in one row — reference layout above body copy */
export function NewsArticleGallery({ images, title }: NewsArticleGalleryProps) {
  return (
    <div
      className="mb-10 flex w-full justify-center gap-2 overflow-x-auto pb-1 sm:mb-12 sm:gap-2.5 md:gap-3"
      role="list"
      aria-label={`${title} gallery`}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          role="listitem"
          className="relative h-48 w-[4.25rem] shrink-0 overflow-hidden rounded-sm sm:h-56 sm:w-24 md:h-64 md:w-[6.5rem]"
        >
          {isVideoMediaUrl(src) ? (
            <video
              src={src}
              muted
              playsInline
              controls
              preload="metadata"
              className="absolute inset-0 size-full object-cover"
              aria-label={`${title} — gallery video ${i + 1} of ${images.length}`}
            />
          ) : (
            <BlurImage
              src={src}
              alt={`${title} — gallery image ${i + 1} of ${images.length}`}
              fill
              sizes="(max-width: 640px) 68px, (max-width: 768px) 96px, 104px"
            />
          )}
        </div>
      ))}
    </div>
  );
}
