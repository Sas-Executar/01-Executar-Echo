# BLOG_REQUIREMENTS_TRACEABILITY — EXECUTAR

**Status:** ACTIVE  
**Purpose:** normative traceability for the Blog release process.  
**Echo baseline:** `Sas-Executar/01-Executar-Echo@f5a20dc13398d6e4a10765f388a34b557b5346b0`  
**Blueprint baseline examined:** `Sas-Executar/04-exe-pre-Blueprint@b7fd9e4853b9ca51c275737e9ef197105740f607`  
**Operational requirements source:** Notion `MASTER_INDEX — Ecossistema`, section `03 · BLOG`, last fetched 2026-09-21.

## 1. Authority model

The Blueprint repository defines the required traceability chain:

```text
origin repo/branch/SHA/path
  -> ID
  -> requirement
  -> acceptance criteria
  -> implementation target
  -> test/evidence
  -> release
```

It also defines the canonical delivery flow:

```text
EVID -> PROBLEM -> ICP -> JOURNEY -> JTBD -> VALUE
-> PRD -> REQ -> AC -> ADR -> SPEC -> CODE -> TEST -> EVAL -> RELEASE -> KPI -> LEARNING
```

### Normative rule

1. `NORMATIVE_REQUIREMENT` may only reproduce or directly reference an existing approved/canonical source.
2. `DERIVED_VERIFICATION` may define a test that proves implementation, but MUST NOT create product behavior.
3. `IMPLEMENTATION_EVIDENCE` describes current code/live state and has no authority to rewrite requirements.
4. `PROPOSED` is never treated as an existing requirement.
5. Unknown source, AC, route, owner, or mapping is recorded as `GAP`; it is never silently inferred.

## 2. Critical source gap

At the Blueprint baseline above, the requirements area contains generic/product PRDs such as Omnichannel, Routines, Scanner and Studio, but no dedicated `PRD-BLOG-*` artifact or Blog-specific AC registry was found.

Therefore:

```yaml
gap_id: GAP-PRD-BLOG-001
status: BLOCKED
meaning: "BLOG-01..BLOG-20 exist as the canonical operational Blog matrix, but do not currently resolve to a dedicated Blog PRD + authoritative acceptance criteria artifact in 04-exe-pre-Blueprint."
effect:
  - do_not_invent_prd_requirements
  - preserve BLOG-01..BLOG-20 wording
  - mark checklist tests as DERIVED_VERIFICATION
  - require explicit PRD/AC linkage before claiming 100% PRD traceability
```

This gap does **not** erase the Blog requirements matrix. It prevents the deployment checklist from pretending that derived checks are source PRD text.

## 3. Canonical Blog requirement matrix

