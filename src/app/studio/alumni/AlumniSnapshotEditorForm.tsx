"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  StudioButton,
  StudioCard,
  StudioField,
  StudioInput,
} from "../_brand/StudioBrand";

export type AlumniSnapshotEditorInitial = {
  slug: string;
  name: string;
  staticSnapshot: string;
  snapshot: string;
  hasOverride: boolean;
};

export function AlumniSnapshotEditorForm({ initial }: { initial: AlumniSnapshotEditorInitial }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(initial.snapshot);
  const [hasOverride, setHasOverride] = useState(initial.hasOverride);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlEditorOpen, setUrlEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = `/api/studio/alumni/${encodeURIComponent(initial.slug)}`;

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("prefix", "alumni");
      const res = await fetch("/api/studio/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.url) setSnapshot(data.url);
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
      const res = await fetch(apiBase, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      setHasOverride(true);
      router.push("/studio/alumni");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function revertToDefault() {
    if (!hasOverride && snapshot === (initial.staticSnapshot || "")) return;
    if (!confirm("Revert to the bundled default image? This removes your Studio override.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(apiBase, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Revert failed");
      setSnapshot(initial.staticSnapshot);
      setHasOverride(false);
      router.push("/studio/alumni");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Revert failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudioCard className="mx-auto max-w-3xl !p-5 sm:!p-8 lg:!p-10">
      <div className="space-y-6">
        <StudioField label="Name" hint="Names are managed in src/data/alumni.ts">
          <StudioInput value={initial.name} disabled />
        </StudioField>

        <StudioField
          label="Preview image"
          hint="Shown when visitors hover this name on the public Alumni page. Upload a portrait or paste an image URL."
        >
          {snapshot.trim() ? (
            <div className="mt-2 overflow-hidden rounded-md border border-black/15 bg-black/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary studio/CMS URLs */}
              <img
                key={snapshot}
                src={snapshot}
                alt=""
                className="mx-auto max-h-[min(50vh,28rem)] w-full object-contain"
              />
            </div>
          ) : (
            <p className="mt-2 font-serif text-[0.9rem] text-black/45">No preview image yet.</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadImage(f);
                e.target.value = "";
              }}
              className="block max-w-full font-serif text-[0.82rem] text-black/55 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-3 file:font-serif file:text-[0.78rem] file:font-semibold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-homeHero hover:file:text-black sm:file:py-2"
            />
            <StudioButton
              type="button"
              variant="ghost"
              className="!min-h-10 !px-4"
              onClick={() => setUrlEditorOpen((o) => !o)}
            >
              {urlEditorOpen ? "Hide URL field" : "Paste image URL"}
            </StudioButton>
          </div>

          {urlEditorOpen ? (
            <StudioInput
              value={snapshot}
              onChange={(e) => setSnapshot(e.target.value)}
              placeholder="https://… or /alumni-previews/…"
              className="!mt-3"
            />
          ) : null}
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
            disabled={saving || !snapshot.trim()}
          >
            {saving ? "Saving…" : "Save image"}
          </StudioButton>
          {hasOverride ? (
            <StudioButton type="button" variant="ghost" onClick={() => void revertToDefault()} disabled={saving}>
              {initial.staticSnapshot ? "Revert to default" : "Remove custom image"}
            </StudioButton>
          ) : null}
        </div>
      </div>
    </StudioCard>
  );
}
