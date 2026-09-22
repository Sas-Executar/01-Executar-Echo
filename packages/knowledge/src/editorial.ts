/**
 * The editorial contract, transcribed from the LANCAMENTO corpus.
 *
 * Sources, all `CORPUS_DIRECT`:
 *  - `#06-PILARES-TAXONOMIA/taxonomia.yaml` (from `MASTER_EDITORIAL_…xlsx`,
 *    sheet `07_TAXONOMIES`)
 *  - `#04-LINHA-EDITORIAL/arquitetura-narrativa.yaml` (sheet
 *    `04_CONTENT_ARCHITECTURE`)
 *  - `#18-NEWSLETTER-CTA/ctas.yaml` (sheet `05_CTA_ROUTING`)
 *
 * Transcribed rather than parsed at runtime: the source is a handful of
 * small YAML files in a different repository, and typing them here gives
 * the compiler a say in whether an article's pillar actually exists. The
 * values are verbatim — where the source has no code, the code is `null`
 * here too rather than being invented.
 */

export interface TaxonomyTerm {
  /** Stable short code, or `null` where the source defines none. */
  readonly code: string | null;
  readonly value: string;
  readonly definition: string;
}

/**
 * The seven canonical editorial pillars.
 *
 * The source supplies no codes for these, so slugs are derived from the
 * labels for routing. That derivation is presentational — it is not
 * asserted back onto the taxonomy as if it were canonical.
 */
export const EDITORIAL_PILLARS: readonly TaxonomyTerm[] = [
  { code: null, value: "Cognição e Neurodivergência", definition: "Pilar editorial canônico." },
  { code: null, value: "Comportamento e Autogerenciamento", definition: "Pilar editorial canônico." },
  { code: null, value: "Riscos Cognitivos", definition: "Pilar editorial canônico." },
  { code: null, value: "Processos e Projetos Neuroadaptados", definition: "Pilar editorial canônico." },
  { code: null, value: "Controles e Ergonomia", definition: "Pilar editorial canônico." },
  { code: null, value: "Tecnologia e Automação", definition: "Pilar editorial canônico." },
  { code: null, value: "Aplicação e Evidência", definition: "Pilar editorial canônico." },
] as const;

/** Reader awareness, from unaware of the problem to ready to act. */
export const AWARENESS_LEVELS: readonly TaxonomyTerm[] = [
  { code: null, value: "Inconsciente do problema", definition: "Nível de consciência." },
  { code: null, value: "Consciente do problema", definition: "Nível de consciência." },
  { code: null, value: "Consciente do mecanismo", definition: "Nível de consciência." },
  { code: null, value: "Consciente do risco", definition: "Nível de consciência." },
  { code: null, value: "Consciente da solução", definition: "Nível de consciência." },
  { code: null, value: "Consciente do método", definition: "Nível de consciência." },
  { code: null, value: "Consciente do produto", definition: "Nível de consciência." },
  { code: null, value: "Pronto para ação", definition: "Nível de consciência." },
] as const;

export const FUNNEL_STAGES: readonly TaxonomyTerm[] = [
  { code: "DESCOBERTA", value: "Descoberta", definition: "Etapa do funil editorial." },
  { code: "RESOLUÇÃO", value: "Resolução", definition: "Etapa do funil editorial." },
  { code: "APROFUNDAMENTO", value: "Aprofundamento", definition: "Etapa do funil editorial." },
  { code: "CONVERSÃO", value: "Conversão", definition: "Etapa do funil editorial." },
  { code: "RETENÇÃO", value: "Retenção", definition: "Etapa do funil editorial." },
] as const;

/** Proprietary solution families — the vocabulary the Oficina inherits. */
export const SOLUTION_FAMILIES: readonly TaxonomyTerm[] = [
  { code: "CONVERSOR", value: "Conversor", definition: "Família proprietária de solução editorial." },
  { code: "SCANNER", value: "Scanner", definition: "Família proprietária de solução editorial." },
  { code: "MAPA", value: "Mapa", definition: "Família proprietária de solução editorial." },
  { code: "CHECKLIST", value: "Checklist", definition: "Família proprietária de solução editorial." },
  { code: "PRISMA", value: "Prisma", definition: "Família proprietária de solução editorial." },
  { code: "PROTOCOLO", value: "Protocolo", definition: "Família proprietária de solução editorial." },
] as const;

