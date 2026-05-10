import { NextResponse } from "next/server";
import type { NewsArticle } from "@/data/news";
import { deleteNewsAdmin, getNewsBySlugAdmin, upsertNewsAdmin } from "@/lib/cms/news-repo";
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
  const article = await getNewsBySlugAdmin(decodeURIComponent(slug));
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { slug } = await ctx.params;
  try {
    const body = (await req.json()) as { article: NewsArticle };
    if (body.article.slug !== decodeURIComponent(slug)) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }
    await upsertNewsAdmin(body.article);
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
    await deleteNewsAdmin(decodeURIComponent(slug));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
