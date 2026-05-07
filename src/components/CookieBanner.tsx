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
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-black px-5 py-4 text-white/90 shadow-[0_-2px_10px_rgba(0,0,0,0.2)] sm:px-6 sm:py-5"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
        paddingRight: "max(1.25rem, env(safe-area-inset-right))",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="cookie-banner-desc" className="flex-1 text-sm leading-relaxed">
          <span id="cookie-banner-title" className="sr-only">Cookie consent</span>
          We use cookies to enhance your browsing experience. You can accept all cookies, manage your preferences, or decline non-essential cookies.{" "}
          <Link href="/cookie-policy" className="text-white underline-offset-2 hover:underline hover:opacity-80 transition-opacity">
            Learn more
          </Link>
        </p>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            onClick={accept}
            className="min-h-[44px] rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Allow Cookies
          </button>
          <button
            onClick={decline}
            className="min-h-[44px] rounded-full border border-white/80 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
