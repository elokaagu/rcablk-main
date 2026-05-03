"use client";

export function ContactNewsletterForm() {
  return (
    <form
      className="max-w-xs font-mono text-sm text-black sm:text-base"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = (fd.get("newsletter-email") as string) || "";
        window.location.href = `mailto:rcablk@rca.ac.uk?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent(`Please add: ${email}`)}`;
      }}
    >
      <label htmlFor="newsletter-email" className="block">
        Email Address
      </label>
      <div className="mt-2 flex flex-wrap items-end gap-3 border-b border-black/70 pb-1 focus-within:border-black">
        <input
          id="newsletter-email"
          name="newsletter-email"
          type="email"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-black outline-none placeholder:text-black/40 sm:text-base"
        />
        <button type="submit" className="shrink-0 underline decoration-black/60 underline-offset-4 hover:opacity-80">
          Sign Up
        </button>
      </div>
    </form>
  );
}
