"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudioWordmark } from "./StudioBrand";

type NavItem = { href: string; label: string; description?: string };
type NavSection = { title: string; items: ReadonlyArray<NavItem> };

const SECTIONS: ReadonlyArray<NavSection> = [
  {
    title: "Overview",
    items: [{ href: "/studio", label: "Dashboard", description: "At a glance" }],
  },
  {
    title: "Content",
    items: [
      { href: "/studio/events", label: "Events", description: "Programme entries" },
      { href: "/studio/news", label: "News", description: "Articles & announcements" },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/studio/alumni", label: "Alumni", description: "Preview images" },
      { href: "/studio/pages", label: "Pages", description: "On-site copy" },
    ],
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/studio") return pathname === "/studio";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ------------------------------------------------------------------ */
/* Inner nav body — shared between desktop rail and mobile drawer      */
/* ------------------------------------------------------------------ */

function SidebarBody({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand stripe + wordmark */}
      <div>
        <div aria-hidden className="h-[3px] w-full bg-homeHero" />
        <div className="px-7 py-7">
          <Link
            href="/studio"
            onClick={onNavigate}
            className="group inline-flex flex-col gap-1"
            aria-label="RCA BLK Studio dashboard"
          >
            <StudioWordmark />
            <span className="font-serif text-[0.85rem] leading-snug text-black/50">
              Editorial control surface
            </span>
          </Link>
        </div>
      </div>

      {/* Sections — scrolls if very tall */}
      <nav aria-label="Studio sections" className="flex-1 overflow-y-auto px-4 pb-6">
        <ul className="flex flex-col gap-7">
          {SECTIONS.map((section) => (
            <li key={section.title}>
              <h2 className="px-3 font-serif text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/45">
                {section.title}
              </h2>
              <ul className="mt-2 flex flex-col gap-px">
                {section.items.map((item) => {
                  const active = isActive(item.href, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                          active
                            ? "bg-black/[0.04] text-black"
                            : "text-black/65 hover:bg-black/[0.03] hover:text-black"
                        }`}
                      >
                        {/* Active marker — a homeHero notch on the left */}
                        <span
                          aria-hidden
                          className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-sm bg-homeHero transition-opacity ${
                            active ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span className="flex flex-1 flex-col gap-0.5">
                          <span className="font-serif text-[1rem] leading-tight">{item.label}</span>
                          {item.description && (
                            <span className="font-serif text-[0.78rem] leading-tight text-black/45">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-black/10 px-7 py-5">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            onClick={onNavigate}
            className="group inline-flex items-center justify-between gap-3 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
          >
            <span>View site</span>
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              onLogout();
            }}
            className="group inline-flex items-center justify-between gap-3 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
          >
            <span>Sign out</span>
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public component — desktop rail + mobile drawer                     */
/* ------------------------------------------------------------------ */

export function StudioSidebar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="sticky top-0 z-30 flex min-h-[3.5rem] items-center justify-between border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5 lg:hidden"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] w-full bg-homeHero" />
        <Link
          href="/studio"
          aria-label="RCA BLK Studio dashboard"
          className="-ml-1 inline-flex min-h-[44px] items-center px-1"
        >
          <StudioWordmark />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="studio-sidebar-drawer"
          className="-mr-1 inline-flex min-h-[44px] items-center gap-2 px-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black/70 transition-colors hover:text-black"
        >
          <span aria-hidden className="flex flex-col gap-1">
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
          </span>
          <span>Menu</span>
        </button>
      </div>

      {/* Desktop fixed rail */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-black/10 bg-white lg:block">
        <SidebarBody pathname={pathname} onLogout={() => void logout()} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          tabIndex={open ? 0 : -1}
        />
        {/* Panel */}
        <div
          id="studio-sidebar-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Studio navigation"
          className={`absolute inset-y-0 left-0 w-[88%] max-w-[20rem] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarBody
            pathname={pathname}
            onLogout={() => void logout()}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
