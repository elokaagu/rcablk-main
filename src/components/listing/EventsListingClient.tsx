"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListingCardMedia } from "@/components/ListingCardMedia";
import { AnimateStagger } from "@/components/AnimateStagger";
import { ListingToolbar } from "@/components/listing/ListingToolbar";
import {
  filterAndSortEvents,
  uniqueEventYears,
  type SortOption,
} from "@/lib/listing-filters";
import type { EventData } from "@/data/events";

type EventsListingClientProps = {
  events: EventData[];
};

export function EventsListingClient({ events }: EventsListingClientProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [year, setYear] = useState("all");

  const yearOptions = useMemo(() => {
    const years = uniqueEventYears(events);
    return [
      { value: "all", label: "All years" },
      ...years.map((y) => ({ value: y, label: y })),
    ];
  }, [events]);

  const filtered = useMemo(
    () => filterAndSortEvents(events, { query, year, sort }),
    [events, query, year, sort],
  );

  return (
    <>
      <ListingToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        filterValue={year}
        onFilterChange={setYear}
        filterOptions={yearOptions}
        filterLabel="Year"
        resultCount={filtered.length}
        totalCount={events.length}
        searchPlaceholder="Search events, venues, dates…"
      />

      {filtered.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-black/30 bg-white/50 px-6 py-12 text-center font-serif text-base text-black/70">
          No events match your search. Try clearing filters or a different term.
        </p>
      ) : (
        <AnimateStagger
          delay={0.25}
          stagger={0.05}
          className="grid grid-flow-row grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3 lg:gap-x-10"
        >
          {filtered.map((event) => (
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
      )}
    </>
  );
}
