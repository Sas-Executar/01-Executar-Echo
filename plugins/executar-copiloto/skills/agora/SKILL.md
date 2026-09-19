---
name: agora
description: Resolve o trabalho atual do EXECUTAR com WIP=1 e mostra somente a próxima ação elegível, critérios e evidência disponível.
context: fork
agent: "executar-copiloto:copiloto"
background: false
---

Execute a rotina AGORA sobre o estado realmente acessível nesta sessão.

1. Localize uma tarefa em DOING. Se existir, ela é o foco atual por WIP=1.
2. Se não existir, identifique tarefas elegíveis cujas dependências estejam satisfeitas e selecione a próxima somente a partir de critérios presentes nas fontes.
3. Se houver empate sem critério suficiente, não arbitre silenciosamente: retorne decisão humana necessária.
4. Não invente duração, Definition of Done ou evidência. Use A DEFINIR quando a fonte não trouxer o dado.
5. Não altere DOING/VERIFY/DONE sem confirmação humana explícita e ferramenta autorizada.

Retorne apenas: AGORA, TEMPO, CONCLUI QUANDO, EVIDÊNCIA e PRÓXIMA.
