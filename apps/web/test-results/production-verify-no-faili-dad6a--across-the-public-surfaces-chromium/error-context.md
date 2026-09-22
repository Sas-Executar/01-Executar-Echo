# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-verify.spec.ts >> no failing requests or page errors across the public surfaces
- Location: e2e/production-verify.spec.ts:6:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 11

- Array []
+ Array [
+   "404 https://executar-nf-web.vercel.app/_vercel/insights/script.js",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=eqsiq",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=1tnl8",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=1e2n0",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=3hgoh",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=1wa8c",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=9hwlo",
+   "404 https://executar-nf-web.vercel.app/oficina/learn?__clerk_handshake=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSmF6WXUzM052aTFmQmU5TTM2MjRYbzJLMFAiLCJ0eXAiOiJKV1QifQ.eyJoYW5kc2hha2UiOlsiX19jbGllbnRfdWF0PTsgUGF0aD0vOyBFeHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UOyBTZWN1cmU7IFNhbWVTaXRlPU5vbmUiLCJfX2NsaWVudF91YXQ9MDsgUGF0aD0vOyBEb21haW49ZXhlY3V0YXItbmYtd2ViLnZlcmNlbC5hcHA7IE1heC1BZ2U9MzE1MzYwMDAwOyBTZWN1cmU7IFNhbWVTaXRlPU5vbmUiLCJfX3Nlc3Npb249OyBQYXRoPS87IEV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVQ7IFNlY3VyZTsgU2FtZVNpdGU9Tm9uZSIsIl9fY2xlcmtfZGJfand0PWR2Yl8zSmg3THlaODB2eFRMSGlEMlQ3S2w4Z1dnZ1Q7IFBhdGg9LzsgRXhwaXJlcz1XZWQsIDIyIFNlcCAyMDI3IDE4OjIzOjEzIEdNVDsgU2VjdXJlOyBTYW1lU2l0ZT1Ob25lIl19.mRalNg3IswRGAntKPODybOZtN0uMOX8oTYZuroq3NuJ1QX9lJ9fY7gJnauVIGj34KCanBNHtH5SPBAThLLPPNjktS3diyRveoukQN3NwsdeaG_QqxUtsFHs0H_5YuLBomFPqh2J2v4ONMQxQJJtAl4aMajTXKrGtPzubErz-P5NS48s235Iphkl6GgbGIGZmudaMihitUKpT2SwFsYIzcbFPQgI0GyFp_Gm5APYpRe509YGPSKMorxqVUEsaszUYJIqIwXrI_Cem9SwbTcnhfbfCiC11ZqhyaQUKUC5h14RW8HDlIoxIKFgLhu0PtvczaW9BUy1YrgAkot9sBMP0KA",
+   "404 https://executar-nf-web.vercel.app/buscar?_rsc=1to0h",
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
  4   | const ROUTES = ["/", "/blog", "/blog/tp-001-fatores-de-risco-cognitivo", "/mapa", "/frameworks", "/oficina", "/oficina/learn", "/vera"];
  5   | 
  6   | test("no failing requests or page errors across the public surfaces", async ({
  7   |   page,
  8   | }) => {
  9   |   const failures: string[] = [];
  10  | 
  11  |   // The failing *resource* URL, not the page's — a console message only
  12  |   // reports the document it happened on, which is useless for finding
  13  |   // which asset is missing.
  14  |   page.on("response", (r) => {
  15  |     if (r.status() >= 400) {
  16  |       failures.push(`${r.status()} ${r.url()}`);
  17  |     }
  18  |   });
  19  |   page.on("pageerror", (e) => failures.push(`pageerror: ${e.message}`));
  20  | 
  21  |   for (const route of ROUTES) {
  22  |     await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  23  |   }
  24  | 
  25  |   console.log("FAILING REQUESTS:", JSON.stringify([...new Set(failures)], null, 1));
> 26  |   expect([...new Set(failures)]).toEqual([]);
      |                                  ^ Error: expect(received).toEqual(expected) // deep equality
  27  | });
  28  | 
  29  | test("mobile at 320px has no horizontal overflow", async ({ page }) => {
  30  |   await page.setViewportSize({ width: 320, height: 720 });
  31  |   for (const route of ROUTES) {
  32  |     await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  33  |     const overflow = await page.evaluate(() =>
  34  |       document.documentElement.scrollWidth - document.documentElement.clientWidth
  35  |     );
  36  |     console.log(`${route}: overflow=${overflow}px`);
  37  |     expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1);
  38  |   }
  39  | });
  40  | 
  41  | test("the drawer traps focus and Escape closes it", async ({ page }) => {
  42  |   await page.setViewportSize({ width: 375, height: 720 });
  43  |   await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  44  | 
  45  |   const trigger = page.getByTestId("drawer-trigger");
  46  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  47  |   await trigger.click();
  48  |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  49  | 
  50  |   // main must be inert while the drawer is open — the handoff's blocking item
  51  |   await expect(page.locator("main")).toHaveAttribute("inert", /.*/);
  52  | 
  53  |   // Tab repeatedly; focus must never leave the drawer
  54  |   const drawer = page.getByTestId("editorial-drawer");
  55  |   for (let i = 0; i < 12; i++) {
  56  |     await page.keyboard.press("Tab");
  57  |     const inside = await drawer.evaluate((el) => el.contains(document.activeElement));
  58  |     expect(inside, `focus escaped the drawer on Tab #${i + 1}`).toBe(true);
  59  |   }
  60  | 
  61  |   await page.keyboard.press("Escape");
  62  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  63  |   await expect(page.locator("main")).not.toHaveAttribute("inert", /.*/);
  64  | });
  65  | 
  66  | test("bottom bar carries exactly three destinations", async ({ page }) => {
  67  |   await page.setViewportSize({ width: 375, height: 720 });
  68  |   await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  69  |   const links = page.getByTestId("editorial-bottom-bar").locator("a");
  70  |   await expect(links).toHaveCount(3);
  71  | });
  72  | 
  73  | test("the public surface uses no product-palette colour", async ({ page }) => {
  74  |   await page.goto(`${BASE}/mapa`, { waitUntil: "networkidle" });
  75  |   const yellow = await page.evaluate(() =>
  76  |     getComputedStyle(document.querySelector('[data-surface="editorial"]')!)
  77  |       .getPropertyValue("--ed-yellow").trim()
  78  |   );
  79  |   expect(yellow).toBe("#fc0");
  80  |   // Asserted on *computed* values, not on the stylesheet text. The
  81  |   // product tokens are legitimately present at :root — apps/web still
  82  |   // imports the design system for its component primitives — and the
  83  |   // claim being tested is that the editorial surface never resolves to
  84  |   // them, which is what ADR-DS-002 actually promises.
  85  |   const resolved = await page.evaluate(() => {
  86  |     const scope = document.querySelector('[data-surface="editorial"]');
  87  |     if (!scope) {
  88  |       return null;
  89  |     }
  90  |     const style = getComputedStyle(scope);
  91  |     return {
  92  |       background: style.getPropertyValue("--background").trim(),
  93  |       primary: style.getPropertyValue("--primary").trim(),
  94  |       ring: style.getPropertyValue("--ring").trim(),
  95  |       radius: style.getPropertyValue("--radius").trim(),
  96  |     };
  97  |   });
  98  | 
  99  |   expect(resolved).not.toBeNull();
  100 |   // Re-pointed at the editorial set, not the product one.
  101 |   expect(resolved?.primary).toBe("#000000");
  102 |   expect(resolved?.ring).toBe("#ffcc00");
  103 |   expect(resolved?.background).toBe("#ffffff");
  104 |   // Square corners are identity on this surface.
  105 |   expect(resolved?.radius).toBe("0px");
  106 | });
  107 | 
```