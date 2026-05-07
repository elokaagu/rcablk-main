import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";

const PRESET_SLUGS = [{ slug: "support", label: "Support page" }];

export default async function StudioPagesIndex() {
  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="On-site copy" title="Site pages" />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase to edit site pages here.
        </StudioNotice>
      </div>
    );
  }

  let existing: { slug: string; title: string }[] = [];
  let loadError: unknown = null;
  try {
    const rows = await listPagesAdmin();
    existing = rows.map((r) => ({ slug: r.slug, title: r.title }));
  } catch (e) {
    loadError = e;
  }

  if (loadError) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="On-site copy" title="Site pages" />
        {isSchemaMissingError(loadError) ? (
          <StudioSchemaSetup reason={extractErrorMessage(loadError)} />
        ) : (
          <StudioNotice tone="error" title="Could not load pages">
            {extractErrorMessage(loadError)}
          </StudioNotice>
        )}
      </div>
    );
  }

  const existingSlugs = new Set(existing.map((e) => e.slug));

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="On-site copy"
        title="Site pages"
        description="Edit on-site copy. The Support page reads from the support entry when present; otherwise it uses the built-in default text."
      />

      <div className="overflow-hidden rounded-md border border-black/10 bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-black/10 bg-black/[0.02]">
            <tr className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/55">
              <th className="px-5 py-4">Page</th>
              <th className="hidden px-5 py-4 sm:table-cell">Slug</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {PRESET_SLUGS.map((p) => {
              const live = existingSlugs.has(p.slug);
              return (
                <tr
                  key={p.slug}
                  className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
                >
                  <td className="px-5 py-4 font-serif text-[0.98rem] text-black">{p.label}</td>
                  <td className="hidden px-5 py-4 font-mono text-[0.85rem] text-black/55 sm:table-cell">
                    {p.slug}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 font-display text-[0.65rem] font-black uppercase tracking-[0.22em] ${
                        live ? "text-black" : "text-black/55"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full ${live ? "bg-homeHero" : "bg-black/30"}`}
                      />
                      {live ? "In database" : "Using defaults"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/studio/pages/${encodeURIComponent(p.slug)}/edit`}
                      className="group inline-flex items-center gap-2 font-display text-[0.7rem] font-black uppercase tracking-[0.22em] text-black transition-colors hover:text-black/60"
                    >
                      <span>Edit</span>
                      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
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
