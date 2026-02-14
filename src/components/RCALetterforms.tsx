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

  return (
    <div className="flex items-center justify-center px-8 lg:px-16 w-full relative">
      <div className="w-full relative" style={{ maxWidth: "min(90vw, 80vh * 1.51)" }}>
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
                className="relative aspect-square group"
                onMouseEnter={() => setHovered(letter.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${isHovered ? "bg-accent" : "bg-background"}`}
                >
                  {isHovered && (
                    <span className="absolute top-3 left-0 right-0 z-10 text-center text-black text-sm font-display font-medium tracking-display-tight uppercase">
                      {letter.label}
                    </span>
                  )}
                  <div className={`absolute inset-0 p-2 ${isHovered ? "pt-10" : ""}`}>
                    <Image
                      src={isHovered && letter.svgHover ? letter.svgHover : letter.svg}
                      alt={letter.label}
                      fill
                      className={`object-contain transition-all duration-300 ${isHovered && !letter.svgHover ? "brightness-0 invert" : ""}`}
                    />
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
