"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SlideOutMenu = () => {
  const [open, setOpen] = useState(false);

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
    "text-lg font-display font-medium text-black hover:opacity-70 transition-opacity py-2 block uppercase tracking-display-tight";

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 text-foreground hover:opacity-70 transition-opacity flex items-center justify-center"
        aria-label="Open menu"
      >
        <Image src="/RCA BLK–MENU ICON.svg" alt="Menu" width={32} height={32} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel: two columns - gold strip + orange panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ease-in-out flex ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Left: narrow golden-yellow strip */}
        <div
          className="w-12 sm:w-16 flex-shrink-0"
          style={{ backgroundColor: "#F3A721" }}
        />

        {/* Right: main orange panel with content */}
        <div
          className="relative w-64 sm:w-80 flex flex-col"
          style={{ backgroundColor: "#D95E26" }}
        >
          {/* Close button - top right */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-black hover:opacity-70 transition-opacity p-1"
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          {/* Nav links */}
          <nav className="flex-1 pt-20 px-8 pb-8 flex flex-col gap-1">
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

          {/* Footer: RCA logo + text */}
          <div className="px-8 pb-8 flex items-center gap-3">
            <Image
              src="/rca_logo.png"
              alt=""
              width={120}
              height={120}
              className="h-16 w-auto object-contain opacity-90"
            />
            <span className="text-black text-sm font-body">Royal College of Art</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideOutMenu;
