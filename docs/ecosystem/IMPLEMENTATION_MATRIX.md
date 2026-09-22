# Public ecosystem — implementation matrix

`EXECUTAR-PUBLIC-ECOSYSTEM-FULLSTACK-001`, branch
`claude/executar-public-ecosystem-fullstack-bsnscq`.

Read with the repository's maturity ladder, which this matrix exists to
keep honest:

```
DOCUMENTED ≠ IMPORTED ≠ IMPLEMENTED ≠ INTEGRATED ≠ TESTED ≠ DEPLOYED ≠ VERIFIED
```

**VERIFIED** here means one thing only: the surface was opened on the
deployed URL and behaved as claimed. Nothing is marked VERIFIED on the
strength of a passing test or a green build.

Promoted to VERIFIED on 2026-09-22 against
`https://executar-nf-web.vercel.app`: 18/18 public URLs returned 200,
and 9/9 browser checks passed in both appearances — role resolution,
the 17px/1.6/760px reading column, the absence of the serif, the drawer
focus trap, the three-destination bottom bar, and the product palette
never resolving on an editorial surface.

## Baseline — what was actually there (audited 2026-09-22)

| Claim | Finding |
|---|---|
| Public surfaces exist | `apps/web` had **10 route files**. No oficina, store, mapa, learn, vera, frameworks. |
| Brand kit is used | **85 PNGs**, **zero** code references; the site served next-forge's placeholder icons. |
| An editorial design system exists | None. `packages/design-tokens` is the product DS; the only theme scope in the repo was `.dark`. |
| VERA / Oficina / public Mapa | Fully specified, **zero code**. |
| The store has solutions | Schemas complete; **one** filled instance, pre-G6. |

## Matrix

| Item | Source | Implemented | Integrated | Tested | Deployed | Verified |
|---|---|---|---|---|---|---|
| Editorial token set | `EXECUTAR-BLOG-IDENTITY-001` v2.0 | ✅ `packages/editorial-tokens`, semantic roles | ✅ scoped to `[data-surface="editorial"]`, light + dark | ✅ 22 tests + 6 negatives | ✅ | ✅ roles resolved in-browser, both appearances |
| Product DS isolation | ADR-DS-002 | ✅ hash pin + CI job | ✅ | ✅ violations proven to fail | ✅ | ✅ |
| Editorial shell | handoff v2 | ✅ nav, drawer, bottom bar, footer | ✅ all routes | ✅ | ✅ | ✅ |
| Drawer focus trap | handoff 🔴 blocker | ✅ `inert` + focus cycle | ✅ | ✅ | ✅ | ✅ |
| Brand assets | `brand-assets/` | ✅ wordmark, favicon, apple-icon, OG | ✅ | — | ✅ | ✅ |
| Institutional home | corpus thesis | ✅ | ✅ 4 surface doors | ✅ build | ✅ | ✅ |
| Blog + article | `#07-ARTIGOS-PRONTOS` | ✅ | ✅ pillar, author, CTA, deep links | ✅ | ✅ | ✅ |
| Editorial taxonomy | `taxonomia.yaml` | ✅ `@repo/knowledge` | ✅ frontmatter + pillar pages | ✅ 14 tests | ✅ | ✅ |
| Narrative architecture | `arquitetura-narrativa.yaml` | ✅ 9 stages | ✅ rendered on home | ✅ | ✅ | ✅ |
| CTAs | `ctas.yaml` | ✅ 5 records | ✅ routed by funnel stage | ✅ every active CTA targets a real route | ✅ | ✅ |
| Mapa Cognitivo | `SCHEMA-RC-SOLUTION-004` | ✅ 237/528/20/13 | ✅ deep links from articles + VERA | ✅ 17 tests incl. checksums | ✅ | ✅ |
| Quick Frameworks | `SKILL-EXE-SF-001` | ✅ 299 records | ✅ from articles + VERA | ✅ | ✅ | ✅ |
| Oficina — 5 surfaces | ADR-UX-001..004 | ✅ | ✅ | ✅ 18 tests | ✅ | ✅ |
| Solution records | `SUPER_SCHEMA` v1.4.1 | ✅ 2 real instances | ✅ | ✅ | ✅ | ✅ |
| VERA — deterministic | BLOG-15 | ✅ `packages/vera` | ✅ routes to all surfaces | ✅ 21 tests incl. 4 injection cases | ✅ | ✅ |
| VERA — generative | ADR-VERA-001 | ✅ behind `VERA_LLM_ENABLED` | — | ✅ off-state tested | ✅ | ✅ off-state verified on the deployed site; 🔒 generation needs a key |

