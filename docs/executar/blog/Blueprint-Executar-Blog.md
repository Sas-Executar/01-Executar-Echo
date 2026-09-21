Governança Documental — Macro Blog Risco Cognitivo

Status: proposta de formalização baseada no corpus entregue  
Escopo: Blog · Editorial · CMS · Oficina de Ferramentas · Mapa · Agente VERA  
Cadeia canônica: EVID → PROBLEM → ICP → JOURNEY → JTBD → VALUE → BRD → PRD → REQ → AC → RFC → ADR → SPEC → TEST → RELEASE → KPI → LEARNING

0. Regra de governança transversal

A cadeia documental é um sistema de rastreabilidade, não uma sequência burocrática. Cada artefato deve existir para responder uma pergunta que o artefato anterior não responde e para fornecer uma entrada verificável ao próximo. O corpus documental define a função-base: EVID contém fatos; PROBLEM delimita o problema; ICP define o cliente ideal; JOURNEY descreve a experiência; JTBD formaliza o progresso desejado; VALUE define o valor; BRD registra necessidades do negócio; PRD define o produto; REQ atomiza obrigações; AC comprova satisfação; RFC propõe mudança; ADR/DEC registra decisão; SPEC contrata comportamento; TEST verifica; RELEASE publica; KPI observa resultado; LEARNING incorpora aprendizado. A cadeia deve ser repetida, conforme aplicável, para cada produto, serviço ou solução do ecossistema.

0.1 Metadados obrigatórios de qualquer documento

```yaml  
id: <DOMAIN>-<DOC_TYPE>-NNN  
status: DRAFT | REVIEW | APPROVED | SUPERSEDED | RETIRED  
version: semver-or-vNN  
owner: <responsavel>  
domain: BLOG | EDITORIAL | CMS | OFICINA | MAPA | VERA  
source_status: CORPUS_DIRECT | CORPUS_DERIVED | GAP  
decision_state: PROPOSED | APPROVED | REJECTED | EXPERIMENTAL  
upstream_ids: []  
downstream_ids: []  
evidence_refs: []  
requirement_refs: []  
decision_refs: []  
test_refs: []  
kpi_refs: []  
created_at: YYYY-MM-DD  
review_at: YYYY-MM-DD  
```

0.2 Gates obrigatórios

1. Gate de Evidência: nenhuma afirmação estrutural entra como fato sem fonte ou marcação explícita de framework/inferência.

2. Gate de Problema: não iniciar solução sem problema delimitado, população/contexto e impacto observável.

3. Gate de Valor: PRD só abre após JTBD e VALUE coerentes com o problema.

4. Gate de Requisito: nenhum REQ sem origem rastreável em BRD/PRD.

5. Gate de Decisão: mudança relevante exige RFC; decisão arquitetural/produto persistente exige ADR/DEC.

6. Gate de Especificação: nenhum desenvolvimento/publicação crítica sem SPEC suficiente para comportamento, estados, exceções e dados.

7. Gate de Verificação: RELEASE exige TEST/verification e critérios objetivos.

8. Gate de Aprendizado: KPI não encerra a cadeia; LEARNING deve registrar interpretação, limite e ação resultante.

  

BLOG — Blog

Source status: CORPUS_DIRECT  
Corpus-base: BLOG_COPY, Acquisition Funnel, RC-DV-001 e Knowledge Pack TP-001  
Definição operacional: canal público de conhecimento que reconhece dificuldades de execução, faz o reframe para arquitetura da execução, explica mecanismos/fatores, oferece exploração por mapa e encaminha para Scanner/VERA e próximos conteúdos.

A. Contrato do domínio

Problema nuclear: o leitor percebe esforço excessivo, sobrecarga, interrupções, tarefas vagas, dependências e perda de contexto, mas pode atribuir tudo a foco, disciplina ou falha pessoal e não localizar condições do sistema de execução.  
ICP-base: adultos em trabalho, estudos, rotina, projetos pessoais e atividades mediadas por tecnologia; pode ser útil a pessoas neurodivergentes, mas não depende de diagnóstico.  
Journey-base: reconhecimento em social ou busca → leitura/reframe no blog → exploração de fator/mecanismo/evidência → CTA para mapa ou Scanner → ação/teste → retorno para novo conteúdo e aprendizado.  
JTBD-base: quando uma situação exigir mais esforço do que deveria, entender o que na tarefa, informação, ambiente, processo ou tecnologia pode estar aumentando a demanda para saber onde investigar e o que testar.  
Value-base: transformar dificuldade difusa em linguagem estruturada, explicações, mapas, evidências e controles práticos, sem diagnóstico da pessoa.  
Objetivo de negócio: construir aquisição orgânica/editorial, confiança, ativação para Scanner/VERA e ponte para produtos/serviços do ecossistema, medindo não apenas alcance, mas progressão para ação.  
Escopo de produto: homepage, artigos, páginas temáticas, navegação por fatores, CTAs, mapa relacional embutido, páginas de ferramenta, trust/safety copy, deep-links e instrumentação de funil.  
Restrições: análise da situação e não diagnóstico; conteúdo deve separar evidência de framework proprietário; CTAs devem preservar contexto; não inventar causalidade clínica; mobile e acessibilidade devem ser verificáveis.  
Métricas-base: engaged session, article completion/scroll, CTA click, mapa aberto, scanner_start por landing view, progressão para ação e retorno.  
Learning esperado: quais problemas/termos geram reconhecimento, quais mecanismos são compreendidos, quais CTAs ativam ferramenta, quais conteúdos produzem ação e quais mensagens precisam ser revisadas.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: BLOG-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em Blog: fontes científicas/editoriais, Search/analytics, comportamento de leitura e evidências dos Knowledge Packs.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: BLOG-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em Blog: ex.: ‘esforço excessivo sem conseguir localizar a arquitetura da execução’ em vez de ‘neurodivergência’ como tema genérico.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: BLOG-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em Blog: segmentar por contexto de execução e intenção de leitura/ação, mantendo neurodivergência como contexto possível e não pré-condição.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: BLOG-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em Blog: incluir Social/Search → Blog → Mapa/Scanner → Ação → Learning.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: BLOG-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em Blog: preservar a formulação situacional ‘quando uma atividade exigir mais esforço do que deveria…’.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: BLOG-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em Blog: usar o reframe do corpus: nem todo esforço vem do trabalho; parte vem do sistema ao redor.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: BLOG-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em Blog: rastrear aquisição, confiança, ativação e ponte comercial sem otimizar alcance isoladamente.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: BLOG-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em Blog: incluir páginas, artigos, CTAs, mapa embutido, trust lines e instrumentação; não misturar CMS implementation no PRD de conteúdo.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: BLOG-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em Blog: ex.: todo CTA para Scanner preserva topic/problem/factor quando disponível.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: BLOG-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em Blog: ex.: usuário abre conteúdo e chega ao Scanner mantendo referência contextual sem expor dados sensíveis.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: BLOG-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em Blog: mudanças de taxonomia, navegação, CTA architecture, SEO structure ou integração devem ser propostas antes de alterar o sistema.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: BLOG-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em Blog: registrar decisões persistentes como incorporar ferramenta no blog existente em vez de criar produto/site separado.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: BLOG-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em Blog: cobrir content contract, UX, visual, analytics, SEO, accessibility e deep-link.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: BLOG-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em Blog: validar links, mobile, acessibilidade, copy/safety, analytics e coerência com claims autorizados.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: BLOG-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em Blog: versionar conteúdo e componentes; registrar publicação/correções.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: BLOG-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em Blog: não usar pageview isolado; medir leitura engajada e progressão para CTA/ação.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: BLOG-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em Blog: transformar comportamento observado em revisão de headline, argumento, CTA, rota e próximo experimento.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto BLOG-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

