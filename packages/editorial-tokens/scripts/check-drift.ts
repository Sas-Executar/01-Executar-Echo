#!/usr/bin/env bun
/**
 * ADR-DS-002 / ADR-DS-004 — CI gate for the editorial token set
 * (EXECUTAR Native Editorial v2).
 *
 * Five things are checked, in order of how badly they'd hurt:
 *
 *  1. ISOLATION. Every rule in `css/editorial.css` must sit under
 *     `[data-surface="editorial"]`, and the file must never define a
 *     `--ds-*` variable. This is what keeps the product Design System
 *     (ADR-DS-001) intact while apps/web wears a second identity — if it
 *     breaks, apps/app and apps/mobile start repainting. The canonical
 *     v2 file writes its roles at `:root`; porting it without re-scoping
 *     is precisely the mistake this catches.
 *  2. DRIFT. `css/editorial.css` is hand-authored to mirror `src/*.ts`
 *     1:1; this diffs the two, the same way
 *     `packages/design-tokens/scripts/check-drift.ts` does for the
 *     product tokens.
 *  3. APPEARANCE PARITY. Light and dark are two appearances of ONE
 *     identity, so every colour role must exist in both blocks. A role
 *     present in light and missing in dark is a component that renders
 *     wrong at night.
 *  4. PALETTE. No product Green/Azure value may appear on an editorial
 *     surface. ADR-DS-004 narrowed ADR-DS-003's blanket ban on blue: the
 *     product azure (#1f93ff) stays forbidden as an identity colour,
 *     while the system focus blue (#0a84ff) is required. Both halves are
 *     checked, so neither can quietly drift.
 *  5. ROLES, NOT HEXES. Identity contract rule 3. Public-surface
 *     components must consume `--ed-*` roles; a literal hex in a public
 *     component is a colour that cannot follow the dark appearance.
 *
 * Run: `bun run packages/editorial-tokens/scripts/check-drift.ts`
 * (or `bun run check:drift` from packages/editorial-tokens).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { dark, light } from "../src/color";
import { chrome, layout, radius, space } from "../src/layout";
import { duration, easing } from "../src/motion";
import { fontFamily, fontSize, reading } from "../src/typography";

const CSS_PATH = path.join(import.meta.dirname, "../css/editorial.css");
const PUBLIC_COMPONENTS = path.join(
  import.meta.dirname,
  "../../../apps/web/app"
);
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

/** The text between the first `{` after `from` and its matching `}`. */
function blockAfter(from: number): string {
  const open = css.indexOf("{", from);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") {
      depth++;
    } else if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        return css.slice(open + 1, i);
      }
    }
  }
  return "";
}

/*
 * Only the base scope block feeds the drift comparison. The dark and
 * reduced-motion blocks deliberately re-declare roles; parsing the whole
 * file would read those overrides as the token values and report drift
 * against src/*.ts every run.
 */
const baseBlock = blockAfter(css.indexOf(SCOPE));
const cssVars = parseVars(baseBlock);

const darkAt = css.indexOf("prefers-color-scheme: dark");
const darkVars = parseVars(blockAfter(css.indexOf(SCOPE, darkAt)));

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
    .replace(/(\.\d*?)0+(?=\D|$)/g, "$1")
    .replace(/\.(?=\D|$)/g, "")
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

/** Colour roles, light appearance. */
const ROLE_VAR: Record<keyof typeof light, string> = {
  bg: "ed-bg",
  bgGrouped: "ed-bg-grouped",
  surfaceElevated: "ed-surface-elevated",
  labelPrimary: "ed-label-primary",
  labelSecondary: "ed-label-secondary",
  labelTertiary: "ed-label-tertiary",
  separator: "ed-separator",
  fillPrimary: "ed-fill-primary",
  fillSecondary: "ed-fill-secondary",
  accent: "ed-accent",
  labelOnAccent: "ed-label-on-accent",
  focus: "ed-focus",
  success: "ed-success",
  warning: "ed-warning",
  error: "ed-error",
};

for (const [role, cssName] of Object.entries(ROLE_VAR)) {
  expect(cssName, light[role as keyof typeof light], `light.${role}`);
}

expect("ed-font-ui", fontFamily.ui, "fontFamily.ui");
expect("ed-font-display", fontFamily.display, "fontFamily.display");

expect("ed-display-xl", fontSize.displayXl, "fontSize.displayXl");
expect("ed-display-lg", fontSize.displayLg, "fontSize.displayLg");
expect("ed-display-md", fontSize.displayMd, "fontSize.displayMd");
expect("ed-headline", fontSize.headline, "fontSize.headline");
expect("ed-body-lg", fontSize.bodyLg, "fontSize.bodyLg");
expect("ed-body", fontSize.body, "fontSize.body");
expect("ed-small", fontSize.small, "fontSize.small");
expect("ed-caption", fontSize.caption, "fontSize.caption");

