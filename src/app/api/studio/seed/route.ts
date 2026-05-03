import { NextResponse } from "next/server";
import { events } from "@/data/events";
import { newsArticles } from "@/data/news";
import { DEFAULT_SUPPORT_PARAGRAPHS, SUPPORT_PAGE_SLUG } from "@/data/support-static";
import { upsertEventAdmin } from "@/lib/cms/events-repo";
import { upsertNewsAdmin } from "@/lib/cms/news-repo";
import { upsertSitePageAdmin } from "@/lib/cms/pages-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

/** One-time (or repeat-safe) copy of bundled static content into Supabase. */
export async function POST() {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }
  try {
    for (let i = 0; i < events.length; i++) {
      await upsertEventAdmin(events[i], i);
    }
    for (let i = 0; i < newsArticles.length; i++) {
      await upsertNewsAdmin(newsArticles[i], i);
    }
    await upsertSitePageAdmin({
      slug: SUPPORT_PAGE_SLUG,
      title: "Support",
      paragraphs: DEFAULT_SUPPORT_PARAGRAPHS,
    });
    return NextResponse.json({
      ok: true,
      events: events.length,
      news: newsArticles.length,
      pages: 1,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed. Check tables and storage bucket exist." }, { status: 500 });
  }
}
