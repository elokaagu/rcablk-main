import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DesignCredits } from "@/components/DesignCredits";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { ContactNewsletterForm } from "./ContactNewsletterForm";
import { brand } from "@/lib/brand-colors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

const CONTACT_BG = brand.coral;

const HERO_IMAGE = "/assets/event-seriki.jpg";
const HERO_ALT = "RCA BLK event photography at an exhibition opening";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="RCA BLK home"
      className="font-display text-[1.6rem] font-black uppercase leading-none tracking-[0.04em] text-black sm:text-[1.85rem]"
    >
      RCA BLK
    </Link>
  );
}

function AddressBlock() {
  return (
    <address className="not-italic">
      <p className="font-serif text-[1.05rem] leading-[1.35] tracking-brand text-black sm:text-[1.1rem]">
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
          <span className="link-offset-underline transition-opacity group-hover/lnk:opacity-70">
            rcablk@rca.ac.uk
          </span>
        </a>
        <a
          href="https://rcablk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group/lnk inline-flex w-fit items-center gap-1.5"
        >
          <span className="link-offset-underline transition-opacity group-hover/lnk:opacity-70">
            rcablk.com
          </span>
        </a>
      </div>
    </address>
  );
}

function CircularHero({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-full ${className}`}
    >
      <BlurImage
        src={HERO_IMAGE}
        alt={HERO_ALT}
        aspectRatio="1/1"
        sizes="(max-width: 1024px) 80vmin, 60vmin"
        priority={priority}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Contact() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden text-black"
      style={{ backgroundColor: CONTACT_BG }}
    >
      <h1 className="sr-only">Contact RCA BLK</h1>

      <PageHeader />

      <div className="flex min-h-screen flex-col gap-10 px-5 pb-16 safe-bottom-padding sm:gap-14 sm:px-10 sm:pb-20 lg:hidden">
        <AnimateIn delay={0.05} duration={0.7} y={10}>
          <div className="flex flex-col gap-8">
            <Wordmark />
            <AddressBlock />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.18} duration={0.85} y={14} className="self-center">
          <div className="w-[min(82vmin,28rem)]">
            <CircularHero priority />
          </div>
        </AnimateIn>

        <AnimateIn delay={0.26} duration={0.7} y={10}>
          <ContactNewsletterForm />
        </AnimateIn>

        <AnimateIn delay={0.32} duration={0.7} y={10}>
          <DesignCredits />
        </AnimateIn>
      </div>

      <div className="relative hidden min-h-screen lg:block">
        <AnimateIn
          delay={0.06}
          duration={0.75}
          y={10}
          className="absolute left-12 top-12 max-w-[22rem] xl:left-16 xl:top-16"
        >
          <div className="flex flex-col gap-7">
            <Wordmark />
            <AddressBlock />
          </div>
        </AnimateIn>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-12 py-20">
          <AnimateIn delay={0.18} duration={0.95} y={20} className="pointer-events-auto">
            <div className="aspect-square w-[min(58vmin,560px)]">
              <CircularHero />
            </div>
          </AnimateIn>
        </div>

        <AnimateIn
          delay={0.28}
          duration={0.75}
          y={10}
          className="absolute bottom-12 left-12 xl:bottom-16 xl:left-16"
        >
          <ContactNewsletterForm />
        </AnimateIn>

        <AnimateIn
          delay={0.32}
          duration={0.75}
          y={10}
          className="absolute bottom-12 right-12 xl:bottom-16 xl:right-16"
        >
          <DesignCredits className="items-end text-right" />
        </AnimateIn>
      </div>
    </div>
  );
}
