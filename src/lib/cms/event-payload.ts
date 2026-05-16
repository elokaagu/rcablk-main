import type { EventData } from "@/data/events";

export function isValidEventPayload(body: unknown): body is { event: EventData } {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as { event?: Partial<EventData> };

  return Boolean(
    payload.event &&
      typeof payload.event.slug === "string" &&
      payload.event.slug.trim().length > 0 &&
      typeof payload.event.name === "string" &&
      typeof payload.event.description === "string" &&
      typeof payload.event.venue === "string" &&
      typeof payload.event.date === "string" &&
      typeof payload.event.image === "string" &&
      (payload.event.body === undefined || typeof payload.event.body === "string")
  );
}
