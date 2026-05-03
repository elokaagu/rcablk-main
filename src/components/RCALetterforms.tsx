"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const LETTERS = [
  /** R: white Γ + yellow notch (mask); tiny serif “R” in crook — see brand mock. */
  { id: "r", label: "RESOURCES", href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", whiteHover: null },
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
      <div className="absolute inset-0 flex items-center justify-center p-0 overflow-hidden">
        {/* Label (on hover) - masked to letter shape */}
        {showLabel && (
          <span
            className={`absolute inset-0 z-10 flex items-center justify-center font-serif text-sm font-bold text-center whitespace-nowrap sm:text-base ${
              isR && isHovered ? "text-white" : "text-black"
            }`}
            style={{
              ...maskStyle,
              transform: "scale(0.5)",
            }}
          >
            {letter.label}
          </span>
        )}
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
