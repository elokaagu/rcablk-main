"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LETTERS = [
  { id: "r", label: "RESOURCES", href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", svgHover: "/SVG Letterforms/RCA BLK–Letterforms-R-White.svg", isDefaultActive: false },
  { id: "c", label: "EVENTS", href: "/events", svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg", svgHover: null, isDefaultActive: true },
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
      {/* Label: EVENTS always on C, others on hover */}
      {showLabel && (
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-3 sm:pt-4">
          <span className="font-display font-black text-black uppercase tracking-tight text-sm sm:text-base">
            {letter.label}
          </span>
        </div>
      )}

      {/* Letter image */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 sm:p-5 ${showLabel ? "pt-12 sm:pt-14" : ""}`}
      >
        <div className="relative w-full h-full">
          {/* C: white fill with orange radial gradient (no Image, use SVG mask) */}
          {isC ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* White C with orange radial gradient in center (light orange center, white edges) */}
              <div
                className="absolute inset-0"
                style={{
                  maskImage: `url('${letter.svg}')`,
                  maskSize: "contain",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskImage: `url('${letter.svg}')`,
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  background: "radial-gradient(ellipse 50% 60% at 50% 50%, hsl(24 95% 65%) 0%, hsl(24 95% 82%) 30%, hsl(24 95% 95%) 55%, white 80%)",
                } as React.CSSProperties}
              />
            </div>
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
        className="grid w-full max-w-full gap-0.5 sm:gap-1"
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
