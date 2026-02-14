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
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
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

      {/* News Grid - staggered 2-column */}
      <main className="flex-1 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full pb-12 sm:pb-16">
        <AnimateStagger delay={0.3} stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-10 sm:gap-y-16">
          {newsArticles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className={`no-underline ${i % 2 === 1 ? "md:mt-24" : ""}`}
            >
              <BlurImage src={item.image} alt={item.title} aspectRatio="4/5" sizes="(max-width: 768px) 100vw, 50vw" />
              <p className="mt-3 text-base text-foreground">{item.date}</p>
              <h3 className="text-xl font-display font-normal text-foreground uppercase tracking-wide">{item.title}</h3>
            </Link>
          ))}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
