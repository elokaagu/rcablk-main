"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LETTERS = [
  { id: "r", label: "RESOURCES", href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", svgHover: "/SVG Letterforms/RCA BLK–Letterforms-R-White.svg", isDefaultActive: false },
  { id: "c", label: "EVENTS", href: "/events", svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg", svgHover: null, isDefaultActive: false },
  { id: "a", label: "ABOUT", href: "/about", svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg", svgHover: null, isDefaultActive: false },
  { id: "b", label: "CONTACT", href: "/contact", svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg", svgHover: null, isDefaultActive: false },
  { id: "l", label: "NEWS", href: "/news", svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg", svgHover: null, isDefaultActive: false },
  { id: "k", label: "ALUMNI", href: "/alumni", svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg", svgHover: null, isDefaultActive: false },
];

function LetterCell({
  letter,
  isHovered,
  onHover,
  onHoverEnd,
  imageLoaded,
  onImageLoad,
}: {
  letter: (typeof LETTERS)[number];
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  imageLoaded: boolean;
  onImageLoad: (src: string) => void;
}) {
  const isActive = isHovered || letter.isDefaultActive;
  const showLabel = isActive;
  const imgSrc = isHovered && letter.svgHover ? letter.svgHover : letter.svg;
  const isC = letter.id === "c";

  return (
    <Link
      href={letter.href}
      className="relative block w-full aspect-square min-w-0 min-h-0 bg-background overflow-hidden touch-manipulation"
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onTouchStart={onHover}
      onTouchEnd={() => setTimeout(onHoverEnd, 150)}
    >
      {/* Letter image */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Label: centered inside the letter (on hover) */}
          {showLabel && (
            <span
              className="absolute inset-0 flex items-center justify-center z-10 font-serif font-medium text-black text-xs sm:text-sm text-center px-2 leading-tight"
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
            >
              {letter.label}
            </span>
          )}
          {/* C: solid white fill (no gradient) */}
          {isC ? (
            <div
              className="absolute inset-0 bg-white"
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
            <>
              <Image
                src={imgSrc}
                alt={letter.label}
                fill
                sizes="(max-width: 768px) 33vw, 340px"
                className={`object-contain transition-opacity duration-300 ${
                  isHovered && !letter.svgHover ? "brightness-0 invert" : ""
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => onImageLoad(imgSrc)}
              />
              {/* Hover highlight for non-C letters */}
              {isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={
                    {
                      maskImage: `url(${letter.svgHover || letter.svg})`,
                      maskSize: "contain",
                      maskPosition: "center",
                      maskRepeat: "no-repeat",
                      WebkitMaskImage: `url(${letter.svgHover || letter.svg})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskPosition: "center",
                      WebkitMaskRepeat: "no-repeat",
                      background: "radial-gradient(ellipse 40% 50% at 50% 45%, rgba(255,255,255,0.5) 0%, transparent 70%)",
                    } as React.CSSProperties
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function RCALetterforms() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <div
      className="w-full h-full min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="grid w-full max-w-full gap-0"
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
            onHoverEnd={() => setHovered(null)}
            imageLoaded={!!loaded[letter.svg] || !!loaded[letter.svgHover || ""]}
            onImageLoad={(src) => setLoaded((p) => ({ ...p, [src]: true }))}
          />
        ))}
      </div>
    </div>
  );
}
