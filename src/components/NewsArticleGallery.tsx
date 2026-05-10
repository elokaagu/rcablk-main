"use client";

import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
import { isVideoMediaUrl } from "@/lib/media-url";

interface NewsArticleGalleryProps {
  images: string[];
  title: string;
}

/**
 * Single video thumbnail with editorial hover-to-play behaviour:
 * native `<video>` controls do not fit the narrow vertical frames, so we
 * show a small play badge instead. Hovering (mouse) auto-plays the muted
 * loop; leaving rewinds. Tapping (touch) toggles play/pause so the gallery
 * still works on phones.
 */
function GalleryVideoThumb({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const enter = useCallback(() => {
    void ref.current?.play().catch(() => {});
  }, []);

  const leave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const tap = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  return (
    <button
      type="button"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={tap}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      className="absolute inset-0 size-full appearance-none border-0 bg-black p-0 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      />
      {!playing ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white shadow-sm sm:size-8">
            <Play className="ml-0.5 size-3.5 fill-current sm:size-4" strokeWidth={0} />
          </span>
        </span>
      ) : null}
    </button>
  );
}

/** Narrow vertical frames in one row — reference layout above body copy */
export function NewsArticleGallery({ images, title }: NewsArticleGalleryProps) {
  return (
    <div
      className="mb-10 flex w-full justify-center gap-2 overflow-x-auto pb-1 sm:mb-12 sm:gap-2.5 md:gap-3"
      role="list"
      aria-label={`${title} gallery`}
    >
      {images.map((src, i) => {
        const label = `${title} — gallery item ${i + 1} of ${images.length}`;
        return (
          <div
            key={`${src}-${i}`}
            role="listitem"
            className="relative h-48 w-[4.25rem] shrink-0 overflow-hidden rounded-sm sm:h-56 sm:w-24 md:h-64 md:w-[6.5rem]"
          >
            {isVideoMediaUrl(src) ? (
              <GalleryVideoThumb src={src} label={label} />
            ) : (
              <BlurImage
                src={src}
                alt={label}
                fill
                sizes="(max-width: 640px) 68px, (max-width: 768px) 96px, 104px"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
