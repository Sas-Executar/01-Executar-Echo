---
tipo: "Schema"
status: "Rascunho"
cssclasses:
  - obsidian-editorial
---

# Governança · MASTER-INDEX-CHAT-001

> [!info] Fonte
> Documento de origem: `M04/DOC-0025__Custo-cogn-schema-Dados-Produto-SCHEMA-RC-SOLUTION-004-md.export.txt` (DOC-0025)

DOCUMENT READER · VALU-MODE V3

ID              MASTER-INDEX-CHAT-001  
Tipo            Governança · Master Index de artefatos  
Owner           Não determinado  
Versão          1.0  
Data            05/09/2026  
Fase            Consolidado  
Projeto         Mapa Interativo de Risco Cognitivo  
PARA            Design · Dados · Engenharia · Vercel  
Referência      Artefatos produzidos nesta conversa  
3#              #MasterIndex #CognitiveMap #Implementation

RESUMO EXECUTIVO

O quê            Índice consolidado dos artefatos efetivamente produzidos nesta conversa  
Por quê          Manter rastreabilidade entre conceito → dados → implementação → deploy  
Quem             Design · Dados · Engenharia  
Como             3 colunas: arquivo · função · próximo passo

3P+N · APLICAÇÃO

Problema         Os artefatos foram produzidos em diferentes etapas do workflow  
Processo         Consolidação por função e dependência  
Progresso        12 artefatos principais identificados  
Next 01          Usar o ZIP/schema como fonte canônica para evolução do mapa  
Next 02          Versionar o código final em repositório Git conectado ao Vercel  
Next 03          Fechar QA e promover a versão final para produção

