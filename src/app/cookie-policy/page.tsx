import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | RCA BLK",
  description: "RCA BLK cookie policy. How we use cookies on rcablk.com and how you can manage your preferences.",
  openGraph: { title: "Cookie Policy | RCA BLK" },
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground px-4">Cookie Policy</h2>
      </div>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <div className="space-y-8 text-foreground text-xl leading-relaxed">
          <p>
            This cookie policy explains how RCA BLK and the Royal College of Art use cookies
            and similar technologies when you visit rcablk.com. It forms part of our approach
            to privacy and explains your choices about how cookies are used.
          </p>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">What are cookies?</h3>
            <p>
              Cookies are small text files that are placed on your device (computer, tablet or
              mobile phone) when you visit a website. They are widely used to make websites
              work more efficiently and to provide information to the site owners.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">How we use cookies</h3>
            <p>
              We use cookies to:
            </p>
            <ul className="list-disc pl-8 mt-4 space-y-2">
              <li>ensure the website functions correctly (essential cookies)</li>
              <li>remember your preferences and settings</li>
              <li>understand how visitors use our site so we can improve it (analytics cookies, if applicable)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Types of cookies we use</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li><strong>Strictly necessary cookies:</strong> These are essential for the website to work. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.</li>
              <li><strong>Functionality cookies:</strong> These allow the website to remember choices you make (such as your preferred language or region) and provide enhanced features.</li>
              <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the site.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Managing your cookie preferences</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can
              set your browser to refuse cookies or to delete certain cookies. Please note
              that restricting cookies may affect the functionality of our website.
            </p>
            <p className="mt-4">
              For more information on how to manage cookies in your browser, visit{" "}
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">aboutcookies.org</a>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Updates to this policy</h3>
            <p>
              We may update this cookie policy from time to time to reflect changes in our
              practices or for other operational, legal or regulatory reasons. We encourage
              you to review this page periodically.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Contact us</h3>
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
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
