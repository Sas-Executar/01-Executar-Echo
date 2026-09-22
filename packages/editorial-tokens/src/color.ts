/**
 * Editorial colour — EXECUTAR Native Editorial v2 (ADR-DS-004).
 *
 * Ported verbatim from `reference/v2/02_TOKENS_CANONICAL.css`
 * (`EXECUTAR-BLOG-IDENTITY-001` v2.0, status CANONICAL), which supersedes
 * the NatGeo-hybrid v6 hexes this package shipped first. The identity
 * contract's rule 3 is the reason this file no longer exports a palette:
 * components consume *roles*, never hexadecimals, so the same component
 * renders correctly in both appearances.
 *
 * `light` and `dark` are two appearances of ONE identity, not two themes.
 * Every role exists in both, and `scripts/check-drift.ts` fails if a role
 * is missing from either.
 *
 * This is NOT the product Design System. `@repo/design-tokens`
 * (Green/Azure/Neutral, ADR-DS-001) governs apps/app and apps/mobile and
 * is never modified to serve a public surface — see ADR-DS-002.
 */

/** The light appearance. */
export const light = {
  bg: "#ffffff",
  bgGrouped: "#f5f5f7",
  surfaceElevated: "rgba(255,255,255,.78)",

  labelPrimary: "#1d1d1f",
  labelSecondary: "#6e6e73",
  labelTertiary: "#86868b",
  separator: "rgba(60,60,67,.18)",

  fillPrimary: "rgba(120,120,128,.20)",
  fillSecondary: "rgba(120,120,128,.12)",

  /**
   * Brand accent. Reserved for selection, progress, microindicators and
   * short highlights — never a decorative field, gradient or repeated
   * fill (identity contract rule 2).
   */
  accent: "#ffcc00",
  /**
   * The label that sits ON the accent. Fixed dark in BOTH appearances:
   * the accent stays a light yellow at night, so flipping this with the
   * rest of the labels would put near-white text on it and fail AA.
   */
  labelOnAccent: "#1d1d1f",
  /**
   * System focus blue. ADR-DS-003 forbade blue on public surfaces; that
   * prohibition is narrowed by ADR-DS-004 to the *product* azure
   * (#1f93ff) as an identity colour. The system focus ring is required.
   */
  focus: "#0a84ff",
  success: "#34c759",
  warning: "#ff9f0a",
  error: "#ff3b30",
} as const;

/** The dark appearance. Derived from the same roles, not a second theme. */
export const dark = {
  bg: "#000000",
  bgGrouped: "#1c1c1e",
  surfaceElevated: "rgba(28,28,30,.78)",

  labelPrimary: "#f5f5f7",
  labelSecondary: "#aeaeb2",
  labelTertiary: "#8e8e93",
  separator: "rgba(84,84,88,.65)",

  fillPrimary: "rgba(120,120,128,.36)",
  fillSecondary: "rgba(120,120,128,.24)",

  accent: "#ffd60a",
  labelOnAccent: "#1d1d1f",
  focus: "#0a84ff",
  success: "#30d158",
  warning: "#ff9f0a",
  error: "#ff453a",
} as const;

/** The role names themselves — the public API components may reference. */
export type ColorRole = keyof typeof light;

export const roles = Object.keys(light) as readonly ColorRole[];
