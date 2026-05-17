import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { cn } from "@/lib/utils";

type PageLogotypeProps = {
  src: string;
  /** Square block lockup on viewports below `lg` (reference mobile header). */
  blockOnMobile?: boolean;
  /** Hide corner wordmark on mobile (e.g. Support — copy-only hero). */
  hideOnMobile?: boolean;
  className?: string;
  priority?: boolean;
};

/** Corner “rca blk” wordmark — fixed top-left on inner pages. */
export function PageLogotype({
  src,
  blockOnMobile = false,
  hideOnMobile = false,
  className,
  priority = true,
}: PageLogotypeProps) {
  const blockSrc = BRAND_LOGOTYPES.squareBlack;

  return (
    <Link
      href="/"
      className={cn(
        "fixed z-40",
        hideOnMobile && "hidden lg:block",
        className,
      )}
      style={{
        top: "max(1rem, env(safe-area-inset-top))",
        left: "max(1rem, env(safe-area-inset-left))",
      }}
      aria-label="RCA BLK home"
    >
      {blockOnMobile ? (
        <>
          <Image
            src={blockSrc}
            alt="RCA BLK"
            width={88}
            height={88}
            priority={priority}
            className="h-11 w-auto object-contain object-left lg:hidden"
          />
          <Image
            src={src}
            alt="RCA BLK"
            width={200}
            height={43}
            priority={priority}
            className="hidden h-8 w-auto object-contain object-left md:h-9 lg:block"
          />
        </>
      ) : (
        <Image
          src={src}
          alt="RCA BLK"
          width={200}
          height={43}
          priority={priority}
          className="h-6 w-auto max-w-[calc(100vw-5.75rem)] object-contain object-left sm:h-8 md:h-9 sm:max-w-none"
        />
      )}
    </Link>
  );
}
