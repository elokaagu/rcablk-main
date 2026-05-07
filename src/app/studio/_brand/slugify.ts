/**
 * Convert any string into a URL-safe slug:
 *   "Café Royal — Vol. 2!" → "cafe-royal-vol-2"
 *
 * - Lower-cases the input
 * - Strips diacritics so "é" becomes "e"
 * - Removes characters that aren't alphanumeric or whitespace/dashes
 * - Collapses runs of whitespace/dashes into a single dash
 * - Trims leading/trailing dashes
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
