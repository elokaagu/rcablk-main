import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { events } from "@/data/events";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | RCA BLK",
  description: "Discover exhibitions, talks, and events by RCA BLK and the Royal College of Art community.",
  openGraph: { title: "Events | RCA BLK" },
};

export default function Events() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(140, 30%, 70%)" }}>
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Events</h2>
      </div>

      <main className="flex-1 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto w-full pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="flex flex-col group">
              <BlurImage src={event.image} alt={event.name} aspectRatio="4/3" hoverOpacity sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3 className="mt-4 text-lg font-display font-black text-foreground tracking-wide uppercase">
                {event.name}
              </h3>
              <p className="mt-1 text-base italic text-foreground">{event.description}</p>
              <p className="mt-1 text-base text-foreground">{event.venue}</p>
              <p className="text-base text-foreground">{event.date}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
