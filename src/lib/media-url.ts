/**
 * Detect likely video URLs from path extension (Supabase and other CDNs keep
 * extensions in the object key). Query strings are stripped before matching.
 */
export function isVideoMediaUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  let path = t;
  try {
    if (/^[a-z]+:/i.test(t)) path = new URL(t).pathname;
  } catch {
    /* keep path as-is for malformed absolute URLs */
  }
  const base = (path.split("?")[0] ?? "").toLowerCase();
  return /\.(mp4|webm|mov|m4v|ogv)$/i.test(base);
}
