import type { NewsArticle } from "@/data/news";
import { newsArticles as staticNews } from "@/data/news";
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
  sort_order: number;
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
    sort_order: typeof r.sort_order === "number" && Number.isFinite(r.sort_order) ? r.sort_order : undefined,
  };
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return staticNews;

    const { data, error } = await anon
      .from("news_articles")
      .select("slug,title,category,date,image,gallery,body,sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticNews;

    const articles = (data as NewsRow[])
      .map((row) => rowToArticle(row))
      .filter((a): a is NewsArticle => a != null);

    return articles.length ? articles : staticNews;
  } catch {
    return staticNews;
  }
}

export async function listNewsAdmin(): Promise<NewsArticle[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as NewsRow[])
    .map((row) => rowToArticle(row))
    .filter((a): a is NewsArticle => a != null);
}

export async function getNewsBySlugAdmin(slug: string): Promise<NewsArticle | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body,sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToArticle(data);
}

export async function upsertNewsAdmin(article: NewsArticle, sortOrder: number): Promise<void> {
  const supabase = createSupabaseAdmin();
  const row = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: article.date,
    image: article.image,
    gallery: article.gallery ?? null,
    body: article.body,
    sort_order: sortOrder,
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
