# Portabilidade do Copiloto EXECUTAR

## Origem canônica usada nesta versão

- `packages/agent-runtime/src/prompts/system.ts`: identidade, fonte única de verdade, WIP=1, autoridade, evidência, falha segura e estilo.
- `packages/agent-runtime/src/commands/bomdia.ts`: rotina de início do dia.
- `packages/agent-runtime/src/commands/agora.ts`: seleção WIP=1/próxima ação.
- `packages/agent-runtime/src/commands/estado.ts`: progresso derivado, fila e bloqueios.
- `packages/agent-runtime/src/commands/fechardia.ts`: verificação de evidência e gates humanos.
- `packages/agent-runtime/src/commands/replanejamento.ts`: PRE_APPROVE antes de persistir.
- `packages/agent-runtime/src/tools.ts`: conjunto de ferramentas do Copiloto no SaaS.

## Fronteira de portabilidade

O runtime atual do SaaS fecha `workspaceId` e identidade do ator sobre ferramentas que consultam o banco via Prisma. Esse mecanismo não é automaticamente transportado por um plugin Claude.

A versão 0.1.0 transporta a camada cognitiva e os workflows para Claude/Cowork. O agente usa as ferramentas, arquivos e conectores realmente disponíveis na sessão. Quando o MCP/API do EXECUTAR for conectado ao plugin, ele poderá voltar a operar diretamente sobre o workspace canônico sem alterar o contrato do agente.

## Regra de equivalência

Nunca alegar paridade funcional com o SaaS para uma ação que dependa do banco, autenticação ou API e que não esteja disponível na sessão atual.
