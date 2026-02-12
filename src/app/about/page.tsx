import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SlideOutMenu />

      {/* RCA BLK Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <Logo className="h-12" />
      </div>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left column - Text */}
        <div className="px-8 lg:px-16 py-8 lg:py-12 bg-white">
          <h2 className="text-3xl font-normal text-foreground mb-6">About Us</h2>

          <div className="space-y-6 text-foreground text-base leading-relaxed max-w-xl">
            <p>
              The Royal College of Art Association of Black Students, Alumni &amp;
              Friends started as a grassroots organisation and community
              group in 2020.
            </p>

            <p>
              Since its inception RCA BLK has evolved after a successful tenure
              of partnerships and involvement. We&apos;re happy to be the first
              association in the country to action incremental change within an
              institutional ecosystem. Thus far, we are the proud initiators of the
              Sir Frank Bowling Scholarship, the RCA BLK x Yinka Shonibare
              Residency, BLACK STAR Time Capsule and the proud recipients
              of the Black British Artist Grant 2023.
            </p>

            <p>
              Our core objectives are to promote, improve and advance
              education by encouraging and supporting the practice of
              contemporary visual arts for artists who identify as Black and or
              of African heritage within the RCA community. We aim to do so by
              fostering relationships with pre-enrolled students, current
              students as well as alumni. RCA BLK has positively impacted the
              Black student experience and has built upon the rich legacies of
              the RCA Student and Alumni body.
            </p>

            <h3 className="text-2xl font-normal text-foreground pt-4">Stakeholders</h3>

            <p>
              RCA BLK&apos;s founding members are Emily Moore, Roxanne Simone, Melanie Issaka, Andy Hart, Josh Woolford, Jerome Ince-Mitchell, Ibrahim Cissé, Michael Forbes, Sheran Forbes, Mary Adeturinmo and Timi Oyedeji. The group currently has over 200 active members made up of current students and alumni with many friends and supporters from the wider RCA community. Through ongoing conversations and feedback from members of the RCA BLK organisation, it was evident that the legacy and achievements of black students and alumni of African and Caribbean heritage lacked acknowledgement, documentation and publication within and around the RCA archives and amongst the wider international community. However, this is not a new thought. Historically, RCA students have created groups that have provided a platform and a much-needed area of support for Black and PoC students. Exhibitions such as <em>RCA Black</em> co-created by Ekua McMorris and the <em>PoC Link-up Collective</em> by Jerome Ince-Mitchell have paved the way and created a network within and beyond the walls of the college. Nevertheless, the (in)visibility and (un)sustainability of Black alumni within the RCA remained prevalent as each year went by, and as a consequence, feelings of isolation, lack of diversity in student numbers, encounters of microaggressions and racial prejudice arose. To combat this and forge a new model, Emily Moore and Roxanne Simone began the conversation to create an association that would remain central to the Black student during and after their time at the RCA. This, we believe, does not end with us. RCA BLK is a reflection of all the visionaries that came before and will come after us.
            </p>

            <p>
              We are proud of our journey thus far and look forward to forging and actioning new initiatives and partnerships for the next generation.
            </p>
          </div>
        </div>

        {/* Right column - Images */}
        <div className="px-8 lg:px-16 py-8 lg:py-12 flex flex-col gap-8 items-center" style={{ backgroundColor: "hsl(207, 70%, 88%)" }}>
          <div className="w-full max-w-sm">
            <BlurImage src="/3_Website Images/Chris Ofili.jpg" alt="Chris Ofili" aspectRatio="3/4" />
            <p className="mt-3 text-xl font-black text-foreground tracking-wide">
              Chris Ofili
            </p>
          </div>

          <div className="w-full max-w-sm">
            <BlurImage src="/3_Website Images/magdalene odundo2.jpeg" alt="Magdalene Odundo" aspectRatio="3/4" />
            <p className="mt-3 text-xl font-black text-foreground tracking-wide">
              Magdalene Odundo
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
