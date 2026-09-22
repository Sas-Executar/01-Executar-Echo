/**
 * Editorial layout and form — EXECUTAR Native Editorial v2 (ADR-DS-004),
 * from `reference/v2/02_TOKENS_CANONICAL.css`.
 *
 * The v6 contract made square corners the identity (`radius.card: 0`).
 * v2 replaces that with a moderate, Apple-aligned radius scale: form is
 * discreet rather than assertive, because content dominates
 * (identity contract rule 6). Still the opposite of the product DS's
 * 4/8/12/16 ramp — which is why the two sets stay scoped apart.
 */

/** 4px-based spacing scale. */
export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
} as const;

export const radius = {
  control: "12px",
  container: "16px",
  large: "22px",
  capsule: "999px",
} as const;

export const layout = {
  /** Reading measure: the character count, not the pixel width. */
  measureArticle: "66ch",
  /** Hard ceiling on the reading column, whatever the character count. */
  readingMax: "760px",
  contentMax: "1180px",
  touchMin: "44px",
} as const;

/** Chrome geometry. Not in the canonical file — shell-specific, derived. */
export const chrome = {
  navH: "56px",
  bottombarH: "64px",
  drawerW: "min(84vw,360px)",
  gutter: "clamp(20px,4vw,44px)",
  gap: "12px",
  section: "clamp(72px,9vw,140px)",
} as const;

/**
 * Minimum touch targets, all at or above the 44px floor the acceptance
 * criteria verify. Kept as tokens so components can't quietly shrink
 * below the audited values.
 */
export const target = {
  nav: "56px",
  drawerItem: "56px",
  button: "56px",
  bottomBar: "64px",
  icon: "44px",
} as const;

/** The desktop breakpoint at which inline nav + category rail return. */
export const breakpoint = {
  desktop: "900px",
  narrow: "620px",
} as const;
