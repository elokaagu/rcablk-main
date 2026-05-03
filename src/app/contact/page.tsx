import Image from "next/image";
import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { AnimateIn } from "@/components/AnimateIn";
import { ContactNewsletterForm } from "./ContactNewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCA BLK",
  description: "Get in touch with RCA BLK. Royal College of Art, Kensington Gore, London SW7 2EU.",
  openGraph: { title: "Contact | RCA BLK" },
};

const LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";
const CONTACT_IMAGE = "/assets/event-seriki.jpg";

export default function Contact() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white text-black">
      <SlideOutMenu />

      <Link
        href="/"
        className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
        aria-label="RCA BLK home"
      >
        <Image src={LOGOTYPE} alt="RCA BLK" width={200} height={60} className="h-7 w-auto sm:h-9" priority />
      </Link>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 pb-16 pt-[max(5.5rem,env(safe-area-inset-top))] sm:gap-14 sm:px-10 sm:pb-20 sm:pt-28 lg:flex-row lg:items-start lg:gap-16 lg:px-12">
        <div className="flex min-w-0 flex-1 flex-col gap-10 lg:max-w-xl">
          <AnimateIn delay={0.08} duration={0.45} y={8}>
            <h1 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">Contact</h1>
          </AnimateIn>

          <AnimateIn delay={0.12} duration={0.45} y={8}>
            <address className="not-italic">
              <p className="font-serif text-lg font-semibold leading-relaxed sm:text-xl">RCA BLK</p>
              <p className="mt-1 font-serif text-lg leading-relaxed text-black/85 sm:text-xl">
                Royal College of Art
                <br />
                Kensington Gore
                <br />
                South Kensington
                <br />
                London SW7 2EU
              </p>
              <div className="mt-6 flex flex-col gap-2 font-serif text-lg sm:text-xl">
                <a
                  href="mailto:rcablk@rca.ac.uk"
                  className="w-fit underline decoration-black/35 underline-offset-[0.2em] transition-opacity hover:opacity-70"
                >
                  rcablk@rca.ac.uk
                </a>
                <a
                  href="https://rcablk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit underline decoration-black/35 underline-offset-[0.2em] transition-opacity hover:opacity-70"
                >
                  rcablk.com
                </a>
              </div>
            </address>
          </AnimateIn>

          <AnimateIn delay={0.18} duration={0.45} y={8}>
            <ContactNewsletterForm />
          </AnimateIn>

          <AnimateIn delay={0.22} duration={0.45} y={8}>
            <div className="border-t border-black/10 pt-8 font-serif text-sm leading-relaxed text-black/50 sm:text-base">
              <p>Identity: Studio Frith</p>
              <p className="mt-1">Web development: Eloka Agu</p>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.14} duration={0.5} y={12} className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[min(42vw,440px)]">
          <figure className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg shadow-[0_2px_24px_rgba(0,0,0,0.08)] lg:mx-0 lg:max-w-none">
            <Image
              src={CONTACT_IMAGE}
              alt="Studio ceramics and vessels"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 440px"
              priority
            />
          </figure>
        </AnimateIn>
      </main>

      <Footer />
    </div>
  );
}
