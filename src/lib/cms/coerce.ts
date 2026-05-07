/**
 * Defensive coercion for Supabase / JSONB rows so odd types from the database
 * never crash public Server Components (e.g. `.trim()` on a number, React
 * trying to render an object as a child).
 */

export function asString(raw: unknown, fallback = ""): string {
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  if (typeof raw === "boolean") return raw ? "true" : "false";
  return fallback;
}

/** Trimmed string; empty input becomes `fallback` (default ""). */
export function asTrimmedString(raw: unknown, fallback = ""): string {
  const s = asString(raw, fallback).trim();
  return s;
}

/**
 * Normalise JSONB that should be `string[]` but may be a single HTML string
 * or a mixed array (news `body`, site `paragraphs`, etc.).
 */
export function normalizeStringArrayField(raw: unknown): string[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? [raw] : [];
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string");
}

export function normalizeGalleryField(raw: unknown): string[] | undefined {
  if (raw == null) return undefined;
  if (!Array.isArray(raw)) return undefined;
  const urls = raw.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
  return urls.length ? urls : undefined;
}

/** Events table `body` is a single text/html field; jsonb may still vary. */
export function normalizeEventBodyField(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? raw : undefined;
  }
  return undefined;
}
