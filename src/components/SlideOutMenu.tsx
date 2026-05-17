"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MenuLetterformPeek } from "@/components/MenuLetterformPeek";
import { SiteSearchForm } from "@/components/search/SiteSearchForm";

type NavItem = { label: string; href: string; external?: boolean };

const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Alumni", href: "/alumni" },
  { label: "Support", href: "/support" },
];

const TAIL_NAV: NavItem[] = [
  { label: "Contact", href: "/contact" },
  { label: "Instagram", href: "https://www.instagram.com/rcablk/", external: true },
  { label: "Shop", href: "https://shop.rca.ac.uk/collections/rca-blk", external: true },
];

const linkClass =
  "text-base font-serif font-medium text-black hover:opacity-70 transition-opacity py-2.5 min-h-[44px] flex items-center touch-manipulation uppercase";

function NavLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  return items.map((item) =>
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
      <Link key={item.label} href={item.href} onClick={onNavigate} className={linkClass}>
        {item.label}
      </Link>
    ),
  );
}

const SlideOutMenu = ({ iconOnDark = false }: { iconOnDark?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [menuIconLoaded, setMenuIconLoaded] = useState(false);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-50 flex h-12 min-h-[44px] w-12 min-w-[44px] touch-manipulation items-center justify-center text-foreground transition-opacity hover:opacity-70 ${open ? "pointer-events-none opacity-0" : ""}`}
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

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-transparent lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile: split yellow letterforms + orange nav (reference) */}
      <div
        className={`fixed inset-0 z-40 flex h-[100dvh] max-h-[100dvh] transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-[38%] min-w-[7.5rem] max-w-[11rem] shrink-0 bg-homeHero">
          <MenuLetterformPeek />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col bg-secondary">
          <button
            type="button"
            onClick={close}
            className="absolute right-0 top-0 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-black hover:opacity-70"
            style={{ top: "max(1rem, env(safe-area-inset-top))", right: "max(0.75rem, env(safe-area-inset-right))" }}
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          <nav
            className="flex flex-1 flex-col justify-center gap-0.5 overflow-y-auto px-6 py-16"
            aria-label="Main navigation"
          >
            <NavLinks items={PRIMARY_NAV} onNavigate={close} />
            <div className="my-3 h-px w-8 bg-black/20" aria-hidden />
            <NavLinks items={TAIL_NAV} onNavigate={close} />
          </nav>
        </div>
      </div>

      {/* Desktop: orange panel from the right */}
      <div
        className={`fixed inset-y-0 right-0 z-40 hidden h-[100dvh] max-h-[100dvh] w-max max-w-full justify-end transition-transform duration-300 ease-in-out lg:flex ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="relative box-border flex h-full w-[min(17rem,52vw)] min-w-[11.25rem] max-w-[18rem] flex-col bg-secondary"
          style={{
            paddingRight: "max(0px, env(safe-area-inset-right))",
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <button
            type="button"
            onClick={close}
            className="absolute flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-black hover:opacity-70"
            style={{ top: "max(1.5rem, env(safe-area-inset-top))", right: "max(1.5rem, env(safe-area-inset-right))" }}
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          <nav
            className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-8 pb-4 pt-20"
            aria-label="Main navigation"
          >
            <NavLinks items={[...PRIMARY_NAV, ...TAIL_NAV]} onNavigate={close} />
          </nav>
          <div className="mt-auto border-t-2 border-black/15 px-8 pb-4 pt-5">
            <p className="mb-2 font-display text-[0.6rem] font-black uppercase tracking-[0.2em] text-black/55">
              Search
            </p>
            <SiteSearchForm compact onNavigate={close} inputId="menu-site-search" />
          </div>
          <div className="px-8 pb-8 pt-2">
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
