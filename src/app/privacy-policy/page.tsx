import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { SitePageBody } from "@/components/SitePageBody";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RCA BLK",
  description: "RCA BLK privacy policy. How we collect, use, and protect your personal information.",
  openGraph: { title: "Privacy Policy | RCA BLK" },
};

export const dynamic = "force-dynamic";

// Shared warm-cream paper tone for all legal / utility pages so Privacy,
// Cookie Policy, Terms and Accessibility feel like a single coherent set
// distinct from the bolder editorial colour blocks (Events sage, News yellow,
// Support coral, etc).
const LEGAL_PAGE_BG = "#F0E7D5";

export default async function PrivacyPolicy() {
  const defaults = getSitePageDefaults("privacy-policy")!;
  const cms = await getSitePage("privacy-policy");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0 text-black"
      style={{ backgroundColor: LEGAL_PAGE_BG }}
    >
      <PageBackground color={LEGAL_PAGE_BG} />
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground px-4">{heading}</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <AnimateStagger delay={0.3} stagger={0.1} className="space-y-8 text-foreground text-xl leading-relaxed">
          <SitePageBody paragraphs={paragraphs} />
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
