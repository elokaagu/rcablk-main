"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LETTERS = [
  { id: "r", label: "RESOURCES", href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", whiteHover: "/SVG Letterforms/RCA BLK–Letterforms-R-White.svg" },
  { id: "c", label: "EVENTS", href: "/events", svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg", whiteHover: null },
  { id: "a", label: "ABOUT", href: "/about", svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg", whiteHover: null },
  { id: "b", label: "CONTACT", href: "/contact", svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg", whiteHover: null },
  { id: "l", label: "NEWS", href: "/news", svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg", whiteHover: null },
  { id: "k", label: "ALUMNI", href: "/alumni", svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg", whiteHover: null },
] as const;

function LetterCell({
  letter,
  isHovered,
  onHover,
  onLeave,
}: {
  letter: (typeof LETTERS)[number];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const showLabel = isHovered;
  const imgSrc = isHovered && letter.whiteHover ? letter.whiteHover : letter.svg;
  const invertOnHover = isHovered && !letter.whiteHover;
  const isC = letter.id === "c";

  return (
    <Link
      href={letter.href}
      className="relative block w-full aspect-square bg-background overflow-hidden touch-manipulation"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={() => setTimeout(onLeave, 150)}
    >
      <div className="absolute inset-0 flex items-center justify-center p-0">
        {/* Label (on hover) - masked to letter shape */}
        {showLabel && (
          <span
            className="absolute inset-0 flex items-center justify-center z-10 font-serif font-bold text-black text-sm sm:text-base text-center whitespace-nowrap"
            style={{
              maskImage: `url('${letter.svg}')`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskImage: `url('${letter.svg}')`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              transform: "scale(0.5)",
            } as React.CSSProperties}
          >
            {letter.label}
          </span>
        )}
        {/* C: black by default, white on hover */}
        {isC ? (
          <div
            className={`absolute inset-0 transition-colors duration-300 ${isHovered ? "bg-white" : "bg-black"}`}
            style={{
              maskImage: `url('${letter.svg}')`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskImage: `url('${letter.svg}')`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
            } as React.CSSProperties}
          />
        ) : (
          <Image
            src={imgSrc}
            alt={letter.label}
            fill
            sizes="(max-width: 768px) 33vw, 340px"
            className={`object-contain transition-opacity duration-300 ${
              invertOnHover ? "brightness-0 invert" : ""
            }`}
          />
        )}
      </div>
    </Link>
  );
}

export default function RCALetterforms() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="w-full flex items-center justify-center p-4 sm:p-6"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="grid gap-0"
        style={{
          width: "min(150vh, 100vw - 2rem)",
          aspectRatio: "3 / 2",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
        }}
      >
        {LETTERS.map((letter) => (
          <LetterCell
            key={letter.id}
            letter={letter}
            isHovered={hovered === letter.id}
            onHover={() => setHovered(letter.id)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  );
}
