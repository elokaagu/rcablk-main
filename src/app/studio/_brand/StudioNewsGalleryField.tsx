"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { isVideoMediaUrl } from "@/lib/media-url";
import { StudioButton } from "./StudioBrand";

export function StudioNewsGalleryField({
  items,
  onChange,
  onError,
  disabled = false,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  onError: (message: string | null) => void;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const busyOrDisabled = busy || disabled;

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setBusy(true);
    onError(null);
    try {
      const next = [...items];
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("prefix", "news/gallery");
        const res = await fetch("/api/studio/upload", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) throw new Error(data.error || "Upload failed");
        if (data.url) next.push(data.url);
      }
      onChange(next);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }

  return (
    <div className="mt-2 space-y-3">
      {items.length === 0 ? (
        <p className="font-serif text-[0.9rem] text-black/45">No gallery items yet.</p>
      ) : (
        <ul
          className="flex flex-wrap gap-3"
          aria-label="Gallery items"
        >
          {items.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="relative w-[6.5rem] shrink-0 overflow-hidden rounded-md border border-black/15 bg-black/[0.04] sm:w-[7.5rem]"
            >
              <div className="relative aspect-[3/4] w-full">
                {isVideoMediaUrl(src) ? (
                  <video
                    src={src}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 size-full object-cover"
                    aria-label={`Gallery video ${i + 1} of ${items.length}`}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element -- studio/CMS URLs */
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 border-t border-black/10 bg-white/95 px-1.5 py-1.5">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    aria-label={`Move item ${i + 1} left`}
                    disabled={busyOrDisabled || i === 0}
                    onClick={() => move(i, -1)}
                    className="inline-flex size-8 items-center justify-center rounded border border-black/15 bg-white font-serif text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move item ${i + 1} right`}
                    disabled={busyOrDisabled || i === items.length - 1}
                    onClick={() => move(i, 1)}
                    className="inline-flex size-8 items-center justify-center rounded border border-black/15 bg-white font-serif text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Remove gallery item ${i + 1}`}
                  disabled={busyOrDisabled}
                  onClick={() => removeAt(i)}
                  className="inline-flex size-8 items-center justify-center rounded border border-black/15 bg-white text-black transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"
          disabled={busyOrDisabled}
          onChange={(e) => {
            void uploadFiles(e.target.files);
            e.target.value = "";
          }}
          className="block max-w-full font-serif text-[0.82rem] text-black/55 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-3 file:font-serif file:text-[0.78rem] file:font-semibold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-homeHero hover:file:text-black sm:file:py-2"
        />
        {busy ? (
          <span className="font-serif text-[0.82rem] text-black/55">Uploading…</span>
        ) : null}
      </div>

      {items.length > 0 ? (
        <StudioButton
          type="button"
          variant="ghost"
          className="!min-h-10 !px-4"
          disabled={busyOrDisabled}
          onClick={() => onChange([])}
        >
          Clear gallery
        </StudioButton>
      ) : null}
    </div>
  );
}