EDITORIAL — Editorial

Source status: CORPUS_DIRECT  
Corpus-base: RC-KNW-001 Knowledge Pack TP-001, Evidence Matrix, Authorized Claims, Storyboard e fluxo de operação  
Definição operacional: sistema que transforma problema canônico e evidência em conhecimento publicável, argumentos, claims autorizados, estrutura narrativa, visuais, derivados, publicação, medição e learning.

A. Contrato do domínio

Problema nuclear: produzir formatos antes de definir transformação, problema, público, tese e evidência cria conteúdo inconsistente, claims frágeis, duplicação semântica e dificuldade de rastrear por que uma afirmação ou visual existe.  
ICP-base: leitor do ecossistema que precisa reconhecer e compreender fatores de risco cognitivo em linguagem aplicável; operacionalmente, o domínio também atende editor, pesquisador, design e agentes que reutilizam o Knowledge Pack.  
Journey-base: problema editorial → brief mestre → público/contexto → perguntas → tese → fatores/taxonomia → mapa argumentativo → matriz de evidências → claims → storyboard → brief visual → artigo/derivados → QA → publicação → métricas → learning.  
JTBD-base: quando um problema editorial for aprovado, estruturar uma peça-mãe sustentada e rastreável que possa gerar múltiplos assets sem perder tese, evidência, terminologia ou objetivo de ação.  
Value-base: pesquisar e governar uma vez, distribuir muitas vezes; cada claim, bloco e asset deve ser rastreável ao problema, evidência, objetivo e CTA.  
Objetivo de negócio: criar um sistema editorial escalável em que 1 problema → 1 solução/conhecimento governado → N assets, aumentando consistência, produtividade, reutilização e capacidade de medir aquisição.  
Escopo de produto: briefs, topic packs, knowledge records, taxonomias, evidence matrix, claim contract, mapa estrutural e argumentativo, storyboard, visual brief, artigo, carrossel, reel, story, infográfico, newsletter e CTA library.  
Restrições: fator ≠ vulnerabilidade ≠ exposição ≠ risco; classes E1/E2/S/FW; não usar formulações pseudocientíficas; frameworks proprietários devem ser identificados; formatos só avançam após gate conceitual e científico.  
Métricas-base: produção por problema, taxa de reutilização de assets, cobertura de evidência/claims, revisão necessária, publicação no prazo, CTR, completion, saves/shares e progressão para ferramentas.  
Learning esperado: registrar quais estruturas narrativas, claims, formatos e CTAs funcionam, quais evidências precisam atualização e quais itens do Knowledge Pack devem ser versionados sem destruir histórico.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: EDITORIAL-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em Editorial: Evidence Matrix, fontes primárias/oficiais, Knowledge Records e classificação E1/E2/S/FW.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: EDITORIAL-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em Editorial: definir problema canônico antes de artigo ou asset; o próprio pack identifica tensão entre topic pack amplo e regra 1 problem → 1 knowledge pack → 1 solution → N assets.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: EDITORIAL-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em Editorial: documentar público/contexto editorial sem inventar persona que o corpus não suporta.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: EDITORIAL-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em Editorial: usar o mapa MECE do processo: estratégia/problema → conhecimento/evidência → claims → narrativa → visual → assets → QA → operação.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: EDITORIAL-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em Editorial: transformar uma pesquisa em peça-mãe reutilizável e governada.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: EDITORIAL-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em Editorial: uma unidade operacional deixa de ser ‘post’ e passa a ser problema/conhecimento → derivados.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: EDITORIAL-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em Editorial: governar escala, consistência, aquisição e reutilização.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: EDITORIAL-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em Editorial: cada Topic/Knowledge Pack deve definir transformação, tese, fatores, evidências, claims, assets e CTA.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: EDITORIAL-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em Editorial: ex.: nenhum claim publicado sem claim_id e evidence class/ref quando aplicável.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: EDITORIAL-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em Editorial: ex.: matriz de claims sem campo crítico indefinido e storyboard sem extrapolação causal.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: EDITORIAL-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em Editorial: usar quando mudar taxonomia, cadeia de produção, classes de evidência ou schema knowledge-to-asset.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: EDITORIAL-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em Editorial: congelar regras como separar frameworks proprietários de evidência científica.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: EDITORIAL-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em Editorial: contratos para copy, structure, claims, visual brief, asset metadata e derivação.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: EDITORIAL-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em Editorial: QA científico/editorial, overflow visual, links, consistência de IDs, fonte e CTA.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: EDITORIAL-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em Editorial: publicação de pacote e derivados com master index e status.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: EDITORIAL-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em Editorial: medir asset reuse, completion, CTA e learning, não só alcance.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: EDITORIAL-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em Editorial: atualizar knowledge pack/versionamento sem destruir história.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto EDITORIAL-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

