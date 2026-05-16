import { NextResponse } from "next/server";
import { isValidEventPayload } from "@/lib/cms/event-payload";
import {
  deleteEventAdmin,
  getEventBySlugAdmin,
  upsertEventAdmin,
} from "@/lib/cms/events-repo";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

interface Ctx {
  params: Promise<{ slug: string }>;
}

async function getDecodedSlug(ctx: Ctx) {
  const { slug } = await ctx.params;
  return decodeURIComponent(slug);
}

export async function GET(_req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);
  const event = await getEventBySlugAdmin(slug);

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);

  try {
    const body = await req.json();

    if (!isValidEventPayload(body)) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    if (body.event.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }

    await upsertEventAdmin(body.event);

    return NextResponse.json({
      ok: true,
      event: body.event,
    });
  } catch (error) {
    console.error("Failed to update event", error);

    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);

  try {
    await deleteEventAdmin(slug);

    return NextResponse.json({
      ok: true,
      slug,
    });
  } catch (error) {
    console.error("Failed to delete event", error);

    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
