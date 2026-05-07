"use client";

import { useState } from "react";

export function ContactNewsletterForm() {
  const [focused, setFocused] = useState(false);

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px w-6 bg-black/30" />
        <span className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/55">
          Newsletter
        </span>
      </div>

      <h2 className="mt-3 font-serif text-xl font-normal leading-snug text-black sm:text-2xl">
        Stay close to the work.
      </h2>
      <p className="mt-2 max-w-sm font-serif text-sm leading-relaxed text-black/60 sm:text-[0.95rem]">
        Join the mailing list — we&apos;ll pass your address along to the team
        by email. No spam, unsubscribe anytime.
      </p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = (fd.get("newsletter-email") as string) || "";
          window.location.href = `mailto:rcablk@rca.ac.uk?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent(`Please add: ${email}`)}`;
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>

        {/* Single-line pill that visually contains the input + button as one
            object. Border deepens on focus, button slides on hover. */}
        <div
          className={`group relative flex flex-col gap-3 rounded-md border bg-white p-1.5 transition-[border-color,box-shadow,transform] duration-300 ease-out sm:flex-row sm:items-stretch sm:rounded-full sm:p-1.5 ${
            focused
              ? "border-black/45 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.35)]"
              : "border-black/15 shadow-[0_2px_12px_-10px_rgba(0,0,0,0.25)]"
          }`}
        >
          <input
            id="newsletter-email"
            name="newsletter-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="min-h-[44px] min-w-0 flex-1 rounded-md bg-transparent px-4 font-serif text-base text-black outline-none placeholder:text-black/35 sm:rounded-full sm:px-5"
          />
          <button
            type="submit"
            className="group/btn relative inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-md bg-black px-6 font-display text-[0.7rem] font-black uppercase tracking-[0.18em] text-white transition-transform duration-300 hover:-translate-y-[1px] sm:rounded-full"
          >
            <span className="relative z-[1]">Sign up</span>
            <span
              aria-hidden
              className="relative z-[1] inline-block translate-x-0 text-base transition-transform duration-300 group-hover/btn:translate-x-0.5"
            >
              →
            </span>
            {/* Subtle sheen sweep on hover */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
