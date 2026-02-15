import Link from "next/link";

interface ArticleHeaderProps {
  backHref: string;
  backLabel: string;
}

export function ArticleHeader({ backHref, backLabel }: ArticleHeaderProps) {
  return (
    <header className="px-4 sm:px-8 pt-4 sm:pt-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-display font-medium uppercase tracking-wide hover:opacity-90 transition-opacity no-underline"
      >
        <span aria-hidden>←</span>
        {backLabel}
      </Link>
    </header>
  );
}
