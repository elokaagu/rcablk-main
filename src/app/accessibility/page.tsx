import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | RCA BLK",
  description: "RCA BLK accessibility statement. We aim to meet WCAG 2.2 Level AA.",
  openGraph: { title: "Accessibility | RCA BLK" },
};

export default function Accessibility() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <SlideOutMenu />

      <AnimateIn delay={0.1} duration={0.5} y={16}>
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground px-4">RCA BLK Accessibility Statement</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <AnimateStagger delay={0.3} stagger={0.1} className="space-y-8 text-foreground text-xl leading-relaxed">
          <p>
            This website is run by the Royal College of Art and this statement applies to
            rcablk.com. We aim to meet the requirements of the Web Content Accessibility
            Guidelines (WCAG) 2.2 (Level AA). We are also committed to making the site
            accessible in accordance with The Public Sector Bodies (Websites and Mobile
            Applications) (No.2) Accessibility Regulations 2018.
          </p>

          <div>
            <p>
              We have developed this site to ensure that it is usable by as many people as possible,
              regardless of age, technology, device or disability. This means you should be able to:
            </p>
            <ul className="list-disc pl-8 mt-4 space-y-2">
              <li>change colours, contrast levels and fonts</li>
              <li>zoom in up to 300% without the text spilling off the screen</li>
              <li>navigate most of the website using just a keyboard</li>
              <li>navigate most of the website using speech recognition software</li>
              <li>listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver).</li>
            </ul>
          </div>

          <p>
            We have also made the website text as simple as possible to understand. If you have a disability, AbilityNet has advice on making your device easier to use in the My Computer My Way section on its website.
          </p>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Feedback and contact information</h3>
            <p>
              If you need information on this website in a different format, such as an accessible PDF, large print, easy read, audio recording or braille, please email us at{" "}
              <a href="mailto:websupport@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">websupport@rca.ac.uk</a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Reporting accessibility problems with this website</h3>
            <p>
              We&apos;re always looking to improve the accessibility of our website. If you find any problems not listed on this page, or think we&apos;re not meeting accessibility requirements, please contact{" "}
              <a href="mailto:websupport@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">websupport@rca.ac.uk</a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Contacting us by phone or visiting us in person</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li>We provide a text relay service for people who are D/deaf, hearing impaired or have a speech impediment.</li>
              <li>Our offices have audio induction loops, or if you contact us before your visit we can arrange a British Sign Language (BSL) interpreter.</li>
              <li>See our main website for details on how to contact us.</li>
            </ul>
          </div>
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
