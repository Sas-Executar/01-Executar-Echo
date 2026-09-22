import type { CognitiveMap, Framework } from "@repo/knowledge";
import { searchFrameworks } from "@repo/knowledge";
import { allSolutions, isActionUsable } from "@repo/solution-store";
import { CAPABILITIES } from "./capabilities";
import {
  NOT_APPLICABLE,
  type VeraAction,
  type VeraEnvelope,
  type VeraEvidence,
} from "./envelope";
import { classifyIntent, fold } from "./intent";

export interface VeraRequest {
  readonly question: string;
  /** The route the reader asked from, for grounding. */
  readonly route: string;
  readonly map: CognitiveMap;
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
export function respond(request: VeraRequest): VeraEnvelope {
  const { question, route, map } = request;
  const intent = classifyIntent(question);
  const needle = fold(question);

  const artifacts_read: string[] = [];
  const decisions: string[] = [];
  const evidence: VeraEvidence[] = [];
  const next_actions: VeraAction[] = [];
  const unresolved: string[] = [];
  const not_applicable: Record<string, string> = {};

  decisions.push(`Intenção classificada como "${intent}".`);

  /* ---- 1. Ground the question in the cognitive map ------------------ */

  const matchedNodes = map.nodes
    .filter((node) => tokensOf(needle).some((t) => fold(node.label).includes(t)))
    .slice(0, 5);

  if (matchedNodes.length > 0) {
    artifacts_read.push("SCHEMA-RC-SOLUTION-004 · graph_data.json");
    decisions.push(
      `Capacidade knowledge.search_map: ${matchedNodes.length} nó(s) correspondentes.`
    );

    for (const node of matchedNodes) {
      const edge = map.edges.find(
        (candidate) =>
          (candidate.source === node.id || candidate.target === node.id) &&
          candidate.evidence_ref
      );
      const record = edge?.evidence_ref
        ? map.evidence.find(
            (item) =>
              item.evidence_id === edge.evidence_ref ||
              item.claim_id === edge.evidence_ref
          )
        : undefined;

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
  }

  /* ---- 2. Frameworks ------------------------------------------------ */

  let frameworks: Framework[] = [];
  if (intent === "apply_framework" || matchedNodes.length === 0) {
    // Searched per meaningful token rather than on the whole sentence:
    // "que framework uso para analisar o mercado" matches nothing as a
    // single needle, while "analisar" and "mercado" each match. Results
    // are merged in token order and de-duplicated.
    frameworks = dedupeById(
      tokensOf(needle).flatMap((token) => searchFrameworks(token, 3))
    ).slice(0, 3);
    if (frameworks.length > 0) {
      artifacts_read.push("SKILL-EXE-SF-001 · catalog/frameworks.jsonl");
      decisions.push(
        `Capacidade knowledge.select_framework: ${frameworks.length} sugerido(s). A seleção sugere; não decide.`
      );
      for (const framework of frameworks) {
        next_actions.push({
          label: `${framework.name} — ${framework.domain_name}`,
          href: `/frameworks/${framework.slug}`,
          rationale: framework.purpose,
        });
      }
    }
  }

  /* ---- 3. Solutions ------------------------------------------------- */

  if (intent === "find_tool") {
    const solutions = allSolutions().filter((solution) => {
      const haystack = fold(
        [
          solution.identity.solution_name,
          solution.public_layer?.problem_statement,
          solution.card?.content?.short_description,
        ]
          .filter(Boolean)
          .join(" ")
      );
      return tokensOf(needle).some((token) => haystack.includes(token));
    });

    if (solutions.length > 0) {
      artifacts_read.push("D19 solution-store · solution contracts");
      decisions.push(
        `Capacidade store.find_solution: ${solutions.length} solução(ões) declaram este problema.`
      );
      for (const solution of solutions) {
        next_actions.push({
          label: solution.identity.solution_name,
          href: `/oficina/${solution.identity.slug}`,
          rationale:
            solution.public_layer?.three_p_n_three?.problema_que_resolve ??
            "Contrato de solução publicado na Oficina.",
        });

        // Availability is never implied. If Start has nowhere to go, the
        // gap is reported rather than the button being offered.
        if (!isActionUsable(solution.card?.actions?.primary)) {
          unresolved.push(
            `${solution.identity.solution_name} ainda não tem destino público para iniciar.`
          );
        }
      }
    } else {
      unresolved.push(
        "Nenhuma solução da Oficina declara este problema no seu contrato."
      );
    }
  }

  /* ---- 4. Status ---------------------------------------------------- */

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

  const status = grounded
    ? unresolved.length > 0
      ? "partial"
      : "completed"
    : "blocked";

  return {
    status,
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

/** Registered capabilities, for the surface to display honestly. */
export const registeredCapabilities = () => CAPABILITIES;

/**
 * Words worth matching on. Portuguese stopwords and one/two-letter
 * fragments would otherwise match nearly every node in the graph and
 * make the grounding meaningless.
 */
const STOPWORDS = new Set([
  "que", "qual", "quais", "como", "por", "para", "com", "sem", "uma", "meu",
  "minha", "dos", "das", "nao", "sim", "isso", "esse", "essa", "ser", "tem",
  "faz", "mais", "menos", "muito", "onde", "quando", "quem", "sobre", "the",
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

function tokensOf(text: string): string[] {
  return text
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3 && !STOPWORDS.has(token));
}
