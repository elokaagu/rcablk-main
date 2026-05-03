import Link from "next/link";
import type { EventData } from "@/data/events";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listEventsAdmin } from "@/lib/cms/events-repo";

export default async function StudioEventsPage() {
  if (!isCmsConfigured()) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        Configure Supabase to manage events here. See the dashboard for environment variables.
      </div>
    );
  }

  let events: EventData[] = [];
  try {
    events = await listEventsAdmin();
  } catch {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/30 p-6 text-sm text-red-200">
        Could not load events. Confirm the SQL in <code className="text-red-100">supabase/schema.sql</code> has been
        applied.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white">Events</h1>
          <p className="mt-1 text-sm text-neutral-400">{events.length} entries</p>
        </div>
        <Link
          href="/studio/events/new"
          className="rounded bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          New event
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.slug} className="border-b border-neutral-800/80 last:border-0 hover:bg-neutral-900/50">
                <td className="px-4 py-3 text-neutral-200">{e.name}</td>
                <td className="px-4 py-3 text-neutral-500">{e.slug}</td>
                <td className="px-4 py-3 text-neutral-400">{e.date}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/studio/events/${encodeURIComponent(e.slug)}/edit`} className="text-amber-400 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
