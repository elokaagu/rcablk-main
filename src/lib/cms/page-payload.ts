import type { SitePageRecord } from "@/lib/cms/pages-repo";

export function isValidPagePayload(body: unknown): body is { page: SitePageRecord } {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as { page?: Partial<SitePageRecord> };
  const page = payload.page;

  if (!page) {
    return false;
  }

  return Boolean(
    typeof page.slug === "string" &&
      page.slug.trim().length > 0 &&
      typeof page.title === "string" &&
      Array.isArray(page.paragraphs) &&
      page.paragraphs.every((paragraph) => typeof paragraph === "string")
  );
}
