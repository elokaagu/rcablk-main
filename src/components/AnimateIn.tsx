"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
}

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  y = 24,
  opacity = 0,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
      }
    );
  }, [delay, duration, opacity, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
