# Executar UI — Hierarquia de referência

Portado e reescrito da branch `chatgpt/scroll-task-prototype`
(`apps/app/public/scroll-task-prototype/`, um protótipo estático
HTML/CSS/JS isolado, nunca mergeado) como parte do plano Scroll+Scanner
P0 — a tese de design permanece a mesma; toda referência a hex cru do
protótipo foi trocada pela camada semântica real (`@repo/design-tokens`,
consumida via classe Tailwind, nunca valor literal — ADR-DS-001). A
ramp de espaçamento e as regras do modo de execução abaixo descrevem o
que está de fato implementado em `apps/app/app/(authenticated)/scroll/`,
não o protótipo.

## Regra de composição

O Executar não mistura Apple HIG, Geist e Fluent como três estilos
visuais equivalentes. A hierarquia obrigatória é:

1. **Apple HIG — comportamento e UX**
   - hierarquia clara;
   - alvos de toque de pelo menos 44 × 44 CSS px;
   - feedback imediato de estado;
   - acessibilidade;
   - navegação previsível;
   - redução de movimento quando solicitado pelo sistema
     (`prefers-reduced-motion`).

2. **Geist — identidade visual**
   - tipografia e densidade;
   - superfícies neutras;
   - bordas discretas;
   - contraste alto;
   - linguagem minimalista e funcional.

3. **Fluent 2 — hierarquia operacional**
   - espaçamento em ramp de base 4 px;
   - proximidade para indicar relação entre informações;
   - espaço negativo para separar grupos e aumentar foco;
   - baseline e hierarquia tipográfica consistentes;
   - um único botão primário por contexto;
   - ações secundárias com menor peso visual.

## Ramp de espaçamento

A ramp real (`packages/design-tokens/src/spacing.ts`, px):
`0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

O protótipo original usava uma ramp própria em hex/px cru
(`4, 8, 12, 16, 20, 24, 32, 40, 48, 56`) sem correspondência direta com
a ramp real — a tradução arredonda cada degrau pro mais próximo abaixo,
mudança consciente, não silenciosa:

| Protótipo | Ramp real |
|---|---|
| 20 | 16 |
| 40 | 32 |
| 56 | 48 |

## Cor informacional

- Verde (`status.success` / `text-success` / `bg-success`) é a cor de
  informação positiva e progresso operacional no modo de execução.
- Aplicar em progresso, contador de pendentes, número da posição atual.
- Não usar somente cor para comunicar estado: sempre combinar com
  texto, número ou rótulo (`scroll-task-slide.tsx`'s contador de
  posição/pendentes faz isso — nunca cor isolada).
- O botão primário permanece neutro (`bg-primary`, não verde); verde
  não transforma todo controle em ação primária.
- Foco (`ring-ring`/`focus`) fica azure, não verde — o protótipo também
  seguia essa regra (`--focus` ≠ `--green` no seu próprio CSS).

## Regras do modo de execução — implementadas

- Superfície de execução full-height dentro do container autenticado
  (`h-[80vh]`, não a viewport inteira — o container reutiliza o chrome
  autenticado já existente do app, não substitui).
- Uma única unidade recebe foco visual e controles interativos por vez
  (`isActive`, `scroll-task-slide.tsx`).
- Scroll vertical nativo com snap por unidade
  (`scroll-snap-type: y proximity`, `scroll-snap-align: start`).
- Operável por touch, mouse e teclado (Arrow/PageUp/PageDown,
  `scroll-task-view.tsx`).
- **Scroll não implica conclusão.** Rolar/trocar de unidade nunca
  chama `completeAction` por si só — só um clique explícito no botão
  de ação primária (`scroll-complete-button.tsx`) persiste uma
  transição real.
- **Auto Mode nunca conclui.** Ao esgotar o timer com Auto Mode ligado,
  apenas avança pra próxima unidade — nunca chama a ação persistida
  (`scroll-auto-mode-timer.tsx`, testado em
  `packages/domain/__tests__/scroll-task-state.test.ts`).
- Pendentes são derivados do tamanho real da fila retornada pelo
  servidor (`units.length - index`), nunca um valor decorativo.

## Regras do modo de execução — fora desta leva (disclosurado, não implementado)

- Preferência "Concluir ao avançar" (completar por scroll manual) do
  protótipo — não portada. Completar é sempre por clique explícito.
- Apresentação alternativa em Lista (checkbox por linha, agrupada por
  fase) como um *toggle* do mesmo Scroll — não existe. O que existe de
  fato é `/now` (uma superfície separada, já real, mostrando a mesma
  fila elegível sem scroll) — ver ADR-EXEC-UI-002.
- Persistência de preferências de sessão (Auto Mode ligado por padrão,
  etc.) entre sessões — local ao componente, perdida ao recarregar.
- Instalação/funcionamento offline de PWA — não existe manifesto nem
  service worker neste app.
- Fases/workflows concluídos quando todas as tarefas subjacentes
  concluem — não modelado neste nível no schema real
  (`packages/schemas` não tem rollup de fase/workflow); fora de escopo.

## Mobile

- Superfícies mobile reais deste produto são as telas Expo em
  `apps/mobile` (M08+), não uma versão responsiva desta página web —
  este arquivo descreve apenas o contrato da superfície web
  (`apps/app`).
- Dentro da superfície web, evitar barra inferior pesada para uma
  única ação; controles ficam junto ao conteúdo do slide ativo.
- **Pendente**: QA manual em viewport estreito/touch real — não
  verificado nesta leva (typecheck/lint/testes automatizados de
  componente rodaram, não um navegador real).

## Princípio visual

A interface deve parecer um único produto Executar. HIG orienta
comportamento, Geist define a linguagem visual e Fluent organiza
hierarquia, espaçamento e comandos; nenhuma referência deve aparecer
como cópia visual literal de outro produto.
