import { bodyArrayToString, isHtmlBody, sanitizeBodyHtml } from "@/lib/rich-body";

/**
 * Render a news article body. The data shape is `string[]` for legacy reasons,
 * but once the studio rich text editor is used the entire HTML payload lives
 * in a single-element array. This component handles both:
 *
 * - HTML (single element starting with a tag) — sanitized + rendered through
 *   `prose prose-rcablk` so the public output matches what the editor shows.
 * - Legacy paragraph array — rendered as separate `<p>` elements, preserving
 *   whatever vertical rhythm the public layout already provides.
 *
 * The `align` prop lets the small-image variant of the news detail page keep
 * its mobile-centred / desktop-left alignment (the gallery variant is always
 * left-aligned).
 */
export function NewsBody({
  body,
  align = "left",
}: {
  body: string[];
  align?: "left" | "center-mobile";
}) {
  if (!body || body.length === 0) return null;

  const safeBody = body.filter((p): p is string => typeof p === "string");
  if (safeBody.length === 0) return null;

  const single = bodyArrayToString(safeBody);

  if (isHtmlBody(single)) {
    return (
      <div
        className={`prose prose-rcablk max-w-none font-serif text-base leading-relaxed text-black sm:text-lg md:text-xl ${
          align === "center-mobile" ? "text-center sm:text-left" : "text-left"
        }`}
        dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(single) }}
      />
    );
  }

  return (
    <div
      className={`space-y-5 font-serif text-base leading-relaxed text-black sm:space-y-6 sm:text-lg md:text-xl ${
        align === "center-mobile" ? "text-center sm:text-left" : "text-left"
      }`}
    >
      {safeBody.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
