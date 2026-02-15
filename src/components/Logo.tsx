"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "black" | "white";
}

export function Logo({ className = "", variant = "black" }: LogoProps) {
  const [loaded, setLoaded] = useState(false);

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
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`h-full w-auto object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-70"
        }`}
      />
    </Link>
  );
}
