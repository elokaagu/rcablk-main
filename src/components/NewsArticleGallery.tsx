"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { isVideoMediaUrl } from "@/lib/media-url";

interface NewsArticleGalleryProps {
  images: string[];
  title: string;
}

/** Matches Studio CMS gallery previews: portrait 3:4 frames */
const THUMB_FRAME_CLASS =
  "relative aspect-[3/4] w-[5.5rem] shrink-0 overflow-hidden rounded-sm sm:w-[6.5rem] md:w-[7.5rem]";

const THUMB_SIZES = "(max-width: 640px) 88px, (max-width: 1024px) 104px, 120px";

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
      className="absolute inset-0 z-10 size-full cursor-pointer appearance-none border-0 bg-black p-0 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
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

function GalleryImageThumb({
  src,
  label,
  onOpen,
}: {
  src: string;
  label: string;
  onOpen: () => void;
}) {
  return (
    <>
      <BlurImage
        src={src}
        alt={label}
        fill
        objectFit="cover"
        sizes={THUMB_SIZES}
        className="size-full"
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View larger: ${label}`}
        className="absolute inset-0 z-10 size-full cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      />
    </>
  );
}

/** Portrait frames in one row — sits below the article title */
export function NewsArticleGallery({ images, title }: NewsArticleGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % images.length);
  };

  const activeSrc = images[activeIndex];
  const activeLabel = `${title} — gallery item ${activeIndex + 1} of ${images.length}`;

  return (
    <>
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
              className={THUMB_FRAME_CLASS}
            >
              {isVideoMediaUrl(src) ? (
                <GalleryVideoThumb src={src} label={label} />
              ) : (
                <GalleryImageThumb src={src} label={label} onOpen={() => openAt(i)} />
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[min(92vh,900px)] w-[min(96vw,56rem)] border-2 border-black bg-[#FFDD00] p-0 shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:rounded-lg"
          onKeyDown={(e) => {
            if (images.length < 2) return;
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goPrev();
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goNext();
            }
          }}
        >
          <DialogTitle className="sr-only">{activeLabel}</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged gallery view. Use arrow keys to move between images when available.
          </DialogDescription>

          <div className="relative flex min-h-[40vh] items-center justify-center bg-black/5 p-4 pt-12 sm:min-h-[44vh] sm:p-6 sm:pt-14">
            {activeSrc && isVideoMediaUrl(activeSrc) ? (
              <video
                key={activeSrc}
                src={activeSrc}
                controls
                playsInline
                className="max-h-[min(80vh,820px)] w-auto max-w-[min(92vw,52rem)] object-contain"
                aria-label={activeLabel}
              />
            ) : activeSrc ? (
              // Natural dimensions in lightbox — avoids stretched/cropped fill layout
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={activeSrc}
                src={activeSrc}
                alt={activeLabel}
                className="max-h-[min(80vh,820px)] w-auto max-w-[min(92vw,52rem)] object-contain"
              />
            ) : null}

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/95 text-black shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:left-4"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/95 text-black shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:right-4"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-serif text-sm text-black/70">
                  {activeIndex + 1} / {images.length}
                </p>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
