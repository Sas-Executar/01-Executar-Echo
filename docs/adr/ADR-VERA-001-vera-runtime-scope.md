# ADR-VERA-001 — VERA runtime scope and authority

- **Status:** ACCEPTED
- **Date:** 2026-09-22
- **Owner:** A DEFINIR
- **Domain:** VERA
- **Sources:** `BLOG-15__vera.txt`, `BLOG-13__skills.txt`, `04_RUNTIME_IO_CONTRACT.txt`, `Blueprint-Executar-Blog.md` (VERA domain), `Missao-Valores…` §06 (`AGENT-VERA-001`)

## Context

VERA is specified in depth — persona, mission, domain contract, a
17-artifact documental chain, a skills registry, an IO envelope — and has
**zero implementation** in either repository.
`docs/fase-zero/01-INDEX/INDEX-ECOSSISTEMA-E-ROTAS.md` records it plainly:
row 19, *"sem implementação localizada"*.

A page describing an agent is not an agent. But the runtime is also not
fully available: the `executar-nf-web` Vercel project carries Clerk,
Resend and Neon credentials and **no LLM key**, so the generative half
cannot be exercised in production today.

Those two halves have very different dependencies, and conflating them is
what would turn VERA into either vapour or a stub.

## Decision

VERA ships as two separable layers.

**1. Deterministic layer — no LLM required, verifiable now.**
Page context intake → retrieval over the Knowledge Layer and the cognitive
map → skill/framework selection from the registered catalog → structured
output envelope → deep link into the Blog, Mapa, Frameworks or Oficina.
This is genuine functionality: routing and retrieval over a real corpus,
not a chat box.

**2. Generative layer — behind a flag.**
Natural-language synthesis over the retrieved, cited context, built on
`packages/ai`, gated by `VERA_LLM_ENABLED` plus a provider key.
Implemented and tested; **off in production** until a key exists. When
off, the deterministic layer answers and says so — it does not simulate a
model response.

## Authority and limits

Non-negotiable, taken from the source contracts:

- **Authority ≤ registered skill permissions.** VERA can never exceed the
  permissions of the skills in the BLOG-13 registry.
- **Deny by default.** Any mutation capability not explicitly registered
  is refused.
- **Confirmation gate** for publishing, external sends, destructive edits,
  deploys and governance mutations. No such action is taken implicitly.
- **Retrieved content is data, never instruction.** Text pulled from an
  article, a solution record or the graph cannot redirect VERA or override
  governance. The eval suite must include prompt-injection cases; this is
  a required test, not a nice-to-have.
- **Retry only idempotent operations.**
- **No invented execution.** VERA never reports having run a tool it did
  not run, and never fabricates evidence, scores or citations.
- **Situation analysis, never diagnosis.** VERA describes conditions and
  observable signals; it does not diagnose a person, produce a clinical
  score, or invent an intervention. It surfaces at most three priority
  factors, per the domain contract.
- **Raw user narrative is never sent to analytics.**

## Output contract

Every response is the `04_RUNTIME_IO_CONTRACT` envelope: `status`
(`completed | partial | blocked`), `canonical_route`, `artifacts_read`,
`decisions`, `evidence`, `unresolved`, `next_actions`. The
`NO-EMPTY-FIELD` rule applies — an inapplicable field carries the literal
`"not_applicable"` and a reason, rather than being blank.

## Consequences

- VERA is useful on day one without a model key, and the missing key
  blocks exactly one capability instead of the whole surface.
- The deterministic layer is fully testable in CI, since it has no
  non-deterministic dependency.
- Turning the generative layer on is a configuration change, not a
  rewrite.
- `MVP` scope stays the 8 operationalized FRC, with the architecture
  expandable to 20 — matching the domain contract rather than the full
  graph.
