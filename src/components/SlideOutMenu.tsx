"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SlideOutMenu = () => {
  const [open, setOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [menuIconLoaded, setMenuIconLoaded] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Resources", href: "/resources" },
    { label: "News", href: "/news" },
    { label: "Alumni", href: "/alumni" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "https://www.instagram.com/rcablk/", external: true },
  ];

  const linkClass =
    "text-lg font-display font-medium text-black hover:opacity-70 transition-opacity py-3 min-h-[44px] flex items-center touch-manipulation block uppercase tracking-display-tight";

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed z-50 text-foreground hover:opacity-70 transition-opacity flex items-center justify-center w-12 h-12 min-w-[44px] min-h-[44px]"
        style={{ top: "max(1rem, env(safe-area-inset-top))", right: "max(1rem, env(safe-area-inset-right))" }}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <Image
          src="/RCA BLK–MENU ICON.svg"
          alt="Menu"
          width={32}
          height={32}
          loading="lazy"
          onLoad={() => setMenuIconLoaded(true)}
          className={`flex-shrink-0 transition-all duration-700 ease-out ${
            menuIconLoaded ? "opacity-100 blur-0" : "opacity-60 blur-sm"
          }`}
        />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="relative w-[min(85vw,20rem)] sm:w-80 flex flex-col"
          style={{ backgroundColor: "#D95E26", paddingRight: "env(safe-area-inset-right)", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Close button - top right */}
          <button
            onClick={() => setOpen(false)}
            className="absolute text-black hover:opacity-70 transition-opacity p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ top: "max(1.5rem, env(safe-area-inset-top))", right: "max(1.5rem, env(safe-area-inset-right))" }}
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          {/* Nav links */}
          <nav className="flex-1 pt-20 px-8 pb-8 flex flex-col gap-1" aria-label="Main navigation">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Footer: RCA logo */}
          <div className="px-8 pb-8">
            <Image
              src="/rca_logo.png"
              alt="Royal College of Art"
              width={120}
              height={120}
              loading="lazy"
              onLoad={() => setLogoLoaded(true)}
              className={`h-16 w-auto object-contain transition-all duration-700 ease-out ${
                logoLoaded ? "opacity-90 blur-0" : "opacity-50 blur-md"
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;
