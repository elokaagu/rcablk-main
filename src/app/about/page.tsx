import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { SitePageBody } from "@/components/SitePageBody";
import { BlurImage } from "@/components/BlurImage";
import { AnimateStagger } from "@/components/AnimateStagger";
import { RevealText } from "@/components/RevealText";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import Image from "next/image";
import type { Metadata } from "next";

const ABOUT_SEAM_LOGO = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

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
    <div className="about-page flex min-h-dvh min-h-screen min-w-0 w-full flex-col overflow-x-clip bg-white">
      <PageBackground background="linear-gradient(to right, #ffffff 0%, #ffffff 50%, hsl(207, 70%, 88%) 50%, hsl(207, 70%, 88%) 100%) fixed" />
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
        {/* Sticky seam logo, only meaningful on lg+ where the seam exists */}
        <div
          className="pointer-events-none sticky z-30 hidden h-0 w-full lg:block"
          style={{
            top: "max(5.25rem, calc(env(safe-area-inset-top) + 3.25rem))",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
            <Image
              src={ABOUT_SEAM_LOGO}
              alt="RCA BLK"
              width={220}
              height={88}
              className="pointer-events-none h-14 w-auto select-none sm:h-16 lg:h-[4.5rem]"
              priority
            />
          </div>
        </div>

        <div className="grid min-h-screen grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Left column - Text. On mobile we drop a small wordmark above the
            heading because the seam logo is desktop-only. */}
        <div className="bg-white px-5 py-10 pt-[max(4.5rem,env(safe-area-inset-top))] sm:px-8 sm:py-12 lg:px-16 lg:py-12 lg:pt-12">
          <Image
            src={ABOUT_SEAM_LOGO}
            alt="RCA BLK"
            width={220}
            height={88}
            className="mb-6 h-12 w-auto sm:h-14 lg:hidden"
            priority
          />
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
          <AnimateStagger delay={0.35} stagger={0.1} className="flex flex-col gap-6 sm:gap-8 items-center w-full">
          <div className="w-full max-w-sm self-start">
            <BlurImage src="/3_Website Images/Chris Ofili.jpg" alt="Chris Ofili" aspectRatio="3/4" className="rounded-md" />
            <p className="mt-3 text-xl font-display font-black text-foreground tracking-wide uppercase">
              Chris Ofili
            </p>
          </div>

          <div className="w-full max-w-sm self-end">
            <BlurImage src="/3_Website Images/magdalene odundo2.jpeg" alt="Magdalene Odundo" aspectRatio="3/4" className="rounded-md" />
            <p className="mt-3 text-xl font-display font-black text-foreground tracking-wide uppercase">
              Magdalene Odundo
            </p>
          </div>
          </AnimateStagger>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
