import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | RCA BLK",
  description: "Support RCA BLK. Help sustain our exhibitions, events, residencies, and artist programmes.",
  openGraph: { title: "Support | RCA BLK" },
};

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(18, 70%, 65%)" }}>
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Support</h2>
      </div>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <div className="space-y-6 sm:space-y-8 text-foreground text-lg sm:text-xl leading-relaxed">
          <p>
            RCA BLK&apos;s supporters play a vital role in sustaining our key activities, from the
            commissioning of major new exhibitions and events, and the development of our
            pioneering participatory, learning and offsite programmes, to the provision of much-needed residencies and affordable onsite studios for artists.
          </p>

          <p>
            By supporting RCA BLK you will directly contribute to the sustainability, ambition
            and future development of one of London&apos;s leading independent arts organisations.
          </p>

          <p>
            We develop a close and reciprocal relationship with all of our Supporters, giving you
            the opportunity to enjoy a tailored package of benefits whilst enabling RCA BLK to
            flourish and increase the amount of support and opportunities we offer to artists,
            audiences and our community.
          </p>

          <p>
            RCA BLK&apos;s supporters play a vital role in sustaining our key activities, from the
            commissioning of major new exhibitions and events, and the development of our
            pioneering participatory, learning and offsite programmes, to the provision of much-needed residencies and affordable onsite studios for artists.
          </p>

          <p>
            To learn more about joining RCA BLK&apos;s Supporters&apos; Scheme or to discuss a particular
            project, please contact us.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
