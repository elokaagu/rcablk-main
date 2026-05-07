"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";

export type AlumniPreviewData = {
  name: string;
  snapshot: string;
  link?: string;
};

type Ctx = {
  preview: AlumniPreviewData | null;
  openPreview: (d: AlumniPreviewData) => void;
  scheduleCloseFromName: () => void;
  scheduleCloseFromPanel: () => void;
  cancelClose: () => void;
};

const LEAVE_NAME_MS = 750;
const LEAVE_PANEL_MS = 160;

const AlumniPreviewCtx = createContext<Ctx | null>(null);

export function AlumniPreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<AlumniPreviewData | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (t.current) clearTimeout(t.current);
    t.current = null;
  };

  useEffect(() => () => clearTimer(), []);

  const openPreview = useCallback((d: AlumniPreviewData) => {
    clearTimer();
    setPreview(d);
  }, []);

  const scheduleCloseFromName = useCallback(() => {
    clearTimer();
    t.current = setTimeout(() => setPreview(null), LEAVE_NAME_MS);
  }, []);

  const scheduleCloseFromPanel = useCallback(() => {
    clearTimer();
    t.current = setTimeout(() => setPreview(null), LEAVE_PANEL_MS);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimer();
  }, []);

  const value = useMemo(
    () => ({
      preview,
      openPreview,
      scheduleCloseFromName,
      scheduleCloseFromPanel,
      cancelClose,
    }),
    [preview, openPreview, scheduleCloseFromName, scheduleCloseFromPanel, cancelClose]
  );

  return <AlumniPreviewCtx.Provider value={value}>{children}</AlumniPreviewCtx.Provider>;
}

export function useAlumniPreview() {
  const ctx = useContext(AlumniPreviewCtx);
  if (!ctx) throw new Error("useAlumniPreview must be used within AlumniPreviewProvider");
  return ctx;
}

/** Desktop: sticky preview in the right margin. Mobile: block below names (no overlay). */
export function AlumniPreviewAside() {
  const { preview, cancelClose, scheduleCloseFromPanel } = useAlumniPreview();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!preview || typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [preview]);

  return (
    <aside
      ref={ref}
      className="mx-auto w-full max-w-[280px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none lg:w-[280px] lg:shrink-0 lg:self-start lg:sticky lg:top-28"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleCloseFromPanel}
    >
      {preview ? (
        <div className="flex flex-col gap-2">
          <p className="text-center font-serif text-sm text-foreground/80 lg:text-left">{preview.name}</p>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
            <BlurImage
              src={preview.snapshot}
              alt={`${preview.name} – work`}
              aspectRatio="3/4"
              sizes="280px"
              priority={false}
            />
          </div>
          {preview.link && (
            <Link
              href={preview.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-center text-sm text-foreground underline decoration-black/30 underline-offset-2 hover:opacity-80 lg:text-left"
              onClick={cancelClose}
            >
              View work →
            </Link>
          )}
        </div>
      ) : (
        <div
          aria-hidden
          className="relative hidden aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/85 via-white/60 to-white/40 ring-1 ring-inset ring-black/[0.06] shadow-[0_1px_24px_-12px_rgba(0,0,0,0.18)] lg:block"
        >
          {/* Geometric echo of the BLK marque, kept very faint */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-[58%] rounded-full border border-foreground/[0.08]" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30" />

          {/* Live indicator dot */}
          <span className="absolute right-4 top-4 flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
            <span className="relative inline-flex size-2 rounded-full bg-foreground/70" />
          </span>

          {/* Caption stack pinned to the bottom-left, mirroring the layout
              of the loaded preview where the artist name sits above the work. */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-5 pb-5">
            <p className="font-display text-[0.6rem] font-black uppercase tracking-[0.22em] text-foreground/55">
              Preview
            </p>
            <p className="font-serif text-[0.95rem] leading-snug text-foreground/75">
              Hover a name to see their work
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