CMS — CMS

Source status: CORPUS_DIRECT  
Corpus-base: PEM-AREA 16, regras Creator Operating System e referências a Payload como publicação do blog  
Definição operacional: camada de publicação e conteúdo estruturado do blog, separada de CRM, mídia social e SOT operacional; deve receber conteúdo governado e preservar IDs, estados, metadados, relacionamentos, SEO e publicação.

A. Contrato do domínio

Problema nuclear: usar o CMS como sistema de tudo, ou operar conteúdo, agenda, leads, vendas, arquivos e métricas sem responsabilidades claras, aumenta carga operacional, duplicação de entrada e perda de rastreabilidade.  
ICP-base: operador solo/creator-led e agentes de conteúdo que precisam publicar rapidamente sem perder controle de versão, relações entre conteúdo-mãe e derivados e integração com ferramentas externas.  
Journey-base: artefato editorial aprovado → registro estruturado no CMS → validação de schema/metadados → preview → aprovação → agendamento/publicação → distribuição externa → analytics → correção/versionamento.  
JTBD-base: quando um conteúdo estiver aprovado, publicá-lo uma vez com estrutura, identidade, SEO, relações e estados corretos para que outros sistemas distribuam e meçam sem reentrada manual.  
Value-base: um CMS especializado em publicação: conteúdo estruturado, estados governados, URLs persistentes, componentes reutilizáveis e integração, sem assumir funções de CRM ou SOT mestre.  
Objetivo de negócio: reduzir custo operacional e erro editorial, acelerar publicação, preservar SEO/URLs e permitir automações e derivados sem acoplamento excessivo.  
Escopo de produto: collections/content types, campos de ID, slug, versão, status, autor, evidências/claims, relações de topic/problem/factor, blocos/callouts, assets, CTA, SEO, preview, agendamento, webhooks e analytics IDs.  
Restrições: Payload é tratado no corpus como publicação do blog; Drive/Hub funciona como SOT operacional. Uma ferramenta por responsabilidade. Mudanças de schema exigem migração e decisão registrada; publicação não pode apagar proveniência editorial.  
Métricas-base: tempo aprovação→publicação, falhas de schema, retrabalho, erro de links/metadata, tempo de preview, disponibilidade, publicação bem-sucedida, conteúdo órfão e eventos de CTA.  
Learning esperado: identificar campos que faltam, componentes que geram retrabalho, automações úteis, falhas de integração, gargalos de publicação e mudanças de modelo que devem virar RFC/ADR.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: CMS-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em CMS: inventário de conteúdo atual, tipos, campos, volumes, falhas de publicação, analytics e integrações reais.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: CMS-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em CMS: qualquer mudança de CMS deve começar em fricção observada; não presumir que uma nova plataforma resolve operação.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: CMS-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em CMS: operador solo e agentes que publicam; stakeholders incluem leitor, editorial, engenharia e sistemas externos.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: CMS-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em CMS: Approved editorial asset → CMS entry → preview → approval → schedule/publish → webhook/distribution → observation.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: CMS-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em CMS: publicar uma vez e permitir que o restante do ecossistema consuma o estado correto.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: CMS-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em CMS: especialização por responsabilidade: CMS publica, SOT governa, CRM gerencia clientes, social manager distribui.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: CMS-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em CMS: reduzir entrada duplicada, erro, tempo de publicação e acoplamento.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: CMS-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em CMS: modelar collections/fields/relations/workflow/integrations, sem redefinir estratégia editorial.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: CMS-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em CMS: ex.: toda entrada publicada contém canonical_id, slug, status, version e relation refs obrigatórias.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: CMS-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em CMS: ex.: preview e publicação preservam URL/metadata e webhook é emitido uma única vez conforme regra.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: CMS-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em CMS: obrigatório para novos content types, breaking schema changes, workflow e integrações.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: CMS-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em CMS: decidir fonte de verdade, estratégia de migração, blocos nativos, cache e preview.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: CMS-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em CMS: Data/Content Schema, API/Webhook, permission, workflow, rendering e migration specs.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: CMS-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em CMS: schema validation, migration, preview/publish, rollback, SEO, webhooks e permission.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: CMS-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em CMS: migrações versionadas e rollback explícito.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: CMS-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em CMS: publication lead time, schema failures, orphan relations, rework e uptime.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: CMS-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em CMS: dados de operação geram backlog de schema/automation, não mudanças ad hoc.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto CMS-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

OFICINA — Oficina de Ferramentas

Source status: CORPUS_DERIVED  
Corpus-base: não há documento direto na pasta OFICINA; domínio inferido do schema metodológico, taxonomia de intervenções e cadeia controle → solução → ação → métrica → learning  
Definição operacional: catálogo/aplicação de métodos, práticas, táticas, técnicas, controles, ferramentas e artefatos usados para reduzir fricções e testar intervenções em situações de execução; deve ser validado como produto antes de implementação.

