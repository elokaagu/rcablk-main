import { notFound } from "next/navigation";
import { NewsEditorForm } from "../../NewsEditorForm";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { getNewsBySlugAdmin } from "@/lib/cms/news-repo";
import { StudioNotice, StudioPageHeader } from "../../../_brand/StudioBrand";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditNewsPage({ params }: Props) {
  const { slug } = await params;
  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader
          eyebrow="Editorial"
          title="Edit article"
          back={{ href: "/studio/news", label: "News" }}
        />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase first.
        </StudioNotice>
      </div>
    );
  }
  const article = await getNewsBySlugAdmin(decodeURIComponent(slug));
  if (!article) notFound();

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Editorial"
        title={article.title || "Edit article"}
        description="Edit the public-facing article. Changes take effect on save."
        back={{ href: "/studio/news", label: "News" }}
      />
      <NewsEditorForm initial={article} mode="edit" />
    </div>
  );
}
