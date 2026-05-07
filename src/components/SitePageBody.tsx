import Link from "next/link";
import { bodyArrayToString, isHtmlBody, sanitizeBodyHtml } from "@/lib/rich-body";

/**
 * Generic body renderer for any page managed under "Site pages" in the
 * studio. Two shapes are supported, mirroring the data model in
 * `site_pages.paragraphs`:
 *
 * - Legacy: an array of plain-text paragraphs. Each paragraph becomes a
 *   sibling `<p>` so the parent's `AnimateStagger` can fade them in one
 *   after another. The phrase "contact us" in the final paragraph is
 *   auto-linked to `/contact` so the original Support-page convention keeps
 *   working without a migration.
 *
 * - Rich text editor output: a single-element array whose first item is
 *   HTML. Sanitized and rendered through `prose prose-rcablk` so the public
 *   typography matches the studio editor exactly. Returns a single block;
 *   the parent's stagger then treats it as one fade-in.
 */
export function SitePageBody({ paragraphs }: { paragraphs: string[] }) {
  const single = bodyArrayToString(paragraphs);

  if (isHtmlBody(single)) {
    return (
      <div
        className="prose prose-rcablk max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(single) }}
      />
    );
  }

  return (
    <>
      {paragraphs.map((text, i) => {
        const isLast = i === paragraphs.length - 1;
        if (isLast && /contact us/i.test(text)) {
          const m = text.match(/contact us/i);
          if (m && m.index !== undefined && m[0]) {
            const idx = m.index;
            const before = text.slice(0, idx);
            const after = text.slice(idx + m[0].length);
            return (
              <p key={i}>
                {before}
                <Link
                  href="/contact"
                  className="underline decoration-black/50 underline-offset-[0.15em] hover:opacity-80"
                >
                  contact us
                </Link>
                {after}
              </p>
            );
          }
        }
        return <p key={i}>{text}</p>;
      })}
    </>
  );
}
