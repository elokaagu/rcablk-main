"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const letters = [
  { id: "r", label: "RESOURCES", href: "/resources", row: 0, col: 0, svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", svgHover: "/SVG Letterforms/RCA BLK–Letterforms-R-White.svg" },
  { id: "c", label: "EVENTS", href: "/events", row: 0, col: 1, svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg", svgHover: null },
  { id: "a", label: "ABOUT", href: "/about", row: 0, col: 2, svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg", svgHover: null },
  { id: "b", label: "CONTACT", href: "/contact", row: 1, col: 0, svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg", svgHover: null },
  { id: "l", label: "NEWS", href: "/news", row: 1, col: 1, svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg", svgHover: null },
  { id: "k", label: "ALUMNI", href: "/alumni", row: 1, col: 2, svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg", svgHover: null },
];

const RCALetterforms = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [loadedSrcs, setLoadedSrcs] = useState<Record<string, boolean>>({});

  return (
    <div className="flex items-center justify-center px-4 sm:px-8 lg:px-16 w-full relative max-w-full min-w-0">
      <div className="w-full relative max-w-full" style={{ maxWidth: "min(90vw, min(80vh, 100vw - 2rem) * 1.51)" }}>
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
          }}
        >
          {letters.map((letter) => {
            const isHovered = hovered === letter.id;

            return (
              <Link
                key={letter.id}
                href={letter.href}
                className="relative aspect-square group min-h-[44px] min-w-[44px] touch-manipulation"
                onMouseEnter={() => setHovered(letter.id)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(letter.id)}
                onTouchEnd={() => setHovered(null)}
                onTouchCancel={() => setHovered(null)}
              >
                <div
                  className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${isHovered ? "bg-accent" : "bg-background"}`}
                >
                  {isHovered && (
                    <span className="absolute top-2 sm:top-3 left-0 right-0 z-10 text-center text-black text-xs sm:text-sm font-display font-medium tracking-display-tight uppercase px-1">
                      {letter.label}
                    </span>
                  )}
                  <div className={`absolute inset-0 p-2 ${isHovered ? "pt-10" : ""}`}>
                    {(() => {
                      const src = isHovered && letter.svgHover ? letter.svgHover : letter.svg;
                      return (
                        <Image
                          src={src}
                          alt={letter.label}
                          fill
                          loading="lazy"
                          onLoad={() => setLoadedSrcs((p) => ({ ...p, [src]: true }))}
                          className={`object-contain transition-all duration-700 ease-out ${
                            isHovered && !letter.svgHover ? "brightness-0 invert" : ""
                          } ${loadedSrcs[src] ? "opacity-100 blur-0" : "opacity-60 blur-md"}`}
                        />
                      );
                    })()}
                    {/* Subtle gradient highlight - only inside letter, no box */}
                    {isHovered && (
                      <div
                        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                        style={
                          {
                            background: `radial-gradient(ellipse 35% 45% at 50% 40%, rgba(255,255,255,0.35) 0%, transparent 70%)`,
                            WebkitMaskImage: `url(${letter.svgHover || letter.svg})`,
                            maskImage: `url(${letter.svgHover || letter.svg})`,
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskType: "alpha",
                            maskType: "alpha",
                          } as React.CSSProperties
                        }
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RCALetterforms;
