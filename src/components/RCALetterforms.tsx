"use client";

import { useState, useRef, useLayoutEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

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
  whiteHover: string | null;
  labelInLetter: LabelInLetterAlign;
}> = [
  {
    id: "r",
    label: "ABOUT",
    href: "/about",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg",
    whiteHover: null,
    labelInLetter: {
      className: "items-start justify-start pt-[5%] pl-[6%] sm:pt-[6%] sm:pl-[7%]",
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
      className: "items-end justify-center pb-[6%] sm:pb-[7%]",
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
      className: "items-start justify-center pt-[6%] sm:pt-[7%]",
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
      className: "items-center justify-start pl-[6%] sm:pl-[7%]",
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
      className: "items-start justify-end pr-[6%] pt-[5%] sm:pr-[7%] sm:pt-[6%]",
      textClass: "text-right",
    },
  },
  {
    id: "k",
    label: "CONTACT",
    href: "/contact",
    svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg",
    whiteHover: null,
    // Sit the label on the K's top horizontal arm (upper half) — centred
    // along the bar so the SVG mask clips the type cleanly within the
    // glyph rather than over the orange ground.
    labelInLetter: {
      className: "items-start justify-center pt-[11%] sm:pt-[13%]",
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
  const imgSrc = isHovered && letter.whiteHover ? letter.whiteHover : letter.svg;
  const invertOnHover = isHovered && !letter.whiteHover;
  const isC = letter.id === "c";
  const isR = letter.id === "r";

  const maskStyle = useMemo(() => letterMaskStyle(letter.svg), [letter.svg]);

  /** Idle vs hover label colour so type stays legible on both fills. */
  const labelColor =
    isR && isHovered
      ? "text-white"
      : isR && !isHovered
        ? "text-black"
        : isC && !isHovered
          ? "text-white"
          : isC && isHovered
            ? "text-black"
            : !isHovered
              ? "text-white"
              : "text-black";

  return (
    <Link
      href={letter.href}
      aria-label={letter.label}
      className="relative block aspect-square w-full overflow-hidden bg-homeHero touch-manipulation"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-0">
        {isR ? (
          <div
            className={`absolute inset-0 transition-colors duration-300 ${isHovered ? "bg-black" : "bg-white"}`}
            style={maskStyle}
          />
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
            className={`object-contain transition-all duration-300 ${
              invertOnHover ? "brightness-0 invert" : ""
            }`}
          />
        )}

        {/* Always visible: clipped to letter so nav only reads inside the glyph */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 flex font-serif text-[0.78rem] font-normal leading-tight tracking-tight transition-opacity duration-300 sm:text-[1.05rem] ${letter.labelInLetter.className} ${
            isHovered ? "opacity-100" : "opacity-[0.92]"
          }`}
          style={maskStyle}
        >
          <span
            className={`inline-block max-w-[94%] uppercase ${letter.labelInLetter.textClass} ${labelColor}`}
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
