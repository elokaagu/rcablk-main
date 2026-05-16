import { createEmptyNewsArticle } from "@/data/news";
import { NewsEditorForm } from "../NewsEditorForm";
import { StudioPageHeader } from "../../_brand/StudioBrand";

export default function NewNewsPage() {
  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Editorial"
        title="New article"
        description="Add a new announcement or article to the public news index."
        back={{ href: "/studio/news", label: "News" }}
      />

      <NewsEditorForm initial={createEmptyNewsArticle()} mode="new" />
    </div>
  );
}
