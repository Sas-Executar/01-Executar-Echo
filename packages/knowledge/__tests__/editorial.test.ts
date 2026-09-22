/**
 * The editorial contract, and the one promise a CTA makes: that it goes
 * somewhere.
 */
import { describe, expect, it } from "vitest";

import {
  AWARENESS_LEVELS,
  activeCtas,
  CTAS,
  ctaForStage,
  EDITORIAL_PILLARS,
  FUNNEL_STAGES,
  isKnownPillar,
  NARRATIVE_ARCHITECTURE,
  pillarBySlug,
  stagesWithoutCta,
  taxonomyProblems,
  termSlug,
} from "../src/editorial";

/**
 * Routes this application actually serves. A CTA pointing anywhere else
 * is a broken promise on a page, which is worse than no CTA at all —
 * this list is what caught RC-CTA-002 pointing at /conceitos, a route
 * that was never built.
 */
const REAL_ROUTES = [
  "/",
  "/blog",
  "/mapa",
  "/frameworks",
  "/oficina",
  "/oficina/learn",
  "/vera",
  "/contact",
  "/pricing",
];

describe("taxonomy fidelity", () => {
  it("carries the seven canonical pillars", () => {
    expect(EDITORIAL_PILLARS).toHaveLength(7);
    expect(EDITORIAL_PILLARS.map((p) => p.value)).toContain(
      "Riscos Cognitivos"
    );
  });

  it("carries the eight awareness levels in order", () => {
    expect(AWARENESS_LEVELS).toHaveLength(8);
    expect(AWARENESS_LEVELS[0].value).toBe("Inconsciente do problema");
    expect(AWARENESS_LEVELS[7].value).toBe("Pronto para ação");
  });

  it("carries the five funnel stages", () => {
    expect(FUNNEL_STAGES).toHaveLength(5);
  });

  it("carries the nine narrative stages in order", () => {
    expect(NARRATIVE_ARCHITECTURE).toHaveLength(9);
    expect(NARRATIVE_ARCHITECTURE[0].stage).toBe("Cena");
    expect(NARRATIVE_ARCHITECTURE[8].stage).toBe("CTA");
    for (const [index, stage] of NARRATIVE_ARCHITECTURE.entries()) {
      expect(stage.order).toBe(index + 1);
      // Each stage's rule is editorial policy, not decoration.
      expect(stage.rule.length).toBeGreaterThan(0);
    }
  });

  it("round-trips a pillar through its slug", () => {
    for (const pillar of EDITORIAL_PILLARS) {
      expect(pillarBySlug(termSlug(pillar.value))?.value).toBe(pillar.value);
    }
  });

  it("slugs strip accents", () => {
    expect(termSlug("Cognição e Neurodivergência")).toBe(
      "cognicao-e-neurodivergencia"
    );
  });
});

describe("frontmatter validation", () => {
  it("accepts a correctly classified post", () => {
    expect(
      taxonomyProblems({
        pillar: "Riscos Cognitivos",
        awarenessLevel: "Consciente do problema",
        funnelStage: "Descoberta",
      })
    ).toEqual([]);
  });

  it("accepts an unclassified post", () => {
    // Unclassified is a fact about the article, not an error.
    expect(taxonomyProblems({})).toEqual([]);
  });

  it("reports a pillar that does not exist", () => {
    // Silently dropping it would hide the article from its own category.
    const problems = taxonomyProblems({ pillar: "Pilar Inventado" });
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("Pilar Inventado");
    expect(isKnownPillar("Pilar Inventado")).toBe(false);
  });
});

describe("CTAs go somewhere", () => {
  it("keeps all five canonical records", () => {
    expect(CTAS).toHaveLength(5);
    expect(CTAS.map((c) => c.id)).toContain("RC-CTA-001");
  });

  it("points every active CTA at a route this app serves", () => {
    for (const cta of activeCtas()) {
      expect(cta.href).not.toBeNull();
      expect(REAL_ROUTES).toContain(cta.href);
    }
  });

  it("keeps a CTA inert rather than repointing it", () => {
    // RC-CTA-001's tool and RC-CTA-002's guide do not exist. Sending the
    // reader somewhere else would change what the CTA promised.
    const inert = CTAS.filter((cta) => cta.href === null).map((c) => c.id);
    expect(inert).toContain("RC-CTA-001");
    expect(inert).toContain("RC-CTA-002");
  });

  it("routes a CTA only to its own funnel stage", () => {
    for (const stage of FUNNEL_STAGES) {
      const cta = ctaForStage(stage.value);
      if (cta) {
        expect(cta.funnelStage).toBe(stage.value);
      }
    }
  });

  it("names the stages with no CTA instead of substituting one", () => {
    // Descoberta has none in 05_CTA_ROUTING. Borrowing a conversion CTA
    // would put an ask in front of a reader still recognising the problem.
    expect(stagesWithoutCta()).toContain("Descoberta");
  });
});
