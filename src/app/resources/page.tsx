import { BlkBackdropSitePage } from "@/components/site/BlkBackdropSitePage";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | RCA BLK",
  description: "Scholarships, funding, and resources for students. Sir Frank Bowling Scholarship, refugee and asylum seeker scholarships.",
  openGraph: { title: "Resources | RCA BLK" },
};

export const dynamic = "force-dynamic";

const RESOURCES_BG = "hsl(207, 70%, 85%)";
const RESOURCES_BLK_ARTWORK = "/assets/resources-blk-letterforms.png";

export default async function Resources() {
  const defaults = getSitePageDefaults("resources")!;
  const cms = await getSitePage("resources");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;

  return (
    <BlkBackdropSitePage
      backgroundColor={RESOURCES_BG}
      letterformImage={RESOURCES_BLK_ARTWORK}
      logotypeSrc={BRAND_LOGOTYPES.blue}
      title={pickLiveSiteTitle(cms, defaults.title)}
      paragraphs={paragraphs}
    />
  );
}
