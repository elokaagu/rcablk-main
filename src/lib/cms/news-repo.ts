import type { NewsArticle } from "@/data/news";
import { newsArticles as staticNews } from "@/data/news";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";

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

function rowToArticle(row: NewsRow): NewsArticle {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category ?? "Announcement",
    date: row.date ?? "",
    image: row.image ?? "",
    gallery: row.gallery ?? undefined,
    body: Array.isArray(row.body) ? (row.body as string[]) : [],
    sort_order: row.sort_order,
  };
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  const anon = createSupabaseAnon();
  if (!anon) return staticNews;

  const { data, error } = await anon
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return staticNews;
  return (data as NewsRow[]).map(rowToArticle);
}

export async function listNewsAdmin(): Promise<NewsArticle[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_articles")
    .select("slug,title,category,date,image,gallery,body,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as NewsRow[]).map(rowToArticle);
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
  return rowToArticle(data as NewsRow);
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
