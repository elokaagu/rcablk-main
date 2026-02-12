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
  ];

  const secondaryItems = [
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "https://www.instagram.com/rcablk/" },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 text-foreground hover:opacity-70 transition-opacity flex items-center justify-center"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X size={32} />
        ) : (
          <Image src="/RCA BLK–MENU ICON.svg" alt="Menu" width={32} height={32} />
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-primary/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background z-40 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="pt-20 px-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-display font-medium text-foreground hover:opacity-70 transition-opacity py-1"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4" />
          {secondaryItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-lg font-display font-medium text-foreground hover:opacity-70 transition-opacity py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SlideOutMenu;
