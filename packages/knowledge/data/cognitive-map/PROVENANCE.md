# Cognitive map graph — provenance

Canonical artifact: **`SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx`**
(project `Mapa Cognitivo · TP-001 · RC-SOLUTION-001`).

Supplied as `SCHEMA-RC-SOLUTION-004_AGENT_BUNDLE` and vendored here
unmodified. **This graph is not regenerated, inferred, or derived from the
Blog corpus or from BLOG-09** — see `docs/adr/ADR-MAPA-001-mapa-reconciliation.md`.

## Verified on receipt (2026-09-22)

- `sha256sum -c CHECKSUMS.origin.sha256` → **10 / 10 OK** against the
  bundle's own manifest, in the bundle's original layout.
- `graph_data.json` validates against `graph_schema.json`.
- Counts: **237 nodes · 528 edges · 20 solutions · 13 evidence records**.

`CHECKSUMS.sha256` is the same content re-hashed against the flattened
layout used here (the bundle nested files under `01_CANONICAL/`,
`02_RUNTIME/` …). `CHECKSUMS.origin.sha256` is kept as-is for provenance —
its paths refer to the original bundle, not to this directory.

`packages/knowledge/__tests__/cognitive-map.test.ts` re-verifies the
counts and the checksums on every CI run. A regenerated graph would fail
that test, which is the point: it would be a different artifact wearing
the same identifier.

## Order of authority

Per the source governance record (`DOC-0025_MASTER-INDEX-CHAT-001.md`):

```
SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx   canonical
  → graph_data.json      runtime  (what the application reads)
  → graph_schema.json    contract
  → tables/{nodes,edges,solutions,evidence}.csv
```

The application reads `graph_data.json`. The CSVs and the workbook are
kept so the chain stays auditable from the rendered page back to the
spreadsheet.

## Binding rules carried by the data

- `metadata.governance_rule`: **"Fator != Vulnerabilidade != Exposição !=
  Risco"**. A factor must never be presented as a risk.
- Every evidence record carries an `interpretation_limit`; it is rendered
  with the evidence it qualifies, never separately.
- Missing values render as **"Não disponível"**. Nothing is invented.
