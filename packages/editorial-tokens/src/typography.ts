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

/**
 * Optical-size and tracking alignment against SF Pro.
 *
 * SF Pro ships as a variable font on Apple platforms with its own
 * optical-size (`opsz`) axis — Text below ~20pt, Display above — and the
 * HIG documents, as a general rule, that tracking should tighten as
 * point size grows and loosen at small sizes. Neither of those is an
 * asset: the axis lives in the font file already installed on the
 * device, and the direction is public guidance, not a table of numbers
 * copied out of a kit. `opticalSizing.mode` asks WebKit/Safari to drive
 * that axis itself; the `tracking` scale below is this package's own
 * approximation of the documented direction, tied to `fontSize`, not a
 * transcription of an Apple-published table (which is why the values
 * are round and not attributed to a source). No file from Apple's
 * iOS/iPadOS 27 UI Kit or SF Pro itself is vendored, read, or shipped —
 * see ADR-DS-004.
 */
export const opticalSizing = {
  /** Applied as `font-optical-sizing`. Falls back to a no-op off Apple platforms. */
  mode: "auto",
} as const;

/** Letter-spacing, keyed to `fontSize`. Tighter at large sizes, looser at small. */
export const tracking = {
  displayXl: "-0.022em",
  displayLg: "-0.019em",
  displayMd: "-0.015em",
  headline: "-0.010em",
  bodyLg: "-0.003em",
  body: "0em",
  small: "0.005em",
  caption: "0.010em",
} as const;

/**
 * Icon scale, aligned to the HIG's documented three-step symbol scale
 * (small/medium/large, each proportioned to the text it sits beside)
 * rather than to an arbitrary pixel grid. No SF Symbols glyph is used or
 * redistributed — this sizes and weights whatever glyph a component
 * renders (the hand-drawn chrome icons, or lucide-react elsewhere in
 * apps/web) so it reads at parity with the surrounding type instead of
 * floating at its own scale.
 */
export const iconScale = {
  /** Pairs with `small`/`caption` text — inline and dense chrome. */
  sm: "16px",
  /** Pairs with `body` text — the default. */
  md: "20px",
  /** Pairs with `headline` and above — hero and section-level actions. */
  lg: "24px",
} as const;

/** Icon stroke weight, matched to the adjacent text weight rather than fixed. */
export const iconStroke = {
  regular: "1.5",
  medium: "2",
} as const;
