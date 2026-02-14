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
      className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white/90 px-4 sm:px-6 py-4 sm:py-4 rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.2)]"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p id="cookie-banner-desc" className="text-sm leading-relaxed flex-1">
          <span id="cookie-banner-title" className="sr-only">Cookie consent</span>
          We use cookies to enhance your browsing experience. You can accept all cookies, manage your preferences, or decline non-essential cookies.{" "}
          <Link href="/cookie-policy" className="text-white hover:opacity-80 transition-opacity">
            Learn more
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:opacity-90 transition-opacity"
          >
            Allow Cookies
          </button>
          <button
            onClick={decline}
            className="px-5 py-2.5 text-sm font-medium bg-transparent border border-white/80 text-white rounded-full hover:opacity-80 transition-opacity"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
