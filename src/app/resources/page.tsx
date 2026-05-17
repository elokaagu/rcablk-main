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

/** Original Resources field — bright yellow (not the alumni/support blue). */
const RESOURCES_BG = "#FAF05A";
/** Pale blue stacked B/L/K — matches the corner logotype variant. */
const RESOURCES_LETTER_COLOR = "#BFDEF3";

export default async function Resources() {
  const defaults = getSitePageDefaults("resources")!;
  const cms = await getSitePage("resources");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;

  return (
    <BlkBackdropSitePage
      backgroundColor={RESOURCES_BG}
      letterColor={RESOURCES_LETTER_COLOR}
      logotypeSrc={BRAND_LOGOTYPES.blue}
      title={pickLiveSiteTitle(cms, defaults.title)}
      paragraphs={paragraphs}
    />
  );
}
