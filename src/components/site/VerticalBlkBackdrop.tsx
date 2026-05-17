import type { CSSProperties } from "react";
import Image from "next/image";

const LETTER_SVGS = [
  "/SVG Letterforms/RCA BLK–Letterforms-B.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-L.svg",
  "/SVG Letterforms/RCA BLK–Letterforms-K.svg",
] as const;

/** Glyph viewBox from brand SVGs (79.37 × 124.72). */
const GLYPH_ASPECT = 79.37 / 124.72;

function letterMaskStyle(svgPath: string): CSSProperties {
  const url = `url("${encodeURI(svgPath)}")`;
  return {
    backgroundColor: "currentColor",
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

type VerticalBlkBackdropProps = {
  /** Tint for stacked SVG letterforms (Support). */
  letterColor?: string;
  /** Brand BLK lockup image — used on Resources (pre-coloured artwork). */
  letterformImage?: string;
};

function StackedLetterforms({ letterColor }: { letterColor: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 py-20 sm:gap-12 sm:py-24 md:gap-14 md:py-28 lg:gap-16">
      {LETTER_SVGS.map((svg) => (
        <div
          key={svg}
          className="w-[min(22vw,6.75rem)] shrink-0 sm:w-[min(18vw,7.75rem)] md:w-[min(15vw,8.75rem)]"
          style={{ aspectRatio: GLYPH_ASPECT }}
        >
          <div className="size-full opacity-[0.92]" style={letterMaskStyle(svg)} />
        </div>
      ))}
    </div>
  );
}

function BlkLetterformArtwork({ src }: { src: string }) {
  return (
    <div className="flex h-full items-center justify-center py-16 sm:py-20 md:py-24">
      <Image
        src={src}
        alt=""
        width={30}
        height={150}
        priority={false}
        className="h-[min(72dvh,26rem)] w-auto opacity-[0.92]"
        sizes="(max-width: 768px) 20vw, 120px"
        aria-hidden
      />
    </div>
  );
}

/**
 * Vertical BLK behind scrolling copy (Support, Resources).
 * Render inside a sticky `h-[100dvh]` wrapper so it scrolls away before the footer.
 */
export function VerticalBlkBackdrop({ letterColor, letterformImage }: VerticalBlkBackdropProps) {
  return (
    <div
      className="pointer-events-none relative flex h-full w-full justify-center overflow-hidden"
      style={{ color: letterColor }}
      aria-hidden
    >
      {letterformImage ? (
        <BlkLetterformArtwork src={letterformImage} />
      ) : (
        <StackedLetterforms letterColor={letterColor ?? "#FFDD00"} />
      )}
    </div>
  );
}
