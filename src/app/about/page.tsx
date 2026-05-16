import Footer from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { SitePageBody } from "@/components/SitePageBody";
import { BlurImage } from "@/components/BlurImage";
import { AnimateStagger } from "@/components/AnimateStagger";
import { PageTitle } from "@/components/PageTitle";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { DesignCredits } from "@/components/DesignCredits";
import { getSitePageDefaults } from "@/data/site-pages-static";
import { getSitePage, pickLiveSiteTitle } from "@/lib/cms/pages-repo";
import { brand } from "@/lib/brand-colors";
import Image from "next/image";
import type { Metadata } from "next";

const ABOUT_SEAM_LOGO = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

const splitBackground = {
  backgroundImage: `linear-gradient(to right, #ffffff 0%, #ffffff 50%, ${brand.blue} 50%, ${brand.blue} 100%)`,
};

export const metadata: Metadata = {
  title: "About Us | RCA BLK",
  description:
    "The Royal College of Art Association of Black Students, Alumni & Friends. Founded in 2020, we promote and support contemporary visual arts for artists of Black and African heritage.",
  openGraph: {
    title: "About Us | RCA BLK",
    description:
      "The Royal College of Art Association of Black Students, Alumni & Friends.",
  },
};

/** Revalidate CMS copy on a short interval; page is otherwise static. */
export const revalidate = 60;

export default async function About() {
  const defaults = getSitePageDefaults("about");

  if (!defaults) {
    throw new Error("Missing default content for about page");
  }

  const cms = await getSitePage("about");

  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;
  const heading = pickLiveSiteTitle(cms, defaults.title);

  return (
    <div
      className="flex min-h-dvh min-w-0 w-full flex-col overflow-x-clip bg-white text-black max-lg:bg-white lg:bg-fixed"
      style={splitBackground}
    >
      <PageHeader />

      <main className="relative flex-1 lg:min-h-screen">
        <div
          className="pointer-events-none sticky z-30 hidden h-0 w-full lg:block"
          style={{ top: "3.5rem" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
            <Image
              src={ABOUT_SEAM_LOGO}
              alt="RCA BLK"
              width={220}
              height={88}
              className="pointer-events-none h-14 w-auto select-none sm:h-16 lg:h-[4.5rem]"
            />
          </div>
        </div>

        <div className="grid min-h-screen grid-cols-1 gap-0 lg:grid-cols-2">
          <section className="bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-20 lg:py-16">
            <Image
              src={ABOUT_SEAM_LOGO}
              alt="RCA BLK"
              width={220}
              height={88}
              className="mb-6 h-12 w-auto sm:h-14 lg:hidden"
              priority
            />

            <div className="mb-8 sm:mb-10">
              <PageTitle>{heading}</PageTitle>
            </div>

            <AnimateStagger
              delay={0.25}
              stagger={0.08}
              duration={0.95}
              y={18}
              className="max-w-xl space-y-5 text-lg leading-[1.35] tracking-brand text-black sm:space-y-6 sm:text-xl"
            >
              <SitePageBody paragraphs={paragraphs} />
            </AnimateStagger>

            <div className="mt-12 space-y-8 border-t border-black/10 pt-10 sm:mt-14">
              <NewsletterSignup />
              <DesignCredits />
            </div>
          </section>

          <aside
            className="flex flex-col items-center gap-8 px-6 py-10 pt-10 sm:gap-10 sm:px-10 sm:py-14 lg:px-20 lg:py-16 lg:pt-16"
            style={{ backgroundColor: brand.blue }}
            aria-label="Featured RCA BLK artists"
          >
            <AnimateStagger
              delay={0.35}
              stagger={0.1}
              className="flex w-full flex-col items-center gap-8 sm:gap-10"
            >
              <figure className="w-full max-w-[14rem] self-start sm:max-w-[15rem]">
                <BlurImage
                  src="/3_Website Images/Chris Ofili.jpg"
                  alt="Portrait or artwork related to Chris Ofili"
                  aspectRatio="3/4"
                  className="rounded-md"
                />
                <figcaption className="mt-3 font-display text-lg font-black uppercase tracking-wide text-black">
                  Chris Ofili
                </figcaption>
              </figure>

              <figure className="w-full max-w-[14rem] self-end sm:max-w-[15rem]">
                <BlurImage
                  src="/3_Website Images/magdalene odundo2.jpeg"
                  alt="Portrait or artwork related to Magdalene Odundo"
                  aspectRatio="3/4"
                  className="rounded-md"
                />
                <figcaption className="mt-3 font-display text-lg font-black uppercase tracking-wide text-black">
                  Magdalene Odundo
                </figcaption>
              </figure>
            </AnimateStagger>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
