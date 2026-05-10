import Image from "next/image";
import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listEventsAdmin } from "@/lib/cms/events-repo";
import { listNewsAdmin } from "@/lib/cms/news-repo";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { BlurImage } from "@/components/BlurImage";
import {
  StudioButton,
  StudioEyebrow,
  StudioInlineCode,
  StudioNotice,
  StudioPageHeader,
} from "./_brand/StudioBrand";
import { StudioSchemaSetup } from "./_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "./_brand/studio-errors";
import { isVideoMediaUrl } from "@/lib/media-url";

// Tiles show live counts + the most recent hero from each collection — must
// re-fetch on every visit, otherwise the dashboard freezes at build state.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountState =
  | { ok: true; value: number; preview?: { src: string; alt: string } }
  | { ok: false; error: unknown };

type Counts = {
  events: CountState;
  news: CountState;
  pages: CountState;
};

async function loadCounts(): Promise<Counts> {
  const [events, news, pages] = await Promise.allSettled([
    listEventsAdmin(),
    listNewsAdmin(),
    listPagesAdmin(),
  ]);
  return {
    events:
      events.status === "fulfilled"
        ? {
            ok: true,
            value: events.value.length,
            preview: events.value[0]?.image
              ? { src: events.value[0].image, alt: events.value[0].name ?? "" }
              : undefined,
          }
        : { ok: false, error: events.reason },
    news:
      news.status === "fulfilled"
        ? {
            ok: true,
            value: news.value.length,
            preview: news.value[0]?.image
              ? { src: news.value[0].image, alt: news.value[0].title ?? "" }
              : undefined,
          }
        : { ok: false, error: news.reason },
    pages:
      pages.status === "fulfilled"
        ? { ok: true, value: pages.value.length }
        : { ok: false, error: pages.reason },
  };
}

/**
 * Image header for a dashboard tile. Uses a real content image when one is
 * available (latest event / news hero) and falls back to a brand-coloured
 * panel with one of the BLK letterforms — the same letterforms the public
 * homepage uses, which keeps the studio visually anchored to the brand.
 */
