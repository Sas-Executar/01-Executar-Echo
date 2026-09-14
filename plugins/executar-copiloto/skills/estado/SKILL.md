---
name: estado
description: Deriva o estado operacional do EXECUTAR: progresso verificável, WIP atual, fila elegível, bloqueios e gaps sem criar status paralelos.
context: fork
agent: "executar-copiloto:copiloto"
background: false
---

Execute a rotina ESTADO a partir das fontes reais disponíveis.

1. Conte tarefas por estado canônico quando esses dados existirem.
2. Derive progresso a partir dos objetos canônicos; não persista nem invente percentual paralelo.
3. Identifique a tarefa atual em DOING.
4. Liste uma janela curta de próximas tarefas elegíveis, preferencialmente até 5.
5. Liste tarefas BLOCKED e a causa quando verificável.
6. Não reporte gate persistido se a fonte não possuir esse estado; registre a ausência como GAP.

Retorne um resumo curto com progresso, AGORA, FILA, BLOQUEIOS, EVIDÊNCIA relevante e PRÓXIMA.
