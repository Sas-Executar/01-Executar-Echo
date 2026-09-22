/**
 * Editorial layout and form — NatGeo-hybrid v6.
 *
 * Square corners are identity, not an oversight: `radius.card` is 0 and
 * `radius.btn` (8px) is the only radius permitted on a public surface,
 * and only on buttons (handoff v6). This is the opposite of the product
 * DS's 4/8/12/16 scale, which is exactly why the two token sets are
 * scoped apart rather than merged.
 */

export const layout = {
  navH: "56px",
  bottombarH: "64px",
  drawerW: "min(84vw,360px)",
  shell: "980px",
  wide: "1440px",
  read: "720px",
  gutter: "clamp(20px,4vw,44px)",
  gap: "12px",
  section: "clamp(72px,9vw,140px)",
} as const;

export const radius = {
  card: "0px",
  btn: "8px",
  navIcon: "4px",
} as const;

/**
 * Minimum touch targets, all above the 44px floor the handoff verifies.
 * Kept as tokens so components can't quietly shrink below the audited
 * values.
 */
export const target = {
  nav: "56px",
  drawerItem: "56px",
  button: "56px",
  bottomBar: "64px",
  icon: "40px",
} as const;

/** The desktop breakpoint at which inline nav + category rail return. */
export const breakpoint = {
  desktop: "900px",
  narrow: "620px",
} as const;
