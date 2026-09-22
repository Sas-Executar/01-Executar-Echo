/**
 * Intent classification.
 *
 * Deterministic and inspectable on purpose: the routing decision is
 * reported in the envelope's `decisions`, so a reader can see why VERA
 * went where it did. A model-scored classifier would make that
 * explanation unavailable exactly when it matters.
 */

export type Intent =
  | "understand_concept"
  | "find_tool"
  | "apply_framework"
  | "read_article"
  | "unknown";

interface IntentRule {
  readonly intent: Intent;
  readonly patterns: readonly RegExp[];
}

/**
 * Accent-insensitive because the corpus and its readers are Portuguese;
 * "o que e" must match "o que é".
 */
const RULES: readonly IntentRule[] = [
  {
    intent: "find_tool",
    patterns: [
      /\b(ferramenta|solucao|solucoes|oficina|loja|usar o que|com o que)\b/,
      /\bcomo (faco|fazer|comeco|comecar)\b/,
    ],
  },
  {
    intent: "apply_framework",
    patterns: [
      /\b(framework|modelo|swot|pestel|analise estruturada|analisar)\b/,
      /\bcomo (organizo|estruturo|comparo)\b/,
    ],
  },
  {
    intent: "read_article",
    patterns: [/\b(artigo|ler|leitura|texto|publicacao)\b/],
  },
  {
    intent: "understand_concept",
    patterns: [
      /\b(o que e|por que|porque|significa|conceito|mecanismo|fator|risco)\b/,
      /\bentender\b/,
    ],
  },
];

export function classifyIntent(question: string): Intent {
  const text = fold(question);

  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return rule.intent;
    }
  }

  return "unknown";
}

export function fold(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
