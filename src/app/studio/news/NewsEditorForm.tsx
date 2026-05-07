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
import { StudioDatePicker } from "../_brand/StudioDatePicker";
import { StudioRichTextEditor } from "../_brand/StudioRichTextEditor";
import { slugify } from "../_brand/slugify";
import { bodyArrayToString } from "@/lib/rich-body";

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

export function NewsEditorForm({ initial, mode }: { initial: NewsArticle; mode: "new" | "edit" }) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle>(initial);
  const [galleryText, setGalleryText] = useState(galleryToText(initial.gallery));
  // The body is stored on disk as `string[]` for legacy compatibility. When
  // edited through the rich text editor we save the entire HTML payload as a
  // single-element array. Normalising on load means the editor always
  // receives one string (legacy multi-paragraph entries get joined into a
  // single block of text that `legacyBodyToHtml` then converts to <p> tags).
  const [bodyHtml, setBodyHtml] = useState(bodyArrayToString(initial.body));
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Auto-fill the slug from `title` while the user hasn't customised it. Once
  // they type into the slug field directly, we stop syncing. In edit mode
  // the slug field is disabled anyway.
  const [slugTouched, setSlugTouched] = useState(mode === "edit" || Boolean(initial.slug));

  function set<K extends keyof NewsArticle>(key: K, value: NewsArticle[K]) {
    setArticle((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(value: string) {
    setArticle((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function onSlugChange(value: string) {
    setSlugTouched(true);
    set("slug", slugify(value));
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
    // Wrap the HTML in a single-element array so the existing schema is
    // happy; the public renderer detects HTML vs legacy paragraphs.
    const body = bodyHtml.trim() ? [bodyHtml] : [];
    const payload: NewsArticle = {
      ...article,
      gallery: textToGallery(galleryText),
      body,
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
            hint={
              mode === "edit"
                ? "Locked once an article is created"
                : slugTouched
                  ? "Custom — won't auto-update from Title"
                  : "Auto-filled from Title; type to customise"
            }
          >
            <StudioInput
              value={article.slug}
              onChange={(e) => onSlugChange(e.target.value)}
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
          <StudioInput value={article.title} onChange={(e) => onTitleChange(e.target.value)} />
        </StudioField>

        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField label="Category">
            <StudioInput value={article.category} onChange={(e) => set("category", e.target.value)} />
          </StudioField>

          <StudioDatePicker
            label="Date"
            hint="Pick from the calendar or type freely (e.g. Spring 2026, TBC)"
            value={article.date}
            onChange={(v) => set("date", v)}
            mode="single"
          />
        </div>

        <StudioField label="Hero image" hint="Paste an image URL or upload one from your computer">
          <StudioInput value={article.image} onChange={(e) => set("image", e.target.value)} />
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadImage(f);
            }}
            className="mt-3 block font-serif text-[0.85rem] text-black/55 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:font-serif file:text-[0.78rem] file:font-semibold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-homeHero hover:file:text-black"
          />
        </StudioField>

        <StudioField label="Gallery" hint="One image URL per line — optional">
          <StudioTextarea value={galleryText} onChange={(e) => setGalleryText(e.target.value)} rows={4} />
        </StudioField>

        <StudioRichTextEditor
          label="Body"
          hint="Long-form copy for the article. Formatting (headings, lists, links, emphasis) renders identically on the public site."
          value={bodyHtml}
          onChange={setBodyHtml}
          minRows={10}
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
