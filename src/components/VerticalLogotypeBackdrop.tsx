import Image from "next/image";
import { cn } from "@/lib/utils";

const STEPPED_LOGOTYPE = "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

/**
 * Centered vertical (stepped) RCA BLK logotype behind page content.
 */
export function VerticalLogotypeBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div className="relative aspect-[2268/993] w-[min(78vw,22rem)] opacity-[0.12] sm:w-[min(52vw,26rem)] sm:opacity-[0.16]">
        <Image
          src={STEPPED_LOGOTYPE}
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 44vw, 18rem"
        />
      </div>
    </div>
  );
}
