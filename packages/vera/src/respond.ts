import type { CognitiveMap, Framework } from "@repo/knowledge";
import { searchFrameworks } from "@repo/knowledge";
import { allSolutions, isActionUsable } from "@repo/solution-store";
import { CAPABILITIES } from "./capabilities";
import type {
  VeraAction,
  VeraEnvelope,
  VeraEvidence,
  VeraStatus,
} from "./envelope";
import { classifyIntent, fold } from "./intent";

export interface VeraRequest {
  readonly map: CognitiveMap;
  readonly question: string;
  /** The route the reader asked from, for grounding. */
  readonly route: string;
}

/**
 * The deterministic half of VERA (ADR-VERA-001).
 *
 * Retrieval and routing over real corpora: the cognitive map, the
 * framework catalog and the Oficina's solution contracts. No model is
 * involved, so this half is fully testable and works with no API key.
 *
 * What it will not do, by construction:
 *  - assert anything it cannot cite; an ungrounded question comes back
 *    `blocked` with the gap named in `unresolved`;
 *  - separate an authorized statement from its interpretation limit;
 *  - offer a solution whose action has nowhere to go;
 *  - treat retrieved text as instruction. Node labels and article titles
 *    are data. Nothing read from the corpus can change what VERA does.
 */
/**
 * What one retrieval pass contributes to the envelope. Each pass reads a
 * different corpus and reports only what it found, so the passes compose
 * without any of them needing to know about the others.
 */
interface Contribution {
  readonly artifacts_read?: string[];
  readonly decisions?: string[];
  readonly evidence?: VeraEvidence[];
  readonly next_actions?: VeraAction[];
  readonly unresolved?: string[];
}

/** Pass 1 — ground the question in the cognitive map. */
function fromCognitiveMap(map: CognitiveMap, needle: string): Contribution {
  const tokens = tokensOf(needle);
  const matched = map.nodes
    .filter((node) => tokens.some((t) => fold(node.label).includes(t)))
    .slice(0, 5);

  if (matched.length === 0) {
    return {};
  }

  const evidence: VeraEvidence[] = [];
  const next_actions: VeraAction[] = [];

  for (const node of matched) {
    const record = evidenceNear(map, node.id);

    evidence.push({
      ref: node.id,
      statement: record?.authorized_statement ?? node.label,
      // Carried through rather than dropped: the limit is what keeps a
      // factor from being read as a risk.
      interpretation_limit: record?.interpretation_limit ?? null,
      epistemic_class: node.epistemic_class,
    });

    next_actions.push({
      label: `Ver "${node.label}" no Mapa`,
      href: `/mapa?no=${encodeURIComponent(node.id)}`,
      rationale: `Nó ${node.id} na camada ${node.layer}.`,
    });
  }

  return {
    artifacts_read: ["SCHEMA-RC-SOLUTION-004 · graph_data.json"],
    decisions: [
      `Capacidade knowledge.search_map: ${matched.length} nó(s) correspondentes.`,
    ],
    evidence,
    next_actions,
  };
}

/** The evidence record attached to a relation touching this node, if any. */
function evidenceNear(map: CognitiveMap, nodeId: string) {
  const edge = map.edges.find(
    (candidate) =>
      (candidate.source === nodeId || candidate.target === nodeId) &&
      candidate.evidence_ref
  );

  if (!edge?.evidence_ref) {
    return undefined;
  }

  return map.evidence.find(
    (item) =>
      item.evidence_id === edge.evidence_ref ||
      item.claim_id === edge.evidence_ref
  );
}

/** Pass 2 — suggest frameworks from the catalog. */
function fromFrameworks(needle: string): Contribution {
  // Searched per meaningful token rather than on the whole sentence:
  // "que framework uso para analisar o mercado" matches nothing as a
  // single needle, while "analisar" and "mercado" each match. Results
  // are merged in token order and de-duplicated.
  const frameworks = dedupeById(
    tokensOf(needle).flatMap((token) => searchFrameworks(token, 3))
  ).slice(0, 3);

  if (frameworks.length === 0) {
    return {};
  }

  return {
    artifacts_read: ["SKILL-EXE-SF-001 · catalog/frameworks.jsonl"],
    decisions: [
      `Capacidade knowledge.select_framework: ${frameworks.length} sugerido(s). A seleção sugere; não decide.`,
    ],
    next_actions: frameworks.map((framework) => ({
      label: `${framework.name} — ${framework.domain_name}`,
      href: `/frameworks/${framework.slug}`,
      rationale: framework.purpose,
    })),
  };
}

