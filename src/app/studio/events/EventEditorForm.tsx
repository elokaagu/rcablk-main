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
import { isVideoMediaUrl } from "@/lib/media-url";

export function EventEditorForm({
  initial,
  mode,
}: {
  initial: EventData;
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const [event, setEvent] = useState<EventData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Auto-fill the slug from `name` while the user hasn't customised it. Once
  // they type into the slug field directly, we stop syncing so the manual
  // value is preserved. In edit mode the slug field is disabled anyway.
  const [slugTouched, setSlugTouched] = useState(mode === "edit" || Boolean(initial.slug));
  const [heroUrlEditorOpen, setHeroUrlEditorOpen] = useState(false);

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

  async function uploadHeroMedia(file: File) {
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
    <StudioCard className="mx-auto max-w-3xl !p-5 sm:!p-8 lg:!p-10">
      <div className="space-y-6">
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

        <StudioField
          label="Hero image or video"
          hint="Upload an image or video (MP4, WebM, MOV…) — preview updates automatically. Open “Paste media URL” if you need to paste a link."
        >
          {event.image.trim() ? (
            <div className="mt-2 overflow-hidden rounded-md border border-black/15 bg-black/[0.03]">
              {isVideoMediaUrl(event.image) ? (
                <video
                  key={event.image}
                  src={event.image}
                  controls
                  playsInline
                  className="mx-auto max-h-[min(40vh,22rem)] w-full object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- arbitrary studio/CMS URLs */
                <img
                  key={event.image}
                  src={event.image}
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
            {event.image.trim() ? (
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
              value={event.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://… (image or video)"
              className="!mt-3"
            />
          ) : null}
        </StudioField>

        <StudioRichTextEditor
          label="Body"
          hint="Optional detail copy: headings, lists, quotes, links, images, underline, strikethrough, code, rules, undo/redo — same toolbar as news and site pages."
          value={event.body ?? ""}
          onChange={(html) => set("body", html)}
          minRows={8}
          bodyImageUploadPrefix="events/body"
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
