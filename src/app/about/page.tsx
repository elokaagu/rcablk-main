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
    <div
      className="flex min-h-dvh min-h-screen min-w-0 w-full flex-col overflow-x-clip bg-white"
      style={{
        backgroundImage:
          "linear-gradient(to right, #ffffff 0%, #ffffff 50%, hsl(207, 70%, 88%) 50%, hsl(207, 70%, 88%) 100%)",
      }}
    >
      <PageBackground background="linear-gradient(to right, #ffffff 0%, #ffffff 50%, hsl(207, 70%, 88%) 50%, hsl(207, 70%, 88%) 100%) fixed" />
      <SlideOutMenu />

      <main className="relative flex-1 lg:min-h-screen">
        {/* Sticky seam logo: zero layout height, centers on 50% seam while scrolling */}
        <div
          className="pointer-events-none sticky z-30 h-0 w-full"
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
        {/* Left column - Text */}
        <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 bg-white">
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
          className="px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 flex flex-col gap-6 sm:gap-8 items-center pt-6 sm:pt-8"
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
