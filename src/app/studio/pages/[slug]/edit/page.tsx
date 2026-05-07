import { SupportPageEditor } from "./SupportPageEditor";
import { StudioPageHeader } from "../../../_brand/StudioBrand";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudioPageEdit({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="On-site copy"
        title={`Edit · ${decoded}`}
        description="Edit the on-site copy for this page. Use the markers below to separate paragraphs."
        back={{ href: "/studio/pages", label: "Site pages" }}
      />
      <SupportPageEditor slug={decoded} />
    </div>
  );
}
