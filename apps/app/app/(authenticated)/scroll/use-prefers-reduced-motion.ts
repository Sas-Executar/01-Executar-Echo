"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Mirrors the decided prototype's own rule (chatgpt/scroll-task-prototype's
 * styles.css: `@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto
 * !important}}`) for the real component — smooth scrollIntoView() calls
 * fall back to instant whenever the OS asks for it.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
};
