import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import Link from "next/link";
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

      <AnimateIn delay={0.1} duration={0.5} y={16}>
        <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Support</h2>
        </div>
      </AnimateIn>

      <main className="flex-1 max-w-2xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 w-full">
        <AnimateStagger delay={0.3} stagger={0.1} className="space-y-8 text-foreground text-lg sm:text-xl leading-relaxed">
          {/* Why support */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">Why support?</h3>
            <p>
              RCA BLK&apos;s supporters play a vital role in sustaining our key activities: major
              exhibitions and events, participatory and learning programmes, and residencies and
              affordable studios for artists.
            </p>
            <p className="mt-6">
              By supporting RCA BLK you directly contribute to the sustainability and future
              development of one of London&apos;s leading independent arts organisations.
            </p>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">Benefits of supporting</h3>
            <p className="mb-4">
              We develop a close, reciprocal relationship with all our Supporters:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>A tailored package of benefits</li>
              <li>Direct involvement in our programme</li>
              <li>Priority access to exhibitions and events</li>
              <li>Opportunities to connect with artists and our community</li>
            </ul>
            <p className="mt-6">
              Your support enables RCA BLK to flourish and increase the opportunities we offer
              to artists, audiences and our community.
            </p>
          </section>

          {/* Pull quote - visual anchor */}
          <blockquote className="border-l-4 border-foreground/30 pl-6 py-2 italic text-foreground/90">
            &ldquo;Supporters are at the heart of RCA BLK&apos;s ambition to champion Black and
            African heritage artists.&rdquo;
          </blockquote>

          {/* Get in touch */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">Get in touch</h3>
            <p className="mb-6">
              To learn more about joining RCA BLK&apos;s Supporters&apos; Scheme or to discuss a
              particular project, we&apos;d love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 font-display font-medium text-background bg-secondary hover:opacity-90 transition-opacity uppercase tracking-wide"
            >
              Contact us
            </Link>
          </section>

          {/* Links */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">Links</h3>
            <ul className="space-y-2 list-none p-0">
              <li>
                <Link href="/contact" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                  Contact RCA BLK
                </Link>
              </li>
              <li>
                <a href="mailto:rcablk@rca.ac.uk" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                  rcablk@rca.ac.uk
                </a>
              </li>
              <li>
                <a href="https://www.rca.ac.uk/generationrca/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-foreground hover:opacity-70 transition-opacity decoration-2">
                  GenerationRCA (Support the RCA)
                </a>
              </li>
            </ul>
          </section>
        </AnimateStagger>
      </main>

      <Footer />
    </div>
  );
}
