import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageHeader } from "@/components/PageHeader";
import { PageTitle } from "@/components/PageTitle";
import { NewsArticleGrid } from "@/components/news/NewsArticleGrid";
import { AnimateIn } from "@/components/AnimateIn";
import { getNewsArticles } from "@/lib/cms/news-repo";
import { sortNewsArticlesByCalendarDate } from "@/lib/news-sort";
import { brand } from "@/lib/brand-colors";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News | RCA BLK",
  description:
    "Latest news, announcements, and updates from RCA BLK and the Royal College of Art.",
  openGraph: {
    title: "News | RCA BLK",
    description:
      "Latest news, announcements, and updates from RCA BLK and the Royal College of Art.",
  },
};

export default async function News() {
  const newsArticles = sortNewsArticlesByCalendarDate(await getNewsArticles(), "desc");

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-brand-yellow text-black">
      <PageBackground color={brand.yellow} />
      <PageHeader />

      <AnimateIn delay={0.15} duration={0.55} y={14}>
        <header className="px-6 pb-8 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-12 lg:px-14">
          <PageTitle>News</PageTitle>
          <p className="mx-auto mt-4 max-w-md font-serif text-sm leading-[1.35] tracking-brand text-black/75 sm:text-base">
            Announcements, exhibitions, residencies and updates from RCA BLK.
          </p>
        </header>
      </AnimateIn>

      <main
        className="mx-auto w-full max-w-[1500px] flex-1 px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24"
        aria-label="News articles"
      >
        {newsArticles.length > 0 ? (
          <NewsArticleGrid articles={newsArticles} />
        ) : (
          <p className="text-center font-serif text-base italic tracking-brand text-black/70">
            No news articles are currently published.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
