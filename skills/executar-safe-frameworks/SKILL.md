---
name: executar-safe-frameworks
description: Seleciona, combina e aplica frameworks de estratégia, mercado, produto, operações, pesquisa, finanças, pessoas, dados, UX, engenharia, vendas e demais áreas para transformar perguntas, pesquisas, relatórios e documentos em análises estruturadas, concisas e rastreáveis. Use quando o usuário quiser compreender um objeto, mercado, negócio, produto, decisão ou documento por meio de frameworks; pedir SWOT, PESTEL, PMF, 5W2H ou modelos equivalentes; ou converter informação extensa em relatório orientado por evidências. Determina intent, pesquisa na web quando necessário, justifica tecnicamente a seleção, separa fatos de inferências e não preenche lacunas sem evidência.
---

# Executar Safe Frameworks

## Objetivo
Transformar uma pergunta, objeto de pesquisa ou corpus documental em uma leitura estruturada por frameworks adequados ao objetivo real do usuário. A Skill escolhe o menor conjunto suficiente de frameworks, justifica tecnicamente a seleção, organiza evidências e produz um relatório padronizado, rastreável e compacto.

## Princípios invariantes
1. Framework organiza evidência; não cria evidência.
2. Descobrir primeiro o intent e o objeto; escolher frameworks depois.
3. Usar o menor conjunto suficiente. Normalmente 2–5 frameworks; ampliar somente quando a complexidade exigir.
4. Evitar frameworks redundantes ou sobrepostos sem justificativa explícita.
5. Não preencher células, quadrantes ou métricas com suposições silenciosas.
6. Separar claramente FATO, INFERÊNCIA, HIPÓTESE, CONFLITO e GAP.
7. Toda afirmação externa mutável deve ser sustentada por fonte atual e aplicável.
8. Documentos do usuário são evidência primária para fatos internos; web search serve para contextualizar, verificar conceitos e confrontar fatos externos.
9. Quando fontes divergem, registrar a divergência e o impacto; não escolher silenciosamente um lado.
10. Preservar escopo temporal, geográfico, populacional e organizacional da evidência.

## Rotas de intent
Classifique a solicitação em uma ou mais rotas antes de executar:
- RESEARCH_TO_FRAMEWORK: pesquisar um objeto e explicá-lo por frameworks.
- DOCUMENT_TO_FRAMEWORK: converter documentos fornecidos em estruturas analíticas.
- HYBRID: combinar documentos do usuário com pesquisa externa.
- FRAMEWORK_SPECIFIC: aplicar um framework explicitamente solicitado.
- DECISION_SUPPORT: comparar opções ou estruturar uma decisão.
- LEARNING_VIEW: explicar um tema usando frameworks como dispositivo de compreensão.

Leia [references/intent-routing.md](references/intent-routing.md) quando o intent for ambíguo ou houver múltiplas rotas.

## Workflow obrigatório
### 1. Definir o objeto
Extraia ou determine: objeto, pergunta central, decisão a apoiar, público, período, geografia, unidade de análise, restrições e evidências disponíveis. Não interrompa por lacunas não críticas; declare premissas operacionais. Pergunte ao usuário apenas quando uma lacuna muda materialmente a análise e não pode ser tratada por cenários.

### 2. Inspecionar entradas
Se houver arquivos, relatórios, planilhas, PDFs ou notas, leia-os antes de pesquisar. Extraia fatos, métricas, decisões, datas, atores, relações causais alegadas e lacunas. Para conversão documental, leia [references/document-conversion.md](references/document-conversion.md).

### 3. Construir plano de evidência
Defina quais afirmações precisam de confirmação externa, quais são internas e quais são apenas hipóteses. Para fatos atuais, mercado, legislação, preços, concorrência, tecnologia, padrões ou estatísticas, use web search quando disponível. Siga [references/research-protocol.md](references/research-protocol.md) e [references/evidence-policy.md](references/evidence-policy.md).

### 4. Gerar candidatos de frameworks
Primeiro determine quais lentes são necessárias: ambiente externo, competição, capacidades internas, cliente, mercado, produto, economia, risco, processo, execução, experiência, tecnologia, decisão ou aprendizado.

Quando execução de código estiver disponível, rode:
`python scripts/select_frameworks.py --intent "<descrição do objetivo>" --limit 10`

O script gera shortlist determinística; ele não substitui julgamento técnico. Para regras de composição, leia [references/framework-selection.md](references/framework-selection.md). O catálogo completo está em [catalog/frameworks.jsonl](catalog/frameworks.jsonl) e o mapa dos 23 domínios em [catalog/domains.json](catalog/domains.json).

