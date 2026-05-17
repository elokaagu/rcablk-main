import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PageLogotypeProps = {
  src: string;
  className?: string;
  priority?: boolean;
};

/** Corner “rca blk” wordmark — fixed top-left on every page that uses it. */
export function PageLogotype({ src, className, priority = true }: PageLogotypeProps) {
  return (
    <Link
      href="/"
      className={cn("fixed z-40", className)}
      style={{
        top: "max(1rem, env(safe-area-inset-top))",
        left: "max(1rem, env(safe-area-inset-left))",
      }}
      aria-label="RCA BLK home"
    >
      <Image
        src={src}
        alt="RCA BLK"
        width={200}
        height={43}
        priority={priority}
        className="h-6 w-auto max-w-[calc(100vw-5.75rem)] object-contain object-left sm:h-8 md:h-9 sm:max-w-none"
      />
    </Link>
  );
}
