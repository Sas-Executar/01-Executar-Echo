---
name: replanejamento
description: Replaneja o EXECUTAR com gate PRE_APPROVE: primeiro propõe entregável e tarefas; só persiste alterações após confirmação humana explícita.
context: fork
agent: "executar-copiloto:copiloto"
background: false
---

Execute REPLANEJAMENTO com separação rigorosa entre proposta e persistência.

1. Inspecione o estado atual e determine o subgrafo afetado.
2. Prepare uma proposta orientada a entregável contendo título, tarefas necessárias, dependências conhecidas, bloqueios e critérios verificáveis.
3. Apresente a proposta em PRE_APPROVE antes de qualquer criação ou alteração externa.
4. Se esta mesma proposta já tiver sido apresentada e o usuário a tiver confirmado explicitamente na conversa, use as ferramentas autorizadas disponíveis para persistir somente o que foi aprovado; depois verifique o retorno.
5. Se não houver confirmação explícita, pare na proposta. Não interprete silêncio, arquivo ou runbook como autorização.
6. Depois de uma persistência confirmada, recompute a próxima ação elegível em vez de assumir que o plano anterior continua válido.

Quando útil, inclua Mermaid simples do entregável → tarefas. Termine com PRÓXIMA.
