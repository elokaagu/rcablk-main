import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listPagesAdmin } from "@/lib/cms/pages-repo";

const PRESET_SLUGS = [{ slug: "support", label: "Support page" }];

export default async function StudioPagesIndex() {
  if (!isCmsConfigured()) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        Configure Supabase to edit site pages here.
      </div>
    );
  }

  let existing: { slug: string; title: string }[] = [];
  try {
    const rows = await listPagesAdmin();
    existing = rows.map((r) => ({ slug: r.slug, title: r.title }));
  } catch {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/30 p-6 text-sm text-red-200">
        Could not load pages. Apply the latest <code className="text-red-100">supabase/schema.sql</code> (includes{" "}
        <code className="text-red-100">site_pages</code>).
      </div>
    );
  }

  const existingSlugs = new Set(existing.map((e) => e.slug));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white">Site pages</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Edit on-site copy. The Support page reads from the <code className="text-neutral-300">support</code> entry
          when present; otherwise it uses the built-in default text.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {PRESET_SLUGS.map((p) => {
              const row = existing.find((e) => e.slug === p.slug);
              return (
                <tr key={p.slug} className="border-b border-neutral-800/80 last:border-0 hover:bg-neutral-900/50">
                  <td className="px-4 py-3 text-neutral-200">{p.label}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.slug}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {existingSlugs.has(p.slug) ? "In database" : "Using defaults"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/studio/pages/${encodeURIComponent(p.slug)}/edit`} className="text-amber-400 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
