# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-verify.spec.ts >> no failing requests or page errors across the public surfaces
- Location: e2e/production-verify.spec.ts:30:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "502 https://executar-nf-web.vercel.app/frameworks?_rsc=139yk",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=f7e1]:
  - generic [ref=f7e2]:
    - banner [ref=f7e3]:
      - generic [ref=f7e4]:
        - link "EXECUTAR — página inicial" [ref=f7e5] [cursor=pointer]:
          - /url: /
          - img "EXECUTAR" [ref=f7e6]
        - navigation "Navegação principal" [ref=f7e7]:
          - link "Blog" [ref=f7e8] [cursor=pointer]:
            - /url: /blog
          - link "Mapa" [ref=f7e9] [cursor=pointer]:
            - /url: /mapa
          - link "Frameworks" [ref=f7e10] [cursor=pointer]:
            - /url: /frameworks
          - link "Oficina" [ref=f7e11] [cursor=pointer]:
            - /url: /oficina
          - link "VERA" [ref=f7e12] [cursor=pointer]:
            - /url: /vera
        - link "Buscar" [ref=f7e13] [cursor=pointer]:
          - /url: /buscar
    - main [ref=f7e17]:
      - generic [ref=f7e18]:
        - generic [ref=f7e19]:
          - heading "VERA" [level=1] [ref=f7e20]
          - paragraph [ref=f7e21]: Pergunte sobre o custo cognitivo da execução. A VERA consulta o mapa cognitivo, o catálogo de frameworks e os contratos da Oficina, cita o que encontrou e encaminha para onde continuar. Quando não consegue sustentar uma resposta, diz isso — análise da situação, nunca diagnóstico de uma pessoa.
        - generic [ref=f7e24]:
          - generic [ref=f7e25]:
            - generic [ref=f7e26]: Sua pergunta
            - textbox "Sua pergunta" [ref=f7e27]:
              - /placeholder: O que aumenta o custo de retomar uma tarefa?
          - button "Perguntar" [ref=f7e28] [cursor=pointer]
        - generic [ref=f7e29]:
          - heading "O que a VERA pode fazer" [level=2] [ref=f7e30]
          - paragraph [ref=f7e31]: Esta lista é o limite, não um resumo dele. Uma capacidade que não está aqui é negada por padrão, e nenhuma capacidade que altere estado roda sem confirmação explícita.
          - list [ref=f7e32]:
            - listitem [ref=f7e33]:
              - paragraph [ref=f7e34]: knowledge.search_map
              - paragraph [ref=f7e35]: Consulta o grafo cognitivo (SCHEMA-RC-SOLUTION-004) por conceito, fator, manifestação ou evidência.
            - listitem [ref=f7e36]:
              - paragraph [ref=f7e37]: knowledge.select_framework
              - paragraph [ref=f7e38]: Seleciona frameworks do catálogo SKILL-EXE-SF-001 a partir da intenção declarada.
            - listitem [ref=f7e39]:
              - paragraph [ref=f7e40]: content.find_article
              - paragraph [ref=f7e41]: Localiza artigos publicados relacionados a um conceito.
            - listitem [ref=f7e42]:
              - paragraph [ref=f7e43]: store.find_solution
              - paragraph [ref=f7e44]: Localiza soluções da Oficina cujo contrato declara o problema em questão.
    - contentinfo [ref=f7e45]:
      - generic [ref=f7e46]:
        - generic [ref=f7e47]:
          - img "EXECUTAR" [ref=f7e48]
          - paragraph [ref=f7e49]: Entenda → Estruture → Execute. Análise da situação, nunca diagnóstico da pessoa.
        - generic [ref=f7e50]:
          - navigation "Mais" [ref=f7e51]:
            - heading "Mais" [level=2] [ref=f7e52]
            - list [ref=f7e53]:
              - listitem [ref=f7e54]:
                - link "Sobre" [ref=f7e55] [cursor=pointer]:
                  - /url: /sobre
              - listitem [ref=f7e56]:
                - link "Conceitos" [ref=f7e57] [cursor=pointer]:
                  - /url: /conceitos
              - listitem [ref=f7e58]:
                - link "Learn" [ref=f7e59] [cursor=pointer]:
                  - /url: /oficina/learn
          - navigation "Legal" [ref=f7e60]:
            - heading "Legal" [level=2] [ref=f7e61]
            - list [ref=f7e62]:
              - listitem [ref=f7e63]:
                - link "Política de Privacidade" [ref=f7e64] [cursor=pointer]:
                  - /url: /legal/privacy
              - listitem [ref=f7e65]:
                - link "Termos de Uso" [ref=f7e66] [cursor=pointer]:
                  - /url: /legal/terms
  - region "Notifications alt+T"
  - alert [ref=f7e67]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | const BASE = "https://executar-nf-web.vercel.app";
  4   | 
  5   | /** Hoisted so they compile once rather than per assertion. */
  6   | const ANY_VALUE = /.*/;
  7   | const SHORT_HEX = /^#([\da-f])([\da-f])([\da-f])$/i;
  8   | 
  9   | /** `#000` and `#000000` are the same colour; compare them as such. */
  10  | function expand(hex?: string | null): string | undefined {
  11  |   if (!hex) {
  12  |     return undefined;
  13  |   }
  14  |   const short = hex.trim().match(SHORT_HEX);
  15  |   return short
  16  |     ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
  17  |     : hex.trim();
  18  | }
  19  | const ROUTES = [
  20  |   "/",
  21  |   "/blog",
  22  |   "/blog/tp-001-fatores-de-risco-cognitivo",
  23  |   "/mapa",
  24  |   "/frameworks",
  25  |   "/oficina",
  26  |   "/oficina/learn",
  27  |   "/vera",
  28  | ];
  29  | 
  30  | test("no failing requests or page errors across the public surfaces", async ({
  31  |   page,
  32  | }) => {
  33  |   const failures: string[] = [];
  34  | 
  35  |   // The failing *resource* URL, not the page's — a console message only
  36  |   // reports the document it happened on, which is useless for finding
  37  |   // which asset is missing.
  38  |   page.on("response", (r) => {
  39  |     // Vercel Web Analytics is not enabled on this project, so its script
  40  |     // 404s. That is a dashboard setting rather than a defect in this
  41  |     // code, and keeping it in the assertion would train everyone to
  42  |     // ignore a failing check.
  43  |     if (r.status() >= 400 && !r.url().includes("/_vercel/insights/")) {
  44  |       failures.push(`${r.status()} ${r.url()}`);
  45  |     }
  46  |   });
  47  |   page.on("pageerror", (e) => failures.push(`pageerror: ${e.message}`));
  48  | 
  49  |   for (const route of ROUTES) {
  50  |     await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  51  |   }
  52  | 
  53  |   console.log(
  54  |     "FAILING REQUESTS:",
  55  |     JSON.stringify([...new Set(failures)], null, 1)
  56  |   );
> 57  |   expect([...new Set(failures)]).toEqual([]);
      |                                  ^ Error: expect(received).toEqual(expected) // deep equality
  58  | });
  59  | 
  60  | test("mobile at 320px has no horizontal overflow", async ({ page }) => {
  61  |   await page.setViewportSize({ width: 320, height: 720 });
  62  |   for (const route of ROUTES) {
  63  |     await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  64  |     const overflow = await page.evaluate(
  65  |       () =>
  66  |         document.documentElement.scrollWidth -
  67  |         document.documentElement.clientWidth
  68  |     );
  69  |     console.log(`${route}: overflow=${overflow}px`);
  70  |     expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1);
  71  |   }
  72  | });
  73  | 
  74  | test("the drawer traps focus and Escape closes it", async ({ page }) => {
  75  |   await page.setViewportSize({ width: 375, height: 720 });
  76  |   await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  77  | 
  78  |   const trigger = page.getByTestId("drawer-trigger");
  79  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  80  |   await trigger.click();
  81  |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  82  | 
  83  |   // main must be inert while the drawer is open — the handoff's blocking item
  84  |   await expect(page.locator("main")).toHaveAttribute("inert", ANY_VALUE);
  85  | 
  86  |   // Tab repeatedly; focus must never leave the drawer
  87  |   const drawer = page.getByTestId("editorial-drawer");
  88  |   for (let i = 0; i < 12; i++) {
  89  |     await page.keyboard.press("Tab");
  90  |     const inside = await drawer.evaluate((el) =>
  91  |       el.contains(document.activeElement)
  92  |     );
  93  |     expect(inside, `focus escaped the drawer on Tab #${i + 1}`).toBe(true);
  94  |   }
  95  | 
  96  |   await page.keyboard.press("Escape");
  97  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  98  |   await expect(page.locator("main")).not.toHaveAttribute("inert", ANY_VALUE);
  99  | });
  100 | 
  101 | test("bottom bar carries exactly three destinations", async ({ page }) => {
  102 |   await page.setViewportSize({ width: 375, height: 720 });
  103 |   await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  104 |   const links = page.getByTestId("editorial-bottom-bar").locator("a");
  105 |   await expect(links).toHaveCount(3);
  106 | });
  107 | 
  108 | test("the public surface uses no product-palette colour", async ({ page }) => {
  109 |   await page.goto(`${BASE}/mapa`, { waitUntil: "networkidle" });
  110 |   const yellow = await page.evaluate(() => {
  111 |     const scope = document.querySelector('[data-surface="editorial"]');
  112 |     return scope
  113 |       ? getComputedStyle(scope).getPropertyValue("--ed-yellow").trim()
  114 |       : null;
  115 |   });
  116 |   expect(yellow).toBe("#fc0");
  117 |   // Asserted on *computed* values, not on the stylesheet text. The
  118 |   // product tokens are legitimately present at :root — apps/web still
  119 |   // imports the design system for its component primitives — and the
  120 |   // claim being tested is that the editorial surface never resolves to
  121 |   // them, which is what ADR-DS-002 actually promises.
  122 |   const resolved = await page.evaluate(() => {
  123 |     const scope = document.querySelector('[data-surface="editorial"]');
  124 |     if (!scope) {
  125 |       return null;
  126 |     }
  127 |     const style = getComputedStyle(scope);
  128 |     return {
  129 |       background: style.getPropertyValue("--background").trim(),
  130 |       primary: style.getPropertyValue("--primary").trim(),
  131 |       ring: style.getPropertyValue("--ring").trim(),
  132 |       radius: style.getPropertyValue("--radius").trim(),
  133 |     };
  134 |   });
  135 | 
  136 |   expect(resolved).not.toBeNull();
  137 |   // Compared as expanded hex: the minifier rewrites #000000 as #000, and
  138 |   // a literal string match would fail on a value that is in fact correct.
  139 |   expect(expand(resolved?.primary)).toBe("#000000");
  140 |   expect(expand(resolved?.ring)).toBe("#ffcc00");
  141 |   expect(expand(resolved?.background)).toBe("#ffffff");
  142 |   // Square corners are identity on this surface.
  143 |   expect(resolved?.radius).toBe("0px");
  144 | });
  145 | 
```