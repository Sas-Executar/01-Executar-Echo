/**
 * Editorial colour tokens — the EXECUTAR public/institutional surfaces'
 * single source of truth (ADR-DS-002, ADR-DS-003).
 *
 * Ported verbatim from the NatGeo-hybrid v6 contract at
 * `reference/tokens-hybrid.css` (LANCAMENTO
 * `D23__blueprints/Executar Blog/#03-DESIGN-TOKENS/natgeo-hybrid/`,
 * CORPUS_DIRECT extract). `scripts/check-drift.ts` diffs this file, the
 * CSS output and that reference on every CI run.
 *
 * This is NOT the product Design System. `@repo/design-tokens`
 * (Green/Azure/Neutral, ADR-DS-001) governs apps/app and apps/mobile and
 * is never modified to serve a public surface — see ADR-DS-002 for the
 * boundary and the CI guard that enforces it.
 */

/** Brand identity. Yellow appears at most once per screen (handoff v6). */
export const brand = {
  yellow: "#ffcc00",
  black: "#000000",
  charcoal: "#111111",
  charcoalSoft: "#1c1c1e",
} as const;

/** Surface. The light surface is the dominant default — legibility first. */
export const surface = {
  ink: "#1d1d1f",
  muted: "#6e6e73",
  paper: "#ffffff",
  soft: "#f5f5f7",
  soft2: "#fbfbfd",
  line: "#d2d2d7",
  lineDark: "rgba(255,255,255,.12)",
  white: "#ffffff",
} as const;

/**
 * Action. Black and yellow only — blue was removed deliberately in v4 and
 * is forbidden on these surfaces (handoff v6, "nunca azul"). The CI guard
 * in `scripts/check-drift.ts` fails on any azure/green value appearing
 * here.
 */
export const action = {
  primary: "#000000",
  accent: "#ffcc00",
} as const;

export const effect = {
  glassLight: "rgba(255,255,255,.86)",
  glassDark: "rgba(17,17,17,.82)",
  shadow: "0 12px 38px rgba(0,0,0,.08)",
} as const;
