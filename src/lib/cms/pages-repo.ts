import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";

type PageRow = {
  slug: string;
  title: string;
  paragraphs: unknown;
};

export type SitePageRecord = {
  slug: string;
  title: string;
  paragraphs: string[];
};

function asTextField(raw: unknown): string {
  return typeof raw === "string" ? raw : "";
}

function normalizeParagraphs(raw: unknown): string[] {
  if (raw == null) return [];
  // Some databases store a single HTML blob as a JSON string instead of a
  // string array — treat that as one paragraph so public pages don't fall over.
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? [raw] : [];
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string");
}

/** Public read: returns null if missing or Supabase off (caller uses static fallback). */
export async function getSitePage(slug: string): Promise<SitePageRecord | null> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return null;
    const { data, error } = await anon
      .from("site_pages")
      .select("slug,title,paragraphs")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as PageRow;
    const paragraphs = normalizeParagraphs(row.paragraphs);
    if (!paragraphs.length) return null;
    return {
      slug: asTextField(row.slug) || slug,
      title: asTextField(row.title),
      paragraphs,
    };
  } catch {
    return null;
  }
}

export async function listPagesAdmin(): Promise<SitePageRecord[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("site_pages").select("slug,title,paragraphs").order("slug");
  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as PageRow;
    return {
      slug: asTextField(r.slug),
      title: asTextField(r.title),
      paragraphs: normalizeParagraphs(r.paragraphs),
    };
  });
}

export async function getSitePageAdmin(slug: string): Promise<SitePageRecord | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("site_pages").select("slug,title,paragraphs").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as PageRow;
  return {
    slug: asTextField(row.slug),
    title: asTextField(row.title),
    paragraphs: normalizeParagraphs(row.paragraphs),
  };
}

export async function upsertSitePageAdmin(record: SitePageRecord): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("site_pages").upsert(
    {
      slug: record.slug,
      title: record.title,
      paragraphs: record.paragraphs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );
  if (error) throw error;
}
