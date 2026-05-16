import { NextResponse } from "next/server";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET() {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const pages = await listPagesAdmin();

    return NextResponse.json(pages, {
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    console.error("Failed to load studio pages", error);

    return NextResponse.json({ error: "Failed to load pages" }, { status: 500 });
  }
}
