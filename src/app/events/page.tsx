import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
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

      <AnimateIn delay={0.1} duration={0.5} y={16}>
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Events</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto w-full pb-12 sm:pb-16">
        <AnimateStagger delay={0.3} stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => {
            const details = [event.description, event.venue, event.date].filter(Boolean).join(" ");
            return (
              <Link key={event.slug} href={`/events/${event.slug}`} className="flex flex-col group">
                <BlurImage src={event.image} alt={event.name} aspectRatio="4/3" hoverOpacity sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <h3 className="mt-4 text-lg font-display font-black text-foreground tracking-wide uppercase">
                  {event.name}
                </h3>
                {details && (
                  <p className="mt-1 text-base text-foreground leading-relaxed">{details}</p>
                )}
              </Link>
            );
          })}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
