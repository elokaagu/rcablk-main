import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Logo } from "@/components/Logo";
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
      style={{ backgroundColor: "hsl(18, 70%, 65%)" }}
    >
      <SlideOutMenu />

      <AnimateIn delay={0.1} duration={0.5} y={16}>
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">News</h2>
        </div>
      </AnimateIn>

      {/* Intro */}
      <AnimateIn delay={0.25} duration={0.6} y={16}>
        <p className="max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 text-center text-foreground text-lg sm:text-xl leading-relaxed">
          Latest announcements, exhibitions, and updates from RCA BLK and the Royal College of Art community.
        </p>
      </AnimateIn>

      {/* News Grid - staggered 2-column */}
      <main className="flex-1 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full pb-12 sm:pb-16 pt-8 sm:pt-12" aria-label="News articles">
        <AnimateStagger delay={0.3} stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-10 sm:gap-y-16">
          {newsArticles.map((item, i) => {
            const firstPara = item.body[0] ?? "";
            const excerpt = firstPara.length > 80 ? firstPara.slice(0, 80) + "…" : firstPara;
            return (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className={`group no-underline block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-sm ${i % 2 === 1 ? "md:mt-24" : ""}`}
              >
                <article className="flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]">
                    <BlurImage
                      src={item.image}
                      alt={item.title}
                      aspectRatio="4/5"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      hoverOpacity
                    />
                  </div>
                  <p className="mt-3 text-sm text-foreground/80 uppercase tracking-wide">{item.category}</p>
                  <h3 className="mt-1 text-xl font-display font-normal text-foreground uppercase tracking-wide group-hover:underline">
                    {item.title}
                  </h3>
                  {excerpt && (
                    <p className="mt-2 text-base text-foreground/90 line-clamp-2 leading-relaxed">{excerpt}</p>
                  )}
                  <p className="mt-3 text-sm text-foreground/70">{item.date}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more →
                  </span>
                </article>
              </Link>
            );
          })}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
