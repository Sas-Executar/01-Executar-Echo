# DECISION_LOG — Ecossistema EXECUTAR

```
ID       DECISIONS-EXEC-1409
VERSION  1.0.0
OWNER    Leo — sas.executar@gmail.com
REGRA    Append-only. Nada aqui é preenchido por inferência.
         Decisão não tomada permanece A DEFINIR, com a fase que ela trava nomeada.
```

Registro das decisões que só o dono do produto pode tomar, com o conflito, as duas
fontes, o impacto de adiar, a recomendação fundamentada e a resposta.

---

## DEC-001 — Repositório canônico · **DECIDED**

| | |
|---|---|
| **Conflito** | Qual repositório é a fonte de verdade do ecossistema |
| **Fonte A** | Corpus documental D20: `Sas-Executar/Sas-Executar` |
| **Fonte B** | Estado live: `Sas-Executar/01-Executar-Echo` — 33 packages, 60 rotas, 8 apps, 7 projetos Vercel, todo o histórico de CI |
| **Impacto de adiar** | Governança e Linear apontam para o lugar errado; F02 e F03 travam |
| **Recomendação** | Fonte B. A alternativa custa migração completa sem ganho técnico |
| **Resposta de Leo** | **`Sas-Executar/01-Executar-Echo` é o canônico** |
| **Data** | 2026-09-14 |
| **Consequência** | Corpus D20 reclassificado como registro histórico. Governança, Linear e toda referência de plano apontam para `01-Executar-Echo`. Desbloqueia F02 e F03 |
| **Evidência** | `git ls-remote`, `list_projects` da Vercel (7 projetos, 4 ligados a este repo), 21 PRs de histórico |

---

## DEC-002 — Arquitetura de dados persistente · **DECIDED**

| | |
|---|---|
| **Conflito** | Onde o dado de produção vive |
| **Fonte A** | Corpus D20/D05: AWS Aurora PostgreSQL privado, `sa-east-1` |
| **Fonte B** | Estado live: Neon `executar-production` (`snowy-dawn-65785764`), `aws-us-east-2`, Postgres 18, 30 tabelas com RLS, 8 migrations aplicadas |
| **Impacto de adiar** | Fica muito mais caro depois que houver dado real de usuário; F05 trava |
| **Recomendação** | Fonte B. O branch-por-PR já funciona (`preview-db.yml`), migrar agora atrasaria de F05 em diante, e a transferência internacional de dados já está declarada no aviso de privacidade |
| **Resposta de Leo** | **Manter Neon** |
| **Data** | 2026-09-14 |
| **Consequência** | Registro de arquitetura reclassificado; Aurora sai do plano. Desbloqueia F05. A declaração de transferência internacional no aviso de privacidade permanece obrigatória |
| **Evidência** | `preview-db.yml` referenciando `vars.NEON_PROJECT_ID`; env vars `PG*`/`POSTGRES_*`/`NEON_*` presentes em `executar-nf-api` e `executar-nf-app` |

---

## DEC-003 — Domínio próprio e plano da Vercel · **A DEFINIR**

| | |
|---|---|
| **Conflito** | Não existe domínio próprio, e o plano Hobby tem dois efeitos concretos |
| **Efeito 1** | SSO forçado em todo `*.vercel.app`. `executar-nf-api` está com `ssoProtection.enabled=true`, `deploymentType=all_except_custom_domains`, e **não existe domínio custom** — ou seja, todo domínio da API está atrás de SSO, inclusive o `/webhooks/auth` que o Clerk precisa chamar |
| **Efeito 2** | Cron limitado a 1×/dia. O EXECUTAR Rotina foi degradado de 15 minutos para uma vez por dia por causa disso |
| **Impacto de adiar** | F04, F07 e F10 travam. Sem domínio não há webhook do Clerk entregando, não há corte público e o Rotina não cumpre a proposta |
| **Pendente** | nome do domínio · autorização de compra e teto de preço · autorização de upgrade para Pro |
| **Resposta de Leo** | `A DEFINIR` |
| **Trava** | **F04, F07, F10** |

---

## DEC-004 — Scanner: OCR ou DINOv2/ONNX · **DECIDED**

O pipeline on-device (`packages/scanner`: `preprocess.ts`, `dinov2-encoder.ts`,
`similarity.ts`) já implementava e testava apenas o caminho DINOv2/ONNX, mas
a decisão nunca tinha sido registrada aqui — o único bloqueio real era a
ausência de um artefato `.onnx` hospedado. Numa sessão de execução do plano
Scroll+Scanner (P0 lançamento), diante da confirmação de que nenhum arquivo
do modelo existia no repositório, no zip enviado ou em qualquer branch/
Release, Leo escolheu explicitamente sourciar um modelo DINOv2 público
("Use um modelo DINOv2 público (Recomendado)") em vez de esperar por um
artefato próprio — resposta que resolve de fato a escolha OCR vs. DINOv2 em
favor de DINOv2, já que a alternativa OCR nunca teve implementação no corpus.

