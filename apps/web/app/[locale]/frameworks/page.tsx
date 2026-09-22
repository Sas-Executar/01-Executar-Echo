import {
  allFrameworkDomains,
  allFrameworks,
  EXPECTED_FRAMEWORK_COUNT,
} from "@repo/knowledge";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { FrameworksBrowser } from "./frameworks-browser";

export const metadata: Metadata = createMetadata({
  title: "Quick Frameworks",
  description: `${EXPECTED_FRAMEWORK_COUNT} frameworks de estratégia, produto, operações, pesquisa e engenharia — o que cada um organiza, e quando usá-lo.`,
});

/**
 * Rendered once at build time.
 *
 * This page takes no request input — the catalog is build-time constant
 * — but Next was treating it as dynamic, so every request re-serialized
 * all 299 records into the RSC payload. Measured on the deployed site,
 * that route failed roughly 1 request in 15 with a 502 or a >5s
 * response, while /mapa and the static routes were clean across the same
 * sample. Prerendering removes the per-request work entirely.
 */
export const dynamic = "force-static";

/**
 * The Quick Frameworks surface, over the catalog that ships with
 * `skills/executar-safe-frameworks` (SKILL-EXE-SF-001).
 */
const Frameworks = () => {
  const frameworks = allFrameworks();
  const domains = allFrameworkDomains();

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "var(--ed-content-max)",
        paddingInline: "var(--ed-gutter)",
        paddingBlock: "var(--ed-section)",
      }}
    >
      <header style={{ maxWidth: "var(--ed-reading-max)" }}>
        <h1
          className="font-semibold"
          style={{ fontSize: "var(--ed-display-md)", lineHeight: 1.05 }}
        >
          Quick Frameworks
        </h1>
        <p
          className="mt-5 text-[length:var(--ed-body-lg)]"
          style={{ color: "var(--ed-label-secondary)", lineHeight: 1.5 }}
        >
          {frameworks.length} frameworks em {domains.length} domínios. Um
          framework organiza evidência — ele não cria evidência. Cada ficha diz
          o que o modelo estrutura e onde ele se aplica, não o que é verdade
          sobre a sua situação.
        </p>
      </header>

      <div className="mt-12">
        <FrameworksBrowser domains={domains} frameworks={frameworks} />
      </div>
    </div>
  );
};

export default Frameworks;
