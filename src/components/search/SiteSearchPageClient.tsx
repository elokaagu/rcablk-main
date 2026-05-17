"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingToolbar } from "@/components/listing/ListingToolbar";
import { searchSiteIndex, typeLabel, type SiteSearchResult } from "@/lib/site-search-index";
import type { SortOption } from "@/lib/listing-filters";

type SiteSearchPageClientProps = {
  index: SiteSearchResult[];
};

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "event", label: "Events" },
  { value: "alumni", label: "Alumni" },
];

function SearchResultRow({ item }: { item: SiteSearchResult }) {
  const rowClass =
    "group flex flex-col gap-1 px-5 py-4 no-underline outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.06] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-6 sm:py-5";

  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[0.6rem] font-black uppercase tracking-[0.22em] text-black/55">
          {typeLabel(item.type)}
          {item.subtitle ? ` · ${item.subtitle}` : ""}
        </p>
        <h2 className="mt-1 font-serif text-lg font-medium leading-snug text-black group-hover:underline sm:text-xl">
          {item.title}
        </h2>
      </div>
      {item.date ? (
        <p className="shrink-0 font-serif text-sm text-black/60 sm:text-right">{item.date}</p>
      ) : item.external ? (
        <p className="shrink-0 font-serif text-sm text-black/50 sm:text-right">Portfolio ↗</p>
      ) : item.type === "alumni" ? (
        <p className="shrink-0 font-serif text-sm text-black/50 sm:text-right">View on Alumni</p>
      ) : null}
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={rowClass}>
      {content}
    </Link>
  );
}

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
        searchPlaceholder="Search news, events, and alumni…"
      />

      {filtered.length === 0 ? (
        <p className="border-t border-black/12 pt-8 text-center font-serif text-base text-black/70">
          {query.trim()
            ? "No results for that search. Try another term or browse News, Events, and Alumni."
            : "Enter a term above to search articles, events, and alumni names."}
        </p>
      ) : (
        <ul className="divide-y divide-black/12 border-t border-black/12">
          {filtered.map((item) => (
            <li key={item.id}>
              <SearchResultRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
