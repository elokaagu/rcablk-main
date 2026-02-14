import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | RCA BLK",
  description: "Support RCA BLK. Help sustain our exhibitions, events, residencies, and artist programmes.",
  openGraph: { title: "Support | RCA BLK" },
};

export default function Support() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0 relative"
      style={{ backgroundColor: "#E88350" }}
    >
      <SlideOutMenu />

      <AnimateIn delay={0.1} duration={0.5} y={16}>
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>
      </AnimateIn>

      {/* Yellow L-shape graphic - decorative overlay behind title and content */}
      <div
        className="absolute top-24 sm:top-28 left-0 right-0 h-[45vh] min-h-[350px] max-h-[550px] pointer-events-none flex justify-center"
        aria-hidden
      >
        <svg
          viewBox="0 0 350 500"
          className="h-full w-auto max-w-[75%] ml-[5%] sm:ml-[15%]"
          preserveAspectRatio="xMinYMin meet"
        >
          <path
            d="M 0 0 L 100 0 L 100 420 L 350 420 L 350 500 L 0 500 Z"
            fill="#FFD700"
          />
        </svg>
      </div>

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Support</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full relative z-10">
        <AnimateStagger delay={0.3} stagger={0.1} className="space-y-6 text-foreground text-lg sm:text-xl leading-relaxed font-serif text-left">
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
            particular project, please contact us.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 px-6 py-3 font-display font-medium text-background bg-secondary hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Contact us
          </Link>
          <ul className="space-y-2 list-none p-0 mt-8">
            <li>
              <Link href="/contact" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                Contact RCA BLK
              </Link>
            </li>
            <li>
              <a href="mailto:rcablk@rca.ac.uk" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                rcablk@rca.ac.uk
              </a>
            </li>
            <li>
              <a href="https://www.rca.ac.uk/generationrca/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                GenerationRCA (Support the RCA)
              </a>
            </li>
          </ul>
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
