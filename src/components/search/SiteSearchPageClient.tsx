"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingToolbar } from "@/components/listing/ListingToolbar";
import { searchSiteIndex, type SiteSearchResult } from "@/lib/site-search-index";
import type { SortOption } from "@/lib/listing-filters";

type SiteSearchPageClientProps = {
  index: SiteSearchResult[];
};

const TYPE_OPTIONS = [
  { value: "all", label: "News & events" },
  { value: "news", label: "News only" },
  { value: "event", label: "Events only" },
];

export function SiteSearchPageClient({ index }: SiteSearchPageClientProps) {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [sort, setSort] = useState<SortOption>("newest");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    setQuery(searchParams?.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = searchSiteIndex(index, query, sort);
    if (typeFilter !== "all") {
      list = list.filter((item) => item.type === typeFilter);
    }
    return list;
  }, [index, query, sort, typeFilter]);

  return (
    <>
      <ListingToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
        filterOptions={TYPE_OPTIONS}
        filterLabel="Type"
        resultCount={filtered.length}
        totalCount={index.length}
        searchPlaceholder="Search across news and events…"
      />

      {filtered.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-black/30 bg-white/60 px-6 py-12 text-center font-serif text-base text-black/70">
          {query.trim()
            ? "No results for that search. Try another term or browse News and Events."
            : "Enter a term above to search articles and events."}
        </p>
      ) : (
        <ul className="divide-y-2 divide-black/15 rounded-lg border-2 border-black bg-white/80 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex flex-col gap-1 px-5 py-4 no-underline outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.06] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-6 sm:py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[0.6rem] font-black uppercase tracking-[0.22em] text-black/55">
                    {item.type === "news" ? "News" : "Event"}
                    {item.subtitle ? ` · ${item.subtitle}` : ""}
                  </p>
                  <h2 className="mt-1 font-serif text-lg font-medium leading-snug text-black group-hover:underline sm:text-xl">
                    {item.title}
                  </h2>
                </div>
                {item.date ? (
                  <p className="shrink-0 font-serif text-sm text-black/60 sm:text-right">{item.date}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
