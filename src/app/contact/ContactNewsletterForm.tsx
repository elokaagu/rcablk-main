"use client";

export function ContactNewsletterForm() {
  return (
    <div className="max-w-md">
      <h2 className="font-serif text-lg font-normal text-black sm:text-xl">Newsletter</h2>
      <p className="mt-2 font-serif text-sm leading-relaxed text-black/60 sm:text-base">
        Join the mailing list — we&apos;ll pass your address to the team by email.
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
          <input
            id="newsletter-email"
            name="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="min-h-[48px] min-w-0 flex-1 rounded-md border border-black/15 bg-white px-4 font-serif text-base text-black outline-none ring-offset-2 transition-[border-color,box-shadow] placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
          />
          <button
            type="submit"
            className="min-h-[48px] shrink-0 rounded-md bg-black px-6 font-serif text-base text-white transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
