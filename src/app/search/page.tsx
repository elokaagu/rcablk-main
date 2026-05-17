import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { AnimateIn } from "@/components/AnimateIn";
import { SiteSearchPageClient } from "@/components/search/SiteSearchPageClient";
import { getNewsArticles } from "@/lib/cms/news-repo";
import { getEvents } from "@/lib/cms/events-repo";
import { buildSiteSearchIndex } from "@/lib/site-search-index";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search | RCA BLK",
  description: "Search news articles and events from RCA BLK.",
  openGraph: { title: "Search | RCA BLK" },
};

export default async function SearchPage() {
  const [news, events] = await Promise.all([getNewsArticles(), getEvents()]);
  const index = buildSiteSearchIndex(news, events);

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#E8E4DC] text-black">
      <PageBackground color="#E8E4DC" />
      <SlideOutMenu />

      <AnimateIn delay={0.15} duration={0.55} y={14}>
        <header
          className="px-5 pb-6 pt-12 text-center sm:px-10 sm:pt-14 sm:pb-8 lg:px-14"
          style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 2.5rem))" }}
        >
          <h1 className="font-serif text-[1.85rem] font-normal leading-[1.05] tracking-tight text-black sm:text-[2.25rem] md:text-[2.75rem]">
            Search
          </h1>
          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-black/70 sm:text-[0.95rem]">
            Find news articles and events across the RCA BLK site.
          </p>
        </header>
      </AnimateIn>

      <main
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24"
        aria-label="Search results"
      >
        <Suspense fallback={<p className="font-serif text-sm text-black/60">Loading search…</p>}>
          <SiteSearchPageClient index={index} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
