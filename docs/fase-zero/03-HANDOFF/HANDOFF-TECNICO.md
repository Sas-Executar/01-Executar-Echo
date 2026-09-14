# HANDOFF TÉCNICO — Diagnóstico e Plano de Execução
## Ecossistema EXECUTAR · 2026-09-14

```
ID              HANDOFF-EXEC-1409
VERSION         1.0.0
AREA            D12 Engenharia
WORKFLOW        Preparação da Fase Zero para execução full-stack
OWNER           Leo — sas.executar@gmail.com
STATUS          PREPARED
AUTOMATION      A4 (executado, verificado, evidenciado)
DEPENDS_ON      —
BLOCKS          PLAN-EXEC-1409 FASE-00
MÉTODO          engineering:debug (reproduzir → isolar → diagnosticar → corrigir)
                + engineering:code-review (contrato de env como superfície crítica)
```

---

## 1. Resumo executivo

Os projetos do ecossistema estão ativos e quebrados pelo mesmo motivo, e o motivo não é o que os documentos do repositório dizem.

`executar-nf-web` **nunca** teve build de produção verde. `executar-nf-api` está em ERROR desde um redeploy manual de 13/09 e vem servindo o binário do PR #15 há quatro merges — a Vercel não promove build que falha, então o alias de produção continua entregando código velho sem nenhum sinal visível no painel. `executar-nf-app` teve produção verde até o último deploy, que também falhou.

A causa raiz é uma só, em dois disfarces: **o contrato de variáveis de ambiente deste monorepo reprova silenciosamente e reporta a falha com uma mensagem que não nomeia nada**. Falta de variável e valor errado de variável produzem exatamente o mesmo `Invalid environment variables`.

Cinco sessões anteriores tentaram corrigir escrevendo a variável direto na Vercel e todas falharam, cada uma por uma barreira diferente. O caminho que funciona já foi construído e mergeado no PR #21, e nunca rodou por um motivo trivial: **os secrets do GitHub nunca foram gravados**. Isso é a Fase Zero inteira — uma sessão de 40 minutos do Leo em telas de provedor, e o bloqueio de duas semanas acaba.

---

## 2. Evidência do estado atual

Tudo abaixo foi lido dos sistemas em 2026-09-14, não presumido.

### 2.1 Estado de produção por projeto

