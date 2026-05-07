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
        <div
          className="px-5 pb-6 pt-12 text-center sm:py-10"
          style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 2rem))" }}
        >
          <h2 className="px-2 font-display text-2xl font-normal text-foreground sm:text-3xl">{heading}</h2>
        </div>
      </AnimateIn>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-12 sm:px-10 sm:pb-16 lg:px-12">
        <AnimateStagger
          delay={0.3}
          stagger={0.08}
          className="space-y-6 text-base leading-relaxed text-foreground sm:space-y-8 sm:text-lg md:text-xl"
        >
          <SitePageBody paragraphs={paragraphs} />
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
