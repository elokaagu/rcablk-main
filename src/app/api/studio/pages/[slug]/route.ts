import { NextResponse } from "next/server";
import type { SitePageRecord } from "@/lib/cms/pages-repo";
import { getSitePageAdmin, upsertSitePageAdmin } from "@/lib/cms/pages-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  const page = await getSitePageAdmin(decodeURIComponent(slug));
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  try {
    const body = (await req.json()) as { page: SitePageRecord };
    if (body.page.slug !== decodeURIComponent(slug)) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }
    await upsertSitePageAdmin(body.page);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