| ID | Classification | NORMATIVE_REQUIREMENT (exact scope preserved) | Implementation mapping | Verification contract |
|---|---|---|---|---|
| BLOG-01 | NORMATIVE_REQUIREMENT | Estratégia / Resumo executivo — Qual função do Blog no ecossistema e qual proposta central? | `/blog` public proposition/copy and connected ecosystem entrypoints; exact copy source must be referenced | DERIVED_VERIFICATION: rendered proposition matches approved source; links resolve |
| BLOG-02 | NORMATIVE_REQUIREMENT / reference input | Estratégia / Benchmark — Referências editoriais, educacionais e de produto | No standalone runtime target required. Adopted benchmark decisions must map to ADR/UX/code when used | DERIVED_VERIFICATION: every claimed implemented benchmark decision points to a decision + code diff; benchmark existence alone is not PASS |
| BLOG-03 | NORMATIVE_REQUIREMENT | UX / UIX e Journey — Descoberta → leitura → exploração → CTA → conversão | `/blog`, article routes and approved CTA destinations | DERIVED_VERIFICATION: E2E covers the complete approved journey |
| BLOG-04 | NORMATIVE_REQUIREMENT | Produto / Usabilidade Transversal PRD — Requisitos comuns de UX, leitura, navegação e conversão | Blog UI/components/routes; detailed AC = GAP until PRD linkage exists | DERIVED_VERIFICATION only after explicit AC source; generic "looks good" is invalid |
| BLOG-05 | NORMATIVE_REQUIREMENT | Conteúdo / Pilares — Pilares temáticos e função de cada um | CMS taxonomy/content schema | DERIVED_VERIFICATION: every published article resolves to an approved pillar; taxonomy values validate |
| BLOG-06 | NORMATIVE_REQUIREMENT | Marketing / Campanhas — Campanhas, objetivos, audiência e CTA | Campaign configuration/content + tracking destinations | DERIVED_VERIFICATION: campaign objective/audience/CTA are traceable and events observable |
| BLOG-07 | NORMATIVE_REQUIREMENT | Editorial / Linha editorial — Voz, formatos, cadência, categorias e regras editoriais | Editorial source + article validation workflow | DERIVED_VERIFICATION: published content validates against approved editorial rules; rules themselves are not invented by deploy docs |
| BLOG-08 | NORMATIVE_REQUIREMENT | CMS / CMS — Modelo de conteúdo, campos, taxonomia, workflow e publicação | `packages/cms`, `packages/cms/content/blog`, Blog runtime | DERIVED_VERIFICATION: schema/content validation + create/edit/publish workflow evidence + production resolution |
| BLOG-09 | NORMATIVE_REQUIREMENT | Produto / Mapa — Mapa interativo, conteúdo, função e integração no journey | TARGET GAP until canonical Blog Map route/component is mapped | DERIVED_VERIFICATION: route/render/data/interaction/journey E2E after target mapping |
| BLOG-10 | NORMATIVE_REQUIREMENT | Conversão / Oficina — Função da oficina e relacionamento com conteúdos/produtos | TARGET GAP until canonical Oficina route is mapped | DERIVED_VERIFICATION: article/product relationships, CTA and route flow after mapping |
| BLOG-11 | NORMATIVE_REQUIREMENT | Conversão / CTA — CTAs, regras, destinos e eventos de conversão | Blog/article/Oficina CTA components + analytics events | DERIVED_VERIFICATION: destination, event and conversion behavior match approved rules |
| BLOG-12 | NORMATIVE_REQUIREMENT | Conversão / Assets — Materiais, templates, ferramentas e downloads | Asset/store delivery surface; concrete path must be mapped per asset | DERIVED_VERIFICATION: asset exists, renders/downloads, provenance/licensing where required, tracking fires |
| BLOG-13 | NORMATIVE_REQUIREMENT | Agentes / Skills — Skills associadas ao Blog e à Oficina | Skill registry/packages used by Blog/Oficina | DERIVED_VERIFICATION: registered skill -> consumer -> input/output -> executable invocation evidence |
| BLOG-14 | NORMATIVE_REQUIREMENT | Ecossistema / EXECUTAR Family — Produtos e recursos do ecossistema conectados ao Blog | Approved deep links/integration adapters | DERIVED_VERIFICATION: every declared integration target resolves and critical user flow works |
| BLOG-15 | NORMATIVE_REQUIREMENT | Agente / VERA — Papel, funções, entradas, saídas e limites | TARGET GAP until canonical VERA Blog runtime/route is formally mapped | DERIVED_VERIFICATION: functional chat/agent E2E must test approved functions and limits, not deploy-document inventions |
| BLOG-16 | NORMATIVE_REQUIREMENT | Financeiro / Modelo financeiro VERA — Custos de uso, modelo comercial e limites | VERA usage/cost telemetry + enforcement surface after approved model exists | DERIVED_VERIFICATION: observed usage/cost and enforced limits reconcile to approved financial model |
| BLOG-17 | NORMATIVE_REQUIREMENT | Design / Design System — Componentes, tokens, editorial UI e padrões | `@repo/design-system`, design tokens and Blog components | DERIVED_VERIFICATION: token/component conformance + accessibility/visual checks against approved design source |
| BLOG-18 | NORMATIVE_REQUIREMENT | Navegação / Rotas — Arquitetura de rotas e páginas | Current: `/blog`, `/blog/[slug]`; additional Map/VERA/Oficina/Framework routes remain GAP until canonical mapping | DERIVED_VERIFICATION: route inventory exactly matches approved IA and returns expected states |
| BLOG-19 | NORMATIVE_REQUIREMENT | Framework / Quick Frameworks — Frameworks rápidos, finalidade, estrutura e CTA | TARGET GAP until canonical framework schema/index/detail routes are mapped | DERIVED_VERIFICATION: schema + index/detail + article relation + CTA E2E after mapping |
| BLOG-20 | NORMATIVE_REQUIREMENT | Conteúdo / Artigos — Inventário, status, categoria, pilares e publicação | `packages/cms/content/blog/*.mdx`, `/blog/[slug]` | DERIVED_VERIFICATION: inventory matches files; metadata/taxonomy valid; each intentionally published slug returns production HTTP 200 with rendered body |

