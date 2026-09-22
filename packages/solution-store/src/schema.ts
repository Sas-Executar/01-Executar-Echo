import { z } from "zod";

/**
 * The public projection of `SUPER_SCHEMA_SOLUTION` v1.4.1
 * (LANCAMENTO `D19__assets-e-cta/solution-store/`).
 *
 * This is deliberately a *subset*: the Super Schema carries commercial
 * production briefs, internal control rows and handoff bundles that the
 * storefront has no business rendering. What is modelled here is what a
 * reader needs in order to decide whether a solution fits their problem.
 *
 * Field names are kept in the source's snake_case rather than
 * camel-cased, so a record on screen can be traced back to the YAML it
 * came from without a mapping table.
 */

export const lifecycleStateSchema = z.enum([
  "INGESTED",
  "CLASSIFIED",
  "SCHEMA_IN_PROGRESS",
  "SCHEMA_COMPLETE",
  "BUNDLE_READY",
  "IN_EDITORIAL_PRODUCTION",
  "ASSETS_READY",
  "QA_READY",
  "STORE_READY",
  "PUBLISHED",
  "DEPRECATED",
]);
export type LifecycleState = z.infer<typeof lifecycleStateSchema>;

export const identitySchema = z.object({
  solution_id: z.string(),
  solution_name: z.string(),
  slug: z.string(),
  solution_type: z.string().nullable().optional(),
  product_type: z.string(),
  product_subtype: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  source_file_ref: z.string().nullable().optional(),
});

export const professionRefSchema = z.object({
  profession_id: z.string(),
  relevance: z.string().nullable().optional(),
  use_case_refs: z.array(z.string()).nullable().optional(),
  rationale: z.string().nullable().optional(),
});

export const classificationSchema = z.object({
  areas: z
    .object({
      primary: z.string().nullable().optional(),
      secondary: z.array(z.string()).nullable().optional(),
      original_categories: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
  professions: z
    .object({
      primary: z.array(professionRefSchema).nullable().optional(),
      related: z.array(professionRefSchema).nullable().optional(),
      evidence_status: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  task_types: z.array(z.string()).nullable().optional(),
  artifact_types: z.array(z.string()).nullable().optional(),
  semantic_tags: z.array(z.string()).nullable().optional(),
  node_keys: z.array(z.string()).nullable().optional(),
});

/** The 3P+N3 block: problem, process, progress, and three next steps. */
export const threePn3Schema = z.object({
  problema_que_resolve: z.string().nullable().optional(),
  processo_aplicado: z.string().nullable().optional(),
  progresso_pretendido: z.string().nullable().optional(),
  next: z.record(z.string(), z.string().nullable()).nullable().optional(),
});

export const publicLayerSchema = z.object({
  problem_statement: z.string().nullable().optional(),
  target_user: z.string().nullable().optional(),
  three_p_n_three: threePn3Schema.nullable().optional(),
  tutorial: z
    .object({
      title: z.string().nullable().optional(),
      introduction: z.string().nullable().optional(),
      instructions: z.array(z.string()).nullable().optional(),
      expected_result: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  practical_example: z
    .object({
      title: z.string().nullable().optional(),
      scenario: z.string().nullable().optional(),
      input_example: z.string().nullable().optional(),
      transformation: z.string().nullable().optional(),
      output_example: z.string().nullable().optional(),
      before_state: z.string().nullable().optional(),
      after_state: z.string().nullable().optional(),
      why_it_shines: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const capabilityContractSchema = z.object({
  process_applied: z.string().nullable().optional(),
  intended_progress: z.string().nullable().optional(),
  hero_use_case: z.string().nullable().optional(),
  input_required: z.array(z.string()).nullable().optional(),
  output_generated: z.array(z.string()).nullable().optional(),
  dependencies: z.array(z.string()).nullable().optional(),
  limitations: z.array(z.string()).nullable().optional(),
});

/**
 * `usage_fit` carries both halves on purpose: where the tool helps, and
 * where reaching for it is the wrong move. A storefront that renders only
 * `best_use_cases` turns a contract into an advertisement, so
 * `risk_of_use` is rendered alongside it.
 */
export const usageFitSchema = z.object({
  best_use_cases: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        problem: z.string().nullable().optional(),
        scenario: z.string().nullable().optional(),
        why_this_tool: z.string().nullable().optional(),
        expected_gain: z.string().nullable().optional(),
        fit_conditions: z.array(z.string()).nullable().optional(),
        evidence_refs: z.array(z.string()).nullable().optional(),
      })
    )
    .nullable()
    .optional(),
  risk_of_use: z
    .array(
      z.object({
        id: z.string(),
        scenario: z.string().nullable().optional(),
        failure_mode: z.string().nullable().optional(),
        overkill_reason: z.string().nullable().optional(),
        better_alternative: z.string().nullable().optional(),
        severity: z.string().nullable().optional(),
        likelihood: z.string().nullable().optional(),
        mitigation: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
});

export const definitionOfDoneSchema = z.object({
  G1_SCHEMA_COMPLETE: z.boolean().nullable().optional(),
  G2_BUNDLE_COMPLETE: z.boolean().nullable().optional(),
  G3_EDITORIAL_ASSETS_COMPLETE: z.boolean().nullable().optional(),
  G4_QA_COMPLETE: z.boolean().nullable().optional(),
  G5_STORE_SUBMISSION_COMPLETE: z.boolean().nullable().optional(),
  G6_PUBLISHED: z.boolean().nullable().optional(),
});

export const cardActionSchema = z.object({
  type: z.string(),
  label: z.string().nullable().optional(),
  enabled: z.boolean().nullable().optional(),
  target: z.string().nullable().optional(),
});

export const storeCardSchema = z.object({
  variant: z.string().nullable().optional(),
  solution_id: z.string().nullable().optional(),
  content: z
    .object({
      eyebrow: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      short_description: z.string().nullable().optional(),
      product_type: z.string().nullable().optional(),
      primary_area: z.string().nullable().optional(),
      professions: z.array(z.string()).nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
  actions: z
    .object({
      primary: cardActionSchema.nullable().optional(),
      secondary: cardActionSchema.nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const onboardingSchema = z.object({
  entry_action: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  steps: z
    .array(
      z.object({
        id: z.string(),
        role: z.string().nullable().optional(),
        title: z.string(),
        body: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
});

export const solutionSchema = z.object({
  identity: identitySchema,
  classification: classificationSchema.nullable().optional(),
  public_layer: publicLayerSchema.nullable().optional(),
  capability_contract: capabilityContractSchema.nullable().optional(),
  usage_fit: usageFitSchema.nullable().optional(),
  lifecycle: z
    .object({
      current_state: lifecycleStateSchema.nullable().optional(),
      next_state: z.string().nullable().optional(),
      blockers: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
  definition_of_done: definitionOfDoneSchema.nullable().optional(),
  scoring: z
    .object({
      methodology_id: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
      overall: z.record(z.string(), z.unknown()).nullable().optional(),
    })
    .nullable()
    .optional(),
  card: storeCardSchema.nullable().optional(),
  onboarding: onboardingSchema.nullable().optional(),
  release: z.record(z.string(), z.unknown()).nullable().optional(),
  source: z
    .object({
      repository: z.string(),
      path: z.string(),
      note: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type Solution = z.infer<typeof solutionSchema>;
export type StoreCard = z.infer<typeof storeCardSchema>;
export type CardAction = z.infer<typeof cardActionSchema>;
