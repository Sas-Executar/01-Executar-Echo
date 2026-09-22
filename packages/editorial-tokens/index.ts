/**
 * @repo/editorial-tokens — the EXECUTAR public/editorial Design System
 * (ADR-DS-002). Flow: LANCAMENTO NatGeo-hybrid v6 → this package →
 * `css/editorial.css` → apps/web public surfaces only.
 *
 * Scope boundary, enforced by `.github/workflows/ci.yml`:
 *   @repo/design-tokens   → :root                        → apps/app, apps/mobile, product chrome
 *   @repo/editorial-tokens → [data-surface="editorial"]   → apps/web public surfaces
 *
 * Importing this package from apps/app or apps/mobile fails CI. It never
 * redefines a `--ds-*` variable, and `css/editorial.css` emits nothing at
 * `:root`.
 */
export * from "./src/color";
export * from "./src/layout";
export * from "./src/motion";
export * from "./src/typography";
