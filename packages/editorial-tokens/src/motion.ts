/**
 * Editorial motion — EXECUTAR Native Editorial v2 (ADR-DS-004), from
 * `reference/v2/02_TOKENS_CANONICAL.css`.
 *
 * Motion is functional: it explains where something came from. No
 * per-card fades, no hover reveals. Everything below collapses under
 * `prefers-reduced-motion: reduce` — see `css/editorial.css`.
 */

export const easing = {
  standard: "cubic-bezier(.2,.8,.2,1)",
} as const;

export const duration = {
  /** Micro-feedback: press states, small toggles. */
  fast: "120ms",
  /** The default: drawers, sheets, chrome hide/return. */
  standard: "220ms",
  /** Large surface transitions only. */
  slow: "360ms",
} as const;
