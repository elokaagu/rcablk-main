"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import gsap from "gsap";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface RevealTextProps {
  children: string;
  /** HTML tag to render. Defaults to `span` so the component can be used inline. */
  as?: ElementType;
  className?: string;
  /** Stagger between words, in seconds. */
  stagger?: number;
  /** Duration of each word's tween, in seconds. */
  duration?: number;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Vertical offset (px) each word travels from. */
  y?: number;
  /** Trigger only once when scrolled into view. Defaults to true. */
  whileInView?: boolean;
  /** Children rendered alongside the text but not animated word-by-word (e.g. trailing icon). */
  trailing?: ReactNode;
}

const SMOOTH_EASE = "expo.out";

/**
 * Editorial word-by-word reveal: each word slides up from behind an invisible
 * mask while fading in, with a small stagger. Designed for headings where a
 * deliberate "type-set" feel is wanted; body copy should keep using
 * `AnimateStagger` at the paragraph level for legibility.
 */
export function RevealText({
  children,
  as: Tag = "span",
  className = "",
  stagger = 0.045,
  duration = 0.9,
  delay = 0,
  y = 28,
  whileInView = true,
  trailing,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [shouldRespectMotion, setShouldRespectMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShouldRespectMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Hide words synchronously before paint to avoid a flash of unstyled text.
  useIsoLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const words = container.querySelectorAll<HTMLElement>("[data-reveal-word]");
    if (words.length === 0) return;
    if (shouldRespectMotion) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }
    gsap.set(words, { yPercent: 110, opacity: 0 });
  }, [shouldRespectMotion, children]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const words = container.querySelectorAll<HTMLElement>("[data-reveal-word]");
    if (words.length === 0) return;

    if (shouldRespectMotion) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    const toVars: gsap.TweenVars = {
      yPercent: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: SMOOTH_EASE,
    };

    if (!whileInView) {
      gsap.to(words, toVars);
      return;
    }

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true;
            gsap.to(words, toVars);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [duration, delay, stagger, y, whileInView, shouldRespectMotion, children]);

  const words = children.split(/(\s+)/);

  return (
    <Tag ref={ref} className={className} aria-label={children}>
      {words.map((token, i) => {
        if (token.match(/^\s+$/)) {
          return <span key={i} aria-hidden> </span>;
        }
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden align-baseline"
            style={{ verticalAlign: "baseline" }}
          >
            <span data-reveal-word className="inline-block will-change-transform">
              {token}
            </span>
          </span>
        );
      })}
      {trailing}
    </Tag>
  );
}
