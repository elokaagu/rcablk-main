"use client";

import { useState } from "react";

/**
 * Minimal corner-anchored newsletter signup, modelled on the reference RCA
 * BLK contact page where the form is reduced to a single input ("Email
 * Address") with a "Sign Up" CTA underneath. Submits via a `mailto:` so it
 * works without a backend; the existing site never had real list management.
 */
export function ContactNewsletterForm() {
  const [email, setEmail] = useState("");
  const [hover, setHover] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    const subject = encodeURIComponent("Newsletter signup");
    const body = encodeURIComponent(`Please add: ${email}`);
    window.location.href = `mailto:rcablk@rca.ac.uk?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5 text-black">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="newsletter-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full max-w-full border-b border-black/40 bg-transparent pb-1 font-serif text-base text-black outline-none transition-colors placeholder:text-black/85 focus:border-black sm:w-[18rem] sm:text-[1.05rem]"
      />
      <button
        type="submit"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group/btn relative inline-flex w-fit items-center gap-2 font-serif text-[1.05rem] leading-tight text-black"
      >
        <span className="relative">
          Sign Up
          <span
            aria-hidden
            className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hover ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </span>
        <span
          aria-hidden
          className={`inline-block text-base transition-transform duration-300 ${
            hover ? "translate-x-0.5" : "translate-x-0"
          }`}
        >
          →
        </span>
      </button>
    </form>
  );
}
