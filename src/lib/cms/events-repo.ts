import type { EventData } from "@/data/events";
import { events as staticEvents } from "@/data/events";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";

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

function rowToEvent(row: EventRow): EventData {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    venue: row.venue ?? "",
    date: row.date ?? "",
    image: row.image ?? "",
    body: row.body ?? undefined,
    sort_order: row.sort_order,
  };
}

/** Public site: Supabase rows if configured and non-empty, else bundled static data. */
export async function getEvents(): Promise<EventData[]> {
  const anon = createSupabaseAnon();
  if (!anon) return staticEvents;

  const { data, error } = await anon
    .from("events")
    .select("slug,name,description,venue,date,image,body,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return staticEvents;
  return (data as EventRow[]).map(rowToEvent);
}

/** Studio: always hits Supabase with service role. */
export async function listEventsAdmin(): Promise<EventData[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("slug,name,description,venue,date,image,body,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as EventRow[]).map(rowToEvent);
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
  return rowToEvent(data as EventRow);
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
