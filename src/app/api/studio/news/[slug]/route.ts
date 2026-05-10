import { NextResponse } from "next/server";
import type { NewsArticle } from "@/data/news";
import { slugify } from "@/app/studio/_brand/slugify";
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
  const originalSlug = decodeURIComponent((await ctx.params).slug);
  try {
    const body = (await req.json()) as { article: NewsArticle };
    const nextSlug = slugify(body.article.slug ?? "");
    if (!nextSlug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (nextSlug !== originalSlug) {
      // Rename: ensure the new slug isn't already taken by another article,
      // then write the new row and remove the old one.
      const collision = await getNewsBySlugAdmin(nextSlug);
      if (collision) {
        return NextResponse.json(
          { error: `Slug “${nextSlug}” is already used by another article.` },
          { status: 409 },
        );
      }
      await upsertNewsAdmin({ ...body.article, slug: nextSlug });
      await deleteNewsAdmin(originalSlug);
      return NextResponse.json({ ok: true, slug: nextSlug });
    }

    await upsertNewsAdmin({ ...body.article, slug: nextSlug });
    return NextResponse.json({ ok: true, slug: nextSlug });
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
