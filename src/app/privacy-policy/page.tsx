import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RCA BLK",
  description: "RCA BLK privacy policy. How we collect, use, and protect your personal information.",
  openGraph: { title: "Privacy Policy | RCA BLK" },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground px-4">Privacy Policy</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <AnimateStagger delay={0.3} stagger={0.1} className="space-y-8 text-foreground text-xl leading-relaxed">
          <p>
            This privacy policy explains how RCA BLK and the Royal College of Art collect,
            use, and protect your personal information when you use rcablk.com.
          </p>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Information we collect</h3>
            <p>
              When you use this website, we may collect information you provide directly (such
              as when you contact us via the contact form), as well as technical information
              about your visit (such as your IP address and how you use the site). We use
              cookies to improve your experience; see our{" "}
              <Link href="/cookie-policy" className="underline hover:opacity-70 transition-opacity">Cookie Policy</Link>{" "}
              for details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">How we use your information</h3>
            <p>
              We use your information to respond to inquiries, improve our website, and
              comply with legal obligations. We do not sell your personal data.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Data protection</h3>
            <p>
              The Royal College of Art is the data controller for this website. We take
              appropriate measures to keep your information secure and handle it in line with
              applicable data protection law.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Your rights</h3>
            <p>
              You have the right to access, correct, or delete your personal data. If you have
              questions or wish to exercise these rights, please contact us.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Contact</h3>
            <p>
              For privacy-related enquiries, please contact{" "}
              <a href="mailto:rcablk@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">rcablk@rca.ac.uk</a>{" "}
              or{" "}
              <a href="mailto:websupport@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">websupport@rca.ac.uk</a>.
            </p>
          </div>
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
