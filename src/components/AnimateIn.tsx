"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import gsap from "gsap";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  /** When true, defer animation until the element scrolls into view. Defaults to true. */
  whileInView?: boolean;
  /** Re-run the animation every time the element re-enters the viewport. */
  repeat?: boolean;
  /** Distance from the viewport (in px or CSS length) at which to trigger. */
  rootMargin?: string;
}

const SMOOTH_EASE = "expo.out";

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  duration = 0.9,
  y = 24,
  opacity = 0,
  whileInView = true,
  repeat = false,
  rootMargin = "0px 0px -10% 0px",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRespectMotion, setShouldRespectMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShouldRespectMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (shouldRespectMotion) {
      gsap.set(el, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const fromVars = { opacity, y, filter: "blur(6px)" } as gsap.TweenVars;
    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      ease: SMOOTH_EASE,
    };

    if (!whileInView) {
      gsap.fromTo(el, fromVars, toVars);
      return;
    }

    gsap.set(el, fromVars);
    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true;
            gsap.to(el, toVars);
            if (!repeat) observer.disconnect();
          } else if (!entry.isIntersecting && repeat && played) {
            played = false;
            gsap.set(el, fromVars);
          }
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, opacity, y, whileInView, repeat, rootMargin, shouldRespectMotion]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
