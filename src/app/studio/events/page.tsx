import Link from "next/link";
import type { EventData } from "@/data/events";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listEventsAdmin } from "@/lib/cms/events-repo";
import { StudioButton, StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";

// Editors create new events at runtime; render fresh on every request so
// the table reflects the current Supabase state (no build-time snapshot).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioEventsPage() {
  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="Programme" title="Events" />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase to manage events here. See the dashboard for environment variables.
        </StudioNotice>
      </div>
    );
  }

  let events: EventData[] = [];
  let loadError: unknown = null;
  try {
    events = await listEventsAdmin();
  } catch (e) {
    loadError = e;
  }

  if (loadError) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="Programme" title="Events" />
        {isSchemaMissingError(loadError) ? (
          <StudioSchemaSetup reason={extractErrorMessage(loadError)} />
        ) : (
          <StudioNotice tone="error" title="Could not load events">
            {extractErrorMessage(loadError)}
          </StudioNotice>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Programme"
        title="Events"
        description={`${events.length} ${events.length === 1 ? "entry" : "entries"} currently in the catalogue.`}
        actions={
          <StudioButton as="a" href="/studio/events/new" variant="primary">
            New event
          </StudioButton>
        }
      />

      {events.length === 0 ? (
        <StudioNotice tone="info" title="No events yet">
          Create the first event to populate the public programme grid.
        </StudioNotice>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
          <table className="w-full min-w-[20rem] text-left">
            <thead className="border-b border-black/10 bg-black/[0.02]">
              <tr className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/55">
                <th className="px-4 py-3 sm:px-5 sm:py-4">Name</th>
                <th className="hidden px-4 py-3 sm:table-cell sm:px-5 sm:py-4">Slug</th>
                <th className="hidden px-4 py-3 lg:table-cell lg:px-5 lg:py-4">Date</th>
                <th className="px-4 py-3 text-right sm:px-5 sm:py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr
                  key={e.slug}
                  className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
                >
                  <td className="break-words px-4 py-3 font-serif text-[0.95rem] text-black sm:px-5 sm:py-4 sm:text-[0.98rem]">
                    {e.name}
                  </td>
                  <td className="hidden break-all px-4 py-3 font-mono text-[0.8rem] text-black/55 sm:table-cell sm:px-5 sm:py-4 sm:text-[0.85rem]">
                    {e.slug}
                  </td>
                  <td className="hidden px-4 py-3 font-serif text-[0.9rem] text-black/65 lg:table-cell lg:px-5 lg:py-4 lg:text-[0.95rem]">
                    {e.date}
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                    <Link
                      href={`/studio/events/${encodeURIComponent(e.slug)}/edit`}
                      className="group inline-flex min-h-[44px] items-center gap-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:text-black/60"
                    >
                      <span>Edit</span>
                      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
