import Image from "next/image";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { ContactForm } from "@/components/ContactForm";
import { AnimateIn } from "@/components/AnimateIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0 relative">
      {/* Full-bleed background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/RCA-BLACK-SQUARE.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <SlideOutMenu />

      {/* Coral overlay - organic ellipse shape with circular cutout revealing background */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "#E88350",
          clipPath: "ellipse(90% 85% at 55% 50%)",
          maskImage: "radial-gradient(circle at 50% 42%, transparent 22%, black 22%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 42%, transparent 22%, black 22%)",
        }}
        aria-hidden
      />

      {/* Content - white text on coral areas */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <AnimateIn delay={0.1} duration={0.5} y={16}>
          <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
            <Logo className="h-10" variant="white" />
          </div>
        </AnimateIn>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 px-4 sm:px-8 lg:px-12 pt-8 pb-8">
          {/* Left column - contact info block */}
          <AnimateIn delay={0.2} duration={0.6} y={20} className="flex flex-col">
            <div className="space-y-1 text-white text-lg sm:text-xl">
              <p className="font-display font-bold tracking-tight">RCA BLK</p>
              <p>Royal College of Art</p>
              <p>Kensington Gore</p>
              <p>South Kensington</p>
              <p>London SW7 2EU</p>
              <div className="pt-4 space-y-1">
                <p>
                  <a href="mailto:rcablk@rca.ac.uk" className="underline hover:opacity-80 transition-opacity">
                    rcablk@rca.ac.uk
                  </a>
                </p>
                <p>
                  <a href="https://rcablk.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">
                    rcablk.com
                  </a>
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Right column - circular image and form */}
          <AnimateIn delay={0.25} duration={0.6} y={20} className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[min(360px,75vw)] aspect-square rounded-full overflow-hidden ring-4 ring-white/30 shrink-0">
              <BlurImage src="/RCA-BLACK-SQUARE.jpg" alt="RCA BLK" aspectRatio="1/1" className="rounded-full w-full h-full object-cover" sizes="360px" />
            </div>
            <div className="mt-6 w-full max-w-md [&_*]:text-white [&_input]:bg-white/20 [&_input]:border-white/50 [&_input]:placeholder:text-white/70 [&_textarea]:bg-white/20 [&_textarea]:border-white/50 [&_textarea]:placeholder:text-white/70 [&_button]:bg-white [&_button]:text-[#E88350]">
              <ContactForm />
            </div>
          </AnimateIn>
        </div>

        {/* Bottom row */}
        <div className="px-4 sm:px-8 lg:px-12 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-white text-base">
          <div className="space-y-1">
            <p>Email Address</p>
            <p>Sign Up</p>
          </div>
          <div className="text-right space-y-1">
            <p>Identity: Studio Frith</p>
            <p>Web Development: Eloka Agu</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}