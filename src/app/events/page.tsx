import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageHeader } from "@/components/PageHeader";
import { PageTitle } from "@/components/PageTitle";
import Link from "next/link";
import { ListingCardMedia } from "@/components/ListingCardMedia";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getEvents } from "@/lib/cms/events-repo";
import { brand } from "@/lib/brand-colors";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events | RCA BLK",
  description:
    "Discover exhibitions, talks, and events by RCA BLK and the Royal College of Art community.",
  openGraph: {
    title: "Events | RCA BLK",
    description:
      "Discover exhibitions, talks, and events by RCA BLK and the Royal College of Art community.",
  },
};

export default async function Events() {
  const events = await getEvents();

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-brand-sage text-black">
      <PageBackground color={brand.sage} />
      <PageHeader />

      <AnimateIn delay={0.2} duration={0.6} y={16}>
        <header className="px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          <PageTitle>Events</PageTitle>
        </header>
      </AnimateIn>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14">
        {events.length === 0 ? (
          <p className="font-serif text-lg italic tracking-brand text-black">
            No events are currently listed. Please check back soon.
          </p>
        ) : (
          <AnimateStagger
            delay={0.25}
            stagger={0.05}
            className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-12"
          >
            {events.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group flex min-w-0 flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sage"
              >
                {event.image ? (
                  <ListingCardMedia
                    src={event.image}
                    alt={event.name}
                    aspectRatio="3/2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full rounded-md"
                  />
                ) : (
                  <div
                    className="aspect-[3/2] w-full rounded-md border border-black/20"
                    aria-hidden="true"
                  />
                )}

                <div className="mt-6 flex flex-col gap-0 text-left sm:mt-7">
                  <h2 className="font-display text-lg font-black uppercase leading-tight tracking-wide text-black sm:text-xl">
                    {event.name}
                  </h2>

                  {event.description && (
                    <p className="mt-3 font-serif text-base font-normal italic leading-[1.35] tracking-brand text-black sm:text-[1.05rem]">
                      {event.description}
                    </p>
                  )}

                  {event.venue && (
                    <p className="mt-2 font-serif text-base font-normal not-italic leading-[1.35] tracking-brand text-black sm:text-[1.05rem]">
                      {event.venue}
                    </p>
                  )}

                  {event.date && (
                    <p className="mt-4 border-t border-black/20 pt-3 font-serif text-sm font-normal leading-[1.35] tracking-brand text-black sm:text-base">
                      {event.date}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </AnimateStagger>
        )}
      </main>

      <Footer />
    </div>
  );
}
