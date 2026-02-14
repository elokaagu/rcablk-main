import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-base text-foreground mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="opacity-60">/</span>}
          {item.href ? (
            <Link href={item.href} className="underline hover:opacity-70 transition-opacity">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium max-w-[180px] sm:max-w-none truncate sm:whitespace-normal sm:overflow-visible" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
