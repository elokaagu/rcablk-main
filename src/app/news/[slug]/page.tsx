import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { newsArticles } from "@/data/news";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  const description = article.body[0]?.slice(0, 160) || article.title;
  return {
    title: `${article.title} | RCA BLK News`,
    description,
    openGraph: {
      title: `${article.title} | RCA BLK News`,
      description,
    },
  };
}

export default async function NewsArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            datePublished: article.date,
            image: article.image.startsWith("/") ? `${baseUrl}${article.image}` : article.image,
          }),
        }}
      />
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 mb-4">
        <Breadcrumbs items={[{ label: "News", href: "/news" }, { label: article.title }]} />
        <Link href="/news" className="text-foreground underline hover:opacity-70 transition-opacity inline-flex items-center gap-2">
          ← Back to News
        </Link>
      </div>

      <article className="flex-1 px-6 sm:px-10 lg:px-16 max-w-3xl mx-auto w-full pb-12 sm:pb-16">
        {/* Category */}
        <p className="text-center text-xl italic text-foreground mt-12 mb-6">
          {article.category}
        </p>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-display font-normal text-foreground mb-4 uppercase tracking-wide px-2">
          {article.title}
        </h1>

        {/* Date */}
        <p
          className="text-center text-base text-foreground mb-10"
        >
          {article.date}
        </p>

        {/* Hero image */}
        <BlurImage src={article.image} alt={article.title} aspectRatio="3/4" className="max-w-lg mx-auto mb-12" sizes="(max-width: 768px) 100vw, 512px" />

        {/* Body paragraphs */}
        <div className="space-y-6">
          {article.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-xl md:text-2xl leading-relaxed text-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <Footer />
    </div>
  );
}
