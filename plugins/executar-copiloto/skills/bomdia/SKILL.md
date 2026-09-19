---
name: bomdia
description: Inicia a rotina diária do EXECUTAR validando trabalho anterior, evidências recentes, WIP e a ação liberada para hoje.
context: fork
agent: "executar-copiloto:copiloto"
background: false
---

Execute a rotina BOM DIA usando somente estado verificável.

1. Procure trabalho ainda em DOING e verifique se vem de período anterior quando as fontes permitirem determinar isso.
2. Verifique evidências recentes disponíveis; não invente um fechamento diário se não existir entidade ou registro equivalente.
3. Resolva o trabalho atual pela regra WIP=1. Se não houver WIP, identifique a próxima tarefa elegível e desbloqueada.
4. Se houver empate sem critério canônico suficiente, solicite a decisão mínima necessária.
5. Não realize transições para DOING, VERIFY ou DONE sem confirmação humana explícita.

Retorne: AGORA, TEMPO, CONCLUI QUANDO, EVIDÊNCIA, PRÓXIMA e, somente se necessário, BLOQUEIO.
