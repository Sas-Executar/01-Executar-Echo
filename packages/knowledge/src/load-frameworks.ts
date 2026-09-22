import domainsJson from "../data/frameworks/domains.json" with { type: "json" };
import frameworksJson from "../data/frameworks/frameworks.json" with { type: "json" };
import {
  type Framework,
  type FrameworkDomain,
  frameworkDomainSchema,
  frameworkSchema,
} from "./frameworks";

/**
 * Imported rather than read with `fs`: the catalog is immutable build
 * input, so letting the bundler trace it avoids both a runtime file read
 * and the deployment trap where the data file isn't traced into the
 * serverless function.
 */
const frameworks: Framework[] = frameworkSchema
  .array()
  .parse(frameworksJson);

const domains: FrameworkDomain[] = frameworkDomainSchema
  .array()
  .parse(domainsJson);

export const allFrameworks = (): Framework[] => frameworks;
export const allFrameworkDomains = (): FrameworkDomain[] => domains;

export const frameworkBySlug = (slug: string): Framework | undefined =>
  frameworks.find((framework) => framework.slug === slug);

export const frameworksInDomain = (domainId: string): Framework[] =>
  frameworks.filter((framework) => framework.domain_id === domainId);

export const frameworkDomainById = (
  id: string
): FrameworkDomain | undefined => domains.find((domain) => domain.id === id);

/**
 * Deterministic search over name, aliases, purpose and tags.
 *
 * Mirrors what `scripts/select_frameworks.py` does in the skill: it
 * *suggests*, it never decides. Ranking is by where the match landed —
 * an exact name beats an alias, which beats a tag, which beats prose —
 * so the ordering is explainable rather than a similarity score nobody
 * can audit.
 */
export function searchFrameworks(query: string, limit = 20): Framework[] {
  const needle = fold(query);
  if (!needle) {
    return [];
  }

  const scored: Array<{ framework: Framework; score: number }> = [];

  for (const framework of frameworks) {
    const name = fold(framework.name);
    let score = 0;

    if (name === needle) {
      score = 100;
    } else if (name.startsWith(needle)) {
      score = 80;
    } else if (name.includes(needle)) {
      score = 60;
    } else if (framework.aliases.some((a) => fold(a).includes(needle))) {
      score = 50;
    } else if (framework.search_tags.some((t) => fold(t).includes(needle))) {
      score = 30;
    } else if (fold(framework.purpose).includes(needle)) {
      score = 20;
    } else if (fold(framework.domain_name).includes(needle)) {
      score = 10;
    }

    if (score > 0) {
      scored.push({ framework, score });
    }
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.framework.name.localeCompare(b.framework.name, "pt-BR")
    )
    .slice(0, limit)
    .map((entry) => entry.framework);
}

/**
 * Frameworks related to `framework`, by shared domain then by related
 * domains. Used to offer a next step that is actually adjacent rather
 * than a random sample of the catalog.
 */
export function relatedFrameworks(
  framework: Framework,
  limit = 6
): Framework[] {
  const sameDomain = frameworks.filter(
    (other) =>
      other.domain_id === framework.domain_id && other.id !== framework.id
  );
  const adjacent = frameworks.filter(
    (other) =>
      other.domain_id !== framework.domain_id &&
      framework.related_domains.includes(other.domain_id)
  );
  return [...sameDomain, ...adjacent].slice(0, limit);
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
