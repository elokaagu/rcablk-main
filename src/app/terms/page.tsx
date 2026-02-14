import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | RCA BLK",
  description: "Terms and conditions of use for the RCA BLK website.",
  openGraph: { title: "Terms & Conditions | RCA BLK" },
};

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground px-4">Terms & Conditions</h2>
      </div>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <div className="space-y-8 text-foreground text-xl leading-relaxed">
          <p>
            This website is run by the Royal College of Art. By using rcablk.com, you agree to
            these terms and conditions.
          </p>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Use of this website</h3>
            <p>
              The content of this website is for general information only. The Royal College of
              Art and RCA BLK endeavour to keep the information up to date and correct, but we
              make no representations or warranties of any kind about the completeness or
              accuracy of the material.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Intellectual property</h3>
            <p>
              Unless otherwise stated, all content on this site is the property of the Royal
              College of Art or its licensors. You may not reproduce, distribute, or use our
              content without prior written permission.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Links to other sites</h3>
            <p>
              This website may link to external sites. We are not responsible for the content
              or privacy practices of those sites.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Contact</h3>
            <p>
              For questions about these terms, please contact{" "}
              <a href="mailto:rcablk@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">rcablk@rca.ac.uk</a>{" "}
              or{" "}
              <a href="mailto:websupport@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">websupport@rca.ac.uk</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
