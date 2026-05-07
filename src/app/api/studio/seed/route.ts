import { NextResponse } from "next/server";
import { events } from "@/data/events";
import { newsArticles } from "@/data/news";
import { SITE_PAGES } from "@/data/site-pages-static";
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
    for (const page of SITE_PAGES) {
      await upsertSitePageAdmin({
        slug: page.slug,
        title: page.title,
        paragraphs: page.defaultParagraphs,
      });
    }
    return NextResponse.json({
      ok: true,
      events: events.length,
      news: newsArticles.length,
      pages: SITE_PAGES.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed. Check tables and storage bucket exist." }, { status: 500 });
  }
}
