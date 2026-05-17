import type { AlumniMember } from "@/data/alumni";
import type { NewsArticle } from "@/data/news";
import type { EventData } from "@/data/events";
import { getAlumniPrimaryLink } from "@/lib/alumni-links";
import { getNewsCalendarTimeMs } from "@/lib/news-sort";
import { matchesSearchQuery, normalizeSearchQuery, type SortOption } from "@/lib/listing-filters";

export type SiteSearchResultType = "news" | "event" | "alumni";

export type SiteSearchResult = {
  id: string;
  type: SiteSearchResultType;
  title: string;
  subtitle: string;
  date: string;
  href: string;
  /** Open portfolio / mailto links in a new tab. */
  external?: boolean;
  timeMs: number;
};

function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function alumniToSearchResult(member: AlumniMember, group: string): SiteSearchResult {
  const primary = getAlumniPrimaryLink(member);
  const external = Boolean(primary && (primary.startsWith("http") || primary.startsWith("mailto:")));

  return {
    id: `alumni:${slugifyName(member.name)}`,
    type: "alumni",
    title: member.name,
    subtitle: group,
    date: "",
    href: external ? primary! : "/alumni",
    external,
    timeMs: 0,
  };
}

export function buildAlumniSearchIndex(
  founding: readonly AlumniMember[],
  members: readonly AlumniMember[],
): SiteSearchResult[] {
  const byName = new Map<string, SiteSearchResult>();

  for (const member of founding) {
    const key = member.name.trim().toLowerCase();
    if (!key || byName.has(key)) continue;
    byName.set(key, alumniToSearchResult(member, "Founding member"));
  }

  for (const member of members) {
    const key = member.name.trim().toLowerCase();
    if (!key || byName.has(key)) continue;
    byName.set(key, alumniToSearchResult(member, "Alumni"));
  }

  return [...byName.values()].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
}

export function buildSiteSearchIndex(
  news: readonly NewsArticle[],
  events: readonly EventData[],
  founding: readonly AlumniMember[] = [],
  alumniMembers: readonly AlumniMember[] = [],
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
    ...buildAlumniSearchIndex(founding, alumniMembers),
  ];

  return items.sort((a, b) => {
    if (b.timeMs !== a.timeMs) return b.timeMs - a.timeMs;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
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

export function typeLabel(type: SiteSearchResultType): string {
  switch (type) {
    case "news":
      return "News";
    case "event":
      return "Event";
    case "alumni":
      return "Alumni";
  }
}
