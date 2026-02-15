"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SlideOutMenu = ({ iconOnDark = false }: { iconOnDark?: boolean }) => {
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
    "text-base font-serif font-medium text-black hover:opacity-70 transition-opacity py-2 min-h-[40px] flex items-center touch-manipulation block uppercase";

  return (
    <>
      {/* Toggle button - hidden when menu is open to avoid overlap with close button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-50 text-foreground hover:opacity-70 transition-opacity flex items-center justify-center w-12 h-12 min-w-[44px] min-h-[44px] ${open ? "pointer-events-none opacity-0" : ""}`}
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
          className={`flex-shrink-0 transition-opacity duration-300 ${
            menuIconLoaded ? "opacity-100" : "opacity-60"
          } ${iconOnDark ? "invert" : ""}`}
        />
      </button>

      {/* Overlay - transparent, click to close */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed inset-y-0 right-0 h-screen z-40 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="relative w-[33vw] min-w-[260px] max-w-[400px] h-full flex flex-col bg-secondary"
          style={{ paddingRight: "env(safe-area-inset-right)" }}
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
          <nav className="flex-1 pt-20 px-8 pb-8 flex flex-col gap-0.5" aria-label="Main navigation">
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
              className={`h-16 w-auto object-contain transition-opacity duration-300 ${
                logoLoaded ? "opacity-90" : "opacity-50"
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;
