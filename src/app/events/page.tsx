import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageLogotype } from "@/components/PageLogotype";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { AnimateIn } from "@/components/AnimateIn";
import { EventsListingClient } from "@/components/listing/EventsListingClient";
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
      className="flex min-h-screen-safe min-w-0 w-full flex-col overflow-x-hidden text-black"
      style={{ backgroundColor: "#A8C9A7" }}
    >
      <PageBackground color="#A8C9A7" />
      <SlideOutMenu />
      <PageLogotype src={BRAND_LOGOTYPES.yellow} />

      <AnimateIn delay={0.2} duration={0.6} y={16}>
        <header className="px-page-safe pb-6 pt-page-chrome sm:px-10 sm:pb-8 sm:pt-12">
          <h1 className="text-center font-serif text-3xl font-normal capitalize tracking-tight text-black sm:text-4xl">
            events
          </h1>
        </header>
      </AnimateIn>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-5 pb-14 sm:px-8 sm:pb-20 lg:px-12">
        <EventsListingClient events={events} />
      </main>

      <Footer />
    </div>
  );
}
