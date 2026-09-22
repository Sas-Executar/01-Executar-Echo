import quickFrameworksJson from "../data/quick-frameworks/records.json" with {
  type: "json",
};
import { type QuickFramework, quickFrameworkSchema } from "./quick-frameworks";

/**
 * Imported rather than read with `fs` — same reason as
 * `load-frameworks.ts`: a runtime file read isn't traced into the
 * serverless bundle (the exact class of 500 this repo already shipped
 * on `/mapa`, the article and `/api/vera`).
 */
const quickFrameworks: QuickFramework[] = quickFrameworkSchema
  .array()
  .parse(quickFrameworksJson);

export const allQuickFrameworks = (): QuickFramework[] => quickFrameworks;

export const quickFrameworkBySlug = (
  slug: string
): QuickFramework | undefined => quickFrameworks.find((qf) => qf.slug === slug);

export const quickFrameworkByFactorId = (
  factorId: string
): QuickFramework | undefined =>
  quickFrameworks.find((qf) => qf.factorId === factorId);

export const quickFrameworksInGroup = (macrogrupo: string): QuickFramework[] =>
  quickFrameworks.filter((qf) => qf.macrogrupo === macrogrupo);

/**
 * Deterministic search over title, frase-síntese and factor id — same
 * fold-and-substring approach as `searchFrameworks`, so a tag on a blog
 * post that names a factor ("fadiga-decisoria", "tailoring") surfaces
 * its Quick Framework the same way it already surfaces a Mapa concept
 * or a catalog framework.
 */
export function searchQuickFrameworks(
  query: string,
  limit = 20
): QuickFramework[] {
  const needle = fold(query);
  if (!needle) {
    return [];
  }

  const scored: Array<{ qf: QuickFramework; score: number }> = [];

  for (const qf of quickFrameworks) {
    const titulo = fold(qf.titulo);
    let score = 0;

    if (titulo === needle) {
      score = 100;
    } else if (titulo.startsWith(needle)) {
      score = 80;
    } else if (titulo.includes(needle)) {
      score = 60;
    } else if (qf.factorId && fold(qf.factorId).includes(needle)) {
      score = 50;
    } else if (fold(qf.fraseSintese).includes(needle)) {
      score = 20;
    } else if (fold(qf.contexto).includes(needle)) {
      score = 10;
    }

    if (score > 0) {
      scored.push({ qf, score });
    }
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || a.qf.titulo.localeCompare(b.qf.titulo, "pt-BR")
    )
    .slice(0, limit)
    .map((entry) => entry.qf);
}

function fold(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
