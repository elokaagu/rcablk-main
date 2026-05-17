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
  link?: string;
  snapshot?: string;
  loading?: boolean;
  unavailable?: boolean;
};

type Ctx = {
  preview: AlumniPreviewData | null;
  openPreviewForMember: (member: { name: string; link?: string; snapshot?: string }) => void;
  scheduleCloseFromName: () => void;
  scheduleCloseFromPanel: () => void;
  cancelClose: () => void;
};

const LEAVE_NAME_MS = 750;
const LEAVE_PANEL_MS = 160;

const AlumniPreviewCtx = createContext<Ctx | null>(null);

const previewImageCache = new Map<string, string | null>();

function isLocalSnapshot(src: string) {
  return src.startsWith("/");
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  if (isLocalSnapshot(src)) {
    return (
      <BlurImage
        src={src}
        alt={alt}
        aspectRatio="3/4"
        sizes="280px"
        priority={false}
        className="h-full w-full"
        fill
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export function AlumniPreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<AlumniPreviewData | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchAbort = useRef<AbortController | null>(null);
  const requestId = useRef(0);

  const clearTimer = () => {
    if (t.current) clearTimeout(t.current);
    t.current = null;
  };

  useEffect(() => () => {
    clearTimer();
    fetchAbort.current?.abort();
  }, []);

  const openPreviewForMember = useCallback(
    ({ name, link, snapshot }: { name: string; link?: string; snapshot?: string }) => {
      clearTimer();
      fetchAbort.current?.abort();

      if (snapshot) {
        setPreview({ name, snapshot, link });
        return;
      }

      if (!link) return;

      const cached = previewImageCache.get(link);
      if (cached !== undefined) {
        if (cached) {
          setPreview({ name, snapshot: cached, link });
        } else {
          setPreview({ name, link, unavailable: true });
        }
        return;
      }

      const id = ++requestId.current;
      setPreview({ name, link, loading: true });

      const ac = new AbortController();
      fetchAbort.current = ac;

      void (async () => {
        try {
          const res = await fetch(`/api/alumni-preview?url=${encodeURIComponent(link)}`, {
            signal: ac.signal,
          });
          if (!res.ok) throw new Error("preview failed");
          const data = (await res.json()) as { imageUrl?: string | null };
          if (requestId.current !== id) return;

          const imageUrl = data.imageUrl ?? null;
          previewImageCache.set(link, imageUrl);

          if (imageUrl) {
            setPreview({ name, snapshot: imageUrl, link });
          } else {
            setPreview({ name, link, unavailable: true });
          }
        } catch (err) {
          if (ac.signal.aborted) return;
          if (requestId.current !== id) return;
          previewImageCache.set(link, null);
          setPreview({ name, link, unavailable: true });
        }
      })();
    },
    [],
  );

  const scheduleCloseFromName = useCallback(() => {
    clearTimer();
    t.current = setTimeout(() => {
      fetchAbort.current?.abort();
      setPreview(null);
    }, LEAVE_NAME_MS);
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
      openPreviewForMember,
      scheduleCloseFromName,
      scheduleCloseFromPanel,
      cancelClose,
    }),
    [preview, openPreviewForMember, scheduleCloseFromName, scheduleCloseFromPanel, cancelClose],
  );

  return <AlumniPreviewCtx.Provider value={value}>{children}</AlumniPreviewCtx.Provider>;
}

export function useAlumniPreview() {
  const ctx = useContext(AlumniPreviewCtx);
  if (!ctx) throw new Error("useAlumniPreview must be used within AlumniPreviewProvider");
  return ctx;
}

/** Desktop: fixed preview beside the list (immune to overflow/sticky bugs). Mobile: below names. */
export function AlumniPreviewAside() {
  const { preview, cancelClose, scheduleCloseFromPanel } = useAlumniPreview();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!preview || typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [preview]);

  const panelTop = "max(5.5rem, calc(env(safe-area-inset-top, 0px) + 3.5rem))";

  return (
    <aside
      ref={ref}
      className="mx-auto w-full max-w-[280px] lg:mx-0 lg:w-[280px]"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleCloseFromPanel}
    >
      <div
        className="w-full lg:fixed lg:right-8 lg:z-20 lg:w-[280px] xl:right-[max(3rem,calc((100vw-72rem)/2+3rem))]"
        style={{ top: panelTop }}
      >
      {preview ? (
        <div className="flex flex-col gap-2">
          <p className="text-center font-serif text-sm text-foreground/80 lg:text-left">{preview.name}</p>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
            {preview.loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90 px-4">
                <span className="size-8 animate-spin rounded-full border-2 border-black/15 border-t-black/60" />
                <p className="text-center font-serif text-sm text-foreground/60">Loading preview…</p>
              </div>
            ) : preview.snapshot ? (
              <PreviewImage src={preview.snapshot} alt={`${preview.name} – work`} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white via-white/95 to-white/80 px-5 text-center">
                <p className="font-serif text-sm leading-snug text-foreground/70">
                  {preview.unavailable
                    ? "No preview image available for this site."
                    : "Hover a linked name to load a preview."}
                </p>
              </div>
            )}
          </div>
          {preview.link && !preview.link.startsWith("mailto:") ? (
            <Link
              href={preview.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-center text-sm text-foreground underline decoration-black/30 underline-offset-2 hover:opacity-80 lg:text-left"
              onClick={cancelClose}
            >
              View work →
            </Link>
          ) : null}
        </div>
      ) : (
        <div
          aria-hidden
          className="relative hidden aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/85 via-white/60 to-white/40 ring-1 ring-inset ring-black/[0.06] shadow-[0_1px_24px_-12px_rgba(0,0,0,0.18)] lg:block"
        >
          <span className="pointer-events-none absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-[58%] rounded-full border border-foreground/[0.08]" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30" />

          <span className="absolute right-4 top-4 flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
            <span className="relative inline-flex size-2 rounded-full bg-foreground/70" />
          </span>

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
      </div>
    </aside>
  );
}
