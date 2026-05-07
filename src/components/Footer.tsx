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
      <footer
        className="border-t border-white/10 bg-black px-5 py-8 text-white/85 sm:px-8"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
    <footer
      className="bg-secondary text-secondary-foreground px-5 py-8 sm:px-8 sm:py-10"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] leading-snug sm:grid-cols-4 sm:gap-x-8 sm:text-base md:flex-1">
          {columns.map((col, i) => (
            <div key={i} className="flex min-w-0 flex-col gap-2">
              {col.items.map((item, j) =>
                typeof item === "string" ? (
                  <span key={j} className="break-words">{item}</span>
                ) : "external" in item && item.external ? (
                  <a
                    key={j}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer break-words hover:underline"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={j} href={item.href} className="cursor-pointer break-words no-underline hover:underline">
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-start justify-start md:justify-end">
          <Image
            src="/rca_logo.png"
            alt="Royal College of Art"
            width={210}
            height={60}
            loading="lazy"
            onLoad={() => setLogoLoaded(true)}
            className={`h-10 w-auto object-contain transition-all duration-700 ease-out sm:h-12 md:h-14 ${
              logoLoaded ? "opacity-100 blur-0" : "opacity-60 blur-md"
            }`}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
