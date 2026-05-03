"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SitePageRecord } from "@/lib/cms/pages-repo";
import { DEFAULT_SUPPORT_PARAGRAPHS, SUPPORT_PAGE_SLUG } from "@/data/support-static";

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
    return <p className="text-sm text-neutral-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-neutral-400">
        Use a line containing only <code className="text-neutral-300">---</code> between paragraphs. Include the
        phrase <code className="text-neutral-300">contact us</code> in the last paragraph to keep the contact link.
      </p>
      <label className="block text-sm">
        <span className="text-neutral-400">Heading (optional override)</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Body</span>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={18}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-sm text-white"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("Support");
            setBodyText(joinParas(DEFAULT_SUPPORT_PARAGRAPHS));
          }}
          className="rounded border border-neutral-600 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
        >
          Reset to defaults (preview only)
        </button>
      </div>
      {slug === SUPPORT_PAGE_SLUG && (
        <p className="text-xs text-neutral-500">
          After saving, open <Link href="/support" className="text-amber-400 hover:underline">/support</Link> to
          verify.
        </p>
      )}
    </div>
  );
}
