# GATE_LOG — PLAN-EXEC-1409

```
ID       GATES-EXEC-1409
VERSION  1.0.0
OWNER    Leo — sas.executar@gmail.com
REGRA    Append-only. Uma entrada por gate. Nenhuma entrada é escrita antes de a
         evidência existir. Falha de planejamento é registrada aqui antes de
         qualquer pedido novo ser feito a Leo.
```

Entrada mais recente no topo.

---

## GATE-00 — Insumos, Segredos e Decisões Humanas

| | |
|---|---|
| **Fase** | `PLAN-EXEC-1409-F00` |
| **Data** | 2026-09-14 |
| **Modelo / modo / esforço planejados** | OPUS · plan mode · HIGH |
| **Modelo / modo / esforço realmente usados** | OPUS · plan mode · HIGH |
| **Parâmetro adequado?** | **Sim.** A fase parecia administrativa e não era: quatro afirmações do handoff foram refutadas por leitura de sistema, e a causa raiz da `web` mudou de variável. Sonnet em modo normal teria versionado o pacote e repetido o diagnóstico errado — que é exatamente a falha que custou as duas semanas anteriores. |
| **Critério do gate** | 7 secrets + 1 variable gravados · 3 decisões respondidas |
| **Resultado** | **PARCIAL** — decisões respondidas e superadas em número (5 de 5 endereçadas, 3 decididas); secrets seguem `USER_ACTION_REQUIRED` |

### Entregue

| Artefato | Evidência |
|---|---|
| `docs/fase-zero/**` — pacote completo versionado (27 arquivos) | contagem origem == destino |
| `docs/fase-zero/ADDENDUM-2026-09-14.md` | estado real lido dos sistemas, com log e resposta de API citados |
| `FORM-ZERO.md` v1.1.0 | §2 corrigida contra o código, §7 nova |
| `DECISION_LOG.md` | DEC-001..005 |
| `AUTHORIZATIONS.md` | A-01..A-14 |
| `GATE_LOG.md` | este arquivo |

### Achado que muda a FASE-01

A `executar-nf-web` **não** quebra por `NEXT_PUBLIC_WEB_URL`. O `.env.production`
mergeado resolveu as URLs e expôs a exigência seguinte. O build nomeia a culpada:

```
web:build: ❌ Invalid environment variables: [
web:build:   { path: [ "DATABASE_URL" ],
web:build:     message: "Invalid input: expected string, received undefined" } ]
```

`executar-nf-web` tem 2 env vars configuradas e `DATABASE_URL` não é uma delas. A
exigência entra por importação transitiva — `/.well-known/vercel/flags` →
`@repo/feature-flags` → `@repo/auth/server` → `@repo/database/keys.ts` —, o que é a
razão de o contrato de 56 variáveis, extraído de `env.ts`/`keys.ts`, não a ter previsto.

O `sync-vercel-env.yml` já mergeado sincroniza `DATABASE_URL` para `web` em
`production,preview`. Nenhum código precisa mudar para destravar a `web`.

### Falhas de planejamento registradas

O `PROMPT-14.09-FASE-ZERO.md` §CONSTRAINTS obriga a registrar falha de planejamento
antes de pedir qualquer coisa nova a Leo. Quatro:

| ID | Falha | Correção aplicada |
|---|---|---|
| **FP-001** | FORM-ZERO §2 pedia 3 variables; só `NEON_PROJECT_ID` é lida por algum workflow. `VERCEL_ORG_ID` saiu no PR #21, `EAS_PROJECT_CONFIGURED` nunca existiu no código | §2 reduzida a 1 linha, com a evidência do `grep` |
| **FP-002** | O pacote declarava a `web` mitigada por `.env.production` e reduzia a FASE-01 a "rodar o sync". A mitigação funcionou, mas a variável seguinte continuava ausente | ADDENDUM §1 nomeia `DATABASE_URL` com o log completo; FASE-01 recebe a tarefa certa |
| **FP-003** | O pacote declarava que `sync-vercel-env.yml` nunca executou. Executou em 13/09 19:53 (run `34779071488`) e foi `skipped` pelo gate `vars.VERCEL_ORG_ID != ''`, removido depois pelo PR #21 | ADDENDUM §3; o dispatch virou o probe de segredos desta fase |
| **FP-004** | O pacote não previu que o Linear já estaria populado com ~190 issues de outro esquema de IDs, tornando o gate V3 insatisfazível | DEC-005: time novo; `Executar-Rotina` intacto |

Nenhuma das quatro foi descoberta por inferência: todas vieram de leitura de sistema
— log de build da Vercel, API de env var, API de runs do Actions, API do Linear.

### Mudança de condição operacional

A credencial da Vercel disponível nesta sessão foi **aceita** (`GET /v2/user` → HTTP
200, `sas.executar@gmail.com`, team `team_fJe21quDM0egDSTPE0CFwNnm`). Cinco sessões
anteriores registraram `Not authorized` / `invalidToken`. O diagnóstico de env var
acima foi feito por esse caminho, em leitura apenas.

Escrita por esse caminho **não foi executada**: é ação da FASE-01, atrás deste gate, e
o plano impõe WIP = 1. Registrada como A-05 `A DEFINIR` em `AUTHORIZATIONS.md`, com a
recomendação de continuar preferindo o `sync-vercel-env.yml` — ele deixa rastro em run
de CI e não depende de uma credencial de sessão que já foi rejeitada antes.

