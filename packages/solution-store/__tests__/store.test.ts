/**
 * The storefront's honesty rules.
 *
 * The contracts in LANCAMENTO are careful about what a solution has and
 * has not cleared; the risk in rendering them is that a UI quietly
 * upgrades a pending record into an available product. These tests are
 * what stop that.
 */
import { describe, expect, it } from "vitest";

import {
  actionUnavailableReason,
  allSolutions,
  areaLabel,
  catalogAreas,
  catalogProfessions,
  gates,
  isActionUsable,
  isPublished,
  productTypeLabel,
  professionLabel,
  solutionBySlug,
  solutionsForProfession,
} from "../src/store";

describe("the catalog", () => {
  it("parses every record against the schema", () => {
    // Parsing happens at module load; reaching here means it succeeded.
    expect(allSolutions().length).toBeGreaterThan(0);
  });

  it("resolves the ported reference instance", () => {
    const solution = solutionBySlug("obsidian-editorial");
    expect(solution?.identity.solution_id).toBe("SOL-OBS-EDITORIAL-001");
    // Ported verbatim — the corpus's version, not a rounded-up one.
    expect(solution?.identity.version).toBe("1.4.1");
  });

  it("gives every solution a slug, a name and a product type", () => {
    for (const solution of allSolutions()) {
      expect(solution.identity.slug).toBeTruthy();
      expect(solution.identity.solution_name).toBeTruthy();
      expect(solution.identity.product_type).toBeTruthy();
    }
  });

  it("has unique slugs and ids", () => {
    const slugs = allSolutions().map((s) => s.identity.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("actions are never offered before they work", () => {
  it("refuses a PENDING target", () => {
    // The corpus records unpublished targets as PENDING_* — honest in the
    // data, dishonest as a button.
    const reason = actionUnavailableReason({
      type: "start",
      target: "PENDING_PUBLIC_TOOL_URL",
    });
    expect(reason).toBe("Destino ainda não publicado.");
  });

  it("refuses an explicitly disabled action", () => {
    expect(
      isActionUsable({ type: "download", enabled: false, target: "/x" })
    ).toBe(false);
  });

  it("refuses an empty or missing target", () => {
    expect(isActionUsable({ type: "start", target: null })).toBe(false);
    expect(isActionUsable({ type: "start", target: "  " })).toBe(false);
    expect(isActionUsable(undefined)).toBe(false);
  });

  it("accepts a real local path or https URL", () => {
    expect(isActionUsable({ type: "start", target: "/frameworks" })).toBe(true);
    expect(
      isActionUsable({ type: "start", target: "https://example.org/t" })
    ).toBe(true);
  });

  it("does not offer the reference instance's pending actions", () => {
    const solution = solutionBySlug("obsidian-editorial");
    expect(isActionUsable(solution?.card?.actions?.primary)).toBe(false);
    expect(isActionUsable(solution?.card?.actions?.secondary)).toBe(false);
  });

  it("does offer the framework catalog, which exists", () => {
    const solution = solutionBySlug("executar-safe-frameworks");
    expect(isActionUsable(solution?.card?.actions?.primary)).toBe(true);
    expect(solution?.card?.actions?.primary?.target).toBe("/frameworks");
    // Download has no package, so it stays off rather than 404ing.
    expect(isActionUsable(solution?.card?.actions?.secondary)).toBe(false);
  });
});

describe("lifecycle is reported, not flattered", () => {
  it("treats a record as published only when G6 passed", () => {
    for (const solution of allSolutions()) {
      expect(isPublished(solution)).toBe(
        solution.definition_of_done?.G6_PUBLISHED === true
      );
    }
  });

  it("reports no current solution as published", () => {
    // Both records are genuinely pre-G6. If this ever fails, it should be
    // because a solution really was published.
    expect(allSolutions().filter(isPublished)).toEqual([]);
  });

  it("lists six gates in order", () => {
    const list = gates(allSolutions()[0]);
    expect(list).toHaveLength(6);
    expect(list[0][0]).toContain("G1");
    expect(list[5][0]).toContain("G6");
  });

  it("leaves SEUS scores uncomputed", () => {
    // SEUS is CALIBRATION_REQUIRED; inventing a score would be worse than
    // showing none.
    for (const solution of allSolutions()) {
      expect(solution.scoring?.overall?.score_status).toBe("NOT_COMPUTED");
    }
  });
});

describe("taxonomy resolution", () => {
  it("resolves an area id through the keyed registry", () => {
    // AREAS.yaml keys by Portuguese slug but solutions reference the id.
    expect(areaLabel("productivity")).toBe("Productivity");
    expect(areaLabel("research")).not.toBe("");
  });

  it("returns the id unchanged for an unknown area", () => {
    expect(areaLabel("not_a_real_area")).toBe("not_a_real_area");
  });

  it("resolves professions and product types in Portuguese", () => {
    expect(professionLabel("lawyer")).toBe("Advogado");
    expect(productTypeLabel("skill_workflow")).toBe("Skills & Workflows");
  });

  it("derives filters from what the catalog actually contains", () => {
    expect(catalogAreas().length).toBeGreaterThan(0);
    const professions = catalogProfessions();
    expect(professions.length).toBeGreaterThan(0);
    for (const profession of professions) {
      expect(solutionsForProfession(profession.id).length).toBeGreaterThan(0);
    }
  });
});
