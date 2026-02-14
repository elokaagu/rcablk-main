import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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

      {/* RCA BLK Logo */}
      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      {/* Breadcrumb & Back link */}
      <div className="px-4 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.name }]} />
        <Link
          href="/events"
          className="text-foreground underline hover:opacity-70 transition-opacity inline-flex items-center gap-2"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Event Name */}
      <div className="text-center py-6">
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
      <div className="text-center pb-6">
        <p className="text-lg text-foreground">{event.date}</p>
      </div>

      {/* Body */}
      <div className="max-w-xl mx-auto px-6 sm:px-10 pb-12 sm:pb-16 text-center">
        <p className="text-xl leading-relaxed text-foreground">{event.body}</p>
      </div>

      <Footer />
    </div>
  );
}
