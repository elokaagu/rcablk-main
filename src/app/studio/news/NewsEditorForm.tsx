"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsArticle } from "@/data/news";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-neutral-400">Slug</span>
          <input
            value={article.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            disabled={mode === "edit"}
            className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-60"
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Sort order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-neutral-400">Title</span>
        <input
          value={article.title}
          onChange={(e) => set("title", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Category</span>
        <input
          value={article.category}
          onChange={(e) => set("category", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Date (display)</span>
        <input
          value={article.date}
          onChange={(e) => set("date", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Hero image URL</span>
        <input
          value={article.image}
          onChange={(e) => set("image", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2 block text-xs text-neutral-500 file:mr-3 file:rounded file:border-0 file:bg-neutral-700 file:px-3 file:py-1.5 file:text-sm file:text-white"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadImage(f);
          }}
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Gallery image URLs (one per line, optional)</span>
        <textarea
          value={galleryText}
          onChange={(e) => setGalleryText(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Body paragraphs (blank line between paragraphs)</span>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={10}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !article.slug.trim() || !article.title.trim()}
          className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={saving}
            className="rounded border border-red-800 px-4 py-2 text-sm text-red-300 hover:bg-red-950/50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
