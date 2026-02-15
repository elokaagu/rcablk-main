"use client";

import { Logo } from "@/components/Logo";

export function FixedLogoHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex items-center px-4 sm:px-6 bg-white/90 backdrop-blur-sm border-b border-foreground/10"
      style={{ paddingTop: "env(safe-area-inset-top)", minHeight: "3.5rem" }}
      aria-label="Site header"
    >
      <Logo className="h-8 sm:h-9" />
    </header>
  );
}
