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
  title: "Resources | RCA BLK",
  description: "Scholarships, funding, and resources for students. Sir Frank Bowling Scholarship, refugee and asylum seeker scholarships.",
  openGraph: { title: "Resources | RCA BLK" },
};

export const dynamic = "force-dynamic";

export default async function Resources() {
  const defaults = getSitePageDefaults("resources")!;
  const cms = await getSitePage("resources");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0"
      style={{ backgroundColor: "#FAF05A" }}
    >
      <PageBackground color="#FAF05A" />
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">{heading}</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <AnimateStagger
          delay={0.3}
          stagger={0.08}
          className="space-y-6 sm:space-y-8 text-foreground text-lg sm:text-xl leading-relaxed"
        >
          <SitePageBody paragraphs={paragraphs} />
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
