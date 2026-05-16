import { notFound } from "next/navigation";
import { SitePageEditor } from "./SitePageEditor";
import { StudioPageHeader } from "../../../_brand/StudioBrand";
import { getSitePageDefaults } from "@/data/site-pages-static";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudioPageEdit({ params }: Props) {
  const { slug } = await params;
  const pageSlug = decodeURIComponent(slug);
  const defaults = getSitePageDefaults(pageSlug);

  if (!defaults) {
    // Editor only knows how to manage pages we've registered; unknown slugs
    // would have no defaults to fall back to and no public path to "view
    // live". Surface a clean 404 instead of half-rendering the editor.
    notFound();
  }

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="On-site copy"
        title={`Edit · ${defaults.label}`}
        description={`Edit the on-site copy for ${defaults.path}. Formatting renders identically on the public site.`}
        back={{ href: "/studio/pages", label: "Site pages" }}
      />
      <SitePageEditor slug={pageSlug} />
    </div>
  );
}
