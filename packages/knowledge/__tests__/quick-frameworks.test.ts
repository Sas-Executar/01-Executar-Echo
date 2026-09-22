/**
 * Quick Frameworks EXECUTAR is supplied content, not generated content —
 * same discipline as the cognitive map (ADR-MAPA-001): a regenerated or
 * truncated set fails here rather than rendering with quietly missing
 * factors.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCognitiveMap } from "../src/load-cognitive-map";
import { allFrameworks } from "../src/load-frameworks";
import {
  allQuickFrameworks,
  quickFrameworkByFactorId,
  quickFrameworkBySlug,
  quickFrameworksInGroup,
  searchQuickFrameworks,
} from "../src/load-quick-frameworks";
import {
  EXPECTED_QUICK_FRAMEWORK_COUNT,
  QUICK_FRAMEWORK_MACROGROUPS,
  quickFrameworkSchema,
} from "../src/quick-frameworks";

const SOURCES_DIR = path.join(
  import.meta.dirname,
  "../data/quick-frameworks/sources"
);
const CHECKSUM_OK = /: OK$/;

describe("the supplied Quick Framework sources", () => {
  it("match the checksums they shipped with", () => {
    const output = execFileSync("sha256sum", ["-c", "CHECKSUMS.sha256"], {
      cwd: SOURCES_DIR,
      encoding: "utf8",
    });
    const lines = output.trim().split("\n");
    expect(lines).toHaveLength(24); // 23 documents + the traceability CSV
    for (const line of lines) {
      expect(line).toMatch(CHECKSUM_OK);
    }
  });

  it("has the count the source declares: 20 factors + 3 founding articles", () => {
    expect(allQuickFrameworks()).toHaveLength(EXPECTED_QUICK_FRAMEWORK_COUNT);
  });

  it("validates every record against the shipped schema", () => {
    const raw = JSON.parse(
      readFileSync(
        path.join(import.meta.dirname, "../data/quick-frameworks/records.json"),
        "utf8"
      )
    );
    expect(() => quickFrameworkSchema.array().parse(raw)).not.toThrow();
  });
});

describe("the loader is deployable", () => {
  it("imports the records instead of reading them from disk", () => {
    // Regression guard, same failure mode already shipped once on
    // /mapa: a runtime file read isn't traced into the serverless
    // bundle. Comments are stripped first: this file's own header names
    // "readFileSync" in prose.
    const source = readFileSync(
      path.join(import.meta.dirname, "../src/load-quick-frameworks.ts"),
      "utf8"
    )
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(source).not.toContain("readFileSync");
    expect(source).not.toContain("node:fs");
  });
});

describe("the 20 factor concepts line up with the Mapa Cognitivo", () => {
  it("shares factor_id 1:1 with the Mapa's 20 vendored solutions — not by coincidence", () => {
    const map = loadCognitiveMap();
    const mapFactorIds = new Set(map.solutions.map((s) => s.factor_id));
    const qfFactorIds = allQuickFrameworks()
      .map((qf) => qf.factorId)
      .filter((id): id is string => Boolean(id));

    expect(qfFactorIds).toHaveLength(20);
    for (const id of qfFactorIds) {
      expect(mapFactorIds.has(id)).toBe(true);
    }
    expect(quickFrameworkByFactorId("FRC-01")?.slug).toBe(
      "tailoring-do-projeto"
    );
  });

  it("leaves the 3 article-level records without a factorId", () => {
    const articleRecords = allQuickFrameworks().filter((qf) =>
      qf.id.startsWith("ARTICLE-")
    );
    expect(articleRecords).toHaveLength(3);
    for (const record of articleRecords) {
      expect(record.factorId).toBeUndefined();
    }
  });
});

describe("naming: this is the real Quick Frameworks product", () => {
  it("uses slugs that never collide with the 299-framework catalog", () => {
    const catalogSlugs = new Set(allFrameworks().map((f) => f.slug));
    for (const qf of allQuickFrameworks()) {
      expect(catalogSlugs.has(qf.slug)).toBe(false);
    }
  });

  it("groups every factor concept into one of the 5 declared macrogroups", () => {
    const factorRecords = allQuickFrameworks().filter((qf) => qf.factorId);
    for (const qf of factorRecords) {
      expect(QUICK_FRAMEWORK_MACROGROUPS).toContain(qf.macrogrupo);
    }
    // Every group actually has at least one member — a group is real,
    // not just declared.
    for (const group of QUICK_FRAMEWORK_MACROGROUPS) {
      expect(quickFrameworksInGroup(group).length).toBeGreaterThan(0);
    }
  });
});

describe("search", () => {
  it("finds a factor by its id", () => {
    const results = searchQuickFrameworks("frc-13");
    expect(results.some((r) => r.factorId === "FRC-13")).toBe(true);
  });

  it("finds the founding article by title fragment", () => {
    const results = searchQuickFrameworks("risco cognitivo");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns nothing for an empty query rather than the whole set", () => {
    expect(searchQuickFrameworks("")).toHaveLength(0);
  });
});

describe("every record carries what a detail page renders", () => {
  it("has non-empty prose in every required block", () => {
    for (const qf of allQuickFrameworks()) {
      expect(qf.contexto.length).toBeGreaterThan(0);
      expect(qf.progressoEsperado.length).toBeGreaterThan(0);
      expect(qf.aviso.length).toBeGreaterThan(0);
      expect(qf.visaoSistemaMermaid).toContain("flowchart");
      expect(qf.next.mermaid).toContain("flowchart");
      expect(qf.next.passos.length).toBeGreaterThan(0);
      expect(qf.fontes.length).toBeGreaterThan(0);
    }
  });

  it("resolves a record by slug", () => {
    const qf = quickFrameworkBySlug("tailoring-do-projeto");
    expect(qf?.factorId).toBe("FRC-01");
  });
});
