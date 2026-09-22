import { expect, test } from "@playwright/test";

/**
 * Runtime verification of EXECUTAR Native Editorial v2 (ADR-DS-004)
 * against the deployed site. The token tests prove the stylesheet is
 * correct; these prove the browser resolves it that way in both
 * appearances, which is the only claim that counts.
 */
const ARTICLE = "/blog/tp-001-fatores-de-risco-cognitivo";

/**
 * The minifier rewrites #ffffff as #fff, so a literal comparison would
 * fail on a value that is in fact correct.
 */
const SHORT_HEX = /^#[0-9a-f]{3}$/i;

const expand = (hex: string | null) =>
  hex && SHORT_HEX.test(hex)
    ? `#${hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")}`
    : hex;

const computed = (selector: string, prop: string) =>
  `(() => { const el = document.querySelector(${JSON.stringify(selector)});
     return el ? getComputedStyle(el).getPropertyValue(${JSON.stringify(prop)}).trim() : null; })()`;

test.describe("light appearance", () => {
  test.use({ colorScheme: "light" });

  test("resolves the editorial roles on the public surface", async ({
    page,
  }) => {
    await page.goto(ARTICLE);
    const body = "body";
    expect(expand(await page.evaluate(computed(body, "--ed-bg")))).toBe(
      "#ffffff"
    );
    expect(
      expand(await page.evaluate(computed(body, "--ed-label-primary")))
    ).toBe("#1d1d1f");
    expect(expand(await page.evaluate(computed(body, "--ed-focus")))).toBe(
      "#0a84ff"
    );
    // The product ramp must not appear anywhere in the resolved values.
    expect(expand(await page.evaluate(computed(body, "--ed-accent")))).not.toBe(
      "#1f93ff"
    );
  });

  test("sets the article at 17px / 1.6 within 760px", async ({ page }) => {
    await page.goto(ARTICLE);
    const p = page.locator(".ed-article > p").first();
    await expect(p).toBeVisible();
    const metrics = await p.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        family: s.fontFamily,
        width: el.getBoundingClientRect().width,
      };
    });
    expect(metrics.fontSize).toBe("17px");
    expect(Number.parseFloat(metrics.lineHeight)).toBeCloseTo(27.2, 1);
    expect(metrics.family).not.toContain("New York");
    expect(metrics.width).toBeLessThanOrEqual(760);
  });
});

test.describe("dark appearance", () => {
  test.use({ colorScheme: "dark" });

  test("derives dark from the same roles", async ({ page }) => {
    await page.goto(ARTICLE);
    const body = "body";
    expect(expand(await page.evaluate(computed(body, "--ed-bg")))).toBe(
      "#000000"
    );
    expect(
      expand(await page.evaluate(computed(body, "--ed-label-primary")))
    ).toBe("#f5f5f7");
    // One identity: the focus colour is the same in both appearances.
    expect(expand(await page.evaluate(computed(body, "--ed-focus")))).toBe(
      "#0a84ff"
    );
  });

  test("actually paints dark, not just declares it", async ({ page }) => {
    await page.goto(ARTICLE);
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bg).toBe("rgb(0, 0, 0)");
  });
});
