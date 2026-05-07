import Link from "next/link";
import type { NewsArticle } from "@/data/news";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listNewsAdmin } from "@/lib/cms/news-repo";
import { StudioButton, StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";

export default async function StudioNewsPage() {
  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="Editorial" title="News" />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase to manage news here. See the dashboard for environment variables.
        </StudioNotice>
      </div>
    );
  }

  let articles: NewsArticle[] = [];
  let loadError: unknown = null;
  try {
    articles = await listNewsAdmin();
  } catch (e) {
    loadError = e;
  }

  if (loadError) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="Editorial" title="News" />
        {isSchemaMissingError(loadError) ? (
          <StudioSchemaSetup reason={extractErrorMessage(loadError)} />
        ) : (
          <StudioNotice tone="error" title="Could not load news">
            {extractErrorMessage(loadError)}
          </StudioNotice>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Editorial"
        title="News"
        description={`${articles.length} ${articles.length === 1 ? "article" : "articles"} on file.`}
        actions={
          <StudioButton as="a" href="/studio/news/new" variant="primary">
            New article
          </StudioButton>
        }
      />

      {articles.length === 0 ? (
        <StudioNotice tone="info" title="No articles yet">
          Publish the first announcement to populate the public news index.
        </StudioNotice>
      ) : (
        <div className="overflow-hidden rounded-md border border-black/10 bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-black/10 bg-black/[0.02]">
              <tr className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/55">
                <th className="px-5 py-4">Title</th>
                <th className="hidden px-5 py-4 sm:table-cell">Slug</th>
                <th className="hidden px-5 py-4 lg:table-cell">Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr
                  key={a.slug}
                  className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
                >
                  <td className="px-5 py-4 font-serif text-[0.98rem] text-black">{a.title}</td>
                  <td className="hidden px-5 py-4 font-mono text-[0.85rem] text-black/55 sm:table-cell">
                    {a.slug}
                  </td>
                  <td className="hidden px-5 py-4 font-serif text-[0.95rem] text-black/65 lg:table-cell">
                    {a.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/studio/news/${encodeURIComponent(a.slug)}/edit`}
                      className="group inline-flex items-center gap-2 font-display text-[0.7rem] font-black uppercase tracking-[0.22em] text-black transition-colors hover:text-black/60"
                    >
                      <span>Edit</span>
                      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
