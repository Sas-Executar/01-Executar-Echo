# ÍNDICE DO ECOSSISTEMA EXECUTAR — Rotas, Dados Estruturais e Dependências

```
ID        IDX-EXEC-1409
VERSION   1.0.0
AREA      D06 Conhecimento · D12 Engenharia · D20 Plataformas · D23 Blueprint
STATUS    VERIFIED (lido dos sistemas reais em 2026-09-14)
FONTE     Clone de Sas-Executar/01-Executar-Echo @ 9b56000 + Vercel MCP + Neon MCP + Linear MCP + corpus D01–D23
```

Este documento existe para que uma sessão do Claude Code saiba **tudo que o ecossistema é**, sem precisar descobrir. Nada aqui é presumido: cada número vem de leitura do código ou do sistema.

---

## 1. Cadeia de valor → implementação

O briefing estratégico descreve o EXECUTAR como cadeia única de valor: conhecimento → metodologia → ferramenta → produto → conteúdo → demonstração → aquisição → relacionamento → serviço → aprendizado. A tabela abaixo mapeia cada componente estratégico ao que **existe de fato em código hoje**, e o que ainda é especificação.

| # | Componente do ecossistema | Implementação real | Estado verificado |
|---|---|---|---|
| 2 | EXECUTAR App | `apps/app` — 25 rotas autenticadas | código existe; produção instável |
| 4 | Copiloto EXECUTAR | `packages/agent-runtime`, `packages/ai`, `apps/api/copilot/command`, `apps/app/copilot` | runtime especificado, registry incompleto |
| 5 | EXECUTAR Mapa OS | `packages/mapa-os`, `apps/app/mapa-os`, `apps/api/mapa-os`, `apps/mobile/(tabs)/mapa-os` | rotas existem; impressão não verificada |
| 6 | EXECUTAR Scanner | `packages/scanner`, `apps/api/scanner/{dispatch,symbols,undo}`, `apps/mobile/(tabs)/scanner` | conflito técnico aberto (OCR vs DINOv2/ONNX) |
| 7 | EXECUTAR Rotina | `packages/routines`, `packages/automation`, `apps/api/cron/routines`, `apps/app/automations` | degradado a 1×/dia pelo plano Hobby |
| 8 | EXECUTAR Status Report | `packages/reports`, `apps/api/reports/*`, `apps/app/reports` | rotas existem; não validado com dado real |
| 9 | EXECUTAR Skills | `skills/next-forge`, `packages/mcp` | contrato MCP V2.1 especificado, não verificado |
| 12 | EXECUTAR Mídias Sociais | `packages/cms/content/blog`, `apps/web/blog` | MDX local; BaseHub removido |
| 18 | cursocognitivo.org | Vercel `payload-website-starter` ← repo `CustoCognitivoBlog` | fora do monorepo |
| 19 | Vera (agente do Curso Cognitivo) | — | sem implementação localizada |
| 20 | Mapa Cognitivo | Vercel `rc-mapa-interativo` (sem link git) | deploy isolado, origem não rastreável |
| 29 | EXECUTAR Maestro | `docs/executar/`, `AGENTS.md`, `skills/` | infraestrutura interna parcial |
| 30 | Escola.ai | — | sem implementação |
| 15/16/17 | Marketplace, Infoprodutos, Afiliados | `packages/billing`, `packages/payments` (Stripe test-mode) | motor existe; catálogo não |
| 13/14/28 | Comunidade, ONG, Emprego e Portfólio | — | sem implementação |

**Leitura operacional:** o monorepo implementa hoje o núcleo de produto (App, Mapa OS, Scanner, Rotina, Reports, Copiloto) e a camada pública (Web). As frentes 13, 14, 19, 28 e 30 são `A DEFINIR` — não têm nó de código e não entram no plano de lançamento sem decisão nova.

---

## 2. Repositórios e plataformas

