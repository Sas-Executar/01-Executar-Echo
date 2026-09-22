# ADR-DS-003 — Public palette: resolving the DS-01 conflict

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Resolves:** `DS-01 USER_ACTION_REQUIRED` (LANCAMENTO `#23-MANIFEST-HANDOFF/PLANO-MESTRE-END-TO-END.md`)
- **Depends on:** ADR-DS-002

## Context

The corpus carries two different palettes for the same public surface, and
flags the contradiction itself as blocking.

1. **NatGeo-hybrid v6 tokens** —
   `#03-DESIGN-TOKENS/natgeo-hybrid/tokens-hybrid.css`: yellow `#ffcc00`,
   black `#000000`, charcoal `#111111`, light surfaces, action in black
   and yellow, blue forbidden. Accompanied by a full UX handoff
   (`handoff-editorial-hybrid-v6.md`) and a validation record asserting
   every text/background pair passes WCAG AA.
2. **Brand package README** —
   `#03-DESIGN-TOKENS/brand-assets/README.txt`, shipped with the 82 PNGs:
   declares a greyscale palette (`#000000 / #2D2D2D / #9A9A9A / #E5E5E5 /
   `#F8F8F8` / `#FFFFFF`), monospaced uppercase type, and **no yellow at
   all**.

Both are `CORPUS_DIRECT`. A public surface cannot follow both.

## Decision

**The NatGeo-hybrid v6 tokens govern the public/editorial identity.**
Confirmed by product decision on 2026-09-22.

The brand-assets README is reclassified as a description of *that asset
package* — the conditions under which those particular PNGs were exported
— and not as a palette contract for the website. It is not deleted or
contradicted; its scope is narrowed.

This is coherent rather than a compromise: the 82 PNGs are logo marks,
wordmarks, lockups, icons and favicons rendered in black, white and
reverse. None of them carries a palette of its own, so they compose
correctly on the editorial surface without modification. The greyscale
list describes the neutrals they were rendered against, which the
editorial surface already contains (`--ed-black`, `--ed-charcoal`,
`--ed-line`, `--ed-soft`, `--ed-paper`, `--ed-white`).

Binding consequences, carried into `packages/editorial-tokens` and
enforced by its drift script:

- Yellow `#ffcc00` is an accent, used **at most once per screen**.
- **No blue on any public surface.** `#1f93ff` (Azure 9) and `#00bf63`
  (Green 9) fail the build if they appear in `css/editorial.css`.
- Square corners are identity: `--ed-radius-card: 0`, and the 8px button
  radius is the only radius permitted.

## Consequences

- `DS-01` moves from `USER_ACTION_REQUIRED` to `RESOLVED`. It no longer
  blocks the Oficina production nodes that were waiting on it.
- The brand PNGs become usable in code as-is — favicon, app icons, OG
  images and the nav wordmark — closing the gap where 85 files sat in
  `public/` unreferenced.
- If a future brand revision genuinely intends a greyscale-only public
  identity, it supersedes this record rather than silently reintroducing
  the ambiguity.
