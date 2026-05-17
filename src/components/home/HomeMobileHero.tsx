"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

const RCA_ROW = [
  { href: "/about", svg: "/SVG Letterforms/RCA BLK–Letterforms-R.svg" },
  { href: "/events", svg: "/SVG Letterforms/RCA BLK–Letterforms-C.svg" },
  { href: "/resources", svg: "/SVG Letterforms/RCA BLK–Letterforms-A.svg" },
] as const;

const BLK_ROW = [
  { href: "/alumni", svg: "/SVG Letterforms/RCA BLK–Letterforms-B.svg" },
  { href: "/news", svg: "/SVG Letterforms/RCA BLK–Letterforms-L.svg" },
  { href: "/contact", svg: "/SVG Letterforms/RCA BLK–Letterforms-K.svg" },
] as const;

/** Reference mobile home: Events, Resources, About, Support, Contact between letter rows. */
const MOBILE_NAV = [
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
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

function LetterRow({ letters }: { letters: ReadonlyArray<{ href: string; svg: string }> }) {
  return (
    <div className="grid w-full grid-cols-3 gap-0 px-1">
      {letters.map((letter) => (
        <Link
          key={letter.svg}
          href={letter.href}
          className="relative block w-full touch-manipulation"
          style={{ aspectRatio: "79.37 / 124.72" }}
          aria-hidden
        >
          <span className="absolute inset-0" style={letterMaskStyle(letter.svg)} />
        </Link>
      ))}
    </div>
  );
}

/** Mobile homepage — large RCA / BLK rows with centred serif nav (reference layout). */
export function HomeMobileHero() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col justify-between px-3 pb-4 lg:hidden"
      style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 2.5rem))" }}
    >
      <LetterRow letters={RCA_ROW} />

      <nav
        className="flex flex-col items-center justify-center gap-0.5 py-6"
        aria-label="Main navigation"
      >
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="min-h-[44px] touch-manipulation px-4 py-2 font-serif text-lg text-black transition-opacity hover:opacity-70"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <LetterRow letters={BLK_ROW} />
    </div>
  );
}
