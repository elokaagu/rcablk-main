import type { NewsArticle } from "@/data/news";
import type { EventData } from "@/data/events";
import { getNewsCalendarTimeMs } from "@/lib/news-sort";
import { matchesSearchQuery, normalizeSearchQuery, type SortOption } from "@/lib/listing-filters";

export type SiteSearchResult = {
  id: string;
  type: "news" | "event";
  title: string;
  subtitle: string;
  date: string;
  href: string;
  timeMs: number;
};

export function buildSiteSearchIndex(
  news: readonly NewsArticle[],
  events: readonly EventData[],
): SiteSearchResult[] {
  const items: SiteSearchResult[] = [
    ...news.map((a) => ({
      id: `news:${a.slug}`,
      type: "news" as const,
      title: a.title,
      subtitle: a.category,
      date: a.date,
      href: `/news/${a.slug}`,
      timeMs: getNewsCalendarTimeMs(a.date),
    })),
    ...events.map((e) => ({
      id: `event:${e.slug}`,
      type: "event" as const,
      title: e.name,
      subtitle: e.venue || e.description || "Event",
      date: e.date,
      href: `/events/${e.slug}`,
      timeMs: getNewsCalendarTimeMs(e.date),
    })),
  ];

  return items.sort((a, b) => b.timeMs - a.timeMs);
}

export function searchSiteIndex(
  items: readonly SiteSearchResult[],
  query: string,
  sort: SortOption = "newest",
): SiteSearchResult[] {
  const q = normalizeSearchQuery(query);
  let list = items;
  if (q) {
    list = items.filter((item) => {
      const blob = [item.title, item.subtitle, item.date, item.type].join(" ");
      return matchesSearchQuery(blob, q);
    });
  }

  const dir = sort === "oldest" || sort === "title-asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (sort === "title-asc" || sort === "title-desc") {
      return dir * a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    }
    if (a.timeMs !== b.timeMs) return dir * (a.timeMs - b.timeMs);
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}
