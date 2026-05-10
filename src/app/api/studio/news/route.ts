import { NextResponse } from "next/server";
import type { NewsArticle } from "@/data/news";
import { listNewsAdmin, upsertNewsAdmin } from "@/lib/cms/news-repo";
import { requireStudioCookie } from "@/lib/studio/auth-route";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";

export async function GET() {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    const articles = await listNewsAdmin();
    return NextResponse.json(articles);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { article: NewsArticle };
    if (!body.article?.slug?.trim() || !body.article.title?.trim()) {
      return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
    }
    await upsertNewsAdmin(body.article);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}
