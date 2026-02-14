"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";

const IMG_WIDTH = 256;
const IMG_HEIGHT = 192;
const GAP = 16;

interface AlumniNameProps {
  name: string;
  snapshot?: string;
  link?: string;
}

export function AlumniName({ name, snapshot, link }: AlumniNameProps) {
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
    const yClamped = Math.max(GAP, Math.min(yCentered, vh - IMG_HEIGHT - GAP));

    // Prefer beside the name (never covers it): right first, then left
    if (rect.right + GAP + IMG_WIDTH <= vw - GAP) {
      x = rect.right + GAP;
      y = yClamped;
    } else if (rect.left >= GAP + IMG_WIDTH + GAP) {
      x = rect.left - GAP - IMG_WIDTH;
      y = yClamped;
    } else {
      // Fallback: above or below the name
      if (rect.top >= IMG_HEIGHT + GAP) {
        y = rect.top - IMG_HEIGHT - GAP;
      } else if (rect.bottom + IMG_HEIGHT + GAP <= vh) {
        y = rect.bottom + GAP;
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
          <span className="block w-64 aspect-[4/3] overflow-hidden bg-white shadow-lg border border-foreground/10 rounded-sm">
            <BlurImage
              src={snapshot}
              alt={`${name} – work`}
              aspectRatio="4/3"
              sizes="256px"
              priority={false}
            />
          </span>
          {link && (
            <span className="block mt-1.5 text-sm text-foreground/80 truncate max-w-64">
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
