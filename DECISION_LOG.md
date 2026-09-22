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

---

## DEC-007 — Identidade visual das superfícies públicas · **DECIDED**

| | |
|---|---|
| **Conflito** | Três fontes se contradiziam sobre a identidade das superfícies públicas. (1) `ADR-DS-001` faz de `packages/design-tokens` (green `#00bf63` / azure `#1f93ff` / IBM Plex) a SOT do Design System, consumida por `apps/app`, `apps/mobile` **e** `apps/web`. (2) O contrato NatGeo-hybrid v6 em `LANCAMENTO #02-UX-UI`/`#03-DESIGN-TOKENS` define para o Blog e institucional uma identidade oposta em quase todos os eixos: amarelo `#ffcc00`, preto, charcoal `#111111`, cantos retos, tipografia de sistema, **azul proibido**. (3) O `README.txt` do pacote de 82 PNGs declara uma terceira paleta, em escala de cinza, sem amarelo — conflito que o próprio corpus registra como `DS-01 USER_ACTION_REQUIRED`. Agravante técnico: Tailwind v4 CSS-first, sem `tailwind.config`, e o único mecanismo de escopo existente no repo era a classe `.dark`. Não havia como sustentar duas identidades — vestir o site significava editar os tokens do produto e repintar o app e o mobile junto |
| **Impacto de adiar** | Qualquer implementação da superfície pública teria de escolher entre contrariar o contrato v6 (site com cara de app) ou editar `packages/design-tokens` (regressão visual silenciosa em `apps/app` e `apps/mobile`) |
| **Recomendação** | Separar por **escopo**, não por disciplina: manter `packages/design-tokens` intocado como DS do produto e criar `@repo/editorial-tokens` emitido exclusivamente sob `[data-surface="editorial"]`, com a fronteira verificada mecanicamente no CI. Para o `DS-01`, adotar os tokens v6 — os PNGs são marcas em preto, branco e reverso, sem paleta própria, e compõem corretamente sobre a superfície editorial |
| **Resposta de Leo** | **Tokens NatGeo v6 mandam na superfície pública** (2026-09-22) |
| **Data** | 2026-09-22 |
| **Consequência** | `ADR-DS-002` (separação), `ADR-DS-003` (resolve `DS-01`), `ADR-OFICINA-001` (o `visual_contract` do binding da Oficina deixa de governar superfícies públicas; a parte estrutural segue canônica). `packages/design-tokens` **não foi editado**: está fixado por hash em `scripts/PRODUCT_DS_BASELINE.sha256` e verificado pelo job `editorial-isolation`. `DS-01` sai de `USER_ACTION_REQUIRED` para `RESOLVED` |
| **Evidência** | Isolamento confirmado no CSS **compilado**, não só no fonte: os tokens editoriais saem como `[data-surface=editorial]{--ed-yellow:#fc0…}` e nenhum bloco `:root` contém `--ed-*`. 11 testes, incluindo casos negativos que provam que a guarda falha quando violada |

---

## DEC-008 — Os três "Mapa" e a fonte de dados do Mapa Cognitivo · **DECIDED**

| | |
|---|---|
| **Conflito** | Três produtos diferentes são chamados de "Mapa": o Mapa Cognitivo público (`MAPA-PRD-001`, APPROVED, sem código), o Mapa-OS/Prisma interno (implementado em `packages/mapa-os` e `apps/app`), e o Scroll (`APP-SCR-001`, mobile). A ambiguidade já produziu erro de planejamento: um pedido para implementar `PRD-SCROLL-001`, identificador que **não existe em nenhum dos dois repositórios**. Além disso, o grafo materializado de 237 nós descrito pelo PRD não estava versionado em nenhum repositório |
| **Impacto de adiar** | Risco concreto de regenerar o grafo por inferência a partir do BLOG-09 ou do corpus editorial — produzindo um artefato diferente com o mesmo identificador, sem que nada acusasse a substituição |
| **Recomendação** | Registrar os três como produtos distintos, registrar a inexistência de `PRD-SCROLL-001`, e fixar `SCHEMA-RC-SOLUTION-004` como SOT de dados **não regenerável** |
| **Resposta de Leo** | **Não reconstrua o grafo. O artefato já existe** — entregue como `SCHEMA-RC-SOLUTION-004_AGENT_BUNDLE` em 2026-09-22 |
| **Data** | 2026-09-22 |
| **Consequência** | `ADR-MAPA-001`. O bundle é vendorizado em `packages/knowledge/data/cognitive-map/` com checksums e procedência. Um teste verifica os checksums e as contagens a cada execução, de modo que regenerar o grafo **quebra o CI** — que é o comportamento desejado |
| **Evidência** | `sha256sum -c` 10/10 OK na recepção; `graph_data.json` valida contra `graph_schema.json`; 237 nós · 528 relações · 20 soluções · 13 evidências, conferidos |

---

## DEC-009 — Identidade pública: EXECUTAR Native Editorial v2 substitui a v6 · **DECIDED**

| | |
|---|---|
| **Conflito** | A `DEC-007` adotou os tokens NatGeo-hybrid v6, e a superfície pública foi construída sobre eles. O pacote `EXECUTAR_BLOG_HANDOFF_002_APPLE_ALIGNED` declara uma **única identidade canônica** — `EXECUTAR-BLOG-IDENTITY-001` v2.0, `ADR-002` `APPROVED` — que substitui a identidade implícita do handoff 001. Duas exigências da v2 contradizem frontalmente o que estava implementado e verificado no CI: a serifa New York sai da identidade, e `--focus: #0A84FF` é obrigatório, enquanto a `ADR-DS-003` proíbe azul e o `check-drift.ts` falha o build em qualquer azul |
| **Impacto de adiar** | A superfície pública ficaria numa identidade explicitamente superseded, e o gate de paleta passaria a defender uma decisão revogada — o pior estado possível para uma guarda automática: verde, e errada |
| **Recomendação** | Estreitar a regra em vez de abandoná-la. O proibido é o **azul do produto** (`#1f93ff`) como cor de identidade; o azul de foco do sistema é permitido e obrigatório, porque um anel de foco que o usuário não reconhece como foco é regressão de acessibilidade, não escolha de estilo |
| **Resposta de Leo** | **Formalizado. O pacote agora tem uma única identidade canônica: EXECUTAR Native Editorial** (2026-09-22) |
| **Data** | 2026-09-22 |
| **Consequência** | `ADR-DS-004`. A `ADR-DS-003` fica `SUPERSEDED_IN_PART`: a resolução do `DS-01` continua válida — o amarelo segue sendo a cor de marca, agora com uso contido — e só as regras de composição caem. A API de tokens passa a ser **papéis semânticos**, não hexadecimais; claro e escuro são duas aparências de uma identidade. A arquitetura de informação não muda: rotas, dados, Mapa, Oficina, VERA e navegação seguem intactos, como o próprio pacote determina |
| **Evidência** | 13/13 SHA-256 do pacote conferidos contra o seu próprio `MANIFEST.json`, registrados em `reference/v2/CHECKSUMS.sha256`. Verificado no browser contra produção, nas duas aparências: `--ed-bg` resolve `#fff` no claro e `#000` no escuro, `--ed-focus` `#0a84ff` em ambas, coluna de leitura em 17px/1.6 dentro de 760px, sem New York. Zero blocos `:root` com `--ed-*` no bundle servido |