|   |   |   |
|---|---|---|
|Arquivo|Função de uso|Próximo passo|
|a_clean_medical_technical_illustration_scene_a_la_1.png|Mockup anatômico inicial em perfil lateral; definiu câmera, profundidade e linguagem científica para a exploração visual.|Manter como referência visual histórica; não usar como dataset nem como contrato de UI.|
|a_wide_clean_infographic_poster_cognitive_map_s_1.png|Primeira composição 16:9 do Mapa Cognitivo, conectando corpo/cérebro, percepção, atenção, memória, linguagem, emoção, funções executivas, decisão e ação.|Refazer a composição usando o novo modelo de 7 anéis e o grafo relacional completo.|
|[README.md](sandbox:/mnt/data/rc_cognitive_graph_v1/README.md?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Documento de entrada do pacote SCHEMA-RC-SOLUTION-004; registra arquitetura, cobertura, regras metodológicas e maturidade das soluções.|Manter sincronizado com cada nova versão do schema e do catálogo de intervenções.|
|[nodes.csv](sandbox:/mnt/data/rc_cognitive_graph_v1/nodes.csv?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Registro canônico dos 237 nós: pessoa, objetivo, ambiente, sentidos, estados, cognições, manifestações, FRC, controles, soluções, métricas e evidências.|Tornar fonte de entidades para Matrix, Network, List, filtros e Detail View.|
|[edges.csv](sandbox:/mnt/data/rc_cognitive_graph_v1/edges.csv?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Registro das 528 relações tipadas entre os nós, incluindo peso, classe epistêmica, evidência e status.|Consumir diretamente no Cytoscape; criar filtros por relation, layer, epistemic_class e weight.|
|[solutions.csv](sandbox:/mnt/data/rc_cognitive_graph_v1/solutions.csv?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Matriz FRC → controle → solução → ação → métrica para os 20 fatores; diferencia solução conceitual de intervenção autorizada no Scanner.|Completar catálogo P/D/C dos 12 FRC ainda não autorizados antes de habilitar recomendações automáticas.|
|[evidence.csv](sandbox:/mnt/data/rc_cognitive_graph_v1/evidence.csv?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Matriz de 13 claims/evidências com classe, fonte, redação autorizada e limites de interpretação.|Conectar ao Evidence Drawer e impedir recomendações sem evidence_id/claim_id válido.|
|[graph_schema.json](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_schema.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Contrato JSON Schema do conhecimento relacional: metadata, nodes, edges, solutions e evidence.|Usar em validação de build/CI e impedir ingestão de dados incompatíveis com o contrato.|
|[graph_data.json](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_data.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Dataset integrado pronto para consumo pela aplicação; reúne todo o conhecimento do grafo em um objeto único.|Tornar a fonte inicial do CanonicalRelationalModel; depois substituir carregamento estático por API/versionamento.|
|[SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx](sandbox:/mnt/data/rc_cognitive_graph_v1/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Workbook operacional para inspeção humana das abas SUMMARY, NODES, EDGES, SOLUTIONS e EVIDENCE.|Usar para revisão editorial, QA e governança; não utilizar como fonte de runtime da aplicação.|
|[SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.zip](sandbox:/mnt/data/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.zip?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Pacote canônico completo do grafo: CSV + JSON + XLSX + README.|Versionar como release de dados e anexar ao handoff técnico/repositório.|
|[index.html · implementação final](sandbox:/mnt/data/rc-mapa-interativo-final/index.html?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠|Artefato web consolidado produzido para implantação do novo sistema no projeto Vercel rc-mapa-interativo.|Colocar sob controle de versão, conectar ao projeto Vercel via Git, executar QA Matrix ↔ Network ↔ List ↔ Evidence ↔ Solution e então promover para produção.|

Conclusão. A cadeia canônica formada nesta conversa é:

Referência visual → 7 anéis → nodes.csv + edges.csv → solutions.csv + evidence.csv → graph_schema.json → graph_data.json → UI-DASH-001 → index.html → Vercel.

O artefato mestre de dados é o [ZIP SCHEMA-RC-SOLUTION-004](sandbox:/mnt/data/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.zip?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠. O artefato mestre legível por humanos é o [Workbook XLSX](sandbox:/mnt/data/rc_cognitive_graph_v1/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠. O artefato mestre de runtime é o [graph_data.json](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_data.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠, validado pelo [graph_schema.json](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_schema.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=0553f99a-4c1d-4324-a046-6bfcb13b10c3)⁠. O index.html representa a camada de implementação e não deve substituir esses contratos como fonte de verdade.
## Engenharia + Design · HANDOFF-TECH-001

  

DOCUMENT READER · VALU-MODE V3

  

ID              HANDOFF-TECH-001

Tipo            Engenharia · Implementação e deploy

Owner           Não determinado

Versão          1.1

Data            04/09/2026

Fase            Implementado localmente · Preview Vercel em inicialização

Projeto         Mapa Interativo de Risco Cognitivo

PARA            Engenharia · Design · Deploy

Referência      TECH-DV-001 · UI-DASH-001 · SCHEMA-RC-SOLUTION-004

3#              #TechnicalHandoff #Vercel #CognitiveMap

  

RESUMO EXECUTIVO

  

O quê            Handoff executado e nova aplicação enviada ao projeto Vercel ativo

Por quê          Substituir a consulta anterior pelo sistema relacional final

Quem             Design · Engenharia · Dados

Como             CanonicalRelationalModel + Matrix + Network + List + Evidence + Solution

  

3P+N · APLICAÇÃO

  

Problema         O site ativo ainda utilizava uma implementação estática anterior

Processo         Auditoria do Vercel → execução do handoff → integração do schema → QA local → deploy Preview

Progresso        Preview criado no projeto ativo rc-mapa-interativo

Next 01          Verificar Preview e interação end-to-end

Next 02          Publicar/promover em produção somente após o gate final

  

Resumo Executivo. O projeto Vercel ativo foi identificado como rc-mapa-interativo, no workspace Sas_Executar. Auditei a implantação existente e confirmei que ela era uma aplicação estática pequena, sem framework detectado e sem integração Git. Por isso preservei essa arquitetura de deploy em vez de introduzir uma migração estrutural desnecessária. O handoff foi aplicado à implementação: ECharts 6 para Matrix, Cytoscape.js para Network, List como fallback semântico, estado compartilhado, deep-link via URL, Fluent-2/tokens, mobile ≥320 px, controles ≥44 px, reduced-motion, estados loading/empty/error, Detail/Evidence e fechamento FRC → Controle → Solução → Ação → Métrica → Feedback.

  

Conclusão. O SCHEMA-RC-SOLUTION-004 foi incorporado ao CanonicalRelationalModel: 237 entidades, 528 relações, 20 FRC, 20 soluções conceituais e cadeia de evidência. Foi preservada a governança Fator ≠ Vulnerabilidade ≠ Exposição ≠ Risco; relações de modelagem inferida permanecem identificadas como inferência e não causalidade científica. Também mantive a restrição de produto de que apenas os oito FRC com catálogo operacional fechado podem gerar intervenção governada no Scanner; os demais aparecem como solução conceitual, não como recomendação automática. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx

  

Desenvolvimento. A implementação passou pelos gates locais disponíveis: TypeScript strict compilado, validação do modelo contra o contrato de dados, integridade referencial das relações/evidências e checks de acessibilidade/estado. O Preview foi efetivamente enviado para o mesmo projeto Vercel ativo, com deployment dpl_GQFobPasY25fSAyVoMZKraiNXbUZ: Preview Vercel do Mapa Cognitivo⁠. No momento em que o limite operacional desta execução foi atingido, o Vercel reportava o deployment como INITIALIZING, portanto não vou declarar falsamente que o gate visual/end-to-end ou a produção foram concluídos.

  

Próximos Passos. Ficaram pendentes exatamente os gates pós-deploy: confirmar READY, abrir o Preview, testar Matrix ↔ Rede ↔ Lista preservando relationId, validar Evidence/Solution, realizar verificação mobile/desktop e checar erros de runtime. A URL de produção rc-mapa-interativo.vercel.app ainda não foi substituída por esta versão, porque promover antes desses testes contrariaria o ACCEPTANCE_CHECKLIST do próprio handoff. O estado correto é, portanto: implementado → enviado para Preview → aguardando verificação; não ainda verificado/publicado em produção.

## Dados + Produto · SCHEMA-RC-SOLUTION-004

DOCUMENT READER · VALU-MODE V3

ID              SCHEMA-RC-SOLUTION-004  
Tipo            Dados · Knowledge Graph cognitivo orientado a solução  
Owner           Não determinado  
Versão          1.0  
Data            04/09/2026  
Fase            Implementado · Pronto para geração do gráfico  
Projeto         Mapa Cognitivo · TP-001 · RC-SOLUTION-001  
PARA            Design · Produto · Dados · Engenharia  
Referência      RC-KNW-001 · Factor Solution Matrix · Intervention Catalog · Evidence Matrix  
3#              #KnowledgeGraph #EvidenceBasedSolution #CognitiveMap

RESUMO EXECUTIVO

O quê            Dataset completo do mapa cognitivo relacional com solução e evidência  
Por quê          Permitir que o gráfico detecte, explique, recomende, meça e aprenda  
Quem             Scanner · Mapa · Produto · Design · Engenharia  
Como             237 nós · 528 relações · 20 FRC · 20 soluções conceituais · 8 intervenções governadas · 13 claims

3P+N · APLICAÇÃO

Problema         O mapa não poderia terminar em detecção de fatores  
Processo         Incorporados controle → solução → ação → métrica → feedback → learning  
Progresso        Grafo V1 materializado em XLSX, CSV e JSON Schema  
Next 01          Consumir nodes + edges para renderizar o mapa radial 16:9  
Next 02          Aplicar progressive disclosure por anel e por evidência  
Next 03          Conectar posteriormente o grafo ao Scanner

Resumo Executivo. O pacote foi implementado com os 7 anéis + centro, preservando os 20 FRC canônicos e a diferença entre fator, demanda, vulnerabilidade, exposição e risco. O corpus já define uma matriz de soluções conceituais para os 20 fatores, incluindo Tailoring Engine, Cognitive Demand Mapper, Cognitive View, Resume Point, Task Decomposer, Dependency Mapper, Reminder Builder, Focus Gate e Risk-to-Control Engine. 

Conclusão. A distinção de maturidade foi preservada: os 20/20 FRC possuem solução conceitual, mas somente os 8 fatores prioritários entram como intervenções governadas do Scanner V1 — FRC-03, 04, 07, 06, 09, 05, 11 e 15. O documento determina que os outros 12 não sejam classificados como resultado principal enquanto não tiverem o mesmo nível de especificação operacional e proíbe inventar recomendações. 

RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx

Desenvolvimento. O pacote contém nodes.csv, edges.csv, solutions.csv, evidence.csv, graph_data.json e graph_schema.json. As relações documentais recebem classe D, evidências primárias/oficiais permanecem identificadas, e relações como Emoção → Cognição ou determinadas conexões entre macros recebem E · Inferido, para não serem confundidas com causalidade demonstrada. As intervenções autorizadas incluem controles preventivo + detectivo + corretivo, solução tecnológica, ação e métricas operacionais; por exemplo, FRC-05 conduz ao Resume Point e FRC-11 ao Contextual Reminder Builder. 

Próximos Passos. O artefato principal para trabalhar é [Workbook XLSX](sandbox:/mnt/data/rc_cognitive_graph_v1/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.xlsx?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=04c113ad-960a-4693-ad7c-aea9c004c7de)⁠, enquanto o pacote integral está em [ZIP · CSV + JSON + XLSX](sandbox:/mnt/data/SCHEMA-RC-SOLUTION-004__cognitive-map-graph-v1.zip?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=04c113ad-960a-4693-ad7c-aea9c004c7de)⁠. Para implementação direta do grafo, também estão disponíveis [Graph Data JSON](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_data.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=04c113ad-960a-4693-ad7c-aea9c004c7de)⁠ e [JSON Schema](sandbox:/mnt/data/rc_cognitive_graph_v1/graph_schema.json?_chatgptios_conversationID=6a9af60d-c1d4-83e9-8611-b5059f0ed98c&_chatgptios_messageID=04c113ad-960a-4693-ad7c-aea9c004c7de)⁠. A estrutura já está pronta para o próximo estágio: transformar as 528 arestas em layout radial/concêntrico 16:9 com progressive disclosure.

## DOCUMENT READER · VALU-MODE V3

ID              SCHEMA-RC-SOLUTION-004  
Tipo            Dados · Grafo cognitivo orientado a detecção, controle e solução  
Owner           Não determinado  
Versão          1.0  
Data            04/09/2026  
Fase            Arquitetura aprovada · Expansão para solução  
Projeto         Mapa Cognitivo · TP-001 · RC-SOLUTION-001  
PARA            Produto · Dados · Design · Engenharia  
Referência      RC-KNW-001 · Evidence Matrix · Authorized Claims · RC-SCAN-INTERVENTION-CATALOG-V1  
3#              #EvidenceBasedSolution #RiskToControl #KnowledgeGraph

RESUMO EXECUTIVO

O quê            Expandir o grafo para detectar, explicar, recomendar, testar e aprender  
Por quê          Identificação sem solução não completa a cadeia operacional do produto  
Quem             Scanner · Mapa Cognitivo · Usuário · Engine de recomendações  
Como             Fator → evidência → controle → solução → ação → métrica → resultado → aprendizado

3P+N · APLICAÇÃO

Problema         O schema anterior terminava excessivamente próximo da identificação do problema  
Processo         Incorporar Evidence Matrix, Authorized Claims, controles e soluções como objetos relacionais governados  
Progresso        Arquitetura de solução incorporada ao modelo de 7 anéis  
Next 01          Materializar nodes.csv + edges.csv + solutions.csv + evidence.csv  
Next 02          Gerar JSON Schema canônico do grafo

Resumo Executivo. A correção é necessária: o mapa não deve ser um “detector de déficits”, mas um sistema Problema → Explicação → Evidência → Controle → Solução → Experimento → Resultado → Aprendizado. Isso já está coerente com o Knowledge Pack: o Agent Spec prevê recommended_controls[], recommended_solutions[], evidence_refs[] e, em cada recomendação, expected_effect + evidence_ids[]. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx O próprio output já prevê feedback pós-teste ligado a problem_id, factor_id, control_id, solution_id, resultado e posteriormente um objeto RC-LEARN-NNN. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx Portanto, o novo fluxo canônico deve ser: OBJETIVO/PESSOA → Ambiente → Sentidos → Emoção/Estado → Cognição → Manifestação → FRC → Demanda/Exposição → EVIDÊNCIA → CONTROLE → SOLUÇÃO → AÇÃO → MÉTRICA → FEEDBACK ↺ APRENDIZADO.

Conclusão. Eu manteria os 7 anéis, mas mudaria o sétimo de “Ação/Impacto/Feedback” para ⑦ CONTROLE · SOLUÇÃO · AÇÃO · IMPACTO · FEEDBACK. Cada FRC ou manifestação poderá ter várias soluções candidatas, mas nenhuma solução entra como recomendação ativa sem uma cadeia explícita factor_id → control_id → solution_id → evidence_ids[] → expected_effect → metric_id. Os controles devem continuar tipados como preventivo, detectivo ou corretivo, exatamente como já especificado no catálogo. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx Há uma restrição importante de estado: o documento existente define o RC-SCAN-INTERVENTION-CATALOG-V1 para os 8 fatores prioritários, e não comprova um catálogo completo para os 20 FRC. Logo, para FRC sem solução governada, o sistema deve retornar solution_status = NOT_YET_MAPPED, jamais inventar uma intervenção. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx Isso também coincide com a decisão já registrada de que o LLM pode explicar uma intervenção autorizada, mas não substituí-la por uma técnica inventada. 

RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx

Desenvolvimento. O schema relacional passa a ter esta gramática única: PERSON/OBJECTIVE → CONTEXT → ENVIRONMENT → SENSE → EMOTIONAL_STATE → COGNITIVE_MACRO → COGNITIVE_FUNCTION → OPERATIONAL_MANIFESTATION → FRC → POSSIBLE_DEMAND → EXPOSURE → CONTROL → SOLUTION → ACTION → METRIC → RESULT → LEARNING. As arestas principais serão exposes_to, stimulates, modulates, mobilizes, manifests_as, associated_with, increases_demand, may_contribute_to, mitigated_by, implemented_by, supported_by, expected_to_change, measured_by, produces, feeds_learning. Cada solução deverá carregar no mínimo: solution_id, factor_ids[], manifestation_ids[], control_id, control_type, solution_type (behavioral | environmental | informational | process | interface | technological), action, mechanism, expected_effect, evidence_refs[], evidence_class (E1 | E2 | S | FW), claim_ids[], limitations[], metric_ids[], status, version. Cada evidência deve ser um nó independente e não apenas texto anexado, permitindo o grafo mostrar “por que esta solução foi recomendada”. O corpus já determina que o agente trabalhe a partir de Knowledge Records, Evidence Matrix, Authorized Claims, catálogo de intervenções e catálogo de soluções. RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx A lógica tecnológica emergente também já aponta seis engines reutilizáveis — SCAN → CONVERT → MAP → REMEMBER → FOCUS → CONTROL → MEASURE — terminando em PROBLEM → COGNITIVE RISK → CONTROL → SOLUTION → ASSET → METRIC → LEARNING. 

RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx

Próximos Passos. O pacote de dados deve agora ter quatro matrizes interligadas: nodes.csv para todos os nós dos 7 anéis; edges.csv para todas as relações; solutions.csv para FRC × manifestação × controle × solução × ação × efeito esperado × métrica; e evidence.csv para evidence_id × claim_id × evidence_class × fonte × objeto suportado × força × limitações. A consulta final deixa de responder apenas “o que está relacionado ao meu problema?” e passa a responder “o que apareceu → por que pode ter aparecido → quais mecanismos estão envolvidos → que controle é autorizado → qual solução posso testar → qual evidência sustenta isso → o que devo observar → funcionou nesta situação?”. Esse fechamento é consistente com o exemplo já especificado no documento: detectar task switching/ambiente digital, recomendar um ponto de retomada, observar releitura e reconstrução de contexto, registrar resultado e transformar o teste em aprendizado. 

RC-KNW-001__knowledge-pack-tp001-fatores-risco-cognitivo__v01(1).docx
