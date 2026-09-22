/**
 * The editorial token set's guard rails, for EXECUTAR Native Editorial
 * v2 (ADR-DS-004).
 *
 * Two promises are made checkable here rather than aspirational:
 * ADR-DS-002's — that dressing apps/web in a second identity cannot
 * repaint apps/app or apps/mobile — and the v2 identity contract's, that
 * there is ONE identity with two appearances, expressed as roles.
 *
 * The acceptance criteria in `reference/v2/06_ACCEPTANCE_CRITERIA.md`
 * are encoded directly, so the document and the build cannot disagree.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { dark, light, roles } from "../src/color";
import { layout, radius } from "../src/layout";
import { fontFamily, reading } from "../src/typography";

const CSS_PATH = path.join(import.meta.dirname, "../css/editorial.css");
const SCRIPT_PATH = path.join(import.meta.dirname, "../scripts/check-drift.ts");
const CANONICAL_PATH = path.join(
  import.meta.dirname,
  "../reference/v2/02_TOKENS_CANONICAL.css"
);

/** Hoisted so they are compiled once rather than per assertion. */
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;
const ROOT_BLOCK = /(^|\})\s*:root\s*\{/;
const DS_TOKEN = /--ds-[\w-]+\s*:/;
const SELECTOR = /(^|\})\s*([^{}@]+)\{/g;

const css = readFileSync(CSS_PATH, "utf8");
const canonical = readFileSync(CANONICAL_PATH, "utf8");
const withoutComments = css.replace(CSS_COMMENT, "");

/** Runs the drift script against a CSS body, returning its exit code. */
function runCheckerOn(cssBody: string): { code: number; stderr: string } {
  const original = readFileSync(CSS_PATH, "utf8");
  try {
    writeFileSync(CSS_PATH, cssBody);
    execFileSync("bun", ["run", SCRIPT_PATH], { encoding: "utf8" });
    return { code: 0, stderr: "" };
  } catch (error) {
    const e = error as { status?: number; stderr?: string };
    return { code: e.status ?? 1, stderr: e.stderr ?? "" };
  } finally {
    writeFileSync(CSS_PATH, original);
  }
}

describe("isolation from the product design system", () => {
  it("emits nothing at :root", () => {
    // The canonical v2 file writes its roles at `:root`. Porting it
    // without re-scoping would land the editorial palette on every
    // surface in the monorepo, apps/app included.
    expect(canonical).toMatch(ROOT_BLOCK);
    expect(withoutComments).not.toMatch(ROOT_BLOCK);
  });

  it("never redefines a --ds-* product token", () => {
    expect(withoutComments).not.toMatch(DS_TOKEN);
  });

  it('scopes every rule to [data-surface="editorial"]', () => {
    const selectors = [...withoutComments.matchAll(SELECTOR)].map((m) =>
      m[2].trim()
    );
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).toContain('[data-surface="editorial"]');
    }
  });

  it("carries no product-palette colour", () => {
    // Comments are stripped first: the header names the forbidden azure
    // in prose, explaining why it is forbidden.
    const lower = withoutComments.toLowerCase();
    expect(lower).not.toContain("#00bf63");
    // The product azure stays forbidden; the system focus blue does not
    // resemble it and is required (ADR-DS-004).
    expect(lower).not.toContain("#1f93ff");
    expect(lower).toContain("#0a84ff");
  });
});

