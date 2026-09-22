/**
 * Editorial motion — NatGeo-hybrid v6.
 *
 * The contract allows exactly two animated moments per page (hero
 * entrance, feature-media reveal) plus the synchronized scroll-chrome
 * pattern. No per-card fades, no hover reveals. Everything below is
 * disabled under `prefers-reduced-motion: reduce` — see `css/editorial.css`.
 */

export const easing = {
  standard: "cubic-bezier(.22,1,.36,1)",
} as const;

export const duration = {
  /** Drawer slide. */
  drawer: "320ms",
  /** Scroll chrome hide/return — nav and bottom bar move together. */
  chrome: "280ms",
  /** Hero entrance, fires once. */
  heroEntrance: "900ms",
} as const;
