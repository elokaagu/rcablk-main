"use client";

import { useState } from "react";

type NewsletterSignupProps = {
  /** Light text on dark footer */
  variant?: "dark" | "light";
  className?: string;
};

/**
 * Single-field newsletter signup (Studio Frith contact / footer reference).
 * Submits via mailto — no list backend on this site.
 */
export function NewsletterSignup({ variant = "light", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [hover, setHover] = useState(false);
  const onDark = variant === "dark";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    const subject = encodeURIComponent("Newsletter signup");
    const body = encodeURIComponent(`Please add: ${email}`);
    window.location.href = `mailto:rcablk@rca.ac.uk?subject=${subject}&body=${body}`;
  }

  const text = onDark ? "text-white" : "text-black";
  const border = onDark ? "border-white/50 focus:border-white placeholder:text-white/75" : "border-black/40 focus:border-black placeholder:text-black/85";
  const underline = onDark ? "bg-white" : "bg-black";

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-1.5 ${text} ${className}`}>
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
        className={`w-full max-w-full border-b bg-transparent pb-1 font-serif text-base tracking-brand outline-none transition-colors sm:w-[18rem] sm:text-[1.05rem] ${border}`}
      />
      <button
        type="submit"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`group/btn relative inline-flex w-fit items-center gap-2 font-serif text-[1.05rem] leading-tight tracking-brand ${text}`}
      >
        <span className="relative">
          Sign Up
          <span
            aria-hidden
            className={`absolute inset-x-0 -bottom-0.5 h-px origin-left ${underline} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hover ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </span>
        <span
          aria-hidden
          className={`inline-block text-base transition-transform duration-300 ${hover ? "translate-x-0.5" : "translate-x-0"}`}
        >
          →
        </span>
      </button>
    </form>
  );
}
