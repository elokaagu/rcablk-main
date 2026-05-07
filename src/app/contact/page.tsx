import Image from "next/image";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { ContactNewsletterForm } from "./ContactNewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

const LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";
const CONTACT_IMAGE = "/assets/event-seriki.jpg";

/**
 * Small reusable label that shows a 1ch hairline followed by a letterspaced
 * uppercase eyebrow. Used to break the page into editorial sections without
 * adding visual weight.
 */
function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-6 bg-black/30" />
      <span className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/55">
        {children}
      </span>
    </div>
  );
}

/**
 * Inline link with an underline that draws in from the left on hover and a
 * small chevron that nudges right. Subtle but distinctly premium feel.
 */
function ContactLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex w-fit items-center gap-2 font-serif text-lg leading-tight text-black sm:text-xl"
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-black/35 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-0"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100"
        />
      </span>
      <span
        aria-hidden
        className="translate-x-0 text-base text-black/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-black"
      >
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}

export default function Contact() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white text-black">
      <SlideOutMenu />

      <Link
        href="/"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        aria-label="RCA BLK home"
      >
        <Image src={LOGOTYPE} alt="RCA BLK" width={200} height={60} className="h-7 w-auto sm:h-9" priority />
      </Link>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 pb-16 pt-[max(5.5rem,env(safe-area-inset-top))] sm:gap-14 sm:px-10 sm:pb-20 sm:pt-28 lg:flex-row lg:items-start lg:gap-20 lg:px-12">
        <div className="flex min-w-0 flex-1 flex-col gap-12 lg:max-w-xl">
          <AnimateIn delay={0.06} duration={0.7} y={8}>
            <div className="flex flex-col gap-3">
              <SectionEyebrow>Get in touch</SectionEyebrow>
              <h1 className="font-serif text-[2.5rem] font-normal leading-[1.05] tracking-[-0.015em] sm:text-[3.25rem]">
                Contact
              </h1>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.12} duration={0.7} y={8}>
            <address className="not-italic">
              <SectionEyebrow>Address</SectionEyebrow>
              <p className="mt-4 font-serif text-lg font-semibold leading-relaxed sm:text-xl">RCA BLK</p>
              <p className="mt-1 font-serif text-lg leading-relaxed text-black/80 sm:text-xl">
                Royal College of Art
                <br />
                Kensington Gore
                <br />
                South Kensington
                <br />
                London SW7 2EU
              </p>

              <div className="mt-7 flex flex-col gap-3.5">
                <ContactLink href="mailto:rcablk@rca.ac.uk">rcablk@rca.ac.uk</ContactLink>
                <ContactLink href="https://rcablk.com" external>
                  rcablk.com
                </ContactLink>
              </div>
            </address>
          </AnimateIn>

          <AnimateIn delay={0.18} duration={0.7} y={8}>
            <ContactNewsletterForm />
          </AnimateIn>

          <AnimateIn delay={0.24} duration={0.7} y={8}>
            <div className="mt-2 border-t border-black/10 pt-8">
              <SectionEyebrow>Credits</SectionEyebrow>
              <dl className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3 font-serif text-sm sm:grid-cols-2 sm:text-base">
                <div className="flex flex-col">
                  <dt className="text-black/45">Identity</dt>
                  <dd className="mt-0.5 text-black/85">Studio Frith</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-black/45">Web development</dt>
                  <dd className="mt-0.5 text-black/85">Eloka Agu</dd>
                </div>
              </dl>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn
          delay={0.16}
          duration={0.85}
          y={14}
          className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[min(42vw,460px)]"
        >
          <figure className="group/img mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-md shadow-[0_18px_48px_-24px_rgba(0,0,0,0.32),0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-1 ring-inset ring-black/[0.06]">
              <BlurImage
                src={CONTACT_IMAGE}
                alt="Studio ceramics and vessels"
                aspectRatio="3/4"
                sizes="(max-width: 1024px) 100vw, 460px"
              />
              {/* Subtle inner top-light to give the image a curated, gallery feel */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 opacity-0 transition-opacity duration-700 group-hover/img:opacity-100"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-3 font-display text-[0.6rem] font-black uppercase tracking-[0.22em] text-black/55">
              <span>Studio ceramics</span>
              <span aria-hidden className="h-px flex-1 bg-black/15" />
              <span className="text-black/40">RCA BLK</span>
            </figcaption>
          </figure>
        </AnimateIn>
      </main>

      <Footer />
    </div>
  );
}
