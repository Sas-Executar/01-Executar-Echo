/**
 * Editorial typography — NatGeo-hybrid v6. System fonts only: the
 * contract deliberately redistributes no font file (`reference/
 * tokens-hybrid.css`). Article bodies set in the New York serif stack,
 * chrome and headings in the SF stack.
 *
 * Distinct from `@repo/design-tokens`' IBM Plex pair, which stays the
 * product typeface (ADR-DS-001 Required Change #3).
 */

export const fontFamily = {
  sf: '"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
  sfText:
    '"SF Pro Text","SF Pro Display",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
  ny: '"New York","New York Small","Iowan Old Style",Georgia,"Times New Roman",serif',
} as const;

export const fontSize = {
  displayXl: "clamp(3.3rem,8vw,7.25rem)",
  displayLg: "clamp(2.5rem,6vw,5rem)",
  displayMd: "clamp(2rem,4vw,3.5rem)",
  headline: "clamp(1.75rem,3vw,2.6rem)",
  bodyLg: "clamp(1.2rem,1.8vw,1.45rem)",
  body: "1rem",
  small: ".875rem",
  caption: ".75rem",
} as const;

/**
 * Reading measure. 720px at 1.62 is the validated pair from
 * `reference/tokens-hybrid.json` (`validation.reading`), not a preference.
 */
export const reading = {
  measure: "720px",
  lineHeight: "1.62",
} as const;
