"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { NewsArticle } from "@/data/news";
import { getNewsCalendarTimeMs } from "@/lib/news-sort";
import { StudioFieldLabel, StudioInput } from "../_brand/StudioBrand";
import { cn } from "@/lib/utils";

type SortKey = "date" | "title" | "slug";

function SortTh({
  label,
  active,
  direction,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <th scope="col" className={cn("px-4 py-3 sm:px-5 sm:py-4", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex min-h-[44px] w-full items-center justify-start gap-1 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors sm:min-h-0",
          active ? "text-black" : "text-black/55 hover:text-black",
        )}
      >
        <span>{label}</span>
        {active ? (
          direction === "asc" ? (
            <ArrowUp className="size-3.5 shrink-0" aria-hidden />
          ) : (
            <ArrowDown className="size-3.5 shrink-0" aria-hidden />
          )
        ) : null}
      </button>
    </th>
  );
}

export function StudioNewsArticleTable({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = articles.filter((a) => {
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.date.toLowerCase().includes(q)
      );
    });

    const dir = sortDir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        const ta = getNewsCalendarTimeMs(a.date);
        const tb = getNewsCalendarTimeMs(b.date);
        cmp = ta - tb;
      } else if (sortKey === "title") {
        cmp = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      } else {
        cmp = a.slug.localeCompare(b.slug, undefined, { sensitivity: "base" });
      }
      if (cmp !== 0) return dir * cmp;
      return a.slug.localeCompare(b.slug, undefined, { sensitivity: "base" });
    });
    return list;
  }, [articles, query, sortKey, sortDir]);

  function onHeaderClick(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <StudioFieldLabel htmlFor="studio-news-search">Search articles</StudioFieldLabel>
        <StudioInput
          id="studio-news-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title, slug, category, or date…"
          className="!mt-2"
          autoComplete="off"
        />
      </div>

      <p className="font-serif text-[0.82rem] text-black/55" aria-live="polite">
        Showing {rows.length} of {articles.length}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
        . Sort by column header; calendar order uses the article’s date field.
      </p>

      <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
        <table className="w-full min-w-[20rem] text-left">
          <thead className="border-b border-black/10 bg-black/[0.02]">
            <tr>
              <SortTh
                label="Title"
                active={sortKey === "title"}
                direction={sortDir}
                onClick={() => onHeaderClick("title")}
                className="min-w-[8rem]"
              />
              <SortTh
                label="Slug"
                active={sortKey === "slug"}
                direction={sortDir}
                onClick={() => onHeaderClick("slug")}
                className="hidden min-w-[6rem] sm:table-cell"
              />
              <SortTh
                label="Date"
                active={sortKey === "date"}
                direction={sortDir}
                onClick={() => onHeaderClick("date")}
                className="hidden min-w-[6rem] lg:table-cell"
              />
              <th
                scope="col"
                className="px-4 py-3 text-right font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/55 sm:px-5 sm:py-4"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.slug}
                className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
              >
                <td className="break-words px-4 py-3 font-serif text-[0.95rem] text-black sm:px-5 sm:py-4 sm:text-[0.98rem]">
                  {a.title}
                </td>
                <td className="hidden break-all px-4 py-3 font-mono text-[0.8rem] text-black/55 sm:table-cell sm:px-5 sm:py-4 sm:text-[0.85rem]">
                  {a.slug}
                </td>
                <td className="hidden px-4 py-3 font-serif text-[0.9rem] text-black/65 lg:table-cell lg:px-5 lg:py-4 lg:text-[0.95rem]">
                  {a.date}
                </td>
                <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                  <Link
                    href={`/studio/news/${encodeURIComponent(a.slug)}/edit`}
                    className="group inline-flex min-h-[44px] items-center gap-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:text-black/60"
                  >
                    <span>Edit</span>
                    <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
