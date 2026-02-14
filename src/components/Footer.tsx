"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
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
        { label: "Instagram", href: "https://www.instagram.com/rcablk/", external: true },
      ],
    },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-base">
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
                  className="hover:underline cursor-pointer"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={j}
                  href={item.href}
                  className="hover:underline cursor-pointer no-underline"
                >
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
            className={`h-12 sm:h-14 w-auto object-contain transition-all duration-700 ease-out ${
              logoLoaded ? "opacity-100 blur-0" : "opacity-60 blur-md"
            }`}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
