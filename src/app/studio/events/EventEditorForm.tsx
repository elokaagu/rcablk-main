"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventData } from "@/data/events";
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
  // Auto-fill the slug from `name` while the user hasn't customised it. Once
  // they type into the slug field directly, we stop syncing so the manual
  // value is preserved. In edit mode the slug field is disabled anyway.
  const [slugTouched, setSlugTouched] = useState(mode === "edit" || Boolean(initial.slug));

  function set<K extends keyof EventData>(key: K, value: EventData[K]) {
    setEvent((prev) => ({ ...prev, [key]: value }));
  }

  function onNameChange(value: string) {
    setEvent((prev) => ({
      ...prev,
      name: value,
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
    <StudioCard className="mx-auto max-w-3xl !p-7 sm:!p-10">
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField
            label="Slug · URL"
            hint={
              mode === "edit"
                ? "Locked once an entry is created"
                : slugTouched
                  ? "Custom — won't auto-update from Name"
                  : "Auto-filled from Name; type to customise"
            }
          >
            <StudioInput
              value={event.slug}
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

        <StudioField label="Name">
          <StudioInput value={event.name} onChange={(e) => onNameChange(e.target.value)} />
        </StudioField>

        <StudioField label="Description" hint="Short summary used in the programme grid">
          <StudioTextarea
            value={event.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
          />
        </StudioField>

        <div className="grid gap-6 sm:grid-cols-2">
          <StudioField label="Venue">
            <StudioInput value={event.venue} onChange={(e) => set("venue", e.target.value)} />
          </StudioField>

          <StudioDatePicker
            label="Date"
            hint="Pick from the calendar or type freely (e.g. Spring 2026, TBC)"
            value={event.date}
            onChange={(v) => set("date", v)}
            mode="range"
          />
        </div>

        <StudioField label="Image" hint="Paste an image URL or upload one from your computer">
          <StudioInput value={event.image} onChange={(e) => set("image", e.target.value)} />
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

        <StudioRichTextEditor
          label="Body"
          hint="Optional long-form copy for the event detail page. Formatting (headings, lists, links, emphasis) renders identically on the public site."
          value={event.body ?? ""}
          onChange={(html) => set("body", html)}
          minRows={8}
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
            disabled={saving || !event.slug.trim() || !event.name.trim()}
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
              Delete event
            </StudioButton>
          )}
        </div>
      </div>
    </StudioCard>
  );
}
