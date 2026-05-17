import { BlkBackdropSitePage } from "@/components/site/BlkBackdropSitePage";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { getSitePageDefaults, SUPPORT_PAGE_SLUG } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | RCA BLK",
  description: "Support RCA BLK. Help sustain our exhibitions, events, residencies, and artist programmes.",
  openGraph: { title: "Support | RCA BLK" },
};

export const dynamic = "force-dynamic";

const SUPPORT_BG = "#F3916B";
const SUPPORT_LETTER_COLOR = "#FFDD00";

export default async function Support() {
  const defaults = getSitePageDefaults(SUPPORT_PAGE_SLUG)!;
  const cms = await getSitePage(SUPPORT_PAGE_SLUG);
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;

  return (
    <BlkBackdropSitePage
      backgroundColor={SUPPORT_BG}
      letterColor={SUPPORT_LETTER_COLOR}
      logotypeSrc={BRAND_LOGOTYPES.yellow}
      title={pickLiveSiteTitle(cms, defaults.title)}
      paragraphs={paragraphs}
    />
  );
}
