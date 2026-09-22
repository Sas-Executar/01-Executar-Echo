# ADR-DS-004 — EXECUTAR Native Editorial as the single canonical public identity

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Adopts:** `EXECUTAR-BLOG-IDENTITY-001` v2.0 (`EXECUTAR_BLOG_HANDOFF_002_APPLE_ALIGNED`, ADR-002 `APPROVED`)
- **Supersedes in part:** ADR-DS-003
- **Depends on:** ADR-DS-002 (unchanged — the scope boundary is what makes this migration safe)

## Context

ADR-DS-003 settled the `DS-01` palette conflict in favour of the
NatGeo-hybrid v6 tokens, and the public surfaces were built against them:
yellow `#ffcc00`, square corners as identity, New York serif article
bodies at 720px/1.62, a 52×5px yellow rule above every `h2`, a yellow
focus ring, a charcoal footer, light appearance only.

The product has since issued a second handoff package that declares a
**single canonical visual identity** for the public surfaces:

> **EXECUTAR Native Editorial** — `EXECUTAR-BLOG-IDENTITY-001` v2.0,
> status `CANONICAL`, superseding the implicit identity of handoff 001.

The package was received, vendored at
`packages/editorial-tokens/reference/v2/`, and verified: **13/13 SHA-256
digests match** the package's own `MANIFEST.json`, recorded in
`reference/v2/CHECKSUMS.sha256`.

Its own migration note states the essential scope: *"a migração é
principalmente de linguagem visual, não de arquitetura de informação"*.
Routes, data, the Mapa, the Oficina, VERA, the knowledge layer and the
navigation model are unaffected. What changes is the token layer and the
component styling that reads it.

## Decision

**EXECUTAR Native Editorial v2 is the canonical identity of every public
surface.** `packages/editorial-tokens` is rewritten against
`reference/v2/02_TOKENS_CANONICAL.css`.

Five consequences, each mechanised:

1. **Roles replace hexadecimals.** The token API is now semantic —
   `bg`, `bg-grouped`, `surface-elevated`, `label-primary/secondary/
   tertiary`, `separator`, `fill-primary/secondary`, `accent`, `focus`,
   status roles. Identity contract rule 3: *"Os componentes consomem
   papéis, não hexadecimais"*. `scripts/check-drift.ts` fails on a literal
   hex in any public component and on any alias that pins a value instead
   of referencing a role.
2. **Light and dark are two appearances of one identity**, not two
   themes, derived from the same roles via `color-scheme: light dark` and
   `prefers-color-scheme` — still scoped to `[data-surface="editorial"]`,
   so the product DS and its own `.dark` mechanism are untouched. The
   checker fails if a role exists in one appearance and not the other.
3. **One type family.** The system stack throughout. New York leaves the
   identity by name: *"New York não faz parte da identidade canônica
   v2"*.
4. **The accent is restrained.** Yellow remains the brand colour and is
   reserved for selection, progress, microindicators and short
   highlights. The yellow rule above every `h2` is removed — it was the
   contract's own example of decorative repetition.
5. **Liquid Glass is chrome-only**, carried by a single `.ed-chrome`
   class so rule 5 is checkable rather than conventional: header, bottom
   navigation, transient menus. Never an article, card, table or
   evidence block.

## The governance conflict this resolves

ADR-DS-003 forbade **blue** on public surfaces, following the v6
contract's *"nunca azul"*, and `check-drift.ts` failed the build on any
blue value. The v2 contract **requires** `--focus: #0A84FF`, the system
focus colour.

The rule is narrowed, not abandoned:

| | Before (DS-003) | After (DS-004) |
|---|---|---|
| Product azure `#1f93ff` as an identity colour | forbidden | **still forbidden**, checked |
| System focus blue `#0a84ff` | forbidden by implication | **required**, checked |

A focus ring users do not recognise as focus is an accessibility
regression, not a style choice. Both halves are now asserted by the
checker, so neither can drift: the product ramp cannot bleed in, and the
focus colour cannot quietly disappear.

## What ADR-DS-003 keeps

Its resolution of `DS-01` stands. Yellow remains the EXECUTAR brand
colour and the brand-assets README remains a description of that asset
package rather than a palette contract. Only the *composition rules* —
which hexes, which radii, which type, and blue's blanket prohibition —
are superseded. DS-003 is marked `SUPERSEDED_IN_PART`, not revoked.

## What is explicitly unchanged

- **ADR-DS-002 and the isolation boundary.** `@repo/design-tokens`
  remains untouched and hash-pinned; `packages/editorial-tokens` still
  emits nothing at `:root`. The canonical v2 file writes its roles at
  `:root`; porting it without re-scoping would repaint apps/app and
  apps/mobile, so both the light and the dark block are re-scoped here.
  A test asserts the upstream file does use `:root` and that ours does
  not — the migration cannot silently become a leak.
- **Information architecture.** Routes, navigation, the 3-destination
  bottom bar, the drawer focus trap, the 44px touch floor and the
  reduced-motion behaviour all carry over unchanged.
- **The v1 wireframe** (`reference/v2/assets/REFERENCE_ONLY_WIREFRAME_V1.png`)
  remains a *structural* reference. The package marks it explicitly
  superseded visually; it is kept, not deleted.

## Consequences

- Surfaces built against the v6 names keep working: the v1 names survive
  as aliases, but every one now resolves through a v2 role, so they adapt
  to the dark appearance instead of staying pinned to a light-only hex.
- The footer, the article CTA and the full-bleed media band lose their
  charcoal fields and go neutral. The brand package ships only flat black
  and white wordmark PNGs, so both are rendered and the token layer hides
  one — correct without JS and without a hydration mismatch.
- `reference/v2/06_ACCEPTANCE_CRITERIA.md` is encoded as tests
  (`packages/editorial-tokens/__tests__/tokens.test.ts`): measure, base
  size, line-height, touch floor, focus colour, reduced motion, single
  family, chrome-only glass, and role parity across appearances.

## Open

- **Pixel-level refinement.** Apple ships official UI Kits for
  iOS/iPadOS 27 and the SF Pro families. They are not redistributed here
  and no `apple-*` token name is used (identity contract prohibition).
  Aligning the optical sizes and symbol set against those kits is a
  future step, recorded as a GAP rather than claimed as done.
- **Owner** is `A_DEFINIR` in the package itself and stays so here.
