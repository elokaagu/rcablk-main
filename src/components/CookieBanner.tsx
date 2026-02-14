"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "rcablk-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white px-4 sm:px-6 py-2 sm:py-2.5 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <p id="cookie-banner-desc" className="text-sm text-white/95 leading-snug flex-1">
          <span id="cookie-banner-title" className="font-display font-medium uppercase tracking-wide text-white">
            Cookies.{" "}
          </span>
          We use cookies to improve your experience.{" "}
          <Link href="/cookie-policy" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Cookie Policy
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 text-sm font-display font-medium bg-white text-black hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-1.5 text-sm font-display font-medium border border-white text-white hover:opacity-80 transition-opacity uppercase tracking-wide"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
