import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "black" | "white";
}

export function Logo({ className = "", variant = "black" }: LogoProps) {
  const logotypePath =
    variant === "white"
      ? "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-White.png"
      : "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png";

  return (
    <Link href="/" className={`block no-underline ${className}`}>
      <Image
        src={logotypePath}
        alt="RCA BLK"
        width={200}
        height={60}
        className="h-full w-auto object-contain"
      />
    </Link>
  );
}
