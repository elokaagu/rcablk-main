"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Flex alignment for the hover label inside a full-cell wrapper that shares
 * the letter SVG as a CSS mask. Text only appears inside the letter shape,
 * matching the EVENTS / RESOURCES reference treatment.
 */
type LabelInLetterAlign = {
  /** Tailwind flex alignment classes for the masked label wrapper */
  className: string;
  /** Text alignment inside the masked label */
  textClass: string;
};

const LETTERS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  svg: string;
  whiteHover: string | null;
  labelInLetter: LabelInLetterAlign;
}> = [
  /** R: white Γ + yellow notch (mask); tiny serif "R" in crook */
  {
    id: "r",
    label: "ABOUT",
    href: "/about",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-start justify-start pt-[10%] pl-[8%] sm:pt-[11%] sm:pl-[9%]",
      textClass: "text-left",
    },
  },
  {
    id: "c",
    label: "EVENTS",
    href: "/events",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-end justify-center pb-[10%] sm:pb-[11%]",
      textClass: "text-center",
    },
  },
  {
    id: "a",
    label: "RESOURCES",
    href: "/resources",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-start justify-center pt-[10%] sm:pt-[11%]",
      textClass: "text-center",
    },
  },
  {
    id: "b",
    label: "ALUMNI",
    href: "/alumni",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-center justify-start pl-[8%] sm:pl-[10%]",
      textClass: "text-left",
    },
  },
  {
    id: "l",
    label: "NEWS",
    href: "/news",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-start justify-end pr-[8%] pt-[10%] sm:pr-[10%] sm:pt-[11%]",
      textClass: "text-right",
    },
  },
  {
    id: "k",
    label: "CONTACT",
    href: "/contact",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-center justify-center",
      textClass: "text-center",
    },
  },
];

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
  const isR = letter.id === "r";

  const maskStyle = {
    maskImage: `url('${letter.svg}')`,
    maskSize: "contain",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskImage: `url('${letter.svg}')`,
    WebkitMaskSize: "contain",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
  } as React.CSSProperties;

  return (
    <Link
      href={letter.href}
      aria-label={letter.label}
      className="relative block aspect-square w-full overflow-hidden bg-homeHero touch-manipulation"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={() => setTimeout(onLeave, 150)}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-0">
        {/* R: white Γ + notch (yellow = cell bg); tiny serif R in crook; hover → black fill + white label */}
        {isR ? (
          <>
            <div
              className={`absolute inset-0 transition-colors duration-300 ${isHovered ? "bg-black" : "bg-white"}`}
              style={maskStyle}
            />
            {!isHovered && (
              <span
                className="pointer-events-none absolute left-[13%] top-[11%] z-[5] font-serif text-[0.58rem] font-normal leading-none tracking-tight text-black sm:left-[14%] sm:top-[12%] sm:text-[0.68rem]"
                aria-hidden
              >
                R
              </span>
            )}
          </>
        ) : isC ? (
          <div
            className={`absolute inset-0 transition-colors duration-300 ${isHovered ? "bg-white" : "bg-black"}`}
            style={maskStyle}
          />
        ) : (
          <Image
            src={imgSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 33vw, 340px"
            className={`object-contain transition-opacity duration-300 ${
              invertOnHover ? "brightness-0 invert" : ""
            }`}
          />
        )}
        {/* Hover label on top: same mask as the letter so type only appears inside
            the glyph (matches EVENTS / RESOURCES). Per-letter flex alignment. */}
        {showLabel && (
          <div
            className={`pointer-events-none absolute inset-0 z-20 flex font-serif text-[0.62rem] font-normal leading-none tracking-tight sm:text-sm ${letter.labelInLetter.className}`}
            style={maskStyle}
          >
            <span
              className={`inline-block max-w-[92%] uppercase ${letter.labelInLetter.textClass} ${
                isR && isHovered ? "text-white" : "text-black"
              }`}
            >
              {letter.label}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function RCALetterforms() {
  const [hovered, setHovered] = useState<string | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      const { width: cw, height: ch } = el.getBoundingClientRect();
      if (ch <= 0 || cw <= 0) return;
      const gridW = Math.min(cw, ch * 1.5);
      const gridH = (gridW * 2) / 3;
      setGridSize({ w: gridW, h: gridH });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        ref={measureRef}
        className="flex min-h-0 flex-1 w-full items-center justify-center px-4 sm:px-6"
      >
        <div
          className="grid shrink-0 gap-0"
          style={{
            width: gridSize ? `${gridSize.w}px` : "min(calc(100vw - 2rem), 85vw)",
            height: gridSize ? `${gridSize.h}px` : undefined,
            aspectRatio: gridSize ? undefined : "3 / 2",
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
    </div>
  );
}
