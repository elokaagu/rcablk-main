import { isHtmlBody, sanitizeBodyHtml } from "@/lib/rich-body";

/**
 * Render an event's body in a way that exactly mirrors the studio rich text
 * editor preview:
 *
 * - If the saved body is HTML (produced by the rich text editor), sanitize it
 *   and render via `prose prose-rcablk` so headings, lists, links, blockquotes
 *   and emphasis all match the editor.
 *
 * - If the saved body is the legacy plain-text format (paragraphs separated
 *   by blank lines, with `*italic*` markdown-ish emphasis), fall back to the
 *   original behaviour so seeded entries that pre-date the editor continue to
 *   render correctly without a migration.
 */
export function EventBody({ body }: { body: string }) {
  if (typeof body !== "string" || !body) return null;

  if (isHtmlBody(body)) {
    return (
      <div
        className="prose prose-rcablk max-w-none text-base leading-relaxed text-foreground sm:text-lg md:text-xl"
        dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(body) }}
      />
    );
  }

  // Legacy plain-text format — preserve previous behaviour exactly: keep
  // newlines via `whitespace-pre-line` and convert `*text*` to <em>.
  return (
    <div
      className="whitespace-pre-line text-base leading-relaxed text-foreground sm:text-lg md:text-xl [&_em]:italic"
      dangerouslySetInnerHTML={{
        __html: body.replace(/\*([^*]+)\*/g, "<em>$1</em>"),
      }}
    />
  );
}
