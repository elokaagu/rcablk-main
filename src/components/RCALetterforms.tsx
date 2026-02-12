"use client";

import { useState } from "react";
import Link from "next/link";

const bg = "hsl(40,100%,50%)";
const fg = "hsl(0,0%,0%)";

const letters = [
  { id: "r", label: "Resources", href: "/resources", row: 0, col: 0 },
  { id: "c", label: "Contact", href: "/contact", row: 0, col: 1 },
  { id: "a", label: "About", href: "/about", row: 0, col: 2 },
  { id: "b", label: "Blog", href: "/news", row: 1, col: 0 },
  { id: "l", label: "Links", href: "/alumni", row: 1, col: 1 },
  { id: "k", label: "Knowledge", href: "/events", row: 1, col: 2 },
];

// R = Γ shape: vertical left bar + horizontal top bar, amber bottom-right
const LetterR = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <rect x="65" y="65" width="135" height="135" fill={bg} />
  </>
);

// C = three-sided rectangle open on right
const LetterC = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <rect x="65" y="55" width="135" height="90" fill={bg} />
  </>
);

// A = abstract A with circle (dot) at top and crossbar
const LetterA = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <circle cx="145" cy="50" r="38" fill={bg} />
    <rect x="85" y="110" width="115" height="90" fill={bg} />
  </>
);

// B = lowercase b: vertical bar left, notch top-right, circle bottom
const LetterB = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <rect x="85" y="0" width="115" height="75" fill={bg} />
    <circle cx="65" cy="155" r="40" fill={bg} />
  </>
);

// L = vertical left bar + horizontal bottom bar, amber top-right
const LetterL = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <rect x="65" y="0" width="135" height="130" fill={bg} />
  </>
);

// K = vertical bar + angular arms as stepped rects
const LetterK = () => (
  <>
    <rect x="0" y="0" width="200" height="200" fill={fg} />
    <rect x="60" y="75" width="55" height="50" fill={bg} />
    <rect x="125" y="0" width="75" height="55" fill={bg} />
    <rect x="125" y="145" width="75" height="55" fill={bg} />
    <rect x="60" y="145" width="55" height="55" fill={bg} />
  </>
);

const letterComponents: Record<string, React.FC> = {
  r: LetterR, c: LetterC, a: LetterA,
  b: LetterB, l: LetterL, k: LetterK,
};

const RCALetterforms = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const cellSize = 200;
  const gap = 10;

  return (
    <div className="flex items-center justify-center px-8 lg:px-16 w-full relative">
      <div className="w-full relative" style={{ maxWidth: "min(90vw, 80vh * 1.51)" }}>
        <svg
          viewBox="0 0 620 410"
          className="w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {letters.map((letter) => {
            const x = letter.col * (cellSize + gap);
            const y = letter.row * (cellSize + gap);
            const Comp = letterComponents[letter.id];
            const isHovered = hovered === letter.id;

            return (
              <g key={letter.id} transform={`translate(${x}, ${y})`}>
                {/* Hover hitbox */}
                <rect
                  x="0" y="0" width="200" height="200"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(letter.id)}
                  onMouseLeave={() => setHovered(null)}
                />
                <Comp />
                {/* White overlay + label on hover */}
                {isHovered && (
                  <>
                    <rect
                      x="0" y="0" width="200" height="200"
                      fill="white"
                      opacity="0.85"
                      className="pointer-events-none"
                    />
                    <Comp />
                    <rect
                      x="0" y="0" width="200" height="200"
                      fill="white"
                      opacity="0.7"
                      className="pointer-events-none"
                    />
                    <text
                      x="100" y="30"
                      textAnchor="middle"
                      fill="black"
                      fontSize="18"
                      fontFamily="'Georgia', serif"
                      fontWeight="400"
                      className="pointer-events-none uppercase tracking-wider"
                    >
                      {letter.label}
                    </text>
                  </>
                )}
                {/* Invisible link overlay */}
                <Link href={letter.href}>
                  <rect
                    x="0" y="0" width="200" height="200"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(letter.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </Link>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default RCALetterforms;
