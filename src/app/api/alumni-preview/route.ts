import { fetchLinkPreviewImage } from "@/lib/alumni-link-preview";
import { isPreviewableLink } from "@/lib/alumni-preview-url";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

function cachedPreview(url: string) {
  return unstable_cache(() => fetchLinkPreviewImage(url), ["alumni-link-preview", url], {
    revalidate: 60 * 60 * 24 * 7,
  })();
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")?.trim();

  if (!url || !isPreviewableLink(url)) {
    return NextResponse.json({ error: "Invalid or unsupported URL" }, { status: 400 });
  }

  const imageUrl = await cachedPreview(url);

  return NextResponse.json(
    { imageUrl },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
