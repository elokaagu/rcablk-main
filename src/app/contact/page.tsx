import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SlideOutMenu from "@/components/SlideOutMenu";
import PageBackground from "@/components/PageBackground";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { PageLogotype } from "@/components/PageLogotype";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { ContactNewsletterForm } from "./ContactNewsletterForm";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

// Reference-matched coral. Slightly redder than the Support coral (#F3916B)
// so Contact has its own identity within the brand colour family.
const CONTACT_BG = "#DC5C4A";

const HERO_IMAGE = "/assets/contact-anthea-hamilton.jpg";
const HERO_ALT =
  "Installation view with oversized pumpkin sculptures and a performer in a white gourd headpiece";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function AddressBlock() {
  return (
    <address className="not-italic">
      <p className="font-serif text-[1.05rem] leading-[1.55] text-black sm:text-[1.1rem]">
        RCA BLK
        <br />
        Royal College of Art
        <br />
        Kensington Gore
        <br />
        South Kensington
        <br />
        London SW7 2EU
      </p>
      <div className="mt-7 flex flex-col gap-1.5 font-serif text-[1.05rem] leading-tight text-black sm:text-[1.1rem]">
        <a
          href="mailto:rcablk@rca.ac.uk"
          className="group/lnk inline-flex w-fit items-center gap-1.5"
        >
          <span className="border-b border-black pb-0.5 transition-opacity group-hover/lnk:opacity-70">
            rcablk@rca.ac.uk
          </span>
        </a>
        <a
          href="https://rcablk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group/lnk inline-flex w-fit items-center gap-1.5"
        >
          <span className="border-b border-black pb-0.5 transition-opacity group-hover/lnk:opacity-70">
            rcablk.com
          </span>
        </a>
      </div>
    </address>
  );
}

function CircularHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-full ${className}`}>
      <BlurImage
        src={HERO_IMAGE}
        alt={HERO_ALT}
        aspectRatio="1/1"
        sizes="(max-width: 1024px) 80vmin, 60vmin"
        priority
        imgClassName="object-cover object-[center_42%]"
      />
    </div>
  );
}

function CreditLine({
  label,
  children,
  alignEnd,
}: {
  label: string;
  children: ReactNode;
  alignEnd?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 font-serif text-[0.98rem] leading-snug text-black sm:text-[1.02rem]",
        alignEnd && "justify-end",
      )}
    >
      <span className="font-display text-[0.58rem] font-black uppercase tracking-[0.2em] text-black/45">
        {label}
      </span>
      <span className="text-black/90">{children}</span>
    </p>
  );
}

function Credits({ className = "" }: { className?: string }) {
  const alignEnd = className.includes("text-right");

  return (
    <aside
      className={cn(
        "max-w-[16rem] border-t border-black/15 pt-4 sm:max-w-[18rem] sm:pt-5",
        className,
      )}
      aria-label="Site credits"
    >
      <p
        className={cn(
          "mb-3 font-display text-[0.55rem] font-black uppercase tracking-[0.22em] text-black/40",
          alignEnd && "text-right",
        )}
      >
        Credits
      </p>
      <div className={cn("flex flex-col gap-2.5", alignEnd && "items-end")}>
        <CreditLine label="Identity" alignEnd={alignEnd}>
          Studio Frith
        </CreditLine>
        <CreditLine label="Web" alignEnd={alignEnd}>
          <a
            href="https://www.satellitelabs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm px-1.5 py-0.5 -mx-1.5 underline decoration-black/30 underline-offset-[3px] transition-[color,background-color,text-decoration-color] duration-200 hover:bg-black/12 hover:text-black hover:decoration-black/70"
          >
            Satellite Labs
          </a>
        </CreditLine>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Contact() {
  return (
    <div
      className="relative min-h-screen-safe w-full overflow-x-clip text-black"
      style={{ backgroundColor: CONTACT_BG }}
    >
      <PageBackground color={CONTACT_BG} />
      <SlideOutMenu />
      <PageLogotype src={BRAND_LOGOTYPES.white} />

      {/* ----------------------------------------------------------- */}
      {/* Mobile / tablet — vertical stack                            */}
      {/* ----------------------------------------------------------- */}
      <div
        className="flex min-h-screen-safe flex-col gap-10 px-page-safe pb-16 pt-page-chrome sm:gap-14 sm:pb-20 lg:hidden"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
      >
        <AnimateIn delay={0.05} duration={0.7} y={10}>
          <AddressBlock />
        </AnimateIn>

        <AnimateIn delay={0.18} duration={0.85} y={14} className="self-center">
          <div className="w-[min(82vmin,28rem)]">
            <CircularHero />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.26} duration={0.7} y={10}>
          <ContactNewsletterForm />
        </AnimateIn>

        <AnimateIn delay={0.32} duration={0.7} y={10}>
          <Credits />
        </AnimateIn>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Desktop — corner-anchored layout matching the reference      */}
      {/* ----------------------------------------------------------- */}
      <div className="relative hidden min-h-screen lg:block">
        {/* Top-left: address (wordmark is fixed via PageLogotype) */}
        <div
          className="absolute left-12 max-w-[22rem] xl:left-16"
          style={{ top: "max(5.5rem, calc(env(safe-area-inset-top) + 3.5rem))" }}
        >
          <AnimateIn delay={0.06} duration={0.75} y={10}>
            <AddressBlock />
          </AnimateIn>
        </div>

        {/* Centre — large circular hero. The wrapper is pointer-events-none so
            the corner content beneath the visual circle stays interactive. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-12 py-20">
          <AnimateIn delay={0.18} duration={0.95} y={20} className="pointer-events-auto">
            <div className="aspect-square w-[min(58vmin,560px)]">
              <CircularHero />
            </div>
          </AnimateIn>
        </div>

        {/* Bottom-left: newsletter */}
        <AnimateIn
          delay={0.28}
          duration={0.75}
          y={10}
          className="absolute bottom-12 left-12 xl:bottom-16 xl:left-16"
        >
          <ContactNewsletterForm />
        </AnimateIn>

        {/* Bottom-right: credits */}
        <AnimateIn
          delay={0.32}
          duration={0.75}
          y={10}
          className="absolute bottom-12 right-12 xl:bottom-16 xl:right-16"
        >
          <Credits className="items-end text-right" />
        </AnimateIn>
      </div>
    </div>
  );
}
