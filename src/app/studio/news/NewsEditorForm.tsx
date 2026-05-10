"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsArticle } from "@/data/news";
import {
  StudioButton,
  StudioCard,
  StudioField,
  StudioInput,
} from "../_brand/StudioBrand";
import { StudioDatePicker } from "../_brand/StudioDatePicker";
import { StudioNewsGalleryField } from "../_brand/StudioNewsGalleryField";
import { StudioNewsCategoryField } from "../_brand/StudioNewsCategoryField";
import { StudioRichTextEditor } from "../_brand/StudioRichTextEditor";
import { slugify } from "../_brand/slugify";
import { bodyArrayToString } from "@/lib/rich-body";
import { isVideoMediaUrl } from "@/lib/media-url";

export function NewsEditorForm({ initial, mode }: { initial: NewsArticle; mode: "new" | "edit" }) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle>(initial);
  // Remember the slug we loaded with so PUT can target the existing row even
  // after the editor renames it.
  const [originalSlug] = useState(initial.slug);
  // The body is stored on disk as `string[]` for legacy compatibility. When
  // edited through the rich text editor we save the entire HTML payload as a
  // single-element array. Normalising on load means the editor always
  // receives one string (legacy multi-paragraph entries get joined into a
  // single block of text that `legacyBodyToHtml` then converts to <p> tags).
  const [bodyHtml, setBodyHtml] = useState(bodyArrayToString(initial.body));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Auto-fill the slug from `title` while the user hasn't customised it. Once
  // they type into the slug field directly, we stop syncing. In edit mode
  // the slug field is disabled anyway.
  const [slugTouched, setSlugTouched] = useState(mode === "edit" || Boolean(initial.slug));
  const [heroUrlEditorOpen, setHeroUrlEditorOpen] = useState(false);

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

  async function uploadHeroMedia(file: File) {
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
      gallery: article.gallery?.length ? article.gallery : undefined,
      body,
    };
    try {
      const method = mode === "new" ? "POST" : "PUT";
      const url = mode === "new" ? "/api/studio/news" : `/api/studio/news/${encodeURIComponent(originalSlug)}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: payload }),
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
      const res = await fetch(`/api/studio/news/${encodeURIComponent(originalSlug)}`, { method: "DELETE" });
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
    <StudioCard className="mx-auto max-w-3xl !p-5 sm:!p-8 lg:!p-10">
      <div className="space-y-6">
        <StudioField
          label="Slug · URL"
          hint={
            mode === "edit"
              ? article.slug !== originalSlug
                ? `Renaming — public URL will change to /news/${article.slug || "…"}`
                : "Edit to change the public URL (existing links will break)"
              : slugTouched
                ? "Custom — won't auto-update from Title"
                : "Auto-filled from Title; type to customise"
          }
        >
          <StudioInput
            value={article.slug}
            onChange={(e) => onSlugChange(e.target.value)}
          />
        </StudioField>

        <StudioField label="Title">
          <StudioInput value={article.title} onChange={(e) => onTitleChange(e.target.value)} />
        </StudioField>

        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField label="Category">
            <StudioNewsCategoryField value={article.category} onChange={(v) => set("category", v)} />
          </StudioField>

          <StudioDatePicker
            label="Date"
            hint="Pick from the calendar or type freely (e.g. Spring 2026, TBC)"
            value={article.date}
            onChange={(v) => set("date", v)}
            mode="single"
          />
        </div>

        <StudioField
          label="Hero image or video"
          hint="Upload an image or video (MP4, WebM, MOV…) — preview updates automatically. Open “Paste media URL” if you need to paste a link."
        >
          {article.image.trim() ? (
            <div className="mt-2 overflow-hidden rounded-md border border-black/15 bg-black/[0.03]">
              {isVideoMediaUrl(article.image) ? (
                <video
                  key={article.image}
                  src={article.image}
                  controls
                  playsInline
                  className="mx-auto max-h-[min(40vh,22rem)] w-full object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- arbitrary studio/CMS URLs */
                <img
                  key={article.image}
                  src={article.image}
                  alt=""
                  className="mx-auto max-h-[min(40vh,22rem)] w-full object-contain"
                />
              )}
            </div>
          ) : (
            <p className="mt-2 font-serif text-[0.9rem] text-black/45">No hero image or video yet.</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadHeroMedia(f);
                e.target.value = "";
              }}
              className="block max-w-full font-serif text-[0.82rem] text-black/55 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-3 file:font-serif file:text-[0.78rem] file:font-semibold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-homeHero hover:file:text-black sm:file:py-2"
            />
            {article.image.trim() ? (
              <StudioButton type="button" variant="ghost" className="!min-h-10 !px-4" onClick={() => set("image", "")}>
                Clear hero
              </StudioButton>
            ) : null}
            <StudioButton
              type="button"
              variant="ghost"
              className="!min-h-10 !px-4"
              onClick={() => setHeroUrlEditorOpen((o) => !o)}
            >
              {heroUrlEditorOpen ? "Hide URL field" : "Paste media URL"}
            </StudioButton>
          </div>

          {heroUrlEditorOpen ? (
            <StudioInput
              value={article.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://… (image or video)"
              className="!mt-3"
            />
          ) : null}
        </StudioField>

        <StudioField
          label="Gallery"
          hint="Add images or videos with the file picker — previews appear below. Reorder with the arrows or remove items. Optional."
        >
          <StudioNewsGalleryField
            items={article.gallery ?? []}
            onChange={(next) => set("gallery", next.length ? next : undefined)}
            onError={setError}
            disabled={saving}
          />
        </StudioField>

        <StudioRichTextEditor
          label="Body"
          hint="Headings, lists, quotes, links, inline images, underline, strikethrough, code, rules, undo/redo — matches the public article layout."
          value={bodyHtml}
          onChange={setBodyHtml}
          minRows={10}
          bodyImageUploadPrefix="news/body"
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
