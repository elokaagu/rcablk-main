import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageLogotype } from "@/components/PageLogotype";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { AnimateIn } from "@/components/AnimateIn";
import { NewsListingClient } from "@/components/listing/NewsListingClient";
import { getNewsArticles } from "@/lib/cms/news-repo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News | RCA BLK",
  description: "Latest news, announcements, and updates from RCA BLK and the Royal College of Art.",
  openGraph: { title: "News | RCA BLK" },
};

export default async function News() {
  const newsArticles = await getNewsArticles();
  return (
    <div className="flex min-h-screen-safe min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
      <PageBackground color="#FFDD00" />
      <SlideOutMenu />
      <PageLogotype src={BRAND_LOGOTYPES.forest} />

      <AnimateIn delay={0.15} duration={0.55} y={14}>
        <header className="px-page-safe pb-6 pt-page-chrome text-center sm:px-10 sm:pb-8 sm:pt-14 lg:px-14">
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
        <NewsListingClient articles={newsArticles} />
      </main>

      <Footer />
    </div>
  );
}
