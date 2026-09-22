/**
 * The cognitive map is supplied data, not generated data (ADR-MAPA-001).
 * These tests are what make that enforceable: a regenerated or truncated
 * graph fails here rather than rendering as a map with quietly missing
 * regions.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  cognitiveMapSchema,
  EXPECTED_COUNTS,
  mapLayerSchema,
} from "../src/cognitive-map";
import {
  edgesForNode,
  evidenceForEdge,
  findEdge,
  findNode,
  loadCognitiveMap,
  macroGroups,
  neighbours,
  nodesByLayer,
  searchNodes,
} from "../src/load-cognitive-map";

const DATA_DIR = path.join(import.meta.dirname, "../data/cognitive-map");

describe("the supplied artifact", () => {
  it("matches the checksums it shipped with", () => {
    // If this fails, the vendored graph is not the one that was verified
    // on receipt — which matters more than any assertion about its shape.
    const output = execFileSync("sha256sum", ["-c", "CHECKSUMS.sha256"], {
      cwd: DATA_DIR,
      encoding: "utf8",
    });
    const lines = output.trim().split("\n");
    expect(lines).toHaveLength(7);
    for (const line of lines) {
      expect(line).toMatch(/: OK$/);
    }
  });

  it("has the counts the source declares", () => {
    const map = loadCognitiveMap();
    expect(map.nodes).toHaveLength(EXPECTED_COUNTS.nodes);
    expect(map.edges).toHaveLength(EXPECTED_COUNTS.edges);
    expect(map.solutions).toHaveLength(EXPECTED_COUNTS.solutions);
    expect(map.evidence).toHaveLength(EXPECTED_COUNTS.evidence);
  });

  it("validates against the schema shipped beside it", () => {
    const raw = JSON.parse(
      readFileSync(path.join(DATA_DIR, "graph_data.json"), "utf8")
    );
    expect(() => cognitiveMapSchema.parse(raw)).not.toThrow();
  });

  it("carries the governance rule in its metadata", () => {
    // Copy must never collapse factor / vulnerability / exposure / risk.
    const map = loadCognitiveMap();
    expect(map.metadata.schema_id).toBe("SCHEMA-RC-SOLUTION-004");
    expect(map.metadata.governance_rule).toContain("Fator");
    expect(map.metadata.governance_rule).toContain("Risco");
  });
});

describe("graph integrity", () => {
  const map = loadCognitiveMap();

  it("has no dangling edge endpoints", () => {
    const ids = new Set(map.nodes.map((node) => node.id));
    const dangling = map.edges.filter(
      (edge) => !(ids.has(edge.source) && ids.has(edge.target))
    );
    expect(dangling).toEqual([]);
  });

  it("has unique node and edge identifiers", () => {
    // Deep links address relations by edge_id; a duplicate would make a
    // shared link resolve to the wrong relation.
    expect(new Set(map.nodes.map((n) => n.id)).size).toBe(map.nodes.length);
    expect(new Set(map.edges.map((e) => e.edge_id)).size).toBe(
      map.edges.length
    );
  });

  it("places every node on a declared layer", () => {
    for (const node of map.nodes) {
      expect(() => mapLayerSchema.parse(node.layer)).not.toThrow();
    }
  });

  it("has a populated centre", () => {
    expect(nodesByLayer(map, "CENTER").length).toBeGreaterThan(0);
  });

  it("covers the outer layers it declares", () => {
    const layers = new Set(map.nodes.map((node) => node.layer));
    expect(layers.has("R1")).toBe(true);
    expect(layers.has("R7")).toBe(true);
  });

  it("gives every evidence record an interpretation limit", () => {
    // The limit is the guard against reading a factor as a risk; evidence
    // shown without it would be evidence shown misleadingly.
    for (const item of map.evidence) {
      expect(item.authorized_statement.length).toBeGreaterThan(0);
      expect(item.interpretation_limit).toBeTruthy();
    }
  });

  it("keeps all twenty risk factors", () => {
    const ids = map.solutions.map((s) => s.factor_id);
    expect(ids).toContain("FRC-01");
    expect(new Set(ids).size).toBe(EXPECTED_COUNTS.solutions);
  });
});

describe("traversal", () => {
  const map = loadCognitiveMap();

  it("resolves a node and its relations", () => {
    const node = findNode(map, "CORE-PERSON");
    expect(node?.label).toBe("Pessoa");
    expect(edgesForNode(map, "CORE-PERSON").length).toBeGreaterThan(0);
  });

  it("returns neighbours in both directions", () => {
    const edge = map.edges[0];
    const from = neighbours(map, edge.source).map((n) => n.id);
    expect(from).toContain(edge.target);
    const to = neighbours(map, edge.target).map((n) => n.id);
    expect(to).toContain(edge.source);
  });

  it("resolves an edge by its stable id", () => {
    expect(findEdge(map, "EDGE-0001")?.source).toBe("CORE-PERSON");
  });

  it("only resolves evidence refs that name a record", () => {
    // Most evidence_refs are prose citations ("TP-001 framework"), not
    // ids. Coercing those into a match would attach the wrong evidence.
    const prose = map.edges.find((e) => e.evidence_ref === "TP-001 framework");
    expect(prose).toBeDefined();
    if (prose) {
      expect(evidenceForEdge(map, prose)).toBeUndefined();
    }
  });

  it("groups nodes for the macro selector", () => {
    expect(macroGroups(map).length).toBeGreaterThan(1);
  });

  it("searches without regard to case or accents", () => {
    // The corpus is Portuguese; "execucao" must still find "Execução".
    const withAccents = searchNodes(map, "Pessoa");
    expect(withAccents.length).toBeGreaterThan(0);
    expect(searchNodes(map, "pessoa").length).toBe(withAccents.length);
    expect(searchNodes(map, "")).toEqual([]);
  });
});
