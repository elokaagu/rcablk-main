import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listEventsAdmin } from "@/lib/cms/events-repo";
import { listNewsAdmin } from "@/lib/cms/news-repo";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { SeedButton } from "./SeedButton";
import {
  StudioButton,
  StudioEyebrow,
  StudioInlineCode,
  StudioNotice,
  StudioPageHeader,
} from "./_brand/StudioBrand";
import { StudioSchemaSetup } from "./_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "./_brand/studio-errors";

type CountState =
  | { ok: true; value: number }
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
        ? { ok: true, value: events.value.length }
        : { ok: false, error: events.reason },
    news:
      news.status === "fulfilled"
        ? { ok: true, value: news.value.length }
        : { ok: false, error: news.reason },
    pages:
      pages.status === "fulfilled"
        ? { ok: true, value: pages.value.length }
        : { ok: false, error: pages.reason },
  };
}

function CountTile({
  marker,
  state,
  label,
  href,
}: {
  marker: string;
  state: CountState | null;
  label: string;
  href: string;
}) {
  const display = state?.ok ? state.value : "—";
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 bg-white p-7 transition-colors hover:bg-homeHero/[0.06] focus-visible:bg-homeHero/[0.06]"
    >
      <span className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/45">
        {marker}
      </span>
      <span className="font-display text-[3rem] font-black leading-none tracking-[-0.02em] text-black sm:text-[3.75rem]">
        {display}
      </span>
      <span className="font-serif text-[1rem] leading-tight text-black/70">{label}</span>
      <span
        aria-hidden
        className="mt-2 inline-flex items-center gap-2 font-display text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/55 transition-colors group-hover:text-black"
      >
        <span>Open</span>
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </span>
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

      {cms && !schemaMissing && (
        <StudioNotice tone="info" title="First-time setup" actions={<SeedButton />}>
          If tables are empty, copy the bundled events, news and default Support page into Supabase. Safe to
          run more than once — entries upsert by slug.
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
          <CountTile marker="01" state={counts?.events ?? null} label="Events on file" href="/studio/events" />
          <CountTile marker="02" state={counts?.news ?? null} label="News articles" href="/studio/news" />
          <CountTile
            marker="03"
            state={counts?.pages ?? null}
            label="Site pages overridden"
            href="/studio/pages"
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
