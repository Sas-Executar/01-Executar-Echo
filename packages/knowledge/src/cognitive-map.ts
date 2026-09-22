import { z } from "zod";

/**
 * The cognitive map graph (`SCHEMA-RC-SOLUTION-004`).
 *
 * These schemas are a transcription of `data/cognitive-map/graph_schema.json`,
 * which ships with the data — they are not a guess at its shape. Parsing
 * through them means a malformed or substituted graph fails loudly at the
 * boundary instead of rendering as empty state.
 *
 * The graph is supplied, never generated. See `data/cognitive-map/PROVENANCE.md`
 * and `docs/adr/ADR-MAPA-001-mapa-reconciliation.md`.
 */

/**
 * Concentric layers, centre outwards. `CENTER` holds the person and their
 * objective; R1–R7 move outward through factors, mechanisms and controls.
 */
export const mapLayerSchema = z.enum([
  "CENTER",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
]);
export type MapLayer = z.infer<typeof mapLayerSchema>;

/**
 * Epistemic class, from the corpus-wide scheme in
 * `#01-ADR/Schema-Metodologia-Evidencia-APP-Executar.md`:
 * A observed · B primary · C published · D internal · E inferred.
 *
 * Displayed rather than hidden: a "D" claim and a "C" claim carry very
 * different weight, and collapsing them would misrepresent the corpus.
 */
export const epistemicClassSchema = z.enum(["A", "B", "C", "D", "E"]);
export type EpistemicClass = z.infer<typeof epistemicClassSchema>;

export const mapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  layer: mapLayerSchema,
  group: z.string().optional(),
  epistemic_class: epistemicClassSchema,
  status: z.string(),
  source_ref: z.string().optional(),
  notes: z.string().optional(),
});
export type MapNode = z.infer<typeof mapNodeSchema>;

export const mapEdgeSchema = z.object({
  edge_id: z.string(),
  source: z.string(),
  relation: z.string(),
  target: z.string(),
  /** Relative strength, 1–3. Not a probability and not a risk score. */
  weight: z.number().int().min(1).max(3).optional(),
  epistemic_class: epistemicClassSchema,
  evidence_ref: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
});
export type MapEdge = z.infer<typeof mapEdgeSchema>;

/**
 * A conceptual solution attached to a risk factor (FRC-01…20).
 *
 * `solution_status` and `scanner_v1_eligible` matter on screen: most rows
 * are `CONCEPTUAL_DEFINED_NOT_SCANNER_AUTHORIZED` / `NO`, and presenting
 * those as available tools would overstate what exists.
 */
export const mapSolutionSchema = z
  .object({
    factor_id: z.string(),
    factor_name: z.string(),
    conceptual_solution: z.string().optional(),
    technology_solution: z.string().optional(),
    engine: z.string().optional(),
    solution_status: z.string().optional(),
    scanner_v1_eligible: z.string().optional(),
    preventive_control: z.string().optional(),
    detective_control: z.string().optional(),
    corrective_control: z.string().optional(),
    action: z.string().optional(),
    metrics: z.string().optional(),
    evidence_status: z.string().optional(),
    source_ref: z.string().optional(),
  })
  .loose();
export type MapSolution = z.infer<typeof mapSolutionSchema>;

/**
 * An authorized statement plus the limit on how far it may be read.
 *
 * `interpretation_limit` is not a footnote — it is the guard against the
 * exact misreading the corpus warns about ("Não dizer que cada fator é um
 * risco"). It travels with the statement wherever the statement is shown.
 */
export const mapEvidenceSchema = z
  .object({
    evidence_id: z.string(),
    claim_id: z.string().optional(),
    evidence_class: z.string().optional(),
    epistemic_class: epistemicClassSchema.optional(),
    authorized_statement: z.string(),
    source: z.string().optional(),
    interpretation_limit: z.string().optional(),
    status: z.string().optional(),
    source_ref: z.string().optional(),
  })
  .loose();
export type MapEvidence = z.infer<typeof mapEvidenceSchema>;

export const mapMetadataSchema = z
  .object({
    schema_id: z.literal("SCHEMA-RC-SOLUTION-004"),
    version: z.string(),
    project: z.string(),
    /**
     * "Fator != Vulnerabilidade != Exposição != Risco". Carried in the
     * data so the distinction cannot be lost between the spreadsheet and
     * the screen.
     */
    governance_rule: z.string(),
  })
  .loose();
export type MapMetadata = z.infer<typeof mapMetadataSchema>;

export const cognitiveMapSchema = z.object({
  metadata: mapMetadataSchema,
  nodes: z.array(mapNodeSchema),
  edges: z.array(mapEdgeSchema),
  solutions: z.array(mapSolutionSchema),
  evidence: z.array(mapEvidenceSchema),
});
export type CognitiveMap = z.infer<typeof cognitiveMapSchema>;

/**
 * The shape of the supplied graph, asserted so a substitution is loud.
 * A regenerated graph would almost certainly differ here — which is the
 * intent (ADR-MAPA-001).
 */
export const EXPECTED_COUNTS = {
  nodes: 237,
  edges: 528,
  solutions: 20,
  evidence: 13,
} as const;

/** Rendered wherever the source has no value. Never a guess, never blank. */
export const NOT_AVAILABLE = "Não disponível";
