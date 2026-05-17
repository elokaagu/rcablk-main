import type { EventData } from "@/data/events";
import { events as staticEvents } from "@/data/events";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";
import { asString, asTrimmedString, normalizeEventBodyField } from "@/lib/cms/coerce";
import { sortEventsByCalendarDate } from "@/lib/event-sort";

type EventRow = {
  slug: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  image: string;
  body: string | null;
};

const FALLBACK_EVENT_IMAGE = "/rca_logo.png";

function rowToEvent(row: unknown): EventData | null {
  const r = row as Record<string, unknown>;
  const slug = asTrimmedString(r.slug);
  if (!slug) return null;

  const body = normalizeEventBodyField(r.body);

  return {
    slug,
    name: asTrimmedString(r.name) || "Untitled",
    description: asString(r.description),
    venue: asString(r.venue),
    date: asString(r.date),
    image: asTrimmedString(r.image) || FALLBACK_EVENT_IMAGE,
    body,
  };
}

/** Public site: Supabase rows if configured and non-empty, else bundled static data. */
export async function getEvents(): Promise<EventData[]> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return sortEventsByCalendarDate(staticEvents, "desc");

    const { data, error } = await anon
      .from("events")
      .select("slug,name,description,venue,date,image,body")
      .order("updated_at", { ascending: false });

    if (error || !data?.length) return sortEventsByCalendarDate(staticEvents, "desc");

    const events = (data as EventRow[])
      .map((row) => rowToEvent(row))
      .filter((e): e is EventData => e != null);

    return events.length
      ? sortEventsByCalendarDate(events, "desc")
      : sortEventsByCalendarDate(staticEvents, "desc");
  } catch {
    return sortEventsByCalendarDate(staticEvents, "desc");
  }
}

/** Studio: always hits Supabase with service role. */
export async function listEventsAdmin(): Promise<EventData[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("slug,name,description,venue,date,image,body")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const events = ((data ?? []) as EventRow[])
    .map((row) => rowToEvent(row))
    .filter((e): e is EventData => e != null);
  return sortEventsByCalendarDate(events, "desc");
}

export async function getEventBySlugAdmin(slug: string): Promise<EventData | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("slug,name,description,venue,date,image,body")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToEvent(data);
}

export async function upsertEventAdmin(event: EventData): Promise<void> {
  const supabase = createSupabaseAdmin();
  const row = {
    slug: event.slug,
    name: event.name,
    description: event.description,
    venue: event.venue,
    date: event.date,
    image: event.image,
    body: event.body ?? null,
    sort_order: 0,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("events").upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteEventAdmin(slug: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("events").delete().eq("slug", slug);
  if (error) throw error;
}
