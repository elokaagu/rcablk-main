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
  title: "Cookie Policy | RCA BLK",
  description: "RCA BLK cookie policy. How we use cookies on rcablk.com and how you can manage your preferences.",
  openGraph: { title: "Cookie Policy | RCA BLK" },
};

export const dynamic = "force-dynamic";

// See `privacy-policy/page.tsx` — shared warm-cream tone for the legal set.
const LEGAL_PAGE_BG = "#F0E7D5";

export default async function CookiePolicy() {
  const defaults = getSitePageDefaults("cookie-policy")!;
  const cms = await getSitePage("cookie-policy");
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
        <div
          className="px-5 pb-6 pt-12 text-center sm:py-10"
          style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 2rem))" }}
        >
          <h2 className="px-2 font-display text-xl font-normal text-foreground sm:text-2xl">{heading}</h2>
        </div>
      </AnimateIn>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-12 sm:px-10 sm:pb-16 lg:px-12">
        <AnimateStagger
          delay={0.3}
          stagger={0.1}
          className="space-y-6 text-base leading-relaxed text-foreground sm:space-y-8 sm:text-lg md:text-xl"
        >
          <SitePageBody paragraphs={paragraphs} />
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
