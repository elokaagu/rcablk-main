import Image from "next/image";
import Link from "next/link";
import { logotypeUsesScreenBlend } from "@/data/brand-logotypes";
import { cn } from "@/lib/utils";

type PageLogotypeProps = {
  src: string;
  className?: string;
  priority?: boolean;
};

/**
 * Corner “rca blk” wordmark. Coloured brand files ship on black matte;
 * mix-blend-screen drops the matte on saturated page backgrounds.
 */
export function PageLogotype({ src, className, priority = true }: PageLogotypeProps) {
  const blend = logotypeUsesScreenBlend(src);

  return (
    <Link
      href="/"
      className={cn(
        "absolute left-4 top-4 z-40 sm:left-6 sm:top-6",
        className,
      )}
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
      aria-label="RCA BLK home"
    >
      <Image
        src={src}
        alt="RCA BLK"
        width={200}
        height={43}
        priority={priority}
        className={cn("h-7 w-auto sm:h-9", blend && "mix-blend-screen")}
      />
    </Link>
  );
}
