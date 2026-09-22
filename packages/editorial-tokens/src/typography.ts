/**
 * Editorial typography — EXECUTAR Native Editorial v2 (ADR-DS-004), from
 * `reference/v2/02_TOKENS_CANONICAL.css`.
 *
 * System stack throughout, UI and editorial display alike. The v6
 * contract set article bodies in the New York serif; the v2 identity
 * contract removes it explicitly — "New York não faz parte da identidade
 * canônica v2" — so there is exactly one family here, and no font file is
 * redistributed.
 *
 * Distinct from `@repo/design-tokens`' IBM Plex pair, which stays the
 * product typeface (ADR-DS-001 Required Change #3).
 */

export const fontFamily = {
  ui: '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
  display:
    '-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif',
} as const;

export const fontSize = {
  displayXl: "clamp(2.75rem,6vw,4.5rem)",
  displayLg: "clamp(2.25rem,4.5vw,3.5rem)",
  displayMd: "clamp(1.75rem,3.5vw,2.75rem)",
  headline: "clamp(1.375rem,2.5vw,2rem)",
  bodyLg: "1.1875rem",
  body: "1.0625rem",
  small: "0.9375rem",
  caption: "0.8125rem",
} as const;

/**
 * Reading. 17px at 1.6 inside 66ch/760px is the acceptance criterion
 * (`reference/v2/06_ACCEPTANCE_CRITERIA.md`), not a preference — the
 * tests in `__tests__/tokens.test.ts` assert all four.
 */
export const reading = {
  measure: "66ch",
  max: "760px",
  fontSize: "1.0625rem",
  lineHeight: "1.6",
} as const;
