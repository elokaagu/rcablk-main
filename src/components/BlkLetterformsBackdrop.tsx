import Image from "next/image";
import { cn } from "@/lib/utils";

const BLK_SVG = "/SVG Letterforms/RCA BLK–Letterforms-BLK.svg";

type BlkLetterformsBackdropProps = {
  className?: string;
  /**
   * `svg` — brand letterform marque (#C4E5FA in asset), for Resources etc.
   * `display` — stacked B/L/K in RCABLK display face (Support page).
   */
  variant?: "svg" | "display";
  /** Text colour when variant is `display` */
  color?: string;
};

/**
 * Centered vertical BLK letterforms behind page content (Support / Resources).
 */
export function BlkLetterformsBackdrop({
  className,
  variant = "svg",
  color = "#FFDD00",
}: BlkLetterformsBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {variant === "display" ? (
        <div
          className="flex select-none flex-col items-center justify-center font-display font-black leading-[0.82] opacity-[0.92]"
          style={{
            color,
            fontSize: "min(28vw, 14rem)",
            textShadow: "0 0.02em 0 rgba(0,0,0,0.06)",
          }}
        >
          <span className="block">B</span>
          <span className="block">L</span>
          <span className="block">K</span>
        </div>
      ) : (
        <div className="relative h-[min(70vh,40rem)] w-[min(36vw,13rem)] opacity-90 sm:w-[min(28vw,14rem)]">
          <Image
            src={BLK_SVG}
            alt=""
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 40vw, 14rem"
            priority={false}
          />
        </div>
      )}
    </div>
  );
}
