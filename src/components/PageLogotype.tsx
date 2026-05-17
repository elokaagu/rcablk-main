import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PageLogotypeProps = {
  src: string;
  className?: string;
  priority?: boolean;
};

/** Corner “rca blk” wordmark on transparent PNG letterforms. */
export function PageLogotype({ src, className, priority = true }: PageLogotypeProps) {
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
        className="h-7 w-auto sm:h-9"
      />
    </Link>
  );
}
