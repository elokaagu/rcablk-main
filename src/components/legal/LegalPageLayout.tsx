import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { SitePageBody } from "@/components/SitePageBody";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";

/** Warm-cream paper tone shared by Privacy, Cookie Policy, Terms, and Accessibility. */
export const LEGAL_PAGE_BG = "#F0E7D5";

const LEGAL_PAGE_SLUGS = ["accessibility", "cookie-policy", "privacy-policy", "terms"] as const;

export type LegalPageSlug = (typeof LEGAL_PAGE_SLUGS)[number];

function isLegalPageSlug(slug: string): slug is LegalPageSlug {
  return (LEGAL_PAGE_SLUGS as readonly string[]).includes(slug);
}

type LegalPageLayoutProps = {
  slug: LegalPageSlug;
};

export async function LegalPageLayout({ slug }: LegalPageLayoutProps) {
  if (!isLegalPageSlug(slug)) {
    throw new Error(`Invalid legal page slug: ${slug}`);
  }

  const defaults = getSitePageDefaults(slug);

  if (!defaults) {
    throw new Error(`Missing default content for ${slug} page`);
  }

  const cms = await getSitePage(slug);
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div
      className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden text-black"
      style={{ backgroundColor: LEGAL_PAGE_BG }}
    >
      <SlideOutMenu />

      <AnimateIn delay={0.15} duration={0.5} y={16}>
        <header className="safe-top-spacing px-5 pb-6 text-center sm:py-10">
          <h1 className="px-2 font-display text-xl font-normal text-foreground sm:text-2xl">
            {heading}
          </h1>
        </header>
      </AnimateIn>

      <main className="mx-auto w-full max-w-[68ch] flex-1 px-5 pb-12 sm:px-10 sm:pb-16">
        <AnimateStagger
          delay={0.2}
          stagger={0.08}
          className="space-y-6 text-[1rem] leading-[1.75] text-foreground sm:space-y-8 sm:text-[1.0625rem]"
        >
          <SitePageBody paragraphs={paragraphs} />
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
