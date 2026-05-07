"use client";

import { usePathname } from "next/navigation";
import { StudioSidebar } from "./_brand/StudioSidebar";

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isLogin = pathname === "/studio/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-white text-black">
        {/* Brand stripe even on login for visual continuity */}
        <div aria-hidden className="h-[3px] w-full bg-homeHero" />
        <main>{children}</main>
      </div>
    );
  }

  return (
    // Soft warm-cream studio canvas. The sidebar (rendered inside) keeps its
    // own white background so it reads as the navigational rail; the main
    // content area inherits this paper tone, which gives white surfaces
    // (StudioCard, dashboard tiles, list tables, schema setup) a subtle
    // "documents on a desk" lift instead of disappearing into a white void.
    <div className="min-h-screen bg-[#F5EEDF] text-black">
      <StudioSidebar pathname={pathname} />
      {/* Main content — offset on lg+ to clear the fixed sidebar rail */}
      <main className="lg:pl-72">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-10 sm:py-16">{children}</div>
      </main>
    </div>
  );
}
