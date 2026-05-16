import type { ReactNode } from "react";
import type { NewsArticle } from "@/data/news";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { listNewsAdmin } from "@/lib/cms/news-repo";
import { StudioButton, StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";
import { StudioNewsArticleTable } from "./StudioNewsArticleTable";

// Editors create new articles at runtime; render fresh on every request so
// the table reflects the current Supabase state (no build-time snapshot).
export const dynamic = "force-dynamic";
export const revalidate = 0;

function NewsPageShell({
  children,
  description,
  actions,
}: {
  children: ReactNode;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Editorial"
        title="News"
        description={description}
        actions={actions}
      />
      {children}
    </div>
  );
}

export default async function StudioNewsPage() {
  if (!isCmsConfigured()) {
    return (
      <NewsPageShell>
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase to manage news here. See the dashboard for environment variables.
        </StudioNotice>
      </NewsPageShell>
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
      <NewsPageShell>
        {isSchemaMissingError(loadError) ? (
          <StudioSchemaSetup reason={extractErrorMessage(loadError)} />
        ) : (
          <StudioNotice tone="error" title="Could not load news">
            {extractErrorMessage(loadError)}
          </StudioNotice>
        )}
      </NewsPageShell>
    );
  }

  return (
    <NewsPageShell
      description={`${articles.length} ${articles.length === 1 ? "article" : "articles"} on file.`}
      actions={
        <StudioButton as="a" href="/studio/news/new" variant="primary">
          New article
        </StudioButton>
      }
    >
      {articles.length === 0 ? (
        <StudioNotice tone="info" title="No articles yet">
          Publish the first announcement to populate the public news index.
        </StudioNotice>
      ) : (
        <StudioNewsArticleTable articles={articles} />
      )}
    </NewsPageShell>
  );
}
