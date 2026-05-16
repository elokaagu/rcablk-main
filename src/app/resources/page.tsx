import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageHeader } from "@/components/PageHeader";
import { BlkLetterformsBackdrop } from "@/components/BlkLetterformsBackdrop";
import { SitePageBody } from "@/components/SitePageBody";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import { brand } from "@/lib/brand-colors";
import type { Metadata } from "next";

const description =
  "Scholarships, funding, and resources for students. Sir Frank Bowling Scholarship, refugee and asylum seeker scholarships.";

export const metadata: Metadata = {
  title: "Resources | RCA BLK",
  description,
  openGraph: {
    title: "Resources | RCA BLK",
    description,
  },
};

export const revalidate = 3600;

export default async function Resources() {
  const defaults = getSitePageDefaults("resources");

  if (!defaults) {
    throw new Error("Missing default content for resources page");
  }

  const cms = await getSitePage("resources");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div className="relative flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-brand-yellowSoft text-black">
      <PageBackground color={brand.yellowSoft} />
      <BlkLetterformsBackdrop />
      <PageHeader />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 sm:px-10 lg:px-12">
        <div className="flex flex-1 flex-col justify-center py-10 pb-12 pt-[max(5.5rem,env(safe-area-inset-top,0px))] sm:py-14 sm:pb-16 sm:pt-28">
          <AnimateIn delay={0.15} duration={0.55} y={12}>
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-3xl font-normal tracking-brand text-black sm:text-4xl">
                {heading}
              </h1>
            </header>
          </AnimateIn>

          <main className="mx-auto w-full max-w-xl sm:max-w-[34rem]">
            <AnimateStagger
              delay={0.2}
              stagger={0.08}
              className="space-y-7 text-center font-serif text-lg leading-[1.35] tracking-brand text-black sm:space-y-8 sm:text-xl"
            >
              <SitePageBody paragraphs={paragraphs} />
            </AnimateStagger>
          </main>
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