export const ASSET_FORMATS: readonly TaxonomyTerm[] = [
  { code: "CAR", value: "Carrossel", definition: "Formato derivado do mesmo problema/solução." },
  { code: "REEL", value: "Reel", definition: "Formato derivado do mesmo problema/solução." },
  { code: "STORY", value: "Story", definition: "Formato derivado do mesmo problema/solução." },
  { code: "PROMPT", value: "Prompt", definition: "Formato derivado do mesmo problema/solução." },
  { code: "HTML", value: "HTML", definition: "Formato derivado do mesmo problema/solução." },
  { code: "ART", value: "Artigo", definition: "Formato derivado do mesmo problema/solução." },
  { code: "IMG", value: "Imagem", definition: "Formato derivado do mesmo problema/solução." },
  { code: "PDF", value: "PDF", definition: "Formato derivado do mesmo problema/solução." },
  { code: "PRISMA", value: "Prisma", definition: "Formato derivado do mesmo problema/solução." },
  { code: "NEWS", value: "Newsletter", definition: "Formato derivado do mesmo problema/solução." },
  { code: "CTA", value: "CTA", definition: "Formato derivado do mesmo problema/solução." },
  { code: "LINKEDIN", value: "LinkedIn", definition: "Formato derivado do mesmo problema/solução." },
] as const;

/**
 * The nine-stage narrative architecture.
 *
 * This is the spine the corpus asks to see in the *behaviour* of the
 * content and its navigation, not only in documentation — so the article
 * page renders these stages as real structure and the `rule` on each one
 * is editorial policy, not a note.
 */
export interface NarrativeStage {
  readonly order: number;
  readonly stage: string;
  readonly question: string;
  readonly purpose: string;
  readonly rule: string;
}

export const NARRATIVE_ARCHITECTURE: readonly NarrativeStage[] = [
  {
    order: 1,
    stage: "Cena",
    question: "Onde isso acontece?",
    purpose: "Contextualizar a situação antes de explicar.",
    rule: "Começar pelo ambiente, não pela teoria.",
  },
  {
    order: 2,
    stage: "Problema",
    question: "O que está custando caro?",
    purpose: "Nomear o problema em termos observáveis.",
    rule: "Descrever sem diagnosticar.",
  },
  {
    order: 3,
    stage: "Reconhecimento",
    question: "Isso acontece comigo?",
    purpose: "Permitir autoidentificação por sinais observáveis.",
    rule: "Sinais observáveis, nunca rótulos clínicos.",
  },
  {
    order: 4,
    stage: "Explicação",
    question: "Por que acontece?",
    purpose: "Apresentar mecanismo e evidência.",
    rule: "Separar evidência de inferência.",
  },
  {
    order: 5,
    stage: "Solução",
    question: "O que reduz o custo?",
    purpose: "Apresentar a intervenção possível.",
    rule: "Não prometer sucesso; reduzir exposição e custo.",
  },
  {
    order: 6,
    stage: "Demonstração",
    question: "Como isso se parece na prática?",
    purpose: "Mostrar prova visual ou resultado observável.",
    rule: "Demonstrar, não afirmar.",
  },
  {
    order: 7,
    stage: "Ferramenta",
    question: "Com o que eu faço isso?",
    purpose: "Encaminhar para conversor, checklist ou mapa.",
    rule: "A ferramenta serve ao problema, não o contrário.",
  },
  {
    order: 8,
    stage: "Resultado",
    question: "Como eu sei que mudou?",
    purpose: "Definir métrica e registrar linha de base.",
    rule: "Registrar baseline antes de comparar.",
  },
  {
    order: 9,
    stage: "CTA",
    question: "Qual é o próximo passo?",
    purpose: "Encaminhar para uma única próxima ação.",
    rule: "Um asset = uma próxima ação principal.",
  },
] as const;

