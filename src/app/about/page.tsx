import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { SitePageBody } from "@/components/SitePageBody";
import { AboutGalleryColumn } from "@/components/about/AboutGalleryRotator";
import { AnimateStagger } from "@/components/AnimateStagger";
import { ABOUT_GALLERY } from "@/data/about-gallery";
import { RevealText } from "@/components/RevealText";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import Image from "next/image";
import type { Metadata } from "next";

import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";

const ABOUT_SEAM_LOGO = BRAND_LOGOTYPES.squareBlack;
const ABOUT_BLUE = "hsl(207, 70%, 88%)";

export const metadata: Metadata = {
  title: "About Us | RCA BLK",
  description:
    "The Royal College of Art Association of Black Students, Alumni & Friends. Founded in 2020, we promote and support contemporary visual arts for artists of Black and African heritage.",
  openGraph: { title: "About Us | RCA BLK" },
};

export const dynamic = "force-dynamic";

export default async function About() {
  const defaults = getSitePageDefaults("about")!;
  const cms = await getSitePage("about");
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div className="about-page flex min-h-screen-safe min-w-0 w-full flex-col overflow-x-clip lg:bg-white" style={{ backgroundColor: ABOUT_BLUE }}>
      <PageBackground color={ABOUT_BLUE} />
      {/*
        Mobile / tablet: stack vertically with each column owning its own
        background colour, so there's no awkward white/blue split at the seam.
        Desktop (lg+): split 50/50 with a hard seam, matching the reference.
      */}
      <style suppressHydrationWarning>{`
        @media (min-width: 1024px) {
          .about-page {
            background-image: linear-gradient(to right, #ffffff 0%, #ffffff 50%, hsl(207, 70%, 88%) 50%, hsl(207, 70%, 88%) 100%);
          }
        }
      `}</style>
      <SlideOutMenu />

      <main className="relative flex-1 lg:min-h-screen">
        {/* Mobile — full blue field, centred block logo, left-aligned copy (reference) */}
        <div className="lg:hidden" style={{ backgroundColor: ABOUT_BLUE }}>
          <div className="flex justify-center px-page-safe pb-6 pt-page-chrome">
            <Image
              src={ABOUT_SEAM_LOGO}
              alt="RCA BLK"
              width={200}
              height={200}
              priority
              className="h-28 w-auto sm:h-32"
            />
          </div>
          <div className="px-page-safe pb-10 text-left sm:px-8">
            <RevealText
              as="h2"
              delay={0.1}
              duration={1}
              stagger={0.06}
              className="mb-5 block text-left font-display text-2xl font-normal text-foreground sm:mb-6 sm:text-3xl"
            >
              {heading}
            </RevealText>
            <AnimateStagger
              delay={0.25}
              stagger={0.08}
              duration={0.95}
              y={18}
              className="max-w-none space-y-6 text-left text-lg leading-relaxed text-foreground"
            >
              <SitePageBody paragraphs={paragraphs} />
            </AnimateStagger>
          </div>
          <div className="flex flex-col items-center gap-6 px-5 pb-12 sm:gap-8 sm:px-8">
            <AnimateStagger
              delay={0.35}
              stagger={0.1}
              className="flex w-full flex-col items-center gap-6 sm:gap-8"
            >
              <AboutGalleryColumn items={ABOUT_GALLERY} />
            </AnimateStagger>
          </div>
        </div>

        <div className="hidden min-h-screen grid-cols-2 gap-0 lg:grid">
        {/* Left column — seam logotype top-aligned with the heading (lg+ only) */}
        <div className="relative bg-white px-page-safe py-10 pt-page-chrome sm:px-8 sm:py-12 lg:px-16 lg:py-12 lg:pt-12">
          <div
            className="pointer-events-none absolute left-full top-12 z-30 hidden -translate-x-1/2 lg:block"
            aria-hidden
          >
            <Image
              src={ABOUT_SEAM_LOGO}
              alt=""
              width={120}
              height={120}
              className="h-[4.5rem] w-auto select-none"
              priority
            />
          </div>
          <RevealText
            as="h2"
            delay={0.1}
            duration={1}
            stagger={0.06}
            className="text-2xl sm:text-3xl font-display font-normal text-foreground mb-4 sm:mb-6 block"
          >
            {heading}
          </RevealText>

          <AnimateStagger
            delay={0.25}
            stagger={0.08}
            duration={0.95}
            y={18}
            className="space-y-6 text-foreground text-lg leading-relaxed max-w-xl"
          >
            <SitePageBody paragraphs={paragraphs} />
          </AnimateStagger>
        </div>

        {/* Right column - Images (blue from top) */}
        <div
          className="flex flex-col items-center gap-6 px-5 py-10 sm:gap-8 sm:px-8 sm:py-12 lg:px-16 lg:py-12"
          style={{ backgroundColor: "hsl(207, 70%, 88%)" }}
        >
          <AnimateStagger
            delay={0.35}
            stagger={0.1}
            className="flex w-full flex-col items-center gap-6 sm:gap-8"
          >
            <AboutGalleryColumn items={ABOUT_GALLERY} />
          </AnimateStagger>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
