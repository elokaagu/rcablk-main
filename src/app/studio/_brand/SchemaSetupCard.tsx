"use client";

import { useState } from "react";
import { StudioButton, StudioEyebrow, StudioInlineCode } from "./StudioBrand";

/**
 * The visible card shown when the studio detects that the Supabase schema
 * hasn't been applied yet. Walks the user through the two steps: (1) open the
 * SQL editor, (2) paste the bundled schema and run it. Falls back gracefully
 * when the dashboard URL can't be derived from the Supabase URL.
 */
export function SchemaSetupCard({
  sql,
  sqlEditorUrl,
  reason,
}: {
  sql: string;
  sqlEditorUrl: string | null;
  reason?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* swallow — most browsers fail when not in a secure context */
    }
  }

  return (
    <section className="overflow-hidden rounded-md border border-amber-500/40 bg-amber-50/60">
      <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 sm:py-8">
        <StudioEyebrow>Setup required</StudioEyebrow>
        <h2 className="font-serif text-[1.6rem] font-normal leading-[1.1] tracking-[-0.01em] sm:text-[2rem]">
          Apply the database schema to your Supabase project
        </h2>
        <p className="max-w-2xl font-serif text-[1rem] leading-relaxed text-black/70">
          Supabase is connected, but the studio tables ({" "}
          <StudioInlineCode>events</StudioInlineCode>,{" "}
          <StudioInlineCode>news_articles</StudioInlineCode>,{" "}
          <StudioInlineCode>site_pages</StudioInlineCode>) don&apos;t exist yet. Run the SQL below in your
          Supabase SQL editor — it&apos;s safe to re-run.
        </p>

        {reason && (
          <p className="max-w-2xl rounded-md border border-amber-500/30 bg-white/70 px-3 py-2 font-mono text-[0.78rem] leading-relaxed text-amber-900">
            {reason}
          </p>
        )}

        <ol className="flex max-w-2xl list-decimal flex-col gap-2 pl-5 font-serif text-[0.95rem] leading-relaxed text-black/75 marker:text-black/40">
          <li>
            Open the SQL editor for this Supabase project.
            {sqlEditorUrl ? (
              <span> The button below opens it in a new tab, prefilled.</span>
            ) : (
              <span>
                {" "}
                Couldn&apos;t derive the project URL from{" "}
                <StudioInlineCode>NEXT_PUBLIC_SUPABASE_URL</StudioInlineCode> — open{" "}
                <a
                  className="border-b border-black/30 transition-colors hover:border-black"
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                >
                  supabase.com/dashboard
                </a>{" "}
                manually.
              </span>
            )}
          </li>
          <li>
            Copy the SQL below, paste it into a new query, and press <strong className="font-semibold">Run</strong>.
            Verify a green &ldquo;Success&rdquo; toast.
          </li>
          <li>
            Also create a public Storage bucket named <StudioInlineCode>media</StudioInlineCode> if you plan to
            upload images from the studio.
          </li>
          <li>Refresh this page — the studio will pick up the new tables.</li>
        </ol>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {sqlEditorUrl && (
            <StudioButton as="a" href={sqlEditorUrl} target="_blank" rel="noreferrer" variant="primary">
              Open SQL editor ↗
            </StudioButton>
          )}
          <StudioButton type="button" variant="ghost" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy SQL"}
          </StudioButton>
        </div>
      </div>

      <div className="border-t border-amber-500/30 bg-white/60">
        <pre className="max-h-[28rem] overflow-auto px-6 py-5 font-mono text-[0.78rem] leading-relaxed text-black sm:px-8">
          <code>{sql}</code>
        </pre>
      </div>
    </section>
  );
}
