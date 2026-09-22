# ADR-EXEC-UI-001 — Contrato de interface do modo de execução (Scroll)

| Campo | Valor |
|---|---|
| **Status** | Aceito — implementado em `apps/app/app/(authenticated)/scroll/` |
| **Relacionado** | APP-SCR-001, ADR-DS-001, ADR-EXEC-UI-002 |
| **Data** | 2026-09-21 |

## Contexto

Uma decisão de design para o modo de execução por scroll — hierarquia
projeto → posição → ação principal, ramp de espaçamento base 4px, ação
primária única por superfície, verde como cor informacional nunca
isolada — existia apenas como protótipo estático isolado (HTML/CSS/JS
puro, `apps/app/public/scroll-task-prototype/`, branch
`chatgpt/scroll-task-prototype`, nunca mergeada), registrada lá em ADRs
próprios (`ADR-EXEC-UI-001`/`002` daquela branch) que documentam a
aprovação e os testes de UM deploy estático específico — não o
componente React real que roda em produção.

Este ADR **porta e reescreve** a tese daquela decisão (não copia os
ADRs originais cru): mantém a hierarquia HIG/Geist/Fluent e as regras
comportamentais, mas descreve o que está de fato implementado no
componente real, com a camada de tokens real (nunca os valores hex
próprios do protótipo) e sem herdar evidências de verificação que não
correspondem a este código (deploy URL, commits, testes Playwright do
protótipo).

## Decisão

1. Aplicar a hierarquia de composição de `packages/design-system/
   EXECUTAR-UI-RULES.md` (HIG=comportamento, Geist=identidade visual,
   Fluent=hierarquia operacional) ao modo de execução por scroll.
2. Uma única unidade recebe foco visual e controles interativos por
   vez; scroll nativo com snap, operável por touch/mouse/teclado.
3. **Scroll nunca implica conclusão por padrão** — completar uma
   unidade exige clique explícito na ação primária, que persiste de
   verdade (`completeAction`, via `scroll-complete-button.tsx`), nunca
   um efeito colateral de rolar.
4. Auto Mode pode avançar automaticamente ao esgotar o timer, mas nunca
   marca uma unidade como concluída — apenas avança
   (`scroll-auto-mode-timer.tsx`, garantia testada em
   `packages/domain/__tests__/scroll-task-state.test.ts`).
5. Alvos mínimos de 44 CSS px, foco visível, nomes acessíveis,
   `prefers-reduced-motion` respeitado (`use-prefers-reduced-motion.ts`).
6. Extensão futura deste contrato a outras rotas autenticadas do
   EXECUTAR é o objetivo de longo prazo do design decidido, mas **não**
   está implementada fora de `/scroll` nesta leva — mudanças que
   contrariem esta decisão exigem um ADR que a referencie e substitua
   explicitamente, não uma reescrita silenciosa.

## O que mudou em relação ao protótipo original

- Nenhum valor hex cru: toda cor/espaçamento vem de
  `@repo/design-tokens` via classe Tailwind semântica (`bg-background`,
  `text-foreground`, `text-success`, etc.) — ver a tabela de mapeamento
  em `packages/design-system/EXECUTAR-UI-RULES.md`.
- A ramp de espaçamento do protótipo (`4,8,12,16,20,24,32,40,48,56`) foi
  trocada pela ramp real (`0,4,8,12,16,24,32,48,64,96,128`), arredondada
  pro degrau mais próximo abaixo — mudança consciente, documentada.
- O protótipo tinha uma preferência "concluir ao rolar manualmente"
  (scroll-driven completion opcional). **Não foi portada** — este
  contrato é mais estrito: scroll nunca conclui, sob nenhuma
  configuração, nesta implementação.
- Estado real (Task.state) vem do Postgres via `completeAction`, não de
  `localStorage` — o protótipo persistia tudo no navegador
  (`executar-scroll-v7`); este app não tem esse mecanismo nem precisa
  dele.

## Verificação

- `tsc --noEmit` limpo em `apps/app`.
- `bunx ultracite check` limpo (0 achados; 2 exceções de a11y
  documentadas via `biome-ignore` com justificativa técnica).
- Suíte `apps/app/__tests__/scroll-task-view.test.tsx` (8 casos, jsdom/
  Vitest): início em 1 clique, persistência real por estado
  (READY→DOING, DOING→VERIFY, VERIFY→DONE com evidência exigida),
  Adiar local-only, expandir só quando ativo.
- `packages/design-tokens`'s `check:drift` limpo; `grep` por hex cru
  nos arquivos alterados retornou vazio.
- **Pendente** (não executado nesta leva): QA manual em navegador real
  — scroll/swipe físico, teclado em dispositivo real, leitor de tela,
  `prefers-contrast`, viewports móveis reais. Os testes automatizados
  acima verificam o componente, não substituem essa verificação manual
  — per a "maturity ladder" do `AGENTS.md` deste repositório.

## Consequências

A decisão de design deixa de existir só como protótipo isolado — o
componente que roda em `/scroll` agora reflete a hierarquia HIG/Geist/
Fluent e as regras de conclusão-nunca-por-scroll, com persistência real
no banco. A extensão a outras rotas continua como trabalho futuro,
explicitamente fora desta leva.