A. Contrato do domínio

Problema nuclear: o corpus identifica risco de misturar níveis semânticos: task switching é condição/mecanismo, switch cost é efeito, batching é tática, limite de WIP é controle, Kanban é método/prática e board é ferramenta/artefato.  
ICP-base: hipótese de público: leitores/usuários que já reconheceram um problema ou fator e precisam escolher uma intervenção concreta para experimentar; esta definição ainda requer EVID própria.  
Journey-base: problema/fator identificado → evidência → controle autorizado → método/tática/técnica → ferramenta/artefato → instrução de uso → experimento → métrica → resultado → learning; jornada derivada, ainda não validada por pesquisa específica.  
JTBD-base: hipótese: quando eu entender qual fator está atrapalhando a execução, quero encontrar uma ferramenta ou protocolo correspondente, saber por que usar, como aplicar e o que observar para testar sem tentar soluções aleatórias.  
Value-base: hipótese: transformar conhecimento em intervenção executável, distinguindo mecanismo, controle, técnica e ferramenta e fechando cada item com métrica de teste.  
Objetivo de negócio: hipótese: aumentar utilidade prática do blog, ativação, retenção e possibilidade de microprodutos/recursos, sem liberar recomendação não governada.  
Escopo de produto: catálogo de intervenções, fichas de ferramentas, templates, checklists, protocolos, exemplos, downloads, simuladores e links para execução; qualquer item deve apontar factor_id/control_id/evidence_ids/metric_ids.  
Restrições: fonte direta insuficiente; não declarar como requisito aprovado. Solução sem catálogo governado deve retornar NOT_YET_MAPPED. Nenhuma ferramenta deve ser promovida como tratamento clínico ou efeito universal.  
Métricas-base: hipóteses a validar: tool_open, tool_start, completion, reuse/download, recommendation_used, next_action_completed, feedback e resultado observado por contexto.  
Learning esperado: registrar utilidade, contexto de sucesso/falha, fricção de aplicação, necessidade de adaptação e decisão de promover, alterar ou retirar uma intervenção.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: OFICINA-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em Oficina de Ferramentas: antes de criar a área, produzir pesquisa de uso, inventário de intervenções já governadas e evidência de demanda; hoje o corpus não fornece EVID específica de produto Oficina.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: OFICINA-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em Oficina de Ferramentas: formalizar semanticamente mecanismo → risco → controle → método/tática/técnica → ferramenta; evitar catálogo aleatório de hacks.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: OFICINA-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em Oficina de Ferramentas: deve permanecer hipótese até entrevista/analytics comprovar quem procura intervenção prática.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: OFICINA-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em Oficina de Ferramentas: tratar a jornada atual como derivada e criar pesquisa para validar descoberta, escolha, aplicação e retorno.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: OFICINA-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em Oficina de Ferramentas: registrar como hipótese e validar antes de usar como base de monetização.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: OFICINA-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em Oficina de Ferramentas: não aprovar promessa até comprovar que usuário entende a distinção e consegue aplicar ferramenta.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: OFICINA-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em Oficina de Ferramentas: business case deve incluir papel no funil e possível monetização, mas sem assumir demanda.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: OFICINA-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em Oficina de Ferramentas: primeiro PRD deve ser Discovery/MVP e limitar-se às intervenções já governadas.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: OFICINA-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em Oficina de Ferramentas: todo item deve ter factor_id/control_id/solution_id/evidence_ids/metric_ids e status.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: OFICINA-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em Oficina de Ferramentas: item sem evidência ou controle aprovado não pode aparecer como recomendação ativa.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: OFICINA-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em Oficina de Ferramentas: nova classe de intervenção/taxonomia exige proposta e impacto nos schemas.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: OFICINA-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em Oficina de Ferramentas: decidir se Oficina é página/catálogo do blog, módulo VERA ou produto separado somente após evidência.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: OFICINA-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em Oficina de Ferramentas: ficha de intervenção deve incluir mecanismo, passo a passo, limitações, contexto, métrica e safety.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: OFICINA-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em Oficina de Ferramentas: usability + correctness + evidence trace + measurement; testar se usuário aplica sem interpretação indevida.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: OFICINA-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em Oficina de Ferramentas: lançar primeiro como coleção limitada/experimental e sinalizar maturidade.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: OFICINA-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em Oficina de Ferramentas: medidas inicialmente exploratórias; evitar metas comerciais antes de baseline.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: OFICINA-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em Oficina de Ferramentas: cada uso deve alimentar maturidade da intervenção e decisão de manter/alterar/retirar.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto OFICINA-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

MAPA — Mapa

Source status: CORPUS_DIRECT  
Corpus-base: RC-DV-001, PRD-001 Dashboard Público de Relações, SCHEMA-RC-SOLUTION-004 e handoff TECH-DV-001/UI-DASH-001  
Definição operacional: explorador visual relacional público que permite navegar por dimensões, fatores, relações, evidências, controles e soluções, com progressive disclosure e continuidade entre Matrix, Network e List.

A. Contrato do domínio

