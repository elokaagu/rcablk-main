import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | RCA BLK",
  description: "Support RCA BLK. Help sustain our exhibitions, events, residencies, and artist programmes.",
  openGraph: { title: "Support | RCA BLK" },
};

const LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

export default function Support() {
  return (
    <div
      className="relative flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden text-black"
      style={{ backgroundColor: "#F3916B" }}
    >
      <SlideOutMenu />

      <Link
        href="/"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        aria-label="RCA BLK home"
      >
        <Image src={LOGOTYPE} alt="RCA BLK" width={200} height={60} className="h-7 w-auto sm:h-9" priority />
      </Link>

      {/* Large vertical yellow BLK — behind copy, in front of peach */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div
          className="flex select-none flex-col items-center justify-center font-display font-black leading-[0.82] text-[#FFDD00] opacity-[0.92]"
          style={{
            fontSize: "min(28vw, 14rem)",
            textShadow: "0 0.02em 0 rgba(0,0,0,0.06)",
          }}
        >
          <span className="block">B</span>
          <span className="block">L</span>
          <span className="block">K</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:px-12">
        <AnimateIn delay={0.15} duration={0.55} y={12}>
          <header className="mb-10 text-center sm:mb-12">
            <h1 className="font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl">Support</h1>
          </header>
        </AnimateIn>

        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center pb-8 sm:max-w-[34rem] sm:pb-12">
          <AnimateStagger
            delay={0.2}
            stagger={0.08}
            className="space-y-7 text-center font-serif text-lg leading-relaxed text-black sm:space-y-8 sm:text-xl sm:leading-relaxed"
          >
            <p>
              RCA BLK&apos;s supporters play a vital role in sustaining our key activities, from the
              commissioning of major new exhibitions and events, and the development of our pioneering
              participatory, learning and offsite programmes, to the provision of much-needed
              residencies and affordable onsite studios for artists.
            </p>
            <p>
              By supporting RCA BLK you will directly contribute to the sustainability, ambition and
              future development of one of London&apos;s leading independent arts organisations.
            </p>
            <p>
              We develop a close and reciprocal relationship with all of our Supporters, giving you the
              opportunity to enjoy a tailored package of benefits whilst enabling RCA BLK to flourish
              and increase the amount of support and opportunities we offer to artists, audiences and
              our community.
            </p>
            <p>
              To learn more about joining RCA BLK&apos;s Supporters&apos; Scheme or to discuss a
              particular project, please{" "}
              <Link href="/contact" className="underline decoration-black/50 underline-offset-[0.15em] hover:opacity-80">
                contact us
              </Link>
              .
            </p>
          </AnimateStagger>
        </main>
      </div>

      <Footer />
    </div>
  );
}
