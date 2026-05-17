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
    <header className="px-page-safe pt-page-chrome sm:px-8">
      <Link
        href={backHref}
        aria-label={ariaLabel ?? `${backLabel} — go back to listing`}
        className="inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 py-2 font-serif text-sm text-black/75 underline decoration-black/25 underline-offset-[0.25em] transition-colors hover:text-black hover:decoration-black/50"
      >
        <span aria-hidden className="translate-y-px select-none text-black/60">
          ←
        </span>
        {backLabel}
      </Link>
    </header>
  );
}
