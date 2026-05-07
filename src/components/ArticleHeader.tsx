import Link from "next/link";

interface ArticleHeaderProps {
  backHref: string;
  /** Short visible label, e.g. "Events" */
  backLabel: string;
  /** Optional screen-reader hint */
  ariaLabel?: string;
}

export function ArticleHeader({ backHref, backLabel, ariaLabel }: ArticleHeaderProps) {
  return (
    <header
      className="px-5 pt-4 sm:px-8 sm:pt-6"
      style={{ paddingTop: "max(1rem, calc(env(safe-area-inset-top) + 0.5rem))" }}
    >
      <Link
        href={backHref}
        aria-label={ariaLabel ?? `${backLabel} — go back to listing`}
        className="inline-flex min-h-[44px] items-center gap-1.5 py-2 font-serif text-sm text-black/75 underline decoration-black/25 underline-offset-[0.25em] transition-colors hover:text-black hover:decoration-black/50"
      >
        <span aria-hidden className="translate-y-px select-none text-black/60">
          ←
        </span>
        {backLabel}
      </Link>
    </header>
  );
}
