import { z } from "zod";

/**
 * Quick Frameworks EXECUTAR — the product's own framework format, one
 * concept per factor, 13 fixed blocks (Origem/etimologia, Contexto,
 * 5W2H, Referência padrão-ouro, Problema existente/solucionado,
 * Processo, Visão do sistema, Progresso esperado, Aviso, Next 01-02-03,
 * Fontes, Infográfico).
 *
 * This is distinct from `./frameworks.ts` (the 299-record catalog of
 * general-purpose frameworks — SWOT, PESTEL, 5 Whys — from
 * `skills/executar-safe-frameworks`), which despite the name it carried
 * until now is a different product: it organises evidence about
 * anything, and creates none of its own. A Quick Framework EXECUTAR
 * makes a specific claim about a specific cognitive-risk factor, backed
 * by its own sources.
 *
 * Source: `data/quick-frameworks/sources/` (vendored verbatim from
 * `RC-KNW-001_QUICK_FRAMEWORKS_V1.zip` and
 * `RC-KNW-001_SERIE_ARTIGOS_01_02_03_QF_V1.zip`, see PROVENANCE.md
 * there), converted by `scripts/ingest-quick-frameworks.ts` into
 * `data/quick-frameworks/records.json` — not read at runtime, same
 * discipline as the cognitive-map bundle.
 *
 * 20 of the 23 records carry `factorId` (`FRC-01`..`FRC-20`) — the same
 * ids as the 20 `solutions[]` already vendorized in
 * `data/cognitive-map/graph_data.json`. Not a coincidence: these are the
 * editorial explanation of the same 20 factors the Mapa Cognitivo
 * already materialises as data.
 */

const fivewtwohRow = z.object({
  variavel: z.string(),
  sintese: z.string(),
});

const fourPart = z.object({
  definicao: z.string(),
  identificacao: z.string(),
  explicacao: z.string(),
  fechamento: z.string(),
});

export const quickFrameworkSchema = z.object({
  /** `FRC-01`..`FRC-20`, or `ARTICLE-RC-001`..`ARTICLE-RC-003`. */
  id: z.string(),
  slug: z.string(),
  titulo: z.string(),
  fraseSintese: z.string(),
  /** Present only for the 20 factor concepts — links 1:1 to the Mapa. */
  factorId: z.string().optional(),
  /** One of the 5 groups the FRC catalog's own traceability matrix uses. Absent for the 3 article-level records. */
  macrogrupo: z.string().optional(),
  origem: z.object({
    termo: z.string(),
    significado: z.string(),
    etimologia: z.string(),
  }),
  contexto: z.string(),
  cincoWDoisH: z.array(fivewtwohRow),
  referencia: z.object({
    texto: z.string(),
    autorCurto: z.string(),
  }),
  problemaExistente: fourPart,
  problemaSolucionado: fourPart,
  processo: z.array(z.string()),
  visaoSistemaMermaid: z.string(),
  progressoEsperado: z.string(),
  aviso: z.string(),
  next: z.object({
    passos: z.array(z.string()),
    mermaid: z.string(),
  }),
  fontes: z.array(
    z.object({ label: z.string(), href: z.string(), nota: z.string() })
  ),
  infografico: z.object({
    premissa1: z.string(),
    premissa2: z.string(),
    premissa3: z.string(),
    conclusao: z.string(),
    ilustracaoTopo: z.string(),
    relacionados: z.array(z.string()),
  }),
});
export type QuickFramework = z.infer<typeof quickFrameworkSchema>;

/** 20 FRC concepts + 3 founding articles' Quick Framework block. */
export const EXPECTED_QUICK_FRAMEWORK_COUNT = 23;

/** The 5 macro-groups the FRC traceability matrix assigns factors to. */
export const QUICK_FRAMEWORK_MACROGROUPS = [
  "Sistema e arquitetura de suporte",
  "Pessoa e cognição",
  "Informação e interface",
  "Tarefa e fluxo de execução",
  "Ambiente e contexto",
] as const;
