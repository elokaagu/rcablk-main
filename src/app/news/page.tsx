import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import Link from "next/link";
import { ListingCardMedia } from "@/components/ListingCardMedia";
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
 * masonry feels pinned and editorial rather than a uniform grid. Now that
 * cards run three-up on desktop the cards are bigger, so we lean into
 * portrait formats with one square / landscape to break the rhythm.
 * Constrained to BlurImage's allowed aspect ratios.
 */
const CARD_ASPECTS = ["3/4", "4/5", "1/1", "3/4", "4/5", "4/3"] as const;

export default async function News() {
  const newsArticles = await getNewsArticles();
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
      <PageBackground color="#FFDD00" />
      <SlideOutMenu />

      <AnimateIn delay={0.15} duration={0.55} y={14}>
        <header
          className="px-5 pb-6 pt-12 text-center sm:px-10 sm:pt-14 sm:pb-8 lg:px-14"
          style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 2.5rem))" }}
        >
          <h1 className="font-serif text-[1.85rem] font-normal leading-[1.05] tracking-tight text-black sm:text-[2.25rem] md:text-[2.75rem]">
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
          Row-major grid so chronological order reads left-to-right, then down
          (CSS columns fill top-to-bottom per column and break date order).
        */}
        <AnimateStagger
          delay={0.2}
          stagger={0.05}
          duration={0.85}
          y={18}
          className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {newsArticles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group block min-w-0 no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFDD00]"
            >
              {/*
                Edge-to-edge image card: the photograph IS the card. Title /
                category / date live as a gradient-anchored caption at the
                bottom so nothing sits in a white panel below the image.
              */}
              <article className="relative overflow-hidden rounded-lg bg-black/5 shadow-[0_1px_24px_-18px_rgba(0,0,0,0.20)] transition-shadow duration-500 ease-out group-hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.40)]">
                <ListingCardMedia
                  src={item.image}
                  alt={item.title}
                  aspectRatio={CARD_ASPECTS[i % CARD_ASPECTS.length]}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  imgClassName="group-hover:scale-[1.04]"
                  className="w-full"
                />

                {/* Bottom-up readability gradient so the caption reads on any image */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent"
                />

                {/* Subtle dim on hover so the card feels like a 'pin' being highlighted */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.08]"
                />

                <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
                  {item.category && (
                    <p className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[0.75rem]">
                      {item.category}
                    </p>
                  )}
                  <h2 className="mt-1.5 font-serif text-[1.05rem] font-medium leading-snug text-white sm:text-[1.15rem] lg:text-[1.2rem]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 font-serif text-[0.78rem] text-white/75 sm:text-[0.82rem]">
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
