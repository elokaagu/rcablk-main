"use client";

import { useState, useRef, useLayoutEffect, useMemo } from "react";
import Link from "next/link";

/**
 * Flex alignment for labels clipped to each letter SVG (same mask as the
 * glyph). Labels are always visible on the homepage to match brand references;
 * hover only changes fill / inversion.
 */
type LabelInLetterAlign = {
  className: string;
  textClass: string;
};

const LETTERS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  svg: string;
  labelInLetter: LabelInLetterAlign;
}> = [
  // Glyph viewBox is 79.37 × 124.72 (taller than wide), drawn with mask
  // size: contain + center alignment. That places the glyph between cell
  // x=22.7% and x=77.0% horizontally and 0%–100% vertically. The padding
  // values below sit each label on the *thickest* visible stroke of its
  // letter so the SVG mask doesn't slice the type.
  {
    id: "r",
    label: "ABOUT",
    href: "/about",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg",
    // Top crossbar (cell y=4.6%-22.7%, x=22.7%-77%)
    labelInLetter: {
      className: "items-start justify-center pt-[7%] px-[12%]",
      textClass: "text-center",
    },
  },
  {
    id: "c",
    label: "EVENTS",
    href: "/events",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg",
    // Bottom bar (cell y=77.3%-95.5%, full width x=22.7%-77%)
    labelInLetter: {
      className: "items-end justify-center pb-[7%] px-[8%]",
      textClass: "text-center",
    },
  },
  {
    id: "a",
    label: "RESOURCES",
    href: "/resources",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg",
    // Top crossbar above the bowl (cell y=0-19%, x=22.7%-77%)
    labelInLetter: {
      className: "items-start justify-center pt-[5%] px-[6%]",
      textClass: "text-center",
    },
  },
  {
    id: "b",
    label: "ALUMNI",
    href: "/alumni",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg",
    // Top horizontal above the bowl (cell y~8%-33%, x=22.7%-72%)
    labelInLetter: {
      className: "items-start justify-center pt-[12%] px-[10%]",
      textClass: "text-center",
    },
  },
  {
    id: "l",
    label: "NEWS",
    href: "/news",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg",
    // Bottom foot (cell y=77.3%-95.5%, x=22.7%-77%)
    labelInLetter: {
      className: "items-end justify-center pb-[7%] px-[16%]",
      textClass: "text-center",
    },
  },
  {
    id: "k",
    label: "CONTACT",
    href: "/contact",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg",
    // K's wide middle joint (cell y=22.7%-40.9%, full width)
    labelInLetter: {
      className: "items-start justify-center pt-[27%] px-[8%]",
      textClass: "text-center",
    },
  },
];

function letterMaskStyle(svgPath: string): import("react").CSSProperties {
  const url = `url("${encodeURI(svgPath)}")`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: "contain",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
  };
}

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
  const maskStyle = useMemo(() => letterMaskStyle(letter.svg), [letter.svg]);

  // Every glyph idles as solid black on the orange ground and inverts to
  // white on hover. Labels flip with it so type stays legible on either fill.
  const glyphFill = isHovered ? "bg-white" : "bg-black";
  const labelColor = isHovered ? "text-black" : "text-white";

  return (
    <Link
      href={letter.href}
      aria-label={letter.label}
      className="relative block aspect-square w-full overflow-hidden bg-homeHero touch-manipulation @container"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-0">
        <div
          className={`absolute inset-0 transition-colors duration-300 ${glyphFill}`}
          style={maskStyle}
        />

        {/* Always visible: clipped to the glyph so nav only reads inside the letter */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 box-border flex font-serif font-normal leading-tight tracking-tight transition-opacity duration-300 text-[clamp(0.45rem,4.6cqi,0.7rem)] sm:text-[clamp(0.5rem,4.4cqi,0.78rem)] md:text-[clamp(0.55rem,3.6cqi,0.85rem)] ${letter.labelInLetter.className} ${
            isHovered ? "opacity-100" : "opacity-[0.92]"
          }`}
          style={maskStyle}
        >
          <span
            className={`inline-block max-w-full min-w-0 uppercase ${letter.labelInLetter.textClass} ${labelColor}`}
          >
            {letter.label}
          </span>
        </div>
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