/**
 * The five canonical CTAs, routed by funnel stage.
 *
 * `href` is the local route each destination resolves to in this
 * application. Destinations with nowhere to point yet carry `null`
 * rather than a placeholder link — an inert CTA is a broken promise, so
 * callers skip those instead of rendering a dead button.
 */
export interface CallToAction {
  readonly id: string;
  readonly name: string;
  readonly intent: string;
  readonly funnelStage: string;
  readonly nextStep: string;
  readonly destinationType: string;
  readonly destination: string;
  readonly primaryMetric: string;
  readonly copy: string;
  readonly href: string | null;
}

export const CTAS: readonly CallToAction[] = [
  {
    id: "RC-CTA-001",
    name: "Teste com seu relatório",
    intent: "Uso",
    funnelStage: "Resolução",
    nextStep: "Usar ferramenta",
    destinationType: "Ferramenta",
    destination: "Conversor de Relatório",
    primaryMetric: "Usos",
    copy: "Teste com seu relatório e compare o antes e depois.",
    // The Conversor is not a published solution in the store yet
    // (`RC-SOLUTION-001` is still an unresolved id collision in the
    // corpus), so this CTA has no destination to offer.
    href: null,
  },
  {
    id: "RC-CTA-002",
    name: "Acesse o guia",
    intent: "Aprofundamento",
    funnelStage: "Aprofundamento",
    nextStep: "Abrir guia/recurso",
    destinationType: "Conteúdo",
    destination: "Guia Custo Cognitivo",
    primaryMetric: "Cliques",
    copy: "Acesse o guia e aplique o processo completo.",
    href: "/conceitos",
  },
  {
    id: "RC-CTA-003",
    name: "Veja o método completo",
    intent: "Autoridade",
    funnelStage: "Aprofundamento",
    nextStep: "Ler artigo/método",
    destinationType: "Blog",
    destination: "Gestão de Riscos Cognitivos",
    primaryMetric: "Leitura",
    copy: "Veja o método completo e entenda por que a intervenção funciona.",
    href: "/blog",
  },
  {
    id: "RC-CTA-004",
    name: "Envie seu problema",
    intent: "Pesquisa/Lead",
    funnelStage: "Conversão",
    nextStep: "Submeter problema",
    destinationType: "Formulário",
    destination: "Banco de Problemas Cognitivos",
    primaryMetric: "Submissões",
    copy: "Envie uma situação real para análise e transformação.",
    href: "/contact",
  },
  {
    id: "RC-CTA-005",
    name: "Peça ajuda",
    intent: "Comercial",
    funnelStage: "Conversão",
    nextStep: "Solicitar atendimento",
    destinationType: "Serviço",
    destination: "Consultoria Executar",
    primaryMetric: "Leads",
    copy: "Se o problema exige adaptação ao seu contexto, peça uma análise.",
    href: "/contact",
  },
] as const;

/** The CTAs that currently have somewhere to send the reader. */
export const activeCtas = (): CallToAction[] =>
  CTAS.filter((cta) => cta.href !== null);

/** Picks the CTA routed to a funnel stage, if one is defined and active. */
export const ctaForStage = (stage: string): CallToAction | undefined =>
  activeCtas().find((cta) => cta.funnelStage === stage);

/**
 * URL slug for a taxonomy term that has no canonical code.
 * Presentational only — never written back as if it were canonical.
 */
export const termSlug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const pillarBySlug = (slug: string): TaxonomyTerm | undefined =>
  EDITORIAL_PILLARS.find((pillar) => termSlug(pillar.value) === slug);

/**
 * The author of record. From `#12-AUTORES-BIOS/DOC-0019__Sobre-o-autor.md`
 * — one real author, transcribed, not a roster of placeholders.
 */
export const AUTHOR = {
  name: "Leonardo Pimentel",
  title: "Psicopedagogia · TDAH · Gestão de Projetos Neuroinclusivos",
  tagline: "Entenda → Estruture → Execute",
  bio: "Escreve sobre o custo cognitivo da execução: o que aumenta o esforço de trabalhar, por que isso raramente é uma questão de disciplina, e quais condições do sistema podem ser mudadas.",
} as const;
