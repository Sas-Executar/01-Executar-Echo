# 05 — Handoff de Implementação

## Fonte da verdade
Prioridade de resolução:
1. `00_IDENTITY_CONTRACT.md`
2. `01_ADR-002_IDENTITY.md`
3. `02_TOKENS_CANONICAL.json`
4. `03_COMPONENT_CONTRACTS.md`
5. `04_WIREFRAMES_CANONICAL.md`

Qualquer material v1 é superseded.

## Implementação
1. aplicar tokens semânticos;
2. implementar light/dark;
3. estruturar layout;
4. implementar chrome;
5. implementar home;
6. implementar página de artigo;
7. implementar TOC;
8. implementar callouts/CTA;
9. validar teclado e leitores de tela;
10. validar performance;
11. QA visual.

## Regras obrigatórias
- nenhum hex em componente, exceto arquivo de tokens;
- nenhum token `apple-*`;
- nenhum blur em conteúdo;
- nenhum box-shadow em `ArticleCard`;
- `accent` não ultrapassa função de ênfase/estado;
- não usar mais de duas ações lado a lado em hero;
- body editorial sempre alinhado à esquerda;
- imagens reservam espaço;
- foco sempre visível;
- safe-area considerada no mobile.

## Web x plataforma Apple
Este handoff é para web. Ele traduz princípios visuais/comportamentais; não deve simular APIs nativas nem redistribuir recursos proprietários.

## Gate de implementação
A build só passa para `READY_FOR_QA` quando não houver:
- tokens duplicados;
- paletas alternativas;
- nova variante visual sem ADR;
- glass decorativo;
- dependência de cor para transmitir estado.
