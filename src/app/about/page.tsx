import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { BlurImage } from "@/components/BlurImage";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { RevealText } from "@/components/RevealText";
import Image from "next/image";
import type { Metadata } from "next";

const ABOUT_SEAM_LOGO = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

export const metadata: Metadata = {
  title: "About Us | RCA BLK",
  description:
    "The Royal College of Art Association of Black Students, Alumni & Friends. Founded in 2020, we promote and support contemporary visual arts for artists of Black and African heritage.",
  openGraph: { title: "About Us | RCA BLK" },
};

export default function About() {
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
            About Us
          </RevealText>

          <AnimateStagger delay={0.25} stagger={0.08} duration={0.95} y={18} className="space-y-6 text-foreground text-lg leading-relaxed max-w-xl">
            <p>
              The Royal College of Art Association of Black Students, Alumni & Friends started as a grassroots organisation and community group in 2020.
            </p>

            <p>
              Since its inception RCA BLK has evolved after a successful tenure of partnerships and involvement. We&apos;re happy to be the first association in the country to action incremental change within an institutional ecosystem. Thus far, we are the proud initiators of the Sir Frank Bowling Scholarship, the RCA BLK x Yinka Shonibare Residency, BLACK STAR Time Capsule and the proud recipients of the Black British Artist Grant 2023.
            </p>

            <p>
              Our core objectives are to promote, improve and advance education by encouraging and supporting the practice of contemporary visual arts for artists who identify as Black and or of African heritage within the RCA community. We aim to do so by fostering relationships with pre-enrolled students, current students as well as alumni. RCA BLK has positively impacted the Black student experience and has built upon the rich legacies of the RCA Student and Alumni body.
            </p>

            <h3 className="text-2xl font-display font-normal text-foreground pt-4">Stakeholders</h3>

            <p>
              RCA BLK&apos;s founding members are Emily Moore, Roxanne Simone, Melanie Issaka, Andy Hart, Josh Woolford, Jerome Ince-Mitchell, Ibrahim Cissé, Michael Forbes, Sheran Forbes, Mary Adeturinmo and Timi Oyedeji. The group currently has over 200 active members made up of current students and alumni with many friends and supporters from the wider RCA community. Through ongoing conversations and feedback from members of the RCA BLK organisation, it was evident that the legacy and achievements of black students and alumni of African and Caribbean heritage lacked acknowledgement, documentation and publication within and around the RCA archives and amongst the wider international community. However, this is not a new thought. Historically, RCA students have created groups that have provided a platform and a much-needed area of support for Black and PoC students. Exhibitions such as <em>RCA Black</em> co-created by Ekua McMorris and the <em>PoC Link-up Collective</em> by Jerome Ince-Mitchell have paved the way and created a network within and beyond the walls of the college. Nevertheless, the (in)visibility and (un)sustainability of Black alumni within the RCA remained prevalent as each year went by, and as a consequence, feelings of isolation, lack of diversity in student numbers, encounters of microaggressions and racial prejudice arose. To combat this and forge a new model, Emily Moore and Roxanne Simone began the conversation to create an association that would remain central to the Black student during and after their time at the RCA. This, we believe, does not end with us. RCA BLK is a reflection of all the visionaries that came before and will come after us.
            </p>

            <p>
              We are proud of our journey thus far and look forward to forging and actioning new initiatives and partnerships for the next generation.
            </p>
          </AnimateStagger>
        </div>

        {/* Right column - Images (blue from top) */}
        <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 flex flex-col gap-6 sm:gap-8 items-center pt-6 sm:pt-8" style={{ backgroundColor: "hsl(207, 70%, 88%)" }}>
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
