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

## DEC-004 — Scanner: OCR ou DINOv2/ONNX · **A DEFINIR**

| | |
|---|---|
| **Conflito** | O corpus preserva as duas abordagens, sem escolher |
| **Impacto de adiar** | F10 fica sem caminho técnico definido |
| **Resposta de Leo** | `A DEFINIR` |
| **Trava** | **F10** |
| **Nota** | Decisão reversível e de baixo custo se tomada antes da F10 começar; não precisa ser resolvida agora |

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
