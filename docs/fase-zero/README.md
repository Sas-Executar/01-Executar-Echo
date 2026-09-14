# PACOTE FASE ZERO — Lançamento do Ecossistema EXECUTAR

```
ID       PKG-EXEC-1409
VERSION  1.0.0
DATA     2026-09-14
OWNER    Leo — sas.executar@gmail.com
ORIGEM   14-09.md + corpus D01–D23 (6.490 registros) + estado live verificado
```

Este pacote é o planejamento da Fase Zero: tudo que precisa existir **antes** de o Claude Code começar a desenvolver, para que a partir da FASE-01 você só assista e valide nos gates.

## Por onde começar

1. Leia `03-HANDOFF/HANDOFF-TECNICO.md` — 5 minutos, explica por que os projetos estão quebrados.
2. Abra uma sessão do Claude Code na web com `Sas-Executar/01-Executar-Echo` conectado.
3. Cole o conteúdo de `00-PROMPT/PROMPT-14.09-FASE-ZERO.md` como primeira mensagem.
4. Responda o `00-PROMPT/FORM-ZERO.md` — 40 a 60 minutos, uma única vez.

## Estrutura

```
00-PROMPT/
  PROMPT-14.09-FASE-ZERO.md      Especificação operacional autossuficiente para o Claude Code
  FORM-ZERO.md                   Formulário único com tudo que depende de você

01-INDEX/
  INDEX-ECOSSISTEMA-E-ROTAS.md   Índice: produtos, plataformas, rotas, env, gates, conflitos
  CONTRATO-ENV.csv               56 variáveis com validador real, prefixo e consumidores
  INDEX-ROTAS.csv                60 rotas (app 25 · api 20 · mobile 9 · web 6)
  INDEX-PACOTES.csv              33 packages do monorepo

02-PLANO/
  MATRIZ-PLANO-EXECUTAR.xlsx     Matriz completa — 7 abas
  csv/00-FASES.csv               13 fases com modelo, modo, esforço e justificativa
  csv/00-TAREFAS-TODAS.csv       60 tarefas
  csv/00-GATES.csv               13 gates
  csv/00-RISCOS.csv              12 riscos
  csv/FASE-00.csv … FASE-12.csv  Plano fracionado, um CSV por fase, IDs espelhados

03-HANDOFF/
  HANDOFF-TECNICO.md             Diagnóstico de causa raiz com evidência

04-LINEAR/
  EXECUTAR_LINEAR_MATRIX.csv     73 linhas prontas para importar no Linear
```

## Esquema de IDs

Tudo se cruza pelo mesmo ID, em qualquer arquivo:

```
PLAN-EXEC-1409              plano
PLAN-EXEC-1409-F01          fase
PLAN-EXEC-1409-F01-T03      tarefa
GATE-01                     gate da fase
RSK-003                     risco
DEC-001                     decisão pendente
```

## O diagnóstico em um parágrafo

Os três projetos Vercel falham no build com a mesma mensagem — `Invalid environment variables` — por duas causas diferentes. A `web` nunca teve `NEXT_PUBLIC_WEB_URL`, que é obrigatória. A `api` tem `CLERK_WEBHOOK_SECRET` preenchida com valor que não começa com `whsec_`, e essa variável é opcional **com prefixo obrigatório**: preenchê-la errado reprova o schema inteiro e derruba o build, enquanto deixá-la vazia não derrubaria nada. Como a Vercel não promove build que falha, o alias de produção da API continua servindo o binário de quatro merges atrás sem nenhum aviso. Cinco sessões tentaram corrigir escrevendo direto na Vercel e todas esbarraram em conector somente-leitura ou credencial rejeitada. O caminho que funciona já está mergeado no repositório (`sync-vercel-env.yml`, PR #21) e nunca rodou porque `VERCEL_TOKEN` não existe como secret do GitHub. É isso que o FORM-ZERO resolve.

## Regras que o plano impõe

- Uma fase por vez. WIP = 1.
- Nenhuma fase encerra com pendência.
- Cada gate é parada obrigatória — você valida e ajusta modelo/esforço antes da próxima.
- PR automático ao fim de cada fase, autorizado.
- `PLAN/state.json` + `GATE_LOG.md` no repositório: qualquer sessão nova retoma de onde a anterior parou.
- Lacuna permanece `A DEFINIR`. Nada é preenchido por inferência.
