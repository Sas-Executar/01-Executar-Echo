# Executar Safe Frameworks

Pacote de Agent Skill para selecionar, combinar e aplicar frameworks analíticos com rastreabilidade de evidências.

## Contrato operacional
- ID: `SKILL-EXE-SF-001`
- Versão: `1.0.0`
- Owner: `A DEFINIR`
- Status: `READY_FOR_INSTALLATION`
- Automação: `A4` quando web search, leitura de arquivos e execução de código estiverem disponíveis.
- Escopo: pesquisa externa, análise de documentos, seleção de frameworks, aplicação, síntese e verificação.
- Fora de escopo: inventar dados ausentes, substituir fontes por frameworks, executar decisões externas sem autorização.

## Arquitetura
A Skill segue progressive disclosure: o `SKILL.md` contém somente o workflow central; políticas especializadas, catálogo, templates, exemplos e avaliações são carregados sob demanda. O catálogo é consultado preferencialmente por script para evitar inserir centenas de registros no contexto.

## Instalação
### Claude Code
Pessoal: `~/.claude/skills/executar-safe-frameworks/`
Projeto: `.claude/skills/executar-safe-frameworks/`

### claude.ai / API
Compacte a pasta como ZIP e faça upload como custom Skill conforme a superfície utilizada.

## Fontes de arquitetura consultadas
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool

## Validação local
`python scripts/validate_catalog.py`

`python scripts/select_frameworks.py --intent "entender mercado e concorrência de um novo produto" --limit 8`

`python scripts/validate_report.py examples/market-analysis.md`
