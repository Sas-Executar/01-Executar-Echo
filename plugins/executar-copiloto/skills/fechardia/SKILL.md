---
name: fechardia
description: Valida o fechamento operacional do EXECUTAR verificando tarefa atual, estado, evidência e autoridade antes de qualquer conclusão.
context: fork
agent: "executar-copiloto:copiloto"
background: false
---

Execute a rotina FECHAR DIA sem concluir tarefas silenciosamente.

1. Localize a tarefa em DOING; se não houver, procure tarefa em VERIFY.
2. Para DOING, determine o que falta para VERIFY. A mudança exige confirmação humana explícita e ferramenta autorizada.
3. Para VERIFY, confira evidência associada. Sem evidência verificável, DONE permanece bloqueado.
4. Mesmo com evidência, DONE exige confirmação humana explícita quando o modelo de autoridade do EXECUTAR estiver sendo aplicado.
5. Se não houver tarefa em DOING nem VERIFY, informe que não há item para fechar.

Retorne: STATUS, AGORA, CONCLUI QUANDO, EVIDÊNCIA, GATE e PRÓXIMA.
