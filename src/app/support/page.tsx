import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { SitePageBody } from "@/components/SitePageBody";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { getSitePageDefaults, SUPPORT_PAGE_SLUG } from "@/data/site-pages-static";
import { getSitePage } from "@/lib/cms/pages-repo";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | RCA BLK",
  description: "Support RCA BLK. Help sustain our exhibitions, events, residencies, and artist programmes.",
  openGraph: { title: "Support | RCA BLK" },
};

export const dynamic = "force-dynamic";

const LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

export default async function Support() {
  const defaults = getSitePageDefaults(SUPPORT_PAGE_SLUG)!;
  const cms = await getSitePage(SUPPORT_PAGE_SLUG);
  const paragraphs = cms?.paragraphs?.length ? cms.paragraphs : defaults.defaultParagraphs;

  return (
    <div
      className="relative flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden text-black"
      style={{ backgroundColor: "#F3916B" }}
    >
      <PageBackground color="#F3916B" />
      <SlideOutMenu />

      <Link
        href="/"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        aria-label="RCA BLK home"
      >
        <Image src={LOGOTYPE} alt="RCA BLK" width={200} height={60} className="h-7 w-auto sm:h-9" priority />
      </Link>

      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div
          className="flex select-none flex-col items-center justify-center font-display font-black leading-[0.82] text-[#FFDD00] opacity-[0.92]"
          style={{
            fontSize: "min(28vw, 14rem)",
            textShadow: "0 0.02em 0 rgba(0,0,0,0.06)",
          }}
        >
          <span className="block">B</span>
          <span className="block">L</span>
          <span className="block">K</span>
        </div>
      </div>

      {/* y-center: one column so title + copy sit mid-viewport between logo band and footer */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 sm:px-10 lg:px-12">
        <div
          className="flex flex-1 flex-col justify-center py-10 pt-[max(5.5rem,env(safe-area-inset-top,0px))] pb-12 sm:py-14 sm:pt-28 sm:pb-16"
        >
          <AnimateIn delay={0.15} duration={0.55} y={12}>
            <header className="mb-8 text-center sm:mb-10">
              <h1 className="font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl">
                {cms?.title?.trim() ? cms.title : defaults.title}
              </h1>
            </header>
          </AnimateIn>

          <main className="mx-auto w-full max-w-xl sm:max-w-[34rem]">
            <AnimateStagger
              delay={0.2}
              stagger={0.08}
              className="space-y-7 text-center font-serif text-lg leading-relaxed text-black sm:space-y-8 sm:text-xl sm:leading-relaxed"
            >
              <SitePageBody paragraphs={paragraphs} />
            </AnimateStagger>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
