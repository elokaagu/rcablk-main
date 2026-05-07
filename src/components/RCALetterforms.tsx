"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Label is anchored to a specific corner of the tile on hover instead of being
 * masked to the letter shape, matching the brand reference set where each
 * navigation label sits in a fixed quadrant of its letterform.
 */
type LabelPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const LETTERS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  svg: string;
  whiteHover: string | null;
  labelPosition: LabelPosition;
}> = [
  /** R: white Γ + yellow notch (mask); tiny serif "R" in crook — see brand mock. */
  { id: "r", label: "ABOUT", href: "/about", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg", whiteHover: null, labelPosition: "top-left" },
  { id: "c", label: "EVENTS", href: "/events", svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg", whiteHover: null, labelPosition: "bottom-center" },
  { id: "a", label: "RESOURCES", href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg", whiteHover: null, labelPosition: "top-center" },
  { id: "b", label: "ALUMNI", href: "/alumni", svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg", whiteHover: null, labelPosition: "middle-left" },
  { id: "l", label: "NEWS", href: "/news", svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg", whiteHover: null, labelPosition: "top-right" },
  { id: "k", label: "CONTACT", href: "/contact", svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg", whiteHover: null, labelPosition: "middle-center" },
];

function labelPositionStyle(position: LabelPosition): React.CSSProperties {
  // 8% inset keeps the label safely off the cell edge while still landing in
  // the corner shown in the reference tiles.
  const INSET = "8%";
  switch (position) {
    case "top-left":
      return { top: INSET, left: INSET };
    case "top-center":
      return { top: INSET, left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { top: INSET, right: INSET };
    case "middle-left":
      return { top: "50%", left: INSET, transform: "translateY(-50%)" };
    case "middle-center":
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    case "middle-right":
      return { top: "50%", right: INSET, transform: "translateY(-50%)" };
    case "bottom-left":
      return { bottom: INSET, left: INSET };
    case "bottom-center":
      return { bottom: INSET, left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
      return { bottom: INSET, right: INSET };
  }
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
        {/* Label (on hover) — anchored to the per-letter quadrant defined in
            the brand reference set rather than masked to the letter shape. */}
        {showLabel && (
          <span
            className={`pointer-events-none absolute z-20 font-serif text-sm font-normal whitespace-nowrap sm:text-base ${
              isR && isHovered ? "text-white" : "text-black"
            }`}
            style={labelPositionStyle(letter.labelPosition)}
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
