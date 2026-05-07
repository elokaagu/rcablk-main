"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SitePageRecord } from "@/lib/cms/pages-repo";
import { DEFAULT_SUPPORT_PARAGRAPHS, SUPPORT_PAGE_SLUG } from "@/data/support-static";
import {
  StudioButton,
  StudioCard,
  StudioField,
  StudioInlineCode,
  StudioInput,
  StudioTextarea,
} from "../../../_brand/StudioBrand";

function joinParas(p: string[]) {
  return p.join("\n\n---\n\n");
}

function splitParas(text: string): string[] {
  return text
    .split(/\n-{3,}\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function SupportPageEditor({ slug }: { slug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("Support");
  const [bodyText, setBodyText] = useState(joinParas(DEFAULT_SUPPORT_PARAGRAPHS));
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
            setTitle("Support");
            setBodyText(joinParas(DEFAULT_SUPPORT_PARAGRAPHS));
          }
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as SitePageRecord;
        if (!cancelled) {
          setTitle(data.title?.trim() || "Support");
          setBodyText(joinParas(data.paragraphs?.length ? data.paragraphs : DEFAULT_SUPPORT_PARAGRAPHS));
        }
      } catch {
        if (!cancelled) setBodyText(joinParas(DEFAULT_SUPPORT_PARAGRAPHS));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function save() {
    setSaving(true);
    setError(null);
    const paragraphs = splitParas(bodyText);
    if (paragraphs.length < 1) {
      setError("Add at least one paragraph (use a line with only --- between paragraphs).");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`/api/studio/pages/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: { slug, title: title.trim() || "Support", paragraphs } satisfies SitePageRecord,
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
        <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-3 font-serif text-[0.9rem] leading-relaxed text-black/65">
          Use a line containing only <StudioInlineCode>---</StudioInlineCode> between paragraphs. Include the
          phrase <StudioInlineCode>contact us</StudioInlineCode> in the last paragraph to keep the contact link.
        </div>

        <StudioField label="Heading" hint="Optional override — defaults to 'Support'">
          <StudioInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </StudioField>

        <StudioField label="Body">
          <StudioTextarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={18}
            className="font-mono"
          />
        </StudioField>

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
              setTitle("Support");
              setBodyText(joinParas(DEFAULT_SUPPORT_PARAGRAPHS));
            }}
          >
            Reset to defaults
          </StudioButton>
        </div>

        {slug === SUPPORT_PAGE_SLUG && (
          <p className="font-serif text-[0.85rem] text-black/55">
            After saving, open{" "}
            <Link
              href="/support"
              className="border-b border-black/30 text-black transition-colors hover:border-black"
            >
              /support
            </Link>{" "}
            to verify.
          </p>
        )}
      </div>
    </StudioCard>
  );
}
