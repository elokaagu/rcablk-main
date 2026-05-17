import { buildAlumniCatalog } from "@/lib/alumni-catalog";
import { listSnapshotOverridesAdmin } from "@/lib/cms/alumni-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { StudioNotice, StudioPageHeader } from "../_brand/StudioBrand";
import { StudioSchemaSetup } from "../_brand/StudioSchemaSetup";
import { extractErrorMessage, isSchemaMissingError } from "../_brand/studio-errors";
import { StudioAlumniTable, type StudioAlumniRow } from "./StudioAlumniTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioAlumniPage() {
  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="People" title="Alumni" />
        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase to manage alumni preview images here. See the dashboard for environment variables.
        </StudioNotice>
      </div>
    );
  }

  const catalog = buildAlumniCatalog();
  let overrides = new Map<string, string>();
  let loadError: unknown = null;

  try {
    overrides = await listSnapshotOverridesAdmin();
  } catch (e) {
    loadError = e;
  }

  if (loadError) {
    return (
      <div className="space-y-10">
        <StudioPageHeader eyebrow="People" title="Alumni" />
        {isSchemaMissingError(loadError) ? (
          <StudioSchemaSetup reason={extractErrorMessage(loadError)} />
        ) : (
          <StudioNotice tone="error" title="Could not load alumni images">
            {extractErrorMessage(loadError)}
          </StudioNotice>
        )}
      </div>
    );
  }

  const members: StudioAlumniRow[] = catalog.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    section: entry.section,
    effectiveSnapshot: overrides.get(entry.slug) ?? entry.staticSnapshot ?? "",
    hasOverride: overrides.has(entry.slug),
  }));

  const customCount = members.filter((m) => m.hasOverride).length;

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="People"
        title="Alumni"
        description={`Change the hover preview image for each person on the public Alumni page. ${catalog.length} names in the directory${customCount ? ` · ${customCount} custom ${customCount === 1 ? "image" : "images"}` : ""}.`}
      />

      <StudioAlumniTable members={members} />
    </div>
  );
}
