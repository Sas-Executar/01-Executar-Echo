import graphJson from "../data/cognitive-map/graph_data.json" with {
  type: "json",
};
import {
  type CognitiveMap,
  cognitiveMapSchema,
  type MapEdge,
  type MapEvidence,
  type MapLayer,
  type MapNode,
} from "./cognitive-map";

/**
 * Imported as a module rather than read with `fs`.
 *
 * The first version resolved a path from `import.meta.url` and called
 * `readFileSync`. That works locally and in tests, and fails in
 * production: Vercel traces the serverless bundle from static imports,
 * so a data file only referenced through a computed path is not shipped
 * with the function. Every route that touched the graph — `/mapa`,
 * the article page and `POST /api/vera` — returned 500 in production
 * while `/frameworks` and `/oficina`, which import their JSON, were
 * fine. `load-frameworks.ts` already documented this trap; the graph
 * simply had not been moved across.
 *
 * Importing also removes the per-cold-start file read, and the bundler
 * fails the build if the file goes missing instead of the route failing
 * at request time.
 */
let cached: CognitiveMap | null = null;

/**
 * Validates and returns the supplied graph.
 *
 * Parsed through the schema rather than cast: the graph is vendored
 * data, and a truncated or substituted file should fail here — visibly,
 * once — instead of rendering as a map with missing regions that looks
 * like a design decision.
 */
export function loadCognitiveMap(): CognitiveMap {
  if (cached) {
    return cached;
  }

  cached = cognitiveMapSchema.parse(graphJson);
  return cached;
}

/** Nodes on one concentric layer, in source order. */
export function nodesByLayer(map: CognitiveMap, layer: MapLayer): MapNode[] {
  return map.nodes.filter((node) => node.layer === layer);
}

/** Distinct `group` values, for the macro selector. */
export function macroGroups(map: CognitiveMap): string[] {
  const groups = new Set<string>();
  for (const node of map.nodes) {
    if (node.group) {
      groups.add(node.group);
    }
  }
  return [...groups].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function findNode(map: CognitiveMap, id: string): MapNode | undefined {
  return map.nodes.find((node) => node.id === id);
}

export function findEdge(
  map: CognitiveMap,
  edgeId: string
): MapEdge | undefined {
  return map.edges.find((edge) => edge.edge_id === edgeId);
}

/** Every relation touching a node, in either direction. */
export function edgesForNode(map: CognitiveMap, nodeId: string): MapEdge[] {
  return map.edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );
}

/**
 * The evidence an edge points at.
 *
 * `evidence_ref` is free text in the source — sometimes an `EVD-NN` id,
 * sometimes a prose citation like "TP-001 framework". Only the former can
 * resolve to a record; the latter is shown as the reference it is, rather
 * than being coerced into a match.
 */
export function evidenceForEdge(
  map: CognitiveMap,
  edge: MapEdge
): MapEvidence | undefined {
  if (!edge.evidence_ref) {
    return undefined;
  }
  return map.evidence.find(
    (item) =>
      item.evidence_id === edge.evidence_ref ||
      item.claim_id === edge.evidence_ref
  );
}

/** Directly connected nodes, deduplicated. */
export function neighbours(map: CognitiveMap, nodeId: string): MapNode[] {
  const ids = new Set<string>();
  for (const edge of edgesForNode(map, nodeId)) {
    ids.add(edge.source === nodeId ? edge.target : edge.source);
  }
  return map.nodes.filter((node) => ids.has(node.id));
}

/**
 * Case- and accent-insensitive search over labels and ids.
 *
 * Accent folding matters here: the corpus is Portuguese, and a reader
 * typing "execucao" should still find "Execução".
 */
export function searchNodes(map: CognitiveMap, query: string): MapNode[] {
  const needle = fold(query);
  if (!needle) {
    return [];
  }
  return map.nodes.filter(
    (node) =>
      fold(node.label).includes(needle) || fold(node.id).includes(needle)
  );
}

function fold(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
