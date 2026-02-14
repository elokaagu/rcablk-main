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
      className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground px-4 sm:px-6 py-4 sm:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 id="cookie-banner-title" className="text-base sm:text-lg font-display font-medium uppercase tracking-wide mb-1">
            Cookies
          </h2>
          <p id="cookie-banner-desc" className="text-sm sm:text-base text-secondary-foreground/95 leading-relaxed">
            We use cookies to make our site work and to improve your experience. By using this site, you agree to our use of cookies.{" "}
            <Link href="/cookie-policy" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
              Read our Cookie Policy
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2.5 font-display font-medium bg-secondary-foreground text-primary-foreground hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-5 py-2.5 font-display font-medium text-secondary-foreground border-2 border-secondary-foreground hover:opacity-80 transition-opacity uppercase tracking-wide"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