| Plataforma | Identificador | Papel | Observação verificada |
|---|---|---|---|
| GitHub | `Sas-Executar/01-Executar-Echo` | monorepo do produto | público; `main`; HEAD `9b56000` |
| GitHub | `Sas-Executar/Sas-Executar` | apontado pelo corpus como canônico | **conflito DEC-001** |
| GitHub | `Sas-Executar/CustoCognitivoBlog` | cursocognitivo.org | fora do escopo do plano |
| Vercel | team `Sas_Executar` `team_fJe21quDM0egDSTPE0CFwNnm` | hospedagem | **plano Hobby** |
| Neon | `executar-production` `snowy-dawn-65785764` | Postgres 18, `aws-us-east-2`, db `executar` | 8 migrations, 30 tabelas, RLS ativo |
| Clerk | instância de desenvolvimento | identidade | **rodando dev em produção** |
| Stripe | `acct_1UEAHqQ7o5IHoh4H` | pagamentos | **test mode**, 6 preços, webhook `we_1UEB5OQ7o5IHoh4HmGA3hBwM` |
| Linear | time `Executar-Rotina` `a9b14467-…` | controle | 1 projeto editorial; nenhum item técnico |
| Expo/EAS | — | mobile | `extra.eas.projectId` **vazio** |
| Resend | conta real, vazia | e-mail transacional | chave de envio provisionada |

### Projetos Vercel

| Projeto | ID | Root | Produção |
|---|---|---|---|
| `executar-nf-app` | `prj_tjzeAZAoitSeuYf0RNEhmyakMiMo` | `apps/app` | último deploy ERROR |
| `executar-nf-web` | `prj_pa8ihwg7ReAncAAhZMBHdKTLMZr1` | `apps/web` | **nunca READY** |
| `executar-nf-api` | `prj_Ui40tk9orjhk5wq5tG90F5z65kiD` | `apps/api` | ERROR; SSO ligado |
| `executar-nf-storybook` | `prj_AgAOTg4tmiNRlgHViJnqy6SAtKSn` | `apps/storybook` | integração git própria |
| `executar` | `prj_kS2cMe3GBqgbrchMCmUN3eQyxU4P` | repo `Sas-Executar` | escopo depende de DEC-001 |
| `payload-website-starter` | `prj_4ky5u6OSsCga7uutpOO0d9W2kZmC` | repo `CustoCognitivoBlog` | cursocognitivo.org |
| `rc-mapa-interativo` | `prj_unY23X6stsfCvTG7qKHIu6cVCS53` | sem link | Mapa Cognitivo |

`config/deployment.json` já versiona `orgId` e os três `projectId` de app/web/api — é a fonte única para os scripts de deploy.

---

## 3. Rotas — 60 no total

Detalhe completo em `INDEX-ROTAS.csv`.

| App | Tipo | Qtde |
|---|---|---|
| `apps/app` | página autenticada | 25 |
| `apps/api` | rota de API | 20 |
| `apps/mobile` | tela | 9 |
| `apps/web` | página pública | 6 |

**`apps/web` (público, i18n por `[locale]`):** `/`, `/blog`, `/blog/[slug]`, `/contact`, `/legal/[slug]`, `/pricing`.

**`apps/app` (autenticado):** `/`, `/overview`, `/now`, `/today`, `/tomorrow`, `/yesterday`, `/mapa-os`, `/projects`, `/projects/[projectId]`, `/projects/remix`, `/sprint`, `/roadmap`, `/calendar`, `/reports`, `/copilot`, `/automations`, `/workflows`, `/integrations`, `/webhooks`, `/search`, `/admin/dashboard`, `/settings/billing`, `/settings/privacy`, `/sign-in`, `/sign-up`.

**`apps/api`:** `/health`, `/mcp`, `/mapa-os`, `/now`, `/now/advance`, `/projects`, `/reports`, `/reports/generate`, `/copilot/command`, `/scanner/symbols`, `/scanner/dispatch`, `/scanner/undo`, `/notifications/register-device`, `/cron/keep-alive`, `/cron/routines`, `/webhooks/auth`, `/webhooks/payments`, `/webhooks/whatsapp`, `/webhooks/gmail`, `/webhooks/outlook`.

