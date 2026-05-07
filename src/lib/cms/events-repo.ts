import type { EventData } from "@/data/events";
import { events as staticEvents } from "@/data/events";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";
import { asString, asTrimmedString, normalizeEventBodyField } from "@/lib/cms/coerce";

type EventRow = {
  slug: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  image: string;
  body: string | null;
  sort_order: number;
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
    sort_order: typeof r.sort_order === "number" && Number.isFinite(r.sort_order) ? r.sort_order : undefined,
  };
}

/** Public site: Supabase rows if configured and non-empty, else bundled static data. */
export async function getEvents(): Promise<EventData[]> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return staticEvents;

    const { data, error } = await anon
      .from("events")
      .select("slug,name,description,venue,date,image,body,sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticEvents;

    const events = (data as EventRow[])
      .map((row) => rowToEvent(row))
      .filter((e): e is EventData => e != null);

    return events.length ? events : staticEvents;
  } catch {
    return staticEvents;
  }
}

/** Studio: always hits Supabase with service role. */
export async function listEventsAdmin(): Promise<EventData[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("slug,name,description,venue,date,image,body,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as EventRow[])
    .map((row) => rowToEvent(row))
    .filter((e): e is EventData => e != null);
}

export async function getEventBySlugAdmin(slug: string): Promise<EventData | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("slug,name,description,venue,date,image,body,sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToEvent(data);
}

export async function upsertEventAdmin(event: EventData, sortOrder: number): Promise<void> {
  const supabase = createSupabaseAdmin();
  const row = {
    slug: event.slug,
    name: event.name,
    description: event.description,
    venue: event.venue,
    date: event.date,
    image: event.image,
    body: event.body ?? null,
    sort_order: sortOrder,
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