### Probe de segredos

Reproduzido primeiro em local, com todos os segredos vazios, para provar o formato
antes de gastar um run:

```
$ GITHUB_EVENT_NAME=workflow_dispatch VERCEL_TOKEN= ... bash scripts/load-deployment-config.sh sync
::error::Deployment blocked. Missing: VERCEL_TOKEN at least one application secret to synchronize
exit=1
```

Run real: **[`34852124203`](https://github.com/Sas-Executar/01-Executar-Echo/actions/runs/34852124203)**,
`workflow_dispatch` na `main` (`9b56000`), `redeploy_production=false`.

Os três jobs da matriz (`web`, `app`, `api`) **rodaram** — não foram `skipped`, o que
confirma FP-003 — e falharam no passo 3, antes de qualquer chamada de rede. O job
`Dispatch Deploy Web (production)` ficou `skipped`, como projetado.

Log do job `Sync + verify web` (`104002429271`), verbatim:

```
env:
  VERCEL_TOKEN:
  DEPLOY_APP: web
  DATABASE_URL_VALUE:
  RESEND_TOKEN_VALUE:
  RESEND_FROM_VALUE:
  CLERK_WEBHOOK_SECRET_VALUE:
  HAS_DATABASE_URL: false
  HAS_RESEND: false
  HAS_CLERK_SECRET: false
##[error]Deployment blocked. Missing: VERCEL_TOKEN at least one application secret to synchronize
```

Este probe é repetível a custo zero e sem expor valor: qualquer sessão futura dispara o
mesmo workflow e lê o mesmo veredito. Substitui "Leo disse que gravou" por evidência.

#### Inventário de segredos, por evidência

O probe acima cobre só os cinco segredos que o `sync-vercel-env.yml` consome. O CI do
próprio PR #22 cobriu o resto. Estado completo:

| Item | Estado | Evidência |
|---|---|---|
| `VERCEL_TOKEN` | **ausente** | `VERCEL_TOKEN:` vazio no runner, run `34852124203` |
| `DATABASE_URL` | **ausente** | `HAS_DATABASE_URL: false`, mesmo run |
| `RESEND_TOKEN` | **ausente** | `HAS_RESEND: false`, mesmo run |
| `RESEND_FROM` | **ausente** | `HAS_RESEND: false`, mesmo run |
| `CLERK_WEBHOOK_SECRET` | **ausente** | `HAS_CLERK_SECRET: false`, mesmo run |
| `NEON_API_KEY` | ✅ **gravado** | job `Create + migrate preview branch` (`104003464081`) criou branch de preview e rodou `prisma migrate deploy` de verdade contra `ep-autumn-queen-…us-east-2.aws.neon.tech/executar`: "8 migrations found", "No pending migrations to apply" |
| variable `NEON_PROJECT_ID` | ✅ **gravada** | o mesmo job é gated em `vars.NEON_PROJECT_ID != ''` e **não** ficou `skipped` |
| `CHROMATIC_PROJECT_TOKEN` | ausente (não bloqueia) | job `Storybook visual regression` encerrou em 3s sem executar passo algum — o caminho de skip por ausência de token |
| `EXPO_TOKEN` | **não verificado** | nenhum workflow o exercita em evento de PR; só o `deploy-mobile.yml` |

**Correção de registro.** A primeira leitura deste probe concluiu "nenhum segredo está
gravado". Errado por excesso: o probe só enxerga os cinco do `sync-vercel-env.yml`.
`NEON_API_KEY` e `NEON_PROJECT_ID` já estavam configurados, e a prova é uma migration
real executada contra o Neon. O que falta a Leo no §1 são **cinco** secrets, não sete,
e o §2 já está feito.

O critério do GATE-00 continua **não** satisfeito: `VERCEL_TOKEN` e `DATABASE_URL`,
que são os que destravam a FASE-01, seguem ausentes.

### Pendências USER_ACTION_REQUIRED

| Item | Trava |
|---|---|
| `VERCEL_TOKEN` e `DATABASE_URL` no cofre do GitHub | **FASE-01** — sozinhos já destravam |
| `CLERK_WEBHOOK_SECRET`, `RESEND_TOKEN`, `RESEND_FROM` | FASE-01 (parcial), FASE-04, FASE-06 |
| `EXPO_TOKEN` | FASE-11 — estado não verificado, nenhum workflow o exercita em PR |
| ~~`NEON_API_KEY`~~ · ~~variable `NEON_PROJECT_ID`~~ | ✅ **já gravados** — ver inventário acima |
| DEC-003 — domínio, compra, upgrade Pro | FASE-04, FASE-07, FASE-10 |
| DEC-004 — Scanner | FASE-10 |
| FORM-ZERO §4 — dados legais e de loja | FASE-06, FASE-11 |
| FORM-ZERO §6 — autorizações A-05 e A-08 | — |

### Próxima fase

`PLAN-EXEC-1409-F01` — **Desbloqueio de Build — Contrato de Env à Prova de Falha**
· **OPUS · plan mode · esforço HIGH**.

Justificativa dos parâmetros: continua havendo decisão arquitetural aberta (qual dos
dois caminhos de escrita de env var adotar como canônico) e ação com custo alto de erro
silencioso (redeploy de produção nos três projetos). A ordem das operações importa mais
que a velocidade — sincronizar antes de redeployar, e verificar `readyState` por
projeto em vez de assumir que o merge publicou.
