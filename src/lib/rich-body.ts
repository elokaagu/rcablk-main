import DOMPurify from "isomorphic-dompurify";

/**
 * Shared helpers for safely rendering HTML produced by the studio rich text
 * editor on the public site. Centralised so events, news and site pages all
 * agree on:
 *
 * - what counts as "HTML" (i.e. a body produced by the editor vs. legacy plain
 *   text or a legacy paragraph array);
 * - which tags / attributes / URI schemes are allowed through sanitization.
 *
 * The sanitization config mirrors the formatting actually exposed in the
 * editor toolbar (headings, lists, links, blockquote, inline marks). It
 * deliberately drops scripts, inline event handlers, and styling attributes.
 */

export function isHtmlBody(input: string | null | undefined): boolean {
  if (!input) return false;
  return /<[a-z][\s\S]*>/i.test(input);
}

export function sanitizeBodyHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  });
}

/**
 * Strip HTML tags and decode the most common entities so an HTML body can be
 * used as a plain-text excerpt (e.g. an OpenGraph description). Not a full
 * HTML parser — just the surface needed for editor output.
 */
export function htmlToPlainText(html: string): string {
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
  if (body.length === 1) return body[0] ?? "";
  return body.join("\n\n");
}