**`apps/mobile`:** `/sign-in`, `/sign-up`, `/`, `/mapa-os`, `/projects`, `/reports`, `/scanner`, `/copilot`, `/settings`.

---

## 4. Contrato de variáveis de ambiente — 56 variáveis

Detalhe completo com validador real em `CONTRATO-ENV.csv`. Declaradas em `packages/*/keys.ts` e `apps/*/env.ts`, validadas por `@t3-oss/env-nextjs` + Zod, agregadas por app via `extends: [...]`.

### 4.1 Obrigatórias sem fallback — 3

| Variável | Validador | Pacote | Consumida por |
|---|---|---|---|
| `DATABASE_URL` | `z.url()` | `database` | app, api |
| `NEXT_PUBLIC_APP_URL` | `z.url()` | `next-config` | app, api, web |
| `NEXT_PUBLIC_WEB_URL` | `z.url()` | `next-config` | app, api, web |

`apps/web/.env.production` já versiona as duas `NEXT_PUBLIC_*_URL` — são valores públicos por definição, e o Next.js não sobrescreve valor já presente em `process.env`.

### 4.2 Opcionais com validação de prefixo — 16 · **ESTAS SÃO AS ARMADILHAS**

| Variável | Prefixo exigido | Pacote |
|---|---|---|
| `CLERK_WEBHOOK_SECRET` | `whsec_` | auth |
| `STRIPE_WEBHOOK_SECRET` | `whsec_` | payments |
| `CLERK_SECRET_KEY` | `sk_` | auth |
| `STRIPE_SECRET_KEY` | `sk_` | payments |
| `LIVEBLOCKS_SECRET` | `sk_` | collaboration |
| `SVIX_TOKEN` | `sk_` ou `testsk_` | webhooks |
| `OPENAI_API_KEY` | `sk-` | ai |
| `RESEND_TOKEN` | `re_` | email |
| `ARCJET_KEY` | `ajkey_` | security |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_` | auth |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_` | analytics |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-` | analytics |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/` | auth |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/` | auth |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/` | auth |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/` | auth |

Mais `RESEND_FROM` (`.email()`) e as de formato `z.url()` — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_DOCS_URL`, `NEXT_PUBLIC_POSTHOG_HOST`, `BETTERSTACK_URL`, `NEXT_PUBLIC_SENTRY_DSN`, `UPSTASH_REDIS_REST_URL`.

> **Regra que precisa estar em toda cabeça e em todo prompt:** `.optional()` protege contra a variável **ausente**, nunca contra a variável **errada**. Valor presente e fora do formato reprova a validação inteira e quebra o build de todos os apps que estendem o pacote. Foi assim que `executar-nf-api` ficou em ERROR por quatro merges servindo binário antigo.

### 4.3 Agregação por app

| App | Pacotes estendidos |
|---|---|
| `apps/app` | ai, auth, analytics, collaboration, next-config, database, email, feature-flags, notifications, observability, security, webhooks |
| `apps/api` | auth, analytics, next-config, database, email, integrations, observability, payments + `CRON_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN` |
| `apps/web` | next-config, email, observability, feature-flags, security, rate-limit |
| `apps/mobile` | sem Zod — Expo inlina `EXPO_PUBLIC_*` no bundle |

---

## 5. Segredos e variáveis do GitHub Actions

Lidos dos próprios workflows (`.github/workflows/*.yml`).

**Secrets referenciados:** `VERCEL_TOKEN`, `DATABASE_URL`, `RESEND_TOKEN`, `RESEND_FROM`, `CLERK_WEBHOOK_SECRET`, `NEON_API_KEY`, `EXPO_TOKEN`, `CHROMATIC_PROJECT_TOKEN`.
**Variables referenciadas:** `NEON_PROJECT_ID`.

