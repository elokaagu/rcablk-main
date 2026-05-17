import type { EventData } from "@/data/events";
import { getNewsCalendarTimeMs } from "@/lib/news-sort";

/** Public listing: newest calendar date first (uses start/end parsing from news-sort). */
export function sortEventsByCalendarDate(
  events: readonly EventData[],
  direction: "desc" | "asc" = "desc",
): EventData[] {
  const dir = direction === "desc" ? -1 : 1;
  return [...events].sort((a, b) => {
    const ta = getNewsCalendarTimeMs(a.date);
    const tb = getNewsCalendarTimeMs(b.date);
    if (ta !== tb) return dir * (ta - tb);
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}
