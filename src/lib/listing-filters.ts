import { getNewsCalendarTimeMs } from "@/lib/news-sort";
import type { NewsArticle } from "@/data/news";
import type { EventData } from "@/data/events";

export type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "title-asc": "Title A–Z",
  "title-desc": "Title Z–A",
};

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearchQuery(haystack: string, query: string): boolean {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  return haystack.toLowerCase().includes(q);
}

function compareBySort<T>(
  items: T[],
  sort: SortOption,
  getTime: (item: T) => number,
  getTitle: (item: T) => string,
): T[] {
  const dir = sort === "oldest" || sort === "title-asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (sort === "title-asc" || sort === "title-desc") {
      return dir * getTitle(a).localeCompare(getTitle(b), undefined, { sensitivity: "base" });
    }
    const ta = getTime(a);
    const tb = getTime(b);
    if (ta !== tb) return dir * (ta - tb);
    return getTitle(a).localeCompare(getTitle(b), undefined, { sensitivity: "base" });
  });
}

export function uniqueNewsCategories(articles: readonly NewsArticle[]): string[] {
  const seen = new Map<string, string>();
  for (const a of articles) {
    const t = a.category?.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (!seen.has(key)) seen.set(key, t);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function uniqueEventYears(events: readonly EventData[]): string[] {
  const years = new Set<string>();
  for (const e of events) {
    const ms = getNewsCalendarTimeMs(e.date);
    if (ms > 0) years.add(String(new Date(ms).getFullYear()));
    const fallback = e.date.match(/\b(19|20)\d{2}\b/);
    if (fallback?.[0]) years.add(fallback[0]);
  }
  return [...years].sort((a, b) => Number(b) - Number(a));
}

export function filterAndSortNews(
  articles: readonly NewsArticle[],
  options: { query: string; category: string; sort: SortOption },
): NewsArticle[] {
  const q = normalizeSearchQuery(options.query);
  const category = options.category.trim().toLowerCase();

  let list = articles.filter((a) => {
    if (category && category !== "all" && a.category.toLowerCase() !== category) return false;
    if (!q) return true;
    const blob = [a.title, a.category, a.date, ...a.body].join(" ");
    return matchesSearchQuery(blob, q);
  });

  list = compareBySort(list, options.sort, (a) => getNewsCalendarTimeMs(a.date), (a) => a.title);
  return list;
}

export function filterAndSortEvents(
  events: readonly EventData[],
  options: { query: string; year: string; sort: SortOption },
): EventData[] {
  const q = normalizeSearchQuery(options.query);
  const year = options.year.trim();

  let list = events.filter((e) => {
    if (year && year !== "all") {
      const ms = getNewsCalendarTimeMs(e.date);
      const y = ms > 0 ? String(new Date(ms).getFullYear()) : e.date.match(/\b(19|20)\d{2}\b/)?.[0];
      if (y !== year) return false;
    }
    if (!q) return true;
    const blob = [e.name, e.description, e.venue, e.date].join(" ");
    return matchesSearchQuery(blob, q);
  });

  list = compareBySort(list, options.sort, (e) => getNewsCalendarTimeMs(e.date), (e) => e.name);
  return list;
}