Problema nuclear: texto e gráficos estáticos não permitem explorar relações do modelo; um mapa que apenas detecta fatores também é incompleto se não explicar evidência, controle, solução, ação, métrica e aprendizado.  
ICP-base: visitantes do blog que querem compreender relações; posteriormente Scanner/VERA podem alimentar versões contextualizadas/personalizadas sem alterar a distinção entre mapa educacional e análise situacional.  
Journey-base: entrar no mapa → selecionar macro/domínio/dimensão → visualizar relação → abrir detalhe → ver direção/força/confiança quando disponível → abrir evidência → ver controle/solução → CTA para Scanner ou conteúdo → manter contexto por deep-link.  
JTBD-base: quando eu estiver tentando entender um fator ou dificuldade, explorar visualmente como ele se relaciona com demandas, manifestações, controles e evidências para decidir onde aprofundar ou testar.  
Value-base: converter a taxonomia em interface explorável e explicável: explore → entenda → veja a solução → veja evidências → experimente.  
Objetivo de negócio: aumentar compreensão, tempo útil e navegação contextual no blog, criando ponte natural entre conhecimento e ativação no Scanner/VERA.  
Escopo de produto: MacroSelector, DomainSelector, Matrix, Network, List, RelationDetail, Evidence, Refine sheet, deep-link, estados de loading/empty/error, modos Explorar/Problemas/Soluções/Evidências e visualização orientada ao knowledge graph.  
Restrições: dado ausente = Não disponível; nunca inventar. Relações devem preservar relationId. Mobile-first ≥320px, touch ≥44px, WCAG 2.2 AA, reduced motion, fallback List. O grafo materializado registra 237 nós, 528 relações, 20 FRC, soluções conceituais e 8 intervenções governadas.  
Métricas-base: relação encontrada, alternância de visualização sem perda de contexto, evidence_open, solution_open, refine_use, deep_link_use, CTA Scanner, mobile completion e erros de resolução relationId.  
Learning esperado: quais relações são mais exploradas, onde o usuário perde contexto, quais evidências são abertas, quais soluções levam a ação e onde o grafo/schema precisa de nova relação ou correção.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: MAPA-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em Mapa: nodes/edges/evidence/solutions, Evidence Matrix e relation metadata; ausência deve ser representada como ‘Não disponível’.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: MAPA-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em Mapa: exploração de relações e explicabilidade, não score pessoal.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: MAPA-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em Mapa: leitor explorador; personalization só depois do Scanner e sem confundir mapa educacional com diagnóstico.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: MAPA-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em Mapa: MacroSelector → DomainSelector → Matrix/Network/List → RelationDetail → Evidence/Solution → CTA.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: MAPA-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em Mapa: encontrar e entender relação mantendo contexto visual e sem precisar ler todo o corpus.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: MAPA-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em Mapa: progressive disclosure com evidência e solução no ponto da curiosidade.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: MAPA-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em Mapa: aumentar compreensão/ativação e reutilizar o mesmo knowledge graph em canais.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: MAPA-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em Mapa: usar o PRD aprovado: Matrix/Network/List, Detail, Evidence, Refine, deep-link e fallback semântico.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: MAPA-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em Mapa: preservar relationId entre views; serializar estado essencial na URL.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: MAPA-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em Mapa: usuário encontra relação, alterna view e abre evidência mantendo contexto em mobile/desktop.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: MAPA-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em Mapa: mudança no modelo de anéis, schema relacional, view model ou stack deve ser proposta.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: MAPA-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em Mapa: preservar decisões de stack/interação do handoff TECH-DV-001/UI-DASH-001.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: MAPA-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em Mapa: functional UI + data contract + view state + component contracts + tokens.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: MAPA-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em Mapa: 320px+, keyboard/touch, WCAG 2.2 AA, reduced motion, empty/loading/error, deep-link e consistency.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: MAPA-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em Mapa: publicar versão do grafo e UI juntos com compatibilidade declarada.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: MAPA-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em Mapa: relation_open, evidence_open, view_switch, CTA, context_loss/error rate.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: MAPA-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em Mapa: analytics de exploração pode justificar novas relações, mas só entra no grafo após evidência/governança.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto MAPA-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

VERA — Agente VERA

Source status: CORPUS_DIRECT  
Corpus-base: Plano de Implementação VERA, estratégia RC-BIZ-001, RC Scanner handoff, PRD-RC-SCAN-001, Knowledge Contract e Safety Governance  
Definição operacional: camada interativa de análise guiada da execução que transforma relato situacional em estrutura explicável, fatores investigáveis, controles/recomendações autorizadas, ação e feedback, funcionando como motor de ativação do blog e base futura de Free→Pro/B2B.

A. Contrato do domínio

Problema nuclear: o usuário sabe que executar está difícil, mas não consegue localizar por que, enquanto soluções genéricas ou diagnóstico indevido aumentariam risco epistemológico e de segurança.  
ICP-base: adultos em trabalho, estudos, rotina e projetos pessoais; usuários do blog que chegam com situação real e podem querer aprofundar análise; produto não depende de diagnóstico e não mede TDAH, autismo ou capacidade cognitiva.  
Journey-base: conteúdo/blog → abrir VERA/Scanner → descrever situação → objetivo/contexto → perguntas adaptativas → sinais observáveis → até 3 fatores prioritários → explicação → recomendação autorizada → ação → feedback → próximo conteúdo/solução → eventual plano Pro/Team/serviço.  
JTBD-base: quando uma atividade estiver exigindo mais esforço do que deveria, descrever a situação e receber um mapa estruturado e explicável do que investigar primeiro, com uma mudança testável.  
Value-base: Ver · Entender · Reduzir · Agir; análise da situação, não diagnóstico da pessoa; sair de ‘está difícil e não sei por quê’ para ‘sei quais fatores investigar e qual mudança testar’.  
Objetivo de negócio: O1 ativar o blog; O2 provar monetização Free→Pro sem retirar valor central gratuito; O3 converter usuários de alta intenção em B2B/serviços, evoluindo depois para Team, API/SDK, white-label e formação conforme validação.  
Escopo de produto: entrada em linguagem natural, perguntas adaptativas, extração de sinais, classificação no catálogo canônico, explicação, recomendações governadas, output estruturado, feedback, analytics não sensível, feature flags e integrações futuras.  
Restrições: MVP principal apenas para 8 FRC operacionalizados; arquitetura expansível para 20. Fator ≠ vulnerabilidade ≠ exposição ≠ risco. Sem diagnóstico, score clínico ou invenção de intervenção. Não enviar relato bruto a analytics. Privacy by default, structured output, catálogo canônico estático e rollback por feature flag são decisões documentadas no handoff.  
Métricas-base: scanner_open/start/context_complete/question_answer/complete/factor_open/recommendation_open/action_selected/feedback/next_content; North Star: scanner_complete → recommendation_used → next_action_completed; depois retenção e conversão Free→Pro/B2B.  
Learning esperado: feedback pós-teste deve ligar problem_id, factor_id, control_id, solution_id e resultado, produzindo learning versionado; aprender sem sobrescrever taxonomia, evidência ou histórico de decisões.

