import { notFound } from "next/navigation";
import { getCatalogEntryBySlug } from "@/lib/alumni-catalog";
import { getSnapshotOverrideAdmin } from "@/lib/cms/alumni-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { StudioNotice, StudioPageHeader } from "../../../_brand/StudioBrand";
import { AlumniSnapshotEditorForm } from "../../AlumniSnapshotEditorForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditAlumniImagePage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader
          eyebrow="People"
          title="Edit preview image"
          back={{ href: "/studio/alumni", label: "Alumni" }}
        />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase first.
        </StudioNotice>
      </div>
    );
  }

  const entry = getCatalogEntryBySlug(decoded);
  if (!entry) notFound();

  const override = await getSnapshotOverrideAdmin(decoded);

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="People"
        title={entry.name}
        description="Preview image shown when visitors hover this name on the Alumni page."
        back={{ href: "/studio/alumni", label: "Alumni" }}
      />
      <AlumniSnapshotEditorForm
        initial={{
          slug: entry.slug,
          name: entry.name,
          staticSnapshot: entry.staticSnapshot ?? "",
          snapshot: override ?? entry.staticSnapshot ?? "",
          hasOverride: override != null,
        }}
      />
    </div>
  );
}