| | |
|---|---|
| **Conflito** | O corpus preservava as duas abordagens (OCR e DINOv2/ONNX), sem escolher |
| **Impacto de adiar** | F10 ficava sem caminho técnico definido |
| **Resposta de Leo** | **DINOv2/ONNX — modelo público `facebook/dinov2-small` (ViT-S/14), exportado para ONNX (opset 17) e hospedado por Claude nesta sessão, já que nenhum artefato próprio existia** |
| **Data** | 2026-09-21 |
| **Consequência** | `dinov2-vits14.onnx` publicado na branch órfã `model-assets` (commit `7318832`), servido via URL raw imutável pinada no SHA do commit; `EXPO_PUBLIC_DINOV2_MODEL_URL`/`EXPO_PUBLIC_DINOV2_MODEL_SHA256` preenchidos em `apps/mobile/.env.example` e `eas.json`; rota `POST /scanner/symbols` e tela `apps/mobile/app/scanner-enroll.tsx` fecham o caminho de enrollment ponta a ponta |
| **Trava** | ~~F10~~ — desbloqueada |
| **Evidência** | Commits `5f083ba`, `abf665c`, `9284d3e`, `2c8ff06` nesta branch; validação numérica do export (similaridade de cosseno 0.9999999 contra o PyTorch original) e SHA-256 conferido via `curl`+`sha256sum` |

---

## DEC-005 — Reconciliação do Linear · **DECIDED**

Decisão que o pacote original da Fase Zero não previu. Registrada como FP-004 em
`GATE_LOG.md`.

| | |
|---|---|
| **Conflito** | O time `Executar-Rotina` já tem ~190 issues criadas em 2026-09-14 (08:50 e 13:11) com esquema `D07-PH-1426` / `Dxx-TASK-1402xx`, vindas da planilha "EXECUTAR — MATRIZ 1409". O `04-LINEAR/EXECUTAR_LINEAR_MATRIX.csv` deste pacote tem 73 linhas no esquema `PLAN-EXEC-1409-FXX-TYY` |
| **Impacto de adiar** | Importar por cima duplica o board e torna o gate V3 ("toda tarefa do CSV tem issue com o mesmo ID, zero divergência") impossível de satisfazer; F03 trava |
| **Recomendação** | Time separado. Zero destruição, zero duplicata, gate verificável contra um board limpo |
| **Resposta de Leo** | **Criar um time novo só para o plano técnico `PLAN-EXEC-1409`** |
| **Data** | 2026-09-14 |
| **Consequência** | `Executar-Rotina` fica com o plano editorial/operacional que já está lá, **intacto e não arquivado**. As 73 linhas vão para o time novo na F03. O gate V3 passa a ser contado só contra o time novo |
| **Evidência** | `list_issues` no time `a9b14467-81ea-4f68-9276-ee136f75b935`: EXE-190 como maior ID, `createdAt` 2026-09-14 |

---

## DEC-006 — Fonte canônica de blueprint do domínio Blog · **DECIDED**

| | |
|---|---|
| **Conflito** | `AGENTS.md`/`README.md`/`MASTER_WORKBOOK.md` apontam `Sas-Executar/Executar-app-Blueprint` como fonte canônica de requisitos deste repo. Para o produto Blog, o material vivo (brief, UX, design tokens de marca, linha editorial, drafts em revisão, skill `executar-safe-frameworks`, bio de autor) foi materializado e está versionado em `Sas-Executar/LANCAMENTO`, `D23__blueprints/Executar Blog/#00`–`#22`, não em `Executar-app-Blueprint` |
| **Impacto de adiar** | Este repo continuaria citando um repositório sem o conteúdo real do Blog; qualquer implementação real do Blog ficaria sem fonte rastreável até uma reconciliação manual |
| **Recomendação** | Adotar `Sas-Executar/LANCAMENTO` como fonte canônica **para o domínio Blog especificamente**, sem alterar a fonte canônica dos demais domínios (copiloto, rotinas, scanner etc.), que seguem em `Executar-app-Blueprint` |
| **Resposta de Leo** | **`Sas-Executar/LANCAMENTO` é a fonte canônica para o domínio Blog** |
| **Data** | 2026-09-21 |
| **Consequência** | `AGENTS.md`, `README.md` e `MASTER_WORKBOOK.md` passam a citar `Sas-Executar/LANCAMENTO` como fonte canônica do domínio Blog. Assets de marca, a skill `executar-safe-frameworks` e a bio do autor (DOC-0019) são materializados como conteúdo real neste repo (`apps/web/public/brand/`, `skills/executar-safe-frameworks/`, `docs/executar/blog/`). Nenhum artigo de blog foi criado: `LANCAMENTO` ainda não tem conteúdo editorial pronto para publicação (`#07-ARTIGOS-PRONTOS` vazio, `#08-ARTIGOS-REVISAO` só com drafts em revisão) — publicar a partir de draft não revisado violaria a régua de maturidade deste arquivo |
| **Evidência** | `Sas-Executar/LANCAMENTO` PR #10 (mergeável, CI verde, dois receipts de governança: `D23-EXECUTAR-BLOG-IMPORT-001`, `D18-RC-UNIFIED-GOVERNANCE-SCHEMA-001`) |
