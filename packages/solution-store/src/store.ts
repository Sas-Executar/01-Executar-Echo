import safeFrameworks from "../data/solutions/executar-safe-frameworks.json" with {
  type: "json",
};
import obsidianEditorial from "../data/solutions/obsidian-editorial.json" with {
  type: "json",
};
import taxonomyJson from "../data/taxonomy.json" with { type: "json" };
import { type CardAction, type Solution, solutionSchema } from "./schema";

/**
 * The store's catalog.
 *
 * Two solutions, both backed by material that actually exists:
 * `obsidian-editorial` is the corpus's own filled reference instance,
 * ported verbatim; `executar-safe-frameworks` is authored from the skill
 * in this repository. Nothing here is a placeholder entry added to make
 * the grid look fuller.
 */
const solutions: Solution[] = solutionSchema
  .array()
  .parse([safeFrameworks, obsidianEditorial]);

export const allSolutions = (): Solution[] => solutions;

export const solutionBySlug = (slug: string): Solution | undefined =>
  solutions.find((solution) => solution.identity.slug === slug);

/* ------------------------------------------------------------ actions */

/**
 * Why an action can't be offered yet, or `null` when it can.
 *
 * The store must not render a button that goes nowhere. The corpus's own
 * card records targets as `PENDING_PUBLIC_TOOL_URL` /
 * `PENDING_DOWNLOAD_PACKAGE_URL` — honest placeholders in the data, which
 * would become a dishonest button on screen. A target is usable only if
 * it is a real path or URL, and `enabled` has not been set to false.
 */
export function actionUnavailableReason(
  action: CardAction | null | undefined
): string | null {
  if (!action) {
    return "Ação não definida para esta solução.";
  }
  if (action.enabled === false) {
    return "Ainda não disponível.";
  }
  const target = action.target?.trim();
  if (!target) {
    return "Destino ainda não definido.";
  }
  if (target.startsWith("PENDING")) {
    return "Destino ainda não publicado.";
  }
  if (!(target.startsWith("/") || target.startsWith("https://"))) {
    return "Destino ainda não publicado.";
  }
  return null;
}

export const isActionUsable = (
  action: CardAction | null | undefined
): boolean => actionUnavailableReason(action) === null;

/* ---------------------------------------------------------- lifecycle */

/**
 * Whether the solution has actually cleared publication (G6).
 *
 * Both current records are pre-G6. Presenting them as published would
 * misstate the pipeline they are genuinely in, so the storefront labels
 * their real lifecycle state instead.
 */
export const isPublished = (solution: Solution): boolean =>
  solution.definition_of_done?.G6_PUBLISHED === true;

/** The gates, in order, as `[name, passed]` — for showing real progress. */
export function gates(solution: Solution): [string, boolean][] {
  const dod = solution.definition_of_done;
  return [
    ["G1 Schema", dod?.G1_SCHEMA_COMPLETE === true],
    ["G2 Bundle", dod?.G2_BUNDLE_COMPLETE === true],
    ["G3 Assets", dod?.G3_EDITORIAL_ASSETS_COMPLETE === true],
    ["G4 QA", dod?.G4_QA_COMPLETE === true],
    ["G5 Submissão", dod?.G5_STORE_SUBMISSION_COMPLETE === true],
    ["G6 Publicado", dod?.G6_PUBLISHED === true],
  ];
}

/* ----------------------------------------------------------- taxonomy */

interface TaxonomyEntry {
  readonly id: string;
  readonly label?: string;
  readonly label_pt_BR?: string;
}

const taxonomy = taxonomyJson as Record<string, unknown>;

function entries(registry: string, key: string): TaxonomyEntry[] {
  const reg = taxonomy[registry] as Record<string, unknown> | undefined;
  const list = reg?.[key];
  return Array.isArray(list) ? (list as TaxonomyEntry[]) : [];
}

/**
 * `AREAS.yaml` keys its taxonomy by a Portuguese slug ("produtividade")
 * while the stable id lives *inside* the value (`id: "productivity"`), and
 * solutions reference the id. So the lookup scans values rather than
 * indexing by key — indexing by key silently returns the id unchanged,
 * which looks like a working label until someone reads the screen.
 */
export function areaLabel(id: string | null | undefined): string | null {
  if (!id) {
    return null;
  }
  const areas = taxonomy.AREAS as Record<string, unknown> | undefined;
  const map = areas?.taxonomia as
    | Record<string, { id?: string; label?: string }>
    | undefined;
  for (const entry of Object.values(map ?? {})) {
    if (entry?.id === id) {
      return entry.label ?? id;
    }
  }
  return id;
}

export function professionLabel(id: string): string {
  const match = entries("PROFESSIONS", "professions").find((p) => p.id === id);
  return match?.label_pt_BR ?? match?.label ?? id;
}

export function productTypeLabel(id: string | null | undefined): string {
  if (!id) {
    return "—";
  }
  const match = entries("PRODUCT_TYPES", "product_types").find(
    (t) => t.id === id
  );
  return match?.label ?? id;
}

export function taskTypeLabel(id: string): string {
  const match = entries("TASK_TYPES", "task_types").find((t) => t.id === id);
  return match?.label ?? id;
}

/** Distinct primary areas present in the catalog, for the area filter. */
export function catalogAreas(): Array<{ id: string; label: string }> {
  const ids = new Set<string>();
  for (const solution of solutions) {
    const primary = solution.classification?.areas?.primary;
    if (primary) {
      ids.add(primary);
    }
  }
  return [...ids]
    .map((id) => ({ id, label: areaLabel(id) ?? id }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

/** Professions that at least one solution names, for browse-by-role. */
export function catalogProfessions(): Array<{ id: string; label: string }> {
  const ids = new Set<string>();
  for (const solution of solutions) {
    for (const p of solution.classification?.professions?.primary ?? []) {
      ids.add(p.profession_id);
    }
  }
  return [...ids]
    .map((id) => ({ id, label: professionLabel(id) }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

export function solutionsForProfession(professionId: string): Solution[] {
  return solutions.filter((solution) =>
    (solution.classification?.professions?.primary ?? []).some(
      (p) => p.profession_id === professionId
    )
  );
}
