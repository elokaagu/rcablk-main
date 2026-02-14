import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { BlurImage } from "@/components/BlurImage";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(4, 70%, 65%)" }}>
      <SlideOutMenu />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[250px_1fr] min-h-screen">
        {/* Left - Logo */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8">
          <Logo className="h-10" />
        </div>

        {/* Main content */}
        <div className="px-4 sm:px-8 lg:px-0 pt-6 sm:pt-8 flex flex-col">
          {/* Address & links */}
          <div className="space-y-1 text-foreground text-xl">
            <p className="font-display font-bold tracking-display-tight">RCA BLK</p>
            <p>Royal College of Art</p>
            <p>Kensington Gore</p>
            <p>South Kensington</p>
            <p>London SW7 2EU</p>
            <div className="pt-4 space-y-1">
              <p><a href="mailto:rcablk@rca.ac.uk" className="underline hover:opacity-70 transition-opacity">rcablk@rca.ac.uk</a></p>
              <p><a href="https://rcablk.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">rcablk.com</a></p>
            </div>
          </div>

          {/* Central circle image */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8 sm:py-12">
            <div className="relative w-full max-w-[min(400px,85vw)] aspect-square rounded-full overflow-hidden shrink-0">
              <BlurImage src="/RCA-BLACK-SQUARE.jpg" alt="RCA BLK" aspectRatio="1/1" className="rounded-full w-full h-full" />
            </div>
            <ContactForm />
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-8 pr-0 sm:pr-8">
            <div className="space-y-1 text-foreground text-lg">
              <p>Email Address</p>
              <a href="mailto:rcablk@rca.ac.uk" className="underline underline-offset-2 hover:opacity-70 transition-opacity">rcablk@rca.ac.uk</a>
            </div>
            <div className="text-right space-y-1 text-foreground text-lg">
              <p>Identity: Studio Frith</p>
              <p>Web Development : Eloka Agu</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