## 4. Additional launch-input traceability

The launch input supplied for the Blog adds implementation/material requirements around:

- approved ADRs;
- editorial line and voice/tone;
- taxonomy;
- ready/review/backlog article inventories;
- covers/article images;
- authors/bios;
- SEO;
- site copy;
- navigation/IA;
- editorial legal;
- ecosystem integrations;
- newsletter/CTA;
- analytics/KPI;
- accessibility/performance;
- QA/tests;
- release/deploy.

These are classified as `LAUNCH_INPUT`, not automatically as `PRD_REQUIREMENT`. They become normative for a release only when their source artifact/decision is identified and approved.

## 5. Implementation evidence currently verified

| Evidence ID | Current Echo artifact | Supports |
|---|---|---|
| EVID-BLOG-001 | `apps/web/app/[locale]/blog/page.tsx` | Blog index route/render |
| EVID-BLOG-002 | `apps/web/app/[locale]/blog/[slug]/page.tsx` | article route, metadata, JSON-LD |
| EVID-BLOG-003 | `packages/cms/index.ts` + `packages/cms/lib/posts.ts` | local MDX CMS runtime |
| EVID-BLOG-004 | `packages/cms/content/blog/*.mdx` | current article source |
| EVID-BLOG-005 | `packages/cms/__tests__/posts.test.ts` | disk-to-content metadata resolution |
| EVID-BLOG-006 | `apps/web/next.config.ts` | explicit MDX serverless file tracing |
| EVID-BLOG-007 | `apps/web/app/[locale]/sitemap.ts` + `robots.ts` | discovery surfaces |
| EVID-BLOG-008 | `.github/workflows/deploy-web.yml` | production deployment path |
| EVID-BLOG-009 | `.github/workflows/ci.yml` | lint/typecheck/tests; not a full Blog production proof |

Implementation evidence cannot promote BLOG-01..20 to PASS by itself.

## 6. Release traceability record

Every release must fill one record per affected requirement:

```yaml
requirement_id: BLOG-XX
normative_source:
  repository_or_workspace: ""
  ref_or_page: ""
  path_or_section: ""
  version_or_sha: ""
requirement_text: ""
acceptance_criteria:
  authority: "SOURCE | GAP"
  ids: []
derived_verification:
  - id: ""
    test: ""
implementation:
  targets: []
  commit_sha: ""
evidence:
  ci_run: ""
  preview_url: ""
  production_url: ""
  logs: []
status: "PASS | BLOCKED"
blocked_reason: ""
```

## 7. PASS rule

`PASS` requires all of the following for the affected requirement:

1. normative source is identified;
2. requirement wording is preserved;
3. authoritative AC is linked, or the source explicitly does not require a product AC for that item;
4. implementation target is mapped;
5. code/content change exists where implementation is required;
6. test is executed;
7. production verification is executed when the item affects production;
8. evidence is recorded.

Any missing mandatory link is `BLOCKED`, with the missing link named.

## 8. Current normative status

```yaml
BLOG-01..BLOG-20:
  operational_requirement_source: PASS
  dedicated_blueprint_prd_link: BLOCKED
  dedicated_authoritative_ac_link: BLOCKED
  reason: GAP-PRD-BLOG-001
```

Until `GAP-PRD-BLOG-001` is closed, the Blog deploy system is traceable to the canonical operational Blog matrix and real Echo implementation, but MUST NOT claim "100% mapped to a dedicated PRD-BLOG" as a factual state.