**Workflows:** `ci.yml` (lint, typecheck, test, evals, visual regression) · `security.yml` (TruffleHog + `bun audit` informativo) · `preview-db.yml` (branch Neon por PR) · `deploy-web.yml` · `deploy-mobile.yml` · `sync-vercel-env.yml` (**o único caminho de escrita de env var na Vercel**).

`sync-vercel-env.yml` já implementa: upsert idempotente por chave, matriz por app com targets distintos, health check pós-deploy de preview, e verificação de assinatura Svix do Clerk. Nunca rodou porque os secrets não existem.

---

## 6. Packages — 33

`agent-runtime` · `ai` · `analytics` · `application` · `auth` · `automation` · `billing` · `cms` · `collaboration` · `database` · `design-system` · `design-tokens` · `domain` · `email` · `feature-flags` · `integrations` · `internationalization` · `mapa-os` · `mcp` · `next-config` · `notifications` · `observability` · `payments` · `rate-limit` · `reports` · `routines` · `scanner` · `schemas` · `security` · `seo` · `storage` · `typescript-config` · `webhooks`

Detalhe em `INDEX-PACOTES.csv`. Os 16 com `keys.ts` são os que participam do contrato de env.

---

## 7. Gates de qualidade vigentes

De `QUALITY_GATES.md`, com o que é bloqueante hoje:

| Gate | Limiar | Bloqueante hoje |
|---|---|---|
| typecheck | 0 erros em todos os pacotes | Sim |
| tests | 0 falhas; suítes com credencial ausente devem **pular**, não falhar | Sim |
| agent evals | 100% em `evals/{datasets,adversarial,regression}` (18 casos) | Sim |
| security — secrets | 0 secrets verificados (TruffleHog) | Sim |
| security — dependências | baseline de 306 advisories, 9 críticas | Não (`continue-on-error`) |
| **build** | — | **Não** — declarado fora de propósito |
| **E2E Playwright** | — | **Não** — configs prontas, sem credencial |

Promover build e E2E a bloqueantes é a FASE-12.

---

## 8. Conflitos e lacunas registrados

| ID | Tipo | Descrição | Estado |
|---|---|---|---|
| DEC-001 | CONFLITO | repositório canônico: corpus diz `Sas-Executar/Sas-Executar`, live roda `01-Executar-Echo` | aberto — FASE-00 |
| DEC-002 | CONFLITO | dados: corpus aprova AWS Aurora `sa-east-1`, live roda Neon `aws-us-east-2` | aberto — FASE-00 |
| DEC-003 | DECISÃO | domínio + upgrade do plano Vercel (cron e SSO) | aberto — FASE-00 |
| DEC-004 | CONFLITO | Scanner: OCR tradicional vs DINOv2/ONNX/SymbolRegistry | aberto — FASE-10 |
| GAP-001 | CONTENT | termos e privacidade em `packages/cms/content/legal` são rascunhos | FASE-06 |
| GAP-002 | ACCOUNT | `extra.eas.projectId` vazio; `EXPO_TOKEN` rejeitado | FASE-11 |
| GAP-003 | DOC DRIFT | `LAUNCH_RUNBOOK.md` §9 lista IDs de projetos Vercel que a própria §2 declara extintos | FASE-01 |
| GAP-004 | SCOPE | frentes 13, 14, 19, 28 e 30 do briefing sem nó de código | A DEFINIR |
| GAP-005 | INPUT | ZIP do D20, Prompt Maxine (D21), estratégias do D16 e D19 não recebidos | A DEFINIR |

---

## 9. Arquivos de dados deste índice

| Arquivo | Conteúdo | Linhas |
|---|---|---|
| `CONTRATO-ENV.csv` | 56 variáveis com validador real, prefixo, obrigatoriedade e consumidores | 56 |
| `INDEX-ROTAS.csv` | 60 rotas com app, tipo e arquivo de origem | 60 |
| `INDEX-PACOTES.csv` | 33 packages com contagem de arquivos, `keys.ts` e testes | 33 |
