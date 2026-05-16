import { NextResponse } from "next/server";
import { isValidEventPayload } from "@/lib/cms/event-payload";
import { listEventsAdmin, upsertEventAdmin } from "@/lib/cms/events-repo";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

export async function GET() {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const events = await listEventsAdmin();

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to load events", error);

    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const body = await req.json();

    if (!isValidEventPayload(body)) {
      return NextResponse.json(
        { error: "Valid event with slug is required" },
        { status: 400 }
      );
    }

    await upsertEventAdmin(body.event);

    return NextResponse.json({
      ok: true,
      event: body.event,
    });
  } catch (error) {
    console.error("Failed to save event", error);

    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
