"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SitePageRecord } from "@/lib/cms/pages-repo";
import { getSitePageDefaults } from "@/data/site-pages-static";
import {
  StudioButton,
  StudioCard,
  StudioField,
  StudioInput,
} from "../../../_brand/StudioBrand";
import { StudioRichTextEditor } from "../../../_brand/StudioRichTextEditor";
import { bodyArrayToString } from "@/lib/rich-body";

/**
 * Slug-aware editor for everything under "Site pages". Uses the registry in
 * `@/data/site-pages-static` to resolve per-slug defaults (heading + body)
 * and the public path used for the post-save "open live" link. Saves the
 * rich text editor's HTML output as a single-element `paragraphs` array;
 * the public renderer (`<SitePageBody />`) detects HTML vs legacy data and
 * picks the right rendering path.
 */
export function SitePageEditor({ slug }: { slug: string }) {
  const router = useRouter();
  const defaults = getSitePageDefaults(slug);
  const fallbackTitle = defaults?.title ?? "";
  const fallbackBody = bodyArrayToString(defaults?.defaultParagraphs ?? []);
  const livePath = defaults?.path;

  const [title, setTitle] = useState(fallbackTitle);
  // Body is stored as `paragraphs: string[]`. When edited through the rich
  // text editor we save a single-element array containing HTML; legacy
  // entries get joined into one block for the editor to render via
  // `legacyBodyToHtml`.
  const [bodyHtml, setBodyHtml] = useState(fallbackBody);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/studio/pages/${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          if (!cancelled) {
            setTitle(fallbackTitle);
            setBodyHtml(fallbackBody);
          }
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as SitePageRecord;
        if (!cancelled) {
          setTitle(data.title?.trim() || fallbackTitle);
          setBodyHtml(
            data.paragraphs?.length ? bodyArrayToString(data.paragraphs) : fallbackBody,
          );
        }
      } catch {
        if (!cancelled) setBodyHtml(fallbackBody);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // We deliberately re-init on slug change only; defaults derived from slug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function save() {
    setSaving(true);
    setError(null);
    const trimmed = bodyHtml.trim();
    if (!trimmed) {
      setError("Body cannot be empty.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`/api/studio/pages/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: {
            slug,
            title: title.trim() || fallbackTitle,
            paragraphs: [trimmed],
          } satisfies SitePageRecord,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/studio/pages");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <StudioCard className="mx-auto max-w-3xl">
        <p className="font-serif text-[0.95rem] text-black/55">Loading…</p>
      </StudioCard>
    );
  }

  return (
    <StudioCard className="mx-auto max-w-3xl !p-7 sm:!p-10">
      <div className="space-y-6">
        <StudioField
          label="Heading"
          hint={
            fallbackTitle
              ? `Optional override — defaults to "${fallbackTitle}"`
              : "Optional override"
          }
        >
          <StudioInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </StudioField>

        <StudioRichTextEditor
          label="Body"
          hint="Format with headings, lists, links and emphasis. Output renders identically on the public site."
          value={bodyHtml}
          onChange={setBodyHtml}
          minRows={14}
        />

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-500/30 bg-red-50/70 px-4 py-3 font-serif text-[0.9rem] text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-6">
          <StudioButton type="button" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </StudioButton>
          <StudioButton
            type="button"
            variant="ghost"
            onClick={() => {
              setTitle(fallbackTitle);
              setBodyHtml(fallbackBody);
            }}
          >
            Reset to defaults
          </StudioButton>
        </div>

        {livePath && (
          <p className="font-serif text-[0.85rem] text-black/55">
            After saving, open{" "}
            <Link
              href={livePath}
              className="border-b border-black/30 text-black transition-colors hover:border-black"
            >
              {livePath}
            </Link>{" "}
            to verify.
          </p>
        )}
      </div>
    </StudioCard>
  );
}
