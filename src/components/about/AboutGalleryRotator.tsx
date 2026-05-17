"use client";

import { useEffect, useState } from "react";
import { BlurImage } from "@/components/BlurImage";
import type { AboutGalleryItem } from "@/data/about-gallery";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5200;
const FADE_MS = 900;

type AboutGalleryRotatorProps = {
  items: AboutGalleryItem[];
  /** Stagger the starting index so the two columns never show the same slide. */
  startIndex?: number;
  align?: "start" | "end";
};

export function AboutGalleryRotator({
  items,
  startIndex = 0,
  align = "start",
}: AboutGalleryRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(startIndex % Math.max(items.length, 1));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (items.length < 2 || reduceMotion) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [items.length, reduceMotion]);

  if (items.length === 0) return null;

  const current = items[activeIndex]!;

  return (
    <div
      className={cn(
        "w-full max-w-sm",
        align === "end" ? "self-end" : "self-start",
      )}
    >
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-black/[0.04]"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={item.src}
              className={cn(
                "absolute inset-0 transition-opacity ease-out",
                isActive ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              aria-hidden={!isActive}
            >
              <BlurImage
                src={item.src}
                alt={isActive ? item.name : ""}
                aspectRatio="3/4"
                fill
                sizes="(max-width: 1024px) 90vw, 384px"
                priority={i === startIndex % items.length}
                className="size-full"
              />
            </div>
          );
        })}
      </div>

      <p
        className="mt-3 text-xl font-display font-black uppercase tracking-wide text-foreground transition-opacity duration-500"
        key={current.name + activeIndex}
      >
        {current.name}
      </p>
    </div>
  );
}

type AboutGalleryColumnProps = {
  items: AboutGalleryItem[];
};

/** Two staggered rotators — top left, bottom right — matching the About reference layout. */
export function AboutGalleryColumn({ items }: AboutGalleryColumnProps) {
  const half = Math.ceil(items.length / 2);
  const topItems = items;
  const bottomItems = [...items.slice(half), ...items.slice(0, half)];

  return (
  <>
      <AboutGalleryRotator items={topItems} startIndex={0} align="start" />
      <AboutGalleryRotator
        items={bottomItems}
        startIndex={Math.floor(items.length / 3)}
        align="end"
      />
    </>
  );
}
