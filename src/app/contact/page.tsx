import Image from "next/image";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import { AnimateIn } from "@/components/AnimateIn";
import { ContactNewsletterForm } from "./ContactNewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

const LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";
/** Full-bleed hero — swap asset if you add a dedicated contact key visual */
const CONTACT_BG = "/assets/event-seriki.jpg";

export default function Contact() {
  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden bg-neutral-900 text-black">
      {/* Full-bleed background (visible in margins + through circular window) */}
      <div className="fixed inset-0 z-0">
        <Image
          src={CONTACT_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      <SlideOutMenu />

      <Link
        href="/"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        aria-label="RCA BLK home"
      >
        <Image src={LOGOTYPE} alt="RCA BLK" width={200} height={60} className="h-7 w-auto sm:h-9" priority />
      </Link>

      {/* Inset salmon panel with circular cutout */}
      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center p-[4.5%] sm:p-[5.5%] lg:p-[6%]">
        <main
          className="pointer-events-auto relative h-full min-h-0 w-full max-h-[min(92vh,920px)] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
          aria-label="Contact"
          style={{
            backgroundColor: "#E88350",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 48%, transparent 0%, transparent 34vmin, black 34.75vmin)",
            maskImage:
              "radial-gradient(circle at 50% 48%, transparent 0%, transparent 34vmin, black 34.75vmin)",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <AnimateIn delay={0.12} duration={0.5} y={10}>
              <div className="max-w-[min(100%,20rem)] font-mono text-sm leading-relaxed text-black sm:text-base">
                <p className="font-semibold">RCA BLK</p>
                <p>Royal College of Art</p>
                <p>Kensington Gore</p>
                <p>South Kensington</p>
                <p>London SW7 2EU</p>
                <div className="mt-4 space-y-1">
                  <p>
                    <a
                      href="mailto:rcablk@rca.ac.uk"
                      className="underline decoration-black/60 underline-offset-[0.12em] hover:opacity-80"
                    >
                      rcablk@rca.ac.uk
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://rcablk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-black/60 underline-offset-[0.12em] hover:opacity-80"
                    >
                      rcablk.com
                    </a>
                  </p>
                </div>
              </div>
            </AnimateIn>

            <div className="flex flex-col justify-end gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <ContactNewsletterForm />

              <div className="font-mono text-sm leading-relaxed text-black sm:text-right sm:text-base">
                <p>Identity: Studio Frith</p>
                <p>Web Development : Eloka Agu</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Spacer so fixed layers don’t collapse layout height */}
      <div className="relative z-0 min-h-screen" aria-hidden />
    </div>
  );
}
