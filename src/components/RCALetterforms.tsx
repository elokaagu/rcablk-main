"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const letters = [
  { id: "r", label: "Resources", href: "/resources", row: 0, col: 0, svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg" },
  { id: "c", label: "Contact", href: "/contact", row: 0, col: 1, svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg" },
  { id: "a", label: "About", href: "/about", row: 0, col: 2, svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg" },
  { id: "b", label: "Blog", href: "/news", row: 1, col: 0, svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg" },
  { id: "l", label: "Links", href: "/alumni", row: 1, col: 1, svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg" },
  { id: "k", label: "Knowledge", href: "/events", row: 1, col: 2, svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg" },
];

const cellSize = 200;
const gap = 10;

const RCALetterforms = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center px-8 lg:px-16 w-full relative">
      <div className="w-full relative" style={{ maxWidth: "min(90vw, 80vh * 1.51)" }}>
        <div
          className="grid gap-2.5"
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
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-background">
                  <Image
                    src={letter.svg}
                    alt={letter.label}
                    fill
                    className="object-contain p-4 transition-all duration-300 group-hover:opacity-90"
                  />
                  {isHovered && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <span className="text-black text-sm font-display font-medium uppercase tracking-wider">
                        {letter.label}
                      </span>
                    </div>
                  )}
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
