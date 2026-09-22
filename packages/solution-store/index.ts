/**
 * @repo/solution-store — the Oficina's catalog and contracts.
 *
 * Schemas are a public projection of `SUPER_SCHEMA_SOLUTION` v1.4.1 and
 * the taxonomy registries from LANCAMENTO `D19__assets-e-cta/solution-store`.
 *
 * Two rules the storefront inherits from those contracts and does not get
 * to override: an action whose target is still `PENDING_*` is not offered
 * as a button, and a solution that has not cleared G6 is not described as
 * published.
 */
export * from "./src/schema";
export * from "./src/store";
