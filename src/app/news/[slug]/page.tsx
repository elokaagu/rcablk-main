import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { brand } from "@/lib/brand-colors";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { NewsArticleGallery } from "@/components/NewsArticleGallery";
import { NewsBody } from "@/components/NewsBody";
import { BlurImage } from "@/components/BlurImage";
import { getNewsBySlug } from "@/lib/cms/news-repo";
import { getAbsoluteUrl, toJsonLd } from "@/lib/json-ld";
import { isVideoMediaUrl } from "@/lib/media-url";
import { bodyArrayToString, htmlToPlainText, isHtmlBody } from "@/lib/rich-body";
import type { NewsArticle } from "@/data/news";
import type { Metadata } from "next";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getArticleDescription(article: NewsArticle): string {
  const raw = bodyArrayToString(article.body);
  const text = isHtmlBody(raw) ? htmlToPlainText(raw) : raw;
  return (text || article.title).slice(0, 160);
}

function ArticleHeading({ title, date }: { title: string; date: string }) {
  return (
    <header className="mb-8 text-center sm:mb-10">
      <h1 className="font-serif text-[1.5rem] font-normal leading-tight text-black [overflow-wrap:anywhere] sm:text-2xl md:text-3xl lg:text-[2rem]">
        {title}
      </h1>
      <p className="mt-3 font-serif text-base text-black sm:text-lg">{date}</p>
    </header>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";
  const description = getArticleDescription(article);
  const pageUrl = `${baseUrl}/news/${article.slug}`;
  const ogImage =
    article.image && !isVideoMediaUrl(article.image)
      ? getAbsoluteUrl(article.image, baseUrl)
      : undefined;

  return {
    title: `${article.title} | RCA BLK News`,
    description,
    openGraph: {
      title: `${article.title} | RCA BLK News`,
      description,
      type: "article",
      url: pageUrl,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | RCA BLK News`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function NewsArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";
  const hasGallery = Boolean(article.gallery?.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.date,
    ...(article.image && !isVideoMediaUrl(article.image)
      ? {
          image: getAbsoluteUrl(article.image, baseUrl),
        }
      : {}),
  };

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-brand-yellow text-black">
      <PageBackground color={brand.yellow} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(jsonLd),
        }}
      />

      <PageHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 pb-16 sm:px-10 sm:py-10 sm:pb-20 lg:max-w-[56rem] lg:px-14">
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
            <NewsArticleGallery images={article.gallery!} title={article.title} />
            <ArticleHeading title={article.title} date={article.date} />
            <div className="mx-auto max-w-prose">
              <NewsBody body={article.body} align="left" />
            </div>
          </>
        ) : (
          <>
            <ArticleHeading title={article.title} date={article.date} />

            {article.image && (
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
            )}

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
