import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { newsArticles } from "@/data/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | RCA BLK",
  description: "Latest news, announcements, and updates from RCA BLK and the Royal College of Art.",
  openGraph: { title: "News | RCA BLK" },
};

export default function News() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0"
      style={{ backgroundColor: "#FFD700" }}
    >
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-foreground tracking-wide">News</h2>
        </div>
      </AnimateIn>

      {/* News Grid - 2-column with white borders */}
      <main className="flex-1 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full pb-12 sm:pb-16 pt-4" aria-label="News articles">
        <AnimateStagger delay={0.3} stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-10 sm:gap-y-16">
          {newsArticles.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group no-underline block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              <article className="flex flex-col h-full">
                <div className="relative overflow-hidden">
                  <BlurImage
                    src={item.image}
                    alt={item.title}
                    aspectRatio="4/5"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    hoverOpacity
                  />
                </div>
                <p className="mt-3 text-sm text-foreground">{item.date}</p>
                <h3 className="mt-1 text-xl font-serif font-bold text-foreground">
                  {item.title}
                </h3>
              </article>
            </Link>
          ))}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
