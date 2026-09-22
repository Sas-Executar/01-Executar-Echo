# Provenance — Quick Frameworks EXECUTAR (23 registros)

## Fontes

1. `RC-KNW-001_QUICK_FRAMEWORKS_V1.zip` — 20 fichas FRC-01..20 (`01-conceitos/`)
   + matriz de rastreabilidade (`03-indices/MATRIZ_RASTREABILIDADE.csv`),
   entregue em 2026-09-22.
2. `RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1.zip` — 3 artigos completos
   (`01-artigos/`, `ARTICLE-RC-001/002/003`), cada um com Parte A (Quick
   Framework, 13 blocos) + Parte B (artigo longo, 12 seções), entregue em
   2026-09-22.

Os 24 arquivos em `sources/` (23 documentos + a matriz de rastreabilidade)
são cópia verbatim dos dois zips — nada foi editado antes de vendorizar.
`CHECKSUMS.sha256` fixa esse estado; regenerar o conteúdo a partir de outra
fonte quebra a verificação.

## `factor_id` já existente

As 20 fichas FRC-01..20 correspondem, pelo mesmo `factor_id`, às 20
`solutions[]` já vendorizadas em
`packages/knowledge/data/cognitive-map/graph_data.json`
(`SCHEMA-RC-SOLUTION-004`). Não é coincidência de nomenclatura: são a
explicação editorial dos mesmos 20 fatores que o Mapa Cognitivo já
materializa como dados. Nenhum `factor_id` novo foi inventado.

## Contradição de status, registrada e não resolvida por inferência

Os 3 artigos trazem, no próprio frontmatter da fonte,
`status: REDIGIDO_VALIDACAO_ESTRUTURAL` (redigido, pendente de validação
estrutural). Os stubs em `04-validacao/*.txt` de cada artigo, também
fornecidos no mesmo pacote, dizem `STATUS: VERIFIED`. As duas afirmações
vêm da fonte, não deste repositório, e se contradizem. `STATUS: VERIFIED`
é a alegação do pacote fornecido — não uma verificação independente feita
aqui. Publicados mesmo assim por decisão explícita do usuário em
2026-09-22 (ver `DECISION_LOG.md`), sem reescrever a fonte para eliminar
a contradição.

## Geração

`packages/knowledge/scripts/ingest-quick-frameworks.ts` lê os 24 arquivos
em `sources/` e escreve:
- `../records.json` — 23 registros Quick Framework (`quickFrameworkSchema`
  em `../../src/quick-frameworks.ts`).
- `packages/cms/content/blog/{risco-cognitivo,fatores-de-risco-cognitivo,
  exposicao-cognitiva}.mdx` — os 3 posts de blog, com slug tirado
  verbatim do campo `url:` de cada artigo-fonte.

Não é lido em runtime — só gera arquivos que são commitados, mesma
disciplina do bundle do Mapa Cognitivo.
