import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageLogotype } from "@/components/PageLogotype";
import { SitePageBody } from "@/components/SitePageBody";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { VerticalBlkBackdrop } from "@/components/site/VerticalBlkBackdrop";

export type BlkBackdropSitePageProps = {
  backgroundColor: string;
  /** Tint for stacked SVG letterforms (Support). */
  letterColor?: string;
  /** Pre-rendered BLK lockup (Resources). */
  letterformImage?: string;
  /** Stacked glyph row behind copy (Support → RCA). */
  stack?: "blk" | "rca";
  /** Horizontal “rca blk” wordmark in the corner */
  logotypeSrc: string;
  /** Omit corner wordmark below `lg` (Support reference). */
  hideLogotypeOnMobile?: boolean;
  title: string;
  paragraphs: string[];
};

/**
 * Shared editorial layout for Support & Resources: home logotype, sticky
 * vertical BLK letterforms (stops above footer), centred serif body.
 */
export function BlkBackdropSitePage({
  backgroundColor,
  letterColor,
  letterformImage,
  stack = "blk",
  logotypeSrc,
  hideLogotypeOnMobile = false,
  title,
  paragraphs,
}: BlkBackdropSitePageProps) {
  return (
    <div
      className="relative flex min-h-screen-safe min-w-0 w-full flex-col overflow-x-clip text-black"
      style={{ backgroundColor }}
    >
      <PageBackground color={backgroundColor} />
      <SlideOutMenu />

      <PageLogotype src={logotypeSrc} hideOnMobile={hideLogotypeOnMobile} />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="grid flex-1 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
          <div
            className="pointer-events-none sticky top-0 z-0 h-[100dvh] w-full self-start overflow-hidden"
            aria-hidden
          >
            <VerticalBlkBackdrop
              letterColor={letterColor}
              letterformImage={letterformImage}
              stack={stack}
            />
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-page-safe sm:px-10 lg:px-12">
            <div className="flex flex-1 flex-col justify-center pb-12 py-10 pt-page-chrome sm:py-14 sm:pb-16 sm:pt-28">
              <AnimateIn delay={0.15} duration={0.55} y={12}>
                <header className="mb-8 text-center sm:mb-10">
                  <h1 className="font-serif text-2xl font-normal tracking-tight text-black sm:text-3xl md:text-4xl">
                    {title}
                  </h1>
                </header>
              </AnimateIn>

              <main className="mx-auto w-full max-w-xl sm:max-w-[34rem]">
                <AnimateStagger
                  delay={0.2}
                  stagger={0.08}
                  className="space-y-7 text-center font-serif text-lg leading-relaxed text-black sm:space-y-8 sm:text-xl sm:leading-relaxed [&_.prose]:mx-auto [&_.prose]:max-w-none [&_.prose]:text-center [&_.prose_p]:font-serif [&_.prose_ol]:mx-auto [&_.prose_ol]:w-fit [&_.prose_ol]:list-inside [&_.prose_ol]:text-left [&_.prose_ol]:pl-0 [&_.prose_ul]:mx-auto [&_.prose_ul]:w-fit [&_.prose_ul]:list-inside [&_.prose_ul]:text-left [&_.prose_ul]:pl-0"
                >
                  <SitePageBody paragraphs={paragraphs} />
                </AnimateStagger>
              </main>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