B. Cadeia documental especializada

1. EVID — Base factual e epistemológica

ID padrão: VERA-EVID-NNN  
Função: Consolidar pesquisas, comportamento, métricas, fontes, registros operacionais e evidências que sustentam o domínio antes de transformar observação em problema ou solução.  
Aplicação em Agente VERA: Knowledge Contract, Evidence Matrix, Authorized Claims, catálogo de 8 intervenções, feedback e analytics sem relato bruto.  
Regra: EVID não recomenda solução. Distingue fato, observação, síntese e framework/inferência.

Perguntas obrigatórias

● Que fonte/observação sustenta isto?

● É evidência primária, orientação oficial, síntese, framework ou inferência?

● Qual data, contexto e limitação?

Entradas mínimas: fontes/observações aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-EVID-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PROBLEM.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

2. PROBLEM — Problema canônico

ID padrão: VERA-PROBLEM-NNN  
Função: Delimitar uma dificuldade específica, o contexto em que ocorre, quem é afetado, impacto, frequência e evidências, separando sintoma, causa presumida e mecanismo.  
Aplicação em Agente VERA: análise deve partir da situação real e sinais observáveis; não da tentativa de classificar a pessoa.  
Regra: PROBLEM deve ser solucionável/investigável e rastrear EVID; não pode ser apenas tema amplo.

Perguntas obrigatórias

● O que está acontecendo?

● Quem é afetado e em qual contexto?

● Qual impacto observável e qual evidência prova que o problema existe?

Entradas mínimas: EVID aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-PROBLEM-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ICP.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

3. ICP — Cliente/usuário ideal

ID padrão: VERA-ICP-NNN  
Função: Definir quem tem maior fit com o problema e o valor proposto, incluindo contexto, necessidades, comportamento, capacidade/propensão de uso e exclusões.  
Aplicação em Agente VERA: adultos em contextos de execução; segmentação futura Free/Pro/Team/B2B deve ser comprovada por uso e intenção.  
Regra: ICP não substitui persona clínica nem autoriza inferir diagnóstico.

Perguntas obrigatórias

● Quem tem maior frequência/impacto/intenção?

● Quem não é público desta versão?

● Que contexto de uso diferencia fit de curiosidade?

Entradas mínimas: PROBLEM aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-ICP-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JOURNEY.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

4. JOURNEY — Experiência ponta a ponta

ID padrão: VERA-JOURNEY-NNN  
Função: Representar etapas, ações, touchpoints, estados, fricções, decisões, oportunidades e transições do usuário ao longo do domínio.  
Aplicação em Agente VERA: Blog → VERA/Scanner → input → perguntas → factors → explanation → recommendation → action → feedback → next solution.  
Regra: Cada touchpoint crítico deve apontar para evento, requisito ou hipótese mensurável.

Perguntas obrigatórias

● Qual gatilho de entrada?

● Quais touchpoints e fricções?

● Qual próxima ação desejada e onde há abandono?

Entradas mínimas: ICP aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-JOURNEY-NNN versionado, relações explícitas e decisão/gate documentado para alimentar JTBD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

5. JTBD — Progresso desejado

ID padrão: VERA-JTBD-NNN  
Função: Formalizar situação, motivação, trabalho funcional/emocional/social e outcome desejado sem prescrever implementação.  
Aplicação em Agente VERA: usar formulação já congelada no PRD-RC-SCAN-001.  
Regra: O JTBD deve poder ser validado por comportamento e deve derivar de PROBLEM + ICP + JOURNEY.

Perguntas obrigatórias

● Quando… quero… para…?

● Qual progresso é buscado sem mencionar solução?

● Como reconhecer que o progresso aconteceu?

Entradas mínimas: JOURNEY aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-JTBD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar VALUE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

6. VALUE — Proposta de valor

ID padrão: VERA-VALUE-NNN  
Função: Explicitar problema, benefício, mecanismo de entrega, diferenciação, alternativa atual, promessa e limites.  
Aplicação em Agente VERA: Ver · Entender · Reduzir · Agir e ‘análise da situação, não diagnóstico da pessoa’.  
Regra: VALUE não pode prometer efeito clínico ou causalidade que o EVID não sustenta.

Perguntas obrigatórias

● Que benefício verificável entregamos?

● Qual alternativa atual?

● Que promessa não podemos fazer?

Entradas mínimas: JTBD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-VALUE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar BRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

7. BRD — Necessidade do negócio

ID padrão: VERA-BRD-NNN  
Função: Converter valor e estratégia em objetivos, outcomes, stakeholders, regras, restrições, business case e métricas de negócio.  
Aplicação em Agente VERA: separar objetivos O1 ativação, O2 Free→Pro, O3 B2B/serviços e medir cada estágio.  
Regra: BRD diz por que o negócio precisa do resultado; não detalha implementação.

Perguntas obrigatórias

● Qual outcome de negócio?

● Quais stakeholders/restrições?

● Qual hipótese de valor econômico/estratégico?

Entradas mínimas: VALUE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-BRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar PRD.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

8. PRD — Definição do produto

