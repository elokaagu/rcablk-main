"use client";

import type { CSSProperties } from "react";

const PEEK_LETTERS = [
  "/SVG Letterforms/RCA BLK–Letterforms-R.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-C.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-A.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-B.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-L.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-K.svg",
] as const;

function letterMaskStyle(svgPath: string): CSSProperties {
  const url = `url("${encodeURI(svgPath)}")`;
  return {
    backgroundColor: "#000",
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

export function MenuLetterformPeek() {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-0 flex scale-[1.35] flex-col items-center justify-center gap-3 py-8">
        {PEEK_LETTERS.map((svg) => (
          <div
            key={svg}
            className="w-[min(42vw,11rem)] shrink-0 opacity-95"
            style={{ aspectRatio: "79.37 / 124.72" }}
          >
            <span className="block size-full" style={letterMaskStyle(svg)} />
          </div>
        ))}
      </div>
    </div>
  );
}
