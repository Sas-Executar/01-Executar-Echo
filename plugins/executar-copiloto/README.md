# EXECUTAR Copiloto — Claude Plugin

Plugin portátil do Copiloto EXECUTAR, extraído do runtime existente no repositório `Sas-Executar/01-Executar-Echo`.

## Componentes

- Agente: `executar-copiloto:copiloto`
- Skills: `/executar-copiloto:bomdia`, `/executar-copiloto:agora`, `/executar-copiloto:estado`, `/executar-copiloto:fechardia`, `/executar-copiloto:replanejamento`

## Uso no Cowork

No Claude, abra **Personalizar → Plugins** e use a opção de upload de plugin personalizado. Selecione o ZIP deste diretório. Os subagentes são executados no Cowork; as skills do plugin ficam disponíveis pelo menu `/`.

## Uso no Claude Code

Durante desenvolvimento:

```sh
claude --plugin-dir ./executar-copiloto-plugin
```

ou:

```sh
claude --plugin-dir ./executar-copiloto-plugin.zip
```

Validação oficial quando o Claude Code CLI estiver disponível:

```sh
claude plugin validate ./executar-copiloto-plugin --strict
```

## Estado funcional

A versão 0.1.0 é independente da interface SaaS e preserva o contrato operacional do Copiloto. As operações que no produto dependem de Prisma, autenticação e `workspaceId` continuam dependentes de um backend/MCP acessível. Sem esse backend, o plugin trabalha apenas com dados realmente disponíveis na sessão e não simula estado do SaaS.
