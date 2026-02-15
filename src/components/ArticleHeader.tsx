import Link from "next/link";
import { Logo } from "@/components/Logo";

interface ArticleHeaderProps {
  backHref: string;
  backLabel: string;
}

export function ArticleHeader({ backHref, backLabel }: ArticleHeaderProps) {
  return (
    <header className="px-4 sm:px-8 pt-6 sm:pt-8">
      <div className="flex flex-col gap-3 text-left">
        <Logo className="h-10 w-auto" />
        <Link
          href={backHref}
          className="inline-flex items-center w-fit px-4 py-2.5 bg-white/95 text-foreground hover:bg-white transition-colors rounded-lg border border-foreground/15 shadow-sm no-underline font-medium"
        >
          ← {backLabel}
        </Link>
      </div>
    </header>
  );
}