/** Pass 3 — find solutions whose contract declares this problem. */
function fromSolutions(needle: string): Contribution {
  const solutions = matchingSolutions(needle);

  if (solutions.length === 0) {
    return {
      unresolved: [
        "Nenhuma solução da Oficina declara este problema no seu contrato.",
      ],
    };
  }

  // Availability is never implied. If Start has nowhere to go, the gap
  // is reported rather than the button being offered.
  const unreachable = solutions
    .filter((solution) => !isActionUsable(solution.card?.actions?.primary))
    .map(
      (solution) =>
        `${solution.identity.solution_name} ainda não tem destino público para iniciar.`
    );

  return {
    artifacts_read: ["D19 solution-store · solution contracts"],
    decisions: [
      `Capacidade store.find_solution: ${solutions.length} solução(ões) declaram este problema.`,
    ],
    next_actions: solutions.map((solution) => ({
      label: solution.identity.solution_name,
      href: `/oficina/${solution.identity.slug}`,
      rationale:
        solution.public_layer?.three_p_n_three?.problema_que_resolve ??
        "Contrato de solução publicado na Oficina.",
    })),
    unresolved: unreachable,
  };
}

export function respond(request: VeraRequest): VeraEnvelope {
  const { question, route, map } = request;
  const intent = classifyIntent(question);
  const needle = fold(question);

  const fromMap = fromCognitiveMap(map, needle);

  // Frameworks are offered when the reader asked for one, or when the
  // map had nothing — a question the graph cannot answer may still be a
  // question a framework can structure.
  const wantsFrameworks =
    intent === "apply_framework" || (fromMap.evidence?.length ?? 0) === 0;

  const passes: Contribution[] = [
    fromMap,
    wantsFrameworks ? fromFrameworks(needle) : {},
    intent === "find_tool" ? fromSolutions(needle) : {},
  ];

  const artifacts_read = passes.flatMap((p) => p.artifacts_read ?? []);
  const decisions = [
    `Intenção classificada como "${intent}".`,
    ...passes.flatMap((p) => p.decisions ?? []),
  ];
  const evidence = passes.flatMap((p) => p.evidence ?? []);
  const next_actions = passes.flatMap((p) => p.next_actions ?? []);
  const unresolved = passes.flatMap((p) => p.unresolved ?? []);
  const not_applicable: Record<string, string> = {};

  const grounded = evidence.length > 0 || next_actions.length > 0;

  if (!grounded) {
    unresolved.push(
      "A pergunta não pôde ser ancorada no corpus disponível (mapa cognitivo, catálogo de frameworks, contratos da Oficina)."
    );
    not_applicable.evidence =
      "Nenhuma fonte correspondente; VERA não afirma sem citar.";
  }

  if (next_actions.length === 0) {
    not_applicable.next_actions =
      "Nenhum destino corresponde à pergunta no corpus disponível.";
  }

  return {
    status: statusFor(grounded, unresolved.length > 0),
    canonical_route: route,
    artifacts_read,
    decisions,
    evidence,
    unresolved,
    next_actions: next_actions.slice(0, 8),
    // Filled only by the generative layer, when it is enabled.
    answer: null,
    not_applicable,
  };
}

/** Solutions whose own contract names the problem the reader described. */
function matchingSolutions(needle: string) {
  const tokens = tokensOf(needle);
  return allSolutions().filter((solution) => {
    const haystack = fold(
      [
        solution.identity.solution_name,
        solution.public_layer?.problem_statement,
        solution.card?.content?.short_description,
      ]
        .filter(Boolean)
        .join(" ")
    );
    return tokens.some((token) => haystack.includes(token));
  });
}

/**
 * `blocked` when nothing could be grounded, `partial` when something was
 * grounded but a gap remains, `completed` otherwise. Kept as a named
 * function because the three-way distinction is the contract's, and a
 * nested ternary reads as though `partial` were an edge case.
 */
function statusFor(grounded: boolean, hasGaps: boolean): VeraStatus {
  if (!grounded) {
    return "blocked";
  }
  return hasGaps ? "partial" : "completed";
}

/** Registered capabilities, for the surface to display honestly. */
export const registeredCapabilities = () => CAPABILITIES;

/**
 * Words worth matching on. Portuguese stopwords and one/two-letter
 * fragments would otherwise match nearly every node in the graph and
 * make the grounding meaningless.
 */
const STOPWORDS = new Set([
  "que",
  "qual",
  "quais",
  "como",
  "por",
  "para",
  "com",
  "sem",
  "uma",
  "meu",
  "minha",
  "dos",
  "das",
  "nao",
  "sim",
  "isso",
  "esse",
  "essa",
  "ser",
  "tem",
  "faz",
  "mais",
  "menos",
  "muito",
  "onde",
  "quando",
  "quem",
  "sobre",
  "the",
]);

/** Keeps the first occurrence of each framework, preserving order. */
function dedupeById(items: Framework[]): Framework[] {
  const seen = new Set<string>();
  const out: Framework[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}

const NON_ALPHANUMERIC = /[^a-z0-9]+/;

function tokensOf(text: string): string[] {
  return text
    .split(NON_ALPHANUMERIC)
    .filter((token) => token.length > 3 && !STOPWORDS.has(token));
}
