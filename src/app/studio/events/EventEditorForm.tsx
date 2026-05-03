"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventData } from "@/data/events";

const empty: EventData = {
  slug: "",
  name: "",
  description: "",
  venue: "",
  date: "",
  image: "",
  body: "",
};

export function EventEditorForm({
  initial,
  mode,
}: {
  initial: EventData;
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const [event, setEvent] = useState<EventData>(initial);
  const [sortOrder, setSortOrder] = useState(initial.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof EventData>(key: K, value: EventData[K]) {
    setEvent((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("prefix", "events");
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
    try {
      const method = mode === "new" ? "POST" : "PUT";
      const url = mode === "new" ? "/api/studio/events" : `/api/studio/events/${encodeURIComponent(event.slug)}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: { ...event, body: event.body?.trim() ? event.body : undefined },
          sortOrder,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/studio/events");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this event?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/studio/events/${encodeURIComponent(event.slug)}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      router.push("/studio/events");
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
          <span className="text-neutral-400">Slug (URL)</span>
          <input
            value={event.slug}
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
        <span className="text-neutral-400">Name</span>
        <input
          value={event.name}
          onChange={(e) => set("name", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Description</span>
        <textarea
          value={event.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Venue</span>
        <input
          value={event.venue}
          onChange={(e) => set("venue", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Date (display string)</span>
        <input
          value={event.date}
          onChange={(e) => set("date", e.target.value)}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Image URL</span>
        <input
          value={event.image}
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
        <span className="text-neutral-400">Body (optional, event detail page)</span>
        <textarea
          value={event.body ?? ""}
          onChange={(e) => set("body", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !event.slug.trim() || !event.name.trim()}
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
