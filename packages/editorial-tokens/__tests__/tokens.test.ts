/**
 * The editorial token set's guard rails. ADR-DS-002 makes one promise —
 * that dressing apps/web in a second identity cannot repaint apps/app or
 * apps/mobile — and these tests are what make that promise checkable
 * rather than aspirational.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { action, brand, surface } from "../src/color";
import { layout, radius } from "../src/layout";
import { reading } from "../src/typography";

const CSS_PATH = path.join(import.meta.dirname, "../css/editorial.css");
const SCRIPT_PATH = path.join(import.meta.dirname, "../scripts/check-drift.ts");
const REFERENCE_PATH = path.join(
  import.meta.dirname,
  "../reference/tokens-hybrid.css"
);

const css = readFileSync(CSS_PATH, "utf8");
const reference = readFileSync(REFERENCE_PATH, "utf8");

/** Runs the drift script against a CSS body, returning its exit code. */
function runCheckerOn(cssBody: string): { code: number; stderr: string } {
  const original = readFileSync(CSS_PATH, "utf8");
  try {
    require("node:fs").writeFileSync(CSS_PATH, cssBody);
    execFileSync("bun", ["run", SCRIPT_PATH], { encoding: "utf8" });
    return { code: 0, stderr: "" };
  } catch (error) {
    const e = error as { status?: number; stderr?: string };
    return { code: e.status ?? 1, stderr: e.stderr ?? "" };
  } finally {
    require("node:fs").writeFileSync(CSS_PATH, original);
  }
}

describe("isolation from the product design system", () => {
  it("emits nothing at :root", () => {
    // A bare `:root {` here would land the editorial palette on every
    // surface in the monorepo, apps/app included.
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(withoutComments).not.toMatch(/(^|\})\s*:root\s*\{/);
  });

  it("never redefines a --ds-* product token", () => {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(withoutComments).not.toMatch(/--ds-[\w-]+\s*:/);
  });

  it("scopes every rule to [data-surface=\"editorial\"]", () => {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = [...withoutComments.matchAll(/(^|\})\s*([^{}@]+)\{/g)].map(
      (m) => m[2].trim()
    );
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).toContain('[data-surface="editorial"]');
    }
  });

  it("carries no product-palette colour", () => {
    // Blue was removed from this contract deliberately ("nunca azul").
    const lower = css.toLowerCase();
    expect(lower).not.toContain("#00bf63");
    expect(lower).not.toContain("#1f93ff");
  });
});

describe("the drift checker itself", () => {
  it("passes on the committed stylesheet", () => {
    expect(runCheckerOn(css).code).toBe(0);
  });

  it("fails when a rule escapes the editorial scope", () => {
    // Without this case the isolation gate could silently degrade into a
    // no-op and nobody would notice until the product UI changed colour.
    const leaked = `${css}\n:root { --ed-yellow: #ffcc00; }\n`;
    const result = runCheckerOn(leaked);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("isolation");
  });

  it("fails when a token value drifts from the TypeScript source", () => {
    const drifted = css.replace("--ed-yellow: #ffcc00;", "--ed-yellow: #ffcc01;");
    expect(drifted).not.toBe(css);
    const result = runCheckerOn(drifted);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("drift");
  });

  it("fails when a product colour bleeds onto the editorial surface", () => {
    const bled = css.replace("--ed-action-accent: #ffcc00;", "--ed-action-accent: #1f93ff;");
    expect(bled).not.toBe(css);
    const result = runCheckerOn(bled);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("palette");
  });
});

describe("fidelity to the NatGeo-hybrid v6 contract", () => {
  it("carries the upstream brand values verbatim", () => {
    expect(reference).toContain(`--yellow:${brand.yellow}`);
    expect(reference).toContain(`--charcoal:${brand.charcoal}`);
    expect(reference).toContain(`--action-primary:${action.primary}`);
    expect(reference).toContain(`--paper:${surface.paper}`);
  });

  it("keeps square corners as identity", () => {
    // The contract's one permitted radius is on buttons; cards are square.
    expect(radius.card).toBe("0px");
    expect(radius.btn).toBe("8px");
  });

  it("keeps the validated reading measure", () => {
    // 720px at 1.62 is the pair the handoff measured, not a preference.
    expect(reading.measure).toBe("720px");
    expect(reading.lineHeight).toBe("1.62");
    expect(layout.read).toBe(reading.measure);
  });
});
