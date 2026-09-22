# SCHEMA-RC-SOLUTION-004 — Agent Bundle

## Objetivo
Pacote de dados existente do **Mapa Cognitivo · TP-001 · RC-SOLUTION-001** para uso direto pelo agente.

**Não reconstruir o grafo a partir do Blog, BLOG-09, PRD ou inferências.**
Use os artefatos materializados deste pacote.

## Ordem de autoridade
1. `01_CANONICAL/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx`
2. `02_RUNTIME/graph_data.json`
3. `03_SCHEMA/graph_schema.json`
4. `04_TABLES/nodes.csv`
5. `04_TABLES/edges.csv`
6. `04_TABLES/solutions.csv`
7. `04_TABLES/evidence.csv`

## Cobertura verificada no pacote
- Nodes CSV: 237
- Edges CSV: 528
- Solutions CSV: 20
- Evidence CSV: 13
- graph_data.nodes: 237
- graph_data.edges: 528
- graph_data.solutions: 20
- graph_data.evidence: 13

## Regra metodológica
`Fator != Vulnerabilidade != Exposição != Risco`

Relações com `epistemic_class=E` são modelagem para navegação do grafo e não devem ser apresentadas como causalidade científica estabelecida.

## Estrutura
```text
SCHEMA-RC-SOLUTION-004_AGENT_BUNDLE/
├── 00_README_MANIFEST.md
├── 01_CANONICAL/
│   └── SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx
├── 02_RUNTIME/
│   └── graph_data.json
├── 03_SCHEMA/
│   └── graph_schema.json
├── 04_TABLES/
│   ├── nodes.csv
│   ├── edges.csv
│   ├── solutions.csv
│   └── evidence.csv
├── 05_DOCUMENTATION/
│   ├── README_SOURCE.md
│   └── DOC-0025_MASTER-INDEX-CHAT-001.md
└── CHECKSUMS.sha256
```

## Instrução para o agente
- Consumir `graph_data.json` como dataset integrado inicial.
- Validar contra `graph_schema.json`.
- Usar CSVs para inspeção, transformação e testes específicos.
- Usar o XLSX como artefato canônico legível por humanos.
- Usar `DOC-0025_MASTER-INDEX-CHAT-001.md` para proveniência e governança.
- Não regenerar os 237 nós ou 528 relações.
- Não substituir o dataset existente por um grafo derivado de BLOG-09.
- Ausência no GitHub não significa ausência do artefato.
