import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listPagesAdmin } from "@/lib/cms/pages-repo";
import { SITE_PAGES } from "@/data/site-pages-static";
import { StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";

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
        description="Edit on-site copy. Each page reads from its database entry when present; otherwise it falls back to the built-in default text."
      />

      <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
        <table className="w-full min-w-[20rem] text-left">
          <thead className="border-b border-black/10 bg-black/[0.02]">
            <tr className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/55">
              <th className="px-4 py-3 sm:px-5 sm:py-4">Page</th>
              <th className="hidden px-4 py-3 sm:table-cell sm:px-5 sm:py-4">Slug</th>
              <th className="px-4 py-3 sm:px-5 sm:py-4">Status</th>
              <th className="px-4 py-3 text-right sm:px-5 sm:py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {SITE_PAGES.map((p) => {
              const live = existingSlugs.has(p.slug);
              return (
                <tr
                  key={p.slug}
                  className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
                >
                  <td className="break-words px-4 py-3 font-serif text-[0.95rem] text-black sm:px-5 sm:py-4 sm:text-[0.98rem]">
                    {p.label}
                  </td>
                  <td className="hidden break-all px-4 py-3 font-mono text-[0.8rem] text-black/55 sm:table-cell sm:px-5 sm:py-4 sm:text-[0.85rem]">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 sm:px-5 sm:py-4">
                    <span
                      className={`inline-flex items-center gap-2 font-serif text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.72rem] sm:tracking-[0.18em] ${
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
                  <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                    <Link
                      href={`/studio/pages/${encodeURIComponent(p.slug)}/edit`}
                      className="group inline-flex min-h-[44px] items-center gap-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:text-black/60"
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
