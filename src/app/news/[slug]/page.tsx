import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { NewsArticleGallery } from "@/components/NewsArticleGallery";
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
  const hasGallery = article.gallery && article.gallery.length > 0;

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0"
      style={{ backgroundColor: "#FFC107" }}
    >
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

      {/* Yellow sidebars layout - content in center */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,900px)_1fr] min-h-0">
        <div className="hidden lg:block" style={{ backgroundColor: "#FFC107" }} />
        <div className="flex flex-col min-w-0">
          <div className="px-4 sm:px-8 pt-6 sm:pt-8">
            <Logo className="h-10" />
          </div>

          <Link
            href="/news"
            className="px-4 sm:px-8 mt-2 text-foreground underline hover:opacity-70 transition-opacity inline-flex"
          >
            ← Back to News
          </Link>

          <article className="flex-1 pt-6 pb-12 sm:pb-16">
            {hasGallery ? (
              <NewsArticleGallery images={article.gallery!} title={article.title} />
            ) : (
              <div className="w-full mb-4">
                <BlurImage
                  src={article.image}
                  alt={article.title}
                  aspectRatio="3/4"
                  className="w-full max-w-2xl mx-auto"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            )}

            {/* Title / description - from first body paragraph when gallery present */}
            <div className="px-4 sm:px-8 max-w-2xl">
              {hasGallery && article.body[0] && (
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-8">
                  {article.body[0]}
                </h2>
              )}
              {!hasGallery && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
                    {article.title}
                  </h1>
                  <p className="text-base text-foreground mb-6">{article.date}</p>
                </>
              )}
              <div className="space-y-6">
                {(hasGallery ? article.body.slice(1) : article.body).map((paragraph, i) => (
                  <p key={i} className="text-lg leading-relaxed text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
        <div className="hidden lg:block" style={{ backgroundColor: "#FFC107" }} />
      </div>

      <Footer />
    </div>
  );
}
