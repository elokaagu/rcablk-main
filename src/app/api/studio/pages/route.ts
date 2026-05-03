import { NextResponse } from "next/server";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

export async function GET() {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    const pages = await listPagesAdmin();
    return NextResponse.json(pages);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load pages" }, { status: 500 });
  }
}
