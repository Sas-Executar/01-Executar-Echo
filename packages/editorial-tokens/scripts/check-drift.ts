#!/usr/bin/env bun
/**
 * ADR-DS-002 / ADR-DS-003 — CI gate for the editorial token set.
 *
 * Three things are checked, in order of how badly they'd hurt:
 *
 *  1. ISOLATION. Every rule in `css/editorial.css` must sit under
 *     `[data-surface="editorial"]`, and the file must never define a
 *     `--ds-*` variable. This is what keeps the product Design System
 *     (ADR-DS-001) intact while apps/web wears a second identity — if it
 *     breaks, apps/app and apps/mobile start repainting.
 *  2. DRIFT. `css/editorial.css` is hand-authored to mirror `src/*.ts`
 *     1:1; this diffs the two, the same way
 *     `packages/design-tokens/scripts/check-drift.ts` does for the
 *     product tokens.
 *  3. PALETTE. No Green/Azure product value may appear on an editorial
 *     surface. The v6 contract removed blue deliberately ("nunca azul")
 *     and ADR-DS-003 settled the DS-01 palette conflict in favour of the
 *     NatGeo-hybrid set — this makes that decision mechanical.
 *
 * Run: `bun run packages/editorial-tokens/scripts/check-drift.ts`
 * (or `bun run check:drift` from packages/editorial-tokens).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { action, brand, effect, surface } from "../src/color";
import { layout, radius } from "../src/layout";
import { duration, easing } from "../src/motion";
import { fontFamily, fontSize, reading } from "../src/typography";

const CSS_PATH = path.join(import.meta.dirname, "../css/editorial.css");
const SCOPE = '[data-surface="editorial"]';

const raw = readFileSync(CSS_PATH, "utf8");
// Strip comments first: this file's header documents variable names in
// prose, and those would otherwise parse as real declarations.
const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");

const failures: string[] = [];

/* ---------------------------------------------------------------- 1 */