describe("the drift checker itself", () => {
  it("passes on the committed stylesheet", () => {
    expect(runCheckerOn(css).code).toBe(0);
  });

  it("fails when a rule escapes the editorial scope", () => {
    // Without this case the isolation gate could silently degrade into a
    // no-op and nobody would notice until the product UI changed colour.
    const leaked = `${css}\n:root { --ed-accent: #ffcc00; }\n`;
    const result = runCheckerOn(leaked);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("isolation");
  });

  it("fails when a token value drifts from the TypeScript source", () => {
    const drifted = css.replace("--ed-accent: #ffcc00;", "--ed-accent: #fc1;");
    expect(drifted).not.toBe(css);
    const result = runCheckerOn(drifted);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("drift");
  });

  it("fails when a product colour bleeds onto the editorial surface", () => {
    const bled = css.replace("--ed-accent: #ffcc00;", "--ed-accent: #1f93ff;");
    expect(bled).not.toBe(css);
    const result = runCheckerOn(bled);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("palette");
  });

  it("fails when a role is missing from the dark appearance", () => {
    const halfDark = css.replace("    --ed-label-tertiary: #8e8e93;\n", "");
    expect(halfDark).not.toBe(css);
    const result = runCheckerOn(halfDark);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("appearance");
  });

  it("fails when an alias hard-codes a colour instead of a role", () => {
    // This is how the old palette would creep back: under a name the
    // components still use, pinned to the light appearance forever.
    const pinned = css.replace(
      "--ed-ink: var(--ed-label-primary);",
      "--ed-ink: #1d1d1f;"
    );
    expect(pinned).not.toBe(css);
    const result = runCheckerOn(pinned);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("roles");
  });
});

describe("fidelity to the canonical v2 contract", () => {
  it("carries the upstream role values verbatim", () => {
    expect(canonical).toContain(`--accent: ${light.accent.toUpperCase()}`);
    expect(canonical).toContain(`--focus: ${light.focus.toUpperCase()}`);
    expect(canonical).toContain("--label-primary: #1D1D1F");
    expect(canonical).toContain("--bg: #FFFFFF");
  });

  it("has one identity in two appearances, not two themes", () => {
    // Every role exists in both. A role in one appearance only is a
    // component that renders wrong at night.
    for (const role of roles) {
      expect(light[role]).toBeTruthy();
      expect(dark[role]).toBeTruthy();
    }
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it("declares color-scheme so native controls follow the appearance", () => {
    expect(withoutComments).toContain("color-scheme: light dark");
  });
});

describe("acceptance criteria — editorial", () => {
  it("sets the article at 66ch capped at 760px", () => {
    expect(reading.measure).toBe("66ch");
    expect(reading.max).toBe("760px");
    expect(layout.measureArticle).toBe(reading.measure);
    expect(layout.readingMax).toBe(reading.max);
  });

  it("sets body copy at 17px and line-height 1.6", () => {
    // 1.0625rem === 17px at the 16px default root size.
    expect(reading.fontSize).toBe("1.0625rem");
    expect(Number.parseFloat(reading.fontSize) * 16).toBe(17);
    expect(reading.lineHeight).toBe("1.6");
  });

  it("drops the serif — v2 has a single family", () => {
    // "New York não faz parte da identidade canônica v2."
    const families = Object.values(fontFamily).join(" ");
    expect(families).not.toContain("New York");
    expect(families).not.toContain("serif,");
    expect(withoutComments).not.toContain("--ed-ny");
  });

  it("restricts the accent, with no yellow rule above every h2", () => {
    // The v6 contract put a 52x5 yellow bar on every h2. v2 reserves the
    // accent for selection, progress and microindicators.
    expect(withoutComments).not.toContain("h2::before");
  });
});

describe("acceptance criteria — accessibility and form", () => {
  it("keeps the 44px touch floor", () => {
    expect(layout.touchMin).toBe("44px");
  });

  it("focuses in the system blue, not the brand accent", () => {
    expect(withoutComments).toContain("outline: 3px solid var(--ed-focus)");
    expect(light.focus).toBe(dark.focus);
  });

  it("collapses motion under prefers-reduced-motion", () => {
    expect(withoutComments).toContain("prefers-reduced-motion: reduce");
    expect(withoutComments).toContain("--ed-motion-standard: 0ms");
  });

  it("uses a moderate radius scale rather than square corners", () => {
    expect(radius.control).toBe("12px");
    expect(radius.container).toBe("16px");
    expect(radius.large).toBe("22px");
    expect(radius.capsule).toBe("999px");
  });

  it("confines the translucent material to the chrome", () => {
    // Identity contract rule 5. One class carries it, so the rule is
    // checkable instead of a convention.
    const blurs = [...withoutComments.matchAll(/backdrop-filter/g)];
    expect(blurs).toHaveLength(2); // the property and its -webkit- twin
    expect(withoutComments).toContain(".ed-chrome");
  });
});
