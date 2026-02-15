"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";

const IMG_WIDTH = 280;
const IMG_HEIGHT = 373;
const GAP = 16;

interface AlumniNameProps {
  name: string;
  snapshot?: string;
  link?: string;
  /** 0 = left column (image on right), 1 = right column (image on left) */
  columnIndex?: 0 | 1;
}

export function AlumniName({ name, snapshot, link, columnIndex = 0 }: AlumniNameProps) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (e: React.MouseEvent | React.TouchEvent) => {
    if (!snapshot) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x: number;
    let y: number;

    // Vertically center with the name when placing beside it
    const yCentered = rect.top + rect.height / 2 - IMG_HEIGHT / 2;
    // Keep image in upper portion of viewport – max bottom at ~45% to avoid overlapping footer
    const yMax = Math.max(GAP, vh * 0.45 - IMG_HEIGHT);
    const yClamped = Math.max(GAP, Math.min(yCentered, yMax, vh - IMG_HEIGHT - GAP));

    // Left column (0): image on right. Right column (1): image on left.
    const preferLeft = columnIndex === 1;
    const fitRight = rect.right + GAP + IMG_WIDTH <= vw - GAP;
    const fitLeft = rect.left >= GAP + IMG_WIDTH + GAP;

    if (preferLeft && fitLeft) {
      x = rect.left - GAP - IMG_WIDTH;
      y = yClamped;
    } else if (!preferLeft && fitRight) {
      x = rect.right + GAP;
      y = yClamped;
    } else if (fitRight) {
      x = rect.right + GAP;
      y = yClamped;
    } else if (fitLeft) {
      x = rect.left - GAP - IMG_WIDTH;
      y = yClamped;
    } else {
      // Fallback: above or below the name
      if (rect.top >= IMG_HEIGHT + GAP) {
        y = rect.top - IMG_HEIGHT - GAP;
      } else if (rect.bottom + IMG_HEIGHT + GAP <= vh) {
        y = Math.min(rect.bottom + GAP, yMax);
      } else {
        y = yClamped;
      }
      x = Math.max(GAP, Math.min(rect.left, vw - IMG_WIDTH - GAP));
    }

    setPosition({ x, y });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 80);
  };

  const sharedProps = {
    className: "inline-block cursor-default",
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onTouchStart: handleEnter,
    onTouchEnd: () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); timeoutRef.current = setTimeout(() => setHovered(false), 400); },
  };

  const content = (
    <>
      <span
        className={`text-lg text-foreground transition-colors duration-200 ${link ? "hover:bg-secondary/40 hover:text-secondary-foreground px-0.5 -mx-0.5 rounded-sm" : ""}`}
      >
        {name}
      </span>
      {snapshot && hovered && (
        <span
          className="fixed z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
          style={{ left: position.x, top: position.y }}
        >
          <span className="block w-[280px] aspect-[3/4] overflow-hidden bg-white shadow-lg border border-foreground/10 rounded-xl">
            <BlurImage
              src={snapshot}
              alt={`${name} – work`}
              aspectRatio="3/4"
              sizes="280px"
              priority={false}
            />
          </span>
          {link && (
            <span className="block mt-1.5 text-sm text-foreground/80 truncate max-w-[280px]">
              View work →
            </span>
          )}
        </span>
      )}
    </>
  );

  if (link) {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {content}
      </Link>
    );
  }
  return <span {...sharedProps}>{content}</span>;
}
