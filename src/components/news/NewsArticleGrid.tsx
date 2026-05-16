"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { NewsArticle } from "@/data/news";
import { ListingCardMedia } from "@/components/ListingCardMedia";
import {
  applyNewsListSort,
  filterNewsArticles,
  type NewsListSort,
} from "@/lib/news-sort";
import { cn } from "@/lib/utils";

const CARD_ASPECTS = ["3/4", "4/5", "1/1", "3/4", "4/5", "4/3"] as const;

const SORT_OPTIONS: { value: NewsListSort; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

const fieldClass =
  "h-11 w-full rounded-md border border-black/25 bg-white/90 px-3 font-serif text-base tracking-brand text-black outline-none transition-colors placeholder:text-black/45 focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/15";

export function NewsArticleGrid({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<NewsListSort>("date-desc");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.category?.trim()) set.add(a.category.trim());
    }
    return ["all", ...[...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))];
  }, [articles]);

  const visible = useMemo(() => {
    const filtered = filterNewsArticles(articles, query, category);
    return applyNewsListSort(filtered, sort);
  }, [articles, query, category, sort]);

  const hasFilters = query.trim() !== "" || category !== "all" || sort !== "date-desc";

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("date-desc");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div
        className="rounded-lg border border-black/15 bg-white/50 p-4 sm:p-5"
        role="search"
        aria-label="Filter and sort news articles"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_minmax(11rem,13rem)_minmax(10rem,12rem)] lg:items-end">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="news-search" className="mb-1.5 block font-serif text-sm tracking-brand text-black">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/45"
                aria-hidden
              />
              <input
                id="news-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, category, or date…"
                autoComplete="off"
                className={cn(fieldClass, "pl-10")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="news-sort" className="mb-1.5 block font-serif text-sm tracking-brand text-black">
              Sort by
            </label>
            <select
              id="news-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as NewsListSort)}
              className={fieldClass}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="news-category" className="mb-1.5 block font-serif text-sm tracking-brand text-black">
              Category
            </label>
            <select
              id="news-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 font-serif text-sm tracking-brand text-black/65" aria-live="polite">
          Showing {visible.length} of {articles.length}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
          {category !== "all" ? ` in ${category}` : ""}
          {hasFilters ? (
            <>
              {" · "}
              <button
                type="button"
                onClick={resetFilters}
                className="underline decoration-black/35 underline-offset-[0.2em] transition-colors hover:text-black"
              >
                Reset filters
              </button>
            </>
          ) : null}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white/40 px-6 py-14 text-center">
          <p className="font-serif text-lg tracking-brand text-black">No articles match your filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 font-serif text-sm tracking-brand text-black underline decoration-black/35 underline-offset-[0.2em] hover:opacity-70"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {visible.map((item, i) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group block no-underline outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-brand-yellow"
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
                  <h2 className="mt-1.5 font-serif text-[1.05rem] font-medium leading-snug tracking-brand text-white sm:text-[1.15rem] lg:text-[1.2rem]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 font-serif text-[0.78rem] leading-[1.35] tracking-brand text-white/75 sm:text-[0.82rem]">
                    {item.date}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
