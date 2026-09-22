import { expect, test } from "@playwright/test";

const BASE = "https://executar-nf-web.vercel.app";

/** Hoisted so they compile once rather than per assertion. */
const ANY_VALUE = /.*/;
const SHORT_HEX = /^#([\da-f])([\da-f])([\da-f])$/i;

/** `#000` and `#000000` are the same colour; compare them as such. */
function expand(hex?: string | null): string | undefined {
  if (!hex) {
    return undefined;
  }
  const short = hex.trim().match(SHORT_HEX);
  return short
    ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
    : hex.trim();
}
const ROUTES = [
  "/",
  "/blog",
  "/blog/tp-001-fatores-de-risco-cognitivo",
  "/mapa",
  "/frameworks",
  "/oficina",
  "/oficina/learn",
  "/vera",
];

test("no failing requests or page errors across the public surfaces", async ({
  page,
}) => {
  const failures: string[] = [];

  // The failing *resource* URL, not the page's — a console message only
  // reports the document it happened on, which is useless for finding
  // which asset is missing.
  page.on("response", (r) => {
    // Vercel Web Analytics is not enabled on this project, so its script
    // 404s. That is a dashboard setting rather than a defect in this
    // code, and keeping it in the assertion would train everyone to
    // ignore a failing check.
    if (r.status() >= 400 && !r.url().includes("/_vercel/insights/")) {
      failures.push(`${r.status()} ${r.url()}`);
    }
  });
  page.on("pageerror", (e) => failures.push(`pageerror: ${e.message}`));

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  }

  console.log(
    "FAILING REQUESTS:",
    JSON.stringify([...new Set(failures)], null, 1)
  );
  expect([...new Set(failures)]).toEqual([]);
});

test("mobile at 320px has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    console.log(`${route}: overflow=${overflow}px`);
    expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1);
  }
});

test("the drawer traps focus and Escape closes it", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });

  const trigger = page.getByTestId("drawer-trigger");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  // main must be inert while the drawer is open — the handoff's blocking item
  await expect(page.locator("main")).toHaveAttribute("inert", ANY_VALUE);

  // Tab repeatedly; focus must never leave the drawer
  const drawer = page.getByTestId("editorial-drawer");
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const inside = await drawer.evaluate((el) =>
      el.contains(document.activeElement)
    );
    expect(inside, `focus escaped the drawer on Tab #${i + 1}`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("main")).not.toHaveAttribute("inert", ANY_VALUE);
});

test("bottom bar carries exactly three destinations", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  const links = page.getByTestId("editorial-bottom-bar").locator("a");
  await expect(links).toHaveCount(3);
});

test("the public surface uses no product-palette colour", async ({ page }) => {
  await page.goto(`${BASE}/mapa`, { waitUntil: "networkidle" });
  const yellow = await page.evaluate(() => {
    const scope = document.querySelector('[data-surface="editorial"]');
    return scope
      ? getComputedStyle(scope).getPropertyValue("--ed-yellow").trim()
      : null;
  });
  expect(yellow).toBe("#fc0");
  // Asserted on *computed* values, not on the stylesheet text. The
  // product tokens are legitimately present at :root — apps/web still
  // imports the design system for its component primitives — and the
  // claim being tested is that the editorial surface never resolves to
  // them, which is what ADR-DS-002 actually promises.
  const resolved = await page.evaluate(() => {
    const scope = document.querySelector('[data-surface="editorial"]');
    if (!scope) {
      return null;
    }
    const style = getComputedStyle(scope);
    return {
      background: style.getPropertyValue("--background").trim(),
      primary: style.getPropertyValue("--primary").trim(),
      ring: style.getPropertyValue("--ring").trim(),
      radius: style.getPropertyValue("--radius").trim(),
    };
  });

  expect(resolved).not.toBeNull();
  // Compared as expanded hex: the minifier rewrites #000000 as #000, and
  // a literal string match would fail on a value that is in fact correct.
  expect(expand(resolved?.primary)).toBe("#000000");
  expect(expand(resolved?.ring)).toBe("#ffcc00");
  expect(expand(resolved?.background)).toBe("#ffffff");
  // Square corners are identity on this surface.
  expect(resolved?.radius).toBe("0px");
});
