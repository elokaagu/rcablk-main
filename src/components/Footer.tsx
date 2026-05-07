"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [logoLoaded, setLogoLoaded] = useState(false);

  /** Full footer on inner pages — primary nav lives in the homepage letterforms. */
  const columns = [
    {
      items: ["Royal College of Art", "Kensington Gore", "London, SW7 2EU"],
    },
    {
      items: [
        { label: "Events", href: "/events" },
        { label: "News", href: "/news" },
        { label: "Support", href: "/support" },
      ],
    },
    {
      items: [
        { label: "Accessibility", href: "/accessibility" },
        { label: "Cookie Policy", href: "/cookie-policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
    {
      items: [
        { label: "Contact", href: "/contact" },
        { label: "Shop", href: "https://shop.rca.ac.uk/collections/rca-blk", external: true },
        { label: "Instagram", href: "https://www.instagram.com/rcablk/", external: true },
      ],
    },
  ];

  if (isHome) {
    return (
      <footer className="border-t border-white/10 bg-black px-4 py-8 text-white/85 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs font-serif text-sm leading-relaxed text-white/75">
            <p>Royal College of Art</p>
            <p>Kensington Gore</p>
            <p>London, SW7 2EU</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-serif text-sm">
            <Link href="/accessibility" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Accessibility
            </Link>
            <Link href="/cookie-policy" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Cookie Policy
            </Link>
            <Link href="/terms" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Terms
            </Link>
            <Link href="/privacy-policy" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Privacy
            </Link>
            <a
              href="https://shop.rca.ac.uk/collections/rca-blk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Shop
            </a>
            <a
              href="https://www.instagram.com/rcablk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Instagram
            </a>
          </div>
          <div className="flex shrink-0 justify-start sm:justify-end">
            <Image
              src="/rca_logo.png"
              alt="Royal College of Art"
              width={210}
              height={60}
              loading="lazy"
              onLoad={() => setLogoLoaded(true)}
              className={`h-10 w-auto object-contain invert transition-all duration-700 ease-out sm:h-12 ${
                logoLoaded ? "opacity-100 blur-0" : "opacity-60 blur-md"
              }`}
            />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-secondary text-secondary-foreground px-4 sm:px-8 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 text-base sm:grid-cols-3 sm:gap-6 md:grid-cols-5">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-2">
            {col.items.map((item, j) =>
              typeof item === "string" ? (
                <span key={j}>{item}</span>
              ) : "external" in item && item.external ? (
                <a
                  key={j}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={j} href={item.href} className="cursor-pointer no-underline hover:underline">
                  {item.label}
                </Link>
              )
            )}
          </div>
        ))}
        <div className="flex flex-col items-end justify-start gap-1">
          <Image
            src="/rca_logo.png"
            alt="Royal College of Art"
            width={210}
            height={60}
            loading="lazy"
            onLoad={() => setLogoLoaded(true)}
            className={`h-12 w-auto object-contain transition-all duration-700 ease-out sm:h-14 ${
              logoLoaded ? "opacity-100 blur-0" : "opacity-60 blur-md"
            }`}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
