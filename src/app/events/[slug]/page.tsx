import { notFound } from "next/navigation";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { events } from "@/data/events";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetail({ params }: PageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(140, 30%, 70%)" }}>
      <SlideOutMenu />

      {/* RCA BLK Logo */}
      <div className="px-8 lg:px-12 pt-8">
        <Logo className="h-10" />
      </div>

      {/* Breadcrumb */}
      <div className="text-center py-6">
        <Link href="/events" className="text-2xl font-display font-normal text-foreground hover:opacity-70 transition-opacity">
          Events
        </Link>
      </div>

      {/* Event Name */}
      <div className="text-center pb-6">
        <h2
          className="text-4xl lg:text-5xl font-display font-black tracking-wide uppercase"
          style={{ color: "hsl(24, 95%, 50%)" }}
        >
          {event.name}
        </h2>
      </div>

      {/* Event Image */}
      <div className="flex justify-center px-8 pb-6">
        <BlurImage src={event.image} alt={event.name} aspectRatio="4/3" className="max-w-2xl mx-auto" sizes="(max-width: 768px) 100vw, 672px" />
      </div>

      {/* Date */}
      <div className="text-center pb-6">
        <p className="text-lg text-foreground">{event.date}</p>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-8 pb-16 text-center">
        <p className="text-lg leading-relaxed text-foreground">{event.body}</p>
      </div>

      <Footer />
    </div>
  );
}
