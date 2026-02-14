"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface AnimateStaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
}

export function AnimateStagger({
  children,
  className = "",
  delay = 0,
  stagger = 0.12,
  duration = 0.6,
  y = 20,
}: AnimateStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(":scope > *");
    if (els.length === 0) return;

    gsap.fromTo(
      els,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
      }
    );
  }, [delay, stagger, duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
