"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListingCardMedia } from "@/components/ListingCardMedia";
import { AnimateStagger } from "@/components/AnimateStagger";
import { ListingToolbar } from "@/components/listing/ListingToolbar";
import {
  filterAndSortNews,
  uniqueNewsCategories,
  type SortOption,
} from "@/lib/listing-filters";
import type { NewsArticle } from "@/data/news";

const CARD_ASPECTS = ["3/4", "4/5", "1/1", "3/4", "4/5", "4/3"] as const;

type NewsListingClientProps = {
  articles: NewsArticle[];
};

export function NewsListingClient({ articles }: NewsListingClientProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [category, setCategory] = useState("all");

  const categoryOptions = useMemo(() => {
    const cats = uniqueNewsCategories(articles);
    return [
      { value: "all", label: "All categories" },
      ...cats.map((c) => ({ value: c.toLowerCase(), label: c })),
    ];
  }, [articles]);

  const filtered = useMemo(
    () => filterAndSortNews(articles, { query, category, sort }),
    [articles, query, category, sort],
  );

  return (
    <>
      <ListingToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        filterValue={category}
        onFilterChange={setCategory}
        filterOptions={categoryOptions}
        filterLabel="Category"
        resultCount={filtered.length}
        totalCount={articles.length}
        searchPlaceholder="Search news, categories, dates…"
        ringOffsetClass="focus-visible:ring-offset-[#FFDD00]"
      />

      {filtered.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-black/30 bg-white/50 px-6 py-12 text-center font-serif text-base text-black/70">
          No articles match your search. Try clearing filters or a different term.
        </p>
      ) : (
        <AnimateStagger
          delay={0.2}
          stagger={0.05}
          duration={0.85}
          y={18}
          className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {filtered.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group block min-w-0 no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFDD00]"
            >
              <article className="relative overflow-hidden rounded-lg bg-black/5 shadow-[0_1px_24px_-18px_rgba(0,0,0,0.20)] transition-shadow duration-500 ease-out group-hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.40)]">
                <ListingCardMedia
                  src={item.image}
                  alt={item.title}
                  aspectRatio={CARD_ASPECTS[i % CARD_ASPECTS.length]}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  imgClassName="group-hover:scale-[1.04]"
                  className="w-full"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.08]"
                />
                <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
                  {item.category ? (
                    <p className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[0.75rem]">
                      {item.category}
                    </p>
                  ) : null}
                  <h2 className="mt-1.5 font-serif text-[1.05rem] font-medium leading-snug text-white sm:text-[1.15rem] lg:text-[1.2rem]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 font-serif text-[0.78rem] text-white/75 sm:text-[0.82rem]">
                    {item.date}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </AnimateStagger>
      )}
    </>
  );
}
