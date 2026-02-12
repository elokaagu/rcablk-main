import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { newsArticles } from "@/data/news";

export default function News() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SlideOutMenu />

      <div className="px-8 lg:px-12 pt-8">
        <Logo className="h-10" />
      </div>

      {/* Title */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-normal text-foreground">News</h2>
      </div>

      {/* News Grid - staggered 2-column */}
      <main className="flex-1 px-8 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {newsArticles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className={`no-underline ${i % 2 === 1 ? "md:mt-24" : ""}`}
            >
              <BlurImage src={item.image} alt={item.title} aspectRatio="4/5" sizes="(max-width: 768px) 100vw, 50vw" />
              <p className="mt-3 text-sm text-foreground">{item.date}</p>
              <h3 className="text-xl font-normal text-foreground">{item.title}</h3>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
