import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import Link from "next/link";
import { ListingCardMedia } from "@/components/ListingCardMedia";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getEvents } from "@/lib/cms/events-repo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events | RCA BLK",
  description: "Discover exhibitions, talks, and events by RCA BLK and the Royal College of Art community.",
  openGraph: { title: "Events | RCA BLK" },
};

/** Matches reference events listing: pale sage field, three-up cards, display + serif hierarchy */
export default async function Events() {
  const events = await getEvents();
  return (
    <div
      className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden text-black"
      style={{ backgroundColor: "#A8C9A7" }}
    >
      <PageBackground color="#A8C9A7" />
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={16}>
        <header
          className="px-5 pb-6 pt-12 sm:px-10 sm:pt-12 sm:pb-8"
          style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 2.5rem))" }}
        >
          <h1 className="text-center font-serif text-3xl font-normal capitalize tracking-tight text-black sm:text-4xl">
            events
          </h1>
        </header>
      </AnimateIn>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-5 pb-14 sm:px-8 sm:pb-20 lg:px-12">
        <AnimateStagger delay={0.25} stagger={0.05} className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3 lg:gap-x-10">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group flex min-w-0 flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#A8C9A7]"
            >
              <ListingCardMedia
                src={event.image}
                alt={event.name}
                aspectRatio="3/2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full rounded-md"
              />
              <div className="mt-5 flex flex-col gap-0 text-left sm:mt-6">
                <h2 className="font-display text-lg font-black uppercase leading-tight tracking-wide text-black sm:text-xl">
                  {event.name}
                </h2>
                {event.description ? (
                  <p className="mt-3 font-serif text-base font-normal italic leading-snug text-black sm:text-[1.05rem]">
                    {event.description}
                  </p>
                ) : null}
                {event.venue ? (
                  <p className="mt-2 font-serif text-base font-normal not-italic leading-snug text-black sm:text-[1.05rem]">
                    {event.venue}
                  </p>
                ) : null}
                {event.date ? (
                  <p className="mt-2 font-serif text-base font-normal not-italic leading-snug text-black sm:text-[1.05rem]">
                    {event.date}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
