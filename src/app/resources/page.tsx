import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | RCA BLK",
  description: "Scholarships, funding, and resources for students. Sir Frank Bowling Scholarship, refugee and asylum seeker scholarships.",
  openGraph: { title: "Resources | RCA BLK" },
};

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      {/* Title */}
      <div className="text-center py-8">
        <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Resources</h2>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <div className="space-y-6 sm:space-y-8 text-foreground text-lg sm:text-xl leading-relaxed">
          <p>
            The RCA is committed to celebrating diversity, eliminating discrimination and
            promoting equality of opportunity to all.
          </p>

          <p>
            The College believes it is vital to provide visible pathways of access to study across
            our programmes for those suffering financial hardship and for those from under-represented groups.
          </p>

          <p>
            In 2022, the RCA gave £1m from its own operating surplus to create the Sir Frank
            Bowling Scholarships to support individuals from under-represented communities,
            prioritising Black and African diaspora British applicants and / or including those
            facing significant financial hardship.
          </p>

          <p>
            The Sir Frank Bowling Scholarship will support students from Black African and
            Caribbean diaspora heritage, or mixed Black African and Caribbean diaspora
            heritage, across MA, MRes and PhD study. Each year, 24 enrolled students will be
            awarded financial support for their tuition fees and living expenses in the duration of
            their time at RCA.
          </p>

          <p>
            Alongside this, through the support of generous individuals, charitable trusts and
            foundations and corporate supporters, the RCA is proud to offer a number of named
            scholarships. Availability of named scholarships is limited and almost all are
            restricted to certain MA programmes.
          </p>

          <p>
            The RCA offers a range of scholarships that are open to students with refugee and
            asylum seeker status. These scholarships cover the full cost of study at the RCA;
            some scholarships also offer support towards living expenses.
          </p>

          <h3 className="text-2xl font-display font-normal text-foreground pt-4">Links</h3>

          <ul className="space-y-2 list-none p-0">
            <li>
              <a href="https://www.rca.ac.uk/studying-at-the-rca/fees-and-funding/scholarships/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                Scholarships
              </a>
            </li>
            <li>
              <a href="#" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                Online Resources
              </a>
            </li>
            <li>
              <a href="#" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                Join RCA BLK
              </a>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
