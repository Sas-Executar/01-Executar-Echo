/**
 * The generative layer (ADR-VERA-001).
 *
 * Adds prose synthesis over the context the deterministic layer already
 * retrieved and cited. It is off unless `VERA_LLM_ENABLED` is set *and* a
 * provider key exists — `executar-nf-web` currently carries neither, so
 * production runs the deterministic layer and says so.
 *
 * The important property is what happens when it is off: the envelope's
 * `answer` stays `null` and the surface reports that synthesis is
 * unavailable. It never fabricates a paragraph to look complete, which is
 * the specific failure the contract rules out.
 */

export interface GenerativeStatus {
  readonly enabled: boolean;
  /** Why it is off, for display. `null` when enabled. */
  readonly reason: string | null;
}

export function generativeStatus(
  env: Record<string, string | undefined> = process.env
): GenerativeStatus {
  if (env.VERA_LLM_ENABLED !== "true") {
    return {
      enabled: false,
      reason:
        "A camada generativa está desligada (VERA_LLM_ENABLED não está definido).",
    };
  }

  const hasKey = Boolean(env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY);
  if (!hasKey) {
    return {
      enabled: false,
      reason:
        "A camada generativa está habilitada, mas nenhuma chave de provedor foi configurada.",
    };
  }

  return { enabled: true, reason: null };
}
