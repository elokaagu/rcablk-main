import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getNewsArticles } from "@/lib/cms/news-repo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News | RCA BLK",
  description: "Latest news, announcements, and updates from RCA BLK and the Royal College of Art.",
  openGraph: { title: "News | RCA BLK" },
};

/**
 * Cycle of aspect ratios applied to news cards in source order so the
 * masonry grid feels pinned and editorial rather than a uniform grid.
 * Mostly portrait (Pinterest density) with the occasional square or
 * landscape to break the rhythm. Constrained to BlurImage's allowed
 * aspect ratios.
 */
const CARD_ASPECTS = ["3/4", "4/5", "1/1", "3/4", "4/3", "4/5"] as const;

export default async function News() {
  const newsArticles = await getNewsArticles();
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
      <PageBackground color="#FFDD00" />
      <SlideOutMenu />

      <AnimateIn delay={0.15} duration={0.55} y={14}>
        <header className="px-6 pt-12 pb-6 text-center sm:px-10 sm:pt-14 sm:pb-8 lg:px-14">
          <h1 className="font-serif text-[2.25rem] font-normal leading-[1.05] tracking-tight text-black sm:text-[2.75rem]">
            News
          </h1>
          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-black/70 sm:text-[0.95rem]">
            Announcements, exhibitions, residencies and updates from RCA BLK.
          </p>
        </header>
      </AnimateIn>

      <main
        className="mx-auto w-full max-w-[1500px] flex-1 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24"
        aria-label="News articles"
      >
        {/*
          Pinterest-style masonry: native CSS columns + `break-inside-avoid`
          on each card. No JS layout library required; columns reflow on
          resize and respect the cards' natural heights driven by the
          `CARD_ASPECTS` cycle above.
        */}
        <AnimateStagger
          delay={0.2}
          stagger={0.05}
          duration={0.85}
          y={18}
          className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 lg:gap-5 xl:columns-5"
        >
          {newsArticles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group mb-3 block break-inside-avoid no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFDD00] sm:mb-4 lg:mb-5"
            >
              <article className="overflow-hidden rounded-lg bg-white shadow-[0_1px_24px_-18px_rgba(0,0,0,0.20)] transition-shadow duration-500 ease-out group-hover:shadow-[0_12px_36px_-14px_rgba(0,0,0,0.32)]">
                <div className="relative overflow-hidden">
                  <BlurImage
                    src={item.image}
                    alt={item.title}
                    aspectRatio={CARD_ASPECTS[i % CARD_ASPECTS.length]}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    imgClassName="group-hover:scale-[1.04]"
                    className="w-full"
                  />
                  {/* Subtle dim on hover so the card feels like a "pin" being highlighted */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.06]"
                  />
                </div>

                <div className="px-3 py-3 sm:px-3.5 sm:py-3.5">
                  {item.category && (
                    <p className="font-serif text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                      {item.category}
                    </p>
                  )}
                  <h2 className="mt-1.5 font-serif text-[0.95rem] font-medium leading-snug text-black sm:text-[1rem]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 font-serif text-[0.75rem] text-black/55">
                    {item.date}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