## Honest gaps — named, not filled

These are absences in the corpus. None is papered over in the UI.

| Gap | Where it shows |
|---|---|
| TP-002 / TP-003 do not exist | Blog shows one article. Nothing is padded. |
| No CTA routed to "Descoberta" | TP-001 renders no CTA; `stagesWithoutCta()` names it. |
| "Guia Custo Cognitivo" does not exist | `RC-CTA-002` is inert rather than repointed. |
| Conversor de Relatório unresolved (`RC-SOLUTION-001` id collision) | `RC-CTA-001` inert. |
| `obsidian-editorial` targets are `PENDING_*` | Shows "Destino ainda não publicado", not a dead button. |
| SEUS is `CALIBRATION_REQUIRED` | No score displayed; the page says why. |
| `#05`, `#10`, `#13`–`#16`, `#19`–`#21` are GAP-only | No voice guide, cover images, SEO copy or nav IA invented. |
| No LLM key in `executar-nf-web` | VERA's generative layer stays off and says so. |

## Product design system — non-regression

`packages/design-tokens` and `packages/design-system/styles/globals.css`
are **unmodified**, pinned by hash in `scripts/PRODUCT_DS_BASELINE.sha256`
and checked by the `editorial-isolation` CI job. `apps/app` and
`apps/mobile` are untouched. Verified in the compiled bundle, not only in
source: editorial tokens emit as `[data-surface=editorial]{--ed-bg:#fff…}`, the
dark appearance emits under the same scope selector, and no `:root`
block contains any `--ed-*`.

## Fixed along the way

Not in the original scope, but each was breaking or would have broken the
public surface:

- **Auth could take the whole public site down.** `apps/web` references
  `@repo/auth` in one file and no page reads a session, yet a missing
  Clerk key 500'd every route. This repo had already shipped that outage
  twice (`GATE-MOBILE-001`, commit `c3d9821`). Now: no `ClerkProvider` on
  public pages, middleware degrades to unauthenticated, and a feature
  flag falls back to its default instead of throwing. Measured: `/blog`
  went 500 → 200 with no key present.
- **`/api/*` was being localized.** The i18n middleware rewrote
  `POST /api/vera` to `/en/api/vera`, so the endpoint 404'd while the
  page calling it looked fine.
- **`<html lang>` was hardcoded to `en`** under a `[locale]` segment,
  mislabelling Portuguese content.
- **`RC-CTA-002` pointed at a route that was never built.**

## Onda de conteúdo — Quick Frameworks EXECUTAR e série fundadora (2026-09-22)

| Item | Fonte | Implementado | Integrado | Testado | Deployed | Verified |
|---|---|---|---|---|---|---|
| Quick Frameworks EXECUTAR (23 registros) | `RC-KNW-001_QUICK_FRAMEWORKS_V1` + `RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1` | ✅ `packages/knowledge/src/quick-frameworks.ts` | ✅ `/quick-frameworks`, ligado ao Mapa por `factor_id` e ao Blog por tag | ✅ 13 testes | ⏳ | ⏳ |
| Correção de nome: "Quick Frameworks" pertence ao produto real | — | ✅ `/frameworks` renomeado para "Frameworks de apoio" | ✅ link cruzado nos dois sentidos | — | ⏳ | ⏳ |
| Série fundadora (3 artigos de blog) | `RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1` | ✅ `risco-cognitivo`, `fatores-de-risco-cognitivo`, `exposicao-cognitiva` | ✅ pilar "Riscos Cognitivos" reaproveitado | ✅ | ⏳ | ⏳ |
| Renderer Mermaid | — | ✅ componente client, `prefers-color-scheme` direto | ✅ MDX (`pre` override) + páginas Quick Framework | ⏳ visual, verificar em produção | ⏳ | ⏳ |
| Layout do pacote Apple-screenshot | `DS_APPLE_UPGRADE_SCREENSHOT_001` | ✅ `.ed-cta-compact` — só medida, paleta rejeitada | — | — | ⏳ | ⏳ |

Contradição registrada, não resolvida por inferência: os 3 artigos da série trazem `status: REDIGIDO_VALIDACAO_ESTRUTURAL` no próprio frontmatter e `STATUS: VERIFIED` nos stubs de validação do mesmo pacote — ver `DEC-010` e `packages/knowledge/data/quick-frameworks/PROVENANCE.md`.
