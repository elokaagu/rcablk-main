"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
import { cn } from "@/lib/utils";
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
  /** Page background behind the row — used for edge fades */
  fadeColor?: string;
}

const NEWS_GALLERY_FADE = "#FFDD00";

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

const LIGHTBOX_IMG_CLASS =
  "mx-auto block max-h-[min(calc(92vh-10rem),780px)] max-w-full w-auto object-contain";

/** Lazy-loaded lightbox image with blur-in reveal (matches BlurImage timing). */
function GalleryLightboxImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (!loaded && el?.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src, loaded]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        LIGHTBOX_IMG_CLASS,
        "transition-[opacity,filter,transform] duration-[900ms] ease-out will-change-[opacity,filter,transform]",
        loaded ? "opacity-100 blur-0 scale-100" : "opacity-65 blur-2xl scale-[1.03]",
      )}
    />
  );
}

/** Portrait frames in one row — sits below the article title */
export function NewsArticleGallery({
  images,
  title,
  fadeColor = NEWS_GALLERY_FADE,
}: NewsArticleGalleryProps) {
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
      <div className="relative mb-10 sm:mb-12">
        <div
          className="flex w-full justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2.5 md:gap-3 [&::-webkit-scrollbar]:hidden"
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-14 md:w-20"
          style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-14 md:w-20"
          style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex max-h-[min(92vh,900px)] w-[min(96vw,56rem)] max-w-none flex-col overflow-hidden border-2 border-black bg-[#FFDD00] p-0 shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:rounded-lg [&>button:last-child]:text-black [&>button:last-child]:opacity-80 [&>button:last-child]:hover:opacity-100"
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

          <div className="relative grid min-h-[min(52vh,640px)] w-full flex-1 place-items-center bg-black/[0.04] px-12 pb-11 pt-12 sm:min-h-[min(58vh,720px)] sm:px-16 sm:pb-12 sm:pt-14">
            {activeSrc && isVideoMediaUrl(activeSrc) ? (
              <video
                key={activeSrc}
                src={activeSrc}
                controls
                playsInline
                className="mx-auto block max-h-[min(calc(92vh-10rem),780px)] max-w-full object-contain"
                aria-label={activeLabel}
              />
            ) : activeSrc ? (
              <GalleryLightboxImage key={activeSrc} src={activeSrc} alt={activeLabel} />
            ) : null}

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/95 text-black shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:left-4"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white/95 text-black shadow-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:right-4"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
                <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 font-serif text-sm text-black/70">
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
