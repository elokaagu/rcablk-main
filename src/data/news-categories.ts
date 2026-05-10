/**
 * Editorial defaults for the news studio category dropdown. Existing article
 * categories from the CMS are merged in at runtime (case-insensitive dedupe).
 */
export const DEFAULT_NEWS_CATEGORIES = [
  "Announcement",
  "Exhibition",
  "Event",
  "Interview",
  "Partnership",
  "Press",
  "Residency",
  "Update",
] as const;

/** Merge pools into a sorted, case-insensitive unique list; default labels win casing. */
export function mergeNewsCategoryOptions(
  current: string,
  defaults: readonly string[],
  ...pools: readonly (readonly string[])[]
): string[] {
  const seen = new Map<string, string>();

  function add(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    const fromDefault = defaults.find((d) => d.toLowerCase() === key);
    const display = fromDefault ?? trimmed;
    if (!seen.has(key)) {
      seen.set(key, display);
    } else if (fromDefault) {
      seen.set(key, fromDefault);
    }
  }

  for (const d of defaults) add(d);
  for (const pool of pools) {
    for (const x of pool) add(x);
  }
  add(current);

  return [...seen.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function resolveCategorySelectValue(value: string, options: string[]): string | undefined {
  const t = value.trim();
  if (!t) return undefined;
  return options.find((o) => o.toLowerCase() === t.toLowerCase()) ?? t;
}
