import { z } from "zod";

/**
 * VERA's output envelope, from `04_RUNTIME_IO_CONTRACT.txt`.
 *
 * The contract's `NO-EMPTY-FIELD` rule is modelled rather than
 * documented: an inapplicable field carries the literal
 * `"not_applicable"` plus a reason. A blank field and a field that does
 * not apply are different statements, and collapsing them is how an
 * agent's output starts looking more complete than it is.
 */
export const NOT_APPLICABLE = "not_applicable";

export const veraStatusSchema = z.enum(["completed", "partial", "blocked"]);
export type VeraStatus = z.infer<typeof veraStatusSchema>;

/** A cited source. VERA never asserts without one. */
export const veraEvidenceSchema = z.object({
  /** Where this came from: a node id, an article slug, a framework id. */
  ref: z.string(),
  statement: z.string(),
  /**
   * The limit on how far the statement may be read, when the source
   * carries one. Cognitive-map evidence always does.
   */
  interpretation_limit: z.string().nullable(),
  /** A–E, where the source declares it. */
  epistemic_class: z.string().nullable(),
});
export type VeraEvidence = z.infer<typeof veraEvidenceSchema>;

export const veraActionSchema = z.object({
  label: z.string(),
  href: z.string(),
  rationale: z.string(),
});
export type VeraAction = z.infer<typeof veraActionSchema>;

export const veraEnvelopeSchema = z.object({
  status: veraStatusSchema,
  /** The route this answer is grounded in. */
  canonical_route: z.string(),
  /** What VERA actually read, so the answer can be checked. */
  artifacts_read: z.array(z.string()),
  /** Decisions taken — which skill, which framework, and why. */
  decisions: z.array(z.string()),
  evidence: z.array(veraEvidenceSchema),
  /** Named gaps. A question VERA cannot ground is said, not guessed. */
  unresolved: z.array(z.string()),
  next_actions: z.array(veraActionSchema),
  /**
   * Prose answer. `null` when the generative layer is off — the
   * deterministic layer still returns evidence and next actions, and
   * says that synthesis is unavailable rather than simulating it.
   */
  answer: z.string().nullable(),
  /** Why a field is inapplicable, keyed by field name. */
  not_applicable: z.record(z.string(), z.string()).default({}),
});
export type VeraEnvelope = z.infer<typeof veraEnvelopeSchema>;
