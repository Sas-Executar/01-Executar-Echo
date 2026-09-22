/**
 * VERA's capability registry (BLOG-13, ADR-VERA-001).
 *
 * Deny by default: a capability not listed here does not exist as far as
 * VERA is concerned. `mutates` marks anything that changes state, and
 * every such capability requires explicit confirmation — none is listed
 * yet, because VERA currently reads and routes only.
 */

export interface Capability {
  readonly id: string;
  readonly description: string;
  /** Whether invoking this changes state anywhere. */
  readonly mutates: boolean;
  /** Mutating capabilities may never run without explicit confirmation. */
  readonly requiresConfirmation: boolean;
}

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "knowledge.search_map",
    description:
      "Consulta o grafo cognitivo (SCHEMA-RC-SOLUTION-004) por conceito, fator, manifestação ou evidência.",
    mutates: false,
    requiresConfirmation: false,
  },
  {
    id: "knowledge.select_framework",
    description:
      "Seleciona frameworks do catálogo SKILL-EXE-SF-001 a partir da intenção declarada.",
    mutates: false,
    requiresConfirmation: false,
  },
  {
    id: "content.find_article",
    description: "Localiza artigos publicados relacionados a um conceito.",
    mutates: false,
    requiresConfirmation: false,
  },
  {
    id: "store.find_solution",
    description:
      "Localiza soluções da Oficina cujo contrato declara o problema em questão.",
    mutates: false,
    requiresConfirmation: false,
  },
] as const;

export const capabilityById = (id: string): Capability | undefined =>
  CAPABILITIES.find((capability) => capability.id === id);

/**
 * Whether VERA may invoke a capability unattended.
 *
 * Returns false for anything unregistered — the deny-by-default rule —
 * and for anything that mutates state, which needs a human to confirm.
 */
export function isAutonomouslyInvocable(id: string): boolean {
  const capability = capabilityById(id);
  if (!capability) {
    return false;
  }
  return !(capability.mutates || capability.requiresConfirmation);
}