| Projeto | Último deploy | Produção READY mais recente | Diagnóstico |
|---|---|---|---|
| `executar-nf-web` | `dpl_5dx9bmC7…` ERROR | **nenhuma na janela observada** | `NEXT_PUBLIC_WEB_URL` ausente desde a criação do projeto |
| `executar-nf-api` | `dpl_8dcsibsFz…` ERROR | `dpl_HA77vZqQ…` (PR #15) | `CLERK_WEBHOOK_SECRET` sem prefixo `whsec_` |
| `executar-nf-app` | `dpl_AmbqqrTG…` ERROR | `dpl_CYvaXDZH…` (PR #18) | mesmo contrato de env |

### 2.2 Log de build real

`executar-nf-web`, deploy `dpl_8Ek6vX7mJs7AbwdRGRAUMHa4C6Mf`:
```
19:57:29  web:build: Error: Invalid environment variables
19:57:29  web:build: Error: Failed to collect page data for /.well-known/vercel/flags
19:57:29  Error: Command "turbo run build" exited with 1
```

`executar-nf-api`, deploy `dpl_8dcsibsFz8C4aqYjYUWaeAVqgbmC`:
```
19:50:31  api:build: Error: Invalid environment variables
19:50:31  Error: Command "turbo run build" exited with 1
```

Mensagens idênticas, causas diferentes. **Esse é o defeito de engenharia.**

### 2.3 Proteção de deploy

```json
{ "projectName": "executar-nf-api",
  "ssoProtection": { "enabled": true, "deploymentType": "all_except_custom_domains" } }
```
Não existe domínio customizado. Ou seja: **todo** domínio da API está atrás de SSO, inclusive o endpoint `/webhooks/auth` que o Clerk precisa chamar. Mesmo com o build corrigido, o webhook não entregaria.

---

## 3. Diagnóstico de causa raiz

### 3.1 Reproduzir

O contrato de env vive em 16 `packages/*/keys.ts` + 4 `apps/*/env.ts`, agregados por `@t3-oss/env-nextjs` via `extends: [...]`. Extração completa do código: **56 variáveis**.

### 3.2 Isolar

| Classe | Qtde | Comportamento quando ausente | Comportamento quando presente e errada |
|---|---|---|---|
| Obrigatória (`z.url()` sem `.optional()`) | 3 | **quebra o build** | quebra o build |
| Opcional com prefixo (`.startsWith(…).optional()`) | 16 | ignorada, ok | **quebra o build** |
| Opcional com formato (`z.url()`/`.email()` + `.optional()`) | ~6 | ignorada, ok | **quebra o build** |
| Opcional livre | ~31 | ignorada, ok | ignorada |

### 3.3 Diagnosticar

Duas falhas distintas, um sintoma:

**Falha A — `executar-nf-web`.** `NEXT_PUBLIC_WEB_URL` é `z.url()` sem `.optional()` em `packages/next-config/keys.ts`, e nunca esteve presente no ambiente de produção desse projeto. O `LAUNCH_RUNBOOK.md` §2 afirmava o contrário — a tabela marcava a variável como confirmada nos três projetos. O log de build provou que era drift documental. Mitigação já mergeada: `apps/web/.env.production` versiona os três `NEXT_PUBLIC_*_URL`, que são públicos por definição e portanto não têm segredo a proteger.

**Falha B — `executar-nf-api`.** `CLERK_WEBHOOK_SECRET` está declarada como `z.string().startsWith("whsec_").optional()` em `packages/auth/keys.ts`. Configurar essa variável com um valor que não começa com `whsec_` não a torna "ignorada" — reprova o schema inteiro e derruba o build. A variável em branco teria sido mais segura que a variável errada.

> **Achado de revisão de código.** `.optional()` em Zod cobre `undefined`, não valor inválido. Um schema que combina `.startsWith()` com `.optional()` cria uma armadilha de configuração: o operador acredita que preencher é sempre mais seguro que não preencher, e o oposto é verdade. Com 16 variáveis nessa forma, a probabilidade de reincidência é alta — por isso a FASE-01 trata a classe, não o caso.

### 3.4 Por que as correções anteriores não pegaram

Registrado nos próprios commits do repositório:

| Caminho tentado | Resultado |
|---|---|
| Conector MCP da Vercel | somente leitura — não existe ferramenta de escrita de env var |
| `curl` direto na API da Vercel | credencial injetada pelo proxy rejeitada pela Vercel: `Not authorized` / `invalidToken` |
| Vercel CLI | mesma rejeição |
| `eas-cli` | `The bearer token is invalid` |
| Escrita de secrets do GitHub Actions | bloqueada pela política de proxy |
| Conector do Clerk | só expõe snippets de SDK, sem API de instância ou webhook |

**O caminho que funciona, e já existe:** `.github/workflows/sync-vercel-env.yml` + `scripts/sync-vercel-env.sh` fazem upsert idempotente via API REST da Vercel usando `secrets.VERCEL_TOKEN`, com matriz por app, health check pós-deploy e verificação de assinatura Svix. Mergeado no PR #21. **Nunca executou porque `VERCEL_TOKEN` não existe como secret do repositório.**

### 3.5 Corrigir — o que a FASE-01 faz

1. **Preflight nominal antes do `next build`:** falha citando nome da variável, prefixo esperado e app afetado.
2. **Blindagem das 16 variáveis com prefixo:** valor errado vira erro de configuração localizado, não quebra global. Teste de regressão usando o `CLERK_WEBHOOK_SECRET` como fixture real.
3. **`sync-vercel-env.yml` por `workflow_dispatch`** para web, app e api.
4. **Verificação de `readyState=READY` nos três**, via `get_project`, no mesmo commit.
5. **`INFRASTRUCTURE.md` gerado do código** + verificação de drift no `ci.yml` — o drift do runbook já custou dias uma vez.

---

## 4. Achados secundários

| # | Achado | Severidade | Fase |
|---|---|---|---|
| A1 | SSO em `all_except_custom_domains` sem domínio custom bloqueia o webhook do Clerk | Alta | 04 |
| A2 | Clerk rodando instância de **desenvolvimento** em produção | Alta | 04 |
| A3 | Cron do EXECUTAR Rotina degradado de 15 min para 1×/dia pelo plano Hobby | Média | 10 + DEC-003 |
| A4 | `extra.eas.projectId` vazio e `EXPO_TOKEN` rejeitado — mobile sem caminho de build | Média | 11 |
| A5 | Termos e Privacidade em `packages/cms/content/legal` são rascunhos declarados | Média | 06 |
| A6 | `LAUNCH_RUNBOOK.md` §9 lista IDs de projetos Vercel que a §2 declara extintos | Baixa | 01 |
| A7 | Build e E2E deliberadamente fora dos gates bloqueantes | Média | 12 |
| A8 | 306 advisories de dependência, 9 críticas, em `continue-on-error` | Média | 12 |
| A9 | Stripe em test mode; livemode depende de KYC humano | Média | 06 |
| A10 | Plano aprovado vivia só no arquivo de plan mode local; perdido no estouro de contexto (commit `7ab7b90`) | **Alta** | 02 |

**A10 é o que torna as fases 2 e 3 não-negociáveis.** Um plano que só existe na sessão morre com a sessão. `PLAN/state.json` + `GATE_LOG.md` no repositório e espelho no Linear são a correção estrutural, não burocracia.

---

## 5. Conflitos que exigem decisão humana

| ID | Conflito | Fonte A | Fonte B | Impacto de adiar |
|---|---|---|---|---|
| DEC-001 | repositório canônico | corpus D20: `Sas-Executar/Sas-Executar` | live: `01-Executar-Echo` | governança e Linear apontam para o lugar errado |
| DEC-002 | arquitetura de dados | corpus D20/D05: AWS Aurora `sa-east-1` | live: Neon `aws-us-east-2` | migração fica muito mais cara depois de haver dado real |
| DEC-003 | domínio e plano Vercel | — | lançamento público exige domínio; Hobby força SSO e cron diário | fases 4, 7 e 10 travadas |
| DEC-004 | Scanner: OCR vs DINOv2/ONNX | corpus preserva as duas | — | FASE-10 sem caminho definido |

Nenhuma foi resolvida por inferência. Todas entram como tarefa bloqueante da FASE-00, com recomendação fundamentada e a decisão final com Leo.

---

## 6. Plano resultante

13 fases, 60 tarefas, 13 gates, 12 riscos. Matriz completa em `02-PLANO/MATRIZ-PLANO-EXECUTAR.xlsx`; plano fracionado com IDs espelhados em `02-PLANO/csv/FASE-XX.csv`.

| Fase | Nome | Modelo | Modo | Esforço | Gate |
|---|---|---|---|---|---|
| 00 | Insumos, Segredos e Decisões Humanas | OPUS | plan | HIGH | secrets + variables + 3 decisões |
| 01 | Desbloqueio de Build — Env à prova de falha | OPUS | plan | HIGH | 3 projetos READY no mesmo commit |
| 02 | Governança — Registro, Runner, Retomada | SONNET | normal | MEDIUM | sessão nova retoma sozinha |
| 03 | Linear como entry point único | SONNET | normal | MEDIUM | toda tarefa com issue espelhada |
| 04 | Identidade — Domínio, Clerk, fim do SSO | OPUS | plan | HIGH | webhook real do Clerk em 200 |
| 05 | Dados — Neon, migrations, RLS, previews | SONNET | normal | HIGH | 89 testes de RLS executando |
| 06 | Receita e Conformidade — Stripe, LGPD | SONNET | normal | MEDIUM | checkout ponta a ponta + LGPD |
| 07 | Web — site público, blog, pricing, SEO | SONNET | normal | MEDIUM | rotas em 200 no domínio próprio |
| 08 | App — Mapa OS, Now, Projetos, Relatórios | OPUS | normal | HIGH | jornada núcleo em E2E autenticado |
| 09 | Copiloto e Agent Runtime — MCP, evals | OPUS | plan | HIGH | evals 100% + comando real auditável |
| 10 | Scanner, Rotina e integrações | SONNET | normal | HIGH | webhooks assinados em 200 |
| 11 | Mobile — EAS, build, submissão | SONNET | normal | HIGH | aceito nas duas lojas |
| 12 | Lançamento — observabilidade, E2E, corte | OPUS | plan | HIGH | smoke completa + rollback testado |

### Critério de escolha dos parâmetros

**Opus** onde há decisão arquitetural aberta, ação irreversível ou custo alto de erro silencioso — fases 0, 1, 4, 8, 9, 12. **Sonnet** onde o caminho está documentado e o trabalho é execução verificável — fases 2, 3, 5, 6, 7, 10, 11. **Plan mode** onde a ordem das operações importa mais que a velocidade. Esforço **HIGH** por densidade de verificação, não por tamanho do diff: a fase 11 é HIGH por volume de artefato, a fase 9 é HIGH por densidade de decisão. Overkill custa latência e é falha tanto quanto subdimensionar — por isso cada gate registra se o parâmetro escolhido se mostrou adequado.

### Grafo de dependências

```
00 ──► 01 ──┬──► 02 ──► 03
            ├──► 04 ──┬──► 06 ──┐
            └──► 05 ──┘         ├──► 08 ──┬──► 09 ──► 10 ──┐
                 04 ──► 07 ─────────────┐ └──► 11 ─────────┤
                                        └────────────────► 12
```

---

## 7. Riscos principais

| ID | Risco | P | I | Mitigação |
|---|---|---|---|---|
| RSK-001 | Segredo com prefixo errado derruba produção de novo | Alto | Alto | FORM-ZERO informa prefixo por variável; FASE-01 adiciona validação nominal |
| RSK-002 | Conflitos canônicos não resolvidos travam fases 5 e 10 | Alto | Alto | viram tarefa bloqueante da FASE-00 |
| RSK-004 | Vercel serve binário antigo sem sinal visível | Médio | Alto | `readyState` por projeto vira critério de gate |
| RSK-008 | Copiloto executa ação destrutiva sobre dado real | Baixo | **Crítico** | handoff auditável + desfazer obrigatório + evals adversariais antes de qualquer escrita |
| RSK-009 | Cron 1×/dia degrada a proposta do EXECUTAR Rotina | Alto | Médio | registrado como limitação explícita com reversão documentada; upgrade em DEC-003 |
| RSK-012 | Estouro de contexto perde o plano | Alto | Alto | `PLAN/state.json` + `GATE_LOG.md` versionados |

Registro completo em `02-PLANO/csv/00-RISCOS.csv`.

---

## 8. O que este handoff entrega e o que ainda depende de você

**Entregue e verificado (A4):** diagnóstico de causa raiz com evidência de log · contrato completo de 56 variáveis extraído do código · índice de 60 rotas e 33 packages · plano de 13 fases com gates objetivos · matriz XLSX + 17 CSVs espelho · CSV de import do Linear com 73 linhas · prompt executável autossuficiente · formulário único da Fase Zero.

**Depende de você (USER_ACTION_REQUIRED):** os 7 secrets e 3 variables do §1 e §2 do FORM-ZERO · as três decisões DEC-001/002/003 · os dados de submissão às lojas · as autorizações do §6.

**Permanece `A DEFINIR`, sem bloquear:** ZIP de inventário do D20 · Prompt Maxine do D21 · estratégias prioritárias do D16 e D19 · frentes 13, 14, 19, 28 e 30 do briefing, que não têm nó de código.

**Próxima ação:** abrir sessão do Claude Code com o repositório conectado, colar `00-PROMPT/PROMPT-14.09-FASE-ZERO.md`, e responder o `FORM-ZERO.md` que ela vai emitir.
