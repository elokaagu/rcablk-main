import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { brand } from "@/lib/brand-colors";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { ArticleHeader } from "@/components/ArticleHeader";
import { BlurImage } from "@/components/BlurImage";
import { EventBody } from "@/components/EventBody";
import { getEventBySlug } from "@/lib/cms/events-repo";
import { getAbsoluteUrl, toJsonLd } from "@/lib/json-ld";
import { isVideoMediaUrl } from "@/lib/media-url";
import type { Metadata } from "next";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  const description = event.description || event.body || `RCA BLK event: ${event.name}`;

  return {
    title: `${event.name} | RCA BLK Events`,
    description,
    openGraph: {
      title: `${event.name} | RCA BLK Events`,
      description,
    },
  };
}

export default async function EventDetail({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description || event.body,
    ...(event.date && { startDate: event.date }),
    ...(event.venue && {
      location: {
        "@type": "Place",
        name: event.venue,
      },
    }),
    ...(event.image && !isVideoMediaUrl(event.image)
      ? {
          image: getAbsoluteUrl(event.image, baseUrl),
        }
      : {}),
  };

  return (
    <div
      className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden"
      style={{ backgroundColor: brand.sage }}
    >
      <PageBackground color={brand.sage} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(jsonLd),
        }}
      />

      <PageHeader />

      <ArticleHeader backHref="/events" backLabel="Events" ariaLabel="Back to all events" />

      <div className="px-5 pb-2 pt-6 text-center sm:pt-8">
        <p className="font-serif text-lg font-normal text-foreground sm:text-xl">Events</p>
      </div>

      <div className="px-5 py-4 text-center sm:px-8">
        <h1 className="font-display text-2xl font-black uppercase tracking-[0.02em] text-black [overflow-wrap:anywhere] sm:text-3xl sm:tracking-wide md:text-4xl lg:text-5xl">
          {event.name}
        </h1>
      </div>

      {event.image && (
        <div className="flex justify-center px-5 pb-6 sm:px-8">
          {isVideoMediaUrl(event.image) ? (
            <video
              src={event.image}
              controls
              playsInline
              className="mx-auto aspect-video w-full max-w-2xl rounded-md bg-black object-contain"
              aria-label={`${event.name} — hero video`}
            />
          ) : (
            <BlurImage
              src={event.image}
              alt={event.name}
              aspectRatio="4/3"
              className="mx-auto w-full max-w-2xl rounded-md"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          )}
        </div>
      )}

      {event.date && (
        <div className="px-5 pb-6 text-center">
          <p className="font-serif text-base text-foreground sm:text-lg">{event.date}</p>
        </div>
      )}

      {event.body && (
        <div className="mx-auto max-w-2xl px-5 pb-12 text-left sm:px-10 sm:pb-16">
          <EventBody body={event.body} />
        </div>
      )}

      <Footer />
    </div>
  );
}
