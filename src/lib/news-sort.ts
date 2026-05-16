import { isValid, parse } from "date-fns";
import type { NewsArticle } from "@/data/news";

const FORMATS = [
  "d MMMM yyyy",
  "d MMMM, yyyy",
  "MMMM d, yyyy",
  "MMM d, yyyy",
  "yyyy-MM-dd",
] as const;

/**
 * Best-effort parse of the editorial date strings used across the site
 * ("30 November 2023", "March 26, 2025", ranges with an en-dash, etc.).
 * Returns epoch ms, or `0` when nothing could be parsed (sorts as oldest).
 */
export function getNewsCalendarTimeMs(raw: string): number {
  const t = raw.trim();
  if (!t) return 0;

  for (const candidate of dateCandidates(t)) {
    for (const fmt of FORMATS) {
      const d = parse(candidate, fmt, new Date());
      if (isValid(d)) return d.getTime();
    }
    const loose = Date.parse(candidate);
    if (!Number.isNaN(loose)) return loose;
  }
  return 0;
}

function dateCandidates(raw: string): string[] {
  const out: string[] = [raw];
  const rangeRe = /\s+[–-]\s+/;
  if (!rangeRe.test(raw)) return out;

  const parts = raw.split(rangeRe).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return out;

  const last = parts[parts.length - 1]!;
  const yearMatch = last.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch?.[0];

  for (const p of parts) {
    out.push(p);
    if (year && !/\b(19|20)\d{2}\b/.test(p)) {
      out.push(`${p} ${year}`);
    }
  }
  return [...new Set(out)];
}

export type NewsListSort = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export function applyNewsListSort(
  articles: readonly NewsArticle[],
  sort: NewsListSort,
): NewsArticle[] {
  switch (sort) {
    case "date-desc":
      return sortNewsArticlesByCalendarDate(articles, "desc");
    case "date-asc":
      return sortNewsArticlesByCalendarDate(articles, "asc");
    case "title-asc":
      return [...articles].sort(
        (a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" }) ||
          a.slug.localeCompare(b.slug, undefined, { sensitivity: "base" }),
      );
    case "title-desc":
      return [...articles].sort(
        (a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" }) ||
          b.slug.localeCompare(a.slug, undefined, { sensitivity: "base" }),
      );
  }
}

export function filterNewsArticles(
  articles: readonly NewsArticle[],
  query: string,
  category: string,
): NewsArticle[] {
  const q = query.trim().toLowerCase();
  const cat = category.trim().toLowerCase();

  return articles.filter((a) => {
    if (cat && cat !== "all" && a.category.toLowerCase() !== cat) return false;
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.date.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q)
    );
  });
}

/** Public index + Studio list: newest editorial calendar date first by default. */
export function sortNewsArticlesByCalendarDate(
  articles: readonly NewsArticle[],
  direction: "desc" | "asc" = "desc",
): NewsArticle[] {
  const dir = direction === "desc" ? -1 : 1;
  return [...articles].sort((a, b) => {
    const ta = getNewsCalendarTimeMs(a.date);
    const tb = getNewsCalendarTimeMs(b.date);
    if (ta !== tb) return dir * (ta - tb);
    return dir * a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}