// Every selector that opens a block must mention the scope. `@media`
// wrappers are allowed through — the rules nested inside them are
// checked on their own.
const selectorRe = /(^|\})\s*([^{}@]+)\{/g;
let sel: RegExpExecArray | null = selectorRe.exec(css);
while (sel) {
  const selector = sel[2].trim();
  if (selector && !selector.includes(SCOPE)) {
    failures.push(
      `isolation: selector "${selector}" is not scoped to ${SCOPE}. ` +
        "Editorial tokens must never be emitted at :root — that is what " +
        "repaints apps/app and apps/mobile (ADR-DS-002)."
    );
  }
  sel = selectorRe.exec(css);
}

for (const dsVar of css.matchAll(/--ds-[\w-]+\s*:/g)) {
  failures.push(
    `isolation: editorial.css defines "${dsVar[0].trim()}" — it must never ` +
      "redefine a product token (ADR-DS-001 owns the --ds-* namespace)."
  );
}

/* ---------------------------------------------------------------- 2 */

type CssVars = Record<string, string>;

function parseVars(source: string): CssVars {
  const vars: CssVars = {};
  const re = /--([\w-]+):\s*([^;]+);/g;
  let m: RegExpExecArray | null = re.exec(source);
  while (m) {
    vars[m[1]] = m[2].trim();
    m = re.exec(source);
  }
  return vars;
}

/*
 * Only the base scope block feeds the drift comparison. The
 * `prefers-reduced-motion` block deliberately re-declares the duration
 * variables as 0ms; parsing the whole file would read those overrides as
 * the token values and report drift against src/motion.ts every run.
 */
const baseBlock = css.slice(
  css.indexOf("{", css.indexOf(SCOPE)) + 1,
  css.indexOf("}", css.indexOf(SCOPE))
);
const cssVars = parseVars(baseBlock);

/**
 * Compares two CSS values by meaning rather than by spelling. The
 * formatter puts a space after every comma and a leading zero on bare
 * decimals; the upstream contract does neither. Those differences are
 * cosmetic, and reporting them as drift would train everyone to ignore
 * this check.
 */
const norm = (v: string) =>
  v
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",")
    .replace(/(^|[\s(,])0\.(\d)/g, "$1.$2")
    .trim();

function expect(cssName: string, tsValue: string, label: string) {
  const actual = cssVars[cssName];
  if (actual === undefined) {
    failures.push(`drift: ${label} — css/editorial.css has no --${cssName}`);
    return;
  }
  if (norm(actual) !== norm(tsValue)) {
    failures.push(
      `drift: ${label} — --${cssName} is "${norm(actual)}" in CSS but ` +
        `"${norm(tsValue)}" in src/*.ts`
    );
  }
}

expect("ed-yellow", brand.yellow, "brand.yellow");
expect("ed-black", brand.black, "brand.black");
expect("ed-charcoal", brand.charcoal, "brand.charcoal");
expect("ed-charcoal-soft", brand.charcoalSoft, "brand.charcoalSoft");

expect("ed-ink", surface.ink, "surface.ink");
expect("ed-muted", surface.muted, "surface.muted");
expect("ed-paper", surface.paper, "surface.paper");
expect("ed-soft", surface.soft, "surface.soft");
expect("ed-soft-2", surface.soft2, "surface.soft2");
expect("ed-line", surface.line, "surface.line");
expect("ed-white", surface.white, "surface.white");

expect("ed-action-primary", action.primary, "action.primary");
expect("ed-action-accent", action.accent, "action.accent");

expect("ed-shadow", effect.shadow, "effect.shadow");

expect("ed-sf", fontFamily.sf, "fontFamily.sf");
expect("ed-sf-text", fontFamily.sfText, "fontFamily.sfText");
expect("ed-ny", fontFamily.ny, "fontFamily.ny");

expect("ed-display-xl", fontSize.displayXl, "fontSize.displayXl");
expect("ed-display-lg", fontSize.displayLg, "fontSize.displayLg");
expect("ed-display-md", fontSize.displayMd, "fontSize.displayMd");
expect("ed-headline", fontSize.headline, "fontSize.headline");
expect("ed-body-lg", fontSize.bodyLg, "fontSize.bodyLg");
expect("ed-body", fontSize.body, "fontSize.body");
expect("ed-small", fontSize.small, "fontSize.small");
expect("ed-caption", fontSize.caption, "fontSize.caption");

expect("ed-reading-measure", reading.measure, "reading.measure");
expect("ed-reading-line-height", reading.lineHeight, "reading.lineHeight");

expect("ed-nav-h", layout.navH, "layout.navH");
expect("ed-bottombar-h", layout.bottombarH, "layout.bottombarH");
expect("ed-drawer-w", layout.drawerW, "layout.drawerW");
expect("ed-shell", layout.shell, "layout.shell");
expect("ed-wide", layout.wide, "layout.wide");
expect("ed-read", layout.read, "layout.read");
expect("ed-gutter", layout.gutter, "layout.gutter");
expect("ed-gap", layout.gap, "layout.gap");
expect("ed-section", layout.section, "layout.section");

expect("ed-radius-card", radius.card, "radius.card");
expect("ed-radius-btn", radius.btn, "radius.btn");
expect("ed-radius-nav-icon", radius.navIcon, "radius.navIcon");

expect("ed-duration-drawer", duration.drawer, "duration.drawer");
expect("ed-duration-chrome", duration.chrome, "duration.chrome");
expect("ed-duration-hero", duration.heroEntrance, "duration.heroEntrance");

// The easing curve is written with a leading zero in CSS (`0.22`) and
// without in the upstream contract (`.22`); compare numerically rather
// than textually so a cosmetic difference isn't reported as drift.
const easingDigits = (v: string) => v.replace(/[^0-9.,]/g, "");
if (
  cssVars["ed-ease"] &&
  easingDigits(cssVars["ed-ease"]).replace(/\b0\./g, ".") !==
    easingDigits(easing.standard).replace(/\b0\./g, ".")
) {
  failures.push(
    `drift: easing.standard — --ed-ease is "${cssVars["ed-ease"]}" in CSS ` +
      `but "${easing.standard}" in src/motion.ts`
  );
}

/* ---------------------------------------------------------------- 3 */

// Product ramp values that must never surface on an editorial page. Blue
// in particular was removed from this contract on purpose.
const FORBIDDEN: Record<string, string> = {
  "#00bf63": "Green 9 (product brand)",
  "#1f93ff": "Azure 9 (product information colour)",
  "#4b4a4a": "Neutral 12 (product text)",
  "#f6f6f6": "product canvas",
};

for (const [hex, label] of Object.entries(FORBIDDEN)) {
  if (css.toLowerCase().includes(hex)) {
    failures.push(
      `palette: ${hex} (${label}) appears in css/editorial.css. The public ` +
        "surface uses the NatGeo-hybrid set and never blue (ADR-DS-003)."
    );
  }
}

/* ------------------------------------------------------------ report */

if (failures.length > 0) {
  process.stderr.write(
    `Editorial token check failed (${failures.length}):\n` +
      failures.map((f) => `  - ${f}`).join("\n") +
      "\n"
  );
  process.exit(1);
}

process.stdout.write(
  `Editorial tokens OK — ${Object.keys(cssVars).length} custom properties, ` +
    `all scoped to ${SCOPE}, no product-palette bleed.\n`
);
