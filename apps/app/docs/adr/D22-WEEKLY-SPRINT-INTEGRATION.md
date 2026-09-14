# D22 — Weekly Sprint / Scroll integration

Status: IMPLEMENTADO NO PACOTE DE MIGRAÇÃO; release/deploy de produção deve permanecer sujeito a build e validação.

## Origem normativa

- `03-Exe-Governance` · `D22-DEC-001` — padrão canônico de interface do EXECUTAR.
- branch canônica `chatgpt/scroll-task-prototype`.
- `ADR-EXEC-UI-001.md`, `ADR-EXEC-UI-002.md` e `ui-contracts.md`.
- `packages/design-system/EXECUTAR-UI-RULES.md`.

## Aplicação no Weekly Sprint

A adaptação preserva o conteúdo normativo do sprint e altera a camada de apresentação para o padrão EXECUTAR:

- navegação lateral persistente em desktop e drawer no mobile;
- modos Lista e Foco/Scroll sobre o mesmo estado;
- lista convencional com checkbox explícito e grupos por dia;
- foco full-screen com uma ação por unidade, scroll vertical com snap, anterior/próxima, timer e Auto Mode;
- conclusão por scroll desativada por padrão e opcional apenas no avanço manual;
- teclado, botões, Auto Mode e fim do timer não concluem silenciosamente;
- preferências, notas e conclusões persistidas localmente;
- alvos mínimos de 44 CSS px, safe areas, foco visível, redução de movimento, maior contraste e forced-colors;
- verde como cor informacional de progresso, com semântica textual associada;
- `/ops` convergente com a mesma linguagem visual;
- `/print` isolado da UI interativa para preservar a composição determinística A4 landscape/16:9.

## Rotas da adaptação

- `/` — restaura preferência Lista/Foco;
- `/tarefas` — Lista;
- `/foco` — Foco/Scroll;
- `/configuracoes` — preferências;
- `/ops` — operação;
- `/print` — impressão/PDF.

## Separação de estado

Conclusões e notas da interface são estado local do usuário e não alteram `current.yaml`, evidências, manifests ou o estado do pipeline server-side. A fonte operacional continua sendo o sprint validado pelo backend.

## Release gate

Antes de promover para produção: instalar dependências, executar build Next.js, testes de contrato, validação responsiva/browser e smoke test das rotas operacionais e cron protegidas.