import { NextResponse } from "next/server";
import type { EventData } from "@/data/events";
import { deleteEventAdmin, getEventBySlugAdmin, upsertEventAdmin } from "@/lib/cms/events-repo";
import { requireStudioCookie } from "@/lib/studio/auth-route";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  const event = await getEventBySlugAdmin(decodeURIComponent(slug));
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  try {
    const body = (await req.json()) as { event: EventData };
    if (body.event.slug !== decodeURIComponent(slug)) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }
    await upsertEventAdmin(body.event);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  try {
    await deleteEventAdmin(decodeURIComponent(slug));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
