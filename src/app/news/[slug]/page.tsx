import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { newsArticles } from "@/data/news";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SlideOutMenu />

      <div className="px-8 lg:px-12 pt-8">
        <Logo className="h-10" />
      </div>

      <article className="flex-1 px-8 lg:px-16 max-w-4xl mx-auto w-full pb-16">
        {/* Category */}
        <p className="text-center text-xl italic text-foreground mt-12 mb-6">
          {article.category}
        </p>

        {/* Title */}
        <h1 className="text-center text-3xl md:text-4xl font-display font-normal text-foreground mb-4 uppercase tracking-wide">
          {article.title}
        </h1>

        {/* Date */}
        <p
          className="text-center text-sm text-foreground mb-10"
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
              className="text-lg md:text-xl leading-relaxed text-foreground"
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
