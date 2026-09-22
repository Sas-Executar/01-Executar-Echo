import { z } from "zod";

/**
 * The Quick Frameworks catalog.
 *
 * Source: `skills/executar-safe-frameworks/catalog/frameworks.jsonl`
 * (`SKILL-EXE-SF-001` v1.0.0) — 299 framework records across the 23
 * ecosystem domains, already in this repository. The catalog is the
 * skill's own data and is not rewritten here; `data/frameworks/` holds a
 * JSON projection of the same rows so they can be imported by the bundler
 * instead of read from disk at request time.
 *
 * The skill's governing invariant applies to anything rendered from this
 * data: *a framework organises evidence; it does not create evidence.*
 * These records describe what each framework is for. They make no claim
 * about a particular situation, and the UI must not present them as if
 * they did.
 */

export const frameworkSchema = z.object({
  /** `FW-D{domain}-{n}`, stable. */
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  domain_id: z.string(),
  domain_name: z.string(),
  purpose: z.string(),
  related_domains: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  search_tags: z.array(z.string()).default([]),
});
export type Framework = z.infer<typeof frameworkSchema>;

export const frameworkDomainSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  related_domains: z.array(z.string()).default([]),
  framework_count: z.number().int(),
});
export type FrameworkDomain = z.infer<typeof frameworkDomainSchema>;

/** The catalog ships 299 records; asserted so a truncated copy is loud. */
export const EXPECTED_FRAMEWORK_COUNT = 299;
