import { NextResponse } from "next/server";
import type { EventData } from "@/data/events";
import { listEventsAdmin, upsertEventAdmin } from "@/lib/cms/events-repo";
import { requireStudioCookie } from "@/lib/studio/auth-route";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";

export async function GET() {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    const events = await listEventsAdmin();
    return NextResponse.json(events);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { event: EventData };
    if (!body.event?.slug?.trim()) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    await upsertEventAdmin(body.event);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