function TilePreview({
  image,
  fallback,
}: {
  image?: { src: string; alt: string };
  fallback: { letter: "B" | "L" | "K"; bg: string };
}) {
  if (image) {
    if (isVideoMediaUrl(image.src)) {
      return (
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
          <video
            src={image.src}
            muted
            playsInline
            className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            aria-label={image.alt}
            preload="metadata"
          />
        </div>
      );
    }
    return (
      <BlurImage
        src={image.src}
        alt={image.alt}
        aspectRatio="3/2"
        sizes="(max-width: 640px) 100vw, 33vw"
        className="w-full"
        hoverOpacity
      />
    );
  }
  const LETTER_SVG: Record<typeof fallback.letter, string> = {
    B: "/SVG Letterforms/RCA BLK\u2013Letterforms-B.svg",
    L: "/SVG Letterforms/RCA BLK\u2013Letterforms-L.svg",
    K: "/SVG Letterforms/RCA BLK\u2013Letterforms-K.svg",
  };
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden"
      style={{ backgroundColor: fallback.bg }}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[78%] w-[78%] opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <Image
            src={LETTER_SVG[fallback.letter]}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function CountTile({
  marker,
  state,
  label,
  href,
  fallback,
}: {
  marker: string;
  state: CountState | null;
  label: string;
  href: string;
  fallback: { letter: "B" | "L" | "K"; bg: string };
}) {
  const display = state?.ok ? state.value : "—";
  const preview = state?.ok ? state.preview : undefined;
  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-white transition-colors hover:bg-homeHero/[0.06] focus-visible:bg-homeHero/[0.06]"
    >
      <TilePreview image={preview} fallback={fallback} />
      <div className="flex flex-col gap-2.5 p-5 sm:gap-3 sm:p-7">
        <span className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/45 sm:text-[0.72rem]">
          {marker}
        </span>
        <span className="font-display text-[2rem] font-black leading-none tracking-[-0.02em] text-black sm:text-[2.5rem] md:text-[3rem]">
          {display}
        </span>
        <span className="font-serif text-[0.95rem] leading-tight text-black/70 sm:text-[1rem]">
          {label}
        </span>
        <span
          aria-hidden
          className="mt-1 inline-flex min-h-[40px] items-center gap-2 font-serif text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors group-hover:text-black sm:mt-2 sm:text-[0.78rem]"
        >
          <span>Open</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default async function StudioHomePage() {
  const cms = isCmsConfigured();
  const counts = cms ? await loadCounts() : null;

  // If any of the queries failed because the schema isn't applied yet, route
  // the user to the setup card up front. We only need one example error to
  // describe the situation clearly.
  const schemaErrors: unknown[] = counts
    ? [counts.events, counts.news, counts.pages]
        .filter((c): c is { ok: false; error: unknown } => !c.ok)
        .map((c) => c.error)
    : [];
  const schemaMissing = schemaErrors.some((e) => isSchemaMissingError(e));
  const otherError = schemaErrors.find((e) => !isSchemaMissingError(e));

  return (
    <div className="space-y-12">
      <StudioPageHeader
        eyebrow="Studio · Overview"
        title="Dashboard"
        description="Editorial control for the public RCA BLK site. Use the sidebar to navigate; this overview shows the current state of your content."
      />

      {!cms && (
        <StudioNotice tone="warn" title="Supabase is not configured">
          Add <StudioInlineCode>NEXT_PUBLIC_SUPABASE_URL</StudioInlineCode>,{" "}
          <StudioInlineCode>NEXT_PUBLIC_SUPABASE_ANON_KEY</StudioInlineCode> and{" "}
          <StudioInlineCode>SUPABASE_SERVICE_ROLE_KEY</StudioInlineCode> to your environment. Run the SQL in{" "}
          <StudioInlineCode>supabase/schema.sql</StudioInlineCode> and create a public Storage bucket named{" "}
          <StudioInlineCode>media</StudioInlineCode>.
        </StudioNotice>
      )}

      {cms && schemaMissing && (
        <StudioSchemaSetup
          reason={schemaErrors.map(extractErrorMessage).find(Boolean)}
        />
      )}

      {cms && !schemaMissing && Boolean(otherError) && (
        <StudioNotice tone="error" title="Could not reach Supabase">
          {extractErrorMessage(otherError)}
        </StudioNotice>
      )}

      {/* At a glance — always visible so the layout stays anchored even mid-setup */}
      <section aria-labelledby="at-a-glance" className="space-y-6">
        <div className="flex items-center justify-between">
          <StudioEyebrow>At a glance</StudioEyebrow>
          <span id="at-a-glance" className="sr-only">
            At a glance
          </span>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-black/10 bg-black/10 sm:grid-cols-3">
          <CountTile
            marker="01"
            state={counts?.events ?? null}
            label="Events on file"
            href="/studio/events"
            fallback={{ letter: "B", bg: "#FFDD00" }}
          />
          <CountTile
            marker="02"
            state={counts?.news ?? null}
            label="News articles"
            href="/studio/news"
            fallback={{ letter: "L", bg: "#F3916B" }}
          />
          <CountTile
            marker="03"
            state={counts?.pages ?? null}
            label="Site pages overridden"
            href="/studio/pages"
            fallback={{ letter: "K", bg: "#F0E7D5" }}
          />
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions" className="space-y-6">
        <div className="flex items-center justify-between">
          <StudioEyebrow>Quick actions</StudioEyebrow>
          <span id="quick-actions" className="sr-only">
            Quick actions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StudioButton as="a" href="/studio/events/new" variant="primary">
            New event
          </StudioButton>
          <StudioButton as="a" href="/studio/news/new" variant="primary">
            New article
          </StudioButton>
          <StudioButton as="a" href="/studio/pages/support/edit" variant="ghost">
            Edit Support page
          </StudioButton>
          <StudioButton as="a" href="/" variant="ghost">
            View public site
          </StudioButton>
        </div>
      </section>
    </div>
  );
}
