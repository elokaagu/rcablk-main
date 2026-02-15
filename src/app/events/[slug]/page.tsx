import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { events } from "@/data/events";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcablk.com";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(140, 30%, 70%)" }}>
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
            image: event.image.startsWith("/") ? `${baseUrl}${event.image}` : event.image,
          }),
        }}
      />
      <SlideOutMenu />

      <div className="px-4 sm:px-8 pt-6 sm:pt-8 text-left">
        <Logo className="h-10" />
      </div>
      <div className="px-4 sm:px-8 pt-3">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 text-foreground hover:bg-white transition-colors rounded-lg shadow-sm border border-foreground/10 no-underline"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Section heading: Events */}
      <div className="text-center pt-6 sm:pt-8 pb-2">
        <h2 className="text-xl font-serif font-normal text-foreground">Events</h2>
      </div>

      {/* Event Name */}
      <div className="text-center py-4">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-wide uppercase px-4"
          style={{ color: "hsl(24, 95%, 50%)" }}
        >
          {event.name}
        </h1>
      </div>

      {/* Event Image */}
      <div className="flex justify-center px-4 sm:px-8 pb-6">
        <BlurImage src={event.image} alt={event.name} aspectRatio="4/3" className="max-w-2xl mx-auto" sizes="(max-width: 768px) 100vw, 672px" />
      </div>

      {/* Date */}
      {event.date && (
        <div className="text-center pb-6">
          <p className="text-lg text-foreground">{event.date}</p>
        </div>
      )}

      {/* Body - left-aligned */}
      {event.body && (
        <div className="max-w-2xl mx-auto px-6 sm:px-10 pb-12 sm:pb-16 text-left">
          <div
            className="text-xl leading-relaxed text-foreground whitespace-pre-line [&_em]:italic"
            dangerouslySetInnerHTML={{
              __html: event.body.replace(/\*([^*]+)\*/g, "<em>$1</em>"),
            }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
