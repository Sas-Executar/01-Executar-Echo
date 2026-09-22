/**
 * @repo/editorial-tokens — the EXECUTAR public/editorial Design System.
 * Identity: EXECUTAR Native Editorial v2 (`EXECUTAR-BLOG-IDENTITY-001`
 * v2.0, ADR-DS-004), which supersedes the NatGeo-hybrid v6 contract this
 * package shipped first. Flow: `reference/v2/02_TOKENS_CANONICAL.css` →
 * this package → `css/editorial.css` → apps/web public surfaces only.
 *
 * The exported API is semantic ROLES, not a palette: `light` and `dark`
 * are two appearances of one identity, and a component written against
 * `labelSecondary` is correct in both without knowing either exists.
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
