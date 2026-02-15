"use client";

import { useState } from "react";
import { BlurImage } from "@/components/BlurImage";

interface NewsArticleGalleryProps {
  images: string[];
  title: string;
}

export function NewsArticleGallery({ images, title }: NewsArticleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSrc = images[selectedIndex];

  return (
    <>
      {/* Main image */}
      <div className="w-full mb-4">
        <BlurImage
          src={selectedSrc}
          alt={title}
          aspectRatio="3/4"
          className="w-full max-w-2xl mx-auto"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>

      {/* Thumbnail row */}
      <div className="w-full overflow-x-auto overflow-y-hidden flex gap-2 py-4 mb-8">
        <div className="flex gap-1 min-w-max px-4 sm:px-8">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative w-24 sm:w-32 aspect-[3/4] shrink-0 overflow-hidden rounded-sm transition-opacity hover:opacity-90 ${
                selectedIndex === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-[#FFC107]" : "opacity-70 hover:opacity-90"
              }`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={selectedIndex === i}
            >
              <BlurImage
                src={img}
                alt={`${title} gallery ${i + 1}`}
                aspectRatio="3/4"
                sizes="128px"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
