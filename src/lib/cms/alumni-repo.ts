import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { createSupabaseAnon } from "@/lib/cms/supabase-anon";
import { asTrimmedString } from "@/lib/cms/coerce";

type AlumniSnapshotRow = {
  slug: string;
  snapshot: string;
};

function rowToSnapshot(row: unknown): { slug: string; snapshot: string } | null {
  const r = row as Record<string, unknown>;
  const slug = asTrimmedString(r.slug);
  const snapshot = asTrimmedString(r.snapshot);
  if (!slug || !snapshot) return null;
  return { slug, snapshot };
}

/** Public site: slug → custom snapshot URL (empty map if CMS unavailable). */
export async function getSnapshotOverridesMap(): Promise<Map<string, string>> {
  try {
    const anon = createSupabaseAnon();
    if (!anon) return new Map();

    const { data, error } = await anon.from("alumni_snapshots").select("slug,snapshot");
    if (error || !data?.length) return new Map();

    const map = new Map<string, string>();
    for (const row of data as AlumniSnapshotRow[]) {
      const parsed = rowToSnapshot(row);
      if (parsed) map.set(parsed.slug, parsed.snapshot);
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function listSnapshotOverridesAdmin(): Promise<Map<string, string>> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("alumni_snapshots").select("slug,snapshot");
  if (error) throw error;

  const map = new Map<string, string>();
  for (const row of (data ?? []) as AlumniSnapshotRow[]) {
    const parsed = rowToSnapshot(row);
    if (parsed) map.set(parsed.slug, parsed.snapshot);
  }
  return map;
}

export async function getSnapshotOverrideAdmin(slug: string): Promise<string | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("alumni_snapshots")
    .select("slug,snapshot")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToSnapshot(data)?.snapshot ?? null;
}

export async function upsertSnapshotOverrideAdmin(slug: string, snapshot: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("alumni_snapshots").upsert(
    {
      slug,
      snapshot: snapshot.trim(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );
  if (error) throw error;
}

export async function deleteSnapshotOverrideAdmin(slug: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("alumni_snapshots").delete().eq("slug", slug);
  if (error) throw error;
}
