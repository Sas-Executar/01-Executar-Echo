# ADR-MAPA-001 — Reconciling the three "Mapa" products

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Domain:** MAPA | APP | BLOG

## Context

Three different products in this ecosystem are referred to as "Mapa", and
the overlap has already produced planning errors — including a request to
implement `PRD-SCROLL-001`, an identifier that does not exist in either
repository.

A search of `Sas-Executar/01-Executar-Echo` and `Sas-Executar/LANCAMENTO`
establishes what actually exists:

| Name | What it is | State |
|---|---|---|
| **Mapa Cognitivo** (a.k.a. Mapa Interativo) | Public relational explorer over the risk-factor knowledge graph. `MAPA-PRD-001`, APPROVED v1.0 | Specified; no code |
| **Mapa-OS / Prisma** | Internal execution surface and printable A4 projections | **Implemented**: `packages/mapa-os`, `apps/app/(authenticated)/mapa-os`, `packages/mcp/src/tools/mapa.ts` |
| **Scroll** | Mobile single-task focus UI, 33/33/33, timer 15/30/45 | **Implemented**: `packages/schemas/src/scroll-task.ts`, `packages/domain/src/scroll-task-state.ts`, under id `APP-SCR-001` |

`BLOG-09__mapa-interativo.txt` is a thin `DERIVED_OPERATIONAL_SPEC` with
`DEDICATED_NOTION_PAGE_FOUND: no`. It is not an independent product
definition and does not supersede `MAPA-PRD-001`.

## Decision

1. **They are three products, not one.** "Mapa" unqualified is ambiguous
   and should not be used in code, routes or documents. The public product
   is the **Mapa Cognitivo**; the internal one is **Mapa-OS**; the mobile
   focus UI is **Scroll**.
2. **`MAPA-PRD-001` governs the public Mapa Cognitivo.** `BLOG-09` is
   treated as a derived integration note — useful for how the Mapa binds
   to Blog routes, not for what the Mapa *is*. Where they disagree,
   `MAPA-PRD-001` wins.
3. **`PRD-SCROLL-001` does not exist.** The real artifact is `APP-SCR-001`.
   Any plan citing `PRD-SCROLL-001` is citing nothing; this record exists
   so that is discoverable rather than re-litigated.
4. **`packages/mapa-os` is out of scope for public work.** It is the
   internal product and is not the data source, the UI or the naming
   authority for the public Mapa.

## Data source of truth

The public Mapa's graph is `SCHEMA-RC-SOLUTION-004`. **It is not
regenerated, inferred, or derived from the Blog corpus or from BLOG-09.**

The materialized artifact was supplied on 2026-09-22 as
`SCHEMA-RC-SOLUTION-004_AGENT_BUNDLE`, verified on receipt:

- `sha256sum -c CHECKSUMS.sha256` → 10/10 OK
- `graph_data.json` validates against `graph_schema.json`
- **237 nodes · 528 edges · 20 solutions (FRC-01…20) · 13 evidence records**
- layers `CENTER` + `R1`–`R7`; epistemic classes `A`–`E`; edge weights 1–3

Order of authority, preserved from the source governance record
(`DOC-0025 · MASTER-INDEX-CHAT-001`):

```
SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx   (canonical)
  → graph_data.json      (runtime)
  → graph_schema.json    (contract)
  → nodes.csv → edges.csv → solutions.csv → evidence.csv
```

The whole bundle is vendored at `packages/knowledge/data/cognitive-map/`
with its checksums, and a test asserts the four counts. Regenerating the
graph therefore breaks CI — which is the intended outcome, since a
regenerated graph would be a different artifact wearing the same name.

## Binding constraints on the rendered Mapa

These come from the data and the PRD, and are not UI preferences:

- `metadata.governance_rule` is `"Fator != Vulnerabilidade != Exposição !=
  Risco"`. Copy must not collapse those four into each other; in
  particular, a factor must never be presented as a risk.
- Every evidence record carries an `interpretation_limit`. It is rendered
  with the evidence it qualifies, never separated from it.
- Missing data renders as **"Não disponível"**. Nodes and relations are
  never invented to fill a gap.
- Relations preserve their `edge_id` so deep links stay stable.
- Mobile-first from 320px, touch targets ≥44px, WCAG 2.2 AA, reduced
  motion honoured, and an accessible List fallback for the graph view.

## Consequences

- Route naming is unambiguous: `/mapa` is the public Mapa Cognitivo;
  Mapa-OS keeps its authenticated route inside `apps/app`.
- The 20 solution rows (FRC-01…20) connect the Mapa to the Oficina, but
  carry `solution_status: CONCEPTUAL_DEFINED_NOT_SCANNER_AUTHORIZED` and
  `scanner_v1_eligible: NO` for most entries — so they are shown as
  conceptual, not offered as available tools.
- `evidence_status: SOURCE_CONCEPTUAL_ONLY` and the `null` SEUS scores are
  displayed as-is. No score is computed to fill the space.
