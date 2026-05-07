"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsArticle } from "@/data/news";
import {
  StudioButton,
  StudioCard,
  StudioField,
  StudioInput,
  StudioTextarea,
} from "../_brand/StudioBrand";

function galleryToText(g?: string[]) {
  return g?.length ? g.join("\n") : "";
}

function textToGallery(text: string): string[] | undefined {
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.length ? lines : undefined;
}

function bodyToText(body: string[]) {
  return body.join("\n\n");
}

function textToBody(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function NewsEditorForm({ initial, mode }: { initial: NewsArticle; mode: "new" | "edit" }) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle>(initial);
  const [galleryText, setGalleryText] = useState(galleryToText(initial.gallery));
  const [bodyText, setBodyText] = useState(bodyToText(initial.body));
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) {
    setArticle((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("prefix", "news");
      const res = await fetch("/api/studio/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.url) set("image", data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload: NewsArticle = {
      ...article,
      gallery: textToGallery(galleryText),
      body: textToBody(bodyText),
    };
    try {
      const method = mode === "new" ? "POST" : "PUT";
      const url = mode === "new" ? "/api/studio/news" : `/api/studio/news/${encodeURIComponent(article.slug)}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: payload, sortOrder }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/studio/news");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this article?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/studio/news/${encodeURIComponent(article.slug)}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.push("/studio/news");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudioCard className="mx-auto max-w-3xl !p-7 sm:!p-10">
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField
            label="Slug · URL"
            hint={mode === "edit" ? "Locked once an article is created" : "Lower-case, dashes for spaces"}
          >
            <StudioInput
              value={article.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              disabled={mode === "edit"}
            />
          </StudioField>

          <StudioField label="Sort order" hint="Lower numbers appear first">
            <StudioInput
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            />
          </StudioField>
        </div>

        <StudioField label="Title">
          <StudioInput value={article.title} onChange={(e) => set("title", e.target.value)} />
        </StudioField>

        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField label="Category">
            <StudioInput value={article.category} onChange={(e) => set("category", e.target.value)} />
          </StudioField>

          <StudioField label="Date" hint="Display string, e.g. 12 June 2026">
            <StudioInput value={article.date} onChange={(e) => set("date", e.target.value)} />
          </StudioField>
        </div>

        <StudioField label="Hero image" hint="Paste a URL or upload directly to Supabase Storage">
          <StudioInput value={article.image} onChange={(e) => set("image", e.target.value)} />
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadImage(f);
            }}
            className="mt-3 block font-serif text-[0.85rem] text-black/55 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:font-display file:text-[0.65rem] file:font-black file:uppercase file:tracking-[0.22em] file:text-white hover:file:bg-homeHero hover:file:text-black"
          />
        </StudioField>

        <StudioField label="Gallery" hint="One image URL per line — optional">
          <StudioTextarea value={galleryText} onChange={(e) => setGalleryText(e.target.value)} rows={4} />
        </StudioField>

        <StudioField label="Body" hint="Use a blank line to separate paragraphs">
          <StudioTextarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={12} />
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
          <StudioButton
            type="button"
            onClick={() => void save()}
            disabled={saving || !article.slug.trim() || !article.title.trim()}
          >
            {saving ? "Saving…" : "Save"}
          </StudioButton>
          {mode === "edit" && (
            <StudioButton
              type="button"
              variant="destructive"
              onClick={() => void remove()}
              disabled={saving}
            >
              Delete article
            </StudioButton>
          )}
        </div>
      </div>
    </StudioCard>
  );
}
