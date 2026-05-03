import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { NewsArticleGallery } from "@/components/NewsArticleGallery";
import { BlurImage } from "@/components/BlurImage";
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
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 pb-16 sm:px-10 sm:py-10 sm:pb-20 lg:max-w-[56rem] lg:px-14">
        <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
          <Link
            href="/news"
            className="font-serif text-sm text-black underline decoration-black/40 underline-offset-[0.2em] transition-opacity hover:opacity-70"
          >
            Back to news
          </Link>
        </nav>

        {hasGallery ? (
          <>
            <NewsArticleGallery images={article.gallery!} title={article.title} />
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-2xl font-normal leading-tight text-black sm:text-3xl md:text-[2rem]">
                {article.title}
              </h1>
              <p className="mt-3 font-serif text-base text-black sm:text-lg">{article.date}</p>
            </header>
            <div className="mx-auto max-w-prose space-y-6 text-left font-serif text-lg leading-relaxed text-black sm:text-xl">
              {article.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </>
        ) : (
          <>
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-2xl font-normal leading-tight text-black sm:text-3xl md:text-[2rem]">
                {article.title}
              </h1>
              <p className="mt-3 font-serif text-base text-black sm:text-lg">{article.date}</p>
            </header>

            <div className="mx-auto mb-10 w-full max-w-md sm:mb-12 md:max-w-lg">
              <BlurImage
                src={article.image}
                alt={article.title}
                aspectRatio="3/4"
                className="w-full"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>

            <div className="mx-auto max-w-prose space-y-6 text-center font-serif text-lg leading-relaxed text-black sm:text-left sm:text-xl">
              {article.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
