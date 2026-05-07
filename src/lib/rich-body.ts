import sanitizeHtml from "sanitize-html";

/**
 * Shared helpers for safely rendering HTML produced by the studio rich text
 * editor on the public site. Centralised so events, news and site pages all
 * agree on:
 *
 * - what counts as "HTML" (i.e. a body produced by the editor vs. legacy plain
 *   text or a legacy paragraph array);
 * - which tags / attributes / URI schemes are allowed through sanitization.
 *
 * Uses `sanitize-html` (pure-JS, no jsdom) so server-side rendering on
 * Vercel's CJS runtime never trips on transitive ESM-only deps that the
 * isomorphic-dompurify → jsdom chain exposes (`html-encoding-sniffer`,
 * `@exodus/bytes`).
 */

export function isHtmlBody(input: string | null | undefined): boolean {
  if (typeof input !== "string" || !input) return false;
  return /<[a-z][\s\S]*>/i.test(input);
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "class"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto", "tel"],
  },
  // sanitize-html allows protocol-relative URLs by default; same-origin
  // links (relative paths and #anchors) are allowed because they have no
  // scheme to validate against.
  allowProtocolRelative: false,
};

export function sanitizeBodyHtml(html: string): string {
  if (typeof html !== "string") return "";
  try {
    return sanitizeHtml(html, SANITIZE_OPTIONS);
  } catch {
    return "";
  }
}

/**
 * Strip HTML tags and decode the most common entities so an HTML body can be
 * used as a plain-text excerpt (e.g. an OpenGraph description). Not a full
 * HTML parser — just the surface needed for editor output.
 */
export function htmlToPlainText(html: string): string {
  if (typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Some editors (events) store the body as a single string; others (news,
 * site pages) store it as an array of paragraphs. When the rich text editor
 * is used we save the entire HTML payload into a single-element array so the
 * underlying schema does not need to change. This helper collapses either
 * shape down to one string for downstream rendering.
 */
export function bodyArrayToString(body: string[] | string | null | undefined): string {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (!Array.isArray(body)) return "";
  const parts = body.filter((p): p is string => typeof p === "string");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0] ?? "";
  return parts.join("\n\n");
}
