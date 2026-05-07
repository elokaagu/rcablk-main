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

/** Listing layout aligned with editorial reference: saturated yellow field, two-up cards, portrait art, serif date + title */
export default async function News() {
  const newsArticles = await getNewsArticles();
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
      <PageBackground color="#FFDD00" />
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={16}>
        <header className="px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-14">
          <h1 className="text-center font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl">
            News
          </h1>
        </header>
      </AnimateIn>

      <main
        className="mx-auto w-full max-w-[1500px] flex-1 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24"
        aria-label="News articles"
      >
        <AnimateStagger
          delay={0.25}
          stagger={0.06}
          className="grid grid-cols-1 gap-x-10 gap-y-14 sm:gap-x-12 sm:gap-y-20 md:grid-cols-2 lg:gap-x-16"
        >
          {newsArticles.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group block min-w-0 no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFDD00]"
            >
              <article className="flex h-full flex-col text-left">
                <BlurImage
                  src={item.image}
                  alt={item.title}
                  aspectRatio="3/4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  hoverOpacity
                  className="w-full rounded-md"
                />
                <p className="mt-5 font-serif text-sm font-normal leading-normal text-black sm:text-base">
                  {item.date}
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-black sm:text-2xl">
                  {item.title}
                </h2>
              </article>
            </Link>
          ))}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
