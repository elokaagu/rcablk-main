import { notFound } from "next/navigation";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { ArticleHeader } from "@/components/ArticleHeader";
import { PageLogotype } from "@/components/PageLogotype";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { BlurImage } from "@/components/BlurImage";
import { EventBody } from "@/components/EventBody";
import { isVideoMediaUrl } from "@/lib/media-url";
import { getEvents } from "@/lib/cms/events-repo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.name} | RCA BLK Events`,
    description: event.description || event.body || `RCA BLK event: ${event.name}`,
    openGraph: {
      title: `${event.name} | RCA BLK Events`,
      description: event.description || event.body || "",
    },
  };
}

export default async function EventDetail({ params }: PageProps) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(140, 30%, 70%)" }}>
      <PageBackground color="hsl(140, 30%, 70%)" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.name,
            description: event.description || event.body,
            ...(event.date && { startDate: event.date }),
            ...(event.venue && { location: { "@type": "Place", name: event.venue } }),
            ...(isVideoMediaUrl(event.image)
              ? {}
              : {
                  image: event.image.startsWith("/") ? `${baseUrl}${event.image}` : event.image,
                }),
          }),
        }}
      />
      <SlideOutMenu />
      <PageLogotype src={BRAND_LOGOTYPES.yellow} />

      <ArticleHeader backHref="/events" backLabel="Events" ariaLabel="Back to all events" />

      {/* Section heading: Events */}
      <div className="px-5 pb-2 pt-6 text-center sm:pt-8">
        <h2 className="font-serif text-lg font-normal text-foreground sm:text-xl">Events</h2>
      </div>

      {/* Event Name */}
      <div className="px-5 py-4 text-center sm:px-8">
        <h1
          className="font-display text-2xl font-black uppercase tracking-[0.02em] [overflow-wrap:anywhere] sm:text-3xl sm:tracking-wide md:text-4xl lg:text-5xl"
          style={{ color: "hsl(24, 95%, 50%)" }}
        >
          {event.name}
        </h1>
      </div>

      {/* Event Image or video */}
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

      {/* Date */}
      {event.date && (
        <div className="px-5 pb-6 text-center">
          <p className="font-serif text-base text-foreground sm:text-lg">{event.date}</p>
        </div>
      )}

      {/* Body - left-aligned. Renders rich text HTML produced by the studio
          editor when present, with a graceful fallback to the legacy plain-
          text/`*italic*` format so seeded entries keep their original look. */}
      {event.body && (
        <div className="mx-auto max-w-2xl px-5 pb-12 text-left sm:px-10 sm:pb-16">
          <EventBody body={event.body} />
        </div>
      )}

      <Footer />
    </div>
  );
}