### 5. Selecionar o conjunto mínimo suficiente
Escolha frameworks que respondam perguntas diferentes e complementares. Para cada selecionado, registre:
- qual pergunta ele responde;
- por que é adequado ao objeto;
- quais evidências existem para preenchê-lo;
- qual risco de mau uso existe;
- quais frameworks candidatos foram descartados por redundância ou baixa adequação.

### 6. Pesquisar e preencher
Pesquise de forma iterativa. Prefira fontes primárias e atuais. Não use snippet de busca como prova final quando a página-fonte estiver disponível. Extraia apenas informação necessária para os campos do framework. Cada conclusão deve ser rastreável à evidência que a suporta.

### 7. Aplicar frameworks
Para cada framework:
1. declare objetivo e pergunta;
2. liste inputs/evidências;
3. preencha somente campos suportados;
4. marque `A DEFINIR` ou `EVIDENCE_GAP` quando faltarem dados;
5. diferencie observação de interpretação;
6. registre limitações e escopo;
7. produza a leitura sintética do framework.

### 8. Cruzar frameworks
Procure convergências, tensões, dependências e lacunas entre os frameworks. Uma conclusão transversal deve indicar quais frameworks e evidências a sustentam. Não trate repetição de uma mesma fonte em vários frameworks como confirmação independente.

### 9. Verificar
Antes da entrega, execute os quality gates de [references/quality-gates.md](references/quality-gates.md). Quando aplicável, rode `python scripts/validate_report.py <arquivo.md>`.

### 10. Entregar relatório
Use por padrão o formato de [templates/framework-report.md](templates/framework-report.md). Para relatórios curtos, preserve pelo menos: Objeto e Intent, Base de Evidências, Frameworks Selecionados + Justificativa, Análise, Síntese Cruzada, Gaps/Conflitos e Fontes.

## Política de proatividade
- Não espere que o usuário escolha frameworks quando o objetivo puder ser inferido com segurança.
- Proponha e aplique a combinação adequada, explicando o porquê.
- Quando uma pesquisa ampla puder ser decomposta em lentes, faça a decomposição automaticamente.
- Se a combinação inicial ficar insuficiente após a pesquisa, substitua ou acrescente framework e registre a mudança.
- Se um framework popular for inadequado ao caso, não o use apenas por familiaridade.

## Regras anti-alucinação
- Nunca inventar números, market share, TAM, concorrentes, preços, datas, riscos, requisitos ou sentimentos de clientes.
- Nunca transformar ausência de evidência em conclusão negativa.
- Nunca inferir causalidade apenas por correlação sem base adequada.
- Nunca ocultar conflito entre documento interno e fonte externa.
- Nunca atribuir a uma fonte algo que ela não sustenta.
- Nunca produzir precisão numérica falsa a partir de estimativas qualitativas.
- Quando não houver evidência suficiente, reduzir a força da conclusão e registrar o gap.

## Saída padrão
A entrega deve privilegiar leitura rápida, especialmente em telas pequenas:
- resumo executivo curto;
- tabela de seleção dos frameworks;
- um bloco compacto por framework;
- síntese cruzada;
- gaps, conflitos e próximos dados necessários;
- fontes próximas às afirmações que sustentam.

Leia [references/report-standard.md](references/report-standard.md) para o contrato completo.

## Catálogo e domínios
A biblioteca usa IDs `FW-DNN-NNN` e um único domínio proprietário por framework. Correlações com outros domínios são referências, não duplicatas. Os domínios D01–D23 estão definidos em [catalog/domains.json](catalog/domains.json). Para buscar pelo nome/alias/objetivo, use `scripts/select_frameworks.py` em vez de carregar o catálogo inteiro no contexto.

## Scripts
- [scripts/select_frameworks.py](scripts/select_frameworks.py): shortlist lexical e por regras de intent.
- [scripts/validate_catalog.py](scripts/validate_catalog.py): valida IDs, domínios, duplicidades, descrições e referências.
- [scripts/validate_report.py](scripts/validate_report.py): verifica seções mínimas e marcadores de rastreabilidade do relatório.

## Templates e exemplos
- [templates/framework-report.md](templates/framework-report.md)
- [templates/evidence-ledger.csv](templates/evidence-ledger.csv)
- [templates/framework-card.md](templates/framework-card.md)
- [examples/market-analysis.md](examples/market-analysis.md)
- [examples/document-conversion.md](examples/document-conversion.md)
- [evals/evals.json](evals/evals.json)

## Critério de DONE
DONE exige: intent identificado; evidência inspecionada; frameworks selecionados com justificativa; campos sem evidência marcados; análise cruzada realizada; fontes e conflitos registrados; relatório entregue no schema; quality gates aprovados ou falhas explicitadas.
