# ADR-OFICINA-001 — Oficina visual binding on public surfaces

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Scopes:** `D11__experiencia-e-projeto/oficina/DESIGN_SYSTEM_BINDING.yaml` → `SUPERSEDED_IN_PART`
- **Depends on:** ADR-DS-002, ADR-DS-003
- **Relates to:** ADR-UX-001..004, ADR-REACT-001 (LANCAMENTO `D22`)

## Context

`D11__experiencia-e-projeto/oficina/DESIGN_SYSTEM_BINDING.yaml` is marked
`status: canonical` and binds the Oficina to the ecosystem Design System
at a pinned commit, with an explicit visual contract:

```yaml
visual_contract:
  identity_status: "BOUND_CANONICAL"
  brand_green: "#00BF63"
  information_azure: "#1F93FF"
  canvas: "#F6F6F6"
  font_sans: "IBM Plex Sans"
  third_party_reference_colors_forbidden: true
governance:
  local_overrides_allowed: false
  visual_changes_require_source_or_explicit_local_ADR: true
```

That is the **product** identity. Meanwhile the Oficina/Loja is, by the
current product decision, a **public** surface — it sits in the reader's
path from an article to a tool, alongside the Blog and the Mapa, and
ADR-DS-003 puts those on the editorial identity.

So the binding as written would make the Loja the one public surface
painted green and blue, in the middle of a yellow-and-black publication.
The binding's own governance clause anticipates this situation and names
the remedy: *visual changes require an explicit local ADR*. This is that
ADR.

Worth stating plainly: the binding is not wrong. It was correct when the
Oficina's placement was undecided — the Blueprint still records the open
question of whether the Oficina is "página/catálogo do blog, módulo VERA
ou produto separado". The product decision of 2026-09-22 answered it.

## Decision

`DESIGN_SYSTEM_BINDING.yaml` is **superseded in part**, not replaced.

**Still canonical** — everything the binding says about structure:

- The five surfaces of ADR-UX-001: Discover, Collections, Solution Detail,
  Learn, Onboarding.
- `WIREFRAME_TOKENS.yaml` in full: shell, card family and slots, discovery
  search/filter/sort (ADR-UX-002), the four detail tabs (ADR-UX-003),
  browse-by-role fed from `PROFESSIONS.yaml` (ADR-UX-004), and the rule
  that `Start` and `Download` are semantically distinct actions.
- The React component contract of ADR-REACT-001.
- The rule that React must not infer claims, professions, categories or
  product type.

**No longer governing** — the `visual_contract` block, on public
surfaces only. `brand_green`, `information_azure`, `canvas` and
`font_sans` do not apply to the public Oficina. It renders under
`[data-surface="editorial"]` with `@repo/editorial-tokens`.

The binding's `third_party_reference_colors_forbidden: true` is preserved
in spirit and in effect: the editorial palette is not a third-party
reference colour set, it is the EXECUTAR public identity ratified in
ADR-DS-003 and sourced from the organisation's own v6 contract.

If an authenticated, in-product view of the Oficina is ever built, the
binding's `visual_contract` governs it unchanged.

## Consequences

- The Loja is visually continuous with the Blog and the Mapa; a reader
  moving from an article to a tool does not cross an identity seam.
- `WIREFRAME_TOKENS.yaml`'s `visual_tokens.forbidden_to_infer` list stays
  binding — colours, type, radii, shadows and motion still come from a
  token source, never from a screenshot. Only *which* token source
  changed.
- `STORE_CARD.yaml`'s `visual_tokens.status: BOUND_CANONICAL`, pinned to
  the design-system commit, is re-pointed at `@repo/editorial-tokens` for
  public rendering. The pin itself is kept as provenance.
