"use client";

import { useRef, useEffect, useLayoutEffect, useState, ReactNode } from "react";
import gsap from "gsap";

// useLayoutEffect warns during SSR; this component is "use client" so it only
// runs in the browser, but we still guard for safety in mixed environments.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface AnimateStaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
  /** When true, defer animation until the container scrolls into view. Defaults to true. */
  whileInView?: boolean;
  rootMargin?: string;
}

const SMOOTH_EASE = "expo.out";

export function AnimateStagger({
  children,
  className = "",
  delay = 0,
  stagger = 0.09,
  duration = 0.85,
  y = 22,
  whileInView = true,
  rootMargin = "0px 0px -10% 0px",
}: AnimateStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRespectMotion, setShouldRespectMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShouldRespectMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Set the initial hidden state synchronously before the browser paints so
  // children don't briefly flash in before the animation initialises.
  useIsoLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll<HTMLElement>(":scope > *");
    if (els.length === 0) return;
    if (shouldRespectMotion) {
      gsap.set(els, { opacity: 1, y: 0, filter: "none" });
      return;
    }
    gsap.set(els, { opacity: 0, y, filter: "blur(6px)" });
  }, [shouldRespectMotion, y]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll<HTMLElement>(":scope > *");
    if (els.length === 0) return;

    if (shouldRespectMotion) {
      gsap.set(els, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      stagger,
      ease: SMOOTH_EASE,
    };

    if (!whileInView) {
      gsap.to(els, toVars);
      return;
    }

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true;
            gsap.to(els, toVars);
            observer.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [delay, stagger, duration, y, whileInView, rootMargin, shouldRespectMotion]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