ID padrão: VERA-PRD-NNN  
Função: Converter problema, usuário, valor e BRD em visão, escopo, funcionalidades, não-escopo, métricas, riscos e roadmap do produto.  
Aplicação em Agente VERA: MVP não clínico, 8 FRC, structured output, uma recomendação aplicável por fator e next action.  
Regra: PRD deve congelar escopo suficiente para REQ e explicitar o que está fora.

Perguntas obrigatórias

● Qual problema e usuário?

● O que entra e o que fica fora?

● Qual métrica define sucesso do produto?

Entradas mínimas: BRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-PRD-NNN versionado, relações explícitas e decisão/gate documentado para alimentar REQ.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

9. REQ — Requisito atômico

ID padrão: VERA-REQ-NNN  
Função: Registrar obrigação funcional ou não funcional com origem, prioridade, dependências, estado e condição verificável.  
Aplicação em Agente VERA: agente não pode recomendar intervenção fora do catálogo governado; output deve ser estruturado.  
Regra: Um REQ = uma obrigação; evitar misturar solução, justificativa e teste no mesmo campo.

Perguntas obrigatórias

● Qual obrigação única?

● De onde ela deriva?

● Qual prioridade/dependência/risco?

Entradas mínimas: PRD aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-REQ-NNN versionado, relações explícitas e decisão/gate documentado para alimentar AC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

10. AC — Critério de aceitação

ID padrão: VERA-AC-NNN  
Função: Definir condição objetiva que comprova que o REQ foi satisfeito em contexto e estado conhecidos.  
Aplicação em Agente VERA: resultado principal contém até 3 fatores permitidos, justificativa e recomendação autorizada; analytics não contém texto livre sensível.  
Regra: AC deve ser observável e binário o suficiente para suportar verificação go/no-go.

Perguntas obrigatórias

● Dado X, quando Y, então Z?

● Como verificar sem interpretação subjetiva?

● Que falha bloqueia aceite?

Entradas mínimas: REQ aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-AC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

11. RFC — Proposta de mudança

ID padrão: VERA-RFC-NNN  
Função: Registrar contexto, problema, alternativas, impactos, riscos, trade-offs, migração e recomendação antes de alterar arquitetura, schema, processo ou experiência relevante.  
Aplicação em Agente VERA: qualquer expansão para 20 FRC, memória, contas, Pro, Teams, API ou RAG exige proposta específica.  
Regra: RFC é proposta, não decisão; pode ser rejeitada sem alterar o estado canônico.

Perguntas obrigatórias

● Por que mudar agora?

● Quais alternativas e trade-offs?

● Qual impacto e plano de migração/rollback?

Entradas mínimas: AC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-RFC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar ADR.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

12. ADR — Registro de decisão

ID padrão: VERA-ADR-NNN  
Função: Congelar decisão, opções consideradas/rejeitadas, racional, consequências, escopo e condição de revisão.  
Aplicação em Agente VERA: reusar decisões documentadas: embed no blog, single agent + classifier, static canonical catalog, structured output, privacy, 8-factor MVP e rollback.  
Regra: ADR/DEC precisa apontar a RFC ou problema que originou a decisão e os artefatos afetados.

Perguntas obrigatórias

● Qual decisão foi tomada?

● Quais opções foram rejeitadas e por quê?

● Quais consequências e gatilho de revisão?

Entradas mínimas: RFC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-ADR-NNN versionado, relações explícitas e decisão/gate documentado para alimentar SPEC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

13. SPEC — Contrato de comportamento

ID padrão: VERA-SPEC-NNN  
Função: Especificar regras, fluxos, estados, exceções, edge cases, interface, dados, acessibilidade, performance e integrações aplicáveis.  
Aplicação em Agente VERA: Agent/Prompt/Tool/Data/Safety/UX/Analytics specs devem ser separados e versionados.  
Regra: Quando necessário, decompor em Functional/UX/Design/Tech/API/Data Spec sem duplicar a fonte de verdade.

Perguntas obrigatórias

● Qual comportamento/estado/contrato?

● Quais exceções e edge cases?

● Quais requisitos de dados, UX, design, tech, segurança e acessibilidade se aplicam?

Entradas mínimas: ADR aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-SPEC-NNN versionado, relações explícitas e decisão/gate documentado para alimentar TEST.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

14. TEST — Plano e evidência de verificação

ID padrão: VERA-TEST-NNN  
Função: Definir casos, cenários, dados, esperado, resultado observado, defeitos e regressões para REQ/AC/SPEC.  
Aplicação em Agente VERA: golden cases por FRC, out-of-scope, safety, hallucination, privacy, structured schema, mobile e rollback.  
Regra: TEST deve produzir evidência, não opinião; falha impede RELEASE quando viola critério bloqueante.

Perguntas obrigatórias

● Qual REQ/AC está sendo verificado?

● Qual dado/cenário/resultado esperado?

● Qual evidência objetiva foi produzida?

Entradas mínimas: SPEC aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-TEST-NNN versionado, relações explícitas e decisão/gate documentado para alimentar RELEASE.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

15. RELEASE — Publicação controlada

ID padrão: VERA-RELEASE-NNN  
Função: Registrar versão, escopo, ambiente/canal, data, artefatos, migrações, rollback, feature flags, notas e aprovação.  
Aplicação em Agente VERA: feature flag, observabilidade e rollback antes de ampliar tráfego.  
Regra: RELEASE não apaga versões anteriores e deve apontar TEST e ADR/RFC relevantes.

Perguntas obrigatórias

● O que exatamente está sendo publicado?

● Quais testes/decisões suportam go-live?

● Como rollback e compatibilidade funcionam?

Entradas mínimas: TEST aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-RELEASE-NNN versionado, relações explícitas e decisão/gate documentado para alimentar KPI.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

16. KPI — Observação de resultado real

