import { cache } from "react";
import type { NewsArticle } from "@/data/news";
import { newsArticles as staticNews } from "@/data/news";
import { sortNewsArticlesByCalendarDate } from "@/lib/news-sort";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";
import {
  asString,
  asTrimmedString,
  normalizeGalleryField,
  normalizeStringArrayField,
} from "@/lib/cms/coerce";

type NewsRow = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  gallery: string[] | null;
  body: unknown;
};

const FALLBACK_NEWS_IMAGE = "/rca_logo.png";

function rowToArticle(row: unknown): NewsArticle | null {
  const r = row as Record<string, unknown>;
  const slug = asTrimmedString(r.slug);
  if (!slug) return null;

  const body = normalizeStringArrayField(r.body);
  const gallery = normalizeGalleryField(r.gallery);

  return {
    slug,
    title: asTrimmedString(r.title) || "Untitled",
    category: asTrimmedString(r.category) || "Announcement",
    date: asString(r.date),
    image: asTrimmedString(r.image) || FALLBACK_NEWS_IMAGE,
    gallery,
    body: body.length ? body : [],
  };
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return staticNews;

    const { data, error } = await anon
      .from("news_articles")
      .select("slug,title,category,date,image,gallery,body");

    if (error || !data?.length) return sortNewsArticlesByCalendarDate(staticNews, "desc");

    const articles = (data as NewsRow[])
      .map((row) => rowToArticle(row))
      .filter((a): a is NewsArticle => a != null);

    return articles.length ? sortNewsArticlesByCalendarDate(articles, "desc") : sortNewsArticlesByCalendarDate(staticNews, "desc");
  } catch {
    return sortNewsArticlesByCalendarDate(staticNews, "desc");
  }
}

/** Public site: single article by slug (Supabase row or static fallback). */
export const getNewsBySlug = cache(async function getNewsBySlug(
  slug: string,
): Promise<NewsArticle | null> {
  try {
    const anon = createSupabaseAnon();

    if (anon) {
      const { data, error } = await anon
        .from("news_articles")
        .select("slug,title,category,date,image,gallery,body")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        const article = rowToArticle(data);
        if (article) {
          return article;
        }
      }
    }
  } catch {
    // fall through to bundled data
  }

  return staticNews.find((article) => article.slug === slug) ?? null;
});

export async function listNewsAdmin(): Promise<NewsArticle[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return sortNewsArticlesByCalendarDate(
    ((data ?? []) as NewsRow[])
      .map((row) => rowToArticle(row))
      .filter((a): a is NewsArticle => a != null),
    "desc",
  );
}

export async function getNewsBySlugAdmin(slug: string): Promise<NewsArticle | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToArticle(data);
}

export async function upsertNewsAdmin(article: NewsArticle): Promise<void> {
  const supabase = createSupabaseAdmin();
  const row = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: article.date,
    image: article.image,
    gallery: article.gallery ?? null,
    body: article.body,
    sort_order: 0,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("news_articles").upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteNewsAdmin(slug: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("news_articles").delete().eq("slug", slug);
  if (error) throw error;
}

/** Update slug and fields in one write (avoids upsert+delete duplicate risk). */
export async function renameNewsAdmin(originalSlug: string, article: NewsArticle): Promise<void> {
  const supabase = createSupabaseAdmin();
  const row = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: article.date,
    image: article.image,
    gallery: article.gallery ?? null,
    body: article.body,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("news_articles").update(row).eq("slug", originalSlug);
  if (error) throw error;
}