expect("ed-reading-font-size", reading.fontSize, "reading.fontSize");
expect("ed-reading-line-height", reading.lineHeight, "reading.lineHeight");
expect("ed-measure-article", reading.measure, "reading.measure");
expect("ed-reading-max", reading.max, "reading.max");

for (const [step, value] of Object.entries(space)) {
  expect(`ed-space-${step}`, value, `space.${step}`);
}

expect("ed-radius-control", radius.control, "radius.control");
expect("ed-radius-container", radius.container, "radius.container");
expect("ed-radius-large", radius.large, "radius.large");
expect("ed-radius-capsule", radius.capsule, "radius.capsule");

expect("ed-content-max", layout.contentMax, "layout.contentMax");
expect("ed-touch-min", layout.touchMin, "layout.touchMin");

expect("ed-nav-h", chrome.navH, "chrome.navH");
expect("ed-bottombar-h", chrome.bottombarH, "chrome.bottombarH");
expect("ed-drawer-w", chrome.drawerW, "chrome.drawerW");
expect("ed-gutter", chrome.gutter, "chrome.gutter");
expect("ed-gap", chrome.gap, "chrome.gap");
expect("ed-section", chrome.section, "chrome.section");

expect("ed-motion-fast", duration.fast, "duration.fast");
expect("ed-motion-standard", duration.standard, "duration.standard");
expect("ed-motion-slow", duration.slow, "duration.slow");
expect("ed-motion-curve", easing.standard, "easing.standard");

/*
 * The v1 aliases must resolve through a role. A literal value here is the
 * old palette creeping back in under a name components still use, and it
 * would be pinned to the light appearance forever.
 */
for (const [name, value] of Object.entries(cssVars)) {
  if (!name.startsWith("ed-")) {
    continue;
  }
  const isAlias = !(
    Object.values(ROLE_VAR).includes(name) || value.startsWith("var(")
  );
  if (isAlias && /#[0-9a-f]{3,8}\b/i.test(value)) {
    failures.push(
      `roles: --${name} is a literal colour ("${value}"). Non-role ` +
        "variables must reference a role with var(), or the value can't " +
        "follow the dark appearance (ADR-DS-004)."
    );
  }
}

/* ---------------------------------------------------------------- 3 */

for (const [role, cssName] of Object.entries(ROLE_VAR)) {
  const expected = dark[role as keyof typeof dark];
  const actual = darkVars[cssName];
  if (actual === undefined) {
    failures.push(
      `appearance: --${cssName} is missing from the ` +
        "prefers-color-scheme: dark block. Light and dark are two " +
        "appearances of one identity — every role exists in both."
    );
  } else if (norm(actual) !== norm(expected)) {
    failures.push(
      `appearance: dark.${role} — --${cssName} is "${norm(actual)}" in CSS ` +
        `but "${norm(expected)}" in src/color.ts`
    );
  }
}

/* ---------------------------------------------------------------- 4 */

// Product ramp values that must never surface on an editorial page.
const FORBIDDEN: Record<string, string> = {
  "#00bf63": "Green 9 (product brand)",
  "#1f93ff": "Azure 9 (product information colour) — not the system focus blue",
  "#4b4a4a": "Neutral 12 (product text)",
  "#f6f6f6": "product canvas",
};

for (const [hex, label] of Object.entries(FORBIDDEN)) {
  if (css.toLowerCase().includes(hex)) {
    failures.push(
      `palette: ${hex} (${label}) appears in css/editorial.css. The public ` +
        "surface is EXECUTAR Native Editorial and never wears the product " +
        "ramp (ADR-DS-004)."
    );
  }
}

// The other half of the same rule: the system focus blue is required.
if (!css.toLowerCase().includes(light.focus)) {
  failures.push(
    `palette: the system focus blue (${light.focus}) is absent. ` +
      "ADR-DS-004 requires it — a focus ring users don't recognise as " +
      "focus is an accessibility regression, not a style choice."
  );
}

/* ---------------------------------------------------------------- 5 */

/** Public-surface files, excluding the ones that legitimately hold data. */
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "node_modules" && entry !== ".next") {
        walk(full, out);
      }
    } else if (entry.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

let scanned = 0;
try {
  for (const file of walk(PUBLIC_COMPONENTS)) {
    scanned++;
    const source = readFileSync(file, "utf8");
    for (const hit of source.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
      failures.push(
        `roles: ${path.relative(PUBLIC_COMPONENTS, file)} hard-codes ` +
          `"${hit[0]}". Public components consume --ed-* roles, never ` +
          "hexadecimals (identity contract v2, rule 3)."
      );
    }
  }
} catch {
  // apps/web isn't checked out in every consumer of this package; the
  // token checks above still stand on their own.
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
  `Editorial tokens OK — ${Object.keys(cssVars).length} custom properties ` +
    `and ${Object.keys(darkVars).length} dark overrides, all scoped to ` +
    `${SCOPE}; ${scanned} public components, no hard-coded colour, no ` +
    "product-palette bleed.\n"
);