ID padrão: VERA-KPI-NNN  
Função: Medir adoção, uso, comportamento, outcome, qualidade e satisfação depois da entrega, preservando definição, fórmula, evento, janela e limitações.  
Aplicação em Agente VERA: North Star e eventos já definidos no PRD; converter depois por cohorts e não apenas cadastro.  
Regra: KPI não prova causalidade por si só; deve ser interpretado no contexto do experimento/release.

Perguntas obrigatórias

● Qual evento/fórmula/janela?

● Que outcome ele aproxima?

● Que conclusão ele não permite sozinho?

Entradas mínimas: RELEASE aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-KPI-NNN versionado, relações explícitas e decisão/gate documentado para alimentar LEARNING.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

17. LEARNING — Aprendizado governado

ID padrão: VERA-LEARNING-NNN  
Função: Registrar o que mudou, hipótese confirmada/refutada/parcial, evidências, limitações, decisão resultante e quais artefatos precisam ser atualizados.  
Aplicação em Agente VERA: feedback deve gerar RC-LEARN e revisar produto/catalogo somente via cadeia de decisão.  
Regra: LEARNING fecha o ciclo e pode gerar nova EVID, PROBLEM, RFC ou revisão de PRD; histórico não deve ser destruído.

Perguntas obrigatórias

● O que aprendemos e com que confiança?

● Qual hipótese mudou?

● Qual artefato será criado/revisado a seguir?

Entradas mínimas: KPI aplicável, IDs upstream, owner, estado, fontes/refs e contexto.  
Saída mínima: objeto VERA-LEARNING-NNN versionado, relações explícitas e decisão/gate documentado para alimentar nova EVID/PROBLEM/RFC.  
Critério de pronto: nenhum campo crítico indefinido; afirmações não suportadas marcadas como hipótese/inferência; downstream consegue consumir o artefato sem reconstruir premissas.

C. Matriz de rastreabilidade mínima

|Origem    |Deve rastrear para                        |Proibição                                    |  
|----------|------------------------------------------|---------------------------------------------|  
|EVID      |PROBLEM, claims, SPEC/KPI quando aplicável|transformar evidência em solução sem problema|  
|PROBLEM   |ICP, JOURNEY, JTBD                        |tema amplo sem impacto/contexto              |  
|JTBD/VALUE|BRD/PRD                                   |pular direto para feature                    |  
|BRD/PRD   |REQ/AC                                    |requisito sem origem                         |  
|RFC       |ADR/DEC                                   |tratar proposta como decisão                 |  
|ADR       |SPEC                                      |decisão sem consequência executável          |  
|SPEC      |TEST                                      |implementação sem contrato verificável       |  
|TEST      |RELEASE                                   |release sem gate                             |  
|RELEASE   |KPI                                       |medir sem versão/coorte                      |  
|KPI       |LEARNING                                  |dashboard sem decisão/aprendizado            |

D. Definition of Done do domínio

O domínio é considerado governado quando existe pelo menos um encadeamento completo e rastreável do problema prioritário até learning; nenhum requisito ativo é órfão; decisões persistentes possuem ADR/DEC; specs têm testes correspondentes; releases conhecem sua versão de conteúdo/dados/experiência; KPIs possuem definição e proprietário; e todo aprendizado gera ação documental explícita. Para itens ainda não suportados pelo corpus, o estado correto é GAP ou CORPUS_DERIVED, nunca APPROVED por inferência.

  

7. MASTER INDEX recomendado

```csv  
id,domain,doc_type,status,version,owner,source_status,upstream_ids,downstream_ids,evidence_refs,decision_refs,test_refs,kpi_refs,last_review  
BLOG-PROBLEM-001,BLOG,PROBLEM,DRAFT,v01,,CORPUS_DIRECT,,,,,,,  
EDITORIAL-EVID-001,EDITORIAL,EVID,APPROVED,v01,,CORPUS_DIRECT,,,,,,,  
CMS-PRD-001,CMS,PRD,DRAFT,v01,,CORPUS_DIRECT,,,,,,,  
OFICINA-PRD-001,OFICINA,PRD,DRAFT,v00,,CORPUS_DERIVED,,,,,,,  
MAPA-PRD-001,MAPA,PRD,APPROVED,v1.0,,CORPUS_DIRECT,,,,,,,  
VERA-PRD-001,VERA,PRD,APPROVED,v01,,CORPUS_DIRECT,,,,,,,  
```

8. Ordem de preenchimento recomendada

9. Não preencher os 18 documentos de todos os domínios mecanicamente. Primeiro registrar os EVID/PROBLEM prioritários e os documentos já existentes.

10. Fazer reconciliação dos IDs atuais do corpus com este catálogo; preservar IDs canônicos existentes como RC-KNW-001, PRD-RC-SCAN-001, RC-DV-001, SCHEMA-RC-SOLUTION-004 e PRD-001 em vez de renomeá-los retroativamente.

11. Criar registros de equivalência canonical_id ↔ governance_type ↔ domain no MASTER INDEX.

12. Prioridade inicial: EDITORIAL e VERA já possuem cadeia mais madura; MAPA possui PRD/SPEC/ADR/handoff; BLOG precisa consolidar BRD/PRD próprio; CMS precisa transformar regras operacionais em schema/PRD; OFICINA começa em EVID/Discovery porque o corpus direto está ausente.

13. Qualquer novo produto do macro Blog deve herdar esta governança e declarar explicitamente quais etapas são N/A, com justificativa, em vez de simplesmente omiti-las.

14. Fonte e limite epistemológico

Este documento formaliza o material entregue. Ele preserva a cadeia documental do corpus e especializa os domínios a partir dos artefatos encontrados no pacote BLOG. Onde o corpus não fornece um documento direto — especialmente Oficina de Ferramentas — a estrutura foi marcada como derivada/hipótese e deve passar por EVID/Discovery antes de ser tratada como requisito aprovado. Não foram introduzidas evidências externas para preencher essas lacunas.