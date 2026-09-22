# ADR-DS-002 — A separate design system for public/editorial surfaces

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Scopes:** ADR-DS-001 (does not revoke it)
- **Domain:** DS | BLOG | OFICINA | MAPA | VERA

## Context

`packages/design-tokens` is the EXECUTAR Design System's single source of
truth under ADR-DS-001: the Green (`#00bf63`) / Azure (`#1f93ff`) /
Neutral ramps, IBM Plex, a 4/8/12/16 radius scale, and a semantic layer
consumed by `apps/app`, `apps/mobile` and `apps/web`. A CI job
(`token-drift`) already prevents its CSS and TypeScript halves from
diverging.

The public and institutional surfaces — site, Blog, Oficina/Loja, Learn,
content, Mapa, and VERA's public face — have a *different*, fully
specified identity in `Sas-Executar/LANCAMENTO`: the NatGeo-hybrid v6
contract (`D23__blueprints/Executar Blog/#02-UX-UI/` and
`#03-DESIGN-TOKENS/`). It is yellow `#ffcc00`, black, charcoal `#111111`
on a light editorial surface; square corners; system SF/New York type; and
it removed blue deliberately in v4 ("nunca azul").

These two sets contradict each other on almost every axis. Until now the
repository had no way to hold both: Tailwind v4 is configured CSS-first
with no `tailwind.config`, and the only theme-scoping mechanism in the
codebase was next-themes' `.dark` class. There was one global root theme.

That left exactly one apparent way to make a public page look right —
editing `packages/design-tokens` — which would repaint the authenticated
product and the mobile app at the same time. The corpus shows the pressure
building: `docs/ecosystem/traceability/D23-EXECUTAR-BLOG-IMPORT.md`
records the brand colours being parked as "static assets, not token
values" precisely to avoid touching the product tokens, which left the
85-file brand kit sitting in `apps/web/public/brand/` with zero code
references.

## Decision

Two token sets, separated by scope rather than by discipline.

```
@repo/design-tokens     → :root                      → apps/app, apps/mobile, product chrome
@repo/editorial-tokens  → [data-surface="editorial"]  → apps/web public surfaces
```

1. `packages/design-tokens` remains the product SOT under ADR-DS-001 and
   **is not modified** to serve a public surface.
2. A new `packages/editorial-tokens` carries the NatGeo-hybrid v6 contract,
   namespaced `--ed-*`, emitted **only** under `[data-surface="editorial"]`.
   Nothing in it is emitted at `:root`; nothing in it redefines a `--ds-*`
   variable.
3. Inside that scope, the stylesheet re-points shadcn's semantic bridge
   (`--background`, `--foreground`, `--primary`, `--border`, `--ring`,
   `--radius` …). Because `packages/design-system/styles/globals.css`
   exposes those through `@theme inline`, redeclaring them on a descendant
   element re-aims every Tailwind utility in that subtree — so
   `packages/design-system`'s component library is reused, not forked.
4. The boundary is enforced mechanically, not by convention. CI job
   `editorial-isolation` runs
   `packages/editorial-tokens/scripts/check-drift.ts` (scope, drift, and a
   product-palette bleed check) and `scripts/check-editorial-isolation.sh`
   (no editorial token in `apps/app`/`apps/mobile`; product DS files
   hash-pinned in `scripts/PRODUCT_DS_BASELINE.sha256`).

## Consequences

- A public page can be made to look right without any possibility of
  repainting the product. The guarantee is a hash check, not a promise.
- Changing `packages/design-tokens` now requires refreshing the baseline
  hash in the same commit and citing an ADR. This is friction by design:
  the failure mode it blocks is silent and expensive.
- Two radius scales and two type stacks coexist in one stylesheet. This is
  the cost of honouring two real contracts, and it is contained to the
  scope selector.
- The brand assets in `apps/web/public/brand/` become consumable by code
  for the first time (ADR-DS-003 settles which palette governs them).
- `apps/web` hosts both identities: the product chrome it shares with the
  app, and the editorial shell. Route groups decide which applies.

## Alternatives rejected

- **Replace the product tokens with the editorial set.** Repaints
  `apps/app` and `apps/mobile`, and contradicts ADR-DS-001. This is the
  failure the command that prompted this ADR called out by name.
- **Keep public surfaces on the product DS.** Contradicts the ratified v6
  handoff, and produces a site that looks like the app rather than a
  publication. Rejected by product decision, 2026-09-22.
- **A second Tailwind config / separate app.** Heaviest option; forks the
  component library and doubles the maintenance for a problem a scope
  selector solves.
