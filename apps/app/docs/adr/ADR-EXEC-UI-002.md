# ADR-EXEC-UI-002 — Múltiplas superfícies de execução, um único estado

| Campo | Valor |
|---|---|
| **Status** | Aceito — reflete o que já é verdade em `apps/app` |
| **Relacionado** | ADR-EXEC-UI-001, APP-SCR-001, M04-T02/T03 |
| **Data** | 2026-09-21 |

## Contexto

O protótipo original (`chatgpt/scroll-task-prototype`, ver
ADR-EXEC-UI-001) registrava, em seu próprio `ADR-EXEC-UI-002`, uma
apresentação alternativa em **Lista** (checkbox por linha, agrupada por
fase) como um segundo modo do mesmo componente de scroll, com rotas
próprias (`/tarefas`, `/foco`, `/configuracoes`) e uma chave de
`localStorage` compartilhada entre os dois modos.

Esse Lista mode nunca foi construído neste app real — não está no
escopo desta leva (Scroll+Scanner P0) nem foi pedido. Portar esse ADR
"reescrito apenas trocando hex" seria descrever uma funcionalidade que
não existe, o que este ADR evita deliberadamente (ver o princípio da
"maturity ladder" do `AGENTS.md` deste repositório: não descrever
código como mais pronto do que a evidência de verificação sustenta).

O que **de fato já existe e é verdade**, e que este ADR registra em vez
disso, é algo com a mesma tese de fundo do protótipo — duas superfícies
de execução, um único estado — só que real:

- **`/now`** (`apps/app/app/(authenticated)/now/page.tsx`,
  já existente antes desta leva): mostra a **próxima ação elegível**
  (`nextAction()`, WIP=1), sem scroll — uma unidade por vez, decidida
  pelo servidor.
- **`/scroll`** (`apps/app/app/(authenticated)/scroll/`, reescrito
  nesta leva): mostra a **mesma fila elegível** (READY + a tarefa WIP,
  `rankEligibleTasks`/`nextAction`'s própria checagem de `DOING`), como
  uma sequência navegável por scroll/teclado.

## Decisão

1. `/now` e `/scroll` são duas apresentações da **mesma fonte de
   verdade** — mesma tabela `Task`, mesma `completeAction`, mesmas
   regras de transição (`TASK_STATE_TRANSITIONS`, `@repo/schemas`).
   Nenhuma das duas duplica lógica de elegibilidade ou de transição de
   estado — ambas chamam os mesmos pontos de `packages/application`/
   `packages/domain` já existentes.
2. Navegar em qualquer uma das duas superfícies nunca conclui uma
   tarefa por si só — conclusão é sempre uma ação explícita do usuário,
   com evidência exigida antes de `DONE` em ambas
   (`now/components/task-actions.tsx` e `scroll/scroll-complete-
   button.tsx` compartilham o mesmo padrão `completeAction` +
   `useTransition`, deliberadamente).
3. Não existe hoje uma preferência de apresentação persistida nem uma
   Lista mode como variação do próprio Scroll — `/now` e `/scroll` são
   rotas distintas, cada uma sua própria página, não um toggle de
   estado de um componente único.
4. Extensão futura para uma apresentação em Lista real (checkbox por
   linha) — se decidida — deve reusar exatamente os mesmos pontos de
   `packages/application`/`completeAction` que `/now` e `/scroll` já
   usam, não uma terceira lógica de estado.

## O que muda em relação ao ADR do protótipo

- Sem rotas `/tarefas`, `/foco`, `/configuracoes`, sem `localStorage`
  compartilhado — o equivalente real é `/now` (lista de 1) e `/scroll`
  (sequência navegável), cada uma sua própria página Next.js, estado no
  Postgres.
- Sem alegação de PWA instalável/offline — não existe manifesto nem
  service worker neste app.
- Sem preferência de "concluir ao avançar por scroll" — nenhuma das
  duas superfícies completa por navegação, sob nenhuma configuração
  (mais estrito que o protótipo original, ver ADR-EXEC-UI-001).

## Verificação

- Leitura direta do código: `now/page.tsx` chama `nextAction()`;
  `scroll/page.tsx` chama `rankEligibleTasks()` + a mesma checagem de
  tarefa `DOING` que `nextAction()` já faz internamente — confirmado
  lendo `packages/application/src/next-action.ts`.
- `now/components/task-actions.tsx` e `scroll/scroll-complete-
  button.tsx` chamam a mesma `apps/app/app/actions/execution/
  complete-action.ts`, com o mesmo requisito de evidência antes de
  `DONE` — confirmado por leitura e pelos testes de
  `scroll-task-view.test.tsx`.
- **Pendente**: não há teste automatizado cross-superfície verificando
  que uma conclusão em `/scroll` se reflete em `/now` (e vice-versa) na
  mesma sessão de navegador — seria coberto por um teste e2e
  (Playwright, `apps/app/e2e/`), não construído nesta leva.

## Consequências

Este ADR substitui a tese "Lista mode como variação do Scroll" do
protótipo original por uma tese mais simples e já verdadeira: duas
rotas distintas, um único backend de estado. Uma Lista mode real, se
decidida no futuro, tem um caminho claro de implementação (reusar
`packages/application`/`completeAction`), mas não é prometida por este
ADR.
