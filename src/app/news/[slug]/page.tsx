import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { NewsArticleGallery } from "@/components/NewsArticleGallery";
import { NewsBody } from "@/components/NewsBody";
import { BlurImage } from "@/components/BlurImage";
import { isVideoMediaUrl } from "@/lib/media-url";
import { getNewsArticles } from "@/lib/cms/news-repo";
import { bodyArrayToString, htmlToPlainText, isHtmlBody } from "@/lib/rich-body";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const newsArticles = await getNewsArticles();
  const article = newsArticles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  // Build a short excerpt, stripping HTML when the body was authored with the
  // rich text editor so meta descriptions stay clean.
  const raw = bodyArrayToString(article.body);
  const text = isHtmlBody(raw) ? htmlToPlainText(raw) : raw;
  const description = (text || article.title).slice(0, 160);
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
  const newsArticles = await getNewsArticles();
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";
  const hasGallery = article.gallery && article.gallery.length > 0;

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-[#FFDD00] text-black">
      <PageBackground color="#FFDD00" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            datePublished: article.date,
            ...(isVideoMediaUrl(article.image)
              ? {}
              : {
                  image: article.image.startsWith("/") ? `${baseUrl}${article.image}` : article.image,
                }),
          }),
        }}
      />
      <SlideOutMenu />

      <main
        className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 pb-16 sm:px-10 sm:py-10 sm:pb-20 lg:max-w-[56rem] lg:px-14"
        style={{ paddingTop: "max(2rem, calc(env(safe-area-inset-top) + 1rem))" }}
      >
        <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
          <Link
            href="/news"
            className="inline-flex min-h-[44px] items-center font-serif text-sm text-black underline decoration-black/40 underline-offset-[0.2em] transition-opacity hover:opacity-70"
          >
            Back to news
          </Link>
        </nav>

        {hasGallery ? (
          <>
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-[1.5rem] font-normal leading-tight text-black [overflow-wrap:anywhere] sm:text-2xl md:text-3xl lg:text-[2rem]">
                {article.title}
              </h1>
              <p className="mt-3 font-serif text-base text-black sm:text-lg">{article.date}</p>
            </header>
            <NewsArticleGallery images={article.gallery!} title={article.title} />
            <div className="mx-auto max-w-prose">
              <NewsBody body={article.body} align="left" />
            </div>
          </>
        ) : (
          <>
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-[1.5rem] font-normal leading-tight text-black [overflow-wrap:anywhere] sm:text-2xl md:text-3xl lg:text-[2rem]">
                {article.title}
              </h1>
              <p className="mt-3 font-serif text-base text-black sm:text-lg">{article.date}</p>
            </header>

            <div className="mx-auto mb-10 w-full max-w-md sm:mb-12 md:max-w-lg">
              {isVideoMediaUrl(article.image) ? (
                <video
                  src={article.image}
                  controls
                  playsInline
                  className="aspect-video w-full rounded-md bg-black object-contain"
                  aria-label={`${article.title} — hero video`}
                />
              ) : (
                <BlurImage
                  src={article.image}
                  alt={article.title}
                  aspectRatio="3/4"
                  className="w-full rounded-md"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              )}
            </div>

            <div className="mx-auto max-w-prose">
              <NewsBody body={article.body} align="center-mobile" />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
