import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";
import { events } from "@/data/events";

export default function Events() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(140, 30%, 70%)" }}>
      <SlideOutMenu />

      <div className="px-8 lg:px-12 pt-8">
        <Link href="/" className="text-3xl font-black tracking-tight text-foreground leading-none no-underline block" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>
          <span className="inline">RCA </span>
          <span className="inline">BLK</span>
        </Link>
      </div>

      <div className="text-center py-8">
        <h2 className="text-3xl font-normal text-foreground">Events</h2>
      </div>

      <main className="flex-1 px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="flex flex-col group">
              <BlurImage src={event.image} alt={event.name} aspectRatio="4/3" hoverOpacity sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <h3
                className="mt-4 text-lg font-black text-foreground tracking-wide uppercase"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {event.name}
              </h3>
              <p className="mt-1 text-sm italic text-foreground">{event.description}</p>
              <p className="mt-1 text-sm text-foreground">{event.venue}</p>
              <p className="text-sm text-foreground">{event.date}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
